import streamlit as st
import db

# Создаём таблицу при запуске (если её ещё нет)
db.init_db()

# Заголовок страницы
st.title("Тренажёр карточек")

# --- Форма добавления нового слова ---
st.header("Добавить слово")

with st.form("add_word_form", clear_on_submit=True):
    word = st.text_input("Слово")
    translation = st.text_input("Перевод")
    example = st.text_area("Пример (необязательно)")

    submitted = st.form_submit_button("Добавить")

    if submitted:
        if word and translation:
            db.add_word(word, translation, example)
            st.success(f"Слово «{word}» добавлено!")
        else:
            st.error("Заполни слово и перевод")

# --- Список всех слов ---
st.header("Мои слова")

words = db.get_all_words()

if not words:
    st.info("Пока нет ни одного слова. Добавь первое!")
else:
    for row in words:
        word_id, word, translation, example, created_at = row
        with st.expander(f"{word} — {translation}"):
            if example:
                st.write(f"**Пример:** {example}")
            st.caption(f"Добавлено: {created_at}")