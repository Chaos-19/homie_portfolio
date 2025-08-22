"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Link } from "lucide-react";
import { FloatingShapes } from "@/components/floating-shapes";
import { ScrollParallax } from "@/components/scroll-parallax";
import { Hero3DVideo } from "@/components/3d-hero-video";
import { Portfolio3DCard } from "@/components/3d-portfolio-card";
import { Portfolio3DModal } from "@/components/3d-portfolio-modal";
import { Service3DTile } from "@/components/3d-service-tile";
import { Testimonials3DCarousel } from "@/components/3d-testimonials-carousel";
import { Contact3DForm } from "@/components/3d-contact-form";
import { FloatingSocialIcons } from "@/components/floating-social-icons";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { getExperience } from "@/lib/experience";
import { Experience, PortfolioItem } from "@/lib/client";
import { getFeaturedPortfolioItems } from "@/lib/portfolio";
import { Header } from "@/components/header";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function CreativePortfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] =
    useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mousePosition = useMousePosition();
  const scrollPosition = useScrollPosition();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    async function fetchExpr() {
      const result = await getExperience();
      setExperiences(result);
      const portfolioData = await getFeaturedPortfolioItems();
      setPortfolioItems(portfolioData);

      console.log("Fetched portfolio items:", portfolioData);
      console.log("Fetched experiences:", result);
    }

    fetchExpr();
    setIsVisible(true);
  }, []);

  const testimonials = [
    {
      name: "Zewengel tilahun",
      company: "Creative Agency",
      text: "Professional, creative, and delivered on time. The motion graphics brought our brand to life!",
    },
    {
      name: "Estifanos getachew",
      company: "Tech Startup",
      text: "Absolutely incredible work! The video editing was flawless and the graphics were exactly what we envisioned.",
    },
    {
      name: "Tadese sewnet",
      company: "E-commerce Brand",
      text: "Outstanding attention to detail. The social media content increased our engagement by 300%.",
    },
  ];

  const services = [
    {
      title: "Branding & Identity",
      description:
        "Unique brand identity design including logos, color palettes, typography, and style guides.",
      icon: "branding",
    },
    {
      title: "Graphic Design",
      description:
        "Creative designs for marketing, print, and digital platforms that make brands stand out.",
      icon: "design",
    },
    {
      title: "Social Media Management",
      description:
        "Content planning, strategy, and account management to grow engagement and online presence.",
      icon: "management",
    },
    {
      title: "Social Media Video Editing",
      description:
        "High-impact short-form videos, reels, and promos tailored for platforms like Instagram, TikTok, and YouTube.",
      icon: "video",
    },
  ];

  const filteredItems =
    activeFilter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  const handleOpenModal = (item: PortfolioItem) => {
    setSelectedPortfolioItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPortfolioItem(null);
  };

  return (
    <div className=" bg-gray-950 text-white">
      <Header title="BEKI" />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-gray-950 to-slate-700/20"></div>
        <ScrollParallax speed={0.3} className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/abstract-digital-pattern-dark.png')] bg-cover bg-center opacity-10"></div>
        </ScrollParallax>

        <FloatingShapes mousePosition={mousePosition} />

        <Hero3DVideo scrollPosition={scrollPosition} />

        <div
          className={`relative z-10 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            transform: `translateY(${scrollPosition * 0.5}px)`,
          }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-slate-200 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
            Beki Graphics
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-wide">
            CREATIVE VISUALS IN MOTION
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/portfolio">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/25">
                View Portfolio
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-slate-400 text-slate-300 hover:bg-slate-700 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-transparent shadow-lg shadow-slate-500/25"
            >
              Get In Touch
            </Button>
          </div>
        </div>

        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/30"></div>
        <div className="absolute bottom-40 right-32 w-3 h-3 bg-slate-400 rounded-full animate-bounce shadow-lg shadow-slate-400/30"></div>
        <div className="absolute top-1/2 left-10 w-1 h-1 bg-blue-300 rounded-full animate-ping shadow-lg shadow-blue-300/30"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-slate-300 rounded-full animate-pulse shadow-lg shadow-slate-300/30"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-blue-200 rounded-full animate-ping shadow-lg shadow-blue-200/30"></div>
      </section>

      {/* About Me Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">
              About Me
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              I&apos;m Bereket Abenet, a creative professional with 3+ years of
              experience in graphic design, social media management, and social
              media video editing. I craft scroll-stopping visuals and
              short-form videos that drive engagement and strengthen brand
              presence.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Combining technical expertise with artistic vision, I deliver
              designs and campaigns— from brand assets to reels and promos—that
              look great and achieve measurable results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                3+ Years Experience
              </Badge>
              <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                80+ Projects
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Social Media Strategy
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Social Media Video Editing
              </Badge>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 p-1">
                <Image
                  src={logo}
                  alt="Alex Creative"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-slate-300">
          Portfolio
        </h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["All", "Graphic Design", "Video Editing", "Motion Graphics"].map(
            (filter) => (
              <Button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {filter}
              </Button>
            )
          )}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Portfolio3DCard
              key={item.id}
              item={{
                id: item.id,
                title: item.title,
                category: item.category,
                image: item.image_url,
                type: item.image_url.includes(".mp4") ? "video" : "image",
              }}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-400">
          Experience
        </h2>
        <ExperienceTimeline
          experiences={experiences.map((data) => ({
            id: data.id,
            title: data.title,
            company: data.company,
            location: data.location || "Remote",
            startDate: data.start_date,
            endDate: data.end_date || null,
            description: data.description,
            skills: data.skills,
            type: data.type,
          }))}
        />
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-slate-300">
          Services
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Service3DTile
              key={index}
              service={service}
              index={index}
              scrollPosition={scrollPosition}
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-400">
          Testimonials
        </h2>
        <Testimonials3DCarousel testimonials={testimonials} />
      </section>

      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-slate-300">
          Get In Touch
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <FloatingSocialIcons scrollPosition={scrollPosition} />
          <Contact3DForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">© 2024 Beki . All rights reserved.</p>
        </div>
      </footer>

      <Portfolio3DModal
        item={{
          id: selectedPortfolioItem ? Number(selectedPortfolioItem.id) : 0,
          title: selectedPortfolioItem ? selectedPortfolioItem.title : "",

          category: selectedPortfolioItem
            ? selectedPortfolioItem.category
            : "Uncategorized",
          image: selectedPortfolioItem
            ? selectedPortfolioItem.image_url
            : "/placeholder-image.png",

          type:
            selectedPortfolioItem &&
            selectedPortfolioItem.image_url.includes(".mp4")
              ? "video"
              : "image",
        }}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
