"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Save, Loader2 } from "lucide-react"
import type { PortfolioItem } from "@/lib/client"
import { createPortfolioItem, updatePortfolioItem } from "@/lib/portfolio"

interface PortfolioFormProps {
  item?: PortfolioItem
  onSave: (item: PortfolioItem) => void
  onCancel: () => void
}

export function PortfolioForm({ item, onSave, onCancel }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    category: item?.category || "",
    description: item?.description || "",
    image_url: item?.image_url || "",
    project_url: item?.project_url || "",
    github_url: item?.github_url || "",
    status: item?.status || ("draft" as "draft" | "published"),
    featured: item?.featured || false,
    tags: item?.tags || [],
  })

  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let savedItem: PortfolioItem

      if (item?.id) {
        // Update existing item
        savedItem = await updatePortfolioItem(item.id, formData)
      } else {
        // Create new item
        savedItem = await createPortfolioItem(formData)
      }

      onSave(savedItem)
    } catch (error) {
      console.error("Error saving portfolio item:", error)
      // You could add toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  return (
    <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white">{item ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Project Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                  <SelectItem value="Video Editing">Video Editing</SelectItem>
                  <SelectItem value="Motion Graphics">Motion Graphics</SelectItem>
                  <SelectItem value="Branding">Branding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white focus:border-blue-400 min-h-[100px]"
              placeholder="Describe your project..."
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image_url" className="text-gray-300">
                Image URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  placeholder="Enter image URL..."
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_url" className="text-gray-300">
                  Project URL (Optional)
                </Label>
                <Input
                  id="project_url"
                  value={formData.project_url}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  placeholder="https://project-demo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url" className="text-gray-300">
                  GitHub URL (Optional)
                </Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-300">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "published" | "draft") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Featured Project</Label>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <Label htmlFor="featured" className="text-gray-300 text-sm">
                  Show on homepage
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                placeholder="Add a tag..."
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {item ? "Update Project" : "Save Project"}
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
