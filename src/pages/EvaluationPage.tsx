import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, ArrowClockwiseIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import BottomTabBar from '../components/layout/BottomTabBar'
import '../styles/evaluation-page.css'

type EvaluationMetric = 'comfort' | 'anxiety'

const scaleValues = Array.from({ length: 11 }, (_, value) => value)

function RatingSlider({
  metric,
  question,
  lowLabel,
  highLabel,
  value,
  onChange,
}: {
  metric: EvaluationMetric
  question: string
  lowLabel: string
  highLabel: string
  value: number | null
  onChange: (value: number) => void
}) {
  const inputId = `${metric}-score`
  const questionId = `${metric}-question`

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (value !== null) return
    const initialValue: Record<string, number> = {
      ArrowLeft: 0,
      ArrowDown: 0,
      Home: 0,
      PageDown: 0,
      ArrowRight: 1,
      ArrowUp: 1,
      PageUp: 1,
      End: 10,
    }
    const chosenValue = initialValue[event.key]
    if (chosenValue !== undefined) {
      event.preventDefault()
      onChange(chosenValue)
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLInputElement>) {
    // Clicking directly on the unselected minimum still records a deliberate value of zero.
    onChange(event.currentTarget.valueAsNumber)
  }

  return (
    <fieldset className="evaluation-rating" data-rating-panel={metric}>
      <legend className="evaluation-rating__heading">
        <span id={questionId}>{question}</span>
        <output className={value === null ? '' : 'is-announced-only'} htmlFor={inputId} aria-live="polite" data-rating-output={metric}>
          {value === null ? 'Belum dinilai' : `${value}/10`}
        </output>
      </legend>
      <div
        className="evaluation-rating__slider-wrap"
        style={{
          '--evaluation-progress': `${value === null ? 0 : value * 10}%`,
          '--evaluation-thumb-position': value === null ? '12px' : `calc(12px + ${value * 10}% - ${value * 2.4}px)`,
        } as CSSProperties}
      >
        <input
          className="evaluation-rating__range"
          id={inputId}
          type="range"
          min="0"
          max="10"
          step="1"
          value={value ?? 0}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          aria-labelledby={questionId}
          aria-describedby={`${inputId}-anchors`}
          aria-valuetext={value === null ? 'Belum dinilai' : `${value} dari 10`}
          data-rating={metric}
          data-rated={value !== null}
        />
        {value !== null ? <span className="evaluation-rating__thumb-value" aria-hidden="true">{value}</span> : null}
      </div>
      <div className="evaluation-rating__ticks" aria-hidden="true">
        {scaleValues.map((score) => <span className={value === score ? 'is-current' : ''} key={score}>{score}</span>)}
      </div>
      <div className="evaluation-rating__anchors" id={`${inputId}-anchors`}>
        <span><strong>0</strong> = {lowLabel}</span>
        <span><strong>10</strong> = {highLabel}</span>
      </div>
    </fieldset>
  )
}

export default function EvaluationPage() {
  const [comfort, setComfort] = useState<number | null>(null)
  const [anxiety, setAnxiety] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const resultHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => { document.title = 'Evaluasi Kenyamanan Ibu · Ruang Ibu' }, [])
  useEffect(() => {
    if (showResult) resultHeadingRef.current?.focus()
  }, [showResult])

  function setRating(metric: EvaluationMetric, value: number) {
    if (metric === 'comfort') setComfort(Math.max(0, Math.min(10, value)))
    else setAnxiety(Math.max(0, Math.min(10, value)))
    if (metric === 'comfort' ? anxiety !== null : comfort !== null) setValidationMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (comfort === null || anxiety === null) {
      setValidationMessage('Pilih nilai pada kedua skala untuk melihat hasil.')
      return
    }
    setValidationMessage('')
    setShowResult(true)
  }

  function resetEvaluation() {
    setComfort(null)
    setAnxiety(null)
    setValidationMessage('')
    setShowResult(false)
  }

  return (
    <div className="evaluation-page">
      <header className="evaluation-page__header">
        <Link to="/" aria-label="Kembali ke Beranda"><ArrowLeftIcon size={22} weight="regular" aria-hidden="true" /></Link>
        <span>Evaluasi</span>
        <span aria-hidden="true" />
      </header>

      <main className="evaluation-page__main">
        <section className="evaluation-page__intro" aria-labelledby="evaluation-title">
          <img src="/therapy-botanical.svg" alt="" aria-hidden="true" />
          <h1 id="evaluation-title">Bagaimana Perasaan Ibu Hari Ini?</h1>
          <p>Luangkan sejenak untuk mengenali kenyamanan dan rasa cemas yang Ibu rasakan saat ini.</p>
        </section>

        {!showResult ? (
          <form className="evaluation-form" onSubmit={handleSubmit} noValidate>
            <div className="evaluation-ratings">
              <RatingSlider
                metric="comfort"
                question="Seberapa nyaman yang Ibu rasakan sekarang?"
                lowLabel="Sangat tidak nyaman"
                highLabel="Sangat nyaman"
                value={comfort}
                onChange={(value) => setRating('comfort', value)}
              />
              <RatingSlider
                metric="anxiety"
                question="Seberapa cemas yang Ibu rasakan sekarang?"
                lowLabel="Tidak cemas"
                highLabel="Sangat cemas"
                value={anxiety}
                onChange={(value) => setRating('anxiety', value)}
              />
            </div>
            <p className="evaluation-validation" role="status" aria-live="polite" data-validation>{validationMessage}</p>
            <button className="evaluation-primary-action" id="evaluation-submit" type="submit">
              Lihat hasil penilaian <ArrowRightIcon size={19} weight="regular" aria-hidden="true" />
            </button>
          </form>
        ) : (
          <section className="evaluation-result" data-evaluation-result aria-labelledby="evaluation-result-title">
            <p className="evaluation-result__eyebrow">CATATAN PRIBADI</p>
            <h2 id="evaluation-result-title" ref={resultHeadingRef} tabIndex={-1}>Catatan Perasaan Ibu</h2>
            <dl className="evaluation-result__values">
              <div><dt>Tingkat kenyamanan</dt><dd>{comfort}/10</dd></div>
              <div><dt>Tingkat kecemasan</dt><dd>{anxiety}/10</dd></div>
            </dl>
            <p className="evaluation-result__note">Angka ini mencerminkan perasaan yang Ibu pilih untuk dicatat saat ini. Hasil ini bukan diagnosis.</p>
            <button className="evaluation-primary-action" type="button" data-reset-evaluation onClick={resetEvaluation}>
              <ArrowClockwiseIcon size={18} weight="regular" aria-hidden="true" /> Isi penilaian lagi
            </button>
          </section>
        )}

        <aside className="evaluation-page__safety" aria-labelledby="evaluation-safety-title">
          <h2 id="evaluation-safety-title">Perlu bantuan kesehatan?</h2>
          <p>Penilaian ini tidak menggantikan pemeriksaan atau arahan tenaga kesehatan. Jika Ibu mengalami keluhan atau tanda bahaya, hubungi bidan, dokter, atau fasilitas kesehatan.</p>
        </aside>

      </main>

      <BottomTabBar />
    </div>
  )
}
