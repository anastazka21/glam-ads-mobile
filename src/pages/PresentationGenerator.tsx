import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, ChevronLeft, ChevronRight, Play, Sparkles, TrendingUp, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCard } from "@/components/ui/FormCard";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";
import agencyLogo from "@/assets/agency-logo.png";

const TOTAL_SLIDES = 6;

const PresentationGenerator = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [formData, setFormData] = useState({ ownerName: "", salonName: "", city: "" });

  const handleInputChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const nextSlide = () => setCurrentSlide((prev) => (prev % TOTAL_SLIDES) + 1);
  const prevSlide = () => setCurrentSlide((prev) => ((prev - 2 + TOTAL_SLIDES) % TOTAL_SLIDES) + 1);

  const handleGenerate = () => {
    if (!formData.ownerName || !formData.salonName || !formData.city) { toast.error("Uzupełnij wszystkie pola"); return; }
    setShowPreview(true);
    setCurrentSlide(1);
    toast.success("Prezentacja gotowa!");
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1920, 1080] });
      for (let i = 1; i <= TOTAL_SLIDES; i++) {
        setCurrentSlide(i);
        await new Promise((r) => setTimeout(r, 300));
        const element = document.getElementById("presentation-slide");
        if (element) {
          const imgData = await toJpeg(element, { quality: 0.95, backgroundColor: "#09090b" });
          if (i > 1) pdf.addPage([1920, 1080], "landscape");
          pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
        }
      }
      pdf.save(`prezentacja-${formData.salonName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      toast.success("Prezentacja PDF pobrana!");
    } catch (error) { toast.error("Nie udało się wygenerować PDF"); }
    finally { setIsGenerating(false); }
  };

  const SlideContent = () => {
    const slides: Record<number, JSX.Element> = {
      1: (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <img src={agencyLogo} alt="Aurine" className="w-32 h-32 mb-8 object-contain" />
          <h1 className="text-6xl font-bold text-white mb-4">Dzień dobry, {formData.ownerName}!</h1>
          <p className="text-2xl text-zinc-400">Propozycja współpracy dla {formData.salonName}</p>
          <p className="text-xl text-pink-400 mt-4">{formData.city}</p>
        </div>
      ),
      2: (
        <div className="flex flex-col justify-center h-full px-20">
          <div className="flex items-center gap-4 mb-8"><Sparkles className="w-12 h-12 text-pink-500" /><h2 className="text-5xl font-bold text-white">Dlaczego Facebook Ads?</h2></div>
          <div className="grid grid-cols-3 gap-8">
            {[{ title: "3.5 mln", desc: "Polaków używa Facebooka dziennie" }, { title: "70%", desc: "Klientek szuka usług beauty online" }, { title: "5x", desc: "Wyższy ROI niż tradycyjna reklama" }].map((item, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700"><p className="text-5xl font-bold text-pink-500 mb-4">{item.title}</p><p className="text-xl text-zinc-300">{item.desc}</p></div>
            ))}
          </div>
        </div>
      ),
      3: (
        <div className="flex flex-col justify-center h-full px-20">
          <div className="flex items-center gap-4 mb-8"><Target className="w-12 h-12 text-pink-500" /><h2 className="text-5xl font-bold text-white">Nasza strategia</h2></div>
          <div className="space-y-6">
            {["Precyzyjne targetowanie kobiet 25-55 w {city}".replace("{city}", formData.city), "Kreacje wizualne dopasowane do Twojego salonu", "Optymalizacja pod rezerwacje wizyt", "Comiesięczne raporty z wynikami"].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-800/50 rounded-xl p-6 border border-zinc-700"><CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" /><p className="text-2xl text-white">{item}</p></div>
            ))}
          </div>
        </div>
      ),
      4: (
        <div className="flex flex-col justify-center h-full px-20">
          <div className="flex items-center gap-4 mb-8"><TrendingUp className="w-12 h-12 text-pink-500" /><h2 className="text-5xl font-bold text-white">Case Study</h2></div>
          <div className="bg-gradient-to-br from-pink-950/50 to-zinc-900 rounded-2xl p-10 border border-pink-900/50">
            <p className="text-2xl text-zinc-300 mb-6">Salon Beauty w Krakowie - wyniki po 3 miesiącach:</p>
            <div className="grid grid-cols-4 gap-6">
              {[{ value: "+156%", label: "Więcej rezerwacji" }, { value: "23 PLN", label: "Koszt pozyskania klienta" }, { value: "850+", label: "Nowych klientek" }, { value: "4.8x", label: "ROI" }].map((item, i) => (
                <div key={i} className="text-center"><p className="text-4xl font-bold text-pink-400">{item.value}</p><p className="text-lg text-zinc-400">{item.label}</p></div>
              ))}
            </div>
          </div>
        </div>
      ),
      5: (
        <div className="flex flex-col justify-center h-full px-20">
          <h2 className="text-5xl font-bold text-white mb-8">Propozycja dla {formData.salonName}</h2>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-10 text-white">
            <p className="text-3xl mb-4">Pakiet Premium</p>
            <p className="text-6xl font-bold mb-6">2 500 PLN<span className="text-2xl font-normal">/miesiąc</span></p>
            <div className="grid grid-cols-2 gap-4">
              {["Prowadzenie kampanii Facebook & Instagram", "Tworzenie kreacji reklamowych", "Optymalizacja i testy A/B", "Raportowanie wyników"].map((item, i) => (
                <div key={i} className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      ),
      6: (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <img src={agencyLogo} alt="Aurine" className="w-24 h-24 mb-8 object-contain" />
          <h2 className="text-5xl font-bold text-white mb-4">Gotowy na więcej klientek?</h2>
          <p className="text-2xl text-zinc-400 mb-8">Umówmy się na bezpłatną konsultację</p>
          <div className="bg-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold">kontakt@aurine.pl</div>
        </div>
      ),
    };
    return slides[currentSlide] || slides[1];
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(340_75%_55%/0.08),transparent)]" />
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="w-5 h-5" /></Button>
          <div><h1 className="text-xl font-semibold text-foreground font-sans">Generator Prezentacji</h1><p className="text-sm text-muted-foreground">Spersonalizowane prezentacje cold mail</p></div>
        </div>
      </header>
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <FormCard title="Dane klienta">
            <div className="space-y-5">
              <div><Label>Imię właściciela *</Label><Input value={formData.ownerName} onChange={(e) => handleInputChange("ownerName", e.target.value)} placeholder="Anna" /></div>
              <div><Label>Nazwa salonu *</Label><Input value={formData.salonName} onChange={(e) => handleInputChange("salonName", e.target.value)} placeholder="Beauty Studio" /></div>
              <div><Label>Miasto *</Label><Input value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="Warszawa" /></div>
              <Button onClick={handleGenerate} className="w-full"><Play className="w-5 h-5 mr-2" />Generuj prezentację</Button>
            </div>
          </FormCard>
          {showPreview && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground font-sans">Slajd {currentSlide}/{TOTAL_SLIDES}</h2>
                <div className="flex gap-2">
                  <Button onClick={prevSlide} size="icon" variant="outline"><ChevronLeft className="w-4 h-4" /></Button>
                  <Button onClick={nextSlide} size="icon" variant="outline"><ChevronRight className="w-4 h-4" /></Button>
                  <Button onClick={generatePDF} disabled={isGenerating} size="sm"><Download className="w-4 h-4 mr-2" />{isGenerating ? "..." : "PDF"}</Button>
                </div>
              </div>
              <div id="presentation-slide" className="aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800"><SlideContent /></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PresentationGenerator;
