<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import type { ShortCut } from '$lib/types'

	let { form } = $props()

	let deletion_confirmed = $state(false)

	let shortcut = $state<null | ShortCut>(null)

	$effect(() => {
		if (form?.shortcut) shortcut = form.shortcut
	})
</script>

<header>
	<h1>ShortL Admin Page</h1>
</header>

<main>
	{#if !shortcut}
		<section>
			<h2>Login</h2>

			<FormWrapper error={form?.error} action="?/login">
				{#snippet children(sending)}
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" name="password" id="password" required />
					</div>
					<button type="submit" disabled={sending}>Login</button>
				{/snippet}
			</FormWrapper>
		</section>
	{:else}
		<section>
			<h2>Details</h2>

			<ul>
				<li>
					ID: <span class="value">{shortcut.id}</span>
				</li>
				<li>
					URL: <span class="value">{shortcut.url}</span>
				</li>
				<li>
					Short URL: <span class="value">{shortcut.short_url}</span>
				</li>
				<li>
					Created at: <span class="value">
						{new Date(shortcut.created_at).toLocaleString()}
					</span>
				</li>
				{#if shortcut.expires_at}
					<li>
						Expires at: <span class="value">
							{new Date(shortcut.expires_at).toLocaleDateString()}
						</span>
					</li>
				{/if}
				<li>
					Number of visits: <span class="value">{shortcut.visits.length}</span>
				</li>
			</ul>
		</section>

		<section>
			<h2>Visits</h2>

			{#if !shortcut.visits.length}
				<p>No visits so far</p>
			{:else}
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Date</th>
							<th>Referer</th>
							<th>Country</th>
						</tr>
					</thead>
					<tbody>
						{#each shortcut.visits as visit, i}
							<tr>
								<td>{shortcut.visits.length - i}</td>
								<td>{new Date(visit.date).toLocaleString()}</td>
								<td>{visit.referer}</td>
								<td>{visit.country || ''}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</section>

		<section>
			<h2>Danger Zone</h2>

			<FormWrapper error={form?.error} action="?/delete">
				{#snippet children(sending)}
					{#if deletion_confirmed}
						<div class="form-group">
							<label for="password">Enter the password to confirm</label>
							<input
								type="password"
								name="password"
								id="password"
								aria-label="Password"
								required
							/>
						</div>
						<button type="submit" disabled={sending}>Delete short URL</button>
					{:else}
						<button type="button" onclick={() => (deletion_confirmed = true)}>
							Delete short URL
						</button>
					{/if}
				{/snippet}
			</FormWrapper>
		</section>
	{/if}
</main>

<style>
	.value {
		font-weight: 500;
		color: var(--accent-color);
		word-break: break-all;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 1rem;

		thead {
			background-color: var(--secondary-bg-color);
		}

		th {
			text-align: left;
		}

		td,
		th {
			padding: 0.1rem 0.5rem;
		}
	}
</style>
