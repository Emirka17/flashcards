import sqlite3

DB_PATH = "data/cards.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
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

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS word_tags (
            word_id INTEGER,
            tag_id INTEGER,
            FOREIGN KEY (word_id) REFERENCES words (id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
            PRIMARY KEY (word_id, tag_id)
        )
    """)

    connection.commit()
    connection.close()


def add_word(word, translation, example="", tags=None):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO words (word, translation, example) VALUES (?, ?, ?)",
        (word, translation, example)
    )
    word_id = cursor.lastrowid
    connection.commit()
    connection.close()

    if tags:
        for tag in tags:
            if tag.strip():
                add_word_tag(word_id, tag.strip())


def add_word_tag(word_id, tag_name):
    tag_id = get_tag_id(tag_name)
    if not tag_id:
        add_tag(tag_name)
        tag_id = get_tag_id(tag_name)

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT OR IGNORE INTO word_tags (word_id, tag_id) VALUES (?, ?)",
        (word_id, tag_id)
    )
    connection.commit()
    connection.close()


def add_tag(name):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT OR IGNORE INTO tags (name) VALUES (?)", (name,))
        connection.commit()
    except sqlite3.IntegrityError:
        pass
    connection.close()


def get_tag_id(name):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT id FROM tags WHERE name = ?", (name,))
    row = cursor.fetchone()
    connection.close()
    return row[0] if row else None


def get_word_tags(word_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT t.name FROM tags t
        JOIN word_tags wt ON t.id = wt.tag_id
        WHERE wt.word_id = ?
    """, (word_id,))
    rows = cursor.fetchall()
    connection.close()
    return [row[0] for row in rows]


def get_all_tags():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM tags ORDER BY name")
    rows = cursor.fetchall()
    connection.close()
    return [row[0] for row in rows]


def get_words_by_tag(tag_name):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT w.id, w.word, w.translation, w.example, w.created_at
        FROM words w
        JOIN word_tags wt ON w.id = wt.word_id
        JOIN tags t ON wt.tag_id = t.id
        WHERE t.name = ?
        ORDER BY w.id DESC
    """, (tag_name,))
    rows = cursor.fetchall()
    connection.close()

    result = []
    for row in rows:
        word_id, word, translation, example, created_at = row
        tags = get_word_tags(word_id)
        result.append((word_id, word, translation, example, created_at, tags))
    return result


def get_all_words():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "SELECT id, word, translation, example, created_at FROM words ORDER BY id DESC"
    )
    rows = cursor.fetchall()
    connection.close()

    result = []
    for row in rows:
        word_id, word, translation, example, created_at = row
        tags = get_word_tags(word_id)
        result.append((word_id, word, translation, example, created_at, tags))
    return result
def get_words_for_training(tag_name):
    if tag_name == "all":
        words = get_all_words()
    else:
        words_from_db = get_words_by_tag(tag_name)
        words = []
        for row in words_from_db:
            # Распаковываем все 6 значений
            word_id, word, translation, example, created_at, tags = row
            words.append((word_id, word, translation, example, created_at, tags))
    return words