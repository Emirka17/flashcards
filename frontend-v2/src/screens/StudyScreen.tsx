import React, { useState } from 'react'
import type { Screen, Card } from '../types'
import { BackIcon } from '../components/icons'

export function StudyScreen({ cards, onNavigate }: { cards: Card[]; onNavigate: (s: Screen) => void }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [known, setKnown] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)

  // Защита: если передали пустой массив
  if (!cards || !cards.length) return (
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
           // Защита от деления на 0 в результатах
          { label: 'Правильно', value: known, color: '#22C55E' },
          { label: 'Надо повторить', value: cards.length - known, color: '#EF4444' },
          { label: 'Результат', value: `${cards.length > 0 ? Math.round(known / cards.length * 100) : 0}%`, color: '#7C3AED' },
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

      {/* Flashcard 3D */}
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