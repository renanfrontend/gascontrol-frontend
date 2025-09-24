import { useState, useEffect } from 'react';
import { gasometroMockService, Gasometro } from '~/data/mockApi';
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { PlusCircle } from 'lucide-react';

export default function GasometrosListPage() {
  const [gasometros, setGasometros] = useState<Gasometro[]>([]);
  useEffect(() => {
    gasometroMockService.getAll().then(setGasometros);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gasômetros</CardTitle>
          <CardDescription>Gerencie os medidores do condomínio.</CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Gasômetro
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificador</TableHead> 
              <TableHead>Descrição</TableHead> 
              <TableHead>Localização</TableHead> 
              <TableHead>Status</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {gasometros.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.identificador}</TableCell>
                <TableCell>{g.descricao}</TableCell>
                <TableCell>{g.localizacao}</TableCell>
                <TableCell>{g.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}