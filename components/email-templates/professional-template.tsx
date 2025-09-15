import { Html, Head, Body, Container, Section, Text, Button, Hr, Heading } from "@react-email/components"

interface ProfessionalTemplateProps {
  subject: string
  sections: Array<{
    id: string
    title: string
    content: string
  }>
}

export default function ProfessionalTemplate({ subject, sections }: ProfessionalTemplateProps) {
  const headerSection = sections.find((s) => s.title.toLowerCase() === "header")
  const bodySection = sections.find((s) => s.title.toLowerCase() === "body")
  const footerSection = sections.find((s) => s.title.toLowerCase() === "footer")

  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f8f9fa",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <Section style={{ backgroundColor: "#2563eb", padding: "30px 20px", textAlign: "center" }}>
            <Heading
              style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold", margin: 0, letterSpacing: "-0.5px" }}
            >
              {subject || "Professional Newsletter"}
            </Heading>
            {headerSection?.content && (
              <div
                style={{ color: "#e0e7ff", marginTop: "10px", fontSize: "16px" }}
                dangerouslySetInnerHTML={{ __html: headerSection.content }}
              />
            )}
          </Section>

          {/* Body */}
          <Section style={{ padding: "40px 30px" }}>
            {bodySection?.content ? (
              <div
                style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}
                dangerouslySetInnerHTML={{ __html: bodySection.content }}
              />
            ) : (
              <>
                <Heading style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", color: "#1f2937" }}>
                  What's New This Month
                </Heading>
                <Text style={{ fontSize: "16px", lineHeight: "1.6", color: "#6b7280", marginBottom: "25px" }}>
                  Discover our latest features, updates, and exciting announcements that will help you achieve more with
                  our platform.
                </Text>

                <Heading style={{ fontSize: "20px", fontWeight: "600", marginBottom: "15px", color: "#1f2937" }}>
                  Featured Article
                </Heading>
                <Text style={{ fontSize: "16px", lineHeight: "1.6", color: "#6b7280", marginBottom: "30px" }}>
                  Learn about the latest trends in our industry and how they can benefit your business. Our expert
                  insights will keep you ahead of the curve.
                </Text>

                <Button
                  href="#"
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    padding: "14px 28px",
                    textDecoration: "none",
                    borderRadius: "8px",
                    display: "inline-block",
                    fontWeight: "600",
                    fontSize: "16px",
                    boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                  }}
                >
                  Read More
                </Button>
              </>
            )}
          </Section>

          <Hr style={{ margin: "0", borderColor: "#e5e7eb" }} />

          {/* Footer */}
          <Section style={{ backgroundColor: "#f9fafb", padding: "30px 20px", textAlign: "center" }}>
            {footerSection?.content ? (
              <div dangerouslySetInnerHTML={{ __html: footerSection.content }} />
            ) : (
              <>
                <Text style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 15px 0" }}>
                  You're receiving this email because you subscribed to our newsletter.
                </Text>
                <Text style={{ fontSize: "14px", margin: "0 0 10px 0" }}>
                  <a href="#" style={{ color: "#2563eb", textDecoration: "none", marginRight: "20px" }}>
                    Update Preferences
                  </a>
                  <a href="#" style={{ color: "#6b7280", textDecoration: "none" }}>
                    Unsubscribe
                  </a>
                </Text>
                <Text style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                  © 2024 Your Company Name. All rights reserved.
                </Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
