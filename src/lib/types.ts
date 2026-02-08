export type ShortCut = {
	id: string
	url: string
	short_url: string
	expires_at: string | null
	created_at: string
	visits: { date: string; referer: string; country: string | null }[]
}
