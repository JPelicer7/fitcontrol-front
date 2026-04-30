"use client";

import { useState } from "react";
import {
  Weight,
  Activity,
  Flame,
  History,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  Ruler,
} from "lucide-react";
import { EvolutionCharts } from "@/app/(dashboard)/alunos/[id]/_components/EvolutionCharts";
import { type GetHistoricoMedidas201HistoricoItem } from "@/app/_lib/api/fetch-generated";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GraficoItem {
  createdAt: string;
  peso: number;
  percentual_gordura: number;
}

interface MedidasData {
  todas: any[];
  comparacao: any | null;
}

interface MinhasMedidasClientProps {
  medidas: MedidasData | null;
  grafico: GraficoItem[];
  historico: GetHistoricoMedidas201HistoricoItem[];
  nomeAluno: string;
}

function formatNum(num?: number | null, suffix = "") {
  if (num === undefined || num === null) return "—";
  return `${Number(num).toFixed(1)}${suffix ? ` ${suffix}` : ""}`;
}

function renderDiff(diff?: number) {
  if (diff === undefined || diff === null) return "-";
  if (diff === 0) return "=";
  return (
    <span className="text-sm font-medium text-foreground/70">
      {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
    </span>
  );
}

const quickMetrics = [
  { label: "Peso", key: "peso", suffix: "kg", icon: Weight, accent: true, decimais: 2 },
  { label: "Altura", key: "alturaCentimetros", suffix: "m", icon: Ruler, divide: 100, decimais: 2 },
  { label: "% Gordura", key: "percentual_gordura", suffix: "%", icon: Flame },
  { label: "IMC", key: "imc", suffix: "", icon: Activity },
];

const bodyMeasurements = [
  { label: "Ombro", key: "ombro" },
  { label: "Tórax", key: "torax" },
  { label: "Cintura", key: "cintura" },
  { label: "Abdômen", key: "abdomen" },
  { label: "Quadril", key: "quadril" },
  { label: "Braço Dir. (Relaxado)", key: "braco_relax_direi" },
  { label: "Braço Esq. (Relaxado)", key: "braco_relax_esq" },
  { label: "Braço Dir. (Contraído)", key: "braco_contrai_direi" },
  { label: "Braço Esq. (Contraído)", key: "braco_contrai_esq" },
  { label: "Antebraço Dir.", key: "antebraco_dir" },
  { label: "Antebraço Esq.", key: "antebraco_esq" },
  { label: "Coxa Dir.", key: "coxa_dir" },
  { label: "Coxa Esq.", key: "coxa_esq" },
  { label: "Panturrilha Dir.", key: "panturrilha_dir" },
  { label: "Panturrilha Esq.", key: "panturrilha_esq" },
  { label: "Dobra Tríceps", key: "dobra_triceps" },
  { label: "Dobra Supraescapular", key: "dobra_supraescapular" },
  { label: "Dobra Suprailíaca", key: "dobra_suprailica" },
  { label: "Dobra Abdominal", key: "dobra_adbdominal" },
  { label: "Dobra Coxa", key: "dobra_coxa" },
  { label: "Dobra Peitoral", key: "dobra_peitoral" },
];

// Campos do histórico resumido para exibir no expandido
const historicoDetalhes: { label: string; key: keyof GetHistoricoMedidas201HistoricoItem }[] = [
  { label: "Tórax", key: "torax" },
  { label: "Cintura", key: "cintura" },
  { label: "Quadril", key: "quadril" },
  { label: "Braço Dir.", key: "braco_contrai_direi" },
  { label: "Braço Esq.", key: "braco_contrai_esq" },
  { label: "Coxa Dir.", key: "coxa_dir" },
  { label: "Coxa Esq.", key: "coxa_esq" },
  { label: "Panturrilha Dir.", key: "panturrilha_dir" },
  { label: "Panturrilha Esq.", key: "panturrilha_esq" },
  { label: "Massa Magra", key: "massaMagra" },
  { label: "Massa Gorda", key: "massaGorda" },
];

export function MinhasMedidasClient({
  medidas,
  grafico,
  historico,
  nomeAluno,
}: MinhasMedidasClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    historico[0]?.id ?? null
  );

  const currentMedida = medidas?.todas[0] ?? null;
  const comparacao = medidas?.comparacao ?? null;

  const totalPerdaPeso = comparacao?.peso?.diferenca ?? null;
  const totalPerdaGordura = comparacao?.percentual_gordura?.diferenca ?? null;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border">
        <img
          src="/measurements-hero.jpg"
          alt="Evolução corporal"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />

        <div className="relative px-6 py-8 md:px-10 md:py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 mb-4">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Sua Evolução
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none">
            MINHAS <span className="text-primary">MEDIDAS</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-md">
            Cada número conta uma história. A sua é de superação.
          </p>

          <div className="grid grid-cols-2 sm:flex gap-3 mt-6 max-w-xl">
            {totalPerdaPeso !== null && (
              <div className="flex-1 backdrop-blur-md bg-card/70 border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 text-primary mb-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Variação Peso</span>
                </div>
                <p className="text-lg font-black text-foreground">
                  {totalPerdaPeso > 0 ? "+" : ""}{Number(totalPerdaPeso).toFixed(1)} kg
                </p>
                <p className="text-[10px] text-muted-foreground">vs anterior</p>
              </div>
            )}
            {totalPerdaGordura !== null && (
              <div className="flex-1 backdrop-blur-md bg-card/70 border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 text-primary mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Variação Gordura</span>
                </div>
                <p className="text-lg font-black text-foreground">
                  {totalPerdaGordura > 0 ? "+" : ""}{Number(totalPerdaGordura).toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted-foreground">vs anterior</p>
              </div>
            )}
            <div className="flex-1 backdrop-blur-md bg-card/70 border border-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-primary mb-1">
                <Target className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Registros</span>
              </div>
              <p className="text-lg font-black text-foreground">{historico.length}</p>
              <p className="text-[10px] text-muted-foreground">medições</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards métricas */}
      {currentMedida && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickMetrics.map((m) => {
            const Icon = m.icon;
            const rawVal = currentMedida[m.key];
            const value = m.divide ? rawVal / m.divide : rawVal;
            return (
              <div
                key={m.key}
                className={`metric-card border p-4 rounded-xl relative ${
                  m.accent
                    ? "bg-gradient-to-br from-primary/15 via-card to-card border-primary/40"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    m.accent ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {comparacao?.[m.key]?.diferenca !== undefined && comparacao[m.key].diferenca !== 0 && (
                    <span className="text-[10px] font-bold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {comparacao[m.key].diferenca > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {comparacao[m.key].diferenca > 0 ? "+" : ""}
                      {Number(comparacao[m.key].diferenca).toFixed(1)}{m.suffix}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {m.label}
                </p>
                <div className="flex items-baseline gap-1">
                  {/* <span className="text-2xl font-black text-foreground tabular-nums">
                    {formatNum(value)}
                  </span> */}
                  <span className="text-2xl font-black text-foreground tabular-nums">
                      {value !== null && value !== undefined
                        ? `${Number(value).toFixed(m.decimais ?? 1)}`
                        : "—"}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{m.suffix}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Gráficos */}
      {grafico.length > 1 && <EvolutionCharts data={grafico} />}

      {/* Tabela completa atual vs anterior */}
      {currentMedida && (
        <div className="metric-card glow-border overflow-hidden p-0 bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Evolução das Medidas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-left">
                  <th className="py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Região</th>
                  <th className="py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Atual</th>
                  <th className="py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Anterior</th>
                  <th className="py-3 px-5 text-xs font-semibold text-muted-foreground uppercase">Diferença</th>
                </tr>
              </thead>
              <tbody>
                {bodyMeasurements.map((m) => {
                  const valorAtual = currentMedida[m.key];
                  const dadosComparacao = comparacao?.[m.key];
                  return (
                    <tr key={m.key} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-5 text-sm font-medium text-foreground">{m.label}</td>
                      <td className="py-3 px-5 text-sm text-foreground">{formatNum(valorAtual, "cm")}</td>
                      <td className="py-3 px-5 text-sm text-muted-foreground">
                        {dadosComparacao ? formatNum(dadosComparacao.anterior, "cm") : "-"}
                      </td>
                      <td className="py-3 px-5">
                        {dadosComparacao ? renderDiff(dadosComparacao.diferenca) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Histórico de medições */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <History className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">Histórico de Medições</h3>
            <p className="text-xs text-muted-foreground">
              {historico.length} {historico.length === 1 ? "registro" : "registros"} · toque para ver detalhes
            </p>
          </div>
        </div>

        {historico.length === 0 ? (
          <div className="py-12 text-center">
            <History className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma medição registrada ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {historico.map((entry, idx) => {
              const anterior = historico[idx + 1];
              const isExpanded = expandedId === entry.id;
              const isLatest = idx === 0;

              const difPeso = anterior
                ? Number((entry.peso - anterior.peso).toFixed(1))
                : null;
              const difGordura =
                entry.percentual_gordura != null && anterior?.percentual_gordura != null
                  ? Number((entry.percentual_gordura - anterior.percentual_gordura).toFixed(1))
                  : null;

              return (
                <div key={entry.id}>
                  <button
                    onClick={() => setExpandedId((prev) => (prev === entry.id ? null : entry.id))}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                  >
                    {/* Badge data */}
                    <div className={`flex flex-col items-center justify-center w-12 h-14 rounded-lg border shrink-0 ${
                      isLatest
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 border-border text-foreground"
                    }`}>
                      <span className={`text-[9px] font-bold tracking-wider uppercase ${
                        isLatest ? "opacity-90" : "text-muted-foreground"
                      }`}>
                        {format(new Date(entry.createdAt), "MMM", { locale: ptBR })}
                      </span>
                      <span className="text-sm font-black leading-tight">
                        {format(new Date(entry.createdAt), "yy")}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-foreground">
                          {format(new Date(entry.createdAt), "dd/MM/yyyy")}
                        </p>
                        {isLatest && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                            Atual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Weight className="w-3 h-3" />
                          <span className="font-semibold text-foreground">{formatNum(entry.peso, "kg")}</span>
                        </span>
                        {entry.percentual_gordura != null && (
                          <span className="inline-flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            <span className="font-semibold text-foreground">{formatNum(entry.percentual_gordura, "%")}</span>
                          </span>
                        )}
                        {entry.massaMagra != null && (
                          <span className="hidden sm:inline-flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            <span className="font-semibold text-foreground">{formatNum(entry.massaMagra, "kg")} magra</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Diffs */}
                    <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                      {difPeso !== null && (
                        <span className="text-[11px] font-bold inline-flex items-center gap-0.5 text-foreground/70">
                          {difPeso < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          {difPeso > 0 ? "+" : ""}{difPeso} kg
                        </span>
                      )}
                      {difGordura !== null && (
                        <span className="text-[11px] font-bold inline-flex items-center gap-0.5 text-foreground/70">
                          {difGordura < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          {difGordura > 0 ? "+" : ""}{difGordura}%
                        </span>
                      )}
                    </div>

                    <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`} />
                  </button>

                  
                  {isExpanded && (
                    <div className="px-5 pb-5 bg-muted/10">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                        Medidas Corporais (cm)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {historicoDetalhes
                          .filter((m) => entry[m.key] !== null && entry[m.key] !== undefined)
                          .map((m) => (
                            <div key={m.key} className="rounded-lg bg-background border border-border px-3 py-2.5">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                              <p className="text-sm font-bold text-foreground tabular-nums mt-0.5">
                                {formatNum(entry[m.key] as number | null)}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}