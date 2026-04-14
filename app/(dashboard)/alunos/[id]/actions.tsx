// "use server";

// import { 
//   createMedidas, 
//   updateMedidas, 
//   type CreateMedidasBody, 
//   type UpdateMedidasBody 
// } from "@/app/_lib/api/fetch-generated";
// import { revalidatePath } from "next/cache";


// export async function criarMedidaAction(usuarioId: string, dados: CreateMedidasBody) {
//   try {
//     const response = await createMedidas(usuarioId, dados);

//     if (response.status === 201) {
     
//       revalidatePath(`/alunos/${usuarioId}`);
//       return { sucesso: true };
//     }

//     return { 
//       sucesso: false, 
//       mensagem: (response as any).data?.error || "Erro ao salvar medição." 
//     };
//   } catch (error) {
//     console.error("Erro na Server Action (Criar):", error);
//     return { sucesso: false, mensagem: "Erro interno no servidor." };
//   }
// }


// export async function updateMedidaAction(
//   usuarioId: string, 
//   medidaId: string, 
//   dados: UpdateMedidasBody
// ) {
//   try {
    
//     const response = await updateMedidas(usuarioId, medidaId, dados);

    
//     if (response.status === 201) {
//       revalidatePath(`/alunos/${usuarioId}`);
//       return { sucesso: true };
//     }

//     return { 
//       sucesso: false, 
//       mensagem: (response as any).data?.error || "Erro ao atualizar campo." 
//     };
//   } catch (error) {
//     console.error("Erro na Server Action (Update):", error);
//     return { sucesso: false, mensagem: "Erro ao processar atualização." };
//   }
// }

"use server";

import { 
  createMedidas, 
  updateMedidas, 
  getGrafico,
  type CreateMedidasBody, 
  type UpdateMedidasBody 
} from "@/app/_lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

/**
 * Busca o histórico de peso e gordura para os gráficos
 */
export async function getGraficoAction(usuarioId: string) {
  try {
    const response = await getGrafico(usuarioId);

    if (response.status === 200) {
      return { 
        sucesso: true, 
        dados: response.data.historico 
      };
    }

    return { 
      sucesso: false, 
      dados: [], 
      mensagem: "Não foi possível carregar o histórico." 
    };
  } catch (error) {
    console.error("Erro na Server Action (GetGrafico):", error);
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