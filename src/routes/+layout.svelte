<script lang="ts">
	import Nav from '$lib/components/Nav.svelte'
	import './app.css'

	let { children } = $props()
</script>

<svelte:head>
	<title>ShortL - URL Shortener</title>
	<meta
		name="description"
		content="ShortL is a simple URL shortener that allows you to create short links for your long URLs."
	/>
</svelte:head>

<div class="container">
	<Nav />

	{@render children()}
</div>

<style>
	.container {
		max-width: 38rem;
		margin: 0 auto;
		padding-inline: 1rem;
		padding-bottom: 2rem;
	}
</style>
