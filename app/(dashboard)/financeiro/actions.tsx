"use server";

import { fechaMes } from "@/app/_lib/api/fetch-generated";

export async function executeFechaMesAction() {
  try {
    const response = await fechaMes();
    
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Erro na Action de Fechamento:", error);
    throw new Error("Falha ao processar fechamento no servidor.");
  }
}