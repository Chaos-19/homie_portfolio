"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Telegram from "@/public/telegram.svg";
import Link from "next/link";

interface FloatingSocialIconsProps {
  scrollPosition: number;
}

export function FloatingSocialIcons({
  scrollPosition,
}: FloatingSocialIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const frameRef = useRef<number | null>(null);
  const orbitsRef = useRef<THREE.Group[]>([]);

  const socialLinks = [
    {
      icon: Mail,
      href: "https://t.me/+251927701582",
      color: "text-gray-400",
      hoverColor: "hover:text-white",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/bereket-abenet-23b891234?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      color: "text-blue-400",
      hoverColor: "hover:text-blue-300",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/bereketabenet?utm_source=qr&igsh=MzNlNGNkZWQ4Mg==",
      color: "text-pink-400",
      hoverColor: "hover:text-pink-300",
    },
    {
      icon: Mail,
      href: "mailto:bereketabenetinsae@gmail.com",
      color: "text-cyan-400",
      hoverColor: "hover:text-cyan-300",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "bereketabenetinsae@gmail.com",
      color: "text-cyan-400",
    },
    { icon: Phone, text: "+251 927701582", color: "text-cyan-400" },
    { icon: MapPin, text: "Addis Ababa , Mexico", color: "text-cyan-400" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(300, 300);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    camera.position.z = 5;

    // Create orbital rings
    const orbits: THREE.Group[] = [];
    const colors = [0x00ffff, 0xff00ff, 0x0080ff, 0xff0080];

    for (let i = 0; i < 4; i++) {
      const orbit = new THREE.Group();
      const radius = 1.5 + i * 0.5;

      // Create ring geometry
      const ringGeometry = new THREE.RingGeometry(
        radius - 0.02,
        radius + 0.02,
        32
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.3,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      orbit.add(ring);

      // Create floating point on ring
      const pointGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const pointMaterial = new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.8,
      });
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      point.position.x = radius;
      orbit.add(point);

      scene.add(orbit);
      orbits.push(orbit);
    }

    orbitsRef.current = orbits;

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      orbits.forEach((orbit, index) => {
        orbit.rotation.z += (0.01 + index * 0.005) * (index % 2 === 0 ? 1 : -1);

        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.1;
        orbit.scale.setScalar(scale);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      orbits.forEach((orbit) => {
        orbit.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      });
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white mb-6">
          Let&apos;s Create Something Amazing
        </h3>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Ready to bring your vision to life? I&apos;d love to hear about your
          project and discuss how we can work together.
        </p>

        {contactInfo.map((item, index) => (
          <div key={index} className="flex items-center gap-4 group">
            <div className="p-2 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors duration-300">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* 3D Social Icons */}
      <div className="relative">
        <div
          ref={containerRef}
          className="absolute inset-0 pointer-events-none opacity-40"
        />

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <h4 className="text-lg font-semibold text-white">Follow My Work</h4>

          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <Link
                href={social.href}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className={`border-gray-600 ${social.color} ${social.hoverColor} bg-transparent hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: `float 3s ease-in-out infinite`,
                  }}
                >
                  {social.href.includes("t.me") ? (
                    <Image
                      src={Telegram}
                      alt="Telegram"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <social.icon className="w-5 h-5" />
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
