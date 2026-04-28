import { AppSidebarAluno } from "./components/app-sidebar-aluno";

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebarAluno />
      <main className="flex-1 lg:ml-64 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}