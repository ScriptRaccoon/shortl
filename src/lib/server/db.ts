import { DB_AUTH_TOKEN, DB_URL } from '$env/static/private'
import { createClient, type LibsqlError } from '@libsql/client'

const db = createClient({
	url: DB_URL,
	authToken: DB_AUTH_TOKEN
})

/**
 * Small wrapper around the `db.execute` function from `@libsql/client` to handle errors.
 */
export async function query<T = any>(sql: string, args?: Record<string, any>) {
	try {
		const { rows } = args ? await db.execute(sql, args) : await db.execute(sql)
		return { rows: rows as T[], err: null }
	} catch (err) {
		const libsql_error = err as LibsqlError
		console.error(libsql_error.message)
		return { rows: null, err: libsql_error }
	}
}

export function is_constraint_error(err: LibsqlError) {
	return err.code.startsWith('SQLITE_CONSTRAINT')
}

/**
 * Utility to simulate delay for db operations
 */
export const sleep = (delay: number) => new Promise<void>((res) => setTimeout(res, delay))
