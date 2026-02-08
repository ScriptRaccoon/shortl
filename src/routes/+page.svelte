<script lang="ts">
	import { page } from '$app/state'
	import CopyBtn from '$lib/components/CopyBtn.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'

	let { form } = $props()
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

		<FormWrapper error={form?.error}>
			{#snippet children(sending)}
				<div class="form-group">
					<label for="url">URL</label>
					<input
						type="url"
						name="url"
						id="url"
						required
						value={form?.url ?? 'https://'}
						disabled={!!form?.id}
					/>
				</div>

				<details>
					<summary>More settings</summary>

					<div class="form-group">
						<label for="expires_at">Expiration Date (optional)</label>
						<input
							type="date"
							name="expires_at"
							id="expires_at"
							value={form?.expires_at ?? ''}
							disabled={!!form?.id}
						/>
					</div>
				</details>

				{#if !form?.id}
					<button type="submit" disabled={sending}>Shorten</button>
				{/if}
			{/snippet}
		</FormWrapper>
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
				To view analytics for visits to the short URL and to delete the short URL
				when it is no longer needed, open:
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

			<p>Please save this password, as it will not be shown again.</p>
		</section>
	{/if}
</main>

<style>
	.password {
		font-weight: bold;
	}

	code {
		word-break: break-all;
	}

	details[open] summary {
		margin-bottom: 0.5rem;
	}

	details {
		margin-bottom: 1.5rem;
	}
</style>
