"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, MoreHorizontal, Eye, Send, Trash2, Edit } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface Newsletter {
  id: string
  subject: string
  sections: any[]
  template: string
  scheduleDate?: Date
  status: "draft" | "scheduled" | "sent"
  createdAt: Date
  updatedAt: Date
}

export default function Dashboard() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "drafts" | "scheduled" | "sent">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    loadNewsletters()
  }, [isClient])

  const loadNewsletters = () => {
    try {
      const saved = localStorage.getItem("newsletters")
      if (saved) {
        const parsedNewsletters = JSON.parse(saved).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
          scheduleDate: n.scheduleDate ? new Date(n.scheduleDate) : undefined,
        }))
        setNewsletters(parsedNewsletters)
      }
    } catch (error) {
      console.error("Failed to load newsletters:", error)
    }
  }

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const matchesTab = activeTab === "all" || newsletter.status === activeTab
    const matchesSearch = newsletter.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handlePreview = (newsletter: Newsletter) => {
    if (!isClient) return

    const previewData = {
      subject: newsletter.subject,
      sections: newsletter.sections,
      template: newsletter.template,
      newsletterId: newsletter.id, // Pass the newsletter ID
      timestamp: Date.now(),
    }

    try {
      localStorage.setItem("newsletter-preview", JSON.stringify(previewData))
      window.location.href = "/preview"
    } catch (error) {
      console.error("Failed to save preview data:", error)
    }
  }

  const handleEdit = (newsletter: Newsletter) => {
    if (!isClient) return

    const editData = {
      subject: newsletter.subject,
      sections: newsletter.sections,
      template: newsletter.template,
      newsletterId: newsletter.id,
      isEditing: true,
    }

    try {
      localStorage.setItem("selected-template", JSON.stringify(editData))
      window.location.href = "/"
    } catch (error) {
      console.error("Failed to save edit data:", error)
    }
  }

  const handleSend = (newsletter: Newsletter) => {
    if (!isClient) return

    const updatedNewsletters = newsletters.map((n) =>
      n.id === newsletter.id ? { ...n, status: "sent" as const, updatedAt: new Date() } : n,
    )
    setNewsletters(updatedNewsletters)

    try {
      localStorage.setItem("newsletters", JSON.stringify(updatedNewsletters))
      setSuccessMessage(`"${newsletter.subject}" has been sent to your subscribers.`)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Failed to update newsletter:", error)
      setSuccessMessage("Failed to send newsletter. Please try again.")
      setShowSuccessDialog(true)
    }
  }

  const handleDelete = (newsletter: Newsletter) => {
    if (!isClient) return

    const updatedNewsletters = newsletters.filter((n) => n.id !== newsletter.id)
    setNewsletters(updatedNewsletters)

    try {
      localStorage.setItem("newsletters", JSON.stringify(updatedNewsletters))
      setSuccessMessage(`"${newsletter.subject}" has been deleted successfully.`)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Failed to delete newsletter:", error)
      setSuccessMessage("Failed to delete newsletter. Please try again.")
      setShowSuccessDialog(true)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Draft
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            Scheduled
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Sent
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const displayNewsletters = filteredNewsletters

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="text-sm text-muted-foreground">Newsletters</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-balance">Your Newsletters</h1>
          <Link href="/">
            <Button className="bg-[#171717] text-white hover:bg-gray-800 py-2 px-4">Create Newsletter</Button>
          </Link>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          {[
            {
              key: "all",
              label: "All",
            },
            {
              key: "drafts",
              label: "Drafts",
            },
            {
              key: "scheduled",
              label: "Scheduled",
            },
            {
              key: "sent",
              label: "Sent",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-black text-black"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative mb-6 max-w-md bg-white rounded-[8px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search newsletters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-[21px]"
          />
        </div>

        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-[#F9FAFB]">
                <tr>
                  <th className="text-left py-[16px] px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    NAME
                  </th>
                  <th className="text-left px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    STATUS
                  </th>
                  <th className="text-left px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    SUBJECT
                  </th>
                  <th className="text-left px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    SENT
                  </th>
                  <th className="text-left px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    SCHEDULED
                  </th>
                  <th className="text-left px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayNewsletters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No newsletters found.{" "}
                      <Link href="/" className="text-blue-600 hover:underline">
                        Create your first newsletter
                      </Link>
                    </td>
                  </tr>
                ) : (
                  displayNewsletters.map((newsletter: any) => (
                    <tr key={newsletter.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-[#111827] text-[14px]">
                        {newsletter.subject || "Untitled"}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(newsletter.status)}</td>
                      <td className="py-4 px-4 text-muted-foreground font-normal text-[14px] max-w-xs">
                        {newsletter.sections
                          ?.find((s: any) => s.content)
                          ?.content?.replace(/<[^>]*>/g, "")
                          .substring(0, 50) || "No content"}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {newsletter.status === "sent" ? format(newsletter.updatedAt || new Date(), "MMM d, yyyy") : "-"}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {newsletter.scheduleDate ? format(newsletter.scheduleDate, "MMM d, yyyy") : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreview(newsletter)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(newsletter)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {newsletter.status !== "sent" && (
                              <DropdownMenuItem onClick={() => handleSend(newsletter)}>
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </DropdownMenuItem>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Newsletter</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{newsletter.subject}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(newsletter)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success</AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <h1></h1>
    </div>
  )
}
