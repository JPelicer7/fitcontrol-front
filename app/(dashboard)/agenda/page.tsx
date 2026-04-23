import { getAgendamentosDia, getUsers } from "@/app/_lib/api/fetch-generated";
import { AgendaPageClient } from "./_components/AgendaPageClient";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  // default: hoje no formato YYYY-MM-DD
  const dataParam =
    params.data ?? new Date().toISOString().split("T")[0];

  const [agendaResponse, alunosResponse] = await Promise.all([
    getAgendamentosDia({ data: dataParam }),
    getUsers({ Status: "Ativo", limit: 100 }),
  ]);

  const agendamentos =
    agendaResponse.status === 201 ? agendaResponse.data.agendamentos : [];
  const alunos =
    alunosResponse.status === 201 ? alunosResponse.data.users : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie seus compromissos e aulas
        </p>
      </div>

      <AgendaPageClient
        agendamentos={agendamentos}
        alunos={alunos}
        dataSelecionada={dataParam}
      />
    </div>
  );
}

export const metadata = { title: "Agenda" };