<script lang="ts">
	import type { Shortcut } from '$lib/types'

	let { shortcut }: { shortcut: Shortcut } = $props()
</script>

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

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 1rem;
	}

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
</style>
