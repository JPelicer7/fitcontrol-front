"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { executeCreateTransactionAction } from "../actions";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  "Mensalidade", "Aluguel", "Equipamentos", "Energia", 
  "Agua", "Manutencao", "Outros"
];

export function NewTransactionDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newTx, setNewTx] = useState({
    type: "income" as "income" | "expense",
    desc: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
    category: ""
  });

  const handleSubmit = async () => {
    
    if (!newTx.desc || !newTx.value || !newTx.category) {
      return toast.error("Preencha todos os campos obrigatórios.");
    }

    if (newTx.desc.length > 50) {
      return toast.error("A descrição deve ter no máximo 50 caracteres.");
    }

    if(newTx.value.length > 9) {
      return toast.error("Digite um valor válido.");
    }

    try {
      setIsLoading(true);
      const res = await executeCreateTransactionAction(newTx);

      if (res.status === 201) {
        toast.success("Transação registrada!");
        setNewTx({
          type: "income",
          desc: "",
          value: "",
          date: new Date().toISOString().split("T")[0],
          category: ""
        });
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Erro ao salvar transação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>Adicione uma nova receita ou despesa.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <button
              onClick={() => setNewTx({ ...newTx, type: "income" })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center transition-all ${
                newTx.type === "income" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
              }`}
            >
              <ArrowUpRight className="w-4 h-4 mr-1" /> Receita
            </button>
            <button
              onClick={() => setNewTx({ ...newTx, type: "expense" })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center transition-all ${
                newTx.type === "expense" ? "bg-destructive text-destructive-foreground shadow-md" : "bg-muted text-muted-foreground"
              }`}
            >
              <ArrowDownRight className="w-4 h-4 mr-1" /> Despesa
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Descrição</Label>
            <Input
              id="desc"
              maxLength={50}
              placeholder="Ex: Mensalidade - João Silva"
              value={newTx.desc}
              onChange={(e) => setNewTx({ ...newTx, desc: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="val">Valor (R$)</Label>
              <Input
                id="val"
                type="number"
                placeholder="0,00"
                step="0.01"
                min="0"
                value={newTx.value}
                onChange={(e) => setNewTx({ ...newTx, value: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newTx.date}
                onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select value={newTx.category} onValueChange={(v) => setNewTx({ ...newTx, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}