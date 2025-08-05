import { R2 } from "@convex-dev/r2";
import { httpAction, mutation, query } from "./_generated/server";
import { api, components } from "./_generated/api";
import { MAX_FILE_SIZE, isSupportedFile, estimateTokenCount, MAX_TOKENS_PER_FILE, getFileTypeInfo, getCorrectMimeType } from "./lib/file_constants";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import supermemory from "./lib/supermemory";

export const r2 = new R2(components.r2);

export const listFiles = query({
    args: {
        businessId: v.id("businesses"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("files").withIndex("by_business", (q) => q.eq("businessId", args.businessId)).collect()
    }
})

export const deleteFile = mutation({
    args: {
        fileId: v.id("files")
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.fileId)
    }
})

export const uploadFile = httpAction(async (ctx, request) => {
    try {
        const user = await ctx.auth.getUserIdentity()
        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            })
        }
        const formData = await request.formData()
        const file = formData.get("file") as Blob
        const businessId = formData.get("businessId") as string
        const fileName = formData.get("fileName") as string

        if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            })
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return new Response(
                JSON.stringify({
                    error: `File size exceeds 5MB limit. Current size: ${file.size} bytes`
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            )
        }

        // Validate file type
        if (!isSupportedFile(fileName, file.type)) {
            return new Response(
                JSON.stringify({
                    error: `Unsupported file type: ${fileName}`
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            )
        }

        const fileTypeInfo = getFileTypeInfo(fileName, file.type)

        // Get arrayBuffer once for validation (for text files and PDFs)
        const fileBuffer = await file.arrayBuffer()
        // const bufferCopy = new ArrayBuffer(fileBuffer.byteLength)
        // new Uint8Array(bufferCopy).set(new Uint8Array(fileBuffer))

        // For text files, validate token count
        if (fileTypeInfo.isText && !fileTypeInfo.isImage) {
            try {
                const text = new TextDecoder().decode(fileBuffer)
                const tokenCount = estimateTokenCount(text)

                if (tokenCount > MAX_TOKENS_PER_FILE) {
                    return new Response(
                        JSON.stringify({
                            error: `File "${fileName}" exceeds ${MAX_TOKENS_PER_FILE.toLocaleString()} token limit (estimated: ${tokenCount.toLocaleString()} tokens)`
                        }),
                        {
                            status: 400,
                            headers: { "Content-Type": "application/json" }
                        }
                    )
                }
            } catch (error) {
                console.error("Error validating text file:", error)
                return new Response(
                    JSON.stringify({
                        error: `Error validating file content: ${fileName}`
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    }
                )
            }
        } else if (fileTypeInfo.isPdf) {
            // Some issue with the convex runtime. Might come back to this later but...
            // try {
            //     // Check page count
            //     console.log("Estimating PDF...")
            //     const { pageCount, tokenCount } = await estimatePdf(fileBuffer)
            //     console.log("PDF estimated", pageCount, tokenCount)
            //     if (pageCount > MAX_PDF_PAGES) {
            //         return new Response(
            //             JSON.stringify({
            //                 error: `PDF "${fileName}" exceeds ${MAX_PDF_PAGES} page limit (current: ${pageCount} pages)`
            //             }),
            //             {
            //                 status: 400,
            //                 headers: { "Content-Type": "application/json" }
            //             }
            //         )
            //     }
            //     // Check token count
            //     if (tokenCount > MAX_PDF_TOKENS) {
            //         return new Response(
            //             JSON.stringify({
            //                 error: `PDF "${fileName}" exceeds ${MAX_PDF_TOKENS.toLocaleString()} token limit (estimated: ${tokenCount.toLocaleString()} tokens)`
            //             }),
            //             {
            //                 status: 400,
            //                 headers: { "Content-Type": "application/json" }
            //             }
            //         )
            //     }
            // } catch (error) {
            //     console.error("Error validating PDF file:", error)
            //     return new Response(
            //         JSON.stringify({
            //             error: `Error validating PDF content: ${fileName}`
            //         }),
            //         {
            //             status: 400,
            //             headers: { "Content-Type": "application/json" }
            //         }
            //     )
            // }
        }

        // Generate unique key for the file
        const key = `attachments/${businessId}/${Date.now()}-${crypto.randomUUID()}-${fileName}`

        // Get the correct MIME type (handles browser inconsistencies)
        const mimeType = getCorrectMimeType(fileName, file.type)

        // Store file directly in R2
        const storedKey = await r2.store(ctx, new Uint8Array(fileBuffer), {
            key,
            type: mimeType,
        })

        // get presigned url for file
        const presignedUrl = await r2.getUrl(key)

        // Store file in Supermemory 
        const res = await supermemory.memories.add({
            content: presignedUrl,
            metadata: {
                fileName: fileName,
                fileType: mimeType,
            },
            containerTags: [businessId],
        })

        if (res.status === "error") {
            console.error("Error storing file in Supermemory:", res.status)
            return new Response(
                JSON.stringify({
                    error: `Failed to store file in Supermemory: ${res.status}`
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                }
            )
        }

        // Store file metadata in convex
        const fileMetadata = {
            key: storedKey,
            fileName,
            fileType: mimeType,
            fileSize: file.size,
            uploadedAt: Date.now(),
            businessId: businessId as Id<"businesses">,
            clerkUserId: user.subject,
            supermemoryId: res.id,
        }

        await ctx.runMutation(api.files.createFile, fileMetadata)

        return new Response(
            JSON.stringify({
                key: storedKey,
                fileName: fileName,
                fileType: mimeType,
                fileSize: file.size,
                uploadedAt: Date.now(),
                success: true
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        )
    } catch (error) {
        console.error("Error uploading file:", error)
        return new Response(
            JSON.stringify({
                error: `Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        )
    }
})

export const getFile = httpAction(async (ctx, req) => {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get("key")
    if (!key) return new Response(null, { status: 400 })
    const file = await r2.getUrl(key)
    return Response.redirect(file)
})

export const createFile = mutation({
    args: {
        key: v.string(),
        fileName: v.string(),
        fileType: v.string(),
        fileSize: v.number(),
        uploadedAt: v.number(),
        businessId: v.id("businesses"), 
        clerkUserId: v.string(),
        supermemoryId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("files", args)
    }
})