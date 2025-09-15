import { Html, Head, Body, Container, Section, Text, Button, Hr } from "@react-email/components"

interface SimpleTemplateProps {
  subject: string
  sections: Array<{
    id: string
    title: string
    content: string
  }>
}

export default function SimpleTemplate({ subject, sections }: SimpleTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", padding: "20px" }}>
          <Section>
            <Text style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
              {subject || "Newsletter"}
            </Text>
          </Section>

          {sections.map(
            (section) =>
              section.content && (
                <Section key={section.id} style={{ marginBottom: "20px" }}>
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </Section>
              ),
          )}

          {(!sections.length || sections.every((s) => !s.content.trim())) && (
            <Section>
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
