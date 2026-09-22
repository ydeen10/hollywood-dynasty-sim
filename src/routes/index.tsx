import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowRight, Award, BarChart3, Banknote, Bell, BriefcaseBusiness, CalendarDays, ChevronRight, Clapperboard, Film, Heart, Home, MessageCircle, Menu, Newspaper, Play, Plus, Settings, Shield, Sparkles, Star, TrendingUp, Users, Wallet, X } from 'lucide-react'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'The Backlot · Hollywood Dynasty Sim' },
      { name: 'description', content: 'Build a career, make the picture, and own the story.' },
    ],
  }),
  component: BacklotGame,
})

type Screen = 'overview' | 'auditions' | 'projects' | 'production' | 'boxoffice' | 'development' | 'social' | 'career' | 'relationships' | 'finance' | 'awards' | 'calendar' | 'news' | 'talent'
type Audition = { id: string; title: string; role: string; studio: string; genre: string; pay: number; fame: number; difficulty: number; accent: string; image: string }
type AuditionSession = { item: Audition; stage: number; score: number; result?: string }
type ProductionState = { stage: 'Pre-production' | 'Filming' | 'Post-production' | 'Released'; budget: number; quality: number; marketing: number; incident?: string; released: boolean; director: string; directorSkill: number; title: string; studio: string; genre: string; role: string; sequelNumber: number }
type DevelopmentItem = { id: string; type: 'Short Film' | 'TV Series Pitch' | 'Franchise / Universe'; title: string; genre: string; hook: string; status: string; entry?: string; writerName?: string }
type TalentDiscipline = 'Director' | 'Writer' | 'Actor' | 'Producer'
type TalentPerson = { id: string; name: string; discipline: TalentDiscipline; skill: number; fame: number; salary: number; personality: string; signed: boolean; trust: number }
type RelationshipKind = 'Co-star' | 'Rival' | 'Representation' | 'Friend'
type Relationship = { id: string; name: string; role: string; kind: RelationshipKind; trust: number; avatar: string; note: string }
type AwardStatus = 'Buzz' | 'Nominated' | 'Winner' | 'Snub'
type AwardEntry = { id: string; name: string; category: string; org: string; project: string; status: AwardStatus; week: number }
type CalendarEvent = { id: string; week: number; title: string; detail: string; kind: 'Production' | 'Meeting' | 'Ceremony' | 'Personal' }
type NewsItem = { id: string; tag: string; headline: string; week: number }
type SocialComment = { author: string; text: string }
type SocialPost = { id: string; author: string; avatar: string; time: string; text: string; likes: number; liked: boolean; comments: SocialComment[] }
type BoxOfficeEntry = { id: string; title: string; studio: string; genre: string; budget: number; opening: number; worldwide: number; criticScore: number; audienceScore: number; profit: number; week: number }
type SequelOffer = { id: string; parentTitle: string; studio: string; genre: string; sequelNumber: number; pay: number }
type RivalFilm = { id: string; title: string; rival: string; studio: string; genre: string; opening: number; week: number; sequelNumber: number }

type GameState = {
  week: number
  cash: number
  fame: number
  stress: number
  energy: number
  followers: number
  posts: SocialPost[]
  production: ProductionState
  opportunities: Audition[]
  acceptedProjects: Audition[]
  development: DevelopmentItem[]
  relationships: Relationship[]
  awards: AwardEntry[]
  calendarEvents: CalendarEvent[]
  newsItems: NewsItem[]
  glassMeridianAwardSeeded: boolean
  awardedProjects: string[]
  talent: TalentPerson[]
  boxOffice: BoxOfficeEntry[]
  genreMastery: Record<string, number>
  sequelOffers: SequelOffer[]
  rivalFilms: RivalFilm[]
}

const auditionStages = [
  { name: 'Initial Audition', stat: 'Acting', prompt: 'The room goes quiet. Do you play the scene close to the page or take a dangerous emotional swing?', choices: [{ label: 'Trust the text', bonus: 2 }, { label: 'Take the swing', bonus: 5 }] },
  { name: 'Callback', stat: 'Charisma', prompt: 'The director asks you to reset. How do you make the second take feel alive?', choices: [{ label: 'Disarm the room', bonus: 4 }, { label: 'Stay intensely focused', bonus: 2 }] },
  { name: 'Chemistry Read', stat: 'Screen Presence', prompt: 'Your scene partner misses a cue. Do you protect the rhythm or steal the moment?', choices: [{ label: 'Protect the rhythm', bonus: 4 }, { label: 'Steal the moment', bonus: 3 }] },
  { name: 'Final Casting', stat: 'Networking', prompt: 'The producer offers one last question: why you, now?', choices: [{ label: 'Make the long-term case', bonus: 5 }, { label: 'Let the work speak', bonus: 3 }] },
]

const auditions: Audition[] = [
  { id: 'gm', title: 'Glass Meridian', role: 'Eli Voss · Lead', studio: 'Northstar Pictures', genre: 'Psychological Thriller', pay: 185000, fame: 14, difficulty: 72, accent: 'from-indigo-950 via-slate-900 to-amber-950', image: 'GM' },
  { id: 'lo', title: 'The Last Orchard', role: 'Young Tomas · Supporting', studio: 'Morrow House', genre: 'Historical Drama', pay: 42000, fame: 7, difficulty: 48, accent: 'from-emerald-950 via-stone-900 to-amber-950', image: 'LO' },
  { id: 'ns', title: 'Neon Saints', role: 'Jax · Recurring', studio: 'Vela Stream', genre: 'Streaming Series', pay: 68000, fame: 11, difficulty: 61, accent: 'from-fuchsia-950 via-purple-950 to-blue-950', image: 'NS' },
]

const opportunityBank: { title: string; role: string; studio: string; genre: string; accent: string; image: string }[] = [
  { title: 'Marrow Line', role: 'Detective Ionescu · Lead', studio: 'Northstar Pictures', genre: 'Crime Thriller', accent: 'from-slate-950 via-zinc-900 to-red-950', image: 'ML' },
  { title: 'Paper Moths', role: 'Elior · Supporting', studio: 'Morrow House', genre: 'Coming-of-age Drama', accent: 'from-amber-950 via-stone-900 to-emerald-950', image: 'PM' },
  { title: 'Static Horizon', role: 'Commander Vale · Lead', studio: 'SilverGate', genre: 'Science Fiction', accent: 'from-blue-950 via-slate-900 to-indigo-950', image: 'SH' },
  { title: 'Hollow Choir', role: 'Sister Agnes · Supporting', studio: 'Vela Stream', genre: 'Horror', accent: 'from-purple-950 via-stone-900 to-neutral-950', image: 'HC' },
  { title: 'The Understudy', role: 'Nova Reyes · Recurring', studio: 'Morrow House', genre: 'Streaming Drama', accent: 'from-rose-950 via-stone-900 to-amber-950', image: 'TU' },
  { title: 'Ashfall County', role: 'Deputy Marsh · Lead', studio: 'Northstar Pictures', genre: 'Neo-Western', accent: 'from-orange-950 via-stone-900 to-neutral-950', image: 'AC' },
  { title: 'Blue Static', role: 'Reyna Cole · Lead', studio: 'SilverGate', genre: 'Cyber Thriller', accent: 'from-cyan-950 via-slate-900 to-indigo-950', image: 'BS' },
]

function generateOpportunity(): Audition {
  const template = opportunityBank[Math.floor(Math.random() * opportunityBank.length)]
  const difficulty = 35 + Math.floor(Math.random() * 50)
  const pay = Math.round((30000 + difficulty * 2200 + Math.random() * 40000) / 1000) * 1000
  const fame = 5 + Math.round(difficulty / 8)
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...template, pay, fame, difficulty }
}

const navItems: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'overview', label: 'The Backlot', icon: Home },
  { id: 'auditions', label: 'Opportunities', icon: BriefcaseBusiness },
  { id: 'projects', label: 'Projects', icon: Film },
  { id: 'production', label: 'Production file', icon: Clapperboard },
  { id: 'boxoffice', label: 'Box Office', icon: BarChart3 },
  { id: 'development', label: 'Development', icon: Plus },
  { id: 'talent', label: 'Talent', icon: Users },
  { id: 'social', label: 'Social', icon: MessageCircle },
  { id: 'career', label: 'Career', icon: TrendingUp },
]

const lifeNavItems: { id: Screen; label: string; icon: typeof Heart }[] = [
  { id: 'relationships', label: 'Relationships', icon: Heart },
  { id: 'finance', label: 'Finance', icon: Banknote },
  { id: 'awards', label: 'Awards', icon: Award },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'news', label: 'News', icon: Newspaper },
]


