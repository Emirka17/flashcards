import pytest
from unittest.mock import patch
import db

# Фейковые данные, которые мы будем "получать" вместо реального API
FAKE_WORDS = [
    {
        "id": 1, 
        "word": "cat", 
        "translation": "кот", 
        "example": "The cat sleeps", 
        "created_at": "2024-01-01", 
        "tags": ["animal", "pet"]
    },
    {
        "id": 2, 
        "word": "apple", 
        "translation": "яблоко", 
        "example": "", 
        "created_at": "2024-01-01", 
        "tags": ["food"]
    }
]

# Создаем класс-заглушку для ответа (имитирует объект response от requests)
class MockResponse:
    def __init__(self, json_data, status_code=200):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data

# @patch перехватывает вызовы requests.get внутри db.py
@patch('db.requests.get')
def test_get_all_words(mock_get):
    # Указываем, что должен вернуть requests.get
    mock_get.return_value = MockResponse(FAKE_WORDS)
    
    words = db.get_all_words()
    
    assert len(words) == 2
    # Проверяем структуру: (id, word, translation, example, created_at, tags)
    assert words[0][1] == "cat"
    assert words[0][5] == ["animal", "pet"]
    
    # Проверяем, что запрос действительно был отправлен по правильному адресу
    mock_get.assert_called_once_with("http://localhost:8080/words")

@patch('db.requests.get')
def test_tags_logic(mock_get):
    mock_get.return_value = MockResponse(FAKE_WORDS)
    
    # Проверка извлечения уникальных тегов
    all_tags = db.get_all_tags()
    assert len(all_tags) == 3
    assert "animal" in all_tags
    assert "food" in all_tags
    
    # Проверка фильтрации
    animal_words = db.get_words_by_tag("animal")
    assert len(animal_words) == 1
    assert animal_words[0][1] == "cat"