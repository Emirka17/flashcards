import requests

API_URL = "http://localhost:8080"

def init_db():
    # База уже инициализирована, создание таблиц можно перенести в Go позже.
    pass

def get_all_words():
    try:
        response = requests.get(f"{API_URL}/words")
        if response.status_code == 200:
            words = response.json()
            # Конвертируем JSON (словари) обратно в кортежи, которых ждет app.py
            return [
                (w['id'], w['word'], w['translation'], w['example'], w['created_at'], w['tags']) 
                for w in words
            ]
    except Exception as e:
        print(f"Ошибка подключения к API: {e}")
    return []

def add_word(word, translation, example="", tags=None):
    data = {
        "word": word,
        "translation": translation,
        "example": example,
        "tags": tags if tags else []
    }
    requests.post(f"{API_URL}/words", json=data)

def get_all_tags():
    words = get_all_words()
    tags_set = set()
    for row in words:
        for tag in row[5]:  # Индекс 5 - это массив tags
            tags_set.add(tag)
    return sorted(list(tags_set))

def get_words_by_tag(tag_name):
    words = get_all_words()
    return [row for row in words if tag_name in row[5]]

def get_words_for_training(tag_name):
    if tag_name == "all":
        return get_all_words()
    return get_words_by_tag(tag_name)