"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function parseHash(hash: string): Record<string, string> {
  const params: Record<string, string> = {}
  if (!hash || !hash.startsWith("#")) return params
  const query = hash.slice(1)
  query.split("&").forEach((pair) => {
    const [key, value] = pair.split("=").map((s) => decodeURIComponent(s || ""))
    if (key && value) params[key] = value
  })
  return params
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorCode, setErrorCode] = useState<string | null>(null)

  useEffect(() => {
    const params = parseHash(window.location.hash)

    if (params.error) {
      setErrorCode(params.error_code || params.error)
      setStatus("error")
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
      return
    }

    if (params.access_token) {
      supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token || "",
      }).then(() => {
        setStatus("success")
        const next = new URLSearchParams(window.location.search).get("next") || "/"
        router.replace(next)
      }).catch(() => {
        setErrorCode("session_failed")
        setStatus("error")
      })
      return
    }

    setStatus("success")
    router.replace("/")
  }, [router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Confirming your email…</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Confirmation link problem</CardTitle>
            <CardDescription>
              {errorCode === "otp_expired"
                ? "This confirmation link has expired or is invalid. Request a new one or sign in if you’ve already confirmed."
                : "Something went wrong with this link. You can try again or sign in."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/login">Go to login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/error">Get help with confirmation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
