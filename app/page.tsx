// app/page.tsx
import AuthButtons from "@/components/auth/authButtons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <h1 className="text-xl font-bold">MediLog</h1>
        <AuthButtons />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h2 className="text-4xl font-bold tracking-tight lg:text-6xl">
          Welcome to MediLog
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Your personal health records, digitized and organized.
        </p>
        {/* We will add the upload component here later */}
      </div>
    </main>
  );
}