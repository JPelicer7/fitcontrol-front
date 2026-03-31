"use server";

import { 
  createMedidas, 
  updateMedidas, 
  type CreateMedidasBody, 
  type UpdateMedidasBody 
} from "@/app/_lib/api/fetch-generated";
import { revalidatePath } from "next/cache";


export async function criarMedidaAction(usuarioId: string, dados: CreateMedidasBody) {
  try {
    const response = await createMedidas(usuarioId, dados);

    if (response.status === 201) {
     
      revalidatePath(`/alunos/${usuarioId}`);
      return { sucesso: true };
    }

    return { 
      sucesso: false, 
      mensagem: (response as any).data?.error || "Erro ao salvar medição." 
    };
  } catch (error) {
    console.error("Erro na Server Action (Criar):", error);
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

    return { 
      sucesso: false, 
      mensagem: (response as any).data?.error || "Erro ao atualizar campo." 
    };
  } catch (error) {
    console.error("Erro na Server Action (Update):", error);
    return { sucesso: false, mensagem: "Erro ao processar atualização." };
  }
}