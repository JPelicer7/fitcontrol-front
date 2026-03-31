import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getUser } from "@/app/_lib/api/fetch-generated";
import BotaoNovaMedicao from "../_components/BotaoNovaMedicao";
import AlunoProfile from "./_components/AlunoProfile";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getUser(id);
  
  if (response.status !== 200 || !response.data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
         <p>Aluno não encontrado ou erro ao carregar dados.</p>
         <Link href="/alunos" className="text-primary mt-4 inline-block hover:underline">
           Voltar para listagem
         </Link>
       </div>
    );
  }

  const { user, medidas } = response.data;
  const medidaMaisRecente = medidas.todas[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/alunos" className="p-2 rounded-lg hover:bg-muted transition-colors w-fit">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground mt-1 capitalize">
            {medidaMaisRecente?.idade ? `${medidaMaisRecente.idade} anos • ` : ""}
            Plano {user.plano}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            user.status.toUpperCase() === "ATIVO" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
          }`}>
            {user.status}
          </span>
          <BotaoNovaMedicao usuarioId={id} />
        </div>
      </div>

      {}
      {medidaMaisRecente ? (
        <AlunoProfile 
        key={medidaMaisRecente.id}
          initialUser={user} 
          initialMedidas={medidas} 
          medidaId={medidaMaisRecente.id} 
          userId={id}
        />
      ) : (
        <div className="metric-card p-12 text-center text-muted-foreground border border-dashed">
            Nenhuma avaliação física registrada para este aluno ainda.
        </div>
      )}
    </div>
  );
}