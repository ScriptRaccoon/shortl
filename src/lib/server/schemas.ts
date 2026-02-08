import { z } from 'zod'

export const url_schema = z
	.string({
		invalid_type_error: 'URL must be a string',
		required_error: 'URL is required'
	})
	.regex(/^https?:\/\//, { message: 'URL must start with http:// or https://' })
	.url({ message: 'URL is invalid' })
	.max(1000, { message: 'URL must be at most 1000 characters long' })

export const date_schema = z
	.string({ message: 'Date must be a string' })
	.regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must have the format YYYY-MM-DD' })
	.refine((s) => new Date(s).getTime() > Date.now(), {
		message: 'Date must be in the future'
	})
	.nullable()

export const id_schema = z
	.string({ message: 'ID must be a string' })
	.min(6, { message: 'ID must be at least 6 characters long' })
	.max(20, { message: 'ID must be at most 20 characters long' })
	.regex(/^[A-Za-z]+$/, { message: 'ID must consist of letters only' })
