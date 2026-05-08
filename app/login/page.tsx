import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form className="w-full max-w-sm rounded-lg border border-border bg-card/80 p-6 shadow-xl shadow-black/20">
        <div className="mb-6 flex items-center gap-3">
          <Shield className="h-6 w-6 text-cyan-300" />
          <div>
            <h1 className="font-semibold text-white">AnkSIEM Login</h1>
            <p className="text-sm text-muted-foreground">Supabase Auth hook point</p>
          </div>
        </div>
        <label className="text-sm text-muted-foreground" htmlFor="email">Email</label>
        <input id="email" type="email" className="mt-2 w-full rounded-md border border-border bg-black/30 px-3 py-2 outline-none focus:border-cyan-400" />
        <label className="mt-4 block text-sm text-muted-foreground" htmlFor="password">Password</label>
        <input id="password" type="password" className="mt-2 w-full rounded-md border border-border bg-black/30 px-3 py-2 outline-none focus:border-cyan-400" />
        <button className="mt-6 w-full rounded-md bg-cyan-400 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-300">
          Sign in
        </button>
      </form>
    </main>
  );
}
