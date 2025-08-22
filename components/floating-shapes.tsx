"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

interface FloatingShapesProps {
  mousePosition: { x: number; y: number }
}

export function FloatingShapes({ mousePosition }: FloatingShapesProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const shapesRef = useRef<THREE.Mesh[]>([])
  const frameRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Store refs
    sceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera
    camera.position.z = 5

    // Create floating shapes
    const shapes: THREE.Mesh[] = []
    const geometries = [
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.OctahedronGeometry(0.4),
      new THREE.TetrahedronGeometry(0.4),
    ]

    const colors = [0x00ffff, 0xff00ff, 0x0080ff, 0xff0080]

    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.6,
        wireframe: Math.random() > 0.5,
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10)
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      scene.add(mesh)
      shapes.push(mesh)
    }

    shapesRef.current = shapes

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      // Rotate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 + index * 0.001
        shape.rotation.y += 0.005 + index * 0.001
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002
      })

      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometries.forEach((geo) => geo.dispose())
      shapes.forEach((shape) => {
        if (shape.material instanceof THREE.Material) {
          shape.material.dispose()
        }
      })
    }
  }, [])

  // Mouse interaction
  useEffect(() => {
    if (!shapesRef.current.length) return

    const normalizedX = (mousePosition.x / window.innerWidth) * 2 - 1
    const normalizedY = -(mousePosition.y / window.innerHeight) * 2 + 1

    shapesRef.current.forEach((shape, index) => {
      const factor = (index + 1) * 0.1
      shape.position.x += normalizedX * factor * 0.1
      shape.position.y += normalizedY * factor * 0.1
    })
  }, [mousePosition])

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

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
}