const defaultGameState: GameState = {
  week: 14,
  cash: 18400,
  fame: 18,
  stress: 31,
  energy: 72,
  followers: 4200,
  posts: [
    { id: 'seed-1', author: 'Alex Mercer', avatar: 'AM', time: '3h ago', text: 'Late night rehearsal. The city looks different after midnight.', likes: 24, liked: false, comments: [] },
    { id: 'seed-2', author: 'Mira Chen', avatar: 'MC', time: '2h ago', text: 'Table read went long today. Good long, though.', likes: 86, liked: false, comments: [{ author: 'a fan', text: 'Can already tell this cast has something.' }] },
  ],
  production: { stage: 'Pre-production', budget: 18400000, quality: 68, marketing: 4200000, released: false, director: 'Juno Vale', directorSkill: 68, title: 'Glass Meridian', studio: 'Northstar Pictures', genre: 'Psychological Thriller', role: 'Eli Voss', sequelNumber: 1 },
  opportunities: auditions,
  acceptedProjects: [],
  development: [],
  talent: [
    { id: 'juno', name: 'Juno Vale', discipline: 'Director', skill: 68, fame: 54, salary: 0, personality: 'Meticulous', signed: true, trust: 58 },
    { id: 'sable', name: 'Sable Rourke', discipline: 'Director', skill: 81, fame: 62, salary: 420000, personality: 'Visionary, expensive', signed: false, trust: 0 },
    { id: 'theo', name: 'Theo Marsh', discipline: 'Director', skill: 47, fame: 21, salary: 90000, personality: 'Hungry, unproven', signed: false, trust: 0 },
    { id: 'noor', name: 'Noor Al-Sayed', discipline: 'Writer', skill: 74, fame: 38, salary: 140000, personality: 'Sharp dialogue, slow drafts', signed: false, trust: 0 },
    { id: 'cass', name: 'Cass Ibarra', discipline: 'Writer', skill: 59, fame: 29, salary: 65000, personality: 'Fast, commercial instincts', signed: false, trust: 0 },
    { id: 'levi', name: 'Levi Okafor', discipline: 'Producer', skill: 70, fame: 45, salary: 110000, personality: 'Budget hawk', signed: false, trust: 0 },
  ],
  relationships: [
    { id: 'mira', name: 'Mira Chen', role: 'Co-lead, Glass Meridian', kind: 'Co-star', trust: 62, avatar: 'MC', note: 'Sharp, generous scene partner. Keeps asking if you\u2019re coming to the read-through.' },
    { id: 'jordan', name: 'Jordan Ashford', role: 'Rising lead at Morrow House', kind: 'Rival', trust: 18, avatar: 'JA', note: 'Chasing the same rooms you are. Charming in public, colder in private.' },
    { id: 'priya', name: 'Priya Kapoor', role: 'Prospective manager', kind: 'Representation', trust: 40, avatar: 'PK', note: 'Wants a meeting. Could open real doors — or just another promise.' },
    { id: 'dev', name: 'Dev Whitfield', role: 'Your agent', kind: 'Representation', trust: 71, avatar: 'DW', note: 'The one call that always gets picked up. Has opinions about your next move.' },
  ],
  awards: [
    { id: 'seed-award', name: 'Short film "Aftercare"', category: 'Festival Longlist', org: 'Silver City Independent Festival', project: 'Aftercare', status: 'Buzz', week: 12 },
  ],
  calendarEvents: [
    { id: 'seed-event-1', week: 14, title: 'Glass Meridian — read-through', detail: 'Northstar Pictures offices, 7:00 PM Friday.', kind: 'Production' },
    { id: 'seed-event-2', week: 15, title: 'Meeting with Priya Kapoor', detail: 'She wants to talk representation.', kind: 'Meeting' },
  ],
  newsItems: [
    { id: 'seed-news-1', tag: 'INDUSTRY WIRE', headline: 'SilverGate moves its untitled space epic to the summer window.', week: 14 },
    { id: 'seed-news-2', tag: 'THE DAILY FRAME', headline: 'Mira Solano signs a first-look deal with Morrow House.', week: 14 },
    { id: 'seed-news-3', tag: 'BACKLOT BUZZ', headline: 'Vela Stream announces a surprise renewal for \u201cBlue Hour.\u201d', week: 14 },
  ],
  glassMeridianAwardSeeded: false,
  awardedProjects: [],
  boxOffice: [],
  genreMastery: {},
  sequelOffers: [],
  rivalFilms: [
    { id: 'rival-seed-1', title: 'Skyline Vendetta', rival: 'Jordan Ashford', studio: 'Morrow House', genre: 'Action Thriller', opening: 21000000, week: 10, sequelNumber: 1 },
  ],
}

const SLOT_COUNT = 3
const LAST_SLOT_KEY = 'backlot-last-slot'
const slotKey = (slot: number) => `backlot-save-slot-${slot}`

function mergeSaved(saved: Partial<GameState>): GameState {
  return { ...defaultGameState, ...saved, production: { ...defaultGameState.production, ...(saved.production ?? {}) } }
}
function readSlot(slot: number): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(slotKey(slot))
    if (!raw) return null
    return mergeSaved(JSON.parse(raw))
  } catch {
    return null
  }
}
function writeSlot(slot: number, state: GameState) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(slotKey(slot), JSON.stringify(state)) } catch { /* storage unavailable */ }
}
function deleteSlot(slot: number) {
  if (typeof window === 'undefined') return
  try { window.localStorage.removeItem(slotKey(slot)) } catch { /* storage unavailable */ }
}
function readLastSlot(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(LAST_SLOT_KEY)
    return raw ? Number(raw) : null
  } catch {
    return null
  }
}
function writeLastSlot(slot: number) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(LAST_SLOT_KEY, String(slot)) } catch { /* storage unavailable */ }
}

