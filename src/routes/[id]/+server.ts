import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

import { query } from '$lib/server/db'

export const GET: RequestHandler = async (event) => {
	const id = event.params.id
	const referer = event.request.headers.get('referer') || 'direct'
	const country = event.request.headers.get('x-country')

	const sql_url = `
		SELECT url
		FROM shortcuts
		WHERE id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`

	const { err, rows } = await query<{ url: string }>(sql_url, [id])

	if (err) error(500, 'Database error')

	if (!rows.length) error(404, 'Not Found')

	const { url } = rows[0]

	const sql_visit = `
		INSERT INTO visits (shortcut_id, referer, country)
		VALUES (?, ?, ?)`

	await query(sql_visit, [id, referer, country])

	redirect(303, url)
}
