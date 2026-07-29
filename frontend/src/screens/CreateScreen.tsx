import React, { useState } from 'react'
import type { Screen } from '../types'
import { BackIcon, ChevronRight } from '../components/icons'
// ─── Create ───────────────────────────────────────────────────────────────────

export function CreateScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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
