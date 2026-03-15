'use client'

import { useState, useRef, useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

function formatShort(dateStr: string): string {
  if (!dateStr) return ''
  const [, m, d] = dateStr.split('-').map(Number)
  return `${d} ${MONTHS[m - 1].slice(0, 3).toLowerCase()}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function MonthCalendar({
  year,
  month,
  rangeStart,
  rangeEnd,
  isLight,
  onDayClick,
  onDayHover,
}: {
  year: number
  month: number
  rangeStart: string
  rangeEnd: string
  isLight: boolean
  onDayClick: (d: string) => void
  onDayHover: (d: string) => void
}) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const effectiveStart = rangeStart && rangeEnd
    ? rangeStart < rangeEnd ? rangeStart : rangeEnd
    : rangeStart
  const effectiveEnd = rangeStart && rangeEnd
    ? rangeStart < rangeEnd ? rangeEnd : rangeStart
    : ''

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)
  while (cells.length % 7 !== 0) cells.push(null)

  const rangeBg = isLight ? 'bg-black/8' : 'bg-white/10'
  const edgeBg = isLight ? 'bg-black text-white' : 'bg-white text-black'
  const inRangeText = isLight ? 'text-[#1a1a22] hover:bg-black/10' : 'text-[var(--color-text-primary)] hover:bg-white/20'
  const normalText = isLight
    ? 'text-[#444] hover:bg-black/8 hover:text-[#1a1a22]'
    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-card-hover)] hover:text-[var(--color-text-primary)]'

  return (
    <div className="w-56">
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className={`text-center text-[11px] py-1 font-medium ${isLight ? 'text-[#888]' : 'text-[var(--color-text-muted)]'}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-8" />

          const dateStr = toDateStr(year, month, day)
          const isStart = dateStr === effectiveStart
          const isEnd = dateStr === effectiveEnd && effectiveEnd !== ''
          const inRange =
            effectiveStart &&
            effectiveEnd &&
            dateStr > effectiveStart &&
            dateStr < effectiveEnd

          const isEdge = isStart || isEnd
          const hasRangeStart = isStart && effectiveEnd !== ''
          const hasRangeEnd = isEnd && effectiveStart !== ''

          return (
            <div key={dateStr} className="relative flex items-center justify-center h-8">
              {inRange && <div className={`absolute inset-y-0 inset-x-0 ${rangeBg}`} />}
              {hasRangeStart && <div className={`absolute inset-y-0 left-1/2 right-0 ${rangeBg}`} />}
              {hasRangeEnd && <div className={`absolute inset-y-0 right-1/2 left-0 ${rangeBg}`} />}

              <button
                onClick={() => onDayClick(dateStr)}
                onMouseEnter={() => onDayHover(dateStr)}
                onMouseLeave={() => onDayHover('')}
                className={`relative z-10 w-7 h-7 rounded-[4px] text-xs transition-colors duration-100 font-semibold ${
                  isEdge ? edgeBg : inRange ? inRangeText : normalText
                }`}
              >
                {day}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface DateRangePickerProps {
  dateFrom: string
  dateTo: string
  onChangeDateFrom: (v: string) => void
  onChangeDateTo: (v: string) => void
  onClear: () => void
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
  onClear,
}: DateRangePickerProps) {
  const { theme } = useThemeStore()
  const isLight = theme === 'light'

  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState('')
  const [selectingEnd, setSelectingEnd] = useState(false)
  const [pendingFrom, setPendingFrom] = useState('')
  const [pendingTo, setPendingTo] = useState('')

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setPendingFrom(dateFrom)
      setPendingTo(dateTo)
      setSelectingEnd(!!dateFrom && !dateTo)
      setHovered('')
    }
  }, [open])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSelectingEnd(false)
        setHovered('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function prevMonthNav() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonthNav() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  function handleDayClick(dateStr: string) {
    if (!selectingEnd || !pendingFrom) {
      setPendingFrom(dateStr)
      setPendingTo('')
      setSelectingEnd(true)
    } else {
      if (dateStr === pendingFrom) {
        setPendingFrom('')
        setSelectingEnd(false)
        return
      }
      if (dateStr < pendingFrom) {
        setPendingTo(pendingFrom)
        setPendingFrom(dateStr)
      } else {
        setPendingTo(dateStr)
      }
      setSelectingEnd(false)
      setHovered('')
    }
  }

  function handleApply() {
    onChangeDateFrom(pendingFrom)
    onChangeDateTo(pendingTo)
    setOpen(false)
  }

  const previewEnd = selectingEnd && hovered ? hovered : pendingTo

  const hasRange = dateFrom || dateTo
  const label =
    dateFrom && dateTo
      ? `${formatShort(dateFrom)} — ${formatShort(dateTo)}`
      : dateFrom
      ? formatShort(dateFrom)
      : 'Fechas'

  // Estilos según tema
  const popoverBg = isLight ? 'bg-white border-gray-200' : 'bg-black border-[var(--color-border)]'
  const monthText = isLight ? 'text-[#1a1a22]' : 'text-[var(--color-text-primary)]'
  const navBtnClass = isLight
    ? 'p-1.5 rounded hover:bg-black/8 text-[#444] hover:text-[#1a1a22] transition-colors'
    : 'p-1.5 rounded hover:bg-[var(--color-card-hover)] text-white hover:text-white/70 transition-colors'
  const dividerClass = isLight ? 'border-gray-200' : 'border-[var(--color-border)]'
  const inputClass = isLight
    ? 'w-full rounded-[6px] px-3 py-1.5 text-xs bg-black/5 border border-gray-200 text-[#1a1a22] outline-none focus:border-black/30 transition-colors'
    : 'w-full rounded-[6px] px-3 py-1.5 text-xs bg-white/5 border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none focus:border-white/40 transition-colors'
  const labelClass = isLight ? 'text-xs text-[#888]' : 'text-xs text-[var(--color-text-muted)]'
  const clearClass = isLight
    ? 'text-xs text-[#888] hover:text-[#1a1a22] transition-colors'
    : 'text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors'
  const applyClass = isLight
    ? 'px-4 py-1.5 text-xs font-medium rounded-[6px] bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
    : 'px-4 py-1.5 text-xs font-medium rounded-[6px] bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-[6px] pl-3 pr-8 py-2 text-sm border transition-colors ${
          hasRange
            ? 'bg-[var(--color-card)] border-[var(--color-accent)] text-[var(--color-text-primary)]'
            : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)]'
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span className="whitespace-nowrap">{label}</span>
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-2 z-50 border rounded-[8px] p-5 shadow-2xl ${popoverBg}`}>
          {/* Navegación */}
          <div className="flex items-center mb-3">
            <span className={`text-sm font-medium ${monthText}`}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button onClick={prevMonthNav} className={navBtnClass}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button onClick={nextMonthNav} className={navBtnClass}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendario */}
          <MonthCalendar
            year={viewYear}
            month={viewMonth}
            rangeStart={pendingFrom}
            rangeEnd={previewEnd}
            isLight={isLight}
            onDayClick={handleDayClick}
            onDayHover={selectingEnd ? setHovered : () => {}}
          />

          {/* Inputs manuales */}
          <div className={`mt-4 pt-4 border-t flex flex-col gap-3 ${dividerClass}`}>
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Inicio</span>
              <input
                type="date"
                value={pendingFrom}
                onChange={(e) => {
                  setPendingFrom(e.target.value)
                  if (e.target.value) setSelectingEnd(true)
                }}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className={labelClass}>Fin</span>
              <input
                type="date"
                value={pendingTo}
                onChange={(e) => {
                  setPendingTo(e.target.value)
                  setSelectingEnd(false)
                }}
                className={inputClass}
              />
            </div>
          </div>

          {/* Footer */}
          <div className={`mt-4 pt-3 border-t flex items-center justify-between ${dividerClass}`}>
            <button
              onClick={() => {
                onClear()
                setPendingFrom('')
                setPendingTo('')
                setSelectingEnd(false)
                setHovered('')
                setOpen(false)
              }}
              className={clearClass}
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              disabled={!pendingFrom || !pendingTo}
              className={applyClass}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
