"use server"; // <-- Isso diz ao Next.js: "Rode isso apenas no servidor!"

import { createUser, type CreateUserBody } from "@/app/_lib/api/fetch-generated";

// Essa função será chamada pelo nosso formulário no frontend
export async function cadastrarAlunoAction(dados: CreateUserBody & { telefone?: string }) {
  try {
    // Como estamos no servidor, o Orval consegue ler os cookies sem dar erro!
    const response = await createUser(dados);

    if (response.status === 201) {
      return { sucesso: true };
    }

    // Se der algum erro da API
    return { 
      sucesso: false, 
      mensagem: (response as any).data?.error || "Não foi possível cadastrar o aluno." 
    };
  } catch (error) {
    console.error("Erro na Server Action:", error);
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}