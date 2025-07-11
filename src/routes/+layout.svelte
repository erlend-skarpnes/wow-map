<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
</script>

<svelte:head>
	<title>Privatservern</title>
</svelte:head>

{@render children()}
