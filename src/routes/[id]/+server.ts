import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

import { query } from '$lib/server/db'

export const GET: RequestHandler = async (event) => {
	const id = event.params.id

	console.info('VISIT:', id)
	console.info('HEADERS:')
	console.info(event.request.headers)

	const sql = 'SELECT url FROM shortcuts WHERE id = ?'

	const { err, rows } = await query<{ url: string }>(sql, [id])

	if (err) error(500, 'Database error')

	if (!rows.length) error(404, 'Short URL not found')

	const { url } = rows[0]

	save_visit(id, event.request.headers)

	redirect(303, url)
}

async function save_visit(id: string, headers: Headers) {
	const referer = headers.get('referer') || 'direct'
	const country = headers.get('x-country')

	const sql = `
		INSERT INTO visits (shortcut_id, referer, country)
		VALUES (?, ?, ?)`
	await query(sql, [id, referer, country])
}
