<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import ShortcutDetails from '$lib/components/ShortcutDetails.svelte'
	import ShortcutVisits from '$lib/components/ShortcutVisits.svelte'
	import type { Shortcut } from '$lib/types'

	let { form } = $props()

	let deletion_confirmed = $state(false)

	let shortcut = $state<null | Shortcut>(null)

	$effect(() => {
		if (form?.shortcut) shortcut = form.shortcut
	})
</script>

<header>
	<h1>ShortL Admin Page</h1>
</header>

<main>
	{#if !shortcut}
		<section>
			<h2>Login</h2>

			<FormWrapper error={form?.error} action="?/login">
				{#snippet children(sending)}
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" name="password" id="password" required />
					</div>
					<button type="submit" disabled={sending}>Login</button>
				{/snippet}
			</FormWrapper>
		</section>
	{:else}
		<section>
			<h2>Details</h2>
			<ShortcutDetails {shortcut} />
		</section>

		<section>
			<h2>Visits</h2>
			<ShortcutVisits {shortcut} />
		</section>

		<section>
			<h2>Danger Zone</h2>

			<FormWrapper error={form?.error} action="?/delete">
				{#snippet children(sending)}
					{#if deletion_confirmed}
						<div class="form-group">
							<label for="password">Enter the password to confirm</label>
							<input
								type="password"
								name="password"
								id="password"
								aria-label="Password"
								required
							/>
						</div>
						<button type="submit" disabled={sending}>Delete short URL</button>
					{:else}
						<button type="button" onclick={() => (deletion_confirmed = true)}>
							Delete short URL
						</button>
					{/if}
				{/snippet}
			</FormWrapper>
		</section>
	{/if}
</main>
