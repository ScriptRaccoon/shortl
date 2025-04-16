<script lang="ts">
	import './app.css'
	let { children } = $props()
</script>

<div class="wrapper">
	{@render children()}
</div>
