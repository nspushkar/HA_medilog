// First, create the utility file: utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Then, your dashboard page should be:
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AuthButtons from "@/components/auth/authButtons";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  console.log("USER ON DASHBOARD PAGE:", user);

  if (error || !user) {
    console.log("NO USER FOUND, REDIRECTING TO HOMEPAGE");
    redirect("/"); // Protect the page
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <h1 className="text-xl font-bold">MediLog Dashboard</h1>
        <AuthButtons />
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            Welcome back, {user.user_metadata?.name || user.email || "User"}!
          </h2>
          <p className="text-muted-foreground">
            Here are your medical record folders.
          </p>
        </div>
        {/* We will list the folders and add the 'Create Folder' button here */}
        <div className="text-center text-muted-foreground py-12">
          <p>You have no folders yet.</p>
          <p>Click "New Folder" to get started.</p>
        </div>
      </main>
    </div>
  );
}