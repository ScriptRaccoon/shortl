<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'

	let { form } = $props()

	let copied = $state(false)

	async function copy_url() {
		if (!form?.short_url) return
		await navigator.clipboard.writeText(form.short_url)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}

	let sending = $state(false)
</script>

<header>
	<h1>ShortL</h1>
</header>

{#if page.url.searchParams.get('code') === 'delete' && !form}
	<p>The short URL has been deleted.</p>
{/if}

<main>
	<section>
		<h2>Create a short URL</h2>
		<form
			method="POST"
			use:enhance={() => {
				sending = true
				return async ({ update }) => {
					await update()
					sending = false
				}
			}}
		>
			<label for="url">URL</label>
			<input
				type="url"
				name="url"
				id="url"
				required
				value={form?.url ?? 'https://'}
				disabled={!!form?.id}
			/>
			{#if !form?.id}
				<button class="fullwidth" type="submit">Shorten</button>
			{/if}
		</form>

		{#if sending}
			<p>Please wait ...</p>
		{/if}

		{#if !sending && form?.error}
			<p class="error">{form.error}</p>
		{/if}
	</section>

	{#if form?.id}
		<section>
			<h2>Short URL has been generated</h2>

			<p class="short_url">
				<code>{form?.short_url}</code>
			</p>

			<button onclick={copy_url}>
				{#if copied}
					Copied URL!
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
				<a class="admin-link" href={form.short_url_admin}
					><code>{form.short_url_admin}</code></a
				>
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

	.short_url {
		color: var(--accent-color);
	}

	.admin-link {
		color: var(--link-color);
	}
</style>
