"use client";

import type React from "react";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Maximize2 } from "lucide-react";
import Image from "next/image";
import { PortfolioItem } from "@/lib/client";

interface Portfolio3DCardProps {
  item: {
    id: string;
    title: string;
    category: string;
    image: string;
    type: string;
  };
  onOpenModal: (item: PortfolioItem) => void;
}

export function Portfolio3DCard({ item, onOpenModal }: Portfolio3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    setMousePosition({ x, y });
  };

  const transform3D = isHovered
    ? `perspective(1000px) rotateY(${mousePosition.x * 15}deg) rotateX(${
        -mousePosition.y * 15
      }deg) translateZ(20px)`
    : "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)";

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() =>
        onOpenModal({
          id: item.id,
          title: item.title,
          description: "",
          category: item.category,
          tags: [],
          image_url: item.image,
          project_url: "",
          github_url: "",
          status: "published",
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      style={{
        transform: transform3D,
        transition: "transform 0.3s ease-out",
      }}
    >
      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 relative">
        <div className="relative overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            width={400}
            height={256}
            style={{
              transform: isHovered
                ? `scale(1.1) translate(${mousePosition.x * 10}px, ${
                    mousePosition.y * 10
                  }px)`
                : "scale(1)",
            }}
          />

          {/* 3D Overlay Effects */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(${
                45 + mousePosition.x * 30
              }deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2))`,
            }}
          />

          {/* Floating Action Icons */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-4">
              {item.type === "video" && (
                <div
                  className="w-12 h-12 bg-cyan-500/80 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-lg shadow-cyan-500/50"
                  style={{
                    transform: `translateZ(30px) rotateY(${
                      -mousePosition.x * 10
                    }deg)`,
                  }}
                >
                  <Play className="w-6 h-6" />
                </div>
              )}
              <div
                className="w-12 h-12 bg-magenta-500/80 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-lg shadow-magenta-500/50"
                style={{
                  transform: `translateZ(30px) rotateY(${
                    -mousePosition.x * 10
                  }deg)`,
                }}
              >
                <Maximize2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <Badge
              className="bg-magenta-500/80 text-white backdrop-blur-sm shadow-lg"
              style={{
                transform: `translateZ(20px) rotateY(${
                  -mousePosition.x * 5
                }deg)`,
              }}
            >
              {item.category}
            </Badge>
          </div>

          {/* 3D Border Effect */}
          <div
            className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/50 transition-all duration-300"
            style={{
              boxShadow: isHovered
                ? `0 0 30px rgba(0,255,255,0.3), inset 0 0 30px rgba(255,0,255,0.1)`
                : "none",
            }}
          />
        </div>

        <CardContent className="p-6 relative">
          <h3
            className="text-xl font-semibold text-white mb-2 transition-all duration-300"
            style={{
              transform: `translateZ(10px) rotateY(${-mousePosition.x * 3}deg)`,
            }}
          >
            {item.title}
          </h3>
          <p
            className="text-gray-400"
            style={{
              transform: `translateZ(5px) rotateY(${-mousePosition.x * 2}deg)`,
            }}
          >
            {item.category}
          </p>

          {/* Floating Particles */}
          {isHovered && (
            <>
              <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
              <div className="absolute top-4 right-8 w-1 h-1 bg-magenta-400 rounded-full animate-pulse" />
              <div className="absolute bottom-4 left-6 w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
