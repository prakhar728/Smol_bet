import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function LegalPage() {
  return (
    <div className="min-h-[100dvh] bg-charcoal text-off flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold">Legal</h1>
          <p className="text-muted mt-2">Terms and disclaimers (placeholder).</p>

          <Separator className="my-8 bg-white/10" />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="terms">
              <AccordionTrigger className="text-off">Terms of Use</AccordionTrigger>
              <AccordionContent className="text-muted">
                This is a placeholder for terms of use. Content to be supplied later.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="privacy">
              <AccordionTrigger className="text-off">Privacy</AccordionTrigger>
              <AccordionContent className="text-muted">This is a placeholder for privacy information.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="disclaimer">
              <AccordionTrigger className="text-off">Disclaimer</AccordionTrigger>
              <AccordionContent className="text-muted">
                This UI is for demonstration and educational purposes only.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
