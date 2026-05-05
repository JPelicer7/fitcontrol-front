"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EvolutionChartsProps {
  data: {
    peso: number;
    percentual_gordura: number;
    createdAt: string;
  }[];
}

export function EvolutionCharts({ data }: EvolutionChartsProps) {

  //const chartKey = JSON.stringify(data); 

  
  const chartData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Peso */}
      <div className="metric-card glow-border p-6 bg-card rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Evolução do Peso</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                // formatter={(value: number) => [`${value} kg`, "Peso"]}
                formatter={(value) => {
                  const num = typeof value === "number" ? value : Number(value);
                  return [`${num} kg`, "Peso"];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="peso" 
                stroke="hsl(160 84% 39%)" 
                strokeWidth={3} 
                dot={{ fill: "hsl(160 84% 39%)", r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Gordura */}
      <div className="metric-card glow-border p-6 bg-card rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">% Gordura Corporal</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 1", "dataMax + 1"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                // formatter={(value: number) => [`${value}%`, "Gordura"]}
                formatter={(value) => {
                  const num = typeof value === "number" ? value : Number(value);
                  return [`${num}%`, "Gordura"];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="percentual_gordura" 
                stroke="hsl(38 92% 50%)" 
                strokeWidth={3} 
                dot={{ fill: "hsl(38 92% 50%)", r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}