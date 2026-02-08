import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { z } from 'zod'
import { customAlphabet } from 'nanoid'
import { query } from '$lib/server/db'
import bcrypt from 'bcryptjs'

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const alphabetnums = `${alphabet}0123456789`

const generate_id = customAlphabet(alphabet, 6)
const generate_password = customAlphabet(alphabetnums, 16)

const url_schema = z
	.string({
		invalid_type_error: 'URL must be a string',
		required_error: 'URL is required'
	})
	.regex(/^https?:\/\//, { message: 'URL must start with http:// or https://' })
	.url({ message: 'URL is invalid' })
	.max(1000, { message: 'URL must be at most 1000 characters long' })

const date_schema = z
	.string({ message: 'Date must be a string' })
	.regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must have the format YYYY-MM-DD' })
	.refine((s) => new Date(s).getTime() > Date.now(), {
		message: 'Date must be in the future'
	})
	.nullable()

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const url = form.get('url') as string
		const expires_at = (form.get('expires_at') as string) || null

		const parsed_url = url_schema.safeParse(url)
		if (!parsed_url.success) {
			return fail(400, {
				url,
				expires_at,
				error: parsed_url.error.issues[0].message
			})
		}

		const parsed_expires_at = date_schema.safeParse(expires_at)
		if (!parsed_expires_at.success) {
			return fail(400, {
				url,
				expires_at,
				error: parsed_expires_at.error.issues[0].message
			})
		}

		const sql_banned = `
			SELECT 1 FROM banned_domains
			WHERE ? like '%' || domain || '%'
			LIMIT 1`

		const { rows, err: err_banned } = await query(sql_banned, [url])

		if (err_banned) {
			return fail(500, { url, expires_at, error: 'Database error' })
		}

		if (rows.length) {
			return fail(403, { url, expires_at, error: 'URL is not allowed' })
		}

		const id = generate_id()
		const password = generate_password()
		const password_hash = await bcrypt.hash(password, 10)

		const sql = `
			INSERT INTO shortcuts (id, url, password_hash, expires_at)
			VALUES (?, ?, ?, ? || ' 00:00:00')`

		const { err } = await query(sql, [id, url, password_hash, expires_at])

		if (err) return fail(500, { url, expires_at, error: 'Database error' })

		const short_url = `${event.url.origin}/${id}`
		const short_url_admin = `${event.url.origin}/${id}/admin`

		return { id, url, expires_at, short_url, short_url_admin, password }
	}
}
