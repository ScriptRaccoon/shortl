<script lang="ts">
	import Fa from 'svelte-fa'
	import { faHome } from '@fortawesome/free-solid-svg-icons'
	import './app.css'

	let { children } = $props()
</script>

<div class="wrapper">
	<nav>
		<a href="/" aria-label="home">
			<Fa icon={faHome} />
		</a>
	</nav>

	{@render children()}
</div>

<style>
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
