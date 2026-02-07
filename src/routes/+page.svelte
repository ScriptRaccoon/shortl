<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import CopyBtn from '$lib/components/CopyBtn.svelte'

	let { form } = $props()

	let sending = $state(false)
</script>

<header>
	<h1>ShortL</h1>
</header>

{#if page.url.searchParams.get('code') === 'delete' && !form}
	<p class="accent">The short URL has been deleted.</p>
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

			<p class="accent">
				<code>{form?.short_url}</code>
			</p>

			<CopyBtn content={form?.short_url} label="Copy URL" />
		</section>

		<section>
			<h2>Analytics and more</h2>

			<p>
				To get analytics for the visits of the short URL and to delete the short
				URL when it is no longer needed, open
			</p>
			<p>
				<a class="accent" href={form.short_url_admin}>
					<code>{form.short_url_admin}</code>
				</a>
			</p>
			<p>and use the following password:</p>
			<p>
				<code class="password">{form.password}</code>
			</p>

			<CopyBtn content={form.password} label="Copy password" />

			<p>Please save this password since it will not be shown again.</p>
		</section>
	{/if}
</main>

<style>
	.password {
		font-weight: bold;
	}
</style>
