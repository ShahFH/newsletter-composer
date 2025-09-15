import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
  Preview,
} from "@react-email/components"

interface NewsletterSection {
  id: string
  title: string
  content: string
}

interface NewsletterEmailProps {
  subject: string
  sections: NewsletterSection[]
  template: string
}

export default function NewsletterEmail({ subject, sections, template }: NewsletterEmailProps) {
  const headerSection = sections.find((s) => s.title.toLowerCase() === "header")
  const bodySection = sections.find((s) => s.title.toLowerCase() === "body")
  const footerSection = sections.find((s) => s.title.toLowerCase() === "footer")

  // Clean HTML content by removing any script tags and dangerous elements
  const cleanHtml = (html: string) => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
  }

  if (template === "simple") {
    return (
      <Html>
        <Head />
        <Preview>{subject || "Newsletter"}</Preview>
        <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6", margin: 0, padding: 0 }}>
          <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", padding: "20px" }}>
            <Section>
              <Heading style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
                {subject || "Newsletter"}
              </Heading>
            </Section>

            {sections.map(
              (section) =>
                section.content && (
                  <Section key={section.id} style={{ marginBottom: "20px" }}>
                    <div dangerouslySetInnerHTML={{ __html: cleanHtml(section.content) }} />
                  </Section>
                ),
            )}

            {(!sections.length || sections.every((s) => !s.content.trim())) && (
              <Section>
                <Heading style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
                  Huge Summer Sale!
                </Heading>
                <Text style={{ fontSize: "16px", lineHeight: "1.6", color: "#666666", marginBottom: "20px" }}>
                  Don't miss out on our biggest sale of the year. Get up to 50% off on selected items. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </Text>
                <Button
                  href="#"
                  style={{
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    padding: "12px 24px",
                    textDecoration: "none",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  Shop Now
                </Button>
              </Section>
            )}

            <Hr style={{ margin: "40px 0 20px 0", borderColor: "#e6e6e6" }} />
            <Section>
              <Text style={{ fontSize: "12px", color: "#999999", textAlign: "center" }}>
                You are receiving this email because you subscribed to our newsletter.
              </Text>
              <Text style={{ fontSize: "12px", color: "#0066cc", textAlign: "center" }}>
                <a href="#" style={{ color: "#0066cc" }}>
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    )
  }

  // Header-Content-Footer template
  return (
    <Html>
      <Head />
      <Preview>{subject || "Newsletter"}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff" }}>
          {/* Header */}
          <Section style={{ backgroundColor: "#000000", padding: "20px", textAlign: "center" }}>
            <Heading style={{ color: "#ffffff", fontSize: "24px", fontWeight: "bold", margin: 0 }}>
              {subject || "Newsletter"}
            </Heading>
            {headerSection?.content && (
              <div
                style={{ color: "#ffffff", marginTop: "10px" }}
                dangerouslySetInnerHTML={{ __html: cleanHtml(headerSection.content) }}
              />
            )}
          </Section>

          {/* Body */}
          <Section style={{ padding: "40px 20px" }}>
            {bodySection?.content ? (
              <div dangerouslySetInnerHTML={{ __html: cleanHtml(bodySection.content) }} />
            ) : (
              <>
                <Heading style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
                  Huge Summer Sale!
                </Heading>
                <Text style={{ fontSize: "16px", lineHeight: "1.6", color: "#666666", marginBottom: "20px" }}>
                  Don't miss out on our biggest sale of the year. Get up to 50% off on selected items. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </Text>
                <Button
                  href="#"
                  style={{
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    padding: "12px 24px",
                    textDecoration: "none",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  Shop Now
                </Button>
              </>
            )}

            {/* Additional body sections */}
            {sections
              .filter((s) => s.title !== "Header" && s.title !== "Footer" && s.title !== "Body")
              .map((section) => (
                <Section key={section.id} style={{ marginTop: "30px" }}>
                  {section.content && (
                    <div dangerouslySetInnerHTML={{ __html: cleanHtml(section.content) }} />
                  )}
                </Section>
              ))}
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: "#f8f8f8", padding: "20px", textAlign: "center" }}>
            {footerSection?.content ? (
              <div dangerouslySetInnerHTML={{ __html: cleanHtml(footerSection.content) }} />
            ) : (
              <>
                <Text style={{ fontSize: "12px", color: "#999999", margin: "0 0 10px 0" }}>
                  You are receiving this email because you subscribed to our newsletter.
                </Text>
                <Text style={{ fontSize: "12px", margin: 0 }}>
                  <a href="#" style={{ color: "#0066cc" }}>
                    Unsubscribe
                  </a>
                </Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}