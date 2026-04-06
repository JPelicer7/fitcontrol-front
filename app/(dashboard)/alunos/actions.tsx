// "use server";

// import { updateUser, type UpdateUserBody } from "@/app/_lib/api/fetch-generated";
// import { revalidatePath } from "next/cache";

// export async function updateAlunoAction(userId: string, dados: UpdateUserBody) {
//   try {
//     const response = await updateUser(userId, dados);

//     
//     if (response.status === 201) {
//       revalidatePath("/alunos");
//       revalidatePath(`/alunos/${userId}`);
//       return { sucesso: true };
//     }

//     return { 
//       sucesso: false, 
//       mensagem: (response as any).data?.error || "Erro ao atualizar aluno." 
//     };
//   } catch (error) {
//     console.error("Erro na Server Action (Update Aluno):", error);
//     return { sucesso: false, mensagem: "Erro interno no servidor." };
//   }
// }

"use server";

import { updateUser, type UpdateUserBody } from "@/app/_lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

export async function updateAlunoAction(userId: string, dados: UpdateUserBody) {
  try {
    // Validação de Segurança (Server-side)
    if (dados.name && (dados.name.length < 3 || dados.name.length > 60)) {
      return { sucesso: false, mensagem: "O nome deve ter entre 3 e 60 caracteres." };
    }

    if (dados.telefone && dados.telefone.length > 15) {
       return { sucesso: false, mensagem: "Telefone inválido." };
    }

    const response = await updateUser(userId, dados);

    if (response.status === 201) {
      revalidatePath("/alunos");
      revalidatePath(`/alunos/${userId}`);
      return { sucesso: true };
    }

    return { 
      sucesso: false, 
      mensagem: (response as any).data?.error || "Erro ao atualizar aluno." 
    };
  } catch (error) {
    console.error("Erro na Server Action (Update Aluno):", error);
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}