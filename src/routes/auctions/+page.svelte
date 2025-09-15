<script lang="ts">
	import type { AuctionData } from '$lib/server';
	import { Table } from '@flowbite-svelte-plugins/datatable';
	import type { DataTableOptions } from 'simple-datatables';
	import { Heading } from 'flowbite-svelte';
	import { formatMoney } from '$lib/formatters';

	let { data }: { data: { auctions: AuctionData[] } } = $props();

	// Keep underlying numeric values for sorting, render formatted in UI
	let tableData = $derived(
		data.auctions.map((auction) => ({
			"Item": auction.itemName,
			"Buyout": auction.buyoutPrice,
			"Starting bid": auction.startBid,
			"Last bid": auction.lastBid,
			"Seller": auction.sellerCharacter,
			"Account": auction.sellerAccount
		}))
	);

	const dataTableOptions: DataTableOptions = {
		columns: [
			{
				select: [1, 2, 3], // Buyout, Starting bid, Last bid
				type: 'number',
				numeric: true,
				render: (cellData) => {
					const n = typeof cellData === 'number' ? cellData : Number(cellData ?? 0);
					return formatMoney(n);
				}
			}
		]
	};

</script>

<Heading tag="h1" class="text-4xl text-center mb-8">Auctions</Heading>

<div class="container mx-auto px-4 py-8">
	<Table items={tableData} dataTableOptions={dataTableOptions} />
</div>