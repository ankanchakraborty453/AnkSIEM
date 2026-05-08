"use client";

import Link from "next/link";
import { LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
  }

  if (!email) {
    return (
      <Link href="/login" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-slate-200 hover:bg-white/5">
        <UserCircle className="h-4 w-4" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right text-sm sm:block">
        <div className="font-medium">{email}</div>
        <div className="text-xs text-muted-foreground">Analyst</div>
      </div>
      <button
        type="button"
        onClick={signOut}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-slate-300 hover:bg-white/5"
        title="Sign out"
        aria-label="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
