"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import DialogNovaMedicao from "./DialogNovaMedicao";

interface BotaoNovaMedicaoProps {
  usuarioId: string;
}

export default function BotaoNovaMedicao({ usuarioId }: BotaoNovaMedicaoProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button 
        onClick={() => setAberto(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nova Medição
      </button>

      <DialogNovaMedicao 
        aberto={aberto} 
        aoMudarAberto={setAberto} 
        usuarioId={usuarioId} 
      />
    </>
  );
}