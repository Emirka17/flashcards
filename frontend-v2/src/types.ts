export type Screen = 'home' | 'deck' | 'study' | 'games' | 'quiz' | 'matching' | 'create' | 'stats'

export type Card = {
  id: number
  word: string
  translation: string
  transcription: string
  example: string
  learned: boolean
  level: number
}

export type Deck = {
  id: number
  name: string
  language: string
  flag: string
  cards: Card[]
  lastStudied: string
}