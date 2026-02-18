import { createClient } from "@/lib/supabase/server"
import UserMenu from "./UserMenu"
import { HyperText } from "./ui/hyper-text"

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const user = session?.user

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="h-16 max-w-4xl mx-auto px-6 flex items-center justify-between">
        {/* <h1 className="font-semibold text-lg">Smart Bookmark</h1> */}
        <HyperText text={"Smart Bookmark"} />

        {user && <UserMenu user={user} />}
      </div>
    </header>
  )
}
