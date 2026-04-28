"use client";

import { Dumbbell, Flame, Target, Zap, CheckCircle2, Quote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type GetMeusTreinos200TreinosItem } from "@/app/_lib/api/fetch-generated";

const CORES = [
  "hsl(0 72% 51%)",
  "hsl(220 70% 50%)",
  "hsl(260 60% 55%)",
  "hsl(38 92% 50%)",
  "hsl(160 84% 39%)",
];

interface MeusTreinosClientProps {
  treinos: GetMeusTreinos200TreinosItem[];
  nomeAluno: string;
}

export function MeusTreinosClient({ treinos, nomeAluno }: MeusTreinosClientProps) {
  const totalExercicios = treinos.reduce((acc, t) => acc + t.exercicios.length, 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border">
        <img
          src="/gym2-hero.jpg"
          alt="Academia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

        <div className="relative px-6 py-10 md:px-8 md:py-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 mb-4">
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Bora treinar
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Olá, {nomeAluno}. <br />
            <span className="text-primary">Sua melhor versão</span> te espera.
          </h1>
          <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-lg">
            Disciplina constrói o que motivação começa. Execute cada série com foco.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="px-4 py-2.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {treinos.length} {treinos.length === 1 ? "divisão" : "divisões"}
              </span>
            </div>
            <div className="px-4 py-2.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {totalExercicios} exercícios
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Frase motivacional */}
      <div className="metric-card flex items-start gap-4 border-l-4 border-l-primary">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
          <Quote className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-foreground font-semibold text-base md:text-lg italic leading-snug">
            {/* "A dor que você sente hoje é a força que você sentirá amanhã." */}
            &ldquo;A dor que você sente hoje é a força que você sentirá amanhã.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">
            Frase do dia
          </p>
        </div>
      </div>

      {/* Treinos */}
      {treinos.length === 0 ? (
        <div className="metric-card p-12 text-center border border-dashed rounded-xl">
          <Dumbbell className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-foreground/70">
            Nenhum treino vinculado ainda
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Aguarde seu personal vincular um treino à sua conta.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Sua divisão de treino
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Escolha o treino do dia e mãos à obra
            </p>
          </div>

          <Tabs defaultValue="0">
            {/* TabsList com scroll horizontal em mobile */}
            <div className="overflow-x-auto pb-1">
              <TabsList className="bg-muted/30 p-1 w-max min-w-full">
                {treinos.map((treino, i) => {
                  const cor = CORES[i % CORES.length];
                  return (
                    <TabsTrigger
                      key={treino.id}
                      value={String(i)}
                      className="gap-2 data-[state=active]:bg-card whitespace-nowrap"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cor }}
                      />
                      {treino.nome}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {treinos.map((treino, i) => {
              const cor = CORES[i % CORES.length];
              return (
                <TabsContent key={treino.id} value={String(i)} className="mt-5 space-y-4">
                  {/* Header do treino */}
                  <div
                    className="metric-card relative overflow-hidden p-5 md:p-6"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)) 60%, ${cor}15 100%)`,
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"
                      style={{ backgroundColor: cor }}
                    />
                    <div className="relative flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: cor + "22",
                            border: `1px solid ${cor}55`,
                          }}
                        >
                          <Dumbbell className="w-5 h-5 md:w-6 md:h-6" style={{ color: cor }} />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-foreground">
                            {treino.nome}
                          </h3>
                          {treino.descricao && (
                            <p className="text-sm text-muted-foreground">
                              {treino.descricao}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" style={{ color: cor }} />
                        <span className="text-sm font-medium text-foreground">
                          {treino.exercicios.length}{" "}
                          {treino.exercicios.length === 1 ? "exercício" : "exercícios"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lista de exercícios */}
                  <div className="space-y-2">
                    {treino.exercicios.map((ex, j) => (
                      <div
                        key={ex.id}
                        className="group metric-card flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:border-primary/40 transition-all"
                      >
                        {/* Número */}
                        <div
                          className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
                          style={{
                            backgroundColor: cor + "1f",
                            color: cor,
                            border: `1px solid ${cor}33`,
                          }}
                        >
                          {String(j + 1).padStart(2, "0")}
                        </div>

                        {/* Nome + grupo muscular */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm md:text-base truncate">
                            {ex.nome}
                          </h4>
                          {ex.grupoMuscular && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {ex.grupoMuscular}
                            </p>
                          )}
                        </div>

                        {/* Séries/reps/carga — desktop */}
                        <div className="hidden md:flex items-center gap-6 shrink-0">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                              Séries
                            </p>
                            <p className="text-base font-bold text-foreground mt-0.5">
                              {ex.series}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                              Reps
                            </p>
                            <p className="text-base font-bold text-foreground mt-0.5">
                              {ex.repeticoes}
                            </p>
                          </div>
                          <div className="text-center min-w-[60px]">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                              Carga
                            </p>
                            <p className="text-base font-bold mt-0.5" style={{ color: cor }}>
                              {ex.carga ?? "—"}
                            </p>
                          </div>
                        </div>

                        {/* Séries/reps/carga — mobile */}
                        <div className="md:hidden text-right shrink-0">
                          <p className="text-sm font-bold text-foreground">
                            {ex.series} x {ex.repeticoes}
                          </p>
                          <p className="text-xs font-semibold mt-0.5" style={{ color: cor }}>
                            {ex.carga ?? "—"}
                          </p>
                        </div>

                        <CheckCircle2 className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 hidden sm:block" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      )}
    </div>
  );
}