<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { DarkMode, Navbar, NavBrand, NavHamburger, NavUl, NavLi, ThemeProvider, type ThemeConfig, Heading } from 'flowbite-svelte';

	let { children } = $props();
	let activeUrl = $derived(page.url.pathname);

	const theme: ThemeConfig = {
		heading: "medievalsharp-regular text-amber-700 dark:text-amber-500"
	};

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/map', label: 'World Map' },
		{ href: '/stats', label: 'Stats' },
		{ href: '/players', label: 'Players' },
		{ href: '/auctions', label: 'Auctions' }
	];
	</script>
	
	<svelte:head>
		<title>World of Noobs</title>
	</svelte:head>

<ThemeProvider theme={theme}>
	<div class="bg-gray-100 dark:bg-gray-900 h-screen">
		<header class="h-1/10">
			<Navbar>
				<NavBrand href="/">
					<Heading class="text-2xl">World of Noobs</Heading>
				</NavBrand>
				<NavHamburger />
				<NavUl {activeUrl} classes={{ active: "md:dark:text-amber-500", nonActive: "md:hover:dark:text-amber-500" }}>
					{#each navItems as item}
						<NavLi href={item.href}>{item.label}</NavLi>
					{/each}
					<DarkMode />
				</NavUl>
			</Navbar>
		</header>

		<main class="h-9/10 overflow-scroll">
			{@render children()}
		</main>
	</div>
</ThemeProvider>
