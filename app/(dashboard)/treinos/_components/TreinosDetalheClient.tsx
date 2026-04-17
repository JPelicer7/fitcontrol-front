"use client";

import { useState } from "react";
import { Dumbbell, Users, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  type GetTreinoDetalhado201,
  type GetExercicios201ExerciciosItem,
  type GetUsers201UsersItem,
  type GetAlunosTreino201AlunosItem,
} from "@/app/_lib/api/fetch-generated";
import { AdicionarExercicioDialog } from "./AdicionarExercicioDialog";
import { VincularAlunoDialog } from "./VincularAlunoDialog";

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
  const [exercicioDialogOpen, setExercicioDialogOpen] = useState(false);
  const [alunoDialogOpen, setAlunoDialogOpen] = useState(false);

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
              <table className="w-full">
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
                  </tr>
                </thead>
                <tbody>
                  {treinoDetalhado.exercicios.map((ex, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
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
                    </tr>
                  ))}
                </tbody>
              </table>
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
                {alunosTreino.map((aluno, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
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
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        aluno.Status === "Ativo"
                          ? "bg-primary/15 text-primary"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {aluno.Status}
                    </span>
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

      <VincularAlunoDialog
        open={alunoDialogOpen}
        onOpenChange={setAlunoDialogOpen}
        treinoId={treinoId}
        alunos={alunos}
      />
    </div>
  );
}