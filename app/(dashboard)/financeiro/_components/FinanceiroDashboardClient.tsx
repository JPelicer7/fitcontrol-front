"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { 
  DollarSign, TrendingUp, TrendingDown, Plus, 
  ArrowUpRight, ArrowDownRight, Lock, Calendar, Loader2,
  ChevronRight
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from "recharts";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { executeFechaMesAction } from "../actions";
import type { GetTransactions201, GetFinanceiroHistory201HistoricoItem } from "@/app/_lib/api/fetch-generated";

interface Props {
  initialData: GetTransactions201;
  history: GetFinanceiroHistory201HistoricoItem[];
}

const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"];

export function FinanceiroDashboardClient({ initialData, history }: Props) {
  const router = useRouter();
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false); 

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const currentMonthLabel = new Date().toLocaleDateString("pt-BR", { 
    month: "long", 
    year: "numeric" 
  });

  
  const getMonthName = (month: number, year: number) => {
    return new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long' });
  };
  
  const handleCloseMonth = async () => {
    try {
      setIsClosing(true);
      const response = await executeFechaMesAction();

      if (response.status === 201) {
        toast.success("Mês encerrado com sucesso!");
        setShowCloseDialog(false);
        router.refresh();
      } else if (response.status === 404) {
        toast.error("Este mês já foi encerrado anteriormente.");
      } else if (response.status === 409) {
        toast.error("Não há transações pagas para fechar nesse período.")
      } else {
        toast.error("Ocorreu um erro ao encerrar o mês.");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
      console.error(error);
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground mt-1 text-sm">Controle de receitas e despesas</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nova Transação
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowCloseDialog(true)}
            className="flex items-center gap-2 border-border bg-card hover:bg-muted"
          >
            <Lock className="w-4 h-4" />
            Fechar Mês
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>Mês atual:</span>
        <span className="font-semibold text-primary capitalize">{currentMonthLabel}</span>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card glow-border p-6 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(initialData.receitaTotal)}</p>
          <p className="text-xs text-muted-foreground mt-1">Receita do Mês</p>
        </div>

        <div className="metric-card glow-border p-6 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <ArrowDownRight className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(initialData.despesaTotal)}</p>
          <p className="text-xs text-muted-foreground mt-1">Despesas do Mês</p>
        </div>

        <div className="metric-card glow-border p-6 bg-card rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(initialData.lucroLiquido)}</p>
          <p className="text-xs text-muted-foreground mt-1">Lucro Líquido</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Transações */}
        <div className="lg:col-span-2 metric-card glow-border p-0 overflow-hidden bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Transações Recentes</h3>
          </div>
          <div className="divide-y divide-border">
            {initialData.transactions.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-sm">Nenhuma transação neste período.</div>
            ) : (
              initialData.transactions.map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === "Receita" ? "bg-primary/10" : "bg-destructive/10"}`}>
                      {t.type === "Receita" ? <ArrowUpRight className="w-4 h-4 text-primary" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.descricao}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t.data_pagamento).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${t.type === "Receita" ? "text-primary" : "text-destructive"}`}>
                      {t.type === "Receita" ? "+" : "-"}{formatCurrency(t.valor)}
                    </span>
                    <p className="text-[10px] uppercase text-muted-foreground">{t.categoria}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gráfico de Pizza */}
        <div className="metric-card glow-border p-6 bg-card rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Despesas por Categoria</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={initialData.graficoDespesas} 
                  cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={80} 
                  paddingAngle={5} dataKey="valor"
                  nameKey="categoria"
                >
                  {initialData.graficoDespesas.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {initialData.graficoDespesas.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground">{item.categoria}</span>
                </div>
                <span className="text-foreground font-medium">{formatCurrency(item.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEÇÃO DE HISTÓRICO*/}
      <div className="metric-card glow-border p-0 overflow-hidden bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Histórico de Meses Fechados</h3>
            <p className="text-xs text-muted-foreground">Consolidado de meses anteriores</p>
          </div>
          <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
            {history.length} Registros
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {history.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm italic">
              Nenhum histórico de fechamento encontrado.
            </div>
          ) : (
            history.map((mes, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                    <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground capitalize">
                      {getMonthName(mes.mes, mes.ano)} / {mes.ano}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Fechado em: {new Date(mes.fechadoEm).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] text-muted-foreground uppercase">Receita</p>
                    <p className="text-sm font-medium text-primary">{formatCurrency(mes.receitaTotal)}</p>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] text-muted-foreground uppercase">Despesa</p>
                    <p className="text-sm font-medium text-destructive">{formatCurrency(mes.despesaTotal)}</p>
                  </div>
                  
                  <div className="text-right min-w-[100px]">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Lucro</p>
                    <p className={`text-sm font-bold ${mes.lucroLiquido >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                      {formatCurrency(mes.lucroLiquido)}
                    </p>
                  </div>

                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Fechamento */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fechar Mês — {currentMonthLabel}</DialogTitle>
            <DialogDescription>
              Atenção: O resumo financeiro será salvo no histórico e os valores do mês atual serão zerados para o próximo período. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4 text-center">
             <div className="bg-muted p-2 rounded-lg border border-border">
                <p className="text-[10px] text-muted-foreground uppercase">Receita</p>
                <p className="text-sm font-bold text-primary">{formatCurrency(initialData.receitaTotal)}</p>
             </div>
             <div className="bg-muted p-2 rounded-lg border border-border">
                <p className="text-[10px] text-muted-foreground uppercase">Despesa</p>
                <p className="text-sm font-bold text-destructive">{formatCurrency(initialData.despesaTotal)}</p>
             </div>
             <div className="bg-muted p-2 rounded-lg border border-primary/20">
                <p className="text-[10px] text-muted-foreground uppercase">Lucro</p>
                <p className="text-sm font-bold">{formatCurrency(initialData.lucroLiquido)}</p>
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)} disabled={isClosing}>
              Cancelar
            </Button>
            <Button onClick={handleCloseMonth} disabled={isClosing}>
              {isClosing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fechando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Confirmar Fechamento
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}