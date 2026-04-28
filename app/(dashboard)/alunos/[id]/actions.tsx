"use server";

import { 
  createMedidas, 
  updateMedidas, 
  getGrafico,
  getHistoricoMedidas,
  type CreateMedidasBody, 
  type UpdateMedidasBody 
} from "@/app/_lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

export async function getGraficoAction(usuarioId: string) {
  try {
    const response = await getGrafico(usuarioId);
    if (response.status === 200) {
      return { sucesso: true, dados: response.data.historico };
    }
    return { sucesso: false, dados: [], mensagem: "Não foi possível carregar o histórico." };
  } catch {
    return { sucesso: false, dados: [], mensagem: "Erro de conexão com o servidor." };
  }
}

export async function getHistoricoMedidasAction(usuarioId: string) {
  try {
    const response = await getHistoricoMedidas(usuarioId);
    if (response.status === 201) {
      return { sucesso: true, dados: response.data.historico };
    }
    return { sucesso: false, dados: [], mensagem: "Não foi possível carregar o histórico de medidas." };
  } catch {
    return { sucesso: false, dados: [], mensagem: "Erro de conexão com o servidor." };
  }
}

export async function criarMedidaAction(usuarioId: string, dados: CreateMedidasBody) {
  try {
    const response = await createMedidas(usuarioId, dados);
    if (response.status === 201) {
      revalidatePath(`/alunos/${usuarioId}`);
      return { sucesso: true };
    }
    return { sucesso: false, mensagem: (response as any).data?.error || "Erro ao salvar medição." };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function updateMedidaAction(
  usuarioId: string,
  medidaId: string,
  dados: UpdateMedidasBody
) {
  try {
    const response = await updateMedidas(usuarioId, medidaId, dados);
    if (response.status === 201) {
      revalidatePath(`/alunos/${usuarioId}`);
      return { sucesso: true };
    }
    return { sucesso: false, mensagem: (response as any).data?.error || "Erro ao atualizar campo." };
  } catch {
    return { sucesso: false, mensagem: "Erro ao processar atualização." };
  }
}