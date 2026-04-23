"use server";

import {
  createAgendamento,
  deleteAgendamento,
  updateAgendamentos,
  UpdateAgendamentosBody,
  type CreateAgendamentoBody,
} from "@/app/_lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

export async function criarAgendamentoAction(body: CreateAgendamentoBody) {
  if (!body.titulo?.trim() || body.titulo.trim().length < 2)
    return { sucesso: false, mensagem: "Título deve ter pelo menos 2 caracteres." };
  if (body.titulo.length > 60)
    return { sucesso: false, mensagem: "Título muito longo." };

  try {
    const response = await createAgendamento(body);

    if (response.status === 201) {
      revalidatePath("/agenda");
      return { sucesso: true, id: response.data.id };
    }

    return {
      sucesso: false,
      mensagem: (response as any).data?.error || "Erro ao criar compromisso.",
    };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function atualizarAgendamentoAction(
  agendamentoId: string,
  body: UpdateAgendamentosBody
) {
  if (!agendamentoId) return { sucesso: false, mensagem: "ID inválido." };
  if (body.titulo !== undefined && body.titulo.trim().length < 2)
    return { sucesso: false, mensagem: "Título deve ter pelo menos 2 caracteres." };
  if (body.titulo !== undefined && body.titulo.length > 60)
    return { sucesso: false, mensagem: "Título muito longo." };

  try {
    const response = await updateAgendamentos(agendamentoId, body);
    if (response.status === 201) {
      revalidatePath("/agenda");
      return { sucesso: true };
    }
    return { sucesso: false, mensagem: (response as any).data?.error || "Erro ao atualizar compromisso." };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}

export async function deletarAgendamentoAction(agendamentoId: string) {
  if (!agendamentoId) return { sucesso: false, mensagem: "ID inválido." };

  try {
    const response = await deleteAgendamento(agendamentoId);
    if (response.status === 200) {
      revalidatePath("/agenda");
      return { sucesso: true };
    }
    return { sucesso: false, mensagem: (response as any).data?.error || "Erro ao deletar compromisso." };
  } catch {
    return { sucesso: false, mensagem: "Erro interno no servidor." };
  }
}