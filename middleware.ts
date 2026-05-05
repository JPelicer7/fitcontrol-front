import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/auth"];

const DONO_ROUTES = [
  "/",
  "/alunos",
  "/treinos",
  "/agenda",
  "/financeiro",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("__Secure-better-auth.session_token")?.value ??
    request.cookies.get("better-auth.session_token")?.value;


  //   const cookieName = sessionToken === request.cookies.get("_Secure-better-auth.session_token")?.value
  //   ? "_Secure-better-auth.session_token"
  //   : "better-auth.session_token";

  const isSecure = !!request.cookies.get("__Secure-better-auth.session_token")?.value;
  const cookieName = isSecure 
    ? "__Secure-better-auth.session_token" 
    : "better-auth.session_token";

  // if (!sessionToken) {
  //   const loginUrl = new URL("/auth", request.url);
  //   loginUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  if (!sessionToken) {
    const loginUrl = new URL("/auth", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
      {
        headers: {
          cookie: `${cookieName}=${sessionToken}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    const data = await response.json();
    const role = data?.user?.role;

    if (!role) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Dono tentando acessar rota de aluno
    // if (role === "Dono" && pathname.startsWith("/aluno")) {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
    if (role === "Dono" && (pathname === "/aluno" || pathname.startsWith("/aluno/"))) {
          return NextResponse.redirect(new URL("/", request.url));
        }

    // Aluno tentando acessar rota de dono
    const isRotaDono = DONO_ROUTES.some((route) =>
      route === "/"
        ? pathname === "/"
        : pathname === route || pathname.startsWith(`${route}/`)
    );

    if (role === "Aluno" && isRotaDono) {
      return NextResponse.redirect(new URL("/aluno/meu-treino", request.url));
    }

    // Usuário logado tentando acessar login
    if (pathname.startsWith("/auth")) {
      const redirectTo = role === "Dono" ? "/" : "/aluno/meu-treino";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp).*)",
  ],
};