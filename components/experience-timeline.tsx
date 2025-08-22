"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Building } from "lucide-react"

interface ExperienceItem {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  description: string
  skills: string[]
  type: "work" | "freelance" | "education"
}

interface ExperienceTimelineProps {
  experiences: ExperienceItem[]
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "work":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "freelance":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "education":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500"></div>

      <div className="space-y-8">
        {experiences.map((experience, index) => (
          <div key={experience.id} className="relative flex items-start">
            {/* Timeline dot */}
            <div className="absolute left-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 shadow-lg shadow-blue-500/25"></div>

            {/* Content */}
            <div className="ml-16 flex-1">
              <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{experience.title}</h3>
                      <div className="flex items-center text-blue-400 mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        <span className="font-medium">{experience.company}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{experience.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getTypeColor(experience.type)} variant="outline">
                        {experience.type.charAt(0).toUpperCase() + experience.type.slice(1)}
                      </Badge>
                      <div className="flex items-center text-gray-400 text-sm mt-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {formatDate(experience.startDate)} -{" "}
                          {experience.endDate ? formatDate(experience.endDate) : "Present"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">{experience.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill) => (
                      <Badge key={skill} className="bg-gray-700 text-gray-300 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
