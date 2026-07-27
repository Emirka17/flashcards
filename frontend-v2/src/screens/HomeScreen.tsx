import React from 'react'
import type { Screen, Deck } from '../types'
import { PlusIcon, ChevronRight } from '../components/icons'
import { DECKS } from '../data'

// ─── Home ─────────────────────────────────────────────────────────────────────

export function HomeScreen({ onNavigate, onSelectDeck }: { onNavigate: (s: Screen) => void; onSelectDeck: (d: Deck) => void }) {
  // Защита от пустых данных и деления на 0
  const validDecks = DECKS || []
  const totalCards = validDecks.reduce((a, d) => a + (d.cards?.length || 0), 0)
  const learnedCards = validDecks.reduce((a, d) => a + (d.cards?.filter(c => c.learned)?.length || 0), 0)
  const pct = totalCards > 0 ? Math.round((learnedCards / totalCards) * 100) : 0

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
        <div className="h-1.5 rounded-full bg-gray-100 w-full overflow-hidden">
          <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${pct}%` }} />
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
          {validDecks.map(deck => {
            const dp = deck.cards?.length > 0 ? Math.round((deck.cards.filter(c => c.learned).length / deck.cards.length) * 100) : 0
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
                  <p className="text-gray-400 text-xs font-sans mt-0.5">{deck.cards?.length || 0} слов · {deck.lastStudied}</p>
                  <div className="h-1 rounded-full mt-2 bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-violet-400" style={{ width: `${dp}%` }} />
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
          { label: 'Наборов', value: validDecks.length },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 bg-white border border-gray-100 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p className="text-xl font-display font-extrabold text-gray-900">{s.value}</p>
            <p className="text-gray-400 text-[10px] font-sans mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}