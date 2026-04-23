"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isToday as isTodayFn,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  Plus,
  CalendarIcon,
  User,
  Edit,
  Trash2,
  Dumbbell,
  ClipboardCheck,
  Coffee,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";
import {
  type GetAgendamentosDia201AgendamentosItem,
  type GetUsers201UsersItem,
} from "@/app/_lib/api/fetch-generated";
import { NovoAgendamentoDialog } from "./NovoAgendamentoDialog";
import { EditarAgendamentoDialog } from "./EditarAgendamentoDialog";
import { deletarAgendamentoAction } from "../actions";
import { toast } from "sonner";

type AgendamentoItem = Omit<GetAgendamentosDia201AgendamentosItem, "aluno"> & {
  aluno: { userId: string; nome: string } | null;
};

const categoriaMeta: Record<string, { label: string; icon: typeof Dumbbell; dot: string; chip: string; bar: string }> = {
  Personal:  { label: "Personal",   icon: Dumbbell,       dot: "bg-primary",         chip: "bg-primary/15 text-primary border-primary/30",              bar: "bg-primary" },
  Avaliacao: { label: "Avaliação",  icon: ClipboardCheck, dot: "bg-violet-400",       chip: "bg-violet-500/15 text-violet-300 border-violet-500/30",     bar: "bg-violet-500" },
  Reuniao:   { label: "Reunião",    icon: Coffee,         dot: "bg-amber-400",        chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",        bar: "bg-amber-500" },
  Outro:     { label: "Outro",      icon: Sparkles,       dot: "bg-muted-foreground", chip: "bg-muted text-muted-foreground border-border",              bar: "bg-muted-foreground" },
};

function horaFormatada(dataIso: string): string {
  return new Date(dataIso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function HeroStat({ icon: Icon, label, value, accent }: { icon: typeof Dumbbell; label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 backdrop-blur-md p-3 md:p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        <Icon className={cn("w-3.5 h-3.5", accent)} />
        {label}
      </div>
      <div className={cn("text-2xl md:text-3xl font-bold mt-1 tabular-nums", accent)}>{value}</div>
    </div>
  );
}

interface AgendaPageClientProps {
  agendamentos: AgendamentoItem[];
  alunos: GetUsers201UsersItem[];
  dataSelecionada: string;
}

export function AgendaPageClient({ agendamentos, alunos, dataSelecionada }: AgendaPageClientProps) {
  const router = useRouter();
  const selectedDate = parseISO(dataSelecionada);

  const [calendarMonth, setCalendarMonth] = useState<Date>(selectedDate);
  const [novoDialogOpen, setNovoDialogOpen] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] = useState<AgendamentoItem | null>(null);
  const [agendamentoParaDeletar, setAgendamentoParaDeletar] = useState<AgendamentoItem | null>(null);
  const [deletandoId, setDeletandoId] = useState<string | null>(null);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 0 }),
  });

  const stats = useMemo(() => ({
    total: agendamentos.length,
    personal: agendamentos.filter((a) => a.categoria === "Personal").length,
    avaliacao: agendamentos.filter((a) => a.categoria === "Avaliacao").length,
    reuniao: agendamentos.filter((a) => a.categoria === "Reuniao").length,
  }), [agendamentos]);

  const handleSelectDay = (day: Date) => {
    router.push(`?data=${format(day, "yyyy-MM-dd")}`);
    setCalendarMonth(day);
  };

  const handleConfirmarDelete = async () => {
    if (!agendamentoParaDeletar) return;
    setDeletandoId(agendamentoParaDeletar.id);
    const result = await deletarAgendamentoAction(agendamentoParaDeletar.id);
    setDeletandoId(null);
    setAgendamentoParaDeletar(null);

    if (result.sucesso) {
      toast.success("Compromisso removido.");
      router.refresh();
    } else {
      toast.error(result.mensagem || "Erro ao remover compromisso.");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-border">
          <img src="/agenda-hero.jpg" alt="Agenda" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent" />
          <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary mb-3">
                <CalendarIcon className="w-3 h-3" />
                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Sua agenda em <span className="text-primary">movimento</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Organize treinos, avaliações e aulas em um só lugar.
              </p>
              <Button size="lg" className="gap-2 mt-5 shadow-lg shadow-primary/20" onClick={() => setNovoDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                Novo Compromisso
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 md:min-w-[380px]">
              <HeroStat icon={Clock3}        label="Hoje"       value={stats.total}     accent="text-primary" />
              <HeroStat icon={Dumbbell}      label="Personal"   value={stats.personal}  accent="text-primary" />
              <HeroStat icon={ClipboardCheck} label="Avaliações" value={stats.avaliacao} accent="text-violet-300" />
              <HeroStat icon={Coffee}        label="Reuniões"   value={stats.reuniao}   accent="text-amber-300" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Calendário */}
          <Card className="lg:col-span-1 metric-card overflow-hidden lg:sticky lg:top-6">
            <CardHeader className="pb-3 bg-gradient-to-br from-muted/40 to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base capitalize">
                  {format(calendarMonth, "MMMM yyyy", { locale: ptBR })}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCalendarMonth(new Date())}>
                    <span className="text-[10px] font-semibold">HOJE</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-7 text-center mb-1">
                {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold py-1">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((day) => {
                  const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isTodayFn(day);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleSelectDay(day)}
                      className={cn(
                        "relative h-10 w-full rounded-lg text-sm transition-all flex items-center justify-center",
                        !isCurrentMonth && "text-muted-foreground/30",
                        isCurrentMonth && !isSelected && "text-foreground hover:bg-muted/50",
                        isToday && !isSelected && "ring-1 ring-primary/40 font-bold text-primary",
                        isSelected && "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/30"
                      )}
                    >
                      {day.getDate()}
                      {isSelected && agendamentos.length > 0 && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-border space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Categorias</p>
                {Object.entries(categoriaMeta).map(([key, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <div key={key} className="flex items-center gap-2.5">
                      <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
                      <Icon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{meta.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="lg:col-span-2 metric-card overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-transparent border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base capitalize">
                    {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {agendamentos.length} {agendamentos.length === 1 ? "compromisso" : "compromissos"} agendados
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setNovoDialogOpen(true)}>
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              {agendamentos.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                    <CalendarIcon className="w-7 h-7 opacity-40" />
                  </div>
                  <p className="text-sm font-medium text-foreground/70">Dia livre</p>
                  <p className="text-xs mt-1">Nenhum compromisso neste dia</p>
                  <Button variant="link" size="sm" className="mt-2 text-xs text-primary" onClick={() => setNovoDialogOpen(true)}>
                    + Criar compromisso
                  </Button>
                </div>
              ) : (
                <div className="relative pl-3">
                  <div className="absolute left-[58px] top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-3">
                    {agendamentos.map((appt) => {
                      const meta = categoriaMeta[appt.categoria] ?? categoriaMeta["Outro"];
                      const Icon = meta.icon;
                      return (
                        <div key={appt.id} className="group relative flex items-stretch gap-4">
                          {/* Hora */}
                          <div className="text-right min-w-[44px] pt-2.5">
                            <div className="text-sm font-bold text-foreground tabular-nums">
                              {horaFormatada(appt.data)}
                            </div>
                            {appt.duracao && (
                              <div className="text-[10px] text-muted-foreground">{appt.duracao}min</div>
                            )}
                          </div>

                          {/* Bolinha */}
                          <div className="relative flex flex-col items-center pt-3">
                            <span className={cn("w-3 h-3 rounded-full ring-4 ring-background z-10", meta.bar)} />
                          </div>

                          {/* Card */}
                          <div className="flex-1 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all overflow-hidden">
                            <div className="flex items-stretch">
                              <div className={cn("w-1 shrink-0", meta.bar)} />
                              <div className="flex-1 p-3.5">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", meta.chip)}>
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-sm text-foreground truncate">{appt.titulo}</p>
                                      {appt.aluno && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                          <User className="w-3 h-3" />
                                          {appt.aluno.nome}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 shrink-0", meta.chip)}>
                                    {meta.label}
                                  </Badge>
                                </div>
                                {appt.observacao && (
                                  <p className="text-xs text-muted-foreground/80 mt-2 pl-9 italic">"{appt.observacao}"</p>
                                )}
                                <div className="flex justify-end gap-1 mt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setAgendamentoEditando(appt)}
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    disabled={deletandoId === appt.id}
                                    onClick={() => setAgendamentoParaDeletar(appt)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <NovoAgendamentoDialog
        open={novoDialogOpen}
        onOpenChange={setNovoDialogOpen}
        dataSelecionada={dataSelecionada}
        agendamentosExistentes={agendamentos}
        alunos={alunos}
      />

      <EditarAgendamentoDialog
        open={!!agendamentoEditando}
        onOpenChange={(open) => !open && setAgendamentoEditando(null)}
        agendamento={agendamentoEditando}
        agendamentosExistentes={agendamentos}
        alunos={alunos}
        dataSelecionada={dataSelecionada}
      />

      <AlertDialog
        open={!!agendamentoParaDeletar}
        onOpenChange={(open) => !open && setAgendamentoParaDeletar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir compromisso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-semibold text-foreground">
                "{agendamentoParaDeletar?.titulo}"
              </span>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarDelete}
              disabled={!!deletandoId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletandoId ? "Excluindo..." : "Sim, excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}