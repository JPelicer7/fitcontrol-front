import { headers } from "next/headers";
import { getUser, getGrafico, getHistoricoMedidas } from "@/app/_lib/api/fetch-generated";
import { MinhasMedidasClient } from "./_components/MinhasMedidasClient";

export const metadata = { title: "Minhas Medidas" };

export default async function MinhasMedidasPage() {
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const sessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
    { headers: { cookie } }
  );

  const sessionData = sessionRes.ok ? await sessionRes.json() : null;
  const userId = sessionData?.user?.id ?? "";

  if (!userId) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Sessão inválida. Faça login novamente.</p>
      </div>
    );
  }

  const [userRes, graficoRes, historicoRes] = await Promise.all([
    getUser(userId),
    getGrafico(userId),
    getHistoricoMedidas(userId),
  ]);

  const medidas = userRes.status === 200 ? userRes.data.medidas : null;
  const grafico = graficoRes.status === 200 ? graficoRes.data.historico : [];
  const historico = historicoRes.status === 201 ? historicoRes.data.historico : [];
  const nomeAluno = userRes.status === 200 ? userRes.data.user.name.split(" ")[0] : "";

  return (
    <MinhasMedidasClient
      medidas={medidas}
      grafico={grafico}
      historico={historico}
      nomeAluno={nomeAluno}
    />
  );
}