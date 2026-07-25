package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"

    _ "github.com/lib/pq" // Драйвер для PostgreSQL
)

type Word struct {
    ID          int      `json:"id"`
    Word        string   `json:"word"`
    Translation string   `json:"translation"`
    Example     string   `json:"example"`
    CreatedAt   string   `json:"created_at,omitempty"`
    Tags        []string `json:"tags"`
}

var db *sql.DB

func initDB() {
    // Берем строку подключения из переменной окружения (чтобы не хранить пароль в коде)
    connStr := os.Getenv("DATABASE_URL")
    if connStr == "" {
        log.Fatal("Переменная окружения DATABASE_URL не задана")
    }

    var err error
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    
    // Проверяем, что база реально доступна
    if err = db.Ping(); err != nil {
        log.Fatal("Не удалось подключиться к БД: ", err)
    }
}

func getWordsHandler(w http.ResponseWriter, r *http.Request) {
    // Заменили IFNULL на COALESCE (стандарт Postgres)
    rows, err := db.Query("SELECT id, word, translation, COALESCE(example, ''), created_at FROM words ORDER BY id DESC")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var words []Word
    for rows.Next() {
        var w Word
        if err := rows.Scan(&w.ID, &w.Word, &w.Translation, &w.Example, &w.CreatedAt); err != nil {
            continue
        }

        // В Postgres вместо ? пишем $1
        tagRows, err := db.Query("SELECT t.name FROM tags t JOIN word_tags wt ON t.id = wt.tag_id WHERE wt.word_id = $1", w.ID)
        var tags []string
        
        if err == nil {
            for tagRows.Next() {
                var tagName string
                tagRows.Scan(&tagName)
                tags = append(tags, tagName)
            }
            tagRows.Close()
        } else {
            log.Println("Ошибка получения тегов:", err)
        }

        if tags == nil {
            tags = []string{}
        }
        w.Tags = tags

        words = append(words, w)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(words)
}

func addWordHandler(w http.ResponseWriter, r *http.Request) {
    var newWord Word
    if err := json.NewDecoder(r.Body).Decode(&newWord); err != nil {
        http.Error(w, "Неверный формат данных", http.StatusBadRequest)
        return
    }

    // В Postgres мы получаем ID через RETURNING id
    err := db.QueryRow("INSERT INTO words (word, translation, example) VALUES ($1, $2, $3) RETURNING id",
        newWord.Word, newWord.Translation, newWord.Example).Scan(&newWord.ID)
    
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    for _, tag := range newWord.Tags {
        if tag == "" {
            continue
        }
        // Заменили INSERT OR IGNORE на стандарт Postgres
        db.Exec("INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", tag)
        
        var tagID int
        db.QueryRow("SELECT id FROM tags WHERE name = $1", tag).Scan(&tagID)
        
        db.Exec("INSERT INTO word_tags (word_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", newWord.ID, tagID)
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(newWord)
}

func wordsHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodGet {
        getWordsHandler(w, r)
    } else if r.Method == http.MethodPost {
        addWordHandler(w, r)
    } else {
        http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
    }
}

func main() {
    initDB()
    defer db.Close()

    http.HandleFunc("/words", wordsHandler)

    fmt.Println("API работает на порту 8080 (Подключено к PostgreSQL)...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}