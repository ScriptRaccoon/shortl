export type ShortCut = {
	id: string
	url: string
	short_url: string
	created_at: string
	visits: { date: string; referer: string; country: string | null }[]
}
