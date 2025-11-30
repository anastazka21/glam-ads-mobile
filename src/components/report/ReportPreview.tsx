import { TrendingUp, Target, CheckCircle2, Sparkles, Phone, MessageCircle } from "lucide-react";
import { SimplePieChart, SimpleBarChart, SimpleLineChart } from "./SimpleCharts";

interface ReportData {
  clientName?: string;
  city?: string;
  period?: string;
  budget?: string;
  impressions?: string;
  reach?: string;
  clicks?: string;
  ctr?: string;
  conversions?: string;
  costPerConversion?: string;
  bookings?: string;
  campaignObjective?: string;
  campaignStatus?: string;
  engagementRate?: string;
  weeklyReachData?: string;
  weeklyClicksData?: string;
  dailyBookingsData?: string;
  recommendations?: string;
}

interface ReportPreviewProps {
  data: ReportData;
}

export const ReportPreview = ({ data }: ReportPreviewProps) => {
  const parseNumber = (str?: string): number => {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, "").replace(/\s/g, ""));
  };

  const engagementValue = data.engagementRate ? parseNumber(data.engagementRate) : 23;
  const engagementData = [
    { name: "Zaangażowani", value: engagementValue, color: "#3b82f6" },
    { name: "Pozostali", value: 100 - engagementValue, color: "#27272a" },
  ];

  const bookingsNum = parseNumber(data.bookings) || 33;
  const conversionsNum = parseNumber(data.conversions) || 50;
  const conversionPercentage = conversionsNum > 0 ? (bookingsNum / conversionsNum) * 100 : 66;
  const conversionData = [
    { name: "Rezerwacje", value: conversionPercentage, color: "#ec4899" },
    { name: "Pozostałe", value: 100 - conversionPercentage, color: "#27272a" },
  ];

  const weeklyData = data.weeklyReachData && data.weeklyClicksData
    ? data.weeklyReachData.split(",").map((reach, i) => ({
        name: `Tydz. ${i + 1}`,
        reach: parseNumber(reach),
        clicks: parseNumber(data.weeklyClicksData?.split(",")[i]),
      }))
    : [
        { name: "Tydz. 1", reach: 15000, clicks: 650 },
        { name: "Tydz. 2", reach: 19000, clicks: 820 },
        { name: "Tydz. 3", reach: 25000, clicks: 1100 },
        { name: "Tydz. 4", reach: 26000, clicks: 930 },
      ];

  const dailyBookings = data.dailyBookingsData
    ? data.dailyBookingsData.split(",").map((value, i) => ({
        name: ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"][i] || `D${i + 1}`,
        value: parseNumber(value),
      }))
    : [
        { name: "Pn", value: 22 },
        { name: "Wt", value: 28 },
        { name: "Śr", value: 32 },
        { name: "Cz", value: 35 },
        { name: "Pt", value: 38 },
        { name: "Sb", value: 42 },
        { name: "Nd", value: 25 },
      ];

  const formatNumber = (str?: string) => {
    if (!str) return "—";
    const num = parseNumber(str);
    return num.toLocaleString("pl-PL");
  };

  return (
    <div
      id="report-preview"
      className="bg-zinc-950 text-zinc-100 w-[794px] min-h-[1123px] p-8 mx-auto"
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Raport kampanii Facebook Ads</h1>
            <p className="text-sm text-zinc-400">Aurine Agency • {data.period || "Styczeń 2025"}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{data.clientName || "Salon Beauty"}</p>
          <p className="text-sm text-zinc-400">{data.city || "Warszawa"}</p>
        </div>
      </header>

      {/* KPIs Grid */}
      <section className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Budżet", value: `${formatNumber(data.budget)} PLN`, color: "text-blue-400" },
          { label: "Wyświetlenia", value: formatNumber(data.impressions), color: "text-purple-400" },
          { label: "Zasięg", value: formatNumber(data.reach), color: "text-cyan-400" },
          { label: "Kliknięcia", value: formatNumber(data.clicks), color: "text-pink-400" },
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </section>

      {/* Second row KPIs */}
      <section className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "CTR", value: `${data.ctr || "2.33"}%`, color: "text-emerald-400" },
          { label: "Konwersje", value: formatNumber(data.conversions), color: "text-amber-400" },
          { label: "Koszt/konwersja", value: `${formatNumber(data.costPerConversion)} PLN`, color: "text-rose-400" },
          { label: "Rezerwacje", value: formatNumber(data.bookings), color: "text-green-400" },
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <h3 className="text-sm font-semibold text-white mb-4">Zaangażowanie</h3>
          <div className="flex justify-center">
            <SimplePieChart data={engagementData} size={150} />
          </div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <h3 className="text-sm font-semibold text-white mb-4">Konwersja do rezerwacji</h3>
          <div className="flex justify-center">
            <SimplePieChart data={conversionData} size={150} />
          </div>
        </div>
      </section>

      {/* Line Chart */}
      <section className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 mb-8">
        <h3 className="text-sm font-semibold text-white mb-4">Zasięg i kliknięcia - trend tygodniowy</h3>
        <SimpleLineChart data={weeklyData} height={150} />
      </section>

      {/* Bar Chart */}
      <section className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 mb-8">
        <h3 className="text-sm font-semibold text-white mb-4">Rezerwacje dzienne</h3>
        <SimpleBarChart data={dailyBookings} height={120} />
      </section>

      {/* Recommendations */}
      {data.recommendations && (
        <section className="bg-gradient-to-br from-pink-950/50 to-zinc-900 rounded-xl p-5 border border-pink-900/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3 className="text-sm font-semibold text-white">Rekomendacje</h3>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {data.recommendations}
          </p>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-4 text-zinc-500 text-xs">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>+48 123 456 789</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>kontakt@aurine.pl</span>
          </div>
        </div>
        <p className="text-zinc-500 text-xs">aurine.pl</p>
      </footer>
    </div>
  );
};
