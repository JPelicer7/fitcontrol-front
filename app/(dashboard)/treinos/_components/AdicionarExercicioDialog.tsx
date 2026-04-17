"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Dumbbell, Plus, Check } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { type GetExercicios201ExerciciosItem } from "@/app/_lib/api/fetch-generated";
import { criarExercicioAction, adicionarExercicioAoTreinoAction } from "../actions";


type ExercicioItem = GetExercicios201ExerciciosItem & { id: string };

type Etapa = "selecionar" | "criar" | "configurar";

interface AdicionarExercicioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treinoId: string;
  exercicios: ExercicioItem[];
}

interface ConfigForm {
  series: number;
  repeticoes: string;
  carga: string;
}

export function AdicionarExercicioDialog({
  open,
  onOpenChange,
  treinoId,
  exercicios,
}: AdicionarExercicioDialogProps) {
  const router = useRouter();

  const [etapa, setEtapa] = useState<Etapa>("selecionar");
  const [isPending, setIsPending] = useState(false);

  // Etapa selecionar
  const [busca, setBusca] = useState("");

  // Etapa criar
  const [novoNome, setNovoNome] = useState("");

  // Etapa configurar
  const [exercicioSelecionado, setExercicioSelecionado] = useState<ExercicioItem | null>(null);
  const [configForm, setConfigForm] = useState<ConfigForm>({
    series: 3,
    repeticoes: "12",
    carga: "",
  });

  const exerciciosFiltrados = useMemo(() => {
    if (!busca.trim()) return exercicios;
    return exercicios.filter((e) =>
      e.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }, [exercicios, busca]);

  const handleFechar = (open: boolean) => {
    if (!open) resetar();
    onOpenChange(open);
  };

  const resetar = () => {
    setEtapa("selecionar");
    setBusca("");
    setNovoNome("");
    setExercicioSelecionado(null);
    setConfigForm({ series: 3, repeticoes: "12", carga: "" });
  };

  const handleSelecionarExercicio = (exercicio: ExercicioItem) => {
    setExercicioSelecionado(exercicio);
    setEtapa("configurar");
  };

  const handleCriarExercicio = async () => {
    if (!novoNome.trim()) {
      toast.error("Informe o nome do exercício.");
      return;
    }

    setIsPending(true);
    const result = await criarExercicioAction({ nome: novoNome.trim() });
    setIsPending(false);

    if (!result.sucesso || !result.id) {
      toast.error(result.mensagem || "Erro ao criar exercício.");
      return;
    }

    
    const criado: ExercicioItem = { id: result.id, nome: novoNome.trim() };
    setExercicioSelecionado(criado);
    setEtapa("configurar");
  };

  const handleAdicionarAoTreino = async () => {
    if (!exercicioSelecionado) return;

    if (configForm.series < 1) {
      toast.error("Informe um número de séries válido.");
      return;
    }
    if (!configForm.repeticoes.trim()) {
      toast.error("Informe as repetições.");
      return;
    }

    setIsPending(true);
    const result = await adicionarExercicioAoTreinoAction(treinoId, {
      exercicioId: exercicioSelecionado.id,
      series: configForm.series,
      repeticoes: configForm.repeticoes,
      carga: configForm.carga || undefined,
    });
    setIsPending(false);

    if (result.sucesso) {
      toast.success("Exercício adicionado ao treino!");
      handleFechar(false);
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao adicionar exercício.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleFechar}>
      <DialogContent className="max-w-md">

        {/* Etapa 1 — Selecionar */}
        {etapa === "selecionar" && (
          <>
            <DialogHeader>
              <DialogTitle>Adicionar Exercício</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Selecione um exercício ou crie um novo.
            </p>

            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar exercício..."
                className="pl-9"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <ScrollArea className="max-h-56 mt-2">
              <div className="space-y-1">
                {exerciciosFiltrados.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleSelecionarExercicio(ex)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <Dumbbell className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{ex.nome}</p>
                      {ex.grupoMuscular && (
                        <p className="text-xs text-muted-foreground">{ex.grupoMuscular}</p>
                      )}
                    </div>
                  </button>
                ))}
                {exerciciosFiltrados.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum exercício encontrado
                  </p>
                )}
              </div>
            </ScrollArea>

            <DialogFooter className="flex-row gap-2 sm:justify-between">
              <Button variant="outline" onClick={() => handleFechar(false)}>
                Cancelar
              </Button>
              <Button
                variant="secondary"
                className="gap-1.5"
                onClick={() => {
                  setNovoNome(busca);
                  setEtapa("criar");
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Criar Novo
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Etapa 2 — Criar exercício global */}
        {etapa === "criar" && (
          <>
            <DialogHeader>
              <DialogTitle>Criar Novo Exercício</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              O exercício será salvo e poderá ser reutilizado em outros treinos.
            </p>

            <div className="mt-2 space-y-3">
              <div className="space-y-1.5">
                <Label>Nome do Exercício</Label>
                <Input
                  placeholder="Ex: Rosca Scott"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEtapa("selecionar")}>
                Voltar
              </Button>
              <Button onClick={handleCriarExercicio} disabled={isPending}>
                {isPending ? "Criando..." : "Criar e Selecionar"}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Etapa 3 — Configurar séries/reps/carga */}
        {etapa === "configurar" && exercicioSelecionado && (
          <>
            <DialogHeader>
              <DialogTitle>Configurar Exercício</DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-3 mt-1 p-3 rounded-lg bg-muted/30 border border-border">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <Dumbbell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {exercicioSelecionado.nome}
                </p>
                <p className="text-xs text-muted-foreground">
                  Defina séries, repetições e carga
                </p>
              </div>
              <Check className="w-4 h-4 text-primary shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="space-y-1.5">
                <Label>Séries</Label>
                <Input
                  type="number"
                  min={1}
                  value={configForm.series}
                  onChange={(e) =>
                    setConfigForm((f) => ({ ...f, series: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Repetições</Label>
                <Input
                  placeholder="10-12"
                  value={configForm.repeticoes}
                  onChange={(e) =>
                    setConfigForm((f) => ({ ...f, repeticoes: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Carga</Label>
                <Input
                  placeholder="60 kg"
                  value={configForm.carga}
                  onChange={(e) =>
                    setConfigForm((f) => ({ ...f, carga: e.target.value }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setExercicioSelecionado(null);
                  setEtapa("selecionar");
                }}
              >
                Voltar
              </Button>
              <Button onClick={handleAdicionarAoTreino} disabled={isPending}>
                {isPending ? "Adicionando..." : "Adicionar ao Treino"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}