"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Eye,
  Save,
  SendHorizontal,
  GripVertical,
  Trash2,
  Plus,
  CalendarIcon,
  Clock,
  FileText,
  ChevronLeft,
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
  const [editingNewsletterId, setEditingNewsletterId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    try {
      const templateData = localStorage.getItem("selected-template")
      if (templateData) {
        const template = JSON.parse(templateData)
        setSubject(template.subject || "")
        setSections(template.sections || defaultSections)
        setTemplate(template.template || "header-content-footer")

        // Check if we're editing an existing newsletter
        if (template.newsletterId && template.isEditing) {
          setEditingNewsletterId(template.newsletterId)
          setIsEditing(true)
        }

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

    if (isEditing && editingNewsletterId) {
      // Update existing newsletter
      const updated = savedNewsletters.map((newsletter) =>
        newsletter.id === editingNewsletterId
          ? {
              ...newsletter,
              subject,
              sections,
              template,
              scheduleDate: status === "scheduled" ? scheduleDate : newsletter.scheduleDate,
              status,
              updatedAt: new Date(),
            }
          : newsletter,
      )
      setSavedNewsletters(updated)

      try {
        localStorage.setItem("newsletters", JSON.stringify(updated))
      } catch (error) {
        console.error("Failed to update newsletter in localStorage:", error)
      }
    } else {
      // Create new newsletter
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
    if (isEditing && editingNewsletterId) {
      // Update existing newsletter status to sent
      const updated = savedNewsletters.map((newsletter) =>
        newsletter.id === editingNewsletterId
          ? {
              ...newsletter,
              subject,
              sections,
              template,
              status: "sent" as const,
              updatedAt: new Date(),
            }
          : newsletter,
      )
      setSavedNewsletters(updated)

      try {
        localStorage.setItem("newsletters", JSON.stringify(updated))
      } catch (error) {
        console.error("Failed to update newsletter in localStorage:", error)
      }
    } else {
      saveNewsletter("sent")
    }

    setShowSuccessDialog(true)
  }

  const handlePreview = () => {
    if (!isClient) return

    const previewData = {
      subject,
      sections,
      template,
      newsletterId: editingNewsletterId, // Pass the newsletter ID if editing
      timestamp: Date.now(),
    }

    try {
      localStorage.setItem("newsletter-preview", JSON.stringify(previewData))
      window.location.href = "/preview"
    } catch (error) {
      console.error("Failed to save preview data:", error)
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">{isEditing ? "Edit Newsletter" : "Newsletter Composer"}</div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-balance">{isEditing ? "Edit Newsletter" : "Compose Newsletter"}</h1>
            {isEditing && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Editing
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" onClick={handlePreview} className="py-2 px-5 bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleSaveDraft} className="py-2 px-5 bg-transparent">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Save Changes" : "Save as Draft"}
            </Button>
            <Button onClick={handleSend} className="bg-[#171717] text-white hover:bg-gray-800 py-2 px-5">
              <SendHorizontal className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Input */}
            <div className=" flex flex-col gap-2 bg-white p-[25px] border border-[#E5E7EB] rounded-[6px]">
              <label htmlFor="subject" className="text-sm font-medium mb-[8px] text-[#374151]">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Enter your newsletter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-[16px] text-[#6B7280] placeholder:text-[#6B7280] placeholder:text-[16px] bg-white py-[19px] px-[13px] rounedd-[6px]"
              />
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Content Sections</h2>
              {sections.map((section, index) => (
                <div key={section.id} className="relative bg-white border border-[#E5E7EB] p-[24px] rounded-[6px]">
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
                </div>
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
            <div
              style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)" }}
              className=" bg-white border border-[#E5E7EB] rounded-[6px] p-[25px]"
            >
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
                  className="w-full bg-[#F3F4F6]"
                  variant="outline"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Newsletter
                </Button>
              </CardContent>
            </div>

            {/* Email Preview */}
            <div
              style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)" }}
              className=" bg-white border border-[#E5E7EB] rounded-[6px] p-[25px]"
            >
              <CardHeader>
                <CardTitle className="text-base">Email Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                  <EmailPreview subject={subject} sections={sections} template={template} compact />
                </div>
              </CardContent>
            </div>

            {/* Edit Status or Saved Newsletters */}
            {isEditing ? (
              <div
                style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)" }}
                className=" bg-white border border-[#E5E7EB] rounded-[6px] p-[25px]"
              >
                <CardHeader>
                  <CardTitle className="text-base">Edit Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">Editing existing newsletter</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Changes will be saved to the original newsletter when you save or send.
                    </p>
                  </div>
                </CardContent>
              </div>
            ) : (
              savedNewsletters.length > 0 && (
                <div
                  style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)" }}
                  className=" bg-white border border-[#E5E7EB] rounded-[6px] px-[5px] py-[20px]"
                >
                  <CardHeader>
                    <CardTitle className="text-base">Recent Newsletters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {savedNewsletters.slice(-3).map((newsletter) => (
                        <div
                          key={newsletter.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm ">{newsletter.subject || "Untitled"}</span>
                          </div>
                          <Badge variant="secondary" className="">
                            {newsletter.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Newsletter Sent Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your newsletter has been sent successfully to all subscribers. You can view the sent newsletter in your
              dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessDialogClose}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
            <h1></h1>
    </div>
  )
}
