"use client"

import { render } from "@react-email/render"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import NewsletterEmail from "./email-templates/newsletter-email"

interface NewsletterSection {
  id: string
  title: string
  content: string
}

interface EmailPreviewProps {
  subject: string
  sections: NewsletterSection[]
  template: string
  compact?: boolean
}

export function EmailPreview({ subject, sections, template, compact = false }: EmailPreviewProps) {
  const [emailHtml, setEmailHtml] = useState<string>("")

  useEffect(() => {
    const generateEmailHtml = async () => {
      try {
        const html = await render(
          NewsletterEmail({ subject, sections, template })
        )
        setEmailHtml(html)
      } catch (error) {
        console.error("Error rendering email:", error)
      }
    }

    generateEmailHtml()
  }, [subject, sections, template])

  const renderSimpleTemplate = () => (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="space-y-2">
          {!compact && <h3 className="font-semibold text-sm text-muted-foreground">{section.title}</h3>}
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: section.content || `<p class="text-muted-foreground italic">${section.title} content...</p>`,
            }}
          />
        </div>
      ))}
    </div>
  )

  const renderHeaderFooterTemplate = () => {
    const header = sections.find((s) => s.title === "Header")
    const body = sections.filter((s) => s.title !== "Header" && s.title !== "Footer")
    const footer = sections.find((s) => s.title === "Footer")

    return (
      <div className="space-y-6">
        {/* Header */}
        {header && (
          <div className="border-b pb-4">
            <div
              className="text-sm font-medium"
              dangerouslySetInnerHTML={{
                __html: header.content || `<p class="text-muted-foreground italic">Header content...</p>`,
              }}
            />
          </div>
        )}

        {/* Body Sections */}
        <div className="space-y-4">
          {body.map((section) => (
            <div key={section.id} className="space-y-2">
              {!compact && <h3 className="font-semibold text-sm text-muted-foreground">{section.title}</h3>}
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: section.content || `<p class="text-muted-foreground italic">${section.title} content...</p>`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t pt-4">
            <div
              className="text-xs text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: footer.content || `<p class="text-muted-foreground italic">Footer content...</p>`,
              }}
            />
          </div>
        )}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {subject && <div className="font-semibold text-sm border-b pb-2">{subject}</div>}
        <div className="bg-white border rounded p-4 max-h-48 overflow-hidden">
          {emailHtml ? (
            <div 
              className="text-xs scale-75 origin-top-left transform"
              dangerouslySetInnerHTML={{ __html: emailHtml }}
            />
          ) : (
            <div className="space-y-2">
              {sections.slice(0, 2).map((section) => (
                <div key={section.id} className="h-3 bg-gray-200 rounded"></div>
              ))}
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="p-6 bg-white">
      {/* Email Header */}
      <div className="border-b pb-4 mb-6">
        <div className="text-xs text-muted-foreground mb-2">Subject:</div>
        <div className="font-semibold text-lg">{subject || "Newsletter Subject"}</div>
      </div>

      {/* Email Content */}
      {emailHtml ? (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: emailHtml }}
        />
      ) : (
        template === "simple" ? renderSimpleTemplate() : renderHeaderFooterTemplate()
      )}
    </Card>
  )
}
