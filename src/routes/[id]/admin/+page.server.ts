import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { query } from '$lib/server/db'
import bcrypt from 'bcryptjs'

async function get_shortcut(id: string, password: string) {
	if (!password) return { status: 400, error: 'Password is required' }

	const sql = `
		SELECT url, created_at, password_hash
		FROM shortcuts
		WHERE id = ?`

	const { err, rows: shortcuts } = await query<{
		url: string
		created_at: string
		password_hash: string
	}>(sql, [id])

	if (err) return { status: 500, error: 'Database error' }
	if (!shortcuts.length) return { status: 404, error: 'Short URL not found' }

	const { url, created_at, password_hash } = shortcuts[0]

	const password_is_correct = await bcrypt.compare(password, password_hash)
	if (!password_is_correct) return { status: 401, error: 'Incorrect password' }

	return { status: 200, id, url, created_at }
}

export const actions: Actions = {
	login: async (event) => {
		const form_data = await event.request.formData()
		const password = form_data.get('password') as string
		const id = event.params.id

		const shortcut = await get_shortcut(id, password)

		if ('error' in shortcut) {
			return fail(shortcut.status, { error: shortcut.error })
		}

		const { url, created_at } = shortcut

		const sql = `
        	SELECT date, referer
    		FROM visits
			WHERE shortcut_id = ?
        	ORDER BY date DESC`

		const { err, rows: visits } = await query<{
			date: string
			referer: string
		}>(sql, [id])

		if (err) return fail(500, { error: 'Database error' })

		return { success: true, id, url, created_at, visits, password }
	},

	delete: async (event) => {
		const form_data = await event.request.formData()
		const password = form_data.get('password') as string
		const id = event.params.id

		const shortcut = await get_shortcut(event.params.id, password)

		if ('error' in shortcut) {
			return fail(shortcut.status, { error: shortcut.error })
		}

		const sql = 'DELETE FROM shortcuts WHERE id = ?'

		const { err } = await query(sql, [id])

		if (err) return fail(500, { error: 'Database error' })

		redirect(303, '/?code=delete')
	}
}
