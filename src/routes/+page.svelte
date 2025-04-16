<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()

	let copied = $state(false)

	async function copy_url() {
		if (!form?.short_url) return
		await navigator.clipboard.writeText(form?.short_url)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}
</script>

<svelte:head>
	<title>ShortL - URL Shortener</title>
	<meta
		name="description"
		content="ShortL is a simple URL shortener that allows you to create short links for your long URLs."
	/>
</svelte:head>

<header>
	<h1>ShortL</h1>
</header>

<main>
	<section>
		<h2>Create a Short URL</h2>
		<form method="POST" use:enhance>
			<label for="url">URL</label>
			<input
				type="text"
				name="url"
				id="url"
				placeholder="https://..."
				required
				value={form?.url}
				disabled={!!form?.id}
			/>
			<button type="submit" disabled={!!form?.id}>Shorten</button>
		</form>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}
	</section>

	{#if form?.id}
		<section>
			<h2>Short URL has been generated</h2>

			<p><code>{form?.short_url}</code></p>

			<button onclick={copy_url}>
				{#if copied}
					Copied!
				{:else}
					Copy URL
				{/if}
			</button>

			<p>To maintain the short URL and in particular get analytics for the visits, open</p>
			<p>
				<a href={form.short_url_admin}><code>{form.short_url_admin}</code></a>
			</p>
			<p>and use the following password:</p>
			<p>
				<code>{form.password}</code>
			</p>
			<p>Please save this password since it will not be shown again.</p>
		</section>
	{/if}
</main>
