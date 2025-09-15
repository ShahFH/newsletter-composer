"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import { Edit, Send, Save, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

export default function NewsletterPreview() {
  const router = useRouter()
  const [subject, setSubject] = useState("")
  const [sections, setSections] = useState<NewsletterSection[]>([])
  const [template, setTemplate] = useState("header-content-footer")
  const [newsletterId, setNewsletterId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    action?: () => void
  }>({
    isOpen: false,
    title: "",
    description: "",
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const previewData = localStorage.getItem("newsletter-preview")
    if (previewData) {
      const data = JSON.parse(previewData)
      setSubject(data.subject || "")
      setSections(data.sections || [])
      setTemplate(data.template || "header-content-footer")
      setNewsletterId(data.newsletterId || null) // Track if this is an existing newsletter
    }
  }, [isClient])

  const handleBack = () => {
    router.push("/")
  }

  const handleEdit = () => {
    if (!isClient) return

    // Save current data to localStorage for the composer to pick up
    const editData = {
      subject,
      sections,
      template,
      newsletterId, // Pass the newsletter ID for editing
      isEditing: true,
    }

    try {
      localStorage.setItem("selected-template", JSON.stringify(editData))
      router.push("/")
    } catch (error) {
      console.error("Failed to save edit data:", error)
    }
  }

  const handleSend = () => {
    if (!isClient) return

    if (newsletterId) {
      // Update existing newsletter status
      const saved = localStorage.getItem("newsletters")
      if (saved) {
        const newsletters = JSON.parse(saved).map((n: any) =>
          n.id === newsletterId ? { ...n, status: "sent", updatedAt: new Date() } : n,
        )
        localStorage.setItem("newsletters", JSON.stringify(newsletters))
      }
    }

    setAlertDialog({
      isOpen: true,
      title: "Newsletter Sent Successfully!",
      description: "Your newsletter has been sent to all subscribers.",
      action: () => router.push("/dashboard"),
    })
  }

  const handleSaveDraft = () => {
    if (!isClient) return

    if (newsletterId) {
      // Update existing newsletter
      const saved = localStorage.getItem("newsletters")
      if (saved) {
        const newsletters = JSON.parse(saved).map((n: any) =>
          n.id === newsletterId
            ? {
                ...n,
                subject,
                sections,
                template,
                updatedAt: new Date(),
                status: "draft",
              }
            : n,
        )
        localStorage.setItem("newsletters", JSON.stringify(newsletters))
        setAlertDialog({
          isOpen: true,
          title: "Newsletter Updated Successfully!",
          description: "Your changes have been saved to the draft.",
        })
      }
    } else {
      // Create new newsletter
      const newsletter = {
        id: Date.now().toString(),
        subject,
        sections,
        template,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const saved = localStorage.getItem("newsletters")
      const newsletters = saved ? JSON.parse(saved) : []
      newsletters.push(newsletter)
      localStorage.setItem("newsletters", JSON.stringify(newsletters))

      setAlertDialog({
        isOpen: true,
        title: "Newsletter Saved as Draft!",
        description: "Your newsletter has been saved and can be edited later.",
      })
    }
  }

  const handleSchedule = () => {
    setAlertDialog({
      isOpen: true,
      title: "Schedule Newsletter",
      description: "Schedule functionality is coming soon. You can save as draft for now.",
    })
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold">Spaces</h1>
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="ml-4">Newsletter Preview</span>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white border rounded-lg p-8">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-balance">Newsletter Preview</h1>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleSend} className="bg-black text-white hover:bg-gray-800">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Newsletter Preview - Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <h1 className="text-xl font-bold">Subject: {subject || "Untitled Newsletter"}</h1>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                  {newsletterId ? "Draft" : "scheduled"}
                </Badge>
              </div>

              <div className="space-y-6">
                {/* Newsletter Title */}
                <h2 className="text-2xl font-bold">{subject || "Huge Summer Sale!"}</h2>

                {/* Newsletter Content */}
                {sections.length > 0 && sections.some((s) => s.content.trim()) ? (
                  sections.map(
                    (section) =>
                      section.content.trim() && (
                        <div key={section.id} className="prose max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: section.content }} />
                        </div>
                      ),
                  )
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Don't miss out on our biggest sale of the year. Get up to 50% off on selected items. Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua.
                    </p>
                    <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2">Shop Now</Button>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-8 mt-8 border-t text-sm text-gray-500 space-y-1">
                  <p>You are receiving this email because you subscribed to our newsletter.</p>
                  <p>
                    <a href="#" className="text-blue-600 hover:underline">
                      Unsubscribe
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className=" ">
              <CardContent className="py-6 px-0">
                <h3 className="font-semibold mb-4">Settings</h3>
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start border border-[#E5E7EB] rounded-[6px]"
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 mr-3" />
                    {newsletterId ? "Save Changes" : "Save as Draft"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start border border-[#E5E7EB] rounded-[6px]"
                    onClick={handleSchedule}
                  >
                    <Clock className="h-4 mr-3" />
                    Schedule Send
                  </Button>
                </div>
              </CardContent>
            </div>

            <div
              style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)" }}
              className=" border border-[#E5E7EB] rounded-[6px]"
            >
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Saved:</span>
                    <span className="font-medium">Today at {format(new Date(), "h:mm a")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Audience:</span>
                    <span className="font-medium">All Subscribers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count:</span>
                    <span className="font-medium">
                      {sections.reduce((count, section) => {
                        const text = section.content.replace(/<[^>]*>/g, "")
                        return count + text.split(" ").filter((word) => word.length > 0).length
                      }, 0) || 42}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Template:</span>
                    <span className="font-medium capitalize">{template.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{newsletterId ? "Editing Existing" : "New Newsletter"}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog
        open={alertDialog.isOpen}
        onOpenChange={(open) => setAlertDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setAlertDialog((prev) => ({ ...prev, isOpen: false }))
                if (alertDialog.action) {
                  alertDialog.action()
                }
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
            <h1></h1>
    </div>
  )
}
