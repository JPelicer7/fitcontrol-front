"use client";

import { useState } from "react";
import { Dumbbell, Users, Plus, Pencil, X, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  type GetTreinoDetalhado201,
  type GetTreinoDetalhado201ExerciciosItem,
  type GetExercicios201ExerciciosItem,
  type GetUsers201UsersItem,
  type GetAlunosTreino201AlunosItem,
} from "@/app/_lib/api/fetch-generated";
import { AdicionarExercicioDialog } from "./AdicionarExercicioDialog";
import { EditarExercicioDialog } from "./EditarExercicioDialog";
import { VincularAlunoDialog } from "./VincularAlunoDialog";
import { deletarExercicioDoTreinoAction, desvincularAlunoDoTreinoAction } from "../actions";

type ExercicioItem = GetExercicios201ExerciciosItem & { id: string };

interface TreinosDetalheClientProps {
  treinoId: string;
  treinoDetalhado: GetTreinoDetalhado201;
  alunosTreino: GetAlunosTreino201AlunosItem[];
  exercicios: ExercicioItem[];
  alunos: GetUsers201UsersItem[];
}

export function TreinosDetalheClient({
  treinoId,
  treinoDetalhado,
  alunosTreino,
  exercicios,
  alunos,
}: TreinosDetalheClientProps) {
  const router = useRouter();

  const [exercicioDialogOpen, setExercicioDialogOpen] = useState(false);
  const [alunoDialogOpen, setAlunoDialogOpen] = useState(false);
  const [exercicioEditando, setExercicioEditando] =
    useState<GetTreinoDetalhado201ExerciciosItem | null>(null);
  const [deletandoExercicioId, setDeletandoExercicioId] = useState<string | null>(null);
  const [alunoParaDesvincular, setAlunoParaDesvincular] =
    useState<GetAlunosTreino201AlunosItem | null>(null);
  const [desvinculandoId, setDesvinculandoId] = useState<string | null>(null);

  const handleDeletarExercicio = async (ex: GetTreinoDetalhado201ExerciciosItem) => {
    setDeletandoExercicioId(ex.id);
    const result = await deletarExercicioDoTreinoAction(treinoId, ex.id);
    setDeletandoExercicioId(null);

    if (result.sucesso) {
      toast.success("Exercício removido.");
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao remover exercício.");
    }
  };

  const handleConfirmarDesvincular = async () => {
    if (!alunoParaDesvincular) return;

    setDesvinculandoId(alunoParaDesvincular.id);
    const result = await desvincularAlunoDoTreinoAction(
      treinoId,
      alunoParaDesvincular.id
    );
    setDesvinculandoId(null);
    setAlunoParaDesvincular(null);

    if (result.sucesso) {
      toast.success(`${alunoParaDesvincular.nome} desvinculado do treino.`);
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao desvincular aluno.");
    }
  };

  return (
    <div className="lg:col-span-2 space-y-4">
      <Tabs defaultValue="exercicios">
        <TabsList>
          <TabsTrigger value="exercicios">Exercícios</TabsTrigger>
          <TabsTrigger value="alunos">
            Alunos Vinculados ({alunosTreino.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercicios">
          <div className="metric-card glow-border overflow-hidden p-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {treinoDetalhado.nome}
                </h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => setExercicioDialogOpen(true)}
              >
                <Plus className="w-3.5 h-3.5" />
                Exercício
              </Button>
            </div>

            {treinoDetalhado.exercicios.length === 0 ? (
              <div className="py-12 text-center">
                <Dumbbell className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Nenhum exercício adicionado
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 gap-1.5"
                  onClick={() => setExercicioDialogOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Exercício
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Exercício
                      </th>
                      <th className="text-center py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Séries
                      </th>
                      <th className="text-center py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Repetições
                      </th>
                      <th className="text-center py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Carga
                      </th>
                      <th className="w-16" />
                    </tr>
                  </thead>
                  <tbody>
                    {treinoDetalhado.exercicios.map((ex) => (
                      <tr
                        key={ex.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group/row"
                      >
                        <td className="py-3 px-5 text-sm font-medium text-foreground">
                          {ex.nomeTreino.nome}
                        </td>
                        <td className="py-3 px-5 text-sm text-center text-foreground">
                          {ex.series}
                        </td>
                        <td className="py-3 px-5 text-sm text-center text-foreground">
                          {ex.repeticoes}
                        </td>
                        <td className="py-3 px-5 text-sm text-center text-muted-foreground">
                          {ex.carga ?? "—"}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover/row:opacity-100 transition-opacity">
                            <button
                              onClick={() => setExercicioEditando(ex)}
                              className="p-1 rounded hover:bg-primary/15 transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-3.5 h-3.5 text-primary" />
                            </button>
                            <button
                              onClick={() => handleDeletarExercicio(ex)}
                              disabled={deletandoExercicioId === ex.id}
                              className="p-1 rounded hover:bg-destructive/15 transition-colors disabled:opacity-50"
                              title="Remover"
                            >
                              <X className="w-3.5 h-3.5 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="alunos">
          <div className="metric-card glow-border overflow-hidden p-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Alunos com este treino
                </h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => setAlunoDialogOpen(true)}
              >
                <Plus className="w-3.5 h-3.5" />
                Vincular Aluno
              </Button>
            </div>

            {alunosTreino.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Nenhum aluno vinculado
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 gap-1.5"
                  onClick={() => setAlunoDialogOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Vincular Aluno
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {alunosTreino.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors group/aluno"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {aluno.nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {aluno.nome}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          aluno.Status === "Ativo"
                            ? "bg-primary/15 text-primary"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {aluno.Status}
                      </span>
                      <button
                        onClick={() => setAlunoParaDesvincular(aluno)}
                        disabled={desvinculandoId === aluno.id}
                        className="opacity-100 md:opacity-0 md:group-hover/aluno:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/15 disabled:opacity-50"
                        title="Desvincular aluno"
                      >
                        <UserMinus className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AdicionarExercicioDialog
        open={exercicioDialogOpen}
        onOpenChange={setExercicioDialogOpen}
        treinoId={treinoId}
        exercicios={exercicios}
      />

      <EditarExercicioDialog
        open={!!exercicioEditando}
        onOpenChange={(open) => !open && setExercicioEditando(null)}
        treinoId={treinoId}
        exercicio={exercicioEditando}
      />

      <VincularAlunoDialog
        open={alunoDialogOpen}
        onOpenChange={setAlunoDialogOpen}
        treinoId={treinoId}
        alunos={alunos}
      />

      <AlertDialog
        open={!!alunoParaDesvincular}
        onOpenChange={(open) => !open && setAlunoParaDesvincular(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desvincular aluno</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desvincular{" "}
              <span className="font-semibold text-foreground">
                {alunoParaDesvincular?.nome}
              </span>{" "}
              deste treino? O aluno perderá acesso a este treino.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarDesvincular}
              disabled={!!desvinculandoId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {desvinculandoId ? "Desvinculando..." : "Sim, desvincular"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}