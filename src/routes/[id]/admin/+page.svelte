<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ShortCut } from '$lib/types'

	let { form } = $props()

	let deletion_confirmed = $state(false)

	let sending_password = $state(false)
	let sending_delete = $state(false)

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

			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					sending_password = true
					return async ({ update }) => {
						await update()
						sending_password = false
					}
				}}
			>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" name="password" id="password" required />
				</div>
				<button type="submit">Login</button>
			</form>

			{#if sending_password}
				<p>Please wait ...</p>
			{/if}

			{#if !sending_password && form?.error}
				<p class="error">{form.error}</p>
			{/if}
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

			<form
				action="?/delete"
				method="POST"
				use:enhance={() => {
					sending_delete = true
					return async ({ update }) => {
						await update()
						sending_delete = false
					}
				}}
			>
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
					<button type="submit">Delete short URL</button>
				{:else}
					<button type="button" onclick={() => (deletion_confirmed = true)}>
						Delete short URL
					</button>
				{/if}
			</form>

			{#if sending_delete}
				<p>Please wait ...</p>
			{/if}

			{#if !sending_delete && form?.error}
				<p class="error">{form.error}</p>
			{/if}
		</section>
	{/if}
</main>

<style>
	.value {
		font-weight: 500;
		color: var(--accent-color);
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