function money(value: number) { return value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${Math.round(value / 1000)}K` }

function BacklotGame() {
  const [view, setView] = useState<'title' | 'game'>('title')
  const [currentSlot, setCurrentSlot] = useState<number | null>(null)
  const [screen, setScreen] = useState<Screen>('overview')
  const [game, setGame] = useState<GameState>(defaultGameState)
  const [toast, setToast] = useState('')
  const [selected, setSelected] = useState<AuditionSession | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [showCreator, setShowCreator] = useState(false)

  useEffect(() => {
    if (view === 'game' && currentSlot !== null) writeSlot(currentSlot, game)
  }, [game, view, currentSlot])

  const enterGame = (slot: number, data: GameState) => {
    setCurrentSlot(slot)
    setGame(data)
    setScreen('overview')
    setView('game')
  }
  const exitToTitle = () => { setView('title') }

  const update = (patch: Partial<GameState> | ((g: GameState) => Partial<GameState>)) => {
    setGame((g) => ({ ...g, ...(typeof patch === 'function' ? patch(g) : patch) }))
  }
  const addNews = (tag: string, headline: string) => {
    update((g) => ({ newsItems: [{ id: `${Date.now()}-${Math.random()}`, tag, headline, week: g.week }, ...g.newsItems].slice(0, 24) }))
  }
  const addEvent = (title: string, detail: string, kind: CalendarEvent['kind']) => {
    update((g) => ({ calendarEvents: [{ id: `${Date.now()}-${Math.random()}`, week: g.week, title, detail, kind }, ...g.calendarEvents].slice(0, 24) }))
  }

  const date = useMemo(() => `MARCH ${String(game.week + 4).padStart(2, '0')}, 2025`, [game.week])
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const advance = () => {
    update((g) => ({ week: g.week + 1, energy: Math.max(18, g.energy - 7), stress: Math.min(92, g.stress + 5) }))
    const unsigned = game.talent.filter((t) => !t.signed)
    if (unsigned.length > 0 && Math.random() < 0.15) {
      const target = unsigned[Math.floor(Math.random() * unsigned.length)]
      update((g) => ({ talent: g.talent.filter((t) => t.id !== target.id) }))
      addNews('TALENT WIRE', `${target.name} signs with a rival studio before you made a move.`)
    }
    update((g) => {
      if (g.opportunities.length >= 3) {
        if (Math.random() < 0.25) {
          const stale = g.opportunities[Math.floor(Math.random() * g.opportunities.length)]
          return { opportunities: [...g.opportunities.filter((o) => o.id !== stale.id), generateOpportunity()] }
        }
        return {}
      }
      const filled = [...g.opportunities]
      while (filled.length < 3) filled.push(generateOpportunity())
      return { opportunities: filled }
    })
    if (Math.random() < 0.12) {
      const lastRival = game.rivalFilms[0]
      const opening = Math.round((lastRival?.opening ?? 15000000) * (0.7 + Math.random() * 0.9))
      const rivalFilm: RivalFilm = { id: `${Date.now()}-rival`, title: `${lastRival?.title.replace(/ (II|III|IV|V|VI)$/, '') ?? 'Skyline Vendetta'} ${['II', 'III', 'IV', 'V'][Math.min((lastRival?.sequelNumber ?? 1) - 1, 3)]}`, rival: lastRival?.rival ?? 'Jordan Ashford', studio: lastRival?.studio ?? 'Morrow House', genre: lastRival?.genre ?? 'Action Thriller', opening, week: game.week + 1, sequelNumber: (lastRival?.sequelNumber ?? 1) + 1 }
      update((g) => ({ rivalFilms: [rivalFilm, ...g.rivalFilms] }))
      addNews('RIVAL WIRE', `${rivalFilm.rival}'s ${rivalFilm.title} opens to ${money(opening)}.`)
      const myLast = game.boxOffice[0]
      if (myLast && Math.abs(myLast.week - (game.week + 1)) <= 2) {
        addNews('BOX OFFICE RACE', opening >= myLast.opening ? `${rivalFilm.rival} takes the #1 opening this week, ahead of ${myLast.title}.` : `${myLast.title} holds the #1 opening, edging out ${rivalFilm.rival}'s ${rivalFilm.title}.`)
      }
    }
    notify('A new week begins. The industry keeps moving.')
  }
  const rest = () => { update((g) => ({ energy: Math.min(100, g.energy + 20), stress: Math.max(0, g.stress - 12) })); notify('You took a quiet week. Energy restored, momentum protected.') }

  const audition = (item: Audition) => { setSelected({ item, stage: 0, score: 0 }); update((g) => ({ cash: Math.max(0, g.cash - 80) })); notify(`Audition booked for ${item.title}. Your reel is in.`) }
  const resolveOpportunity = (item: Audition) => {
    update((g) => {
      const remaining = g.opportunities.filter((o) => o.id !== item.id)
      return { opportunities: remaining.length < 3 ? [...remaining, generateOpportunity()] : remaining }
    })
  }
  const auditionBeat = (bonus: number) => {
    if (!selected) return
    const statBase = ({ Acting: 42, Charisma: 58, 'Screen Presence': 36, Networking: 29 } as Record<string, number>)[auditionStages[selected.stage].stat] ?? 0
    const roll = Math.floor(Math.random() * 21) - 10
    const stageScore = statBase + bonus + roll - selected.item.difficulty / 2
    const nextScore = selected.score + stageScore
    if (stageScore < -8) { resolveOpportunity(selected.item); setSelected({ ...selected, result: selected.stage === 0 ? 'rejected' : 'asked to audition again' }); return }
    if (selected.stage === auditionStages.length - 1) {
      const accepted = nextScore > 48
      const alternate = !accepted && nextScore > 25
      const result = accepted ? 'accepted' : alternate ? 'offered a different role' : 'shortlisted'
      if (accepted || alternate) {
        const payout = alternate ? Math.round(selected.item.pay * 0.55) : selected.item.pay
        const fameGain = alternate ? 3 : selected.item.fame
        update((g) => ({
          cash: g.cash + payout,
          fame: g.fame + fameGain,
          stress: Math.min(100, g.stress + 12),
          acceptedProjects: g.acceptedProjects.some((p) => p.title === selected.item.title) ? g.acceptedProjects : [selected.item, ...g.acceptedProjects],
        }))
        addNews('CASTING WIRE', `${selected.item.title} locks its cast: Alex Mercer joins ${selected.item.studio}'s ${selected.item.genre.toLowerCase()}.`)
        addEvent(`${selected.item.title} — principal photography`, `${selected.item.studio} · begins within the month`, 'Production')
      }
      resolveOpportunity(selected.item)
      setSelected({ ...selected, score: nextScore, result })
      return
    }
    setSelected({ ...selected, score: nextScore, stage: selected.stage + 1 })
    notify(`${auditionStages[selected.stage].name} cleared. Next: ${auditionStages[selected.stage + 1].name}.`)
  }
  const closeAudition = () => { if (selected?.result) { setSelected(null); setScreen('projects') } else setSelected(null) }

  const decision = (kind: 'protect' | 'push' | 'mediate') => {
    const delta = kind === 'protect' ? 7 : kind === 'push' ? -4 : 3
    const incident = kind === 'protect' ? 'You protected the schedule and the cast trusts you.' : kind === 'push' ? 'A demanding reset raised the quality, but the crew is tired.' : 'You found a compromise before the disagreement became a headline.'
    update((g) => ({ production: { ...g.production, quality: Math.max(20, Math.min(100, g.production.quality + delta)), budget: g.production.budget + (kind === 'push' ? 680000 : 220000), incident } }))
    notify('Production decision recorded. Quality, cost, and relationships shifted.')
  }
  const advanceStage = () => {
    if (game.production.stage === 'Pre-production') {
      update((g) => ({ production: { ...g.production, stage: 'Filming' } }))
      addEvent(`${game.production.title} — filming begins`, 'Six-week shoot on location in Silver City.', 'Production')
    } else if (game.production.stage === 'Filming') {
      update((g) => ({ production: { ...g.production, stage: 'Post-production' } }))
      addEvent(`${game.production.title} — into the edit`, `${game.production.director} locks the first cut.`, 'Production')
    } else if (game.production.stage === 'Post-production') {
      const { budget, quality, marketing, title, studio, genre, sequelNumber } = game.production
      const mastery = game.genreMastery[genre] ?? 0
      const opening = Math.round(budget * (quality / 100) * (1 + marketing / 10000000) * (1 + mastery / 400) * (0.45 + Math.random() * 1.1))
      const worldwide = Math.round(opening * 2.6)
      const profit = worldwide - budget - marketing
      const criticScore = Math.max(12, Math.min(99, Math.round(quality * 0.9 + (Math.random() * 20 - 10))))
      const audienceScore = Math.max(12, Math.min(99, Math.round(quality * 0.8 + (Math.random() * 24 - 12))))
      update((g) => ({
        production: { ...g.production, stage: 'Released', released: true, incident: `Opening weekend ${money(opening)} · ${profit >= 0 ? 'profit' : 'loss'} ${money(Math.abs(profit))}` },
        cash: g.cash + profit,
        fame: g.fame + Math.round(quality / 15),
        boxOffice: [{ id: `${Date.now()}`, title, studio, genre, budget, opening, worldwide, criticScore, audienceScore, profit, week: g.week }, ...g.boxOffice],
        genreMastery: { ...g.genreMastery, [genre]: mastery + 8 },
      }))
      notify(`${title} released. ${profit >= 0 ? 'A hit is born.' : 'The numbers are painful.'}`)
      addNews('BOX OFFICE', `${title} opens to ${money(opening)}. ${profit >= 0 ? `${studio} calls it a win.` : 'Industry watchers call the numbers rough.'}`)
      const lastRival = game.rivalFilms[0]
      if (lastRival && Math.abs(lastRival.week - game.week) <= 2) {
        addNews('BOX OFFICE RACE', opening >= lastRival.opening ? `${title} edges out ${lastRival.rival}'s ${lastRival.title} for the week's #1 opening.` : `${lastRival.rival}'s ${lastRival.title} holds off ${title} for the week's #1 opening.`)
      }
      if (quality >= 70 && !game.awardedProjects.includes(title)) {
        update((g) => ({
          awardedProjects: [...g.awardedProjects, title],
          awards: [{ id: `${Date.now()}`, name: 'Best Ensemble', category: 'Ensemble', org: 'Silver Globe Awards', project: title, status: 'Nominated', week: g.week }, ...g.awards],
        }))
        addNews('AWARDS WATCH', `${title} earns early awards buzz following its opening weekend.`)
      }
      if (profit >= 0) {
        const suffixes = ['', 'II', 'III', 'IV', 'V', 'VI']
        const parentTitle = title.replace(/ (II|III|IV|V|VI)$/, '')
        const pay = Math.round(worldwide * 0.12 * (1 + 0.35 * sequelNumber))
        update((g) => g.sequelOffers.some((s) => s.parentTitle === parentTitle) ? {} : ({
          sequelOffers: [{ id: `${Date.now()}-seq`, parentTitle, studio, genre, sequelNumber: sequelNumber + 1, pay }, ...g.sequelOffers],
        }))
        addNews('DEAL MEMO', `${studio} wants to talk about ${parentTitle} ${suffixes[Math.min(sequelNumber, suffixes.length - 1)]}.`.replace('  ', ' '))
        addEvent(`Sequel talks — ${parentTitle}`, `${studio} is ready to make an offer.`, 'Meeting')
      }
    } else notify('The release is already in the news cycle.')
  }
  const acceptSequelOffer = (id: string) => {
    const offer = game.sequelOffers.find((o) => o.id === id)
    if (!offer) return
    if (!game.production.released) { notify('Finish your current production before starting a sequel.'); return }
    const suffixes = ['', 'II', 'III', 'IV', 'V', 'VI']
    const newTitle = `${offer.parentTitle} ${suffixes[Math.min(offer.sequelNumber - 1, suffixes.length - 1)]}`.trim()
    update((g) => ({
      cash: g.cash + offer.pay,
      sequelOffers: g.sequelOffers.filter((o) => o.id !== id),
      production: { stage: 'Pre-production', budget: Math.round(g.production.budget * 1.4), quality: Math.max(30, Math.min(95, g.production.quality + Math.round(Math.random() * 10 - 3))), marketing: Math.round(g.production.marketing * 1.3), released: false, director: g.production.director, directorSkill: g.production.directorSkill, title: newTitle, studio: offer.studio, genre: offer.genre, role: g.production.role, sequelNumber: offer.sequelNumber },
    }))
    addNews('GREENLIT', `${newTitle} is officially in pre-production at ${offer.studio}.`)
    addEvent(`${newTitle} greenlit`, `Advance fee ${money(offer.pay)} paid on signing.`, 'Production')
    notify(`${newTitle} is greenlit. Pre-production begins.`)
  }
  const declineSequelOffer = (id: string) => {
    const offer = game.sequelOffers.find((o) => o.id === id)
    update((g) => ({ sequelOffers: g.sequelOffers.filter((o) => o.id !== id) }))
    if (offer) notify(`You passed on ${offer.parentTitle} ${offer.sequelNumber > 1 ? '' : ''}. The studio will find someone else.`)
  }

  const publishPost = () => {
    if (!newPost.trim()) return
    const text = newPost.trim()
    const id = `${Date.now()}`
    update((g) => ({
      posts: [{ id, author: 'Alex Mercer', avatar: 'AM', time: 'now', text, likes: Math.floor(Math.random() * 12) + 3, liked: false, comments: [] }, ...g.posts],
      followers: g.followers + Math.floor(Math.random() * 40) + 10,
      fame: g.fame + 1,
    }))
    setNewPost('')
    notify('Post published. Your audience is listening.')
    window.setTimeout(() => {
      const replies = ['This scene lives in my head now.', 'Need this movie immediately.', 'The dedication is showing.', 'Silver City is lucky to have you.']
      const reply = replies[Math.floor(Math.random() * replies.length)]
      update((g) => ({ posts: g.posts.map((p) => p.id === id ? { ...p, comments: [...p.comments, { author: 'a fan', text: reply }] } : p) }))
    }, 2200)
  }
  const toggleLike = (id: string) => {
    update((g) => ({ posts: g.posts.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p) }))
  }

  const reachOut = (id: string) => {
    const person = game.relationships.find((r) => r.id === id)
    update((g) => ({ energy: Math.max(0, g.energy - 5), relationships: g.relationships.map((r) => r.id === id ? { ...r, trust: Math.min(100, r.trust + 4) } : r) }))
    if (person) notify(`You reached out to ${person.name}. Trust is building.`)
  }
  const meetUp = (id: string) => {
    const person = game.relationships.find((r) => r.id === id)
    update((g) => ({ energy: Math.max(0, g.energy - 10), cash: Math.max(0, g.cash - 40), relationships: g.relationships.map((r) => r.id === id ? { ...r, trust: Math.min(100, r.trust + 9) } : r) }))
    if (person) { notify(`Coffee with ${person.name}. The relationship deepens.`); addEvent(`Coffee with ${person.name}`, person.kind === 'Representation' ? 'Discussing your next move.' : 'Catching up between calls.', 'Meeting') }
  }
  const keepDistance = (id: string) => {
    const person = game.relationships.find((r) => r.id === id)
    update((g) => ({ stress: Math.max(0, g.stress - 3), relationships: g.relationships.map((r) => r.id === id ? { ...r, trust: Math.max(0, r.trust - 3) } : r) }))
    if (person) notify(`You kept your distance from ${person.name}.`)
  }

  const hireTalent = (id: string) => {
    const person = game.talent.find((t) => t.id === id)
    if (!person || person.signed) return
    if (game.cash < person.salary) { notify(`You can't cover ${person.name}'s fee yet.`); return }
    update((g) => ({ cash: g.cash - person.salary, talent: g.talent.map((t) => t.id === id ? { ...t, signed: true, trust: 50 } : t) }))
    addNews('TALENT WIRE', `Alex Mercer's team signs ${person.name} (${person.discipline}).`)
    addEvent(`Signed ${person.name}`, `${person.discipline} · ${money(person.salary)} deal`, 'Meeting')
    notify(`${person.name} is signed and ready to work.`)
  }
  const checkInTalent = (id: string) => {
    const person = game.talent.find((t) => t.id === id)
    update((g) => ({ energy: Math.max(0, g.energy - 5), talent: g.talent.map((t) => t.id === id ? { ...t, trust: Math.min(100, t.trust + 5) } : t) }))
    if (person) notify(`You checked in with ${person.name}. Trust is building.`)
  }
  const assignDirector = (id: string) => {
    const person = game.talent.find((t) => t.id === id && t.signed && t.discipline === 'Director')
    if (!person) return
    if (game.production.released) { notify(`${game.production.title} has already been released.`); return }
    const delta = Math.round((person.skill - game.production.directorSkill) / 4)
    update((g) => ({ production: { ...g.production, director: person.name, directorSkill: person.skill, quality: Math.max(20, Math.min(100, g.production.quality + delta)) } }))
    addEvent(`${person.name} takes over ${game.production.title}`, delta >= 0 ? 'The picture just got more ambitious.' : 'A cheaper, riskier choice at the helm.', 'Production')
    notify(`${person.name} is now directing ${game.production.title}.`)
  }
  const assignWriter = (id: string, developmentId: string) => {
    const person = game.talent.find((t) => t.id === id && t.signed && t.discipline === 'Writer')
    if (!person) return
    update((g) => ({ development: g.development.map((d) => d.id === developmentId ? { ...d, writerName: person.name } : d) }))
    notify(`${person.name} attached as writer.`)
  }

  if (view === 'title') return <TitleScreen onEnter={enterGame} />

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl lg:px-8">
        <div className="flex items-center gap-3"><button className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground"><Clapperboard className="h-4 w-4" /></div><div><p className="font-serif text-lg font-semibold tracking-tight">The Backlot</p><p className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:block">A living industry simulation</p></div></div></div>
        <div className="flex items-center gap-3 sm:gap-5"><div className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground sm:flex"><CalendarDays className="h-3.5 w-3.5 text-primary" /> WEEK {String(game.week).padStart(2, '0')} · {date}</div><div className="hidden h-5 w-px bg-border sm:block" /><div className="flex items-center gap-1.5"><button onClick={rest} className="rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">Rest</button><button onClick={advance} className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:scale-[1.02]">Advance week <ChevronRight className="h-3.5 w-3.5" /></button></div><div className="hidden h-5 w-px bg-border md:block" /><button className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:flex" onClick={() => notify('No new messages.')}><Bell className="h-4 w-4" /> <span className="relative"><span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-primary" />Inbox</span></button><div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/50 bg-accent font-serif text-sm">AM</div></div>
      </header>
      <div className="mx-auto flex max-w-[1600px]">
        <aside className={`${mobileNav ? 'fixed inset-y-16 left-0 z-20 flex' : 'hidden'} w-64 shrink-0 flex-col border-r border-border/70 bg-sidebar lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)]`}>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
            <nav className="space-y-1">{navItems.map((item) => <button key={item.id} onClick={() => { setScreen(item.id); setMobileNav(false) }} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-all ${screen === item.id ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}><item.icon className="h-4 w-4" />{item.label}{item.id === 'auditions' && <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 font-mono text-[9px] text-primary-foreground">{game.opportunities.length}</span>}</button>)}</nav>
            <div className="my-6 h-px bg-border" />
            <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Your life</p>
            <nav className="space-y-1">{lifeNavItems.map((item) => <button key={item.id} onClick={() => { setScreen(item.id); setMobileNav(false) }} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-all ${screen === item.id ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}><item.icon className="h-4 w-4" />{item.label}{item.id === 'relationships' && <Heart className="ml-auto h-3.5 w-3.5" />}</button>)}</nav>
          </div>
          <div className="border-t border-border p-4"><button onClick={() => notify('Settings saved automatically.')} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><Settings className="h-4 w-4" />Settings</button><button onClick={exitToTitle} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"><Home className="h-4 w-4" />Title screen</button><div className="mt-3 flex items-center gap-3 rounded-md bg-accent/50 p-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-serif text-sm text-primary">AM</div><div className="min-w-0"><p className="truncate text-sm font-medium">Alex Mercer</p><p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Unknown · Silver City</p></div></div></div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">
            {screen === 'overview' && <Overview fame={game.fame} cash={game.cash} energy={game.energy} stress={game.stress} week={game.week} newsItems={game.newsItems} sequelOffers={game.sequelOffers} advance={advance} rest={rest} setScreen={setScreen} notify={notify} />}
            {screen === 'auditions' && <Auditions opportunities={game.opportunities} audition={audition} />}
            {screen === 'projects' && <Projects notify={notify} setScreen={setScreen} production={game.production} acceptedProjects={game.acceptedProjects} sequelOffers={game.sequelOffers} acceptSequelOffer={acceptSequelOffer} declineSequelOffer={declineSequelOffer} />}
            {screen === 'production' && <Production production={game.production} decision={decision} advanceStage={advanceStage} setScreen={setScreen} />}
            {screen === 'boxoffice' && <BoxOffice entries={game.boxOffice} genreMastery={game.genreMastery} rivalFilms={game.rivalFilms} />}
            {screen === 'development' && <Development development={game.development} setDevelopment={(items) => update({ development: items })} showCreator={showCreator} setShowCreator={setShowCreator} notify={notify} addNews={addNews} addEvent={addEvent} talent={game.talent} assignWriter={assignWriter} />}
            {screen === 'talent' && <Talent talent={game.talent} cash={game.cash} production={game.production} hireTalent={hireTalent} checkInTalent={checkInTalent} assignDirector={assignDirector} />}
            {screen === 'social' && <Social posts={game.posts} followers={game.followers} newPost={newPost} setNewPost={setNewPost} publish={publishPost} toggleLike={toggleLike} />}
            {screen === 'career' && <Career fame={game.fame} cash={game.cash} relationships={game.relationships} setScreen={setScreen} />}
            {screen === 'relationships' && <Relationships relationships={game.relationships} reachOut={reachOut} meetUp={meetUp} keepDistance={keepDistance} />}
            {screen === 'finance' && <Finance cash={game.cash} production={game.production} acceptedProjects={game.acceptedProjects} />}
            {screen === 'awards' && <Awards awards={game.awards} />}
            {screen === 'calendar' && <CalendarPage events={game.calendarEvents} week={game.week} />}
            {screen === 'news' && <NewsPage newsItems={game.newsItems} />}
          </div>
        </main>
      </div>
      {selected && <AuditionModal session={selected} close={closeAudition} beat={auditionBeat} />}
      {toast && <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-primary/30 bg-card px-4 py-3 text-sm shadow-lg"><Sparkles className="h-4 w-4 text-primary" />{toast}</div>}
    </div>
  )
}

function TitleScreen({ onEnter }: { onEnter: (slot: number, data: GameState) => void }) {
  const [slots, setSlots] = useState<(GameState | null)[]>(() => Array.from({ length: SLOT_COUNT }, (_, i) => readSlot(i)))
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [lastSlot] = useState<number | null>(() => readLastSlot())
  const refresh = () => setSlots(Array.from({ length: SLOT_COUNT }, (_, i) => readSlot(i)))
  const startNew = (slot: number) => {
    const fresh: GameState = JSON.parse(JSON.stringify(defaultGameState))
    writeSlot(slot, fresh)
    writeLastSlot(slot)
    onEnter(slot, fresh)
  }
  const loadSlot = (slot: number) => {
    const data = readSlot(slot)
    if (!data) return
    writeLastSlot(slot)
    onEnter(slot, data)
  }
  const doDelete = (slot: number) => {
    deleteSlot(slot)
    setConfirmDelete(null)
    refresh()
  }
  const continueData = lastSlot !== null ? slots[lastSlot] : null
  return <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
    <div className="mb-10 flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-sm bg-primary text-primary-foreground"><Clapperboard className="h-7 w-7" /></div>
      <h1 className="font-serif text-5xl tracking-tight">The Backlot</h1>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">A living industry simulation</p>
    </div>
    {continueData && lastSlot !== null && <button onClick={() => loadSlot(lastSlot)} className="mb-10 flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]">Continue · Week {continueData.week} <ArrowRight className="h-4 w-4" /></button>}
    <div className="w-full max-w-3xl">
      <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Save slots</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {slots.map((data, i) => <div key={i} className="rounded-xl border border-border/80 bg-card p-5">
          <p className="font-mono text-[9px] uppercase tracking-wider text-primary">Slot {i + 1}</p>
          {data ? <>
            <p className="mt-2 font-serif text-lg">Alex Mercer</p>
            <p className="mt-1 text-xs text-muted-foreground">Week {data.week} · {money(data.cash)}</p>
            <div className="mt-4 flex flex-col gap-2">
              <button onClick={() => loadSlot(i)} className="rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground">Play</button>
              {confirmDelete === i ? <div className="flex gap-2"><button onClick={() => doDelete(i)} className="flex-1 rounded-md border border-destructive/50 py-2 text-xs text-destructive">Confirm delete</button><button onClick={() => setConfirmDelete(null)} className="flex-1 rounded-md border border-border py-2 text-xs text-muted-foreground">Cancel</button></div> : <button onClick={() => setConfirmDelete(i)} className="rounded-md border border-border py-2 text-xs text-muted-foreground hover:border-destructive/50 hover:text-destructive">Delete save</button>}
            </div>
          </> : <>
            <p className="mt-2 text-sm text-muted-foreground">Empty slot</p>
            <button onClick={() => startNew(i)} className="mt-4 w-full rounded-md border border-primary/50 py-2 text-xs text-primary hover:bg-primary/5">Start new game</button>
          </>}
        </div>)}
      </div>
    </div>
  </div>
}

function SectionTitle({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) { return <div className="mb-6 flex items-end justify-between gap-4"><div><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{eyebrow}</p><h1 className="font-serif text-3xl tracking-tight sm:text-4xl">{title}</h1></div>{detail && <p className="hidden max-w-xs text-right text-sm leading-6 text-muted-foreground md:block">{detail}</p>}</div> }
function StatCard({ label, value, note, icon: Icon, progress }: { label: string; value: string; note: string; icon: typeof Wallet; progress?: number }) { return <div className="rounded-lg border border-border/80 bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5"><div className="mb-4 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span><Icon className="h-4 w-4 text-primary/80" /></div><p className="font-serif text-2xl">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p>{progress !== undefined && <div className="mt-4 h-1 overflow-hidden rounded-full bg-accent"><div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} /></div>}</div> }

function Overview({ fame, cash, energy, stress, week, newsItems, sequelOffers, advance, rest, setScreen, notify }: { fame: number; cash: number; energy: number; stress: number; week: number; newsItems: NewsItem[]; sequelOffers: SequelOffer[]; advance: () => void; rest: () => void; setScreen: (s: Screen) => void; notify: (s: string) => void }) {
  return <><SectionTitle eyebrow="Monday morning · Silver City" title="Your story is still unwritten." detail="The Backlot is a living simulation. Every week is a choice between momentum, craft, and the people who remember how you made them feel." /><div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatCard label="Cash on hand" value={money(cash)} note="After rent + representation" icon={Wallet} /><StatCard label="Industry heat" value={`${fame}/100`} note="People are starting to remember you" icon={TrendingUp} progress={fame} /><StatCard label="Energy" value={`${energy}%`} note={energy < 40 ? 'You need a reset' : 'Ready for a full week'} icon={Activity} progress={energy} /><StatCard label="Public image" value={stress < 50 ? 'Promising' : 'Volatile'} note="Your choices shape the headline" icon={Star} /></div><div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-md"><div className="relative min-h-[310px] overflow-hidden bg-gradient-to-br from-stone-950 via-[#17131a] to-[#322314] p-6 sm:p-8"><div className="absolute -right-10 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" /><div className="relative flex h-full min-h-[245px] flex-col justify-between"><div className="flex items-center justify-between"><span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary">Active chapter · 01</span><span className="font-mono text-[10px] text-muted-foreground">WEEK {week}</span></div><div><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">The first break</p><h2 className="max-w-lg font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl">A room full of people who could change everything.</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Your agent has three opportunities waiting. None of them are safe. That is why they matter.</p></div></div></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 p-4"><button onClick={() => setScreen('auditions')} className="group flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]">Review opportunities <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button><p className="text-xs text-muted-foreground">Use the week controls in the header to move time forward.</p></div></div>
    <div className="rounded-xl border border-border/80 bg-card p-5"><div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Signal</p><h3 className="mt-1 font-serif text-xl">The city is talking</h3></div><Newspaper className="h-5 w-5 text-muted-foreground" /></div><div className="space-y-4">{newsItems.slice(0, 3).map((n) => <button key={n.id} onClick={() => notify(n.headline)} className="block w-full border-b border-border/60 pb-4 text-left last:border-0 last:pb-0"><p className="font-mono text-[9px] tracking-[0.18em] text-primary">{n.tag} <span className="ml-2 text-muted-foreground">Week {n.week}</span></p><p className="mt-1 text-sm leading-5 text-foreground/90">{n.headline}</p></button>)}</div><button onClick={() => setScreen('news')} className="mt-5 text-xs text-muted-foreground hover:text-primary">Open industry wire <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div>
  </div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sequelOffers.length > 0 && <MiniCard icon={Sparkles} title="A sequel offer is waiting" text={`${sequelOffers[0].studio} wants to talk about ${sequelOffers[0].parentTitle}.`} action={() => setScreen('projects')} />}<MiniCard icon={MessageCircle} title="Mira sent a message" text="\u201cYou still coming to the read-through?\u201d" action={() => { notify('You replied: On my way.'); setScreen('relationships') }} /><MiniCard icon={Award} title="Awards watch" text="Your short film is on the festival longlist." action={() => setScreen('awards')} /><MiniCard icon={Shield} title="Your representation" text="A new manager wants a meeting." action={() => setScreen('relationships')} /></div></>
}
function MiniCard({ icon: Icon, title, text, action }: { icon: typeof MessageCircle; title: string; text: string; action: () => void }) { return <button onClick={action} className="rounded-lg border border-border/80 bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40"><Icon className="mb-3 h-4 w-4 text-primary" /><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></button> }

function Auditions({ opportunities, audition }: { opportunities: Audition[]; audition: (a: Audition) => void }) { return <><SectionTitle eyebrow="Casting desk" title="Open opportunities" detail="Every role is a bet on the person you are becoming. Pick the room, not just the paycheck." /><div className="mb-5 flex flex-wrap gap-2"><span className="rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground">All opportunities · {opportunities.length}</span>{['Film', 'Television', 'Voice'].map((x) => <button key={x} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground">{x}</button>)}</div>{opportunities.length === 0 ? <div className="rounded-xl border border-dashed border-border bg-accent/20 p-10 text-center"><BriefcaseBusiness className="mx-auto mb-4 h-6 w-6 text-primary" /><h2 className="font-serif text-2xl">Nothing on the desk this week.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Advance the week and your agent will find something.</p></div> : <div className="grid gap-4 lg:grid-cols-3">{opportunities.map((item) => <article key={item.id} className="group overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40"><div className={`flex h-40 flex-col justify-between bg-gradient-to-br ${item.accent} p-5`}><div className="flex justify-between"><span className="rounded border border-foreground/20 bg-background/20 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-foreground/70">{item.genre}</span><span className="font-mono text-xs text-primary">{item.image}</span></div><p className="font-serif text-2xl text-foreground">{item.title}</p></div><div className="p-5"><div className="mb-5"><p className="text-sm font-medium">{item.role}</p><p className="mt-1 text-xs text-muted-foreground">{item.studio} · 6 week commitment</p></div><div className="grid grid-cols-3 gap-3 border-y border-border/70 py-3"><div><p className="font-mono text-[9px] uppercase text-muted-foreground">Pay</p><p className="mt-1 text-sm text-primary">{money(item.pay)}</p></div><div><p className="font-mono text-[9px] uppercase text-muted-foreground">Heat</p><p className="mt-1 text-sm">+{item.fame}</p></div><div><p className="font-mono text-[9px] uppercase text-muted-foreground">Odds</p><p className="mt-1 text-sm">{item.difficulty}%</p></div></div><button onClick={() => audition(item)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02]">Prepare audition <ArrowRight className="h-4 w-4" /></button></div></article>)}</div>}</> }

function Projects({ notify, setScreen, production, acceptedProjects, sequelOffers, acceptSequelOffer, declineSequelOffer }: { notify: (s: string) => void; setScreen: (s: Screen) => void; production: ProductionState; acceptedProjects: Audition[]; sequelOffers: SequelOffer[]; acceptSequelOffer: (id: string) => void; declineSequelOffer: (id: string) => void }) { return <><SectionTitle eyebrow="Your filmography" title="Projects in motion" detail="A career is built in the edit: one brave credit, one strange collaboration, one story at a time." /><div className="space-y-5"><div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]"><div className="rounded-xl border border-border/80 bg-card p-5"><div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{production.released ? 'Most recent release' : 'In production'}</p><h2 className="mt-1 font-serif text-2xl">{production.title}</h2></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">{production.stage}</span></div><div className="mb-6 h-2 overflow-hidden rounded-full bg-accent"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${production.stage === 'Pre-production' ? 34 : production.stage === 'Filming' ? 62 : production.stage === 'Post-production' ? 84 : 100}%` }} /></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Director', production.director], ['Role', production.role], ['Budget', money(production.budget)], ['Quality', `${production.quality}/100`]].map(([a, b]) => <div key={a}><p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{a}</p><p className="mt-1 text-sm">{b}</p></div>)}</div><button onClick={() => setScreen('production')} className="mt-6 rounded-md border border-border px-4 py-2 text-sm hover:border-primary/50 hover:text-primary">Open production file <ArrowRight className="ml-2 inline h-4 w-4" /></button></div><div className="rounded-xl border border-dashed border-border bg-accent/20 p-5"><Plus className="mb-5 h-5 w-5 text-primary" /><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Creator mode</p><h2 className="mt-2 max-w-xs font-serif text-2xl">Make something only you could make.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Develop a short, pitch a series, or start the first page of your own franchise.</p><button onClick={() => setScreen('development')} className="mt-6 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Open development slate</button></div></div>{sequelOffers.length > 0 && <div className="rounded-xl border border-primary/30 bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Sequel offers</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{sequelOffers.map((offer) => <div key={offer.id} className="rounded-md bg-accent/40 p-4"><p className="font-serif text-xl">{offer.parentTitle} {['', 'II', 'III', 'IV', 'V', 'VI'][Math.min(offer.sequelNumber - 1, 5)]}</p><p className="mt-1 text-xs text-muted-foreground">{offer.studio} · {offer.genre}</p><p className="mt-2 font-mono text-sm text-primary">{money(offer.pay)} advance</p><div className="mt-3 flex gap-2"><button onClick={() => acceptSequelOffer(offer.id)} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Accept</button><button onClick={() => declineSequelOffer(offer.id)} className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50">Pass</button></div></div>)}</div></div>}{acceptedProjects.length > 0 && <div className="rounded-xl border border-border/80 bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Newly booked</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{acceptedProjects.map((item) => <div key={item.title} className="rounded-md bg-accent/40 p-4"><p className="font-serif text-xl">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.role} · {money(item.pay)} contract</p><button onClick={() => notify(`${item.title} contract: 6 weeks, principal photography begins next month.`)} className="mt-3 text-xs text-primary">Review contract <ArrowRight className="ml-1 inline h-3 w-3" /></button></div>)}</div></div>}</div></> }

function Social({ posts, followers, newPost, setNewPost, publish, toggleLike }: { posts: SocialPost[]; followers: number; newPost: string; setNewPost: (v: string) => void; publish: () => void; toggleLike: (id: string) => void }) {
  const trending = ['#GlassMeridian', '#SilverCityScene', '#BacklotBuzz', '#TakeTheRoom']
  return <><SectionTitle eyebrow="Public image" title="The conversation" detail="The industry sees the work. The audience sees everything around it." /><div className="mb-5 flex items-baseline gap-2 text-xs text-muted-foreground"><span className="font-mono text-lg text-primary">{followers.toLocaleString()}</span> followers</div><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><div className="space-y-5"><div className="rounded-xl border border-border/80 bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Compose</p><textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="What do you want the city to know?" className="mt-4 min-h-32 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" /><div className="flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">A post can build loyalty — or become tomorrow's headline.</span><button onClick={publish} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Post</button></div></div><div className="rounded-xl border border-border/80 bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Trending in Silver City</p><div className="mt-3 flex flex-wrap gap-2">{trending.map((tag) => <span key={tag} className="rounded-full bg-accent px-3 py-1.5 text-xs text-muted-foreground">{tag}</span>)}</div></div></div><div className="space-y-3">{posts.map((post) => <div key={post.id} className="rounded-xl border border-border/80 bg-card p-5"><div className="mb-3 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-serif text-sm text-primary">{post.avatar}</div><div><p className="text-sm font-medium">{post.author}</p><p className="font-mono text-[9px] text-muted-foreground">{post.time} · Silver City</p></div></div><p className="text-sm leading-6">{post.text}</p><div className="mt-4 flex items-center gap-5 text-xs text-muted-foreground"><button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 transition-colors hover:text-primary ${post.liked ? 'text-primary' : ''}`}><Heart className={`h-3.5 w-3.5 ${post.liked ? 'fill-current' : ''}`} /> {post.likes}</button><span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> {post.comments.length}</span><span>↗ Share</span></div>{post.comments.length > 0 && <div className="mt-4 space-y-2 border-t border-border/60 pt-3">{post.comments.map((c, i) => <p key={i} className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{c.author}</span> {c.text}</p>)}</div>}</div>)}</div></div></>
}

