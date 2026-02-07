<script lang="ts">
	import { House, Github } from 'lucide-svelte'
</script>

<nav>
	<a href="/" aria-label="home">
		<House />
	</a>
	<a
		href="https://github.com/ScriptRaccoon/shortl"
		aria-label="GitHub repository"
		target="_blank"
	>
		<Github />
	</a>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: row-reverse;
		justify-content: end;
		margin-top: 1rem;
		gap: 0.5rem;
	}
</style>
