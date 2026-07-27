import React, { useState } from 'react'
import type { Screen, Card, Deck } from '../types'
import { BackIcon, PlusIcon } from '../components/icons'

export function DeckScreen({ deck, onNavigate, onStudy }: { deck: Deck; onNavigate: (s: Screen) => void; onStudy: (cards: Card[]) => void }) {
  const [tab, setTab] = useState<'all' | 'new' | 'learned'>('all')
  
  // Защита: если колода вдруг не передалась
  if (!deck || !deck.cards) return null

  const filtered = tab === 'all' 
    ? deck.cards 
    : tab === 'new' 
      ? deck.cards.filter(c => !c.learned) 
      : deck.cards.filter(c => c.learned)
  
  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Шапка */}
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

      {/* Основные кнопки для учебы */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { onStudy(deck.cards.filter(c => !c.learned)); onNavigate('study') }}
          className="rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform font-sans font-semibold text-sm bg-white border border-gray-200 text-gray-700 shadow-sm"
        >
          Учить новые
        </button>
        <button
          onClick={() => { onStudy(deck.cards); onNavigate('study') }}
          className="rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform font-sans font-semibold text-sm bg-white border border-gray-200 text-gray-700 shadow-sm"
        >
          Повторить все
        </button>
      </div>

      {/* Кнопка: Добавление карточек в набор */}
      <button
        onClick={() => onNavigate('create')}
        className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-colors font-sans font-medium text-sm text-gray-500 border-2 border-dashed border-gray-200 hover:bg-gray-50 focus:outline-none"
      >
        <PlusIcon /> Добавить слова
      </button>

      {/* Вкладки сортировки */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 mt-1">
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

      {/* Список слов */}
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