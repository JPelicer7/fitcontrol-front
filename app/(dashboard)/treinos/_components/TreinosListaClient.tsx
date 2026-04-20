"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, ChevronRight, Trash2 } from "lucide-react";
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

interface TreinosListaClientProps {
  treinos: GetTreinos201TreinosItem[];
  treinoSelecionadoId: string | undefined;
}

export function TreinosListaClient({
  treinos,
  treinoSelecionadoId,
}: TreinosListaClientProps) {
  const router = useRouter();
  const [deletandoId, setDeletandoId] = useState<string | null>(null);
  const [treinoParaDeletar, setTreinoParaDeletar] =
    useState<GetTreinos201TreinosItem | null>(null);

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
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Treinos Criados
        </h3>

        {treinos.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Nenhum treino criado ainda
          </p>
        )}

        {treinos.map((treino) => (
          <div key={treino.id} className="relative group">
            <button
              onClick={() => router.push(`?treinoId=${treino.id}`)}
              className={`w-full text-left metric-card flex items-center gap-4 cursor-pointer transition-all ${
                treinoSelecionadoId === treino.id
                  ? "border-primary/50 glow-border"
                  : ""
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {treino.nome}
                </p>
                <p className="text-xs text-muted-foreground">
                  {treino.qtdExercicios} exercício
                  {treino.qtdExercicios !== 1 ? "s" : ""} ·{" "}
                  {treino.qtdAlunos} aluno
                  {treino.qtdAlunos !== 1 ? "s" : ""}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
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
        ))}
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
              ? Todos os exercícios e vínculos com alunos serão removidos
              permanentemente.
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