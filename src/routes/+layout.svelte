<script lang="ts">
	import './app.css'
	import Fa from 'svelte-fa'
	import { faHome } from '@fortawesome/free-solid-svg-icons'

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
	<nav>
		<a href="/" aria-label="home">
			<Fa icon={faHome} />
		</a>
	</nav>

	{@render children()}
</div>

<style>
	.container {
		max-width: 38rem;
		margin: 0 auto;
		padding-inline: 1rem;
		padding-bottom: 2rem;
	}

	nav {
		display: flex;
		justify-content: end;
		margin-bottom: -1rem;
		font-size: 1rem;
		padding-top: 0.25rem;
	}

	a {
		color: black;
	}
</style>