function Career({ fame, cash, relationships, setScreen }: { fame: number; cash: number; relationships: Relationship[]; setScreen: (s: Screen) => void }) {
  const rivals = relationships.filter((r) => r.kind === 'Rival').length
  const contacts = relationships.filter((r) => r.kind !== 'Rival').length
  return <><SectionTitle eyebrow="Career dossier" title="Alex Mercer" detail="A small beginning, measured honestly. The people who last are the ones who keep choosing the harder story." /><div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><div className="rounded-xl border border-border/80 bg-card p-6"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/50 bg-primary/10 font-serif text-2xl text-primary">AM</div><div><p className="font-serif text-2xl">Unknown, for now.</p><p className="text-sm text-muted-foreground">Actor · Silver City · Age 24</p></div></div><div className="mt-7 space-y-4">{[['Acting', 42], ['Charisma', 58], ['Screen presence', 36], ['Networking', 29], ['Adaptability', 51]].map(([label, value]) => <div key={label}><div className="mb-1.5 flex justify-between text-xs"><span>{label}</span><span className="font-mono text-muted-foreground">{value}/100</span></div><div className="h-1.5 rounded-full bg-accent"><div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></div></div>)}</div></div><div className="space-y-5"><div className="rounded-xl border border-border/80 bg-card p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-serif text-2xl">Your trajectory</h2><span className="font-mono text-xs text-primary">RISING</span></div><div className="flex h-44 items-end gap-2 border-b border-l border-border px-4 pb-0 pt-4">{[12, 17, 16, 26, 22, 34, fame, fame + 7].map((height, i) => <div key={i} className="group relative flex flex-1 items-end"><div className="w-full rounded-t-sm bg-primary/70 transition-all group-hover:bg-primary" style={{ height: `${Math.min(100, height)}%` }} /></div>)}</div><div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground"><span>Jan</span><span>Now</span><span>Next</span></div></div><div className="grid gap-3 sm:grid-cols-2"><MiniCard icon={Banknote} title="Financial snapshot" text={`${money(cash)} liquid · no debt · building runway`} action={() => setScreen('finance')} /><MiniCard icon={Users} title="Your circle" text={`${contacts} warm contact${contacts === 1 ? '' : 's'} · ${rivals} rival${rivals === 1 ? '' : 's'}`} action={() => setScreen('relationships')} /></div></div></div></> }

