"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Filter,
  Search,
  Grid,
  List,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedPortfolioItems, getPortfolioItems } from "@/lib/portfolio";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  type: "image" | "video";
  status: "published" | "draft";
  tags: string[];
  views: number;
  date: string;
}

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    async function fetchExpr() {
      const portfolioData = await getPortfolioItems();
      setPortfolioItems(
        portfolioData.map((data) => ({
          id: data.id,
          title: data.title,
          category: data.category,
          description: data.description,
          image: data.image_url,
          type: data.image_url.endsWith(".mp4") ? "video" : "image",
          status: "published",
          tags: data.tags,
          date: data.created_at,
          views: 245,
        }))
      );
    }

    fetchExpr();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(portfolioItems.map((item) => item.category))),
  ];

  const filteredItems = portfolioItems.filter((item) => {
    const matchesFilter =
      activeFilter === "All" || item.category === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesFilter && matchesSearch && item.status === "published";
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-blue-400">Portfolio</h1>
                <p className="text-gray-400">
                  Explore my creative work and projects
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white focus:border-blue-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  variant={activeFilter === category ? "default" : "outline"}
                  size="sm"
                  className={`transition-all duration-300 ${
                    activeFilter === category
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
                  }`}
                >
                  <Filter className="w-3 h-3 mr-2" />
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 overflow-y-scroll h-full pb-52">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">
            Showing {filteredItems.length} of{" "}
            {
              portfolioItems.filter((item) => item.status === "published")
                .length
            }{" "}
            projects
          </p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="bg-gray-800 border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-video overflow-hidden">
                  {!item.image.endsWith(".mp4") ? (
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      className="object-cover group-hover:scale-105 transition-transform duration-300 w-full"
                      autoPlay
                      loop
                      playsInline
                    >
                      <source
                        src={item.image || "/placeholder.svg"}
                        type="video/mp4"
                      />
                    </video>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {item.type === "video" ? "Video" : "Image"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-gray-700 text-gray-300 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      {item.views}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                      {!item.image.endsWith(".mp4") ? (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <video
                          className="object-cover group-hover:scale-105 transition-transform duration-300 w-full"
                          autoPlay
                          loop
                          playsInline
                        >
                          <source
                            src={item.image || "/placeholder.svg"}
                            type="video/mp4"
                          />
                        </video>
                      )}
                      <Badge className="absolute top-2 right-2 bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        {item.type === "video" ? "Video" : "Image"}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(item.date)}
                        </div>
                      </div>
                      <Badge className="bg-gray-700 text-gray-300 mb-3">
                        {item.category}
                      </Badge>
                      <p className="text-gray-400 mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-gray-700 text-gray-300 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {item.views} views
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No projects found matching your criteria.
            </p>
            <Button
              onClick={() => {
                setActiveFilter("All");
                setSearchTerm("");
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div className="aspect-video relative">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedItem.title}
                    </h2>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {selectedItem.category}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div className="flex items-center mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(selectedItem.date)}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedItem.views} views
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {selectedItem.description}
                </p>
                <div className="flex gap-2 mb-6">
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} className="bg-gray-700 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Project
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
                  >
                    Contact About This Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
