import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormRow } from "@/components/ui/FormCard";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { Building2, FileText, CheckCircle2, Shield, Sparkles } from "lucide-react";

const ContractGenerator = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "", clientAddress: "", clientNIP: "", contractNumber: "",
    signDate: new Date().toISOString().split("T")[0],
    serviceScope: "Prowadzenie kampanii reklamowych Facebook Ads, tworzenie kreacji, optymalizacja i raportowanie wyników.",
    contractValue: "", paymentTerms: "7 dni od wystawienia faktury", contractDuration: "3 miesiące",
  });

  const handleInputChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = () => {
    if (!formData.clientName || !formData.contractNumber || !formData.contractValue) {
      toast.error("Uzupełnij wszystkie wymagane pola"); return;
    }
    setShowPreview(true);
    toast.success("Podgląd umowy gotowy!");
  };

  const generatePDF = async () => {
    const element = document.getElementById("contract-preview");
    if (!element) return;
    setIsGenerating(true);
    try {
      const canvas = await toPng(element, { cacheBust: true, pixelRatio: 3, backgroundColor: "#ffffff" });
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [794, 1123], compress: true });
      pdf.addImage(canvas, "PNG", 0, 0, 794, 1123, undefined, "FAST");
      pdf.save(`${formData.contractNumber.replace(/\//g, "-")}.pdf`);
      toast.success("Umowa PDF pobrana!");
    } catch (error) { toast.error("Nie udało się wygenerować PDF"); }
    finally { setIsGenerating(false); }
  };

  const formatDate = (dateStr: string) => { if (!dateStr) return "—"; return new Date(dateStr).toLocaleDateString("pl-PL", { day: "2-digit", month: "long", year: "numeric" }); };
  const formatAmount = (amount: string) => { if (!amount) return "0,00"; return parseFloat(amount).toLocaleString("pl-PL", { minimumFractionDigits: 2 }); };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(340_75%_55%/0.08),transparent)]" />
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div><h1 className="text-xl font-semibold text-foreground font-sans">Generator Umów</h1><p className="text-sm text-muted-foreground">Profesjonalne umowy marketingowe</p></div>
        </div>
      </header>
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormCard title="Dane klienta">
              <div className="space-y-5">
                <FormRow>
                  <div><Label>Nazwa klienta *</Label><Input value={formData.clientName} onChange={(e) => handleInputChange("clientName", e.target.value)} placeholder="Salon Beauty XYZ" /></div>
                  <div><Label>Numer umowy *</Label><Input value={formData.contractNumber} onChange={(e) => handleInputChange("contractNumber", e.target.value)} placeholder="UM/2025/001" /></div>
                </FormRow>
                <div><Label>Adres klienta</Label><Input value={formData.clientAddress} onChange={(e) => handleInputChange("clientAddress", e.target.value)} placeholder="ul. Przykładowa 123, 00-000 Warszawa" /></div>
                <FormRow>
                  <div><Label>Wartość umowy (PLN) *</Label><Input type="number" value={formData.contractValue} onChange={(e) => handleInputChange("contractValue", e.target.value)} placeholder="15000" /></div>
                  <div><Label>Czas trwania</Label><Input value={formData.contractDuration} onChange={(e) => handleInputChange("contractDuration", e.target.value)} placeholder="3 miesiące" /></div>
                </FormRow>
                <div><Label>Zakres usług</Label><Textarea value={formData.serviceScope} onChange={(e) => handleInputChange("serviceScope", e.target.value)} className="min-h-[100px] bg-secondary/30 border-border/50" /></div>
                <Button onClick={handleGenerate} className="w-full"><Eye className="w-5 h-5 mr-2" />Generuj podgląd umowy</Button>
              </div>
            </FormCard>
          </div>
          {showPreview && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground font-sans">Podgląd umowy</h2>
                <Button onClick={generatePDF} disabled={isGenerating} size="sm"><Download className="w-4 h-4 mr-2" />{isGenerating ? "..." : "PDF"}</Button>
              </div>
              <div className="border border-border/50 rounded-xl overflow-hidden bg-white shadow-lg">
                <div id="contract-preview" className="bg-white text-zinc-900 w-[794px] min-h-[1123px] p-10 mx-auto font-sans transform scale-[0.5] origin-top-left w-[200%]">
                  <header className="flex items-center justify-between mb-6 pb-6 border-b-2 border-pink-500">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg"><Building2 className="w-7 h-7 text-white" /></div>
                      <div><h1 className="text-2xl font-bold text-zinc-900">Aurine Agency</h1><p className="text-sm text-zinc-500">Marketing dla salonów beauty</p></div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white"><FileText className="w-4 h-4" /><span className="font-bold text-sm">UMOWA</span></div>
                      <p className="text-lg font-bold mt-2 text-zinc-900">{formData.contractNumber || "UM/____/____"}</p>
                    </div>
                  </header>
                  <section className="text-center mb-8"><h2 className="text-2xl font-bold text-zinc-900 mb-2">UMOWA O ŚWIADCZENIE USŁUG MARKETINGOWYCH</h2><p className="text-zinc-500">zawarta w dniu {formatDate(formData.signDate)}</p></section>
                  <section className="space-y-4 mb-6 text-sm text-zinc-700">
                    <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200"><h3 className="font-bold text-zinc-900 mb-3">§1 Przedmiot umowy</h3><p>{formData.serviceScope}</p></div>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200"><h3 className="font-bold text-zinc-900 mb-3">§3 Wynagrodzenie</h3><div className="bg-white rounded-lg p-4 border border-pink-200 flex items-center justify-between"><span>Wartość umowy:</span><span className="text-2xl font-bold text-pink-600">{formatAmount(formData.contractValue)} PLN</span></div></div>
                  </section>
                  <footer className="flex justify-between items-end pt-8 mt-8 border-t border-zinc-200">
                    <div className="text-center"><div className="w-48 border-b border-zinc-300 mb-2 h-16"></div><p className="text-xs text-zinc-500 font-medium">Zleceniobiorca</p></div>
                    <div className="flex items-center gap-2 text-zinc-400"><Shield className="w-5 h-5" /><span className="text-xs">Dokument chroniony</span></div>
                    <div className="text-center"><div className="w-48 border-b border-zinc-300 mb-2 h-16"></div><p className="text-xs text-zinc-500 font-medium">Zleceniodawca</p></div>
                  </footer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContractGenerator;
