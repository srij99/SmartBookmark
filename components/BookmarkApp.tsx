"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bookmark } from "@/types/bookmark"
import { Button } from "@/components/ui/button"
import BookmarkModal from "./BookmarkModal"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import DeleteBookmarkDialog from "./DeleteBookmarkDialog"
import { Bookmark as BookmarkIcon } from "lucide-react"

type Props = {
  initialBookmarks: Bookmark[]
  userId: string
}

export default function BookmarkApp({ initialBookmarks, userId }: Props) {
  const supabase = createClient()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editBookmark, setEditBookmark] = useState<Bookmark | null>(null)
  const [createKey, setCreateKey] = useState(0)

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [hasMore, setHasMore] = useState(initialBookmarks.length === 20)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Infinite Scroll
  useEffect(() => {
    if (!hasMore) return

    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]
        if (!entry.isIntersecting || loadingMore) return

        setLoadingMore(true)

        const last = bookmarks[bookmarks.length - 1]
        if (!last) {
          setLoadingMore(false)
          return
        }

        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .or(`created_at.lt.${last.created_at},and(created_at.eq.${last.created_at},id.lt.${last.id})`)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .limit(20)

        if (!error && data && data.length > 0) {
          setBookmarks((prev) => {
            const existingIds = new Set(prev.map((b) => b.id))
            const filtered = data.filter((b) => !existingIds.has(b.id))
            return [...prev, ...filtered]
          })

          if (data.length < 20) setHasMore(false)
        } else {
          setHasMore(false)
        }

        setLoadingMore(false)
      },
      { threshold: 0.5 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [hasMore, loadingMore]) // ← IMPORTANT: remove bookmarks from deps

  // Realtime Subscription
  useEffect(() => {
    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => {
              const exists = prev.some((b) => b.id === payload.new.id)
              if (exists) return prev
              return [payload.new as Bookmark, ...prev]
            })
          }

          if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          }

          if (payload.eventType === "UPDATE") {
            setBookmarks((prev) => prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b)))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button
          variant={"outline"}
          className="cursor-pointer mt-3 border-2 text-primary !border-primary "
          onClick={() => {
            setEditBookmark(null)
            setCreateKey((prev) => prev + 1)
            setModalOpen(true)
          }}
        >
          Add Bookmark
        </Button>
      </div>

      {bookmarks.length === 0 && !loadingMore ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 rounded-full bg-muted">
            <BookmarkIcon className="h-8 w-8 text-muted-foreground" />
          </div>

          <div>
            <p className="text-lg font-medium">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground">Start by adding your first bookmark.</p>
          </div>
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center justify-between p-4 border border-border rounded-md bg-muted/30"
          >
            <div className="font-medium truncate max-w-[60%]">{bookmark.title}</div>

            <div className="flex items-center gap-5">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <ExternalLink size={18} />
              </a>

              <button
                onClick={() => {
                  setEditBookmark(bookmark)
                  setModalOpen(true)
                }}
                className="text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => {
                  setBookmarkToDelete(bookmark)
                  setDeleteOpen(true)
                }}
                className="text-destructive hover:opacity-80 transition cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}

      {loadingMore && <div className="text-center text-zinc-400">Loading...</div>}

      {hasMore && <div ref={loadMoreRef} className="h-10" />}

      <BookmarkModal
        key={editBookmark ? editBookmark.id : `create-${createKey}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={userId}
        mode={editBookmark ? "edit" : "create"}
        bookmark={editBookmark}
      />

      <DeleteBookmarkDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        bookmark={bookmarkToDelete}
        onOptimisticRemove={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
      />
    </div>
  )
}