function Relationships({ relationships, reachOut, meetUp, keepDistance }: { relationships: Relationship[]; reachOut: (id: string) => void; meetUp: (id: string) => void; keepDistance: (id: string) => void }) {
  return <><SectionTitle eyebrow="Your circle" title="Relationships" detail="Careers are built in rooms. Who you trust — and who trusts you — decides which rooms open next." /><div className="grid gap-4 sm:grid-cols-2">{relationships.map((person) => <div key={person.id} className="rounded-xl border border-border/80 bg-card p-5"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-serif text-sm text-primary">{person.avatar}</div><div><p className="text-sm font-medium">{person.name}</p><p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{person.kind} · {person.role}</p></div></div><p className="mt-4 text-sm leading-6 text-muted-foreground">{person.note}</p><div className="mt-4"><div className="mb-1.5 flex justify-between text-xs"><span>Trust</span><span className="font-mono text-muted-foreground">{person.trust}/100</span></div><div className="h-1.5 rounded-full bg-accent"><div className="h-full rounded-full bg-primary" style={{ width: `${person.trust}%` }} /></div></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => reachOut(person.id)} className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/50">Reach out</button><button onClick={() => meetUp(person.id)} className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/50">Grab coffee</button><button onClick={() => keepDistance(person.id)} className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50">Keep distance</button></div></div>)}</div></>
}

