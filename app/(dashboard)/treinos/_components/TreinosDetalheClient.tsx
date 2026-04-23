"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  Users,
  Plus,
  Pencil,
  X,
  UserMinus,
  Flame,
  Activity,
  FileDown,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { gerarPDFTreino } from "./gerarPDFTreino";
import { ExportarPDFDialog } from "./ExportarPDFDialog";

type ExercicioItem = GetExercicios201ExerciciosItem & { id: string };

const CORES = [
  "hsl(0 72% 51%)",
  "hsl(220 70% 50%)",
  "hsl(260 60% 55%)",
  "hsl(38 92% 50%)",
  "hsl(160 84% 39%)",
];

interface TreinosDetalheClientProps {
  treinoId: string;
  treinoDetalhado: GetTreinoDetalhado201;
  alunosTreino: GetAlunosTreino201AlunosItem[];
  exercicios: ExercicioItem[];
  alunos: GetUsers201UsersItem[];
  treinoIndex?: number;
}

function DetailStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="px-3.5 py-2 rounded-lg bg-background/50 border border-border/60 min-w-[80px] text-center">
      <p className="text-lg font-bold text-foreground leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function SetBadge({ label, value }: { label: string; value: number | string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 border border-border text-[11px]">
      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </span>
  );
}

export function TreinosDetalheClient({
  treinoId,
  treinoDetalhado,
  alunosTreino,
  exercicios,
  alunos,
  treinoIndex = 0,
}: TreinosDetalheClientProps) {
  const router = useRouter();
  const cor = CORES[treinoIndex % CORES.length];

  const [exportarPDFOpen, setExportarPDFOpen] = useState(false);
  const [exercicioDialogOpen, setExercicioDialogOpen] = useState(false);
  const [alunoDialogOpen, setAlunoDialogOpen] = useState(false);
  const [exercicioEditando, setExercicioEditando] =
    useState<GetTreinoDetalhado201ExerciciosItem | null>(null);
  const [deletandoExercicioId, setDeletandoExercicioId] = useState<string | null>(null);
  const [alunoParaDesvincular, setAlunoParaDesvincular] =
    useState<GetAlunosTreino201AlunosItem | null>(null);
  const [desvinculandoId, setDesvinculandoId] = useState<string | null>(null);

  const totalSeries = (treinoDetalhado as any).totalSeries as number | undefined;

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
    const result = await desvincularAlunoDoTreinoAction(treinoId, alunoParaDesvincular.id);
    setDesvinculandoId(null);
    setAlunoParaDesvincular(null);
    if (result.sucesso) {
      toast.success(`${alunoParaDesvincular.nome} desvinculado.`);
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao desvincular.");
    }
  };

  // const handleExportPDF = () => {
  //   const result = gerarPDFTreino(treinoDetalhado, alunosTreino, treinoIndex);
  //   if (result.erro) {
  //     toast.error(result.erro);
  //   } else {
  //     toast.success("PDF gerado com sucesso!");
  //   }
  // };

  
