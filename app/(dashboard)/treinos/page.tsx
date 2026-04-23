import {
  getTreinos,
  getTreinoDetalhado,
  getExercicios,
  getUsers,
  getAlunosTreino,
} from "@/app/_lib/api/fetch-generated";
import { TreinosListaClient } from "./_components/TreinosListaClient";
import { TreinosDetalheClient } from "./_components/TreinosDetalheClient";

import { TreinosHero } from "./_components/TreinosHero";

export const metadata = { title: "Treinos" };

export default async function TreinosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const [listResponse, exerciciosResponse, alunosResponse] = await Promise.all([
    getTreinos(),
    getExercicios(),
    getUsers({ Status: "Ativo", limit: 100 }),
  ]);

  const treinos = listResponse.status === 201 ? listResponse.data.treinos : [];
  const exercicios =
    exerciciosResponse.status === 201 ? exerciciosResponse.data.exercicios : [];
  const alunos =
    alunosResponse.status === 201 ? alunosResponse.data.users : [];

  const treinoIdParam = params.treinoId;
  const treinoId =
    treinoIdParam && /^[0-9a-f-]{36}$/.test(treinoIdParam)
      ? treinoIdParam
      : treinos[0]?.id;

  let treinoDetalhado = null;
  let alunosTreino: { id: string; nome: string; Status: "Ativo" | "Inativo" }[] = [];

  if (treinoId) {
    const [detalheResponse, alunosTreinoResponse] = await Promise.all([
      getTreinoDetalhado(treinoId),
      getAlunosTreino(treinoId),
    ]);
    if (detalheResponse.status === 201) treinoDetalhado = detalheResponse.data;
    if (alunosTreinoResponse.status === 201) alunosTreino = alunosTreinoResponse.data.alunos;
  }

  return (
    <div className="space-y-8">
      <TreinosHero />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TreinosListaClient treinos={treinos} treinoSelecionadoId={treinoId} />

        {treinoDetalhado && treinoId ? (
          <TreinosDetalheClient
            treinoId={treinoId}
            treinoDetalhado={treinoDetalhado}
            alunosTreino={alunosTreino}
            exercicios={exercicios}
            alunos={alunos}
            treinoIndex={treinos.findIndex((t) => t.id === treinoId)}
          />
        ) : (
          treinos.length === 0 && (
            <div className="lg:col-span-2 flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-muted/40 flex items-center justify-center mb-3">
                  <span className="text-2xl">🏋️</span>
                </div>
                <p className="text-sm font-medium text-foreground/70">Nenhum treino criado</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Crie seu primeiro treino pelo botão acima
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}