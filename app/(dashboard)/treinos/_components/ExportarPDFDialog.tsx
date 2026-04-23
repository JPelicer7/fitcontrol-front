"use client";

import { useState } from "react";
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
import { FileDown, User } from "lucide-react";
import { type GetAlunosTreino201AlunosItem } from "@/app/_lib/api/fetch-generated";

interface ExportarPDFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alunosTreino: GetAlunosTreino201AlunosItem[];
  onConfirmar: (nomeAluno: string) => void;
}

export function ExportarPDFDialog({
  open,
  onOpenChange,
  alunosTreino,
  onConfirmar,
}: ExportarPDFDialogProps) {
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");
  const [nomeManual, setNomeManual] = useState("");

  const handleFechar = (open: boolean) => {
    if (!open) {
      setAlunoSelecionado("");
      setNomeManual("");
    }
    onOpenChange(open);
  };

  const handleConfirmar = () => {
    const nome =
      alunoSelecionado === "manual"
        ? nomeManual.trim()
        : alunoSelecionado === "nenhum"
        ? ""
        : alunoSelecionado;
    onConfirmar(nome);
    handleFechar(false);
  };

  const podeConfirmar =
    alunoSelecionado === "nenhum" ||
    (alunoSelecionado === "manual" && nomeManual.trim().length > 0) ||
    (alunoSelecionado !== "" &&
      alunoSelecionado !== "manual" &&
      alunoSelecionado !== "nenhum");

  return (
    <Dialog open={open} onOpenChange={handleFechar}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Exportar PDF</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Selecione para qual aluno esta ficha será gerada.
        </p>

        <div className="space-y-2 mt-1">
          {/* Alunos vinculados */}
          {alunosTreino.length > 0 && (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Alunos vinculados
              </p>
              {alunosTreino.map((aluno) => (
                <button
                  key={aluno.id}
                  onClick={() => {
                    setAlunoSelecionado(aluno.nome);
                    setNomeManual("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors text-left ${
                    alunoSelecionado === aluno.nome
                      ? "border-primary/50 bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {aluno.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {aluno.nome}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Nome manual */}
          <button
            onClick={() => {
              setAlunoSelecionado("manual");
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors text-left ${
              alunoSelecionado === "manual"
                ? "border-primary/50 bg-primary/10"
                : "border-border hover:bg-muted/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Digitar nome manualmente
            </span>
          </button>

          {alunoSelecionado === "manual" && (
            <div className="space-y-1.5 pt-1">
              <Label>Nome do aluno</Label>
              <Input
                placeholder="Ex: João Silva"
                value={nomeManual}
                autoFocus
                onChange={(e) => setNomeManual(e.target.value)}
                maxLength={60}
              />
            </div>
          )}

          {/* Sem aluno */}
          <button
            onClick={() => {
              setAlunoSelecionado("nenhum");
              setNomeManual("");
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors text-left ${
              alunoSelecionado === "nenhum"
                ? "border-primary/50 bg-primary/10"
                : "border-border hover:bg-muted/50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <span className="text-xs text-muted-foreground font-bold">—</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              Sem aluno específico
            </span>
          </button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleFechar(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!podeConfirmar}
            className="gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5" />
            Gerar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}