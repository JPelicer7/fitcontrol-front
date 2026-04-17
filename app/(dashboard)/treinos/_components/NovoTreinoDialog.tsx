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

export function NovoTreinoDialog({ open, onOpenChange }: NovoTreinoDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "" });

  const handleFechar = (open: boolean) => {
    if (!open) setForm({ nome: "", descricao: "" });
    onOpenChange(open);
  };

  const handleSubmit = async () => {
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
            <Label>Nome do Treino</Label>
            <Input
              placeholder="Ex: Treino A - Peito / Tríceps"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Descrição{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea
              placeholder="Ex: Foco em hipertrofia de empurrar"
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleFechar(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !form.nome.trim()}>
            {isPending ? "Criando..." : "Criar Treino"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}