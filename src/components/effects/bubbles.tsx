'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Bubble {
  x: number
  y: number
  radius: number
  speedX: number
  speedY: number
  opacity: number
  wobble: number
  wobbleSpeed: number
}

interface CursorBubble {
  x: number
  y: number
  radius: number
  opacity: number
  vy: number
  life: number
}

interface PopBubble {
  x: number
  y: number
  radius: number
  opacity: number
  scale: number
}

const DROP_SOUND_FREQ = 600
const DROP_SOUND_DURATION = 0.08

function playDropSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(DROP_SOUND_FREQ, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + DROP_SOUND_DURATION)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + DROP_SOUND_DURATION)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + DROP_SOUND_DURATION)
    setTimeout(() => ctx.close(), 200)
  } catch {
    // Audio not available
  }
}

export default function BubbleEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const cursorBubblesRef = useRef<CursorBubble[]>([])
  const popBubblesRef = useRef<PopBubble[]>([])
  const mouseRef = useRef({ x: -100, y: -100 })
  const frameRef = useRef(0)
  const animRef = useRef<number>(0)

  const initBubbles = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 60000)
    const bubbles: Bubble[] = []
    for (let i = 0; i < Math.min(count, 25); i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 8 + Math.random() * 30,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -0.2 - Math.random() * 0.4,
        opacity: 0.04 + Math.random() * 0.08,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
      })
    }
    bubblesRef.current = bubbles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (bubblesRef.current.length === 0) {
        initBubbles(canvas.width, canvas.height)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (Math.random() > 0.6) {
        cursorBubblesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY,
          radius: 2 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.3,
          vy: -0.8 - Math.random() * 1.2,
          life: 1,
        })
      }
    }

    const onClick = (e: MouseEvent) => {
      playDropSound()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6
        popBubblesRef.current.push({
          x: e.clientX + Math.cos(angle) * 15,
          y: e.clientY + Math.sin(angle) * 15,
          radius: 4 + Math.random() * 6,
          opacity: 0.6,
          scale: 1,
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)

    const animate = () => {
      frameRef.current++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Floating background bubbles
      for (const b of bubblesRef.current) {
        b.wobble += b.wobbleSpeed
        b.x += b.speedX + Math.sin(b.wobble) * 0.3
        b.y += b.speedY

        if (b.y + b.radius < 0) {
          b.y = canvas.height + b.radius
          b.x = Math.random() * canvas.width
        }
        if (b.x < -b.radius) b.x = canvas.width + b.radius
        if (b.x > canvas.width + b.radius) b.x = -b.radius

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 180, 216, ${b.opacity})`
        ctx.fill()

        // Highlight
        ctx.beginPath()
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 1.5})`
        ctx.fill()
      }

      // Cursor trail bubbles
      cursorBubblesRef.current = cursorBubblesRef.current.filter((b) => {
        b.y += b.vy
        b.life -= 0.015
        b.opacity = b.life * 0.5
        b.radius *= 0.995

        if (b.life <= 0) return false

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 180, 216, ${b.opacity})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(b.x - b.radius * 0.2, b.y - b.radius * 0.2, b.radius * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.8})`
        ctx.fill()

        return true
      })

      // Pop bubbles
      popBubblesRef.current = popBubblesRef.current.filter((b) => {
        b.scale += 0.08
        b.opacity -= 0.04

        if (b.opacity <= 0) return false

        const r = b.radius * b.scale
        ctx.beginPath()
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 180, 216, ${b.opacity})`
        ctx.lineWidth = 2
        ctx.stroke()

        return true
      })

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(animRef.current)
    }
  }, [initBubbles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
