"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Pencil } from "lucide-react";
import { toast } from "sonner";
import { type GetTreinoDetalhado201ExerciciosItem } from "@/app/_lib/api/fetch-generated";
import { atualizarExercicioDoTreinoAction } from "../actions";

const REPETICOES_MAX = 10;
const CARGA_MAX = 3;
const SERIES_MAX = 20;
const SERIES_MIN = 1;

interface EditarExercicioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treinoId: string;
  exercicio: GetTreinoDetalhado201ExerciciosItem | null;
}

export function EditarExercicioDialog({
  open,
  onOpenChange,
  treinoId,
  exercicio,
}: EditarExercicioDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ series: 3, repeticoes: "", carga: "" });

  useEffect(() => {
    if (exercicio) {
      setForm({
        series: exercicio.series,
        repeticoes: exercicio.repeticoes,
        carga: exercicio.carga ?? "",
      });
    }
  }, [exercicio]);

  const handleSalvar = async () => {
    if (!exercicio) return;
    if (!form.repeticoes.trim()) {
      toast.error("Informe as repetições.");
      return;
    }

    setIsPending(true);
    const result = await atualizarExercicioDoTreinoAction(treinoId, exercicio.id, {
      series: form.series,
      repeticoes: form.repeticoes,
      carga: form.carga || undefined,
    });
    setIsPending(false);

    if (result.sucesso) {
      toast.success("Exercício atualizado!");
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao atualizar exercício.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Exercício</DialogTitle>
        </DialogHeader>

        {exercicio && (
          <div className="flex items-center gap-3 mt-1 p-3 rounded-lg bg-muted/30 border border-border">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Dumbbell className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {exercicio.nomeTreino.nome}
              </p>
              <p className="text-xs text-muted-foreground">
                Ajuste séries, repetições e carga
              </p>
            </div>
            <Pencil className="w-4 h-4 text-primary shrink-0" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="space-y-1.5">
            <Label>Séries</Label>
            <Input
              type="number"
              min={SERIES_MIN}
              max={SERIES_MAX}
              value={form.series}
              onChange={(e) => {
                const val = Math.min(
                  SERIES_MAX,
                  Math.max(SERIES_MIN, Number(e.target.value))
                );
                setForm((f) => ({ ...f, series: val }));
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Repetições</Label>
            <Input
              placeholder="10-12"
              value={form.repeticoes}
              maxLength={REPETICOES_MAX}
              onChange={(e) =>
                setForm((f) => ({ ...f, repeticoes: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Carga</Label>
            <Input
              placeholder="60 kg"
              value={form.carga}
              maxLength={CARGA_MAX}
              onChange={(e) =>
                setForm((f) => ({ ...f, carga: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={isPending || !form.repeticoes.trim()}
          >
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}