<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { DarkMode, Navbar, NavBrand, NavHamburger, NavUl, NavLi, ThemeProvider, type ThemeConfig, Heading } from 'flowbite-svelte';

	let { children } = $props();
	let activeUrl = $derived(page.url.pathname);

	const theme: ThemeConfig = {
		card: {
			base: "bg-gray-100 dark:bg-background-400 dark:border-background-500"
		},
		navbar: {
			base: "bg-gray-100 dark:bg-gray-700"
		},
		heading: "medievalsharp-regular dark:text-amber-500 "
	};

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/map', label: 'World Map' },
		{ href: '/stats', label: 'Stats' }
	];
	</script>
	
	<svelte:head>
		<title>World of Noobs</title>
	</svelte:head>

<ThemeProvider theme={theme}>
	<div class="bg-gray-200 dark:bg-background-500 min-h-full">
		<header>
			<Navbar>
				<NavBrand href="/">
					<Heading class="text-2xl">World of Noobs</Heading>
				</NavBrand>
				<NavHamburger />
				<NavUl {activeUrl}>
					{#each navItems as item}
						<NavLi href={item.href}>{item.label}</NavLi>
					{/each}
				</NavUl>
				<DarkMode />
			</Navbar>
		</header>

		<main>
			{@render children()}
		</main>
	</div>
</ThemeProvider>
