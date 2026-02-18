"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { bookmarkSchema } from "@/lib/validation"
import { Bookmark } from "@/types/bookmark"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  userId: string
  mode: "create" | "edit"
  bookmark?: Bookmark | null
}

export default function BookmarkModal({ open, onClose, userId, mode, bookmark }: Props) {
  const supabase = createClient()

  const [title, setTitle] = useState(() => (mode === "edit" && bookmark ? bookmark.title : ""))

  const [url, setUrl] = useState(() => (mode === "edit" && bookmark ? bookmark.url : ""))

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const initializeState = () => {
    if (mode === "edit" && bookmark) {
      setTitle(bookmark.title)
      setUrl(bookmark.url)
    } else {
      setTitle("")
      setUrl("")
    }
  }

  const handleSubmit = async () => {
    setError(null)

    const validation = bookmarkSchema.safeParse({ title, url })

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Invalid input")
      return
    }

    setLoading(true)

    if (mode === "create") {
      const { error: insertError } = await supabase.from("bookmarks").insert({
        title,
        url,
        user_id: userId
      })

      if (insertError) {
        toast.error(insertError.message)
        setLoading(false)
        return
      }

      toast.success("Bookmark added")
    }

    if (mode === "edit" && bookmark) {
      const { error: updateError } = await supabase.from("bookmarks").update({ title, url }).eq("id", bookmark.id)

      if (updateError) {
        toast.error(updateError.message)
        setLoading(false)
        return
      }

      toast.success("Bookmark updated")
    }

    setLoading(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value) {
          initializeState()
        }
        onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Bookmark" : "Edit Bookmark"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2">Title</Label>
            <Input value={title} maxLength={20} onChange={(e) => setTitle(e.target.value)} />
            <div className="text-xs text-muted-foreground text-right mt-1">{title.length}/40</div>
          </div>

          <div>
            <Label className="mb-2">URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end">
            <Button
              variant={"outline"}
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer border-2 text-primary !border-primary"
            >
              {loading ? "Saving..." : mode === "create" ? "Add Bookmark" : "Update Bookmark"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
