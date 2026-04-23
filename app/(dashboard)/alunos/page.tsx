import { Plus } from "lucide-react";
import Link from "next/link";
import { getUsers } from "@/app/_lib/api/fetch-generated";
import { AlunosFiltros } from "./filtros"; 
import { AlunosPaginacao } from "./paginacao";
import { AlunosTabelaClient } from "./_components/AlunosTabelaClient";

export default async function AlunosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  
  const params = await searchParams;

  const page = params.page ? Number(params.page) : 1;
  
  const response = await getUsers({
    name: params.name,
    Status: params.status,
    plano: params.plano,
    page: page
  });
  
  let alunos: any[] = [];
  let total = 0;
  let totalPages = 0;
  let currentPage = 1;

  if (response.status === 201) {
    alunos = response.data.users;
    total = response.data.totalUsers;
    totalPages = response.data.totalPages || 0;
    currentPage = response.data.currentPage || 1;
  }

  return (
    <div className="space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Alunos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {total} alunos encontrados
          </p>
        </div>
        <Link
          href="/alunos/novo"
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Aluno
        </Link>
      </div>

      {/* Filtros */}
      <AlunosFiltros />

      {/* Container da Tabela com Modais e Dropdowns (Client Component) */}
      <div className="metric-card glow-border p-0 overflow-hidden">
        <AlunosTabelaClient alunos={alunos} />
      </div>

      {/* Paginação */}
      <AlunosPaginacao currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

export const metadata = { title: "Alunos" };