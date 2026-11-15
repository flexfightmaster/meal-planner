import { supabaseConfigured } from './supabase'
import { signInWithGoogle, signOut, useSession } from './useSession'

export default function App() {
  const session = useSession()

  return (
    <main className="shell">
      <header>
        <h1>Meal Planner</h1>
        <p className="muted">Phase 0: scaffold. Build {__BUILD_TIME__}</p>
      </header>

      {!supabaseConfigured && (
        <section className="card">
          <h2>Backend not configured</h2>
          <p>
            Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see{' '}
            <code>.env.example</code>) once the shared <code>xos</code> Supabase project exists.
          </p>
        </section>
      )}

      {supabaseConfigured && session === undefined && <p className="muted">Checking sign-in…</p>}

      {supabaseConfigured && session === null && (
        <section className="card">
          <h2>Sign in</h2>
          <p>Only the two household accounts can get in.</p>
          <button onClick={signInWithGoogle}>Continue with Google</button>
        </section>
      )}

      {session && (
        <section className="card">
          <h2>Signed in</h2>
          <p>{session.user.email}</p>
          <p className="muted">Nothing to show yet. The recipe library arrives in Phase 1.</p>
          <button className="secondary" onClick={signOut}>
            Sign out
          </button>
        </section>
      )}
    </main>
  )
}
