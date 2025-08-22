"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import * as THREE from "three";

import logo from "@/public/logo.png";

interface Hero3DVideoProps {
  scrollPosition: number;
}

export function Hero3DVideo({ scrollPosition }: Hero3DVideoProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const frameRef = useRef<number | null>(null);
  const videoMeshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!mountRef.current) return;

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
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    camera.position.z = 5;

    // Create holographic video frame
    const geometry = new THREE.PlaneGeometry(4, 2.25);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      wireframe: true,
    });

    const videoFrame = new THREE.Mesh(geometry, material);
    videoFrame.position.set(0, 0, 0);
    scene.add(videoFrame);
    videoMeshRef.current = videoFrame;

    // Add glowing border effect
    const borderGeometry = new THREE.PlaneGeometry(4.2, 2.45);
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.1;
    scene.add(border);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Floating animation
      if (videoMeshRef.current) {
        videoMeshRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        videoMeshRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.2;
      }

      // Border pulse
      if (border.material instanceof THREE.MeshBasicMaterial) {
        border.material.opacity = 0.2 + Math.sin(Date.now() * 0.003) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      borderGeometry.dispose();
      borderMaterial.dispose();
    };
  }, []);

  // Scroll interaction
  useEffect(() => {
    if (!videoMeshRef.current) return;

    const scrollFactor = scrollPosition * 0.001;
    videoMeshRef.current.rotation.x = scrollFactor;
    videoMeshRef.current.position.z = -scrollFactor * 2;
  }, [scrollPosition]);

  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 pointer-events-none">
      {/* Video overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-96 h-56 bg-black/50 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
          <div className="absolute inset-2 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded flex items-center justify-center">
            <div className="text-cyan-400 text-6xl">▶</div>
          </div>
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-magenta-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
          <Image
            src={logo}
            alt={"title"}
            width={200}
            height={200}
            className="absolute -top-60 left-1/2 transform -translate-x-1/2  rounded-full "
          />
        </div>
      </div>
    </div>
  );
}
