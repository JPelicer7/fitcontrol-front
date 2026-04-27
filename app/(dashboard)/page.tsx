import { getDashboard } from "@/app/_lib/api/fetch-generated";
import {DashboardClient} from "./_components/DashboardClient"

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const hoje = new Date().toISOString().split("T")[0];

  const response = await getDashboard({ data: hoje });
  const data = response.status === 201 ? response.data : null;

  return (
    <DashboardClient
      data={data}
      dataHoje={hoje}
    />
  );
}