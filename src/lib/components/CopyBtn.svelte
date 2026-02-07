<script lang="ts">
	type Props = {
		content?: string
		label: string
	}

	let { content, label }: Props = $props()

	let copied = $state(false)

	async function copy() {
		if (!content) return
		await navigator.clipboard.writeText(content)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}
</script>

<button onclick={copy}>
	{#if copied}
		Copied!
	{:else}
		{label}
	{/if}
</button>
