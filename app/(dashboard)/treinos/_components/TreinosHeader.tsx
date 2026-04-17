"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovoTreinoDialog } from "./NovoTreinoDialog";

export function TreinosHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Treinos</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie os treinos dos seus alunos
          </p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo Treino
        </Button>
      </div>

      <NovoTreinoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}