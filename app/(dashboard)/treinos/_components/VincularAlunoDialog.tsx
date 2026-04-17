"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { type GetUsers201UsersItem } from "@/app/_lib/api/fetch-generated";
import { vincularAlunoAoTreinoAction } from "../actions";

interface VincularAlunoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treinoId: string;
  alunos: GetUsers201UsersItem[];
}

export function VincularAlunoDialog({
  open,
  onOpenChange,
  treinoId,
  alunos,
}: VincularAlunoDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [busca, setBusca] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState<GetUsers201UsersItem | null>(null);

  const alunosFiltrados = useMemo(() => {
    if (!busca.trim()) return alunos;
    return alunos.filter((a) =>
      a.name.toLowerCase().includes(busca.toLowerCase())
    );
  }, [alunos, busca]);

  const handleFechar = (open: boolean) => {
    if (!open) {
      setBusca("");
      setAlunoSelecionado(null);
    }
    onOpenChange(open);
  };

  const handleVincular = async () => {
    if (!alunoSelecionado) return;

    setIsPending(true);
    const result = await vincularAlunoAoTreinoAction(treinoId, {
      userId: alunoSelecionado.id,
    });
    setIsPending(false);

    if (result.sucesso) {
      toast.success(`${alunoSelecionado.name} vinculado ao treino!`);
      handleFechar(false);
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao vincular aluno.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleFechar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular Aluno ao Treino</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Selecione um aluno ativo para vincular a este treino.
        </p>

        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <ScrollArea className="max-h-64 mt-2">
          <div className="space-y-1">
            {alunosFiltrados.map((aluno) => {
              const selecionado = alunoSelecionado?.id === aluno.id;
              return (
                <button
                  key={aluno.id}
                  onClick={() => setAlunoSelecionado(selecionado ? null : aluno)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    selecionado
                      ? "bg-primary/15 border border-primary/30"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {aluno.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {aluno.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{aluno.plano}</p>
                  </div>
                  {selecionado && (
                    <span className="text-xs text-primary font-medium shrink-0">
                      Selecionado
                    </span>
                  )}
                </button>
              );
            })}

            {alunosFiltrados.length === 0 && (
              <div className="py-8 text-center">
                <UserRound className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum aluno encontrado</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleFechar(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleVincular}
            disabled={!alunoSelecionado || isPending}
          >
            {isPending ? "Vinculando..." : "Vincular Aluno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}