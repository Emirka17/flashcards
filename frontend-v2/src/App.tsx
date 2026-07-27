import React, { useState, useRef } from 'react'
import type { Screen, Card, Deck } from './types'
import { HomeIcon, CardsIcon, GamesIcon, StatsIcon, BackIcon, PlusIcon, ChevronRight } from './components/icons'
import { DECKS, GAMES } from './data'
import { HomeScreen , DeckScreen, StudyScreen} from './screens'


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
  const [studyCards, setStudyCards] = useState<Card[]>(DECKS[0]?.cards.filter(c => !c.learned) || [])

  // Та самая потерянная переменная для подсветки активной табы
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

        {/* Нижнее меню */}
        <div className="shrink-0 flex items-center justify-around px-4 pt-3 pb-8 bg-white border-t-2 border-gray-200 sticky bottom-0 z-50">
          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNavTab(tab.id)}
              className="flex flex-col items-center gap-1.5 p-2 active:scale-95 transition-all"
            >
              <div className={activeTab === tab.id ? 'text-violet-500' : 'text-gray-400'}>
                {tab.icon(activeTab === tab.id)}
              </div>
              <span className={`text-[11px] font-sans font-bold ${activeTab === tab.id ? 'text-violet-500' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}