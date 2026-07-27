// ─── Data ─────────────────────────────────────────────────────────────────────
import type { Deck } from './types'

export const DECKS: Deck[] = [
  {
    id: 1,
    name: 'Английский: Путешествия',
    language: 'English',
    flag: '🇬🇧',
    lastStudied: 'Сегодня',
    cards: [
      { id: 1, word: 'Wanderlust', translation: 'Страсть к путешествиям', transcription: 'ˈwɒndəlʌst', example: 'Her wanderlust took her to 40 countries.', learned: true, level: 4 },
      { id: 2, word: 'Itinerary', translation: 'Маршрут, план поездки', transcription: 'aɪˈtɪnərəri', example: 'Please send me the itinerary for the trip.', learned: true, level: 3 },
      { id: 3, word: 'Layover', translation: 'Пересадка', transcription: 'ˈleɪoʊvər', example: 'We have a 3-hour layover in Dubai.', learned: false, level: 1 },
      { id: 4, word: 'Customs', translation: 'Таможня', transcription: 'ˈkʌstəmz', example: "Don't forget to declare items at customs.", learned: false, level: 2 },
      { id: 5, word: 'Boarding pass', translation: 'Посадочный талон', transcription: 'ˈbɔːrdɪŋ pæs', example: 'Show your boarding pass at the gate.', learned: true, level: 5 },
      { id: 6, word: 'Turbulence', translation: 'Турбулентность', transcription: 'ˈtɜːrbjʊləns', example: 'The pilot warned about turbulence ahead.', learned: false, level: 0 },
      { id: 7, word: 'Visa', translation: 'Виза', transcription: 'ˈviːzə', example: 'You need a visa to enter that country.', learned: true, level: 4 },
      { id: 8, word: 'Passport', translation: 'Паспорт', transcription: 'ˈpæspɔːrt', example: 'Your passport expires next month.', learned: true, level: 5 },
    ],
  },
  {
    id: 2,
    name: 'Немецкий: Базовый',
    language: 'Deutsch',
    flag: '🇩🇪',
    lastStudied: 'Вчера',
    cards: [
      { id: 9, word: 'Schadenfreude', translation: 'Злорадство', transcription: 'ˈʃaːdənˌfrɔɪdə', example: 'He felt a sense of Schadenfreude.', learned: false, level: 1 },
      { id: 10, word: 'Weltanschauung', translation: 'Мировоззрение', transcription: 'ˈvɛltʔanˌʃaʊʊŋ', example: 'His Weltanschauung changed after the war.', learned: false, level: 0 },
      { id: 11, word: 'Gemütlichkeit', translation: 'Уют, душевность', transcription: 'ɡəˈmyːtlɪçkaɪt', example: 'The café had a warm Gemütlichkeit.', learned: true, level: 3 },
      { id: 12, word: 'Fernweh', translation: 'Тяга к странствиям', transcription: 'ˈfɛrnˌveː', example: 'Fernweh kept him booking flights.', learned: false, level: 2 },
      { id: 13, word: 'Doppelgänger', translation: 'Двойник', transcription: 'ˈdɔpəlˌɡɛŋər', example: 'He met his Doppelgänger at a party.', learned: true, level: 4 },
    ],
  },
  {
    id: 3,
    name: 'Испанский: Еда',
    language: 'Español',
    flag: '🇪🇸',
    lastStudied: '3 дня назад',
    cards: [
      { id: 14, word: 'Sobremesa', translation: 'Время за столом после еды', transcription: 'soˈβɾemesa', example: 'The sobremesa lasted two hours.', learned: false, level: 0 },
      { id: 15, word: 'Madrugada', translation: 'Ранние утренние часы', transcription: 'maðɾuˈɣaða', example: 'He arrived in the madrugada.', learned: false, level: 1 },
      { id: 16, word: 'Estrenar', translation: 'Использовать впервые', transcription: 'estɾeˈnaɾ', example: 'She wore shoes she was estrenar-ing.', learned: true, level: 3 },
    ],
  },
]

export const GAMES = [
  { id: 'quiz', name: 'Тест', desc: 'Выберите правильный перевод' },
  { id: 'matching', name: 'Пары', desc: 'Соедините слово с переводом' },
  { id: 'writing', name: 'Письмо', desc: 'Введите перевод слова' },
  { id: 'listening', name: 'Аудирование', desc: 'Угадайте слово по звуку' },
  { id: 'sprint', name: 'Спринт', desc: 'Правда или ложь — быстро' },
]