function Talent({ talent, cash, production, hireTalent, checkInTalent, assignDirector }: { talent: TalentPerson[]; cash: number; production: ProductionState; hireTalent: (id: string) => void; checkInTalent: (id: string) => void; assignDirector: (id: string) => void }) {
  const signed = talent.filter((t) => t.signed)
  const available = talent.filter((t) => !t.signed)
  return <><SectionTitle eyebrow="Business affairs" title="Talent" detail="Nobody builds an empire alone. Sign the right people before a rival studio does." /><div className="mb-8"><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Signed to you</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{signed.map((person) => <div key={person.id} className="rounded-xl border border-primary/20 bg-card p-5"><div className="flex items-start justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">{person.discipline}</span><span className="font-mono text-[9px] text-muted-foreground">Fame {person.fame}</span></div><h2 className="mt-3 font-serif text-xl">{person.name}</h2><p className="mt-1 text-xs text-muted-foreground">{person.personality}</p><div className="mt-4"><div className="mb-1.5 flex justify-between text-xs"><span>Trust</span><span className="font-mono text-muted-foreground">{person.trust}/100</span></div><div className="h-1.5 rounded-full bg-accent"><div className="h-full rounded-full bg-primary" style={{ width: `${person.trust}%` }} /></div></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => checkInTalent(person.id)} className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/50">Check in</button>{person.discipline === 'Director' && !production.released && production.director !== person.name && <button onClick={() => assignDirector(person.id)} className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">Direct {production.title}</button>}</div></div>)}{signed.length === 0 && <p className="text-sm text-muted-foreground">Nobody's signed yet. Hire from the pool below.</p>}</div></div><div><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Available to sign</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{available.map((person) => <div key={person.id} className="rounded-xl border border-border/80 bg-card p-5"><div className="flex items-start justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{person.discipline}</span><span className="font-mono text-[9px] text-muted-foreground">Skill {person.skill}</span></div><h2 className="mt-3 font-serif text-xl">{person.name}</h2><p className="mt-1 text-xs text-muted-foreground">{person.personality}</p><p className="mt-4 font-mono text-sm text-primary">{money(person.salary)}</p><button onClick={() => hireTalent(person.id)} disabled={cash < person.salary} className="mt-4 w-full rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">{cash < person.salary ? "Can't afford yet" : 'Sign talent'}</button></div>)}{available.length === 0 && <p className="text-sm text-muted-foreground">The pool is empty this week — check back after you advance.</p>}</div></div></>
}

