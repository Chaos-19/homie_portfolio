"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Video, Zap, Share2 } from "lucide-react"

interface Service3DTileProps {
  service: {
    title: string
    description: string
    icon: string
  }
  index: number
  scrollPosition: number
}

const iconMap = {
  branding: Palette,
  motion: Zap,
  video: Video,
  social: Share2,
}

export function Service3DTile({ service, index, scrollPosition }: Service3DTileProps) {
  const tileRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const frameRef = useRef<number>()
  const cubeRef = useRef<THREE.Mesh>()
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Palette

  useEffect(() => {
    if (!tileRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(200, 200)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    tileRef.current.appendChild(renderer.domElement)

    // Store refs
    sceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera
    camera.position.z = 3

    // Create rotating cube
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8 }),
      new THREE.MeshBasicMaterial({ color: 0x0080ff, transparent: true, opacity: 0.8 }),
      new THREE.MeshBasicMaterial({ color: 0xff0080, transparent: true, opacity: 0.8 }),
      new THREE.MeshBasicMaterial({ color: 0x80ff00, transparent: true, opacity: 0.8 }),
      new THREE.MeshBasicMaterial({ color: 0xff8000, transparent: true, opacity: 0.8 }),
    ]

    const cube = new THREE.Mesh(geometry, materials)
    scene.add(cube)
    cubeRef.current = cube

    // Add wireframe overlay
    const wireframeGeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    })
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    scene.add(wireframe)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      if (cubeRef.current) {
        cubeRef.current.rotation.x += 0.01
        cubeRef.current.rotation.y += 0.01

        if (isHovered) {
          cubeRef.current.rotation.x += mousePosition.y * 0.01
          cubeRef.current.rotation.y += mousePosition.x * 0.01
          cubeRef.current.scale.setScalar(1.2)
        } else {
          cubeRef.current.scale.setScalar(1)
        }
      }

      wireframe.rotation.x -= 0.005
      wireframe.rotation.y -= 0.005

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (tileRef.current && renderer.domElement) {
        tileRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      materials.forEach((material) => material.dispose())
    }
  }, [isHovered, mousePosition])

  // Scroll-based animation
  useEffect(() => {
    if (!cubeRef.current) return

    const scrollFactor = Math.max(0, (scrollPosition - 1000) * 0.001)
    const delay = index * 0.2
    const animationProgress = Math.max(0, scrollFactor - delay)

    cubeRef.current.position.y = Math.sin(animationProgress * 2) * 0.3
    cubeRef.current.rotation.z = animationProgress * 0.5
  }, [scrollPosition, index])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tileRef.current) return

    const rect = tileRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height

    setMousePosition({ x, y })
  }

  return (
    <Card
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 hover:border-cyan-500/50 transition-all duration-500 transform hover:scale-105 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transform: `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg)`,
        transition: "transform 0.3s ease-out",
      }}
    >
      <CardContent className="p-8 relative">
        {/* 3D Icon Container */}
        <div className="flex justify-center mb-6">
          <div ref={tileRef} className="relative w-48 h-48 flex items-center justify-center">
            {/* Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div
                className={`p-4 rounded-full bg-gradient-to-br transition-all duration-300 ${
                  isHovered ? "from-cyan-500/80 to-magenta-500/80 scale-110" : "from-cyan-500/60 to-magenta-500/60"
                } backdrop-blur-sm shadow-lg`}
                style={{
                  transform: `translateZ(20px) rotateY(${-mousePosition.x * 5}deg)`,
                }}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center relative z-10">
          <h3
            className="text-2xl font-bold text-white mb-4 transition-all duration-300"
            style={{
              transform: `translateZ(10px) rotateY(${-mousePosition.x * 3}deg)`,
            }}
          >
            {service.title}
          </h3>
          <p
            className="text-gray-300 leading-relaxed"
            style={{
              transform: `translateZ(5px) rotateY(${-mousePosition.x * 2}deg)`,
            }}
          >
            {service.description}
          </p>
        </div>

        {/* Floating Particles */}
        {isHovered && (
          <>
            <div className="absolute top-4 left-4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
            <div className="absolute top-6 right-8 w-1 h-1 bg-magenta-400 rounded-full animate-pulse" />
            <div className="absolute bottom-6 left-8 w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-pink-400 rounded-full animate-ping" />
          </>
        )}

        {/* Glow Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-magenta-500/10 rounded-lg transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            boxShadow: isHovered ? "0 0 40px rgba(0,255,255,0.2), inset 0 0 40px rgba(255,0,255,0.1)" : "none",
          }}
        />
      </CardContent>
    </Card>
  )
}
