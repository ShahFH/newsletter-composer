"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Edit, Send, Save, Clock } from "lucide-react"
import { format } from "date-fns"

interface NewsletterSection {
  id: string
  title: string
  content: string
}

interface NewsletterPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  subject: string
  sections: NewsletterSection[]
  template: string
  onEdit: () => void
  onSend: () => void
  onSaveDraft: () => void
  onSchedule: () => void
}

export function NewsletterPreviewModal({
  isOpen,
  onClose,
  subject,
  sections,
  template,
  onEdit,
  onSend,
  onSaveDraft,
  onSchedule,
}: NewsletterPreviewModalProps) {
  const renderNewsletterContent = () => {
    const headerSection = sections.find((s) => s.title.toLowerCase() === "header")
    const bodySection = sections.find((s) => s.title.toLowerCase() === "body")
    const footerSection = sections.find((s) => s.title.toLowerCase() === "footer")

    return (
      <div className="bg-white rounded-lg border max-w-2xl mx-auto">
        <div className="p-8 space-y-6">
          {/* Subject Display */}
          <div className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Subject:</span>
              <span className="text-lg font-semibold">{subject || "Untitled Newsletter"}</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Draft
              </Badge>
            </div>
          </div>

          {/* Newsletter Content */}
          <div className="space-y-6">
            {headerSection && headerSection.content && (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: headerSection.content }} />
            )}

            {bodySection && bodySection.content && (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: bodySection.content }} />
            )}

            {/* Default content if no body content */}
            {(!bodySection || !bodySection.content) && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">{subject || "Newsletter Title"}</h1>
                <p className="text-gray-600 leading-relaxed">
                  Don't miss out on our biggest sale of the year. Get up to 50% off on selected items. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </p>
                <Button className="bg-black text-white hover:bg-gray-800">Shop Now</Button>
              </div>
            )}

            {footerSection && footerSection.content && (
              <div
                className="prose prose-sm max-w-none border-t pt-4 text-sm text-gray-500"
                dangerouslySetInnerHTML={{ __html: footerSection.content }}
              />
            )}

            {/* Default footer if no footer content */}
            {(!footerSection || !footerSection.content) && (
              <div className="border-t pt-4 text-sm text-gray-500 space-y-1">
                <p>You are receiving this email because you subscribed to our newsletter.</p>
                <a href="#" className="text-blue-600 hover:underline">
                  Unsubscribe
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h2 className="text-lg font-semibold">Newsletter Preview</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" onClick={onSend} className="bg-black text-white hover:bg-gray-800">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Newsletter Preview */}
            <div className="flex-1 p-8 overflow-y-auto bg-gray-50">{renderNewsletterContent()}</div>

            {/* Settings Sidebar */}
            <div className="w-80 bg-white border-l p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Settings Header */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Settings</h3>

                  <div className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start h-auto p-3 text-left" onClick={onSaveDraft}>
                      <Save className="h-4 w-4 mr-3 text-gray-500" />
                      <span>Save as Draft</span>
                    </Button>

                    <Button variant="ghost" className="w-full justify-start h-auto p-3 text-left" onClick={onSchedule}>
                      <Clock className="h-4 w-4 mr-3 text-gray-500" />
                      <span>Schedule Send</span>
                    </Button>
                  </div>
                </div>

                {/* Details Section */}
                <div>
                  <h4 className="font-semibold mb-4">Details</h4>

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
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium capitalize">{template.replace("-", " + ")}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Draft
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Newsletter Stats */}
                <div>
                  <h4 className="font-semibold mb-4">Newsletter Stats</h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Word Count:</span>
                      <span className="font-medium">
                        {sections.reduce((count, section) => {
                          const text = section.content.replace(/<[^>]*>/g, "")
                          return count + text.split(/\s+/).filter((word) => word.length > 0).length
                        }, 0)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Sections:</span>
                      <span className="font-medium">{sections.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
