import { getMeusTreinos } from "@/app/_lib/api/fetch-generated";
import { MeusTreinosClient } from "./_components/MeusTreinosClient";
import { headers } from "next/headers";

export const metadata = { title: "Meu Treino" };

export default async function MeuTreinoPage() {
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  
  const sessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
    { headers: { cookie } }
  );

  const sessionData = sessionRes.ok ? await sessionRes.json() : null;
  const userId = sessionData?.user?.id ?? "";
  const nomeAluno = sessionData?.user?.name?.split(" ")[0] ?? "Aluno";

  const response = userId ? await getMeusTreinos(userId) : null;
  const treinos = response?.status === 200 ? response.data.treinos : [];

  return <MeusTreinosClient treinos={treinos} nomeAluno={nomeAluno} />;
}