import { z } from "zod"

export const bookmarkSchema = z.object({
  title: z.string().min(1, "Title is required").max(40, "Title must be at most 40 characters"),
  url: z.string().min(1, "URL is required").url("Must be a valid URL")
})

export type BookmarkInput = z.infer<typeof bookmarkSchema>
