"use client";

import { useState } from "react";
import { ArrowLeft, Check, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cadastrarAlunoAction } from "./actions";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  telefone: "",
  plano: "Mensal",
};

type FormKeys = keyof typeof initialForm;

export default function NovoAlunoPage() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const updateField = (field: FormKeys, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.telefone) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (form.telefone.length !== 11) {
      toast.error("Telefone inválido.");
      return;
    }

    try {
      setIsLoading(true);
      const resposta = await cadastrarAlunoAction({
        name: form.name,
        email: form.email,
        password: form.password,
        plano: form.plano,
        role: "Aluno",
        Status: "Ativo",
        telefone: form.telefone,
      } as any);

      if (resposta.sucesso) {
        toast.success("Aluno cadastrado com sucesso!");
        setForm(initialForm);
        router.push("/alunos");
        router.refresh();
      } else {
        toast.error(resposta.mensagem);
      }
    } catch {
      toast.error("Erro interno ao tentar cadastrar o aluno.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    label: string,
    field: FormKeys,
    opts?: { type?: string; placeholder?: string; required?: boolean }
  ) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
        {opts?.required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <input
        type={opts?.type || "text"}
        value={form[field]}
        onChange={(e) => updateField(field, e.target.value)}
        placeholder={opts?.placeholder || ""}
        disabled={isLoading}
        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );

  const renderPasswordInput = (
    label: string,
    field: "password" | "confirmPassword",
    show: boolean,
    onToggle: () => void,
    placeholder: string
  ) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
        <span className="text-destructive ml-0.5">*</span>
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={form[field]}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          autoComplete="new-password"
          className="w-full h-10 px-3 pr-10 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/alunos" className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Aluno</h1>
          <p className="text-muted-foreground mt-1">Cadastro da conta do aluno</p>
        </div>
      </div>

      <div className="metric-card glow-border p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Dados Pessoais</h2>
            <p className="text-xs text-muted-foreground">Informações da conta do aluno</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {renderInput("Nome completo", "name", { placeholder: "Ex: Maria da Silva", required: true })}
          {renderInput("Email", "email", { type: "email", placeholder: "aluno@email.com", required: true })}

          {renderPasswordInput(
            "Senha",
            "password",
            showPassword,
            () => setShowPassword((v) => !v),
            "Mínimo 8 caracteres"
          )}

          {renderPasswordInput(
            "Confirmar Senha",
            "confirmPassword",
            showConfirmPassword,
            () => setShowConfirmPassword((v) => !v),
            "Repita a senha"
          )}

          {renderInput("Telefone", "telefone", { placeholder: "(00) 00000-0000", required: true })}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Plano
            </label>
            <select
              value={form.plano}
              onChange={(e) => updateField("plano", e.target.value)}
              disabled={isLoading}
              className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="Mensal">Mensal</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/alunos"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" />
          {isLoading ? "Cadastrando..." : "Cadastrar Aluno"}
        </button>
      </div>
    </div>
  );
}