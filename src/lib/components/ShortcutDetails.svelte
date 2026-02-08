<script lang="ts">
	import type { Shortcut } from '$lib/types'

	let { shortcut }: { shortcut: Shortcut } = $props()
</script>

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

<style>
	.value {
		font-weight: 500;
		color: var(--accent-color);
		word-break: break-all;
	}
</style>
