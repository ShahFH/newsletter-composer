"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Send, Trash2 } from "lucide-react"
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

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

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
  }, [isClient])

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
      timestamp: Date.now(),
    }

    try {
      localStorage.setItem("newsletter-preview", JSON.stringify(previewData))
      window.location.href = "/preview"
    } catch (error) {
      console.error("Failed to save preview data:", error)
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
      alert("Newsletter sent successfully!")
    } catch (error) {
      console.error("Failed to update newsletter:", error)
    }
  }

  const handleDelete = (newsletter: Newsletter) => {
    if (!isClient) return

    if (confirm("Are you sure you want to delete this newsletter?")) {
      const updatedNewsletters = newsletters.filter((n) => n.id !== newsletter.id)
      setNewsletters(updatedNewsletters)

      try {
        localStorage.setItem("newsletters", JSON.stringify(updatedNewsletters))
      } catch (error) {
        console.error("Failed to delete newsletter:", error)
      }
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
            { key: "all", label: "All" },
            { key: "drafts", label: "Drafts" },
            { key: "scheduled", label: "Scheduled" },
            { key: "sent", label: "Sent" },
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
                  <th className="text-left py-3 px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    NAME
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    STATUS
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    SUBJECT
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    SENT
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                    SCHEDULED
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
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
                      <td className="py-4 px-4 font-medium text-[#111827] text-[14px]">{newsletter.subject || "Untitled"}</td>
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
                            {newsletter.status !== "sent" && (
                              <DropdownMenuItem onClick={() => handleSend(newsletter)}>
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDelete(newsletter)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
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
    </div>
  )
}
