interface Answer {
  id?: number
  answer: { en: string; ar: string }
  points: number | null
}

export interface RateItemBase {
  is_active: boolean
  name: { en: string; ar: string }
  answers?: Answer[]
  for: 'advertiser' | 'user'
  type: 'positive' | 'negative'
  way: 'straight' | 'question'
  points?: number | null
}

export interface RateItem extends RateItemBase {
  id: number
  sort: number
}
