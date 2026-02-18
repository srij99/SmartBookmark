"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export default function LoginButton() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  return (
    <div className="flex items-center justify-center min-h-[75vh] w-full">
      <Card className="bg-background/80 backdrop-blur-xl shadow-2xl w-full max-w-xl">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-3xl font-semibold leading-tight">Welcome to Smart Bookmark</CardTitle>

          <CardDescription className="text-base">Sign in to continue to your account.</CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-center">
          <Button
            onClick={handleLogin}
            className="w-full max-w-xs flex items-center justify-center gap-3"
            variant="outline"
          >
            <Image src="/google.png" alt="Google" width={18} height={18} />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
