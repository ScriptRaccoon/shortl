<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Snippet } from 'svelte'

	let sending = $state(false)

	type Props = {
		error?: string
		action?: string
		children: Snippet<[boolean]>
	}

	let { error, action = '', children }: Props = $props()
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		sending = true
		return async ({ update }) => {
			await update()
			sending = false
		}
	}}
>
	{@render children(sending)}
</form>

{#if sending}
	<p>Please wait ...</p>
{/if}

{#if !sending && error}
	<p class="error">{error}</p>
{/if}
