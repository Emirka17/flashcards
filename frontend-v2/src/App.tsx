import React, { useState, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = 'home' | 'deck' | 'study' | 'games' | 'quiz' | 'matching' | 'create' | 'stats'

type Card = {
  id: number
  word: string
  translation: string
  transcription: string
  example: string
  learned: boolean
  level: number
}

type Deck = {
  id: number
  name: string
  language: string
  flag: string
  cards: Card[]
  lastStudied: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DECKS: Deck[] = [
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

const GAMES = [
  { id: 'quiz', name: 'Тест', desc: 'Выберите правильный перевод' },
  { id: 'matching', name: 'Пары', desc: 'Соедините слово с переводом' },
  { id: 'writing', name: 'Письмо', desc: 'Введите перевод слова' },
  { id: 'listening', name: 'Аудирование', desc: 'Угадайте слово по звуку' },
  { id: 'sprint', name: 'Спринт', desc: 'Правда или ложь — быстро' },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const CardsIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
)

const GamesIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
    <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
    <circle cx="15.5" cy="10.5" r=".75" fill="currentColor" strokeWidth="0" />
    <circle cx="17.5" cy="13.5" r=".75" fill="currentColor" strokeWidth="0" />
  </svg>
)

const StatsIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

// ─── Home ─────────────────────────────────────────────────────────────────────

function HomeScreen({ onNavigate, onSelectDeck }: { onNavigate: (s: Screen) => void; onSelectDeck: (d: Deck) => void }) {
  const totalCards = DECKS.reduce((a, d) => a + d.cards.length, 0)
  const learnedCards = DECKS.reduce((a, d) => a + d.cards.filter(c => c.learned).length, 0)
  const pct = Math.round(learnedCards / totalCards * 100)

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-display font-extrabold text-gray-900 tracking-tight">Lexilize</h1>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-display font-bold text-sm">А</div>
      </div>

      {/* Progress card */}
      <div className="rounded-2xl border border-gray-100 p-5 bg-white" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Общий прогресс</p>
            <p className="text-3xl font-display font-extrabold text-gray-900">{pct}<span className="text-lg text-gray-400 font-sans font-normal">%</span></p>
          </div>
          <p className="text-sm font-sans text-gray-400">{learnedCards} / {totalCards} слов</p>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 w-full">
          <div className="h-1.5 rounded-full bg-violet-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Decks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-display font-bold text-gray-900">Наборы</h2>
          <button onClick={() => onNavigate('create')} className="flex items-center gap-1 text-violet-600 text-xs font-sans font-medium active:opacity-60">
            <PlusIcon /> Создать
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {DECKS.map(deck => {
            const dp = Math.round(deck.cards.filter(c => c.learned).length / deck.cards.length * 100)
            return (
              <button
                key={deck.id}
                onClick={() => { onSelectDeck(deck); onNavigate('deck') }}
                className="rounded-2xl p-4 flex items-center gap-4 active:scale-[0.99] transition-transform text-left w-full bg-white border border-gray-100"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <span className="text-2xl shrink-0">{deck.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-sans font-semibold text-sm truncate">{deck.name}</p>
                  <p className="text-gray-400 text-xs font-sans mt-0.5">{deck.cards.length} слов · {deck.lastStudied}</p>
                  <div className="h-1 rounded-full mt-2 bg-gray-100">
                    <div className="h-1 rounded-full bg-violet-400" style={{ width: `${dp}%` }} />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-display font-bold text-gray-700">{dp}%</p>
                  <ChevronRight />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Всего слов', value: totalCards },
          { label: 'Изучено', value: learnedCards },
          { label: 'Наборов', value: DECKS.length },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 bg-white border border-gray-100 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p className="text-xl font-display font-extrabold text-gray-900">{s.value}</p>
            <p className="text-gray-400 text-[10px] font-sans mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <button
        onClick={() => onNavigate('games')}
        className="rounded-2xl p-4 flex items-center justify-between bg-white border border-gray-100 active:scale-[0.99] transition-transform"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <div>
          <p className="text-gray-900 font-sans font-semibold text-sm">Игры для изучения</p>
          <p className="text-gray-400 text-xs font-sans mt-0.5">5 режимов практики</p>
        </div>
        <ChevronRight />
      </button>
    </div>
  )
}

// ─── Deck ─────────────────────────────────────────────────────────────────────

function DeckScreen({ deck, onNavigate, onStudy }: { deck: Deck; onNavigate: (s: Screen) => void; onStudy: (cards: Card[]) => void }) {
  const [tab, setTab] = useState<'all' | 'new' | 'learned'>('all')
  const filtered = tab === 'all' ? deck.cards : tab === 'new' ? deck.cards.filter(c => !c.learned) : deck.cards.filter(c => c.learned)

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-3 pt-1">
        <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 active:opacity-60 bg-gray-100">
          <BackIcon />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-gray-900 font-display font-bold text-lg leading-tight truncate">{deck.name}</h1>
          <p className="text-gray-400 text-xs font-sans">{deck.language} · {deck.cards.length} слов</p>
        </div>
        <span className="text-2xl shrink-0">{deck.flag}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { onStudy(deck.cards.filter(c => !c.learned)); onNavigate('study') }}
          className="rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform font-sans font-semibold text-sm bg-violet-600 text-white"
        >
          Учить новые
        </button>
        <button
          onClick={() => { onStudy(deck.cards); onNavigate('study') }}
          className="rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform font-sans font-semibold text-sm bg-white border border-gray-200 text-gray-700"
        >
          Повторить все
        </button>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
        {([['all', 'Все'], ['new', 'Новые'], ['learned', 'Изучены']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 py-2 rounded-lg text-xs font-sans font-semibold transition-all"
            style={tab === key ? { background: 'white', color: '#7C3AED', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#9CA3AF' }}
          >
            {label} {key === 'all' ? deck.cards.length : key === 'new' ? deck.cards.filter(c => !c.learned).length : deck.cards.filter(c => c.learned).length}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map(card => (
          <div key={card.id} className="rounded-2xl p-4 flex items-center gap-3 bg-white border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: card.learned ? '#22C55E' : '#E5E7EB' }} />
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-sans font-semibold text-sm">{card.word}</p>
              <p className="text-gray-400 text-xs font-sans mt-0.5 truncate">{card.translation}</p>
            </div>
            <div className="flex items-end gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-1 rounded-full" style={{ height: `${6 + i * 2}px`, background: i < card.level ? '#7C3AED' : '#E5E7EB' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Study ────────────────────────────────────────────────────────────────────

function StudyScreen({ cards, onNavigate }: { cards: Card[]; onNavigate: (s: Screen) => void }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [known, setKnown] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)

  if (!cards.length) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <p className="text-gray-900 font-display font-bold text-xl">Нечего учить</p>
      <p className="text-gray-400 text-sm font-sans">Все карточки уже изучены</p>
      <button onClick={() => onNavigate('home')} className="mt-4 px-6 py-3 rounded-2xl bg-violet-600 text-white font-sans font-semibold text-sm">На главную</button>
    </div>
  )

  const card = cards[idx]

  const nextCard = (wasKnown: boolean) => {
    if (wasKnown) setKnown(k => k + 1)
    setFlipped(false)
    setTimeout(() => {
      if (idx + 1 >= cards.length) setDone(true)
      else setIdx(i => i + 1)
    }, 150)
  }

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center">
      <h2 className="text-gray-900 font-display font-extrabold text-2xl">Готово</h2>
      <p className="text-gray-500 font-sans text-sm">Знали: <span className="text-violet-600 font-semibold">{known}</span> из {cards.length}</p>
      <div className="w-full rounded-2xl p-5 flex flex-col gap-3 bg-white border border-gray-100">
        {[
          { label: 'Правильно', value: known, color: '#22C55E' },
          { label: 'Надо повторить', value: cards.length - known, color: '#EF4444' },
          { label: 'Результат', value: `${Math.round(known / cards.length * 100)}%`, color: '#7C3AED' },
        ].map(r => (
          <div key={r.label} className="flex justify-between text-sm font-sans">
            <span className="text-gray-400">{r.label}</span>
            <span className="font-semibold" style={{ color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={() => { setIdx(0); setFlipped(false); setDone(false); setKnown(0) }} className="flex-1 py-3 rounded-2xl font-sans font-semibold text-sm bg-white border border-gray-200 text-gray-700">Снова</button>
        <button onClick={() => onNavigate('home')} className="flex-1 py-3 rounded-2xl font-sans font-semibold text-sm bg-violet-600 text-white">Домой</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-3 pt-1">
        <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 active:opacity-60 bg-gray-100">
          <BackIcon />
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-gray-100">
          <div className="h-1.5 rounded-full bg-violet-500 transition-all" style={{ width: `${((idx + 1) / cards.length) * 100}%` }} />
        </div>
        <p className="text-gray-400 text-sm font-sans shrink-0">{idx + 1}/{cards.length}</p>
      </div>

      {/* Flashcard */}
      <div
        className="cursor-pointer select-none"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
        onTouchStart={e => setStartX(e.touches[0].clientX)}
        onTouchEnd={e => {
          if (startX !== null) {
            const dx = e.changedTouches[0].clientX - startX
            if (dx > 60) nextCard(true)
            else if (dx < -60) nextCard(false)
          }
          setStartX(null)
        }}
      >
        <div style={{ position: 'relative', height: '260px', transformStyle: 'preserve-3d', transition: 'transform 0.45s ease', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 p-8 bg-white border border-gray-100"
            style={{ backfaceVisibility: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <p className="text-gray-300 text-xs font-sans tracking-widest uppercase">Нажмите для перевода</p>
            <h2 className="text-gray-900 font-display font-extrabold text-4xl text-center">{card.word}</h2>
            <p className="text-gray-400 font-sans text-base">[{card.transcription}]</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-4 p-8 bg-violet-50 border border-violet-100"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', boxShadow: '0 2px 12px rgba(124,58,237,0.08)' }}
          >
            <p className="text-violet-300 text-xs font-sans tracking-widest uppercase">Перевод</p>
            <h2 className="text-gray-900 font-display font-bold text-2xl text-center">{card.translation}</h2>
            <p className="text-gray-400 font-sans text-sm text-center italic">"{card.example}"</p>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-300 text-xs font-sans">← Не знаю &nbsp;|&nbsp; Знаю →</p>

      <div className="grid grid-cols-2 gap-3 mt-1">
        <button
          onClick={() => nextCard(false)}
          className="py-4 rounded-2xl flex items-center justify-center font-sans font-semibold text-sm active:scale-95 transition-transform bg-white border border-gray-200 text-gray-600"
        >
          Не знаю
        </button>
        <button
          onClick={() => nextCard(true)}
          className="py-4 rounded-2xl flex items-center justify-center font-sans font-semibold text-sm active:scale-95 transition-transform bg-violet-600 text-white"
        >
          Знаю
        </button>
      </div>
    </div>
  )
}

// ─── Games ────────────────────────────────────────────────────────────────────

function GamesScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-3 pt-1">
        <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 active:opacity-60 bg-gray-100">
          <BackIcon />
        </button>
        <div>
          <h1 className="text-gray-900 font-display font-bold text-xl">Игры</h1>
          <p className="text-gray-400 text-xs font-sans">Практика в игровой форме</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-white border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <p className="text-gray-400 text-xs font-sans mb-2">Набор для игры</p>
        <div className="flex items-center gap-3">
          <span className="text-xl">🇬🇧</span>
          <div>
            <p className="text-gray-900 font-sans font-semibold text-sm">Английский: Путешествия</p>
            <p className="text-gray-400 text-xs font-sans">8 слов</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => { if (game.id === 'quiz') onNavigate('quiz'); else if (game.id === 'matching') onNavigate('matching') }}
            className="rounded-2xl p-4 flex items-center gap-4 active:scale-[0.99] transition-transform text-left w-full bg-white border border-gray-100"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="flex-1">
              <p className="text-gray-900 font-sans font-semibold text-sm">{game.name}</p>
              <p className="text-gray-400 text-xs font-sans mt-0.5">{game.desc}</p>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

function QuizScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const cards = DECKS[0].cards
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const getOptions = (card: Card) => {
    const others = cards.filter(c => c.id !== card.id).sort(() => Math.random() - 0.5).slice(0, 3)
    return [...others, card].sort(() => Math.random() - 0.5)
  }

  const [options] = useState(() => cards.map(c => getOptions(c)))

  const card = cards[qIdx]
  const opts = options[qIdx]

  const handleSelect = (opt: Card) => {
    if (selected !== null) return
    setSelected(opt.id)
    if (opt.id === card.id) setScore(s => s + 1)
    setTimeout(() => {
      if (qIdx + 1 >= cards.length) setDone(true)
      else setQIdx(i => i + 1)
      setSelected(null)
    }, 900)
  }

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center">
      <h2 className="text-gray-900 font-display font-extrabold text-2xl">Тест завершён</h2>
      <p className="text-gray-900 font-display font-bold text-4xl">{score}<span className="text-gray-300 text-2xl font-sans font-normal">/{cards.length}</span></p>
      <p className="text-gray-400 font-sans text-sm">{score >= 6 ? 'Отличный результат' : score >= 4 ? 'Хороший результат' : 'Стоит поучить ещё'}</p>
      <button onClick={() => onNavigate('games')} className="mt-2 px-8 py-3 rounded-2xl bg-violet-600 text-white font-sans font-semibold text-sm">Назад</button>
    </div>
  )

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-3 pt-1">
        <button onClick={() => onNavigate('games')} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 active:opacity-60 bg-gray-100">
          <BackIcon />
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-gray-100">
          <div className="h-1.5 rounded-full bg-violet-500 transition-all" style={{ width: `${((qIdx + 1) / cards.length) * 100}%` }} />
        </div>
        <p className="text-gray-400 text-sm font-sans shrink-0">{score}/{cards.length}</p>
      </div>

      <div className="rounded-3xl p-6 flex flex-col items-center gap-3 min-h-[150px] justify-center bg-white border border-gray-100" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <p className="text-gray-300 text-xs font-sans tracking-widest uppercase">Переведите слово</p>
        <h2 className="text-gray-900 font-display font-extrabold text-3xl text-center">{card.word}</h2>
        <p className="text-gray-400 font-sans text-sm">[{card.transcription}]</p>
      </div>

      <div className="flex flex-col gap-2">
        {opts.map(opt => {
          const isCorrect = opt.id === card.id
          const isSelected = opt.id === selected
          let bg = 'white'
          let border = '#E5E7EB'
          let textColor = '#374151'
          if (selected !== null) {
            if (isCorrect) { bg = '#F0FDF4'; border = '#86EFAC'; textColor = '#15803D' }
            else if (isSelected) { bg = '#FEF2F2'; border = '#FCA5A5'; textColor = '#B91C1C' }
          }
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className="rounded-2xl p-4 text-left active:scale-[0.99] transition-all w-full font-sans font-medium text-sm"
              style={{ background: bg, border: `1px solid ${border}`, color: textColor, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
              {opt.translation}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Matching ─────────────────────────────────────────────────────────────────

function MatchingScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const cards = DECKS[0].cards.slice(0, 5)
  const [selectedWord, setSelectedWord] = useState<number | null>(null)
  const [selectedTrans, setSelectedTrans] = useState<number | null>(null)
  const [matched, setMatched] = useState<number[]>([])
  const [wrong, setWrong] = useState<number[]>([])

  const translations = useRef([...cards].sort(() => Math.random() - 0.5))

  const handleWordClick = (id: number) => {
    if (matched.includes(id)) return
    setSelectedWord(id)
    if (selectedTrans !== null && selectedTrans === id) {
      setMatched(m => [...m, id]); setSelectedWord(null); setSelectedTrans(null)
    } else if (selectedTrans !== null) {
      setWrong([id, selectedTrans])
      setTimeout(() => { setWrong([]); setSelectedWord(null); setSelectedTrans(null) }, 600)
    }
  }

  const handleTransClick = (id: number) => {
    if (matched.includes(id)) return
    setSelectedTrans(id)
    if (selectedWord !== null && selectedWord === id) {
      setMatched(m => [...m, id]); setSelectedWord(null); setSelectedTrans(null)
    } else if (selectedWord !== null) {
      setWrong([selectedWord, id])
      setTimeout(() => { setWrong([]); setSelectedWord(null); setSelectedTrans(null) }, 600)
    }
  }

  const done = matched.length === cards.length

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex items-center gap-3 pt-1">
        <button onClick={() => onNavigate('games')} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 active:opacity-60 bg-gray-100">
          <BackIcon />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 font-display font-bold text-xl">Пары</h1>
          <p className="text-gray-400 text-xs font-sans">Соедините слово с переводом</p>
        </div>
        <p className="text-violet-600 font-display font-bold text-sm">{matched.length}/{cards.length}</p>
      </div>

      {done ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <h2 className="text-gray-900 font-display font-extrabold text-2xl">Все пары найдены</h2>
          <button onClick={() => onNavigate('games')} className="mt-2 px-8 py-3 rounded-2xl bg-violet-600 text-white font-sans font-semibold text-sm">Назад</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs font-sans text-center mb-1">Слова</p>
            {cards.map(c => {
              const isMatched = matched.includes(c.id)
              const isSel = selectedWord === c.id
              const isWrong = wrong.includes(c.id)
              return (
                <button key={c.id} onClick={() => handleWordClick(c.id)} disabled={isMatched}
                  className="rounded-2xl p-3 text-sm font-sans font-semibold text-center active:scale-95 transition-all"
                  style={{
                    background: isMatched ? '#F0FDF4' : isSel ? '#F5F3FF' : isWrong ? '#FEF2F2' : 'white',
                    border: `1px solid ${isMatched ? '#86EFAC' : isSel ? '#7C3AED' : isWrong ? '#FCA5A5' : '#E5E7EB'}`,
                    color: isMatched ? '#15803D' : isSel ? '#7C3AED' : isWrong ? '#B91C1C' : '#374151',
                    opacity: isMatched ? 0.7 : 1,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >{c.word}</button>
              )
            })}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs font-sans text-center mb-1">Переводы</p>
            {translations.current.map(c => {
              const isMatched = matched.includes(c.id)
              const isSel = selectedTrans === c.id
              const isWrong = wrong.includes(c.id)
              return (
                <button key={c.id} onClick={() => handleTransClick(c.id)} disabled={isMatched}
                  className="rounded-2xl p-3 text-xs font-sans font-medium text-center active:scale-95 transition-all"
                  style={{
                    background: isMatched ? '#F0FDF4' : isSel ? '#F5F3FF' : isWrong ? '#FEF2F2' : 'white',
                    border: `1px solid ${isMatched ? '#86EFAC' : isSel ? '#7C3AED' : isWrong ? '#FCA5A5' : '#E5E7EB'}`,
                    color: isMatched ? '#15803D' : isSel ? '#7C3AED' : isWrong ? '#B91C1C' : '#6B7280',
                    opacity: isMatched ? 0.7 : 1,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >{c.translation}</button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Create ───────────────────────────────────────────────────────────────────

function CreateScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!word || !translation) return
    setSaved(true)
    setTimeout(() => { setSaved(false); setWord(''); setTranslation(''); setExample('') }, 1500)
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-3 pt-1">
        <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 active:opacity-60 bg-gray-100">
          <BackIcon />
        </button>
        <div>
          <h1 className="text-gray-900 font-display font-bold text-xl">Новая карточка</h1>
          <p className="text-gray-400 text-xs font-sans">Добавьте слово в набор</p>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-3xl p-6 flex flex-col items-center gap-2 min-h-[120px] justify-center bg-white border border-gray-100" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <h2 className="text-gray-900 font-display font-extrabold text-3xl text-center">{word || <span className="text-gray-200">Слово</span>}</h2>
        <p className="text-gray-400 font-sans text-sm">{translation || <span className="text-gray-200">Перевод</span>}</p>
      </div>

      {/* Deck selector */}
      <div className="rounded-2xl p-4 bg-white border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <p className="text-gray-400 text-xs font-sans mb-2">Набор</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇬🇧</span>
            <span className="text-gray-800 font-sans text-sm font-medium">Английский: Путешествия</span>
          </div>
          <ChevronRight />
        </div>
      </div>

      {[
        { label: 'Слово / фраза', value: word, setter: setWord, placeholder: 'Например: Serendipity' },
        { label: 'Перевод', value: translation, setter: setTranslation, placeholder: 'Например: Счастливая случайность' },
        { label: 'Пример', value: example, setter: setExample, placeholder: 'She found success through serendipity.' },
      ].map(f => (
        <div key={f.label}>
          <p className="text-gray-500 text-xs font-sans mb-1.5">{f.label}</p>
          <input
            type="text"
            value={f.value}
            onChange={e => f.setter(e.target.value)}
            placeholder={f.placeholder}
            className="w-full rounded-2xl px-4 py-3.5 font-sans text-sm text-gray-900 placeholder:text-gray-300 outline-none border border-gray-200 focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all bg-white"
          />
        </div>
      ))}

      <button className="rounded-2xl py-3 flex items-center justify-center gap-2 font-sans text-sm font-medium text-gray-500 bg-white border border-gray-200 active:scale-95 transition-transform">
        Автоперевод (DeepL)
      </button>

      <button
        onClick={handleSave}
        className="rounded-2xl py-4 font-sans font-bold text-sm active:scale-95 transition-all"
        style={{
          background: saved ? '#F0FDF4' : (!word || !translation) ? '#F3F4F6' : '#7C3AED',
          color: saved ? '#15803D' : (!word || !translation) ? '#9CA3AF' : 'white',
          border: saved ? '1px solid #86EFAC' : 'none',
        }}
      >
        {saved ? 'Сохранено' : 'Сохранить карточку'}
      </button>
    </div>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const activity = [4, 8, 6, 12, 5, 9, 7]
  const max = Math.max(...activity)

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-3 pt-1">
        <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 active:opacity-60 bg-gray-100">
          <BackIcon />
        </button>
        <div>
          <h1 className="text-gray-900 font-display font-bold text-xl">Статистика</h1>
          <p className="text-gray-400 text-xs font-sans">Ваш прогресс</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Серия дней', value: '7', unit: 'дн.', color: '#7C3AED' },
          { label: 'Изучено всего', value: '142', unit: 'сл.', color: '#7C3AED' },
          { label: 'Время занятий', value: '4.5', unit: 'ч', color: '#7C3AED' },
          { label: 'Точность в тестах', value: '78', unit: '%', color: '#7C3AED' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 bg-white border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p className="text-gray-400 text-xs font-sans">{s.label}</p>
            <p className="font-display font-extrabold text-2xl text-gray-900 mt-1">
              {s.value}<span className="text-sm text-gray-400 font-sans font-normal"> {s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl p-5 bg-white border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <p className="text-gray-800 font-sans font-semibold text-sm mb-5">Слов за неделю</p>
        <div className="flex items-end gap-2 h-24">
          {activity.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-lg" style={{ height: `${(v / max) * 72}px`, background: i === 6 ? '#7C3AED' : '#EDE9FE' }} />
              <p className="text-gray-400 text-[10px] font-sans">{days[i]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-deck */}
      <div className="rounded-2xl p-5 bg-white border border-gray-100 flex flex-col gap-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <p className="text-gray-800 font-sans font-semibold text-sm">Прогресс по наборам</p>
        {DECKS.map(deck => {
          const pct = Math.round(deck.cards.filter(c => c.learned).length / deck.cards.length * 100)
          return (
            <div key={deck.id}>
              <div className="flex justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{deck.flag}</span>
                  <p className="text-gray-700 font-sans text-xs font-medium">{deck.name}</p>
                </div>
                <p className="text-gray-400 font-sans text-xs">{pct}%</p>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100">
                <div className="h-1.5 rounded-full bg-violet-400" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Achievements */}
      <div className="rounded-2xl p-5 bg-white border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <p className="text-gray-800 font-sans font-semibold text-sm mb-4">Достижения</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '7 дней', unlocked: true },
            { label: '100 слов', unlocked: true },
            { label: '3 языка', unlocked: false },
            { label: 'Спринт', unlocked: false },
          ].map(a => (
            <div key={a.label} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: a.unlocked ? '#F5F3FF' : '#F9FAFB', border: `1px solid ${a.unlocked ? '#DDD6FE' : '#E5E7EB'}` }}>
                <div className="w-4 h-4 rounded-full" style={{ background: a.unlocked ? '#7C3AED' : '#D1D5DB' }} />
              </div>
              <p className="text-gray-400 text-[10px] font-sans text-center">{a.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_TABS: { id: Screen; label: string; icon: (a: boolean) => React.ReactNode }[] = [
  { id: 'home', label: 'Главная', icon: a => <HomeIcon active={a} /> },
  { id: 'deck', label: 'Карточки', icon: a => <CardsIcon active={a} /> },
  { id: 'games', label: 'Игры', icon: a => <GamesIcon active={a} /> },
  { id: 'stats', label: 'Статистика', icon: a => <StatsIcon active={a} /> },
]

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedDeck, setSelectedDeck] = useState<Deck>(DECKS[0])
  const [studyCards, setStudyCards] = useState<Card[]>(DECKS[0].cards.filter(c => !c.learned))

  const activeTab = (() => {
    if (['home', 'games', 'stats'].includes(screen)) return screen
    if (screen === 'deck') return 'home'
    if (screen === 'study') return 'deck'
    if (screen === 'quiz' || screen === 'matching') return 'games'
    if (screen === 'create') return 'home'
    return 'home'
  })()

  const handleNavTab = (id: Screen) => {
    if (id === 'deck') { setSelectedDeck(DECKS[0]); setScreen('deck') }
    else setScreen(id)
  }

    return (
    <div className="h-[100dvh] bg-gray-100 flex justify-center font-sans">
      {/* App Container */}
      <div className="w-full max-w-md bg-white h-[100dvh] flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Content (Сами экраны) */}
        <div className="flex-1 overflow-y-auto px-5 pt-12 pb-6" style={{ scrollbarWidth: 'none' }}>
          {screen === 'home' && <HomeScreen onNavigate={setScreen} onSelectDeck={setSelectedDeck} />}
          {screen === 'deck' && <DeckScreen deck={selectedDeck} onNavigate={setScreen} onStudy={setStudyCards} />}
          {screen === 'study' && <StudyScreen cards={studyCards} onNavigate={setScreen} />}
          {screen === 'games' && <GamesScreen onNavigate={setScreen} />}
          {screen === 'quiz' && <QuizScreen onNavigate={setScreen} />}
          {screen === 'matching' && <MatchingScreen onNavigate={setScreen} />}
          {screen === 'create' && <CreateScreen onNavigate={setScreen} />}
          {screen === 'stats' && <StatsScreen onNavigate={setScreen} />}
        </div>

        {/* Bottom nav (В стиле Duolingo) */}
        <div
          className="shrink-0 flex items-center justify-around px-4 pt-3 pb-8 bg-white border-t-2 border-gray-200 sticky bottom-0 z-50"
        >
          {NAV_TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleNavTab(tab.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all active:scale-95 ${
                  isActive ? 'text-violet-500' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {/* Иконка */}
                <div className={`${isActive ? 'scale-110 drop-shadow-md' : 'scale-100'} transition-transform duration-200`}>
                  {tab.icon(isActive)}
                </div>
                {/* Текст под иконкой */}
                <span className={`text-[11px] font-sans font-bold tracking-wide ${isActive ? 'text-violet-500' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
          
          {/* Плавающая 3D-кнопка добавления */}
          <button
            onClick={() => setScreen('create')}
            className="absolute right-4 -top-6 w-14 h-14 rounded-full flex items-center justify-center text-white active:translate-y-1 transition-transform"
            style={{ 
              background: '#7C3AED', 
              boxShadow: '0 4px 0 #5B21B6, 0 8px 16px rgba(124,58,237,0.3)', // Тень в стиле Duolingo (солидная краска внизу)
              border: '2px solid #ffffff'
            }}
          >
            <PlusIcon />
          </button>
        </div>

      </div>
    </div>
  )
}