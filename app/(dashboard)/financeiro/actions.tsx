"use server";

import { fechaMes, createTransaction } from "@/app/_lib/api/fetch-generated";

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


export async function executeCreateTransactionAction(data: any) {
  try {

    const valorFormatado = Number(Number(data.value).toFixed(2));
    const response = await createTransaction({
   
        descricao: data.desc,
        valor: valorFormatado,
        type: data.type === "income" ? "Receita" : "Despesa",
        categoria: data.category,
        data_pagamento: new Date(data.date).toISOString(),
        status: "Pago",
      
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Erro na Action de Criar Transação:", error);
    throw new Error("Falha ao registrar transação no servidor.");
  }
}