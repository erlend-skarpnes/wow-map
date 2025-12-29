<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { COORDINATE_SYSTEM, Deck, OrthographicView, type OrthographicViewState } from '@deck.gl/core';
	import { BitmapLayer, IconLayer, type IconLayerProps } from '@deck.gl/layers';
	import { TileLayer } from '@deck.gl/geo-layers';
	import { load } from '@loaders.gl/core';
	import { clamp } from '@math.gl/core';
	import type { CharacterDataWithCoordinates, Coordinates } from '$lib/server';
	import { Checkbox, Heading, P } from 'flowbite-svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	let { players }: { players: CharacterDataWithCoordinates[] } = $props();

	let characters = $derived.by(() => {

			let allPlayers = players.filter(player => player.level > 1) as CharacterDataWithCoordinates[];

			if (showOffline === false) {
				return allPlayers.filter(player => player.online === true);
			}
			return allPlayers.sort((a, b) => {
				if (a.online === b.online) {
					return b.lastOnline - a.lastOnline;
				}
				return a.online ? -1 : 1;
			});
		}
	);

	let showOffline = $state(false);
	let hoveredCharacter: CharacterDataWithCoordinates | undefined = $state();

	type Offset = { x: number, y: number };
	const scale = 0.605;
	const kalimdorOffset: Offset = { x: 3255, y: 8156 };
	const easternKingdomOffset: Offset = { x: 11528, y: 5938 };

	const translateCoordinates = (point: Coordinates): [number, number] => {
		let offset: Offset = point.map === 0 ? easternKingdomOffset : kalimdorOffset;
		const mapX = offset.x - point.y * scale;
		const mapY = offset.y - point.x * scale;
		return [mapX, mapY];
	};

	let container: HTMLDivElement;
	let deck: Deck<OrthographicView>;

	const MAP_SIZE = 256 * 64;
	const TILE_SIZE = 256;

	const tileLayer = new TileLayer({
		id: 'tile-layer',
		data: 'tiles/{z}/{x}/{y}.png',
		minZoom: -6,
		maxZoom: 0,
		tileSize: TILE_SIZE,
		coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
		getTileData: ({ index }) => {
			const { x, y, z } = index;
			return load(
				`tiles/${6 + z}/${x}/${y}.png`
			) as Promise<ImageBitmap>;
		},
		renderSubLayers: props => {
			const [[left, bottom], [right, top]] = props.tile.boundingBox;
			const { data, ...otherProps } = props;
			return new BitmapLayer(otherProps, {
				image: data,
				bounds: [
					clamp(left, 0, MAP_SIZE),
					clamp(top, 0, MAP_SIZE),
					clamp(right, 0, MAP_SIZE),
					clamp(bottom, 0, MAP_SIZE)
				]
			});
		}
	});

	let viewState: OrthographicViewState = $state({
		target: [MAP_SIZE / 2, MAP_SIZE / 2, 0],
		zoom: -4,
		maxZoom: 0,
		minZoom: -4
	});

	const handlePlayerCardHovered = (character: CharacterDataWithCoordinates) => {
		hoveredCharacter = character;
		if (character) {
			panToCharacter(character);
		}
	};

	const panToCharacter = (character: CharacterDataWithCoordinates) => {
		const playerCoordinates = translateCoordinates(character.coordinates);
		const pannedViewState = {
			...viewState,
			target: playerCoordinates,
			transitionDuration: 250
		};
		deck.setProps({
			viewState: pannedViewState
		});
	};

	const zoomToCharacter = (character: CharacterDataWithCoordinates) => {
		const playerCoordinates = translateCoordinates(character.coordinates);
		const zoomedViewState: OrthographicViewState = {
			...viewState,
			target: playerCoordinates,
			zoom: 0,
			transitionDuration: 500,
			transitionEasing: x => 1 - Math.cos((x * Math.PI) / 2)
		};
		deck.setProps({
			viewState: zoomedViewState
		});
	};

	onMount(() => {
		deck = new Deck({
			parent: container,
			style: { position: 'static' },
			views:
				new OrthographicView({
					id: 'ortho',
					controller: true
				})
			,
			getTooltip: ({ object }) => {
				return object && object.name;
			},
			viewState: viewState,
			onViewStateChange: e => {
				viewState = e.viewState;
				deck.setProps({
					viewState: e.viewState
				});
			},
			controller: true
		});
	});

	$effect(() => {
		const commonIconLayerProps: Partial<IconLayerProps<CharacterDataWithCoordinates>> = {
			getPosition: (player: CharacterDataWithCoordinates) => translateCoordinates(player.coordinates),
			getIcon: (player: CharacterDataWithCoordinates) => `${player.race.toLowerCase()}-${player.gender.toLowerCase()}`,
			getColor: (player: CharacterDataWithCoordinates) => player.online || player.name === hoveredCharacter?.name ? [0, 0, 0, 255] : [0, 0, 0, 120],
			onHover: (pickingInfo) => {
				hoveredCharacter = pickingInfo.object;
				return false;
			},
			onClick: (pickingInfo) => zoomToCharacter(pickingInfo.object),
			iconAtlas: 'race-texture.png',
			iconMapping: 'race-texture-mapping.json',
			getSize: (player: CharacterDataWithCoordinates) => player.name === hoveredCharacter?.name ? 40 : 32,
			transitions: {
				getSize: 100
			},
			updateTriggers: {
				getSize: hoveredCharacter,
				getColor: hoveredCharacter
			},
			pickable: true
		};
		const iconLayer = new IconLayer({
			id: 'PlayerIcons',
			data: characters.filter(player => player.name !== hoveredCharacter?.name),
			...commonIconLayerProps
		});
		const hoveredIconLayer = new IconLayer({
			id: 'HoveredPlayerIcon',
			data: characters.filter(player => player.name === hoveredCharacter?.name),
			...commonIconLayerProps
		});
		deck.setProps({ layers: [tileLayer, iconLayer, hoveredIconLayer] });
	});

	onDestroy(() => {
		deck?.finalize();
	});
</script>

<div class="flex flex-col lg:flex-row h-full w-full overflow-hidden">
	<!-- Sidebar -->
	<div class="w-64 overflow-y-auto">
		<div class="p-4">
			<Heading class="text-xl">Players Online</Heading>
			<div class="flex justify-between items-center">
				{#if showOffline}
					<P>{characters.length} total</P>
				{:else}
					<P>{characters.length} online</P>
				{/if}
				<Checkbox bind:checked={showOffline}>Show offline</Checkbox>
			</div>
		</div>
		<div class="p-4 max-h-32 lg:max-h-full">
			{#each characters ?? [] as player}
				<button onmouseenter={() => handlePlayerCardHovered(player)} onmouseleave={() => hoveredCharacter = undefined}
								onclick={() => zoomToCharacter(player)}>
					<PlayerCard character={player} />
				</button>

			{:else}
				<P>No players online</P>
			{/each}
		</div>
	</div>

	<!-- Map Area -->
	<div class="flex-1">
		<div class="h-full">
			<div bind:this={container} class="w-full h-full relative"></div>
		</div>
	</div>
</div>


