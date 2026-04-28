"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { type GetHistoricoMedidas201HistoricoItem } from "@/app/_lib/api/fetch-generated";

interface HistoricoMedidasProps {
  historico: GetHistoricoMedidas201HistoricoItem[];
}

const camposExibidos: {
  label: string;
  key: keyof GetHistoricoMedidas201HistoricoItem;
  sufixo: string;
}[] = [
  { label: "Peso", key: "peso", sufixo: "kg" },
  { label: "% Gordura", key: "percentual_gordura", sufixo: "%" },
  { label: "Massa Gorda", key: "massaGorda", sufixo: "kg" },
  { label: "Massa Magra", key: "massaMagra", sufixo: "kg" },
  { label: "Tórax", key: "torax", sufixo: "cm" },
  { label: "Cintura", key: "cintura", sufixo: "cm" },
  { label: "Quadril", key: "quadril", sufixo: "cm" },
  { label: "Braço Dir. (Contraído)", key: "braco_contrai_direi", sufixo: "cm" },
  { label: "Braço Esq. (Contraído)", key: "braco_contrai_esq", sufixo: "cm" },
  { label: "Coxa Dir.", key: "coxa_dir", sufixo: "cm" },
  { label: "Coxa Esq.", key: "coxa_esq", sufixo: "cm" },
  { label: "Panturrilha Dir.", key: "panturrilha_dir", sufixo: "cm" },
  { label: "Panturrilha Esq.", key: "panturrilha_esq", sufixo: "cm" },
];

function formatValor(valor: number | null | undefined, sufixo: string): string {
  if (valor === null || valor === undefined) return "—";
  return `${Number(valor).toFixed(1)} ${sufixo}`;
}

function CardHistorico({
  item,
  isLast,
}: {
  item: GetHistoricoMedidas201HistoricoItem;
  isLast: boolean;
}) {
  const [expandido, setExpandido] = useState(false);

  const camposPrincipais = camposExibidos.slice(0, 4);
  const camposDetalhados = camposExibidos.slice(4);

  return (
    <div className="relative flex gap-4">
      
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10 mt-2 shrink-0" />
        {!isLast && <div className="w-px flex-1 bg-border min-h-[24px]" />}
      </div>

      {/* Card */}
      <div className="flex-1 pb-5">
        <div className="metric-card border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground capitalize">
              {format(new Date(item.createdAt), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>

          {/* Campos principais */}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {camposPrincipais.map((campo) => (
              <div key={campo.key} className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  {campo.label}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatValor(item[campo.key] as number | null, campo.sufixo)}
                </p>
              </div>
            ))}
          </div>

          {/* Campos detalhados */}
          {expandido && (
            <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-border pt-3">
              {camposDetalhados.map((campo) => (
                <div key={campo.key} className="space-y-0.5">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    {campo.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatValor(item[campo.key] as number | null, campo.sufixo)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Botão expandir */}
          <button
            onClick={() => setExpandido((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors border-t border-border"
          >
            {expandido ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Ocultar medidas
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Ver medidas completas
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function HistoricoMedidas({ historico }: HistoricoMedidasProps) {
  if (historico.length === 0) {
    return (
      <div className="metric-card p-10 text-center border border-dashed rounded-xl">
        <Calendar className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">
          Nenhuma avaliação registrada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">
          Histórico de Avaliações
        </h3>
        <span className="text-xs text-muted-foreground">
          {historico.length} {historico.length === 1 ? "avaliação" : "avaliações"}
        </span>
      </div>

      <div className="pl-1">
        {historico.map((item, index) => (
          <CardHistorico
            key={item.id}
            item={item}
            isLast={index === historico.length - 1}
          />
        ))}
      </div>
    </div>
  );
}