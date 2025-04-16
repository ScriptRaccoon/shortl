<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'

	let { form } = $props()

	const code = page.url.searchParams.get('code')

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

{#if code === 'delete' && !form}
	<p>The Short URL has been deleted.</p>
{/if}

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
			{#if !form?.id}
				<button class="fullwidth" type="submit">Shorten</button>
			{/if}
		</form>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}
	</section>

	{#if form?.id}
		<section>
			<h2>Short URL has been generated</h2>

			<p class="accent">
				<code>{form?.short_url}</code>
			</p>

			<button onclick={copy_url}>
				{#if copied}
					Copied!
				{:else}
					Copy URL
				{/if}
			</button>
		</section>

		<section>
			<h2>Analytics and more</h2>

			<p>
				To get analytics for the visits of the short URL and to delete the short
				URL when it is no longer needed, open
			</p>
			<p>
				<a href={form.short_url_admin}><code>{form.short_url_admin}</code></a>
			</p>
			<p>and use the following password:</p>
			<p>
				<code class="password">{form.password}</code>
			</p>
			<p>Please save this password since it will not be shown again.</p>
		</section>
	{/if}
</main>

<style>
	.password {
		font-weight: bold;
	}
</style>
