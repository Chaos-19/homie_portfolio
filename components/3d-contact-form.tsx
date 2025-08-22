"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";

export function Contact3DForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const frameRef = useRef<number | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (!formRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    formRef.current.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    camera.position.z = 5;

    // Create floating grid
    const gridGeometry = new THREE.PlaneGeometry(8, 8, 20, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 4;
    scene.add(grid);

    // Create energy particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff00ff,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      grid.rotation.z += 0.005;
      particles.rotation.y += 0.01;

      // Pulse effect when form is focused
      if (focusedField) {
        grid.material.opacity = 0.4 + Math.sin(Date.now() * 0.01) * 0.2;
        particleMaterial.opacity = 0.8 + Math.sin(Date.now() * 0.008) * 0.2;
      } else {
        grid.material.opacity = 0.2;
        particleMaterial.opacity = 0.6;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (formRef.current && renderer.domElement) {
        formRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [focusedField]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="relative">
      {/* 3D Background */}
      <div
        ref={formRef}
        className="absolute inset-0 pointer-events-none opacity-30"
      />

      {/* Form */}
      <div className="relative z-10 p-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl border border-gray-700 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white">Send Message</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 transition-all duration-300 ${
                focusedField === "name"
                  ? "border-cyan-400 shadow-lg shadow-cyan-400/25 bg-gray-800/70"
                  : "focus:border-cyan-400"
              }`}
            />
            {focusedField === "name" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-md pointer-events-none" />
            )}
          </div>

          <div className="relative">
            <Input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 transition-all duration-300 ${
                focusedField === "email"
                  ? "border-cyan-400 shadow-lg shadow-cyan-400/25 bg-gray-800/70"
                  : "focus:border-cyan-400"
              }`}
            />
            {focusedField === "email" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-md pointer-events-none" />
            )}
          </div>

          <div className="relative">
            <Textarea
              placeholder="Tell me about your project..."
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              className={`bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none transition-all duration-300 ${
                focusedField === "message"
                  ? "border-cyan-400 shadow-lg shadow-cyan-400/25 bg-gray-800/70"
                  : "focus:border-cyan-400"
              }`}
            />
            {focusedField === "message" && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-md pointer-events-none" />
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-600 hover:to-magenta-600 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>

        {/* Floating particles */}
        {focusedField && (
          <>
            <div className="absolute top-4 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-magenta-400 rounded-full animate-pulse" />
            <div className="absolute top-1/2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
          </>
        )}
      </div>
    </div>
  );
}