const handleExportPDF = (nomeAluno: string) => {
  const result = gerarPDFTreino(
    treinoDetalhado,
    alunosTreino,
    treinoIndex,
    nomeAluno
  );
  if (result.erro) {
    toast.error(result.erro);
  } else {
    toast.success("PDF gerado com sucesso!");
  }
};

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Banner do treino selecionado */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border p-5"
        style={{
          background: `linear-gradient(135deg, ${cor}28 0%, hsl(var(--card)) 60%)`,
        }}
      >
        <div className="absolute inset-y-0 right-0 w-40 opacity-10 pointer-events-none flex items-center justify-center">
          <Dumbbell className="w-full h-full" style={{ color: cor }} />
        </div>

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: cor + "33", border: `1px solid ${cor}55` }}
            >
              <Flame className="w-6 h-6" style={{ color: cor }} />
            </div>
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.2em] font-bold"
                style={{ color: cor }}
              >
                Ficha selecionada
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {treinoDetalhado.nome}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              //onClick={handleExportPDF}
              onClick={() => setExportarPDFOpen(true)}
              disabled={treinoDetalhado.exercicios.length === 0}
            >
              <FileDown className="w-3.5 h-3.5" />
              Exportar PDF
            </Button>
            <div className="flex gap-2 flex-wrap justify-end">
              <DetailStat label="Exercícios" value={treinoDetalhado.exercicios.length} />
              {totalSeries !== undefined && (
                <DetailStat label="Séries totais" value={totalSeries} />
              )}
              <DetailStat label="Alunos" value={alunosTreino.length} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="exercicios">
        <TabsList>
          <TabsTrigger value="exercicios" className="gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Exercícios
          </TabsTrigger>
          <TabsTrigger value="alunos" className="gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Alunos ({alunosTreino.length})
          </TabsTrigger>
        </TabsList>

        {/* Exercícios */}
        <TabsContent value="exercicios">
          <div className="metric-card overflow-hidden p-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div>
                <h3 className="text-base font-semibold text-foreground">Plano de execução</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sequência sugerida para o treino
                </p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => setExercicioDialogOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                Exercício
              </Button>
            </div>

            {treinoDetalhado.exercicios.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-muted/40 flex items-center justify-center mb-3">
                  <Dumbbell className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground">Nenhum exercício no plano</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Comece adicionando o primeiro exercício
                </p>
                <Button
                  size="sm"
                  className="mt-4 gap-1.5"
                  onClick={() => setExercicioDialogOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Exercício
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <ul className="divide-y divide-border min-w-[480px]">
                  {treinoDetalhado.exercicios.map((ex, i) => (
                    <li
                      key={ex.id}
                      className="group/row flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ backgroundColor: cor + "22", color: cor }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {ex.nomeTreino.nome}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <SetBadge label="séries" value={ex.series} />
                          <SetBadge label="reps" value={ex.repeticoes} />
                          <SetBadge label="carga" value={ex.carga ?? "—"} />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover/row:opacity-100 transition-opacity">
                        <button
                          onClick={() => setExercicioEditando(ex)}
                          className="p-2 rounded hover:bg-primary/15 text-primary"
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletarExercicio(ex)}
                          disabled={deletandoExercicioId === ex.id}
                          className="p-2 rounded hover:bg-destructive/15 text-destructive disabled:opacity-50"
                          title="Remover"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Alunos */}
        <TabsContent value="alunos">
          <div className="metric-card overflow-hidden p-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Alunos com este treino
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Vincule quantos alunos quiser à mesma ficha
                </p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => setAlunoDialogOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                Vincular Aluno
              </Button>
            </div>

            {alunosTreino.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-muted/40 flex items-center justify-center mb-3">
                  <Users className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground">Nenhum aluno vinculado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vincule alunos para que recebam esta ficha
                </p>
                <Button size="sm" className="mt-4 gap-1.5" onClick={() => setAlunoDialogOpen(true)}>
                  <Plus className="w-3.5 h-3.5" />
                  Vincular Aluno
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {alunosTreino.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors group/student"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-foreground">
                          {aluno.nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{aluno.nome}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Vinculado a este treino
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium",
                          aluno.Status === "Ativo"
                            ? "bg-primary/15 text-primary"
                            : "bg-destructive/15 text-destructive"
                        )}
                      >
                        {aluno.Status}
                      </span>
                      <button
                        onClick={() => setAlunoParaDesvincular(aluno)}
                        disabled={desvinculandoId === aluno.id}
                        className="opacity-100 md:opacity-0 md:group-hover/student:opacity-100 transition-opacity p-2 rounded hover:bg-destructive/15 text-destructive disabled:opacity-50"
                        title="Desvincular"
                      >
                        <UserMinus className="w-4 h-4" />
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

      <ExportarPDFDialog
        open={exportarPDFOpen}
        onOpenChange={setExportarPDFOpen}
        alunosTreino={alunosTreino}
        onConfirmar={handleExportPDF}
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
              deste treino?
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
