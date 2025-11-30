import { Building2, FileText, Calendar, CreditCard, User } from "lucide-react";

interface InvoiceData {
  invoiceType: "advance" | "final" | "full";
  clientName: string;
  clientAddress: string;
  clientNIP: string;
  invoiceNumber: string;
  issueDate: string;
  serviceDescription: string;
  amount: string;
  advanceAmount: string;
  paymentDue: string;
}

interface InvoicePreviewProps {
  data: InvoiceData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pl-PL", { day: "2-digit", month: "long", year: "numeric" });
};

const formatAmount = (amount: string) => {
  if (!amount) return "0,00";
  const num = parseFloat(amount);
  return num.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const numberToWords = (num: number): string => {
  const ones = ["", "jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć"];
  const teens = ["dziesięć", "jedenaście", "dwanaście", "trzynaście", "czternaście", "piętnaście", "szesnaście", "siedemnaście", "osiemnaście", "dziewiętnaście"];
  const tens = ["", "", "dwadzieścia", "trzydzieści", "czterdzieści", "pięćdziesiąt", "sześćdziesiąt", "siedemdziesiąt", "osiemdziesiąt", "dziewięćdziesiąt"];
  const hundreds = ["", "sto", "dwieście", "trzysta", "czterysta", "pięćset", "sześćset", "siedemset", "osiemset", "dziewięćset"];
  const thousands = ["", "tysiąc", "tysiące", "tysięcy"];

  if (num === 0) return "zero";

  const getThousandForm = (n: number) => {
    if (n === 1) return thousands[1];
    if (n >= 2 && n <= 4) return thousands[2];
    return thousands[3];
  };

  let result = "";
  const th = Math.floor(num / 1000);
  const h = Math.floor((num % 1000) / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;

  if (th > 0) {
    if (th === 1) result += "tysiąc ";
    else result += ones[th] + " " + getThousandForm(th) + " ";
  }
  if (h > 0) result += hundreds[h] + " ";
  if (t === 1) result += teens[o] + " ";
  else {
    if (t > 0) result += tens[t] + " ";
    if (o > 0) result += ones[o] + " ";
  }

  return result.trim();
};

export const InvoicePreview = ({ data }: InvoicePreviewProps) => {
  const amount = parseFloat(data.amount || "0");
  const advanceAmount = parseFloat(data.advanceAmount || "0");
  const finalAmount = data.invoiceType === "final" ? amount - advanceAmount : amount;

  const invoiceTitle = data.invoiceType === "advance"
    ? "FAKTURA ZALICZKOWA"
    : data.invoiceType === "final"
      ? "FAKTURA KOŃCOWA"
      : "FAKTURA VAT";

  const zloteSlownie = numberToWords(Math.floor(finalAmount));
  const grosze = Math.round((finalAmount % 1) * 100);

  return (
    <div
      id="invoice-preview"
      className="bg-white text-zinc-900 w-[794px] min-h-[1123px] p-10 mx-auto font-sans relative"
    >
      {/* Header */}
      <header className="flex items-start justify-between mb-8 pb-6 border-b-2 border-pink-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Aurine Agency</h1>
            <p className="text-sm text-zinc-500">Marketing dla salonów beauty</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <FileText className="w-4 h-4" />
            <span className="font-bold text-sm">{invoiceTitle}</span>
          </div>
          <p className="text-lg font-bold mt-2 text-zinc-900">{data.invoiceNumber || "FV/____/____"}</p>
        </div>
      </header>

      {/* Dates */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Data wystawienia</span>
          </div>
          <p className="text-lg font-semibold text-zinc-900">{formatDate(data.issueDate)}</p>
        </div>
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Termin płatności</span>
          </div>
          <p className="text-lg font-semibold text-zinc-900">{formatDate(data.paymentDue)}</p>
        </div>
      </section>

      {/* Parties */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Sprzedawca</span>
          </div>
          <p className="font-bold text-zinc-900 text-lg">Aurine Agency</p>
          <p className="text-sm text-zinc-600 mt-1">ul. Przykładowa 123</p>
          <p className="text-sm text-zinc-600">00-000 Warszawa</p>
          <p className="text-sm text-zinc-600 mt-2">NIP: 1234567890</p>
        </div>
        <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nabywca</span>
          </div>
          <p className="font-bold text-zinc-900 text-lg">{data.clientName || "—"}</p>
          <p className="text-sm text-zinc-600 mt-1">{data.clientAddress || "Adres klienta"}</p>
          {data.clientNIP && <p className="text-sm text-zinc-600 mt-2">NIP: {data.clientNIP}</p>}
        </div>
      </section>

      {/* Services Table */}
      <section className="mb-8">
        <div className="bg-zinc-900 text-white rounded-t-xl px-4 py-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium uppercase tracking-wider">
            <div className="col-span-1">Lp.</div>
            <div className="col-span-5">Nazwa usługi</div>
            <div className="col-span-2 text-right">Ilość</div>
            <div className="col-span-2 text-right">Cena jedn.</div>
            <div className="col-span-2 text-right">Wartość</div>
          </div>
        </div>
        <div className="border border-t-0 border-zinc-200 rounded-b-xl">
          <div className="grid grid-cols-12 gap-2 px-4 py-4 text-sm border-b border-zinc-100">
            <div className="col-span-1 text-zinc-500">1</div>
            <div className="col-span-5 font-medium text-zinc-900">{data.serviceDescription || "Usługi marketingowe Facebook Ads"}</div>
            <div className="col-span-2 text-right text-zinc-600">1 szt.</div>
            <div className="col-span-2 text-right text-zinc-600">{formatAmount(data.amount)} PLN</div>
            <div className="col-span-2 text-right font-bold text-zinc-900">{formatAmount(data.amount)} PLN</div>
          </div>

          {data.invoiceType === "final" && advanceAmount > 0 && (
            <div className="grid grid-cols-12 gap-2 px-4 py-4 text-sm bg-amber-50">
              <div className="col-span-1 text-zinc-500">2</div>
              <div className="col-span-5 font-medium text-amber-700">Zaliczka wpłacona</div>
              <div className="col-span-2 text-right text-zinc-600">1 szt.</div>
              <div className="col-span-2 text-right text-zinc-600">-{formatAmount(data.advanceAmount)} PLN</div>
              <div className="col-span-2 text-right font-bold text-amber-700">-{formatAmount(data.advanceAmount)} PLN</div>
            </div>
          )}
        </div>
      </section>

      {/* Summary */}
      <section className="flex justify-end mb-8">
        <div className="w-80 space-y-2">
          <div className="flex justify-between py-2 border-b border-zinc-200">
            <span className="text-zinc-600">Wartość netto</span>
            <span className="font-medium">{formatAmount(String(finalAmount))} PLN</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-200">
            <span className="text-zinc-600">VAT (zw.)</span>
            <span className="font-medium">0,00 PLN</span>
          </div>
          <div className="flex justify-between py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl px-4 -mx-2">
            <span className="font-bold">DO ZAPŁATY</span>
            <span className="font-bold text-xl">{formatAmount(String(finalAmount))} PLN</span>
          </div>
        </div>
      </section>

      {/* Amount in words */}
      <section className="bg-zinc-50 rounded-xl p-4 mb-8 border border-zinc-200">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Kwota słownie</p>
        <p className="font-medium text-zinc-900">{zloteSlownie} złotych {grosze}/100</p>
      </section>

      {/* Payment info */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200 mb-8">
        <p className="text-xs text-pink-600 uppercase tracking-wider font-bold mb-3">Dane do przelewu</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-500">Bank</p>
            <p className="font-medium text-zinc-900">mBank</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Numer konta</p>
            <p className="font-medium text-zinc-900">00 1140 0000 0000 0000 0000 0000</p>
          </div>
        </div>
      </section>

      {/* VAT exempt notice */}
      <section className="text-center text-xs text-zinc-400 mb-8">
        <p>Zwolnione z VAT na podstawie art. 113 ust. 1 ustawy o VAT</p>
      </section>

      {/* Footer */}
      <footer className="flex justify-between items-end pt-8 border-t border-zinc-200">
        <div className="text-center">
          <div className="w-48 border-b border-zinc-300 mb-2"></div>
          <p className="text-xs text-zinc-500">Podpis wystawcy</p>
        </div>
        <div className="text-center">
          <div className="w-48 border-b border-zinc-300 mb-2"></div>
          <p className="text-xs text-zinc-500">Podpis odbiorcy</p>
        </div>
      </footer>

      {/* Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <p className="text-[10px] text-zinc-400">aurine.pl • Profesjonalny marketing dla salonów beauty</p>
      </div>
    </div>
  );
};
