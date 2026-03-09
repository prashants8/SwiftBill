"use client"

import React from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, logOut, updateProfile } = useAuth()
  const [companyName, setCompanyName] = React.useState(profile?.companyName ?? "")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setCompanyName(profile?.companyName ?? "")
  }, [profile?.companyName])

  const onLogout = async () => {
    await logOut()
    router.replace("/login")
  }

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = companyName.trim()
    if (!name) {
      toast({ title: "Company name is required", variant: "destructive" })
      return
    }

    try {
      setSaving(true)
      await updateProfile({ companyName: name })
      toast({ title: "Profile updated", description: "Company name saved." })
    } catch (err: unknown) {
      toast({
        title: "Could not update profile",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Account and company details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your login email and company name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Anjaneya Road Carriers"
              />
            </div>
            <div className="space-y-1 text-sm">
              <div className="text-xs font-medium text-muted-foreground">Login email</div>
              <div className="font-medium">{user?.email || "—"}</div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="destructive" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  )
}

