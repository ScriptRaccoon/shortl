import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

import { query } from '$lib/server/db'

export const GET: RequestHandler = async (event) => {
	const id = event.params.id

	const sql = `
	SELECT
		url
	FROM
		shortcuts
	WHERE
		id = :id
	`

	const { success, rows } = await query<{ url: string }>(sql, { id })

	if (!success) {
		error(500, 'Database error')
	}

	if (!rows.length) {
		return error(404, 'Short URL not found')
	}

	const url = rows[0].url

	const referer = event.request.headers.get('referer') || 'direct'

	save_visit({ id, referer })

	redirect(303, url)
}

async function save_visit(options: { id: string; referer: string }) {
	const { id, referer } = options

	const sql = `
	INSERT INTO
		visits (shortcut_id,  referer)
	VALUES
		(:id, :referer)
	`

	await query(sql, { id, referer })
}
