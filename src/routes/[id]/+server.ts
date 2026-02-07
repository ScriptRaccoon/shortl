import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

import { query } from '$lib/server/db'

export const GET: RequestHandler = async (event) => {
	const id = event.params.id

	const sql = 'SELECT url FROM shortcuts WHERE id = ?'

	const { err, rows } = await query<{ url: string }>(sql, [id])

	if (err) error(500, 'Database error')

	if (!rows.length) error(404, 'Short URL not found')

	const { url } = rows[0]

	const referer = event.request.headers.get('referer') || 'direct'

	save_visit(id, referer)

	redirect(303, url)
}

async function save_visit(id: string, referer: string) {
	const sql = 'INSERT INTO visits (shortcut_id, referer) VALUES (?, ?)'
	await query(sql, [id, referer])
}
