"use client"

import React from "react"

type User = {
  id: string
  email: string
}

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
  const usersJson = window.localStorage.getItem("swiftbill_users")
  const users: Array<{
    id: string
    email: string
    password: string
    companyName: string
  }> = usersJson ? JSON.parse(usersJson) : []

  const existingIndex = users.findIndex((u) => u.id === args.uid)
  if (existingIndex >= 0) {
    users[existingIndex] = {
      ...users[existingIndex],
      email: args.email,
      companyName: args.companyName,
    }
  } else {
    users.push({
      id: args.uid,
      email: args.email,
      password: "",
      companyName: args.companyName,
    })
  }

  window.localStorage.setItem("swiftbill_users", JSON.stringify(users))
}

async function readProfile(uid: string) {
  const usersJson = window.localStorage.getItem("swiftbill_users")
  const users: Array<{
    id: string
    email: string
    password: string
    companyName: string
  }> = usersJson ? JSON.parse(usersJson) : []

  const match = users.find((u) => u.id === uid)
  if (!match) return null

  return {
    uid: match.id,
    email: match.email,
    companyName: match.companyName,
  } as UserProfile
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const usersJson = window.localStorage.getItem("swiftbill_users")
    const currentId = window.localStorage.getItem("swiftbill_current_user")

    if (!usersJson || !currentId) {
      setUser(null)
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const users: Array<{
        id: string
        email: string
        password: string
        companyName: string
      }> = JSON.parse(usersJson)

      const u = users.find((x) => x.id === currentId)
      if (!u) {
        setUser(null)
        setProfile(null)
      } else {
        setUser({ id: u.id, email: u.email })
        setProfile({
          uid: u.id,
          email: u.email,
          companyName: u.companyName,
        })
      }
    } catch {
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = React.useCallback(
    async (args: { email: string; password: string; companyName: string }) => {
      const usersJson = window.localStorage.getItem("swiftbill_users")
      const users: Array<{
        id: string
        email: string
        password: string
        companyName: string
      }> = usersJson ? JSON.parse(usersJson) : []

      if (users.some((u) => u.email.toLowerCase() === args.email.toLowerCase())) {
        throw new Error("An account with this email already exists.")
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`

      const nextUsers = [
        ...users,
        {
          id,
          email: args.email,
          password: args.password,
          companyName: args.companyName,
        },
      ]

      window.localStorage.setItem("swiftbill_users", JSON.stringify(nextUsers))
      window.localStorage.setItem("swiftbill_current_user", id)

      setUser({ id, email: args.email })
      setProfile({
        uid: id,
        email: args.email,
        companyName: args.companyName,
      })
    },
    []
  )

  const logIn = React.useCallback(async (args: { email: string; password: string }) => {
    const usersJson = window.localStorage.getItem("swiftbill_users")
    const users: Array<{
      id: string
      email: string
      password: string
      companyName: string
    }> = usersJson ? JSON.parse(usersJson) : []

    const match = users.find(
      (u) =>
        u.email.toLowerCase() === args.email.toLowerCase() && u.password === args.password
    )

    if (!match) {
      throw new Error("Invalid email or password.")
    }

    window.localStorage.setItem("swiftbill_current_user", match.id)

    setUser({ id: match.id, email: match.email })
    setProfile({
      uid: match.id,
      email: match.email,
      companyName: match.companyName,
    })
  }, [])

  const logOut = React.useCallback(async () => {
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

