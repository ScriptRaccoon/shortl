import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { z } from 'zod'
import { customAlphabet } from 'nanoid'
import { is_constraint_error, query } from '$lib/server/db'
import bcrypt from 'bcryptjs'
import { date_schema, id_schema, url_schema } from '$lib/server/schemas'

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const alphabetnums = `${alphabet}0123456789`

const generate_id = customAlphabet(alphabet, 6)
const generate_password = customAlphabet(alphabetnums, 16)

export const actions: Actions = {
	default: async (event) => {
		const form = await event.request.formData()
		const url = form.get('url') as string
		const expires_at = (form.get('expires_at') as string) || null
		const id = (form.get('id') as string) || generate_id()

		const inputs = { url, expires_at, id }

		const parsed_url = url_schema.safeParse(url)
		if (!parsed_url.success) {
			return fail(400, {
				success: false,
				...inputs,
				error: parsed_url.error.issues[0].message
			})
		}

		const parsed_expires_at = date_schema.safeParse(expires_at)
		if (!parsed_expires_at.success) {
			return fail(400, {
				success: false,
				...inputs,
				error: parsed_expires_at.error.issues[0].message
			})
		}

		const parsed_id = id_schema.safeParse(id)
		if (!parsed_id.success) {
			return fail(400, {
				success: false,
				...inputs,
				error: parsed_id.error.issues[0].message
			})
		}

		const sql_banned = `
			SELECT 1 FROM banned_domains
			WHERE ? like '%' || domain || '%'
			LIMIT 1`

		const { rows, err: err_banned } = await query(sql_banned, [url])

		if (err_banned) {
			return fail(500, {
				success: false,
				...inputs,
				error: 'Database error'
			})
		}

		if (rows.length) {
			return fail(403, {
				success: false,
				...inputs,
				error: 'URL is not allowed'
			})
		}

		const password = generate_password()
		const password_hash = await bcrypt.hash(password, 10)

		const sql = `
			INSERT INTO shortcuts (id, url, password_hash, expires_at)
			VALUES (?, ?, ?, ? || ' 00:00:00')`

		const { err } = await query(sql, [id, url, password_hash, expires_at])

		if (err) {
			if (is_constraint_error(err)) {
				return fail(409, {
					success: false,
					...inputs,
					error: 'ID already exists'
				})
			}
			return fail(500, {
				success: false,
				...inputs,
				error: 'Database error'
			})
		}

		const short_url = `${event.url.origin}/${id}`
		const short_url_admin = `${event.url.origin}/${id}/admin`

		return {
			success: true,
			...inputs,
			short_url,
			short_url_admin,
			password
		}
	}
}
