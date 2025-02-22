import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function ProductAccordions() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger><h6>Features</h6></AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div><strong>Model:</strong> JFX22-4</div>
                        <div><strong>IP Rating:</strong> IP44 (Waterproof)</div>
                        <div><strong>Power:</strong> 11-15W, 3W</div>
                        <div><strong>LED Chips:</strong> High-efficiency Epistar</div>
                        <div><strong>Material:</strong> Durable Aluminum</div>
                        <div><strong>Waterproof:</strong> Rated IPX4 for outdoor use</div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger><h6>Specifications</h6></AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div><strong>Package Dimensions:</strong> 15.00cm x 15.00cm x 10.00cm</div>
                        <div><strong>Weight:</strong> 0.5kg (Compact and lightweight)</div>
                        <div><strong>Certification:</strong> CE Certified for safety</div>
                        <div><strong>Battery:</strong> Long-lasting 18650 Rechargeable</div>
                        <div><strong>Power Supply:</strong> Rechargeable Battery</div>
                        <div><strong>Transport:</strong> Secure, natural packaging</div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
