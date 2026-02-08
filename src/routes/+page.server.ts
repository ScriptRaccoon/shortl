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
	.url({ message: 'URL is invalid' })
	.max(1000, { message: 'URL can be at most 1000 characters long' })

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const url = form.get('url') as string

		const parsed_url = url_schema.safeParse(url)
		if (!parsed_url.success) {
			return fail(400, { url, error: parsed_url.error.issues[0].message })
		}

		const sql_banned = `
			SELECT 1 FROM banned_domains
			WHERE ? like '%' || domain || '%'
			LIMIT 1`

		const { rows, err: err_banned } = await query(sql_banned, [url])

		if (err_banned) return fail(500, { url, error: 'Database error' })

		if (rows.length) return fail(403, { url, error: 'URL is not allowed' })

		const id = generate_id()
		const password = generate_password()
		const password_hash = await bcrypt.hash(password, 10)

		const sql = `
			INSERT INTO shortcuts (id, url, password_hash)
			VALUES (?,?,?)`

		const { err } = await query(sql, [id, url, password_hash])

		if (err) return fail(500, { url, error: 'Database error' })

		const short_url = `${event.url.origin}/${id}`
		const short_url_admin = `${event.url.origin}/${id}/admin`

		return { id, url, short_url, short_url_admin, password }
	}
}
