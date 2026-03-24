// app/auth/page.tsx
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";

export default async function AuthPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) redirect("/");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
      {/* Background Decorativo Estilo Lovable (O Brilho no fundo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <main className="relative z-10 w-full max-w-md p-4">
        <LoginForm />
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2026 FitControl. Todos os direitos reservados.
        </p>
      </main>
    </div>
  );
}