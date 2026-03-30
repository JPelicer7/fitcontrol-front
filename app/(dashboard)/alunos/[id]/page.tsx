import { ArrowLeft, Plus, Ruler, Weight, Activity, Calendar } from "lucide-react";
import Link from "next/link";

import { getUser } from "@/app/_lib/api/fetch-generated";
import BotaoNovaMedicao from "../_components/BotaoNovaMedicao";

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
  const currentMedida = medidas.todas[0]; // A medida mais recente (se existir)
  const comparacao = medidas.comparacao; 

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Sem medições";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Helper para formatar os valores numéricos vindos do backend
  const formatNum = (num?: number | null, suffix = "") => {
    if (num === undefined || num === null) return "-";
    return `${num.toFixed(2)} ${suffix}`;
  };

  
  const renderDiff = (diff?: number) => {
    if (diff === undefined || diff === null) return "-";
    if (diff === 0) return "=";
    const isPositive = diff > 0;
    return (
      <span className={`text-sm font-medium ${isPositive ? "text-destructive" : "text-primary"}`}>
        {isPositive ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
      </span>
    );
  };

  
  const quickMetrics = [
    { 
      label: "Peso", 
      value: formatNum(currentMedida?.peso, "kg"), 
      change: comparacao?.peso ? renderDiff(comparacao.peso.diferenca) : "-", 
      icon: Weight 
    },
    { 
      label: "Altura", 
      value: formatNum(currentMedida?.alturaCentimetros ? currentMedida.alturaCentimetros / 100 : null, "m"), 
      change: "-", 
      icon: Ruler 
    },
    { 
      label: "% Gordura", 
      value: formatNum(currentMedida?.percentual_gordura, "%"), 
      change: comparacao?.percentual_gordura ? renderDiff(comparacao.percentual_gordura.diferenca) : "-", 
      icon: Activity 
    },
    { 
      label: "IMC", 
      value: formatNum(currentMedida?.imc), 
      change: comparacao?.imc ? renderDiff(comparacao.imc.diferenca) : "-", 
      icon: Activity 
    },
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
    { label: "Panturrilha Dir", key: "panturrilha_dir" },
    { label: "Panturrilha Esq", key: "panturrilha_esq" },
    {label: "Dobra Tríceps", key: "dobra_triceps"},
    {label: "Dobra Supraescapular", key: "dobra_supraescapular"},
    {label: "Dobra Suprailica", key: "dobra_suprailica"},
    {label: "Dobra Abdominal", key: "dobra_adbdominal"},
    {label: "Dobra Coxa", key: "dobra_coxa"},
    {label: "Dobra Peitoral", key: "dobra_peitoral"},
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/alunos" className="p-2 rounded-lg hover:bg-muted transition-colors w-fit">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground mt-1 capitalize">
            {}
            {currentMedida?.idade ? `${currentMedida.idade} anos • ` : ""}
            Plano {user.plano}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            user.status.toUpperCase() === "ATIVO" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
          }`}>
            {user.status}
          </span>
          
          {/* <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Nova Medição
          </button> */}
          <BotaoNovaMedicao usuarioId={id} />
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickMetrics.map((m, i) => (
          <div key={i} className="metric-card bg-card border border-border p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            {comparacao && (
              <p className="text-xs mt-1 font-medium flex items-center gap-1">
                {m.change} {m.change !== "-" && m.change !== "=" && "vs último"}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Body Measurements Table */}
      <div className="metric-card glow-border overflow-hidden p-0 bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Evolução das Medidas</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Última avaliação: {formatDate(currentMedida?.createdAt)}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Região</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Atual</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Anterior</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diferença</th>
              </tr>
            </thead>
            <tbody>
              {!currentMedida ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                    Nenhuma avaliação física registrada para este aluno ainda.
                  </td>
                </tr>
              ) : (
                bodyMeasurements.map((m, i) => {
                  const valorAtual = currentMedida[m.key as keyof typeof currentMedida];
                  const dadosComparacao = comparacao?.[m.key as keyof typeof comparacao];
                  
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-5 text-sm font-medium text-foreground">{m.label}</td>
                      <td className="py-3 px-5 text-sm text-foreground">{formatNum(valorAtual as number, "cm")}</td>
                      <td className="py-3 px-5 text-sm text-muted-foreground">
                        {dadosComparacao ? formatNum(dadosComparacao.anterior, "cm") : "-"}
                      </td>
                      <td className="py-3 px-5">
                        {dadosComparacao ? renderDiff(dadosComparacao.diferenca) : "-"}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}