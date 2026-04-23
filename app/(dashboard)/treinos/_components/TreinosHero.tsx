"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovoTreinoDialog } from "./NovoTreinoDialog";

export function TreinosHero() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-border h-64 md:h-72">
        <img
          src="/workouts-hero.jpg"
          alt="Sala de musculação"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-2">
              Programação de Treinos
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Construa fichas de treino{" "}
              <span className="text-primary">profissionais</span> para cada aluno
            </h1>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <Button className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Novo Treino
            </Button>
          </div>
        </div>
      </div>

      <NovoTreinoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}