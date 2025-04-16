import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { z } from 'zod'
import { customAlphabet } from 'nanoid'
import { query } from '$lib/server/db'
import bcrypt from 'bcryptjs'

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const alphabetnums = `${alphabet}0123456789`
const get_random_id = customAlphabet(alphabet, 6)
const get_random_pw = customAlphabet(alphabetnums, 16)

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const url = form_data.get('url') as string | null

		const is_valid_url = z.string().url().safeParse(url).success

		if (!is_valid_url) {
			return fail(400, { url, error: 'URL is not valid' })
		}

		const id = get_random_id()
		const password = get_random_pw()
		const password_hash = await bcrypt.hash(password, 10)

		const sql = `
        INSERT INTO
            shortcuts (id, url, password_hash)
        VALUES
            (:id, :url, :password_hash)
        `

		const { success } = await query(sql, { id, url, password_hash })

		if (!success) {
			return fail(500, { url, error: 'Failed to create shortcut' })
		}

		const short_url = `${event.url.origin}/${id}`
		const short_url_admin = `${event.url.origin}/${id}/admin`

		return { id, url, short_url, short_url_admin, password }
	}
}
