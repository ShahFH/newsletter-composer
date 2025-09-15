import { Html, Head, Body, Container, Section, Text, Button } from "@react-email/components"

interface HeaderFooterTemplateProps {
  subject: string
  sections: Array<{
    id: string
    title: string
    content: string
  }>
}

export default function HeaderFooterTemplate({ subject, sections }: HeaderFooterTemplateProps) {
  const headerSection = sections.find((s) => s.title.toLowerCase() === "header")
  const bodySection = sections.find((s) => s.title.toLowerCase() === "body")
  const footerSection = sections.find((s) => s.title.toLowerCase() === "footer")

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff" }}>
          {/* Header */}
          <Section style={{ backgroundColor: "#000000", padding: "20px", textAlign: "center" }}>
            <Text style={{ color: "#ffffff", fontSize: "24px", fontWeight: "bold", margin: 0 }}>
              {subject || "Newsletter"}
            </Text>
            {headerSection?.content && (
              <div
                style={{ color: "#ffffff", marginTop: "10px" }}
                dangerouslySetInnerHTML={{ __html: headerSection.content }}
              />
            )}
          </Section>

          {/* Body */}
          <Section style={{ padding: "40px 20px" }}>
            {bodySection?.content ? (
              <div dangerouslySetInnerHTML={{ __html: bodySection.content }} />
            ) : (
              <>
                <Text style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Huge Summer Sale!</Text>
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
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: "#f8f8f8", padding: "20px", textAlign: "center" }}>
            {footerSection?.content ? (
              <div dangerouslySetInnerHTML={{ __html: footerSection.content }} />
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
