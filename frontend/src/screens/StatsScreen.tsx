import React, { useState } from 'react'
import type { Screen } from '../types'
import { DECKS } from '../data'
import { BackIcon } from '../components/icons'
// ─── Stats ────────────────────────────────────────────────────────────────────

export function StatsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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