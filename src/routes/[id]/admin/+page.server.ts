import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { query } from '$lib/server/db'
import bcrypt from 'bcryptjs'
import type { ShortCut } from '$lib/types'

export const actions: Actions = {
	login: async (event) => {
		const form_data = await event.request.formData()
		const password = form_data.get('password') as string
		const id = event.params.id

		if (!password) return fail(400, { error: 'Password is required' })

		const sql_shortcut = `
			SELECT url, created_at, password_hash
			FROM shortcuts
			WHERE id = ?`

		const { rows: shortcuts, err: err_shortcut } = await query<{
			url: string
			created_at: string
			password_hash: string
		}>(sql_shortcut, [id])

		if (err_shortcut) return fail(500, { error: 'Database error' })
		if (!shortcuts.length) return fail(401, { error: 'Invalid credentials' })

		const { url, created_at, password_hash } = shortcuts[0]

		const password_is_correct = await bcrypt.compare(password, password_hash)
		if (!password_is_correct) return fail(401, { error: 'Invalid credentials' })

		const sql_visits = `
        	SELECT date, referer, country
    		FROM visits
			WHERE shortcut_id = ?
        	ORDER BY date DESC`

		const { err, rows: visits } = await query<{
			date: string
			referer: string
			country: string | null
		}>(sql_visits, [id])

		if (err) return fail(500, { error: 'Database error' })

		const short_url = `${event.url.origin}/${id}`

		const shortcut: ShortCut = { id, url, short_url, created_at, visits }

		return { shortcut }
	},

	delete: async (event) => {
		const form_data = await event.request.formData()
		const password = form_data.get('password') as string
		const id = event.params.id

		const sql_pw = 'SELECT password_hash FROM shortcuts WHERE id = ?'
		const { rows, err: err_pw } = await query<{ password_hash: string }>(sql_pw, [id])

		if (err_pw || !rows.length) return fail(500, { error: 'Database error' })

		const { password_hash } = rows[0]

		const password_is_correct = await bcrypt.compare(password, password_hash)
		if (!password_is_correct) return fail(401, { error: 'Incorrect password' })

		const sql_delete = 'DELETE FROM shortcuts WHERE id = ?'

		const { err } = await query(sql_delete, [id])

		if (err) return fail(500, { error: 'Database error' })

		redirect(303, '/?code=delete')
	}
}
