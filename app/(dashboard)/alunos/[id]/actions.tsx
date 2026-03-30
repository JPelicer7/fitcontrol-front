"use server";

import { createMedidas, type CreateMedidasBody } from "@/app/_lib/api/fetch-generated";

export async function criarMedidaAction(usuarioId: string, dados: CreateMedidasBody) {
  try {
    
    const response = await createMedidas(usuarioId, dados);

    if (response.status === 201) {
      return { sucesso: true };
    }

    return { 
      sucesso: false, 
      mensagem: (response as any).data?.error || "Erro ao salvar medição." 
    };
  } catch (error) {
    console.error("Erro na Server Action:", error);
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}