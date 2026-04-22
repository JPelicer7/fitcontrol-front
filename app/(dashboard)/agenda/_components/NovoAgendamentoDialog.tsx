"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  type GetUsers201UsersItem,
  type GetAgendamentosDia201AgendamentosItem,
} from "@/app/_lib/api/fetch-generated";
import { criarAgendamentoAction } from "../actions";

type AgendamentoItem = Omit<GetAgendamentosDia201AgendamentosItem, "aluno"> & {
  aluno: { userId: string; nome: string } | null;
};

const TITULO_MAX = 30;
const OBSERVACAO_MAX = 50;

const categoriaOpcoes = [
  { value: "Personal", label: "Personal" },
  { value: "Avaliacao", label: "Avaliação" },
  { value: "Reuniao", label: "Reunião" },
  { value: "Outro", label: "Outro" },
];

const duracaoOpcoes = ["30", "45", "50", "60", "90", "120"];

interface NovoAgendamentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataSelecionada: string;
  agendamentosExistentes: AgendamentoItem[];
  alunos: GetUsers201UsersItem[];
}

interface FormState {
  titulo: string;
  data: string;
  hora: string;
  duracao: string;
  categoria: string;
  observacao: string;
  userId: string;
}

function extrairHoraBrasilia(dataIso: string): string {
  const d = new Date(dataIso);
  const horas = d.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
    hour12: false,
  });
  return horas;
}

export function NovoAgendamentoDialog({
  open,
  onOpenChange,
  dataSelecionada,
  agendamentosExistentes,
  alunos,
}: NovoAgendamentoDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState<FormState>({
    titulo: "",
    data: dataSelecionada,
    hora: "08:00",
    duracao: "60",
    categoria: "Personal",
    observacao: "",
    userId: "",
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, data: dataSelecionada }));
    }
  }, [open, dataSelecionada]);
  
  const horasExistentes = useMemo(
    () => agendamentosExistentes.map((a) => extrairHoraBrasilia(a.data)),
    [agendamentosExistentes]
  );

  
  const conflito = useMemo(() => {
    if (form.data !== dataSelecionada) return null;
    const match = horasExistentes.indexOf(form.hora);
    if (match === -1) return null;
    return agendamentosExistentes[match];
  }, [form.data, form.hora, dataSelecionada, horasExistentes, agendamentosExistentes]);

  const handleFechar = (open: boolean) => {
    if (!open) {
      setForm({
        titulo: "",
        data: dataSelecionada,
        hora: "08:00",
        duracao: "60",
        categoria: "Personal",
        observacao: "",
        userId: "",
      });
    }
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    if (!form.titulo.trim()) {
      toast.error("Informe o título do compromisso.");
      return;
    }

    
    const dataComOffset = `${form.data}T${form.hora}:00-03:00`;

    setIsPending(true);
    const result = await criarAgendamentoAction({
      titulo: form.titulo.trim(),
      data: dataComOffset,
      duracao: form.duracao ? Number(form.duracao) : undefined,
      categoria: form.categoria as any,
      observacao: form.observacao.trim() || undefined,
      userId: form.userId || undefined,
    });
    setIsPending(false);

    if (result.sucesso) {
      toast.success("Compromisso criado!");
      handleFechar(false);
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao criar compromisso.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleFechar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Compromisso</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Título */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Título *</Label>
              <span
                className={`text-xs ${form.titulo.length >= TITULO_MAX ? "text-destructive" : "text-muted-foreground"}`}
              >
                {form.titulo.length}/{TITULO_MAX}
              </span>
            </div>
            <Input
              placeholder="Ex: Treino de força"
              value={form.titulo}
              maxLength={TITULO_MAX}
              autoFocus
              onChange={(e) =>
                setForm((f) => ({ ...f, titulo: e.target.value }))
              }
            />
          </div>

          {/* Categoria */}
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select
              value={form.categoria}
              onValueChange={(v) => setForm((f) => ({ ...f, categoria: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoriaOpcoes.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data + Hora + Duração */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Data *</Label>
              <Input
                type="date"
                value={form.data}
                onChange={(e) =>
                  setForm((f) => ({ ...f, data: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Horário *</Label>
              <Input
                type="time"
                value={form.hora}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hora: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Duração</Label>
              <Select
                value={form.duracao}
                onValueChange={(v) => setForm((f) => ({ ...f, duracao: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {duracaoOpcoes.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Aviso de conflito */}
          {conflito && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-400">
                Você já tem{" "}
                <span className="font-semibold">"{conflito.titulo}"</span> às{" "}
                {form.hora}. Pode continuar, mas haverá sobreposição.
              </p>
            </div>
          )}

          {/* Aluno (opcional) */}
          {alunos.length > 0 && (
            <div className="space-y-1.5">
              <Label>
                Aluno{" "}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <Select
                value={form.userId}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, userId: v === "none" ? "" : v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar aluno..." />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-48">
                    <SelectItem value="none">Nenhum</SelectItem>
                    {alunos.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Observação */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>
                Observações{" "}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <span
                className={`text-xs ${form.observacao.length >= OBSERVACAO_MAX ? "text-destructive" : "text-muted-foreground"}`}
              >
                {form.observacao.length}/{OBSERVACAO_MAX}
              </span>
            </div>
            <Textarea
              placeholder="Notas adicionais..."
              value={form.observacao}
              maxLength={OBSERVACAO_MAX}
              rows={2}
              onChange={(e) =>
                setForm((f) => ({ ...f, observacao: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleFechar(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !form.titulo.trim()}
          >
            {isPending ? "Criando..." : "Criar Compromisso"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}