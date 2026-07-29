import React, { useState } from 'react'
import type { Screen, Card } from '../types'
import { DECKS } from '../data'
import { BackIcon } from '../components/icons'
// ─── Quiz ─────────────────────────────────────────────────────────────────────

export function QuizScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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