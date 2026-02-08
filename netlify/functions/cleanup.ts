import { type Client, createClient } from '@libsql/client/web'
import type { Config } from '@netlify/functions'

export const config: Config = {
	schedule: '@monthly'
}

export default async () => {
	if (!process.env.DB_URL) {
		console.error('Missing DB_URL')
		return
	}

	if (!process.env.DB_AUTH_TOKEN) {
		console.error('Missing DB_AUTH_TOKEN')
		return
	}

	const db = createClient({
		authToken: process.env.DB_AUTH_TOKEN,
		url: process.env.DB_URL
	})

	try {
		await remove_expired_shortcuts(db)
		await remove_inactive_shortcuts(db)
	} catch (err) {
		console.error(err)
	}
}

async function remove_inactive_shortcuts(db: Client) {
	const sql = `
        DELETE FROM shortcuts AS s
        WHERE s.created_at <= datetime('now', '-1 year')
        AND NOT EXISTS (
            SELECT 1
            FROM visits v
            WHERE v.shortcut_id = s.id
            AND v.date > datetime('now', '-1 year')
        )`

	const res = await db.execute(sql)
	console.info(`Deleted ${res.rowsAffected} inactive shortcuts`)
}

async function remove_expired_shortcuts(db: Client) {
	const sql = `
    	DELETE FROM shortcuts
		WHERE expires_at IS NOT NULL
		AND expires_at <= CURRENT_TIMESTAMP`

	const res = await db.execute(sql)
	console.info(`Deleted ${res.rowsAffected} expired shortcuts`)
}
