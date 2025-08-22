"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Briefcase,
  User,
  Settings,
  Eye,
  Edit,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { PortfolioForm } from "@/components/portfolio-form";
import { ExperienceForm } from "@/components/experience-form";
import type { PortfolioItem, Experience } from "@/lib/client";
import {
  getPortfolioItems,
  deletePortfolioItem,
  createPortfolioItem,
} from "@/lib/portfolio";
import {
  getExperience,
  deleteExperience,
  createExperience,
} from "@/lib/experience";
import { getSettings, updateSetting } from "@/lib/settings";
import { create } from "domain";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [showForm, setShowForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [experienceItems, setExperienceItems] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [settings, setSettings] = useState({
    logo: "",
    socialMedia: {
      twitter: "",
      linkedin: "",
      instagram: "",
      behance: "",
      dribbble: "",
      github: "",
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [portfolioData, experienceData, settingsData] = await Promise.all([
        getPortfolioItems(),
        getExperience(),
        getSettings(),
      ]);

      setPortfolioItems(portfolioData);
      setExperienceItems(experienceData);

      const settingsMap = settingsData.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      setSettings({
        logo: settingsMap.logo_url || "",
        socialMedia: {
          twitter: settingsMap.twitter_url || "",
          linkedin: settingsMap.linkedin_url || "",
          instagram: settingsMap.instagram_url || "",
          behance: settingsMap.behance_url || "",
          dribbble: settingsMap.dribbble_url || "",
          github: settingsMap.github_url || "",
        },
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const portfolioStats = {
    totalProjects: portfolioItems.length,
    published: portfolioItems.filter((item) => item.status === "published")
      .length,
    drafts: portfolioItems.filter((item) => item.status === "draft").length,
    views: 0, // Views not implemented in current schema
  };

  const handleSaveItem = (itemData: PortfolioItem) => {
    createPortfolioItem(itemData)
      .then((newItem) => {
        setPortfolioItems((prev) => [...prev, newItem]);
      })
      .catch((error) => {
        console.error("Error saving portfolio item:", error);
      });

    //loadData();
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSaveExperience = (experienceData: Omit<Experience, "id">) => {
    // Refresh the experience list after save

    createExperience(experienceData);

    // loadData();
    setShowExperienceForm(false);
    setEditingExperience(null);
  };

  const handleEditExperience = (item: Experience) => {
    setEditingExperience(item);
    setShowExperienceForm(true);
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteExperience(id);
      setExperienceItems(experienceItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deletePortfolioItem(id);
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await Promise.all([
        updateSetting("logo_url", settings.logo),
        updateSetting("twitter_url", settings.socialMedia.twitter),
        updateSetting("linkedin_url", settings.socialMedia.linkedin),
        updateSetting("instagram_url", settings.socialMedia.instagram),
        updateSetting("behance_url", settings.socialMedia.behance),
        updateSetting("dribbble_url", settings.socialMedia.dribbble),
        updateSetting("github_url", settings.socialMedia.github),
      ]);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <PortfolioForm
          item={editingItem as PortfolioItem | undefined}
          onSave={handleSaveItem}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  if (showExperienceForm) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <ExperienceForm
          item={editingExperience}
          onSave={handleSaveExperience}
          onCancel={() => {
            setShowExperienceForm(false);
            setEditingExperience(null);
          }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-400">
              Creative Dashboard
            </h1>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Admin
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Portfolio Page
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex overflow-y-scroll">
        <aside className="w-64 bg-gray-800 min-h-screen p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "portfolio"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Portfolio</span>
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "experience"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Experience</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8 h-[calc(100vh_-_80px)] overflow-y-scroll">
          {activeTab === "portfolio" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-blue-400">
                  Portfolio Management
                </h2>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Total Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {portfolioStats.totalProjects}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Published
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">
                      {portfolioStats.published}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Drafts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">
                      {portfolioStats.drafts}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      Total Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400">
                      {portfolioStats.views}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">All Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioItems.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-white">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {project.category}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {project.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            className={`${
                              project.status === "published"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            }`}
                          >
                            {project.status}
                          </Badge>
                          {project.featured && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                              Featured
                            </Badge>
                          )}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditItem(project)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteItem(project.id)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-blue-400">
                  Experience Management
                </h2>
                <Button
                  onClick={() => setShowExperienceForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Work Experience & Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experienceItems.map((experience) => (
                      <div
                        key={experience.id}
                        className="flex items-start justify-between p-4 bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-white">
                              {experience.title}
                            </h3>
                            <Badge
                              className={`text-xs ${
                                experience.type === "work"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : experience.type === "freelance"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              }`}
                            >
                              {experience.type}
                            </Badge>
                            {experience.is_current && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 mb-1">
                            {experience.company}{" "}
                            {experience.location && `• ${experience.location}`}
                          </p>
                          <p className="text-sm text-gray-400 mb-2">
                            {new Date(experience.start_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                              }
                            )}{" "}
                            -{" "}
                            {experience.is_current
                              ? "Present"
                              : experience.end_date
                              ? new Date(
                                  experience.end_date
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                })
                              : "Present"}
                          </p>
                          <p className="text-sm text-gray-300 mb-3">
                            {experience.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {experience.skills.slice(0, 4).map((skill) => (
                              <Badge
                                key={skill}
                                className="bg-gray-600 text-gray-300 text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {experience.skills.length > 4 && (
                              <Badge className="bg-gray-600 text-gray-300 text-xs">
                                +{experience.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleEditExperience(experience)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteExperience(experience.id)
                            }
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-3xl font-bold text-blue-400 mb-8">
                Settings
              </h2>

              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Logo & Branding
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="logo" className="text-gray-300">
                        Logo URL
                      </Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Input
                          id="logo"
                          value={settings.logo}
                          onChange={(e) =>
                            setSettings({ ...settings, logo: e.target.value })
                          }
                          className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                          placeholder="Enter logo URL..."
                        />
                      </div>
                      {settings.logo && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-400 mb-2">
                            Current Logo:
                          </p>
                          <img
                            src={settings.logo || "/placeholder.svg"}
                            alt="Logo preview"
                            className="w-32 h-32 object-contain bg-gray-700 rounded-lg p-2"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Social Media Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="twitter" className="text-gray-300">
                          Twitter/X
                        </Label>
                        <Input
                          id="twitter"
                          value={settings.socialMedia.twitter}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialMedia: {
                                ...settings.socialMedia,
                                twitter: e.target.value,
                              },
                            })
                          }
                          className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                          placeholder="https://twitter.com/username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="linkedin" className="text-gray-300">
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          value={settings.socialMedia.linkedin}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialMedia: {
                                ...settings.socialMedia,
                                linkedin: e.target.value,
                              },
                            })
                          }
                          className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="instagram" className="text-gray-300">
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          value={settings.socialMedia.instagram}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialMedia: {
                                ...settings.socialMedia,
                                instagram: e.target.value,
                              },
                            })
                          }
                          className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                          placeholder="https://instagram.com/username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="behance" className="text-gray-300">
                          Behance
                        </Label>
                        <Input
                          id="behance"
                          value={settings.socialMedia.behance}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialMedia: {
                                ...settings.socialMedia,
                                behance: e.target.value,
                              },
                            })
                          }
                          className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                          placeholder="https://behance.net/username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="dribbble" className="text-gray-300">
                          Dribbble
                        </Label>
                        <Input
                          id="dribbble"
                          value={settings.socialMedia.dribbble}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialMedia: {
                                ...settings.socialMedia,
                                dribbble: e.target.value,
                              },
                            })
                          }
                          className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                          placeholder="https://dribbble.com/username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="github" className="text-gray-300">
                          GitHub
                        </Label>
                        <Input
                          id="github"
                          value={settings.socialMedia.github}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialMedia: {
                                ...settings.socialMedia,
                                github: e.target.value,
                              },
                            })
                          }
                          className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSavingSettings ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
