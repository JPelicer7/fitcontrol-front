import { getTransactions } from "@/app/_lib/api/fetch-generated";
import type { GetTransactions201 } from "@/app/_lib/api/fetch-generated";
import { FinanceiroDashboardClient } from "./_components/FinanceiroDashboardClient";

export default async function FinanceiroPage() {
  const response = await getTransactions();


  let dashboardData: GetTransactions201 = {
    receitaTotal: 0,
    despesaTotal: 0,
    lucroLiquido: 0,
    graficoDespesas: [],
    transactions: [],
  };

  if (response.status === 201) {
    dashboardData = response.data;
  }

  return (
    <div className="space-y-6">
      <FinanceiroDashboardClient initialData={dashboardData} />
    </div>
  );
}