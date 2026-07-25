import os
import pytest
import sqlite3
import db

TEST_DB_PATH = "data/test_cards.db"

@pytest.fixture(autouse=True)
def setup_database(monkeypatch):
    # Подменяем путь к базе в модуле db на тестовый
    monkeypatch.setattr(db, "DB_PATH", TEST_DB_PATH)
    
    # Создаем таблицы в тестовой базе
    db.init_db()
    
    yield # Здесь выполняются сами тесты
    
    # После теста удаляем тестовую базу очищая состояние
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)

def test_add_and_get_word():
    # Добавляем слово
    db.add_word("cat", "кот", "The cat sleeps", [])
    
    words = db.get_all_words()
    assert len(words) == 1
    
    word_id, word, translation, example, created_at, tags = words[0]
    assert word == "cat"
    assert translation == "кот"
    assert example == "The cat sleeps"
    assert tags == []

def test_tags_logic():
    # Добавляем слова с тегами
    db.add_word("dog", "собака", "", ["animal", "pet"])
    db.add_word("apple", "яблоко", "", ["food"])
    
    # Проверка получения всех тегов
    all_tags = db.get_all_tags()
    assert len(all_tags) == 3
    assert "animal" in all_tags
    assert "food" in all_tags
    
    # Проверка фильтрации
    animal_words = db.get_words_by_tag("animal")
    assert len(animal_words) == 1
    assert animal_words[0][1] == "dog" # Индекс 1 это слово (word)