function Finance({ cash, production, acceptedProjects }: { cash: number; production: ProductionState; acceptedProjects: Audition[] }) {
  const totalContracted = acceptedProjects.reduce((sum, p) => sum + p.pay, 0)
  return <><SectionTitle eyebrow="Money in the room" title="Finance" detail="No debt yet. No safety net either. Every contract is runway." /><div className="grid gap-4 sm:grid-cols-3"><StatCard label="Cash on hand" value={money(cash)} note="After rent and representation" icon={Wallet} /><StatCard label="Contracted earnings" value={money(totalContracted)} note={`${acceptedProjects.length} project${acceptedProjects.length === 1 ? '' : 's'} booked`} icon={Banknote} /><StatCard label={`${production.title} budget`} value={money(production.budget)} note={`${production.title} · ${production.released ? 'Released' : production.stage}`} icon={Film} /></div><div className="mt-6 rounded-xl border border-border/80 bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Contracts</p>{acceptedProjects.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No signed contracts yet. Your next audition could change that.</p> : <div className="mt-4 space-y-3">{acceptedProjects.map((p) => <div key={p.title} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0"><div><p className="text-sm font-medium">{p.title}</p><p className="text-xs text-muted-foreground">{p.role} · {p.studio}</p></div><span className="font-mono text-sm text-primary">{money(p.pay)}</span></div>)}</div>}</div></>
}

function Awards({ awards }: { awards: AwardEntry[] }) {
  return <><SectionTitle eyebrow="Recognition" title="Awards" detail="Buzz is cheap. Nominations cost something. Wins cost everything before them." />{awards.length === 0 ? <div className="rounded-xl border border-dashed border-border bg-accent/20 p-10 text-center"><Award className="mx-auto mb-4 h-6 w-6 text-primary" /><h2 className="font-serif text-2xl">Nothing on the ballot yet.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Awards follow the work. Finish something worth talking about.</p></div> : <div className="grid gap-4 sm:grid-cols-2">{awards.map((a) => <div key={a.id} className="rounded-xl border border-border/80 bg-card p-5"><div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">{a.org}</span><span className={`rounded-full px-2 py-1 text-[10px] ${a.status === 'Winner' ? 'bg-primary text-primary-foreground' : a.status === 'Nominated' ? 'bg-primary/10 text-primary' : 'bg-accent text-muted-foreground'}`}>{a.status}</span></div><h2 className="mt-3 font-serif text-xl">{a.category}</h2><p className="mt-1 text-sm text-muted-foreground">{a.project} · {a.name}</p><p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Week {a.week}</p></div>)}</div>}</>
}

function CalendarPage({ events, week }: { events: CalendarEvent[]; week: number }) {
  return <><SectionTitle eyebrow={`Week ${week}`} title="Calendar" detail="The schedule that actually happened — not a template, a record." />{events.length === 0 ? <div className="rounded-xl border border-dashed border-border bg-accent/20 p-10 text-center"><CalendarDays className="mx-auto mb-4 h-6 w-6 text-primary" /><h2 className="font-serif text-2xl">Nothing on the books.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Take a meeting, accept a role, or advance a production and it will show up here.</p></div> : <div className="space-y-3">{events.map((e) => <div key={e.id} className="flex items-start gap-4 rounded-xl border border-border/80 bg-card p-4"><div className="mt-0.5 shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-primary">{e.kind}</div><div><p className="text-sm font-medium">{e.title}</p><p className="mt-1 text-xs text-muted-foreground">{e.detail}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Week {e.week}</p></div></div>)}</div>}</>
}

function NewsPage({ newsItems }: { newsItems: NewsItem[] }) {
  return <><SectionTitle eyebrow="The industry wire" title="News" detail="The city talks whether or not you're in the room." /><div className="space-y-4">{newsItems.map((n) => <div key={n.id} className="rounded-xl border border-border/80 bg-card p-5"><p className="font-mono text-[9px] tracking-[0.18em] text-primary">{n.tag} <span className="ml-2 text-muted-foreground">Week {n.week}</span></p><p className="mt-2 text-sm leading-6 text-foreground/90">{n.headline}</p></div>)}</div></>
}

function AuditionModal({ session, close, beat }: { session: AuditionSession; close: () => void; beat: (bonus: number) => void }) {
  const stage = auditionStages[session.stage]
  const finished = Boolean(session.result)
  return <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm"><div className="w-full max-w-lg overflow-hidden rounded-xl border border-primary/30 bg-card shadow-lg"><div className={`h-32 bg-gradient-to-br ${session.item.accent} p-5`}><div className="flex items-start justify-between"><span className="rounded-full border border-primary/40 bg-background/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-primary">Stage {session.stage + 1} / 4</span><button onClick={close} className="rounded-full bg-background/20 p-1.5 hover:bg-background/40" aria-label="Close"><X className="h-4 w-4" /></button></div><p className="mt-7 font-serif text-3xl">{session.item.title}</p></div><div className="p-6"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{finished ? 'Casting decision' : stage.name}</p><h2 className="mt-2 font-serif text-2xl">{finished ? session.result : session.item.role}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{finished ? `Your run ended after ${session.stage + 1} stage${session.stage ? 's' : ''}. The room remembers the choice.` : stage.prompt}</p>{!finished && <div className="my-5 grid gap-3">{stage.choices.map((choice) => <button key={choice.label} onClick={() => beat(choice.bonus)} className="rounded-md border border-border px-4 py-3 text-left text-sm transition-all hover:border-primary/60 hover:bg-primary/5"><span className="font-medium">{choice.label}</span><span className="mt-1 block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Resolve with {stage.stat} + random factor</span></button>)}</div>}{finished && <div className="my-5 grid grid-cols-3 gap-3 border-y border-border py-4 text-sm"><div><p className="font-mono text-[9px] uppercase text-muted-foreground">Pay</p><p className="mt-1 text-primary">{session.result === 'accepted' ? money(session.item.pay) : session.result === 'offered a different role' ? money(Math.round(session.item.pay * .55)) : '—'}</p></div><div><p className="font-mono text-[9px] uppercase text-muted-foreground">Heat</p><p className="mt-1">{session.result === 'accepted' ? `+${session.item.fame}` : 'Pending'}</p></div><div><p className="font-mono text-[9px] uppercase text-muted-foreground">Score</p><p className="mt-1">{Math.max(0, Math.round(session.score))}</p></div></div>}<button onClick={close} className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground">{finished ? 'Return to Projects' : 'Withdraw from audition'}</button></div></div></div>
}

