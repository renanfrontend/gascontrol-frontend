// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BarChart3, AlertTriangle, Activity } from "lucide-react";
import { leituraMockService } from '~/data/mockApi';
import { ConsumptionChart } from '~/components/dashboard/ConsumptionChart';

type ChartData = { date: string; consumo: number }[];

export default function DashboardPage() {
  const [chartData, setChartData] = useState<ChartData>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    leituraMockService.getDailyConsumptionSummary().then(data => {
        setChartData(data);
        setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Cards de KPI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Gasômetros</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">Medidores cadastrados no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leituras (Últimos 30 dias)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">Registros de consumo no período</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Alertas com status 'novo'</p>
          </CardContent>
        </Card>
      </div>

      {/* Card do Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo Geral (Últimos 7 Dias)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[350px] w-full flex items-center justify-center">
              <p className="text-gray-500">Carregando dados do gráfico...</p>
            </div>
          ) : (
            <ConsumptionChart data={chartData} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}