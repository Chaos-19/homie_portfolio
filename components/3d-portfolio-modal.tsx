"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { X, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Portfolio3DModalProps {
  item: {
    id: number;
    title: string;
    category: string;
    image: string;
    type: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Portfolio3DModal({
  item,
  isOpen,
  onClose,
}: Portfolio3DModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen || !item || !modalRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0.8);
    modalRef.current.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    camera.position.z = 5;

    // Create floating frame
    const geometry = new THREE.PlaneGeometry(6, 4);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
    });

    const frame = new THREE.Mesh(geometry, material);
    scene.add(frame);

    // Add particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff00ff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      frame.rotation.y += 0.005;
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (modalRef.current && renderer.domElement) {
        modalRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div ref={modalRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-4 bg-gray-900/90 rounded-2xl border border-cyan-500/30 backdrop-blur-md overflow-hidden">
        <div className="relative">
          {!item.image.includes(".mp4") ? (
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="w-full  object-cover h-96 transition-transform duration-500 group-hover:scale-110"
              width={400}
              height={256}
              style={{}}
            />
          ) : (
            <video
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              autoPlay
              loop
              playsInline
            >
              <source src={item.image || "/placeholder.svg"} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          {item.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-cyan-500/80 hover:bg-cyan-500 text-white rounded-full w-20 h-20 backdrop-blur-sm shadow-lg shadow-cyan-500/50"
              >
                <Play className="w-8 h-8" />
              </Button>
            </div>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 bg-black/50 backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {item.title}
              </h2>
              <p className="text-cyan-400 text-lg">{item.category}</p>
            </div>
            <Button
              variant="outline"
              className="border-magenta-500 text-magenta-400 hover:bg-magenta-500 hover:text-white bg-transparent"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Project
            </Button>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            This project showcases cutting-edge design and technical expertise,
            delivering exceptional results that exceed client expectations. The
            work demonstrates mastery of modern creative techniques and
            innovative problem-solving approaches.
          </p>

          <div className="flex gap-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/30">
              Creative Design
            </span>
            <span className="px-3 py-1 bg-magenta-500/20 text-magenta-400 rounded-full text-sm border border-magenta-500/30">
              Professional Quality
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Client Focused
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
