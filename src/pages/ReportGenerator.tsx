import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCard, FormRow } from "@/components/ui/FormCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ReportPreview } from "@/components/report/ReportPreview";
import { ReportHistory } from "@/components/report/ReportHistory";
import { useReportHistory } from "@/hooks/useReportHistory";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

const reportSchema = z.object({
  clientName: z.string().min(1, "Nazwa klienta wymagana").max(100),
  city: z.string().min(1, "Miasto salonu wymagane").max(100),
  period: z.string().min(1, "Pole wymagane"),
  budget: z.string().min(1, "Pole wymagane"),
  impressions: z.string().min(1, "Pole wymagane"),
  reach: z.string().min(1, "Pole wymagane"),
  clicks: z.string().min(1, "Pole wymagane"),
  ctr: z.string().min(1, "Pole wymagane"),
  conversions: z.string().min(1, "Pole wymagane"),
  costPerConversion: z.string().min(1, "Pole wymagane"),
  bookings: z.string().min(1, "Pole wymagane"),
  campaignObjective: z.string().optional(),
  campaignStatus: z.string().optional(),
  engagementRate: z.string().optional(),
  weeklyReachData: z.string().optional(),
  weeklyClicksData: z.string().optional(),
  dailyBookingsData: z.string().optional(),
  recommendations: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

const ReportGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reportData, setReportData] = useState<ReportFormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { history, saveReport, deleteReport, clearHistory } = useReportHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    setReportData(data);
    saveReport(data as Record<string, string>);
    toast({
      title: "Podgląd gotowy!",
      description: "Sprawdź podgląd raportu poniżej i pobierz PDF",
    });
  };

  const loadFromHistory = (data: Record<string, string>) => {
    reset(data as ReportFormData);
    toast({
      title: "Załadowano raport",
      description: "Dane zostały wczytane z historii",
    });
  };

  const generatePDF = async () => {
    const element = document.getElementById("report-preview");
    if (!element || !reportData) return;

    setIsGenerating(true);

    try {
      const canvas = await toPng(element, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#050509",
      });

      const img = new Image();
      img.src = canvas;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgWidth = img.width;
      const imgHeight = img.height;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [imgWidth, imgHeight],
        compress: true,
      });

      pdf.addImage(canvas, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), undefined, "FAST");
      pdf.save(`raport-${reportData.clientName?.toLowerCase().replace(/\s+/g, "-")}.pdf`);

      toast({
        title: "PDF wygenerowany!",
        description: "Raport został pobrany",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się wygenerować PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsImage = async () => {
    const element = document.getElementById("report-preview");
    if (!element || !reportData) return;

    setIsGenerating(true);

    try {
      const imgData = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#050509",
      });

      const link = document.createElement("a");
      link.download = `raport-${reportData.clientName?.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = imgData;
      link.click();

      toast({
        title: "Obraz pobrany!",
        description: "Raport został zapisany jako PNG",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać obrazu",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(340_75%_55%/0.08),transparent)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground font-sans">Generator Raportów Facebook Ads</h1>
            <p className="text-muted-foreground">Profesjonalne raporty dla salonów beauty - Aurine Agency</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormCard title="Dane kampanii Facebook Ads">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormRow cols={1}>
                  <div>
                    <Label htmlFor="clientName">Nazwa salonu</Label>
                    <Input id="clientName" {...register("clientName")} placeholder="np. Beauty Studio" />
                    {errors.clientName && <p className="text-destructive text-sm mt-1">{errors.clientName.message}</p>}
                  </div>
                </FormRow>

                <FormRow cols={1}>
                  <div>
                    <Label htmlFor="city">Miasto salonu</Label>
                    <Input id="city" {...register("city")} placeholder="np. Warszawa" />
                    {errors.city && <p className="text-destructive text-sm mt-1">{errors.city.message}</p>}
                  </div>
                </FormRow>

                <FormRow>
                  <div>
                    <Label htmlFor="period">Okres</Label>
                    <Input id="period" {...register("period")} placeholder="Styczeń 2025" />
                    {errors.period && <p className="text-destructive text-sm mt-1">{errors.period.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="budget">Budżet (PLN)</Label>
                    <Input id="budget" {...register("budget")} placeholder="5,000" />
                    {errors.budget && <p className="text-destructive text-sm mt-1">{errors.budget.message}</p>}
                  </div>
                </FormRow>

                <FormRow>
                  <div>
                    <Label htmlFor="impressions">Wyświetlenia</Label>
                    <Input id="impressions" {...register("impressions")} placeholder="150,000" />
                    {errors.impressions && <p className="text-destructive text-sm mt-1">{errors.impressions.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="reach">Zasięg</Label>
                    <Input id="reach" {...register("reach")} placeholder="85,000" />
                    {errors.reach && <p className="text-destructive text-sm mt-1">{errors.reach.message}</p>}
                  </div>
                </FormRow>

                <FormRow>
                  <div>
                    <Label htmlFor="clicks">Kliknięcia</Label>
                    <Input id="clicks" {...register("clicks")} placeholder="3,500" />
                    {errors.clicks && <p className="text-destructive text-sm mt-1">{errors.clicks.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="ctr">CTR (%)</Label>
                    <Input id="ctr" {...register("ctr")} placeholder="2.33" />
                    {errors.ctr && <p className="text-destructive text-sm mt-1">{errors.ctr.message}</p>}
                  </div>
                </FormRow>

                <FormRow>
                  <div>
                    <Label htmlFor="conversions">Konwersje</Label>
                    <Input id="conversions" {...register("conversions")} placeholder="245" />
                    {errors.conversions && <p className="text-destructive text-sm mt-1">{errors.conversions.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="costPerConversion">Koszt / konwersja (PLN)</Label>
                    <Input id="costPerConversion" {...register("costPerConversion")} placeholder="20.41" />
                    {errors.costPerConversion && <p className="text-destructive text-sm mt-1">{errors.costPerConversion.message}</p>}
                  </div>
                </FormRow>

                <FormRow cols={1}>
                  <div>
                    <Label htmlFor="bookings">Rezerwacje wizyt</Label>
                    <Input id="bookings" {...register("bookings")} placeholder="178" />
                    {errors.bookings && <p className="text-destructive text-sm mt-1">{errors.bookings.message}</p>}
                  </div>
                </FormRow>

                <FormRow cols={1}>
                  <div>
                    <Label htmlFor="campaignStatus">Status kampanii (opcjonalnie)</Label>
                    <Select
                      value={watch("campaignStatus") || ""}
                      onValueChange={(value) => setValue("campaignStatus", value, { shouldValidate: true })}
                    >
                      <SelectTrigger className="bg-secondary/30 border-border/50">
                        <SelectValue placeholder="Wybierz status kampanii" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Aktywna">Aktywna</SelectItem>
                        <SelectItem value="Zakończona">Zakończona</SelectItem>
                        <SelectItem value="Wstrzymana">Wstrzymana</SelectItem>
                        <SelectItem value="Planowana">Planowana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormRow>

                <div className="pt-5 border-t border-border/50">
                  <h3 className="text-foreground font-semibold mb-4 text-sm">Dane opcjonalne (wykresy)</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="engagementRate">Współczynnik zaangażowania (%)</Label>
                      <Input id="engagementRate" {...register("engagementRate")} placeholder="np. 65" />
                    </div>
                    <div>
                      <Label htmlFor="recommendations">Rekomendacje marketingowe</Label>
                      <textarea
                        id="recommendations"
                        {...register("recommendations")}
                        rows={4}
                        placeholder="Wpisz rekomendacje..."
                        className="w-full px-4 py-2.5 bg-secondary/30 border border-border/50 text-foreground rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">Generuj podgląd raportu</Button>
              </form>
            </FormCard>

            <ReportHistory history={history} onSelect={loadFromHistory} onDelete={deleteReport} onClear={clearHistory} />
          </div>

          {reportData && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-foreground font-sans">Podgląd</h2>
                <div className="flex gap-2">
                  <Button onClick={downloadAsImage} disabled={isGenerating} size="sm" variant="outline">
                    <FileImage className="w-4 h-4 mr-1.5" />
                    PNG
                  </Button>
                  <Button onClick={generatePDF} disabled={isGenerating} size="sm">
                    <Download className="w-4 h-4 mr-1.5" />
                    {isGenerating ? "..." : "PDF"}
                  </Button>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-pink-500/10 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative border-2 border-border/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/5">
                  <div className="transform scale-[0.6] origin-top-left w-[166%]">
                    <ReportPreview data={reportData} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
