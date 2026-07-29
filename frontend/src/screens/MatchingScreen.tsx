import React, { useState,useRef } from 'react'
import type { Screen, Card, Deck } from '../types'
import { DECKS } from '../data'
import { BackIcon } from '../components/icons'
// ─── Matching ─────────────────────────────────────────────────────────────────

export function MatchingScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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
