<script lang="ts">
	import { House } from 'lucide-svelte'
</script>

<nav>
	<a href="/" aria-label="home">
		<House />
	</a>
</nav>

<style>
	nav {
		display: flex;
		justify-content: end;
		padding-top: 1rem;
	}

	a {
		color: inherit;
	}
</style>
