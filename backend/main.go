package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"

    _ "github.com/mattn/go-sqlite3"
)

type Word struct {
    ID          int      `json:"id"`
    Word        string   `json:"word"`
    Translation string   `json:"translation"`
    Example     string   `json:"example"`
    CreatedAt   string   `json:"created_at,omitempty"`
    Tags        []string `json:"tags"` // Добавили массив тегов
}

var db *sql.DB

func initDB() {
    var err error
    db, err = sql.Open("sqlite3", "../data/cards.db")
    if err != nil {
        log.Fatal(err)
    }
}

func getWordsHandler(w http.ResponseWriter, r *http.Request) {
    rows, err := db.Query("SELECT id, word, translation, IFNULL(example, ''), created_at FROM words ORDER BY id DESC")
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

        // Получаем теги для каждого слова
        tagRows, _ := db.Query("SELECT t.name FROM tags t JOIN word_tags wt ON t.id = wt.tag_id WHERE wt.word_id = ?", w.ID)
        var tags []string
        for tagRows.Next() {
            var tagName string
            tagRows.Scan(&tagName)
            tags = append(tags, tagName)
        }
        tagRows.Close()

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

    stmt, err := db.Prepare("INSERT INTO words (word, translation, example) VALUES (?, ?, ?)")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer stmt.Close()

    res, err := stmt.Exec(newWord.Word, newWord.Translation, newWord.Example)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    id, _ := res.LastInsertId()
    newWord.ID = int(id)

    // Сохраняем теги
    for _, tag := range newWord.Tags {
        if tag == "" {
            continue
        }
        // Добавляем тег, если его нет
        db.Exec("INSERT OR IGNORE INTO tags (name) VALUES (?)", tag)
        
        // Получаем ID тега
        var tagID int
        db.QueryRow("SELECT id FROM tags WHERE name = ?", tag).Scan(&tagID)
        
        // Связываем слово и тег
        db.Exec("INSERT OR IGNORE INTO word_tags (word_id, tag_id) VALUES (?, ?)", newWord.ID, tagID)
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

    fmt.Println("API работает на порту 8080...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}