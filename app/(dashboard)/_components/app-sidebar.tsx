// app/(dashboard)/_components/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCircle, DollarSign, Dumbbell, Activity, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

const professionalNav = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/alunos", icon: Users, label: "Alunos" },
  { href: "/aluno/1", icon: UserCircle, label: "Perfil Aluno" },
  { href: "/treinos", icon: Dumbbell, label: "Treinos" },
  { href: "/financeiro", icon: DollarSign, label: "Financeiro" },
];

const studentNav = [
  { href: "/aluno/meu-treino", icon: Dumbbell, label: "Meu Treino" },
  { href: "/aluno/minhas-medidas", icon: Activity, label: "Minhas Medidas" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<"professional" | "student">("professional");

  const navItems = viewMode === "professional" ? professionalNav : studentNav;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">FitControl</h1>
          <p className="text-xs text-muted-foreground">Gestão de Academia</p>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="px-3 mb-2">
        <button
          onClick={() => setViewMode(viewMode === "professional" ? "student" : "professional")}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          {viewMode === "professional" ? "Visão: Profissional" : "Visão: Aluno"}
        </button>
      </div>

      <nav className="flex-1 px-3 mt-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href === "/aluno/1" && pathname.startsWith("/aluno/") && !pathname.includes("meu-treino") && !pathname.includes("minhas-medidas"));
            
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground">Logada como</p>
        <p className="text-sm font-semibold text-foreground mt-1">
          {viewMode === "professional" ? "Maria Silva" : "Ana Costa"}
        </p>
        <p className="text-xs text-muted-foreground">
          {viewMode === "professional" ? "Proprietária" : "Aluna"}
        </p>
      </div>
    </aside>
  );
}