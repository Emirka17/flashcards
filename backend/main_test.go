package main

import (
    "bytes"
    "database/sql"
    "net/http"
    "net/http/httptest"
    "testing"

    _ "github.com/mattn/go-sqlite3"
)

// setupTestDB создает временную базу в оперативной памяти перед каждым тестом
func setupTestDB() {
    var err error
    // :memory: означает, что база существует только в ОЗУ
    db, err = sql.Open("sqlite3", "file::memory:?cache=shared")
    if err != nil {
        panic(err)
    }

    // Копируем схему создания таблиц для тестов
    _, err = db.Exec(`
        CREATE TABLE words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL,
            translation TEXT NOT NULL,
            example TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        );
        CREATE TABLE word_tags (
            word_id INTEGER,
            tag_id INTEGER,
            FOREIGN KEY (word_id) REFERENCES words (id),
            FOREIGN KEY (tag_id) REFERENCES tags (id),
            PRIMARY KEY (word_id, tag_id)
        );
    `)
    if err != nil {
        panic(err)
    }
}

// Тест 1: Проверка добавления слова (POST)
func TestAddWord(t *testing.T) {
    setupTestDB()
    defer db.Close() // Закрываем/удаляем временную базу после теста

    // Имитируем JSON данные от фронтенда
    payload := []byte(`{"word":"apple","translation":"яблоко","example":"eat an apple","tags":["food"]}`)
    
    // Создаем фейковый HTTP-запрос
    req, _ := http.NewRequest("POST", "/words", bytes.NewBuffer(payload))
    // Имитируем ответ сервера
    rr := httptest.NewRecorder()

    // Передаем запрос в нашу основную функцию
    wordsHandler(rr, req)

    // Проверяем, что статус ответа 201 Created
    if status := rr.Code; status != http.StatusCreated {
        t.Errorf("Ожидался статус 201, получен %v", status)
    }
}

// Тест 2: Проверка получения слов (GET)
func TestGetWords(t *testing.T) {
    setupTestDB()
    defer db.Close()

    // Добавим одно слово вручную в тестовую базу
    db.Exec("INSERT INTO words (word, translation, example) VALUES ('dog', 'собака', '')")

    req, _ := http.NewRequest("GET", "/words", nil)
    rr := httptest.NewRecorder()

    wordsHandler(rr, req)

    // Проверяем, что статус ответа 200 OK
    if status := rr.Code; status != http.StatusOK {
        t.Errorf("Ожидался статус 200, получен %v", status)
    }

    // Проверяем, что в ответе есть слово "dog"
    expectedBody := "dog"
    if !bytes.Contains(rr.Body.Bytes(), []byte(expectedBody)) {
        t.Errorf("Ожидалось тело ответа содержащее '%s', получено: %s", expectedBody, rr.Body.String())
    }
}