<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()

	let deletion_confirmed = $state(false)
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

			<form method="POST" action="?/login" use:enhance>
				<label for="password"></label>
				<input type="password" name="password" id="password" required />
				<button type="submit">Login</button>
			</form>
		</section>
	{:else}
		<section>
			<h2>Basic Information</h2>

			<p>Shortcut: {form.id}</p>
			<p>URL: {form.url}</p>
			<p>Created at: {new Date(form.created_at).toLocaleString()}</p>
			<p>Number of visits: {form.visits.length}</p>
		</section>

		{#if form.visits.length}
			<section>
				<h2>List of Visits</h2>

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
								<td>{i + 1}</td>
								<td>{new Date(visit.date).toLocaleString()}</td>
								<td>{visit.referer}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
		{/if}

		<section>
			<h2>Danger Zone</h2>

			<form action="?/delete" method="POST" use:enhance>
				{#if deletion_confirmed}
					<button type="submit">Yes, Delete Shortcut</button>
					<p>Are you sure? This action cannot be undone</p>
				{:else}
					<button
						type="button"
						onclick={() => {
							deletion_confirmed = true
						}}>Delete Shortcut</button
					>
				{/if}
				<input type="hidden" name="password" value={form.password} />
			</form>
		</section>
	{/if}

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}
</main>
