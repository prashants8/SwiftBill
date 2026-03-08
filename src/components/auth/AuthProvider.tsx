"use client"

import React from "react"

import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"

export type UserProfile = {
  uid: string
  email: string
  companyName: string
  createdAt?: unknown
  updatedAt?: unknown
}

type AuthContextValue = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signUp: (args: { email: string; password: string; companyName: string }) => Promise<void>
  logIn: (args: { email: string; password: string }) => Promise<void>
  logOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

async function upsertProfile(args: { uid: string; email: string; companyName: string }) {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: args.uid,
        email: args.email,
        company_name: args.companyName,
      },
      { onConflict: "id" }
    )

  if (error) {
    console.error("Failed to upsert profile", error)
  }
}

async function readProfile(uid: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, company_name, created_at, updated_at")
    .eq("id", uid)
    .maybeSingle()

  if (error) {
    console.error("Failed to read profile", error)
    return null
  }

  if (!data) return null

  return {
    uid: data.id,
    email: data.email,
    companyName: data.company_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as UserProfile
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true

    async function boot() {
      const { data, error } = await supabase.auth.getSession()
      if (!active) return

      if (error) {
        console.error("Error getting Supabase session", error)
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      const currentUser = data.session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        window.localStorage.setItem("swiftbill_current_user", currentUser.id)
        const p = await readProfile(currentUser.id)
        setProfile(p)
      } else {
        window.localStorage.removeItem("swiftbill_current_user")
        setProfile(null)
      }

      setLoading(false)
    }

    boot()

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        window.localStorage.setItem("swiftbill_current_user", currentUser.id)
        const p = await readProfile(currentUser.id)
        setProfile(p)
      } else {
        window.localStorage.removeItem("swiftbill_current_user")
        setProfile(null)
      }
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signUp = React.useCallback(
    async (args: { email: string; password: string; companyName: string }) => {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined
      const { data, error } = await supabase.auth.signUp({
        email: args.email,
        password: args.password,
        options: { emailRedirectTo: redirectTo },
      })

      if (error) {
        throw error
      }

      const createdUser = data.user
      if (!createdUser) {
        // In email-confirmation flows there might be no user/session yet.
        return
      }

      await upsertProfile({
        uid: createdUser.id,
        email: args.email,
        companyName: args.companyName,
      })

      window.localStorage.setItem("swiftbill_current_user", createdUser.id)
      setUser(createdUser)
      setProfile({
        uid: createdUser.id,
        email: args.email,
        companyName: args.companyName,
      })
    },
    []
  )

  const logIn = React.useCallback(async (args: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: args.email,
      password: args.password,
    })

    if (error) {
      throw error
    }

    const currentUser = data.user
    if (!currentUser) return

    window.localStorage.setItem("swiftbill_current_user", currentUser.id)
    setUser(currentUser)
    const p = await readProfile(currentUser.id)
    setProfile(
      p ?? {
        uid: currentUser.id,
        email: currentUser.email ?? args.email,
        companyName: "",
      }
    )
  }, [])

  const logOut = React.useCallback(async () => {
    await supabase.auth.signOut()
    window.localStorage.removeItem("swiftbill_current_user")
    setUser(null)
    setProfile(null)
  }, [])

  const value: AuthContextValue = React.useMemo(
    () => ({ user, profile, loading, signUp, logIn, logOut }),
    [user, profile, loading, signUp, logIn, logOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}