function BoxOffice({ entries, genreMastery, rivalFilms }: { entries: BoxOfficeEntry[]; genreMastery: Record<string, number>; rivalFilms: RivalFilm[] }) {
  const totalGross = entries.reduce((sum, e) => sum + e.worldwide, 0)
  const hits = entries.filter((e) => e.profit >= 0).length
  const masteryEntries = Object.entries(genreMastery).sort((a, b) => b[1] - a[1])
  return <><SectionTitle eyebrow="Industry ledger" title="Box Office" detail="Opening weekend is the headline. Worldwide gross is the legacy." />{entries.length === 0 ? <div className="rounded-xl border border-dashed border-border bg-accent/20 p-10 text-center"><BarChart3 className="mx-auto mb-4 h-6 w-6 text-primary" /><h2 className="font-serif text-2xl">No results yet.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Release a picture and the numbers will land here — good or bad, the industry keeps score.</p></div> : <><div className="mb-6 grid gap-4 sm:grid-cols-3"><StatCard label="Lifetime worldwide gross" value={money(totalGross)} note={`Across ${entries.length} release${entries.length === 1 ? '' : 's'}`} icon={BarChart3} /><StatCard label="Hit rate" value={`${hits}/${entries.length}`} note="Releases that turned a profit" icon={TrendingUp} /><StatCard label="Most recent" value={entries[0].title} note={`Week ${entries[0].week}`} icon={Film} /></div><div className="space-y-4">{entries.map((e) => <div key={e.id} className="rounded-xl border border-border/80 bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-serif text-2xl">{e.title}</h2><p className="text-xs text-muted-foreground">{e.studio} · {e.genre} · Week {e.week}</p></div><span className={`rounded-full px-3 py-1 text-xs ${e.profit >= 0 ? 'bg-primary/10 text-primary' : 'bg-accent text-muted-foreground'}`}>{e.profit >= 0 ? `Profit ${money(e.profit)}` : `Loss ${money(Math.abs(e.profit))}`}</span></div><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">{[['Budget', money(e.budget)], ['Opening weekend', money(e.opening)], ['Worldwide gross', money(e.worldwide)], ['Critic score', `${e.criticScore}%`], ['Audience score', `${e.audienceScore}%`]].map(([a, b]) => <div key={a}><p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{a}</p><p className="mt-1 text-sm">{b}</p></div>)}</div></div>)}</div></>}<div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-border/80 bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Genre mastery</p>{masteryEntries.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No genre experience yet. Every release builds mastery in its genre.</p> : <div className="mt-4 space-y-4">{masteryEntries.map(([genre, value]) => <div key={genre}><div className="mb-1.5 flex justify-between text-xs"><span>{genre}</span><span className="font-mono text-muted-foreground">{Math.min(100, value)}/100</span></div><div className="h-1.5 rounded-full bg-accent"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} /></div></div>)}</div>}</div><div className="rounded-xl border border-border/80 bg-card p-5"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Rival franchises</p><div className="mt-4 space-y-3">{rivalFilms.map((f) => <div key={f.id} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0"><div><p className="text-sm font-medium">{f.title}</p><p className="text-xs text-muted-foreground">{f.rival} · {f.studio} · Week {f.week}</p></div><span className="font-mono text-sm text-muted-foreground">{money(f.opening)}</span></div>)}</div></div></div></>
}

function Production({ production, decision, advanceStage, setScreen }: { production: ProductionState; decision: (kind: 'protect' | 'push' | 'mediate') => void; advanceStage: () => void; setScreen: (s: Screen) => void }) {
  return <><SectionTitle eyebrow={`${production.studio} · Production file`} title={production.title} detail="Every production is a negotiation between the picture you imagined and the week you can afford." /><div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-xl border border-border/80 bg-card p-6"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Current stage</p><h2 className="mt-1 font-serif text-3xl">{production.stage}</h2></div><span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{production.quality}/100 quality</span></div><div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Cast', 'Alex Mercer · Mira Chen'], ['Director', production.director], ['Budget', money(production.budget)], ['Schedule', production.stage === 'Released' ? 'Complete' : '6 weeks']].map(([a, b]) => <div key={a} className="rounded-md bg-accent/40 p-3"><p className="font-mono text-[9px] uppercase text-muted-foreground">{a}</p><p className="mt-1 text-sm">{b}</p></div>)}</div><div className="flex gap-2">{['Pre-production', 'Filming', 'Post-production', 'Released'].map((s) => <div key={s} className={`h-1.5 flex-1 rounded-full ${['Pre-production', 'Filming', 'Post-production', 'Released'].indexOf(s) <= ['Pre-production', 'Filming', 'Post-production', 'Released'].indexOf(production.stage) ? 'bg-primary' : 'bg-accent'}`} />)}</div>{production.incident && <p className="mt-5 rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-primary">{production.incident}</p>}<div className="mt-6 flex flex-wrap gap-3"><button onClick={advanceStage} className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">{production.stage === 'Released' ? 'Review release results' : `Advance to ${production.stage === 'Pre-production' ? 'filming' : production.stage === 'Filming' ? 'post-production' : 'release'}`} <ArrowRight className="ml-2 inline h-4 w-4" /></button>{!production.released && <button onClick={() => setScreen('talent')} className="rounded-md border border-border px-4 py-2.5 text-sm hover:border-primary/50 hover:text-primary">Manage talent</button>}</div></div><div className="rounded-xl border border-border/80 bg-card p-6"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Decision room</p><h2 className="mt-1 font-serif text-2xl">A disagreement on set</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">The director wants one more expensive night shoot. Your lead says the scene already works. How do you protect the picture?</p><div className="mt-5 space-y-2"><button onClick={() => decision('protect')} className="w-full rounded-md border border-border p-3 text-left text-sm hover:border-primary/50">Trust the cast and protect morale</button><button onClick={() => decision('push')} className="w-full rounded-md border border-border p-3 text-left text-sm hover:border-primary/50">Push for the director's vision</button><button onClick={() => decision('mediate')} className="w-full rounded-md border border-border p-3 text-left text-sm hover:border-primary/50">Mediate and rewrite the scene</button></div></div></div></>
}

function Development({ development, setDevelopment, showCreator, setShowCreator, notify, addNews, addEvent, talent, assignWriter }: { development: DevelopmentItem[]; setDevelopment: (items: DevelopmentItem[]) => void; showCreator: boolean; setShowCreator: (show: boolean) => void; notify: (s: string) => void; addNews: (tag: string, headline: string) => void; addEvent: (title: string, detail: string, kind: CalendarEvent['kind']) => void; talent: TalentPerson[]; assignWriter: (talentId: string, developmentId: string) => void }) {
  const signedWriters = talent.filter((t) => t.signed && t.discipline === 'Writer')
  const [type, setType] = useState<DevelopmentItem['type']>('Short Film')
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('Drama')
  const [hook, setHook] = useState('')
  const [entry, setEntry] = useState('')
  const create = () => {
    if (!title.trim()) return
    const item: DevelopmentItem = { id: `${Date.now()}`, type, title, genre, hook, entry: type === 'Franchise / Universe' ? entry || 'Untitled first chapter' : undefined, status: 'Concept' }
    setDevelopment([item, ...development])
    addEvent(`${title} — development check-in`, 'Circle back once there is real interest.', 'Personal')
    if (type === 'Franchise / Universe') addNews('BACKLOT BUZZ', `Alex Mercer quietly registers a new universe concept: \u201c${title}.\u201d`)
    setTitle(''); setHook(''); setEntry(''); setShowCreator(false)
    notify(`${type} added to your development slate.`)
  }
  return <><SectionTitle eyebrow="Creator mode" title="Development slate" detail="The first page is where ownership begins. Start small, build a world, or plant a flag for the universe you want to own." /><div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Your concepts</p><p className="mt-1 text-sm text-muted-foreground">{development.length} concept{development.length === 1 ? '' : 's'} in development</p></div><button onClick={() => setShowCreator(true)} className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"><Plus className="mr-2 inline h-4 w-4" />New concept</button></div>{development.length === 0 ? <div className="rounded-xl border border-dashed border-border bg-accent/20 p-10 text-center"><Sparkles className="mx-auto mb-4 h-6 w-6 text-primary" /><h2 className="font-serif text-2xl">Nothing has been greenlit yet.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Choose a format and put your name above the title. Every studio empire starts as a sentence no one has heard before.</p><button onClick={() => setShowCreator(true)} className="mt-5 rounded-md border border-primary/50 px-4 py-2 text-sm text-primary">Start the first page</button></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{development.map((item) => <div key={item.id} className="rounded-xl border border-primary/20 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50"><div className="flex items-start justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary">{item.type}</span><span className="rounded-full bg-accent px-2 py-1 text-[10px] text-muted-foreground">{item.status}</span></div><h2 className="mt-4 font-serif text-2xl">{item.title}</h2><p className="mt-1 text-xs text-muted-foreground">{item.genre}</p><p className="mt-4 text-sm leading-6 text-muted-foreground">{item.hook || 'A new story looking for its first brave decision.'}</p>{item.entry && <p className="mt-4 border-t border-border pt-3 text-xs text-primary">First entry: {item.entry}</p>}{item.writerName ? <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Writer: <span className="text-foreground">{item.writerName}</span></p> : signedWriters.length > 0 ? <select onChange={(e) => e.target.value && assignWriter(e.target.value, item.id)} defaultValue="" className="mt-3 w-full rounded-md border border-input bg-card px-2 py-1.5 text-xs outline-none focus:border-primary"><option value="">Attach a writer…</option>{signedWriters.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select> : <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">No writer attached — sign one from Talent</p>}<button onClick={() => notify(`${item.title} is ready for a greenlight review.`)} className="mt-5 text-sm text-primary hover:underline">Open development file <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div>)}</div>}{showCreator && <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-xl border border-primary/30 bg-card p-6 shadow-lg"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">New concept</p><h2 className="mt-1 font-serif text-2xl">What are you making?</h2></div><button onClick={() => setShowCreator(false)} className="rounded-full p-2 hover:bg-accent"><X className="h-4 w-4" /></button></div><div className="my-5 grid grid-cols-3 gap-2">{(['Short Film', 'TV Series Pitch', 'Franchise / Universe'] as DevelopmentItem['type'][]).map((option) => <button key={option} onClick={() => setType(option)} className={`rounded-md border p-3 text-left text-xs ${type === option ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>{option}</button>)}</div><div className="space-y-3"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === 'Franchise / Universe' ? 'Universe name' : 'Working title'} className="w-full rounded-md border border-input bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary" /><select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"><option>Drama</option><option>Thriller</option><option>Science fiction</option><option>Comedy</option><option>Fantasy</option><option>Horror</option></select><textarea value={hook} onChange={(e) => setHook(e.target.value)} placeholder="What is the creative hook?" className="min-h-24 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary" />{type === 'Franchise / Universe' && <input value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="First film or show entry" className="w-full rounded-md border border-input bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary" />}</div><button onClick={create} disabled={!title.trim()} className="mt-5 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">Add to development slate</button></div></div>}</>
}