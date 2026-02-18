import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LoginButton from "../../components/LoginButton"
import ClosingPlasma from "@/components/ui/closing-plasma"

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-4.1rem)] overflow-hidden">
      {/* Background Plasma */}
      <div className="absolute inset-0 -z-10">
        <ClosingPlasma speed={1} />
      </div>

      {/* Centered Login Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <LoginButton />
      </div>
    </div>
  )
}
