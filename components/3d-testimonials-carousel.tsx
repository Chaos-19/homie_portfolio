"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

interface Testimonial {
  name: string
  company: string
  text: string
}

interface Testimonials3DCarouselProps {
  testimonials: Testimonial[]
}

export function Testimonials3DCarousel({ testimonials }: Testimonials3DCarouselProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sceneRef = useRef<HTMLDivElement>(null)
  const threeSceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const frameRef = useRef<number>()
  const particlesRef = useRef<THREE.Points[]>([])

  useEffect(() => {
    if (!sceneRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    sceneRef.current.appendChild(renderer.domElement)

    // Store refs
    threeSceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera
    camera.position.z = 5

    // Create floating particles for each testimonial
    const particles: THREE.Points[] = []
    testimonials.forEach((_, index) => {
      const particleGeometry = new THREE.BufferGeometry()
      const particleCount = 50
      const positions = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10
      }

      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

      const colors = [0x00ffff, 0xff00ff, 0x0080ff]
      const particleMaterial = new THREE.PointsMaterial({
        color: colors[index % colors.length],
        size: 0.02,
        transparent: true,
        opacity: index === currentTestimonial ? 0.8 : 0.2,
      })

      const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
      particleSystem.position.x = index * 15 - (testimonials.length - 1) * 7.5
      scene.add(particleSystem)
      particles.push(particleSystem)
    })

    particlesRef.current = particles

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      particles.forEach((particle, index) => {
        particle.rotation.y += 0.002
        particle.rotation.x += 0.001

        // Animate particle positions based on current testimonial
        const targetX = (index - currentTestimonial) * 15
        particle.position.x += (targetX - particle.position.x) * 0.05

        // Update opacity
        const targetOpacity = index === currentTestimonial ? 0.8 : 0.2
        if (particle.material instanceof THREE.PointsMaterial) {
          particle.material.opacity += (targetOpacity - particle.material.opacity) * 0.1
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (sceneRef.current && renderer.domElement) {
        sceneRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      particles.forEach((particle) => {
        if (particle.geometry) particle.geometry.dispose()
        if (particle.material instanceof THREE.Material) particle.material.dispose()
      })
    }
  }, [testimonials.length])

  // Update particles when testimonial changes
  useEffect(() => {
    if (particlesRef.current.length > 0) {
      particlesRef.current.forEach((particle, index) => {
        const targetOpacity = index === currentTestimonial ? 0.8 : 0.2
        if (particle.material instanceof THREE.PointsMaterial) {
          particle.material.opacity = targetOpacity
        }
      })
    }
  }, [currentTestimonial])

  const nextTestimonial = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevTestimonial = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative">
      {/* 3D Background */}
      <div ref={sceneRef} className="absolute inset-0 pointer-events-none opacity-30" />

      {/* Testimonial Cards Container */}
      <div className="relative z-10 flex items-center justify-center min-h-96">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* Main Testimonial Card */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentTestimonial * 100}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card
                    className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700 backdrop-blur-md transition-all duration-500 ${
                      index === currentTestimonial
                        ? "border-cyan-500/50 shadow-2xl shadow-cyan-500/20 scale-105"
                        : "border-gray-700/50"
                    }`}
                    style={{
                      transform: `perspective(1000px) rotateY(${(index - currentTestimonial) * 5}deg) translateZ(${index === currentTestimonial ? "20px" : "0px"})`,
                    }}
                  >
                    <CardContent className="p-8 text-center relative">
                      {/* Quote Icon */}
                      <div className="absolute top-4 left-4 opacity-20">
                        <Quote className="w-12 h-12 text-cyan-400" />
                      </div>

                      {/* Testimonial Text */}
                      <div className="relative z-10">
                        <p className="text-xl text-gray-300 mb-8 italic leading-relaxed font-light">
                          "{testimonial.text}"
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center justify-center gap-4">
                          <div
                            className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                            style={{
                              transform: `translateZ(10px)`,
                            }}
                          >
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-white text-lg">{testimonial.name}</p>
                            <p className="text-cyan-400 font-medium">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>

                      {/* Floating Elements */}
                      {index === currentTestimonial && (
                        <>
                          <div className="absolute top-6 right-6 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          <div className="absolute bottom-6 left-6 w-1 h-1 bg-magenta-400 rounded-full animate-ping" />
                          <div className="absolute top-1/2 right-4 w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                        </>
                      )}

                      {/* Glow Effect */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-magenta-500/5 rounded-lg transition-opacity duration-500 ${
                          index === currentTestimonial ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          boxShadow:
                            index === currentTestimonial
                              ? "0 0 60px rgba(0,255,255,0.1), inset 0 0 60px rgba(255,0,255,0.05)"
                              : "none",
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={prevTestimonial}
            variant="outline"
            size="icon"
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50"
            style={{
              transform: `translateY(-50%) translateZ(30px)`,
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            onClick={nextTestimonial}
            variant="outline"
            size="icon"
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white bg-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50"
            style={{
              transform: `translateY(-50%) translateZ(30px)`,
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true)
                    setCurrentTestimonial(index)
                    setTimeout(() => setIsTransitioning(false), 500)
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                disabled={isTransitioning}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
