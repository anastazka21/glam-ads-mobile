import { History, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportHistoryItem } from "@/hooks/useReportHistory";

interface ReportHistoryProps {
  history: ReportHistoryItem[];
  onSelect: (data: Record<string, string>) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const ReportHistory = ({ history, onSelect, onDelete, onClear }: ReportHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Historia raportów</h3>
        </div>
        <p className="text-muted-foreground text-sm">Brak zapisanych raportów. Wygeneruj pierwszy raport, aby pojawił się tutaj.</p>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Historia raportów</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Wyczyść
        </Button>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
              onClick={() => onSelect(item.data)}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.clientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.period} • {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
