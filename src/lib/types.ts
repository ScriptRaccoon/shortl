export type ShortCut = {
	id: string
	url: string
	short_url: string
	created_at: string
	password: string
	visits: { date: string; referer: string }[]
}
