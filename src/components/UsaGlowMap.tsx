'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-50m.json'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { Topology } from 'topojson-specification'

type CountryProperties = { name?: string }
type CountryFeature = Feature<Geometry, CountryProperties>

const WIDTH = 1000
const HEIGHT = 560
const DEFAULT_MAP_COLOR = 'var(--fm-lime)'
const FOCUS_RADIUS = 72

function buildUsaPath() {
  const countries = feature(
    world as unknown as Topology,
    (world as unknown as Topology).objects.countries,
  ) as unknown as FeatureCollection<Geometry, CountryProperties>
  const usa = countries.features.find((country) => country.id === '840' || country.properties?.name === 'United States of America')

  if (!usa) throw new Error('United States geometry was not found in world-atlas.')

  const projection = geoAlbersUsa().fitSize([WIDTH - 34, HEIGHT - 30], usa)
  return geoPath(projection)(usa) ?? ''
}

type UsaGlowMapProps = {
  color?: string
  pointer?: {
    clientX: number
    clientY: number
    active: boolean
  }
  focus?: {
    x: number
    y: number
    active?: boolean
  }
}

export function UsaGlowMap({ color = DEFAULT_MAP_COLOR, pointer, focus }: UsaGlowMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const cursorRef = useRef({ x: 500, y: 280 })
  const targetRef = useRef({ x: 500, y: 280, active: false })
  const boundsRef = useRef<DOMRect | null>(null)
  const frameRef = useRef<number | null>(null)
  const maskRef = useRef<SVGCircleElement>(null)
  const glowPathsRef = useRef<SVGGElement>(null)
  const usaPath = useMemo(buildUsaPath, [])

  const startAnimation = useCallback(() => {
    if (frameRef.current === null && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      frameRef.current = requestAnimationFrame(function animateFrame() {
        frameRef.current = null
        const cursor = cursorRef.current
        const target = targetRef.current
        cursor.x += (target.x - cursor.x) * 0.14
        cursor.y += (target.y - cursor.y) * 0.14
        const distance = Math.hypot(cursor.x - target.x, cursor.y - target.y)
        maskRef.current?.setAttribute('cx', String(cursor.x))
        maskRef.current?.setAttribute('cy', String(cursor.y))
        glowPathsRef.current?.setAttribute('opacity', String(target.active ? 1 : Math.min(1, distance / 120)))
        if (distance > 0.1) frameRef.current = requestAnimationFrame(animateFrame)
      })
    }
  }, [])

  const updatePointerPosition = useCallback((clientX: number, clientY: number, active: boolean) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = boundsRef.current ?? svg.getBoundingClientRect()
    boundsRef.current = rect
    const x = ((clientX - rect.left) / rect.width) * WIDTH
    const y = ((clientY - rect.top) / rect.height) * HEIGHT
    targetRef.current = { x, y, active }
    maskRef.current?.setAttribute('cx', String(x))
    maskRef.current?.setAttribute('cy', String(y))
    glowPathsRef.current?.setAttribute('opacity', active ? '1' : '0')
    startAnimation()
  }, [startAnimation])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      boundsRef.current = svgRef.current?.getBoundingClientRect() ?? null
    })
    if (svgRef.current) resizeObserver.observe(svgRef.current)

    return () => {
      resizeObserver.disconnect()
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  useEffect(() => {
    if (pointer) updatePointerPosition(pointer.clientX, pointer.clientY, pointer.active)
  }, [pointer, updatePointerPosition])

  useEffect(() => {
    if (!focus) return

    targetRef.current = { x: focus.x, y: focus.y, active: focus.active ?? true }
    maskRef.current?.setAttribute('cx', String(focus.x))
    maskRef.current?.setAttribute('cy', String(focus.y))
    glowPathsRef.current?.setAttribute('opacity', String(focus.active ?? true ? '1' : '0'))
    startAnimation()
  }, [focus, startAnimation])

  const updatePointer = (event: React.PointerEvent<SVGSVGElement>, active: boolean) => {
    updatePointerPosition(event.clientX, event.clientY, active)
  }

  return (
    <div className="map-frame">
      <svg
        ref={svgRef}
        className="usa-map pointer-events-auto"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Interactive geographical outline map of the United States"
        onPointerEnter={(event) => updatePointer(event, true)}
        onPointerMove={(event) => updatePointer(event, true)}
        onPointerLeave={(event) => updatePointer(event, false)}
      >
        <defs>
          <radialGradient id="spotlight" r="100%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="22%" stopColor="white" stopOpacity="0.96" />
            <stop offset="48%" stopColor="white" stopOpacity="0.72" />
            <stop offset="72%" stopColor="white" stopOpacity="0.28" />
            <stop offset="90%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <mask id="glow-mask"><rect width={WIDTH} height={HEIGHT} fill="black" /><circle ref={maskRef} cx="500" cy="280" r={FOCUS_RADIUS} fill="url(#spotlight)" filter="url(#blur-mask)" /></mask>
          <filter id="blur-mask" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="28" /></filter>
        </defs>
        <path d={usaPath} fill={color} fillOpacity="0.12" />
        <g ref={glowPathsRef} mask="url(#glow-mask)" opacity="0">
          <path d={usaPath} fill={color} fillOpacity="0.38" stroke="none" />
          <path d={usaPath} fill="none" stroke={color} strokeOpacity="0.9" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  )
}
