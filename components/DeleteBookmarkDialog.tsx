"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription
} from "@/components/ui/alert-dialog"
import { Bookmark } from "@/types/bookmark"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  bookmark: Bookmark | null
  onOptimisticRemove: (id: string) => void
}

export default function DeleteBookmarkDialog({ open, onClose, bookmark, onOptimisticRemove }: Props) {
  const supabase = createClient()

  const handleDelete = async () => {
    if (!bookmark) return

    onOptimisticRemove(bookmark.id)

    const { error } = await supabase.from("bookmarks").delete().eq("id", bookmark.id)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Bookmark deleted")
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Bookmark?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-medium"> &quot;{bookmark?.title}&quot;</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="border-2 border-primary text-primary bg-transparent cursor-pointer hover:bg-transparent"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
