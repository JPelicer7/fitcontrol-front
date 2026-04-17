"use client";

import { useRouter } from "next/navigation";
import { Dumbbell, ChevronRight } from "lucide-react";
import { GetTreinos201TreinosItem } from "@/app/_lib/api/fetch-generated";

interface TreinosListaClientProps {
  treinos: GetTreinos201TreinosItem[];
  treinoSelecionadoId: string | undefined;
}

export function TreinosListaClient({ treinos, treinoSelecionadoId }: TreinosListaClientProps) {
  const router = useRouter();

  return (
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
        <button
          key={treino.id}
          onClick={() => router.push(`?treinoId=${treino.id}`)}
          className={`w-full text-left metric-card flex items-center gap-4 cursor-pointer transition-all ${
            treinoSelecionadoId === treino.id ? "border-primary/50 glow-border" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{treino.nome}</p>
            <p className="text-xs text-muted-foreground">
              {treino.qtdExercicios} exercício{treino.qtdExercicios !== 1 ? "s" : ""} ·{" "}
              {treino.qtdAlunos} aluno{treino.qtdAlunos !== 1 ? "s" : ""}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}