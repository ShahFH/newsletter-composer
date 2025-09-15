"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

const templates = [
  {
    id: "simple",
    name: "Simple Template",
    description: "Clean and minimal design perfect for newsletters",
    icon: FileText,
    preview: {
      subject: "Welcome to our Newsletter",
      sections: [
        { id: "1", title: "Header", content: "<h2>Welcome to Our Newsletter</h2>" },
        { id: "2", title: "Body", content: "<p>Thank you for subscribing! Here's what's new this week...</p>" },
        { id: "3", title: "Footer", content: "<p><small>© 2024 Your Company. All rights reserved.</small></p>" },
      ],
      template: "simple",
    },
  },
  {
    id: "professional",
    name: "Professional Template",
    description: "Modern design with header, content sections, and footer",
    icon: Sparkles,
    preview: {
      subject: "Monthly Update - January 2024",
      sections: [
        {
          id: "1",
          title: "Header",
          content:
            "<div style='background: #f8f9fa; padding: 20px; text-align: center;'><h1 style='color: #333; margin: 0;'>Monthly Newsletter</h1></div>",
        },
        {
          id: "2",
          title: "Body",
          content:
            "<h3>What's New This Month</h3><p>Discover our latest features, updates, and exciting announcements...</p><h3>Featured Article</h3><p>Learn about the latest trends in our industry and how they affect you...</p>",
        },
        {
          id: "3",
          title: "Footer",
          content:
            "<div style='background: #333; color: white; padding: 15px; text-align: center;'><p style='margin: 0;'>Follow us on social media | Unsubscribe | Contact Support</p></div>",
        },
      ],
      template: "header-content-footer",
    },
  },
]

export default function Templates() {
  const handleSelectTemplate = (template: (typeof templates)[0]) => {
    const templateData = {
      ...template.preview,
      timestamp: Date.now(),
    }

    try {
      localStorage.setItem("selected-template", JSON.stringify(templateData))
      window.location.href = "/"
    } catch (error) {
      console.error("Failed to save template data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Spaces</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Blog</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Templates
              </Badge>
              <Badge variant="secondary">Contact</Badge>
              <Link href="/dashboard">
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  Newsletters
                </Badge>
              </Link>
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">Templates</div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Newsletter Templates</h1>
            <p className="text-muted-foreground mt-2">Choose a template to get started with your newsletter</p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => {
            const IconComponent = template.icon
            return (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[200px]">
                    <div className="space-y-3">
                      <div className="font-semibold text-sm border-b pb-2">{template.preview.subject}</div>
                      {template.id === "simple" ? (
                        <div className="space-y-2">
                          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-2 bg-gray-300 rounded w-1/2 mt-4"></div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-800 rounded mb-3"></div>
                          <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                          <div className="h-2 bg-gray-200 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-blue-200 rounded w-2/3 mt-3"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-800 rounded mt-3"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
