"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Save,
  Send,
  GripVertical,
  Trash2,
  Plus,
  CalendarIcon,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/rich-text-editor"
import { EmailPreview } from "@/components/email-preview"
import Link from "next/link"

interface NewsletterSection {
  id: string
  title: string
  content: string
}

interface Newsletter {
  id: string
  subject: string
  sections: NewsletterSection[]
  template: string
  scheduleDate?: Date
  status: "draft" | "scheduled" | "sent"
  createdAt: Date
  updatedAt: Date
}

const defaultSections: NewsletterSection[] = [
  { id: "1", title: "Header", content: "" },
  { id: "2", title: "Body", content: "" },
  { id: "3", title: "Footer", content: "" },
]

export default function NewsletterComposer() {
  const [subject, setSubject] = useState("")
  const [sections, setSections] = useState<NewsletterSection[]>(defaultSections)
  const [template, setTemplate] = useState("header-content-footer")
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [savedNewsletters, setSavedNewsletters] = useState<Newsletter[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    try {
      const templateData = localStorage.getItem("selected-template")
      if (templateData) {
        const template = JSON.parse(templateData)
        setSubject(template.subject)
        setSections(template.sections)
        setTemplate(template.template)

        // Clear the template data after loading
        localStorage.removeItem("selected-template")
      }
    } catch (error) {
      console.error("Failed to load template:", error)
    }

    // Load existing newsletters
    try {
      const saved = localStorage.getItem("newsletters")
      if (saved) {
        const newsletters = JSON.parse(saved).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
          scheduleDate: n.scheduleDate ? new Date(n.scheduleDate) : undefined,
        }))
        setSavedNewsletters(newsletters)
      }
    } catch (error) {
      console.error("Failed to load newsletters from localStorage:", error)
    }
  }, [isClient])

  const updateSection = (id: string, content: string) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, content } : section)))
  }

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id))
  }

  const addSection = () => {
    const newSection: NewsletterSection = {
      id: Date.now().toString(),
      title: `Section ${sections.length + 1}`,
      content: "",
    }
    setSections((prev) => [...prev, newSection])
  }

  const moveSection = (fromIndex: number, toIndex: number) => {
    setSections((prev) => {
      const newSections = [...prev]
      const [removed] = newSections.splice(fromIndex, 1)
      newSections.splice(toIndex, 0, removed)
      return newSections
    })
  }

  const saveNewsletter = (status: "draft" | "scheduled") => {
    if (!isClient) return

    const newsletter: Newsletter = {
      id: Date.now().toString(),
      subject,
      sections,
      template,
      scheduleDate: status === "scheduled" ? scheduleDate : undefined,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updated = [...savedNewsletters, newsletter]
    setSavedNewsletters(updated)

    try {
      localStorage.setItem("newsletters", JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to save newsletter to localStorage:", error)
    }
  }

  const handleSaveDraft = () => {
    saveNewsletter("draft")
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 500)
  }

  const handleSchedule = () => {
    if (scheduleDate) {
      saveNewsletter("scheduled")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 500)
    }
  }

  const handleSend = () => {
    saveNewsletter("sent")
    // In a real app, this would trigger the email sending
    alert("Newsletter sent successfully!")
  }

  const handlePreview = () => {
    if (!isClient) return

    const previewData = {
      subject,
      sections,
      template,
      timestamp: Date.now(),
    }

    try {
      localStorage.setItem("newsletter-preview", JSON.stringify(previewData))
      window.location.href = "/preview"
    } catch (error) {
      console.error("Failed to save preview data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">Newsletter Composer</div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-balance">New Composer</h1>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button size="sm" onClick={handleSend} className="bg-[#171717] text-white hover:bg-gray-800">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Input */}
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Enter your newsletter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Content Sections</h2>
              {sections.map((section, index) => (
                <Card key={section.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-grab"
                        onMouseDown={(e) => {
                          // Simple drag implementation would go here
                          // For now, just visual feedback
                        }}
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSection(section.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RichTextEditor
                      content={section.content}
                      onChange={(content) => updateSection(section.id, content)}
                      placeholder={`${section.title} content...`}
                    />
                  </CardContent>
                </Card>
              ))}

              {/* Add Section Button */}
              <Button
                variant="ghost"
                onClick={addSection}
                className="w-full border-2 border-dashed border-muted-foreground/25 h-16 hover:border-muted-foreground/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Schedule Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Schedule Date</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduleDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={handleSchedule}
                  disabled={!scheduleDate}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Newsletter
                </Button>
              </CardContent>
            </Card>

            {/* Layout Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="header-content-footer">Header + Content + Footer</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Email Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                  <EmailPreview subject={subject} sections={sections} template={template} compact />
                </div>
              </CardContent>
            </Card>

            {/* Saved Newsletters */}
            {savedNewsletters.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Newsletters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedNewsletters.slice(-3).map((newsletter) => (
                      <div key={newsletter.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm truncate">{newsletter.subject || "Untitled"}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {newsletter.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
