"use server";
import {
  createAlunoTreino,
  CreateAlunoTreinoBody,
  createExercicio,
  createTreino,
  CreateTreinoBody,
  createTreinoExercio,
  deleteAlunoTreino,
  deleteTreino,
  deleteTreinoExercicio,
  updateTreinoExercicio,
  UpdateTreinoExercicioBody,
  type CreateExercicioBody,
  type CreateTreinoExercioBody,
} from "@/app/_lib/api/fetch-generated";
import { revalidatePath } from "next/cache";


export async function criarExercicioAction(body: CreateExercicioBody) {
  if (!body.nome?.trim() || body.nome.trim().length < 2) {
    return { sucesso: false, mensagem: "Nome deve ter pelo menos 2 caracteres." };
  }
  if (body.nome.length > 80) {
    return { sucesso: false, mensagem: "Nome muito longo." };
  }

  try {
    const response = await createExercicio(body);

    if (response.status === 201) {
      return { sucesso: true, id: response.data.id };
    }

    return {
      sucesso: false,
      mensagem: (response as any).data?.error || "Erro ao criar exercício.",
    };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}


export async function adicionarExercicioAoTreinoAction(
  treinoId: string,
  body: CreateTreinoExercioBody
) {
  if (!treinoId) return { sucesso: false, mensagem: "Treino inválido." };
  if (body.series < 1) return { sucesso: false, mensagem: "Séries inválidas." };
  if (!body.repeticoes?.trim()) return { sucesso: false, mensagem: "Repetições inválidas." };

  try {
    const response = await createTreinoExercio(treinoId, body);

    if (response.status === 201) {
      revalidatePath("/treinos");
      return { sucesso: true };
    }

    return {
      sucesso: false,
      mensagem: (response as any).data?.error || "Erro ao adicionar exercício ao treino.",
    };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function criarTreinoAction(body: CreateTreinoBody) {
  if (!body.nome?.trim() || body.nome.trim().length < 2) {
    return { sucesso: false, mensagem: "Nome deve ter pelo menos 2 caracteres." };
  }
  if (body.nome.length > 80) {
    return { sucesso: false, mensagem: "Nome muito longo." };
  }

  try {
    const response = await createTreino({
      nome: body.nome.trim(),
      descricao: body.descricao?.trim() || undefined,
    });

    if (response.status === 201) {
      revalidatePath("/treinos");
      return { sucesso: true, id: response.data.id };
    }

    return {
      sucesso: false,
      mensagem: (response as any).data?.error || "Erro ao criar treino.",
    };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function vincularAlunoAoTreinoAction(
  treinoId: string,
  body: CreateAlunoTreinoBody
) {
  if (!treinoId) return { sucesso: false, mensagem: "Treino inválido." };
  if (!body.userId) return { sucesso: false, mensagem: "Aluno inválido." };

  try {
    const response = await createAlunoTreino(treinoId, body);

    if (response.status === 201) {
      revalidatePath("/treinos");
      return { sucesso: true };
    }

    
    if (response.status === 409) {
      return { sucesso: false, mensagem: "Aluno já vinculado a este treino." };
    }

    return {
      sucesso: false,
      mensagem: (response as any).data?.error || "Erro ao vincular aluno.",
    };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function atualizarExercicioDoTreinoAction(
  treinoId: string,
  treinoExercicioId: string,
  body: UpdateTreinoExercicioBody
) {
  if (!treinoId || !treinoExercicioId)
    return { sucesso: false, mensagem: "IDs inválidos." };
  if (body.series !== undefined && body.series < 1)
    return { sucesso: false, mensagem: "Séries inválidas." };

  try {
    const response = await updateTreinoExercicio(treinoId, treinoExercicioId, body);
    if (response.status === 201) {
      revalidatePath("/treinos");
      return { sucesso: true };
    }
    return { sucesso: false, mensagem: (response as any).data?.error || "Erro ao atualizar exercício." };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function deletarExercicioDoTreinoAction(
  treinoId: string,
  treinoExercicioId: string
) {
  if (!treinoId || !treinoExercicioId)
    return { sucesso: false, mensagem: "IDs inválidos." };

  try {
    const response = await deleteTreinoExercicio(treinoId, treinoExercicioId);
    if (response.status === 200) {
      revalidatePath("/treinos");
      return { sucesso: true };
    }
    return { sucesso: false, mensagem: (response as any).data?.error || "Erro ao remover exercício." };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function deletarTreinoAction(treinoId: string) {
  if (!treinoId) return { sucesso: false, mensagem: "Treino inválido." };

  try {
    const response = await deleteTreino(treinoId);
    if (response.status === 200) {
      revalidatePath("/treinos");
      return { sucesso: true };
    }
    return {
      sucesso: false,
      mensagem: (response as any).data?.error || "Erro ao deletar treino.",
    };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function desvincularAlunoDoTreinoAction(
  treinoId: string,
  userId: string
) {
  if (!treinoId || !userId) return { sucesso: false, mensagem: "IDs inválidos." };

  try {
    const response = await deleteAlunoTreino(treinoId, userId);
    if (response.status === 200) {
      revalidatePath("/treinos");
      return { sucesso: true };
    }
    return {
      sucesso: false,
      mensagem: (response as any).data?.error || "Erro ao desvincular aluno.",
    };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}