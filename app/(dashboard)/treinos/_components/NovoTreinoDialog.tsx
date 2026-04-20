"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { criarTreinoAction } from "../actions";

interface NovoTreinoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NOME_MAX = 60;
const DESCRICAO_MAX = 120;

export function NovoTreinoDialog({ open, onOpenChange }: NovoTreinoDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "" });

  const handleFechar = (open: boolean) => {
    if (!open) setForm({ nome: "", descricao: "" });
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    if (form.nome.trim().length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres.");
      return;
    }

    setIsPending(true);
    const result = await criarTreinoAction({
      nome: form.nome,
      descricao: form.descricao || undefined,
    });
    setIsPending(false);

    if (result.sucesso && result.id) {
      toast.success("Treino criado com sucesso!");
      handleFechar(false);
      router.push(`/treinos?treinoId=${result.id}`);
    } else {
      toast.error(result.mensagem || "Erro ao criar treino.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleFechar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Treino</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Nome do Treino</Label>
              <span className={`text-xs ${form.nome.length >= NOME_MAX ? "text-destructive" : "text-muted-foreground"}`}>
                {form.nome.length}/{NOME_MAX}
              </span>
            </div>
            <Input
              placeholder="Ex: Treino A - Peito / Tríceps"
              value={form.nome}
              maxLength={NOME_MAX}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>
                Descrição{" "}
                <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <span className={`text-xs ${form.descricao.length >= DESCRICAO_MAX ? "text-destructive" : "text-muted-foreground"}`}>
                {form.descricao.length}/{DESCRICAO_MAX}
              </span>
            </div>
            <Textarea
              placeholder="Ex: Foco em hipertrofia"
              value={form.descricao}
              maxLength={DESCRICAO_MAX}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleFechar(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || form.nome.trim().length < 2}
          >
            {isPending ? "Criando..." : "Criar Treino"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}