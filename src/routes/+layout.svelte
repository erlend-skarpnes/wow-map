<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	
	let { children } = $props();
	
	// Navigation items
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/map', label: 'World Map' },
		{ href: '/characters', label: 'Character Browser' }
	];
	</script>
	
	<svelte:head>
	<title>World of Noobs</title>
	</svelte:head>
	
	<div class="flex flex-col min-h-screen">
	<!-- Navigation Header -->
	<header class="bg-gray-900 text-white shadow-lg">
		<div class="container mx-auto px-4">
			<nav class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<a href="/" class="flex items-center">
						<span class="text-xl font-bold">World of Noobs</span>
					</a>
				</div>
				
				<div class="hidden md:block">
					<div class="flex items-center space-x-4">
						{#each navItems as item}
							<a
								href={item.href}
								class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
								class:bg-gray-700={item.href === page.url.pathname}
							>
								{item.label}
							</a>
						{/each}
					</div>
				</div>
				
				<!-- Mobile menu button -->
				<div class="md:hidden">
					<button 
						type="button" 
						class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" 
						aria-expanded="false"
					>
						<span class="sr-only">Open main menu</span>
						<!-- Menu icon -->
						<svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</nav>
		</div>
	</header>
	
	<!-- Page Content -->
	<main class="flex-grow">
		{@render children()}
	</main>
	</div>
