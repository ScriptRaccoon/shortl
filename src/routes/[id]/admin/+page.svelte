<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()

	let deletion_confirmed = $state(false)
	let show_password = $state(false)

	let sending_password = $state(false)
	let sending_delete = $state(false)
</script>

<svelte:head>
	<title>ShortL Admin Page</title>
</svelte:head>

<header>
	<h1>ShortL Admin Page</h1>
</header>

<main>
	{#if !form?.success}
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
				<label for="password">Password</label>
				<input type="password" name="password" id="password" required />
				<button class="fullwidth" type="submit">Login</button>
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
			<h2>Basic Information</h2>

			<ul>
				<li>
					ShortL ID: <span class="value">{form.id}</span>
				</li>
				<li>
					URL: <span class="value">{form.url}</span>
				</li>
				<li>
					Short URL: <span class="value">{form.short_url}</span>
				</li>
				<li>
					Created at: <span class="value">
						{new Date(form.created_at).toLocaleString()}
					</span>
				</li>
				<li>
					Number of visits: <span class="value">{form.visits.length}</span>
				</li>
				<li>
					Password: <span class="value">
						{#if show_password}
							{form.password}
						{:else}
							<button class="small" onclick={() => (show_password = true)}>
								Reveal
							</button>
						{/if}
					</span>
				</li>
			</ul>
		</section>

		<section>
			<h2>List of Visits</h2>

			{#if !form.visits.length}
				<p>No visits so far</p>
			{:else}
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Date</th>
							<th>Referer</th>
						</tr>
					</thead>
					<tbody>
						{#each form.visits as visit, i}
							<tr>
								<td>{form.visits.length - i}</td>
								<td>{new Date(visit.date).toLocaleString()}</td>
								<td>{visit.referer}</td>
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
					<button type="submit">Yes, delete short URL</button>
					<p>Are you sure? This action cannot be undone.</p>
				{:else}
					<button type="button" onclick={() => (deletion_confirmed = true)}>
						Delete short URL
					</button>
				{/if}
				<input type="hidden" name="password" value={form.password} />
			</form>

			{#if sending_delete}
				<p>Please wait ...</p>
			{/if}
		</section>
	{/if}
</main>

<style>
	.value {
		font-weight: 500;
		color: orangered;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 1rem;

		thead {
			background-color: #eee;
		}

		th {
			text-align: left;
		}

		td {
			padding-block: 2px;
		}
	}
</style>
