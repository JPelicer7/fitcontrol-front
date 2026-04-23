"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, ChevronRight, Trash2, Plus, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type GetTreinos201TreinosItem } from "@/app/_lib/api/fetch-generated";
import { deletarTreinoAction } from "../actions";


const CORES = [
  "hsl(0 72% 51%)",
  "hsl(220 70% 50%)",
  "hsl(260 60% 55%)",
  "hsl(38 92% 50%)",
  "hsl(160 84% 39%)",
];

interface TreinosListaClientProps {
  treinos: GetTreinos201TreinosItem[];
  treinoSelecionadoId: string | undefined;
}

export function TreinosListaClient({ treinos, treinoSelecionadoId }: TreinosListaClientProps) {
  const router = useRouter();
  const [deletandoId, setDeletandoId] = useState<string | null>(null);
  const [treinoParaDeletar, setTreinoParaDeletar] = useState<GetTreinos201TreinosItem | null>(null);

  const handleConfirmarDelete = async () => {
    if (!treinoParaDeletar) return;
    setDeletandoId(treinoParaDeletar.id);
    const result = await deletarTreinoAction(treinoParaDeletar.id);
    setDeletandoId(null);
    setTreinoParaDeletar(null);

    if (result.sucesso) {
      toast.success("Treino excluído.");
      if (treinoSelecionadoId === treinoParaDeletar.id) {
        router.push("/treinos");
      } else {
        router.refresh();
      }
    } else {
      toast.error(result.mensagem || "Erro ao excluir treino.");
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.18em]">
            Suas Fichas
          </h3>
          <span className="text-xs text-muted-foreground">{treinos.length} ativas</span>
        </div>

        {treinos.length === 0 && (
          <div className="metric-card text-center py-10">
            <Dumbbell className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum treino criado</p>
          </div>
        )}

        {treinos.map((treino, index) => {
          const cor = CORES[index % CORES.length];
          const isActive = treinoSelecionadoId === treino.id;

          return (
            <div key={treino.id} className="relative group">
              <button
                onClick={() => router.push(`?treinoId=${treino.id}`)}
                className={`w-full text-left relative overflow-hidden rounded-xl border bg-card p-4 pl-5 pr-8 transition-all ${
                  isActive
                    ? "border-primary/50 shadow-[0_0_25px_hsl(var(--primary)/0.12)]"
                    : "border-border hover:border-border/80"
                }`}
              >
                {/* Barra colorida lateral */}
                <span
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: cor }}
                />
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cor + "22" }}
                  >
                    <Dumbbell className="w-5 h-5" style={{ color: cor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {treino.nome}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {treino.qtdExercicios} exercício{treino.qtdExercicios !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {treino.qtdAlunos} aluno{treino.qtdAlunos !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTreinoParaDeletar(treino);
                }}
                disabled={deletandoId === treino.id}
                className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/15 disabled:opacity-50"
                title="Excluir treino"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          );
        })}
      </div>

      <AlertDialog
        open={!!treinoParaDeletar}
        onOpenChange={(open) => !open && setTreinoParaDeletar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir treino</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o treino{" "}
              <span className="font-semibold text-foreground">
                {treinoParaDeletar?.nome}
              </span>
              ? Todos os exercícios e vínculos com alunos serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarDelete}
              disabled={!!deletandoId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletandoId ? "Excluindo..." : "Sim, excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}