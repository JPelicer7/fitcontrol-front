"use client";

import Link from "next/link";
import {
  Users,
  Dumbbell,
  CalendarCheck,
  ChevronRight,
  Clock,
  TrendingUp,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSession } from "@/app/_lib/auth-client";
import { type GetDashboard201 } from "@/app/_lib/api/fetch-generated";

function horaFormatada(dataIso: string): string {
  return new Date(dataIso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const categoriaLabels: Record<string, string> = {
  Personal: "Personal",
  Avaliacao: "Avaliação",
  Reuniao: "Reunião",
  Outro: "Outro",
};

interface DashboardClientProps {
  data: GetDashboard201 | null;
  dataHoje: string;
}

export function DashboardClient({ data, dataHoje }: DashboardClientProps) {
  // const { data: session } = useSession();
  // const nomeUsuario = session?.user?.name?.split(" ")[0] ?? "Bem-vindo";
  const { data: session, isPending } = useSession();
  const nomeUsuario = isPending
    ? null
    : session?.user?.name?.split(" ")[0] ?? "Bem-vindo";

  const alunos = data?.alunos ?? { ativos: 0, total: 0 };
  const financeiro = data?.financeiro ?? { receitaTotal: 0, despesaTotal: 0 };
  const ultimosAlunos = data?.ultimosAlunos ?? [];
  const agora = new Date();
  const agendamentos = (data?.agendamentosDia ?? []).sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  const proximoAgendamento = agendamentos.find(
    (a) => new Date(a.data).getTime() > agora.getTime()
  );

  const lucro = financeiro.receitaTotal - financeiro.despesaTotal;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border h-56 md:h-64">
        <img
          src="/gym-hero.jpg"
          alt="Academia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative h-full flex flex-col justify-center p-6 md:p-8 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">
            {nomeUsuario ? `Bem-vindo de volta, ${nomeUsuario}` : "Bem-vindo de volta"}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Hoje você tem{" "}
            <span className="text-primary">
              {agendamentos.length}{" "}
              {agendamentos.length === 1 ? "compromisso" : "compromissos"}
            </span>{" "}
            agendados
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {format(parseISO(dataHoje), "EEEE, dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Alunos Ativos"
          value={String(alunos.ativos)}
          hint={`de ${alunos.total} totais`}
          accent="primary"
        />
        <MetricCard
          icon={CalendarCheck}
          label="Compromissos Hoje"
          value={String(agendamentos.length)}
          hint={
            proximoAgendamento
              ? `próximo às ${horaFormatada(proximoAgendamento.data)}`
              : agendamentos.length === 0
              ? "Dia livre"
              : "Todos concluídos"
          }
          accent="primary"
        />
        <MetricCard
          icon={DollarSign}
          label="Receita do Mês"
          value={formatarMoeda(financeiro.receitaTotal)}
          hint={`despesas: ${formatarMoeda(financeiro.despesaTotal)}`}
          accent="success"
        />
        <MetricCard
          icon={lucro >= 0 ? TrendingUp : TrendingDown}
          label="Lucro do Mês"
          value={formatarMoeda(lucro)}
          hint={lucro >= 0 ? "resultado positivo" : "resultado negativo"}
          accent={lucro >= 0 ? "success" : "danger"}
        />
      </div>

      {/* Agenda + Últimos Alunos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Agenda do dia */}
        <div className="xl:col-span-2 metric-card glow-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Agenda de Hoje
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {agendamentos.length === 0
                  ? "Nenhum compromisso"
                  : `${agendamentos.length} ${agendamentos.length === 1 ? "compromisso" : "compromissos"}`}
              </p>
            </div>
            <Link
              href="/agenda"
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
            >
              Ver agenda <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {agendamentos.length === 0 ? (
            <div className="py-10 text-center">
              <CalendarCheck className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum compromisso hoje
              </p>
              <Link
                href="/agenda"
                className="text-xs text-primary hover:underline mt-2 inline-block"
              >
                + Criar compromisso
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {agendamentos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-primary mb-0.5" />
                    <span className="text-sm font-bold text-foreground">
                      {horaFormatada(item.data)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {categoriaLabels[item.categoria] ?? item.categoria}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimos alunos */}
        <div className="metric-card glow-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Últimos Alunos
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cadastros mais recentes
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>

          {ultimosAlunos.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum aluno cadastrado
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ultimosAlunos.map((aluno) => (
                <Link
                  key={aluno.id}
                  href={`/alunos/${aluno.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-foreground">
                      {aluno.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {aluno.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{aluno.plano}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-foreground mb-5">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickAction href="/alunos/novo" icon={Users} label="Cadastrar Aluno" />
          <QuickAction href="/treinos" icon={Dumbbell} label="Criar Treino" />
          <QuickAction
            href="/agenda"
            icon={CalendarCheck}
            label="Novo Compromisso"
          />
        </div>
      </div>
    </div>
  );
}

const accentMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-400",
  danger: "bg-destructive/10 text-destructive",
} as const;

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint: string;
  accent: keyof typeof accentMap;
}) {
  return (
    <div className="metric-card">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${accentMap[accent]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <p className="text-[11px] text-muted-foreground/70 mt-2">{hint}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/40 hover:bg-muted/50 transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm font-medium text-foreground flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}