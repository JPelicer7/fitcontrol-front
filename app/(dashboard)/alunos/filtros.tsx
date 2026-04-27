"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useRef } from "react";

export function AlunosFiltros() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reseta para página 1 sempre que um filtro muda
    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchNome = (valor: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleFilter("name", valor);
    }, 500);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          defaultValue={searchParams.get("name") ?? ""}
          onChange={(e) => handleSearchNome(e.target.value)}
          className="w-full h-10 pl-9 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => handleFilter("status", e.target.value)}
        className="h-10 px-3 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Todos os Status</option>
        <option value="Ativo">Ativo</option>
        <option value="Inativo">Inativo</option>
      </select>

      <select
        defaultValue={searchParams.get("plano") ?? ""}
        onChange={(e) => handleFilter("plano", e.target.value)}
        className="h-10 px-3 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Todos os Planos</option>
        <option value="Mensal">Mensal</option>
        <option value="Trimestral">Trimestral</option>
        <option value="Semestral">Semestral</option>
        <option value="Anual">Anual</option>
      </select>
    </div>
  );
}