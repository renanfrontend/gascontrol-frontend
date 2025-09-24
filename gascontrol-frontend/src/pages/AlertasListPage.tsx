import { useState, useEffect } from 'react';
import { alertaMockService, Alerta } from '~/data/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from '~/components/ui/badge';

const statusVariantMap: Record<Alerta['status'], 'default' | 'secondary' | 'destructive'> = {
  novo: 'destructive',
  'em análise': 'secondary',
  resolvido: 'default'
}

export default function AlertasListPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  useEffect(() => {
    alertaMockService.getAll().then(setAlertas);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
        <CardDescription>Avisos de consumo e medidores que requerem atenção.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead> 
              <TableHead>Mensagem</TableHead> 
              <TableHead>Status</TableHead> 
              <TableHead>Data</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertas.map((alerta) => (
              <TableRow key={alerta.id}>
                <TableCell className="font-medium">{alerta.tipo.replace('_', ' ')}</TableCell>
                <TableCell>{alerta.mensagem}</TableCell>
                <TableCell>
                   <Badge variant={statusVariantMap[alerta.status]}>
                      {alerta.status}
                    </Badge>
                </TableCell>
                <TableCell>{new Date(alerta.criado_em).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}