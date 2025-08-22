"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Experience } from "@/lib/client"

/* interface ExperienceItem {
  id: number
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  type: "work" | "freelance" | "education"
  description: string
  skills: string[]
} */

interface ExperienceFormProps {
  item?: Experience | null
  onSave: (item: Omit<Experience, "id">) => void
  onCancel: () => void
}

export function ExperienceForm({ item, onSave, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    company: item?.company || "",
    location: item?.location || "",
    startDate: item?.start_date || "",
    endDate: item?.end_date || "",
    current: item?.is_current || false,
    type: item?.type || ("work" as "work" | "freelance" | "education"),
    description: item?.description || "",
    skills: item?.skills || [],
  })

  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title: formData.title,
      company: formData.company,
      location: formData.location,
      start_date: formData.startDate,
      end_date: formData.endDate,
      is_current: formData.current,
      type: formData.type,
      description: formData.description,
      skills: formData.skills,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-400">{item ? "Edit Experience" : "Add New Experience"}</h2>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-transparent"
        >
          Cancel
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Experience Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Position/Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  placeholder="e.g., Senior Graphic Designer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-gray-300">
                  Company/Institution *
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  placeholder="e.g., Creative Agency Inc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-gray-300">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-gray-300">
                  Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "work" | "freelance" | "education") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="work">Full-time Work</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="startDate" className="text-gray-300">
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate" className="text-gray-300">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  disabled={formData.current}
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="current"
                    checked={formData.current}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        current: e.target.checked,
                        endDate: e.target.checked ? "" : formData.endDate,
                      })
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="current" className="text-gray-300 text-sm">
                    Currently working here
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-400 min-h-[120px]"
                placeholder="Describe your role, responsibilities, and achievements..."
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Skills & Technologies</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                />
                <Button type="button" onClick={handleAddSkill} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex items-center gap-1"
                  >
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {item ? "Update Experience" : "Add Experience"}
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:border-gray-500 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
