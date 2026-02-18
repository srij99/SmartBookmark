import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Bookmark } from "@/types/bookmark"
import BookmarkApp from "@/components/BookmarkApp"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data } = await supabase.from("bookmarks").select("*").order("created_at", { ascending: false }).limit(20)

  return (
    <div className="px-6 max-w-4xl mx-auto">
      <BookmarkApp initialBookmarks={(data ?? []) as Bookmark[]} userId={session.user.id} />
    </div>
  )
}
