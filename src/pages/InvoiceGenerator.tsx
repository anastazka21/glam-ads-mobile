import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileImage, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCard, FormRow } from "@/components/ui/FormCard";
import { toast } from "sonner";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

type InvoiceType = "advance" | "final" | "full";

const InvoiceGenerator = () => {
  const navigate = useNavigate();
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("full");
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientAddress: "",
    clientNIP: "",
    invoiceNumber: "",
    issueDate: new Date().toISOString().split("T")[0],
    serviceDescription: "Usługi marketingowe Facebook Ads",
    amount: "",
    advanceAmount: "",
    paymentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const invoiceTypes = [
    { id: "advance" as InvoiceType, label: "Zaliczkowa", description: "Płatność zaliczki" },
    { id: "final" as InvoiceType, label: "Końcowa", description: "Rozliczenie po zaliczce" },
    { id: "full" as InvoiceType, label: "Pełna", description: "Pełna kwota usługi" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!formData.clientName || !formData.invoiceNumber || !formData.amount) {
      toast.error("Uzupełnij wszystkie wymagane pola");
      return;
    }
    setShowPreview(true);
    toast.success("Podgląd faktury gotowy!");
  };

  const generatePDF = async () => {
    const element = document.getElementById("invoice-preview");
    if (!element) return;
    setIsGenerating(true);
    try {
      const canvas = await toPng(element, { cacheBust: true, pixelRatio: 3, backgroundColor: "#ffffff" });
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [794, 1123], compress: true });
      pdf.addImage(canvas, "PNG", 0, 0, 794, 1123, undefined, "FAST");
      pdf.save(`${formData.invoiceNumber.replace(/\//g, "-")}.pdf`);
      toast.success("Faktura PDF pobrana!");
    } catch (error) {
      toast.error("Nie udało się wygenerować PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(340_75%_55%/0.08),transparent)]" />
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground font-sans">Generator Faktur</h1>
              <p className="text-sm text-muted-foreground">Faktury zwolnione z VAT</p>
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormCard title="Typ faktury">
              <div className="grid grid-cols-3 gap-3">
                {invoiceTypes.map((type) => (
                  <button key={type.id} onClick={() => setInvoiceType(type.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${invoiceType === type.id ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/30"}`}>
                    <p className="font-medium text-foreground">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </FormCard>
            <FormCard title="Dane klienta">
              <div className="space-y-5">
                <FormRow>
                  <div><Label>Nazwa klienta *</Label><Input value={formData.clientName} onChange={(e) => handleInputChange("clientName", e.target.value)} placeholder="Salon Beauty XYZ" /></div>
                  <div><Label>Numer faktury *</Label><Input value={formData.invoiceNumber} onChange={(e) => handleInputChange("invoiceNumber", e.target.value)} placeholder="FV/2025/001" /></div>
                </FormRow>
                <div><Label>Adres klienta</Label><Input value={formData.clientAddress} onChange={(e) => handleInputChange("clientAddress", e.target.value)} placeholder="ul. Przykładowa 123, 00-000 Warszawa" /></div>
                <FormRow>
                  <div><Label>NIP klienta</Label><Input value={formData.clientNIP} onChange={(e) => handleInputChange("clientNIP", e.target.value)} placeholder="1234567890" /></div>
                  <div><Label>Kwota (PLN) *</Label><Input type="number" value={formData.amount} onChange={(e) => handleInputChange("amount", e.target.value)} placeholder="5000" /></div>
                </FormRow>
                {invoiceType === "final" && (
                  <div><Label>Kwota zaliczki (PLN)</Label><Input type="number" value={formData.advanceAmount} onChange={(e) => handleInputChange("advanceAmount", e.target.value)} placeholder="2000" /></div>
                )}
                <Button onClick={handleGenerate} className="w-full"><Eye className="w-5 h-5 mr-2" />Generuj podgląd</Button>
              </div>
            </FormCard>
          </div>
          {showPreview && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground font-sans">Podgląd faktury</h2>
                <Button onClick={generatePDF} disabled={isGenerating} size="sm"><Download className="w-4 h-4 mr-2" />{isGenerating ? "..." : "PDF"}</Button>
              </div>
              <div className="border border-border/50 rounded-xl overflow-hidden bg-white shadow-lg">
                <div className="transform scale-[0.5] origin-top-left w-[200%]"><InvoicePreview data={{ ...formData, invoiceType }} /></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvoiceGenerator;
