import { z } from 'zod'

export const url_schema = z
	.url({ error: 'URL must be a string' })
	.regex(/^https?:\/\//, { error: 'URL must start with http:// or https://' })
	.max(1000, { error: 'URL must be at most 1000 characters long' })

export const date_schema = z
	.string({ error: 'Date must be a string' })
	.regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'Date must have the format YYYY-MM-DD' })
	.refine((s) => new Date(s).getTime() > Date.now(), {
		error: 'Date must be in the future'
	})
	.nullable()

export const id_schema = z
	.string({ error: 'ID must be a string' })
	.min(6, { error: 'ID must be at least 6 characters long' })
	.max(20, { error: 'ID must be at most 20 characters long' })
	.regex(/^[A-Za-z]+$/, { error: 'ID must consist of letters only' })
