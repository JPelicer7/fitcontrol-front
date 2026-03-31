"use client";

import { useState} from "react";
import { Pencil, Check, X, Weight, Ruler, Activity, Calendar } from "lucide-react";
import { toast } from "sonner";
import { updateMedidaAction } from "../actions"; 

interface Props {
  initialUser: any;
  initialMedidas: any;
  medidaId: string;
  userId: string; 
}

export default function StudentProfileClient({ initialMedidas, medidaId, userId }: Props) {
  const [currentMedida, setCurrentMedida] = useState(initialMedidas.todas[0]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const comparacao = initialMedidas.comparacao;

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^0-9.,]/g, ""); // Remove letras
    const dots = val.match(/[.,]/g);
    if (dots && dots.length > 1) return; // Impede múltiplos pontos/vírgulas
    setDraftValue(val);
  };

  const formatNum = (num?: number | null, suffix = "") => {
    if (num === undefined || num === null) return "-";
    return `${Number(num).toFixed(2)} ${suffix}`;
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

  const startEdit = (field: string, value: any) => {
    setEditingField(field);
    setDraftValue(value?.toString().replace(".", ",") || "");
  };

  const handleSave = async (field: string) => {
    if (isUpdating) return;

    const numericValue = parseFloat(draftValue.replace(",", "."));

    if (isNaN(numericValue)) {
      toast.error("Por favor, insira um número válido.");
      return;
    }

    
    if (numericValue > 999.99) {
      toast.error("Valor excede o limite permitido.");
      return;
    }

    setIsUpdating(true);
    
    
    const result = await updateMedidaAction(userId, medidaId, {
      [field]: Number(numericValue.toFixed(2))
    });

    if (result.sucesso) {
      setCurrentMedida((prev: any) => ({ ...prev, [field]: numericValue }));
      toast.success("Medida atualizada com sucesso!");
      setEditingField(null);
    } else {
      toast.error(result.mensagem || "Erro ao atualizar.");
    }
    
    setIsUpdating(false);
  };

  const quickMetrics = [
    { label: "Peso", key: "peso", value: currentMedida?.peso, suffix: "kg", icon: Weight },
    { label: "Altura", key: "alturaCentimetros", value: currentMedida?.alturaCentimetros ? currentMedida.alturaCentimetros / 100 : null, suffix: "m", icon: Ruler },
    { label: "% Gordura", key: "percentual_gordura", value: currentMedida?.percentual_gordura, suffix: "%", icon: Activity },
    { label: "IMC", key: "imc", value: currentMedida?.imc, suffix: "", icon: Activity },
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
    { label: "Dobra Tríceps", key: "dobra_triceps" },
    { label: "Dobra Supraescapular", key: "dobra_supraescapular" },
    { label: "Dobra Suprailica", key: "dobra_suprailica" },
    { label: "Dobra Abdominal", key: "dobra_adbdominal" },
    { label: "Dobra Coxa", key: "dobra_coxa" },
    { label: "Dobra Peitoral", key: "dobra_peitoral" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickMetrics.map((m) => (
          <div key={m.key} className="metric-card bg-card border border-border p-4 rounded-xl group relative">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </div>
            
            {editingField === m.key ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  inputMode="decimal"
                  className="w-full bg-background border border-primary/50 rounded px-2 py-1 text-lg font-bold outline-none"
                  value={draftValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave(m.key)}
                  onBlur={() => !isUpdating && setEditingField(null)}
                />
                <button onClick={() => handleSave(m.key)} className="text-primary hover:scale-110 transition-transform">
                  <Check className="w-4 h-4"/>
                </button>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-foreground">{formatNum(m.value, m.suffix)}</p>
                <button 
                  onClick={() => startEdit(m.key, m.value)}
                  className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            
            {comparacao?.[m.key as keyof typeof comparacao] && (
              <p className="text-xs mt-1 font-medium flex items-center gap-1">
                {renderDiff((comparacao as any)[m.key]?.diferenca)} vs último
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="metric-card glow-border overflow-hidden p-0 bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Evolução das Medidas</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
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
                const valorAtual = (currentMedida as any)[m.key];
                const dadosComparacao = (comparacao as any)?.[m.key];
                const isEditing = editingField === m.key;

                return (
                  <tr key={m.key} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-5 text-sm font-medium text-foreground">{m.label}</td>
                    <td className="py-3 px-5 text-sm text-foreground">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            inputMode="decimal"
                            className="w-20 bg-background border border-primary/50 rounded px-1.5 py-0.5 outline-none"
                            value={draftValue}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave(m.key)}
                          />
                          <button onClick={() => handleSave(m.key)} className="text-primary"><Check className="w-4 h-4"/></button>
                          <button onClick={() => setEditingField(null)} className="text-muted-foreground"><X className="w-4 h-4"/></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between min-w-[100px]">
                          <span>{formatNum(valorAtual, "cm")}</span>
                          <button 
                            onClick={() => startEdit(m.key, valorAtual)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
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
    </div>
  );
}