<script lang="ts">
	import { House, Github } from 'lucide-svelte'
</script>

<nav>
	<a
		href="https://github.com/ScriptRaccoon/shortl"
		aria-label="GitHub repository"
		target="_blank"
	>
		<Github />
	</a>
	<a href="/" aria-label="home">
		<House />
	</a>
</nav>

<style>
	nav {
		display: flex;
		justify-content: end;
		margin-top: 1rem;
		gap: 0.5rem;
	}
</style>
