import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BarChart3, AlertTriangle, Activity } from "lucide-react";

const summaryCards = [
  {
    title: "Total de Gasômetros",
    icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
    value: 14,
    description: "Medidores cadastrados no sistema",
  },
  {
    title: "Leituras (Últimos 30 dias)",
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    value: 152,
    description: "Registros de consumo no período",
  },
  {
    title: "Alertas Ativos",
    icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
    value: 2,
    description: "Alertas com status 'novo'",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Consumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full bg-gray-800/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Espaço reservado para o gráfico de consumo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
