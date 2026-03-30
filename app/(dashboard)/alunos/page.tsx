
// import { Search, Plus, Filter, MoreVertical } from "lucide-react";
// import Link from "next/link";

// import { getUsers, type GetUsers201UsersItem } from "@/app/_lib/api/fetch-generated"; 

// export default async function AlunosPage() {
  
//   const response = await getUsers();
  
//   let alunos : GetUsers201UsersItem[] = [];
//   let total = 0;

  
//   if (response.status === 201) {
//     alunos = response.data.users;
//     total = response.data.totalUsers;
//   } else {
    
//     console.error("Erro ao buscar alunos:", response.data);
//   }

//   // Função para formatar a data que vem do banco
//   const formatarData = (dataString?: string | null) => {
//     if (!dataString) return "Nunca avaliado";
//     return new Date(dataString).toLocaleDateString("pt-BR");
//   };

  
//   const getIniciais = (nome: string) => {
//     return nome.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Alunos</h1>
//           <p className="text-muted-foreground mt-1">
//             {total} alunos cadastrados
//           </p>
//         </div>
//         <Link
//           href="/alunos/novo"
//           className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
//         >
//           <Plus className="w-4 h-4" />
//           Novo Aluno
//         </Link>
//       </div>

//       {/* Search & Filter */}
//       <div className="flex gap-3">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="Buscar aluno por nome ou telefone..."
//             className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
//           />
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer">
//           <Filter className="w-4 h-4" />
//           Filtros
//         </button>
//       </div>

//       {/* Table */}
//       <div className="metric-card glow-border overflow-hidden p-0">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-border">
//               <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aluno</th>
//               <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plano</th>
//               <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
//               <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Última Medição</th>
//               <th className="py-3 px-5"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {alunos.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="py-8 text-center text-muted-foreground">
//                   Nenhum aluno encontrado.
//                 </td>
//               </tr>
//             ) : (
//               alunos.map((student, index) => (
//                 <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
//                   <td className="py-3.5 px-5">
//                     <Link href={`/aluno/1`} className="flex items-center gap-3 group">
//                       <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
//                         {getIniciais(student.name)}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
//                           {student.name}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {student.telefone ?? <span className="italic opacity-60">Sem telefone</span>}
//                         </p>
//                       </div>
//                     </Link>
//                   </td>
//                   <td className="py-3.5 px-5">
//                     <span className="text-sm text-secondary-foreground">{student.plano}</span>
//                   </td>
//                   <td className="py-3.5 px-5">
//                     <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${student.Status?.toUpperCase().trim() === "ATIVO" ? "status-active" : "status-inactive"}`}>
//                       {student.Status}
//                     </span>
//                   </td>
//                   <td className="py-3.5 px-5">
//                     <span className="text-sm text-muted-foreground">
//                       {formatarData(student.ultimaAvaliacao)}
//                     </span>
//                   </td>
//                   <td className="py-3.5 px-5">
//                     <button className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer">
//                       <MoreVertical className="w-4 h-4 text-muted-foreground" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { Plus, MoreVertical } from "lucide-react";
import Link from "next/link";
import { getUsers } from "@/app/_lib/api/fetch-generated";
import { AlunosFiltros } from "./filtros"; 
import { AlunosPaginacao } from "./paginacao";


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

  const formatarData = (dataString?: string | null) => {
    if (!dataString) return "Nunca avaliado";
    return new Date(dataString).toLocaleDateString("pt-BR");
  };

  const getIniciais = (nome: string) => {
    return nome.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alunos</h1>
          <p className="text-muted-foreground mt-1">
            {total} alunos encontrados
          </p>
        </div>
        <Link
          href="/alunos/novo"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Aluno
        </Link>
      </div>

      {}
      <AlunosFiltros />

      <div className="metric-card glow-border overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aluno</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plano</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Última Medição</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {alunos.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nenhum aluno encontrado com esses filtros.
                </td>
              </tr>
            ) : (
              alunos.map((student, index) => (
                <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5">
                  <Link href={`/alunos/${student.id}`} className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                        {getIniciais(student.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.telefone ?? "Sem telefone"}
                        </p>
                      </div>
                    </div>
                    </Link>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-sm text-secondary-foreground">{student.plano}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      student.Status?.toUpperCase().trim() === "ATIVO"
                        ? "bg-primary/15 text-primary" 
                        : "bg-destructive/15 text-destructive"
                    }`}>
                      {student.Status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-sm text-muted-foreground">
                      {formatarData(student.ultimaAvaliacao)}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AlunosPaginacao currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}