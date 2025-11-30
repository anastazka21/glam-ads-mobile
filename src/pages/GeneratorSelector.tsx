import { useNavigate } from "react-router-dom";
import { FileText, Receipt, FileSignature, Presentation, ArrowRight } from "lucide-react";
import agencyLogo from "@/assets/agency-logo.png";

const GeneratorSelector = () => {
  const navigate = useNavigate();

  const generators = [
    {
      id: "report",
      title: "Generator Raportów",
      description: "Profesjonalne raporty kampanii Facebook Ads z wykresami i metrykami",
      icon: FileText,
      path: "/report-generator",
      features: ["Wykresy KPI", "Rekomendacje AI", "PDF/PNG export"],
    },
    {
      id: "invoice",
      title: "Generator Faktur",
      description: "Faktury zaliczkowe, końcowe i pełne zwolnione z VAT",
      icon: Receipt,
      path: "/invoice-generator",
      features: ["3 typy faktur", "Auto-kalkulacja", "PDF export"],
    },
    {
      id: "contract",
      title: "Generator Umów",
      description: "Umowy o świadczenie usług marketingowych",
      icon: FileSignature,
      path: "/contract-generator",
      features: ["Klauzule prawne", "RODO", "PDF export"],
    },
    {
      id: "presentation",
      title: "Generator Prezentacji",
      description: "Spersonalizowane prezentacje do cold maili",
      icon: Presentation,
      path: "/presentation-generator",
      features: ["6 slajdów", "Case study", "Animacje"],
    },
  ];

  return (
    <div className="min-h-screen bg-background dark">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(340_75%_55%/0.15),transparent)]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <header className="pt-16 pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12 animate-fade-in">
              <div className="mb-8 p-4 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm">
                <img
                  src={agencyLogo}
                  alt="Aurine Agency"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Aurine Document Studio
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Profesjonalne narzędzia do generowania dokumentów dla agencji marketingowej specjalizującej się w branży beauty
              </p>
            </div>
          </div>
        </header>

        {/* Generators Grid */}
        <main className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-5">
            {generators.map((gen, index) => (
              <button
                key={gen.id}
                onClick={() => navigate(gen.path)}
                className="group relative p-6 bg-card border border-border/50 rounded-2xl text-left
                         transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
                         animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5
                               group-hover:bg-primary/20 transition-colors duration-300">
                    <gen.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 font-sans">
                    {gen.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                    {gen.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gen.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium
                                 bg-secondary text-secondary-foreground border border-border/50"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                    <span className="mr-2">Otwórz</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-20 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-card/50 border border-border/30 backdrop-blur-sm">
              <img src={agencyLogo} alt="Aurine" className="w-6 h-6 object-contain opacity-70" />
              <span className="text-muted-foreground text-sm font-medium">
                Aurine Agency
              </span>
              <span className="w-px h-4 bg-border" />
              <span className="text-muted-foreground/60 text-sm">
                aurine.pl
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default GeneratorSelector;
