"use client"

import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, logOut } = useAuth()

  const onLogout = async () => {
    await logOut()
    router.replace("/login")
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
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="text-sm font-medium text-muted-foreground">Company</div>
            <div className="md:col-span-2 font-medium">{profile?.companyName || "—"}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div className="md:col-span-2 font-medium">{user?.email || "—"}</div>
          </div>
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

