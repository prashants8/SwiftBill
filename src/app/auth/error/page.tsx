"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code") || searchParams.get("error_code") || "unknown"
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)

  const isExpired = code === "otp_expired"

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast({ title: "Enter your email", variant: "destructive" })
      return
    }
    setSending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      })
      if (error) throw error
      toast({ title: "Email sent", description: "Check your inbox for a new confirmation link." })
    } catch (err: unknown) {
      toast({
        title: "Could not resend",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isExpired ? "Confirmation link expired" : "Confirmation link invalid"}
          </CardTitle>
          <CardDescription>
            {isExpired
              ? "Email confirmation links expire after a short time. Enter your email below to receive a new link."
              : "This link may have been used already or is invalid. You can request a new confirmation email or sign in."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleResend} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="resend-email">Email address</Label>
              <Input
                id="resend-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? "Sending…" : "Send new confirmation link"}
            </Button>
          </form>
          <div className="relative">
            <span className="bg-card absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </span>
            <span className="relative flex justify-center text-xs uppercase text-muted-foreground">
              Or
            </span>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Go to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
