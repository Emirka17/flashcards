import streamlit as st
import db

db.init_db()

st.title("Тренажёр карточек")

st.header("Добавить слово")

with st.form("add_word_form", clear_on_submit=True):
    word = st.text_input("Слово")
    translation = st.text_input("Перевод")
    example = st.text_area("Пример")
    tags_input = st.text_input("Теги (через запятую)")
    submitted = st.form_submit_button("Добавить")

    if submitted:
        if word and translation:
            tags = [t.strip() for t in tags_input.split(",")] if tags_input else []
            db.add_word(word, translation, example, tags)
            st.success("Слово добавлено")
        else:
            st.error("Заполните слово и перевод")

st.header("Фильтр по тегу")
all_tags = db.get_all_tags()
selected_tag = st.selectbox("Выберите тег", [""] + all_tags)

st.header("Мои слова")

if selected_tag:
    words = db.get_words_by_tag(selected_tag)
else:
    words = db.get_all_words()

if not words:
    st.info("Нет слов")
else:
    for row in words:
        word_id, word, translation, example, created_at, tags = row
        tag_badges = " ".join([f"#{tag}" for tag in tags]) if tags else ""
        with st.expander(f"{word} — {translation}"):
            if example:
                st.write(f"Пример: {example}")
            st.caption(f"Добавлено: {created_at}")
            if tags:
                st.caption(f"Теги: {tag_badges}")

st.header("Тренировка")

training_tag = st.selectbox("Выберите тег для тренировки", ["all"] + db.get_all_tags())

if st.button("Начать тренировку"):
    words = db.get_words_for_training(training_tag)
    if not words:
        st.info("Нет слов для тренировки")
    else:
        st.session_state.word_queue = words.copy()
        st.session_state.current_word = None
        st.session_state.show_translation = False

if st.button("Выйти из тренировки"):
    if "word_queue" in st.session_state:
        del st.session_state.word_queue
    if "current_word" in st.session_state:
        del st.session_state.current_word
    if "show_translation" in st.session_state:
        del st.session_state.show_translation
    st.rerun()

# Логика тренировки
if "word_queue" in st.session_state and st.session_state.word_queue:
    if "current_word" not in st.session_state or st.session_state.current_word is None:
        st.session_state.current_word = st.session_state.word_queue[0]
        st.session_state.show_translation = False

    word_id, word, translation, example, created_at, tags = st.session_state.current_word

    if st.session_state.show_translation:
        st.subheader(word)
        st.write(f"**Перевод:** {translation}")
        if example:
            st.write(f"**Пример:** {example}")
        if st.button("Далее"):
            st.session_state.word_queue.pop(0)
            st.session_state.current_word = None
            st.rerun()
    else:
        st.subheader(word)
        col1, col2, col3 = st.columns(3)
        if col1.button("Yes"):
            st.session_state.word_queue.pop(0)
            st.session_state.current_word = None
            st.rerun()
        if col2.button("No"):
            st.session_state.current_word = None
            st.rerun()
        if col3.button("Показать перевод"):
            st.session_state.show_translation = True
            st.rerun()
else:
    if "word_queue" in st.session_state:
        st.info("Тренировка завершена. Нажмите 'Начать тренировку' для повтора.")