import sqlite3

# Путь к файлу базы данных
DB_PATH = "data/cards.db"


def get_connection():
    """Открывает соединение с базой данных."""
    connection = sqlite3.connect(DB_PATH)
    return connection


def init_db():
    """Создаёт таблицу words, если её ещё нет."""
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL,
            translation TEXT NOT NULL,
            example TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


def add_word(word, translation, example=""):
    """Добавляет новое слово в базу."""
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO words (word, translation, example) VALUES (?, ?, ?)",
        (word, translation, example)
    )

    connection.commit()
    connection.close()


def get_all_words():
    """Возвращает все слова из базы."""
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT id, word, translation, example, created_at FROM words ORDER BY id DESC")
    rows = cursor.fetchall()

    connection.close()
    return rows