"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ScrollParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ScrollParallax({ children, speed = 0.5, className }: ScrollParallaxProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={className}
      style={{
        transform: `translateY(${scrollY * speed}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}
