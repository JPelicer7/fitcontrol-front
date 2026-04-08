// app/(dashboard)/financeiro/page.tsx
import { getTransactions, getFinanceiroHistory } from "@/app/_lib/api/fetch-generated";
import { FinanceiroDashboardClient } from "./_components/FinanceiroDashboardClient";


export default async function FinanceiroPage() {
  const [resTransactions, resHistory] = await Promise.all([
    getTransactions(),
    getFinanceiroHistory()
  ]);

 
  const dashboardData = resTransactions.status === 201 ? resTransactions.data : {
    receitaTotal: 0, despesaTotal: 0, lucroLiquido: 0, graficoDespesas: [], transactions: []
  };

  let historyData: any[] = [];

  if (resHistory.status === 201) {
    historyData = Array.isArray(resHistory.data) 
      ? resHistory.data 
      : (resHistory.data as any).historico || []; 
  }

  return (
    <div className="space-y-6">
      <FinanceiroDashboardClient 
        initialData={dashboardData} 
        history={historyData} 
      />
    </div>
  );
}