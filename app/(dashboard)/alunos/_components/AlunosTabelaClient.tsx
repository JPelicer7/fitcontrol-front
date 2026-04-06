"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateAlunoAction } from "../actions";
import { UpdateUserBodyPlano, UpdateUserBodyStatus } from "@/app/_lib/api/fetch-generated";

interface AlunosTabelaProps {
  alunos: any[];
}

export function AlunosTabelaClient({ alunos }: AlunosTabelaProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    telefone: "", 
    plano: "" as UpdateUserBodyPlano, 
    Status: "" as UpdateUserBodyStatus 
  });

  
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "") 
      .replace(/(\={0,11})/, "") 
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15); 
  };

  const openEdit = (student: any) => {
    setEditTarget(student);
    setEditForm({ 
      name: student.name, 
      telefone: student.telefone || "", 
      plano: student.plano, 
      Status: student.Status 
    });
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;

    // Validação simples antes de enviar
    if (editForm.name.length < 3) {
      toast.error("O nome deve ter entre 3 e 60 caracteres.");
      return;
    }

    setIsPending(true);

    const result = await updateAlunoAction(editTarget.id, {
      name: editForm.name,
      telefone: editForm.telefone,
      plano: editForm.plano,
      Status: editForm.Status
    });

    if (result.sucesso) {
      toast.success("Aluno atualizado com sucesso!");
      setEditTarget(null);
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao salvar.");
    }
    setIsPending(false);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aluno</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plano</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((student) => (
              <tr key={student.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3.5 px-5">
                  
                  <Link href={`/alunos/${student.id}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {student.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.telefone ?? "Sem telefone"}</p>
                    </div>
                  </Link>
                </td>
                <td className="py-3.5 px-5 text-sm">{student.plano}</td>
                <td className="py-3.5 px-5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    student.Status === "Ativo" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                  }`}>
                    {student.Status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/alunos/${student.id}`)}>
                        <Eye className="w-4 h-4 mr-2" /> Ver perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(student)}>
                        <Pencil className="w-4 h-4 mr-2" /> Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Aluno</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={editForm.telefone} onChange={(e) => setEditForm(f => ({ ...f, telefone: maskPhone(e.target.value )}))} />
            </div>
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={editForm.plano} onValueChange={(v) => setEditForm(f => ({ ...f, plano: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                  <SelectItem value="Trimestral">Trimestral</SelectItem>
                  <SelectItem value="Semestral">Semestral</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.Status} onValueChange={(v) => setEditForm(f => ({ ...f, Status: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={isPending}>{isPending ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}