import React, { useState, useRef } from 'react'
import type { Screen, Card, Deck } from './types'
import { HomeIcon, CardsIcon, GamesIcon, StatsIcon, BackIcon, PlusIcon, ChevronRight } from './components/icons'
import { DECKS, GAMES } from './data'
import {CreateScreen,DeckScreen,GamesScreen, HomeScreen, MatchingScreen, QuizScreen, StatsScreen , StudyScreen } from './screens'

// Прямо перед function App()
fetch('http://localhost:8080/words') // Если в Go путь другой, напиши свой
  .then(res => res.json())
  .then(data => console.log('УРА! ДАННЫЕ ИЗ GO:', data))
  .catch(err => console.log('Go спит:', err))

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