import React, { useState } from 'react'
import { DECKS, GAMES } from '../data'
import type { Screen, Deck } from '../types'
import { BackIcon, ChevronRight} from '../components/icons'

export function GamesScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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