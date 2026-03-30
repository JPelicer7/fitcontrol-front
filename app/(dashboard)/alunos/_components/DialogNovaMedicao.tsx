"use client";

import { useState } from "react";
import { ArrowRight, Check, Ruler, Activity, Layers, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { criarMedidaAction } from "../[id]/actions";

const passos = [
  { id: 1, titulo: "Medidas Básicas", icone: Ruler },
  { id: 2, titulo: "Medidas Corporais", icone: Activity },
  { id: 3, titulo: "Dobras Cutâneas", icone: Layers },
];

const formularioInicial = {
  idade: "", peso: "", alturaCentimetros: "", percentual_gordura: "",
  ombro: "", torax: "", cintura: "", abdomen: "", quadril: "",
  braco_relax_direi: "", braco_contrai_direi: "", braco_relax_esq: "", braco_contrai_esq: "",
  antebraco_dir: "", antebraco_esq: "", coxa_dir: "", coxa_esq: "",
  panturrilha_dir: "", panturrilha_esq: "",
  dobra_triceps: "", dobra_supraescapular: "", dobra_suprailica: "",
  dobra_adbdominal: "", dobra_coxa: "", dobra_peitoral: "",
};

interface DialogNovaMedicaoProps {
  aberto: boolean;
  aoMudarAberto: (aberto: boolean) => void;
  usuarioId: string;
}

export default function DialogNovaMedicao({ aberto, aoMudarAberto, usuarioId }: DialogNovaMedicaoProps) {
  const [passoAtual, setPassoAtual] = useState(1);
  const [form, setForm] = useState(formularioInicial);
  const [estaSalvando, setEstaSalvando] = useState(false);
  const router = useRouter();

  const infoPasso = passos.find(p => p.id === passoAtual);


  const atualizarCampo = (campo: string, valor: string) => {
    
    const valorLimpo = valor.replace(/[^0-9.,]/g, "");
  
    const pontosEVirgulas = (valorLimpo.match(/[.,]/g) || []).length;
    if (pontosEVirgulas > 1) return;
    if (valorLimpo.length > 6) return;
  
    setForm((prev) => ({ ...prev, [campo]: valorLimpo }));
  };

  const fecharDialog = (valor: boolean) => {
    if (!valor) {
      setPassoAtual(1);
      setForm(formularioInicial);
    }
    aoMudarAberto(valor);
  };

  const aoEnviar = async () => {
    const payload: any = {};
    let erroValidacao = "";
    Object.entries(form).forEach(([chave, valor]) => {
      if (valor !== "") {
        let num = parseFloat(valor.replace(",", "."));
      
        //Validando formulário
      if (chave === "alturaCentimetros") {
        num = num > 3 ? Math.round(num) : Math.round(num * 100);
        if (num < 50 || num > 250) erroValidacao = "Altura parece inválida (mín 50cm, máx 250cm).";
      }

      // Validação de Peso
      if (chave === "peso" && (num < 10 || num > 400)) {
        erroValidacao = "Peso deve estar entre 10kg e 400kg.";
      }

      // Validação de % Gordura
      if (chave === "percentual_gordura" && (num < 1 || num > 90)) {
        erroValidacao = "Percentual de gordura deve estar entre 1% e 90%.";
      }

      // Validação de Idade
      if (chave === "idade" && (num < 1 || num > 120)) {
        erroValidacao = "Idade deve estar entre 1 e 120 anos.";
      }

        payload[chave] = num;
      }
    });

    if (erroValidacao) {
      toast.error(erroValidacao);
      return;
    }
    if (!payload.idade || !payload.peso || !payload.alturaCentimetros) {
      toast.error("Preencha idade, peso e altura.");
      setPassoAtual(1);
      return;
    }

    setEstaSalvando(true);
    try {
      const resposta = await criarMedidaAction(usuarioId, payload);
      if (resposta.sucesso) {
        toast.success("Medição registrada com sucesso!");
        fecharDialog(false);
        router.refresh();
      } else {
        toast.error(resposta.mensagem);
      }
    } catch (error) {
      toast.error("Erro ao processar medição.");
    } finally {
      setEstaSalvando(false);
    }
  };

  const renderInput = (label: string, campo: string, unidade: string, placeholder?: string) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        <input
          type="text"
          inputMode="decimal"
          value={(form as any)[campo] || ""}
          onChange={(e) => atualizarCampo(campo, e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
          {unidade}
        </span>
      </div>
    </div>
  );

  return (
    <Dialog open={aberto} onOpenChange={fecharDialog}>
      <DialogContent className="max-w-2xl border-border bg-card p-0 overflow-hidden shadow-2xl">
      <DialogDescription className="sr-only">
          Formulário para registrar novas medidas corporais e dobras cutâneas do aluno.
        </DialogDescription>
        {}
        <div className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              {infoPasso && <infoPasso.icone className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                {infoPasso?.titulo}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Passo {passoAtual} de 3 • Preencha os dados da avaliação
              </p>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="flex gap-2 mt-6">
            {passos.map((p) => (
              <div
                key={p.id}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  passoAtual >= p.id ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Conteúdo Central */}
        <div className="p-6 min-h-[350px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {passoAtual === 1 && (
              <>
                {renderInput("Idade", "idade", "ANOS", "Ex: 25")}
                {renderInput("Altura", "alturaCentimetros", "M", "Ex: 1.75")}
                {renderInput("Peso", "peso", "KG", "Ex: 75.2")}
                {renderInput("% Gordura", "percentual_gordura", "%", "Opcional")}
              </>
            )}

            {passoAtual === 2 && (
              <>
                {renderInput("Ombro", "ombro", "CM")}
                {renderInput("Tórax", "torax", "CM")}
                {renderInput("Cintura", "cintura", "CM")}
                {renderInput("Abdômen", "abdomen", "CM")}
                {renderInput("Quadril", "quadril", "CM")}
                {renderInput("Braço R. Dir", "braco_relax_direi", "CM")}
                {renderInput("Braço R. Esq", "braco_relax_esq", "CM")}
                {renderInput("Braço C. Dir", "braco_contrai_direi", "CM")}
                {renderInput("Braço C. Esq", "braco_contrai_esq", "CM")}
                {renderInput("Antebraço Dir", "antebraco_dir", "CM")}
                {renderInput("Antebraço Esq", "antebraco_esq", "CM")}
                {renderInput("Coxa Dir", "coxa_dir", "CM")}
                {renderInput("Coxa Esq", "coxa_esq", "CM")}
                {renderInput("Panturrilha Dir", "panturrilha_dir", "CM")}
                {renderInput("Panturrilha Esq", "panturrilha_esq", "CM")}
              </>
            )}

            {passoAtual === 3 && (
              <>
                {renderInput("Tríceps", "dobra_triceps", "MM")}
                {renderInput("Subescapular", "dobra_supraescapular", "MM")}
                {renderInput("Supra-ilíaca", "dobra_suprailica", "MM")}
                {renderInput("Abdominal", "dobra_adbdominal", "MM")}
                {renderInput("Coxa", "dobra_coxa", "MM")}
                {renderInput("Peitoral", "dobra_peitoral", "MM")}
              </>
            )}
          </div>
        </div>

        {}
        <div className="p-6 border-t border-border flex items-center justify-between bg-muted/10">
          <button
            onClick={() => setPassoAtual(p => p - 1)}
            disabled={passoAtual === 1 || estaSalvando}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          {passoAtual < 3 ? (
            <button
              onClick={() => setPassoAtual(p => p + 1)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={aoEnviar}
              disabled={estaSalvando}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {estaSalvando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Finalizar Avaliação
                </>
              )}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}