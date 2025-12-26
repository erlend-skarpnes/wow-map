<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { COORDINATE_SYSTEM, Deck, OrthographicView } from '@deck.gl/core';
	import { BitmapLayer, IconLayer, ScatterplotLayer } from '@deck.gl/layers';
	import { TileLayer } from '@deck.gl/geo-layers';
	import { load } from '@loaders.gl/core';
	import { clamp } from '@math.gl/core';
	import type { CharacterDataWithCoordinates, Coordinates } from '$lib/server';

	let { players }: {players: CharacterDataWithCoordinates[]} = $props();

	type offset = {x: number, y: number};
	const scale = 0.605
	const kalimdorOffset: offset = {x: 3255, y: 8156};
	const easternKingdomOffset: offset = {x: 11528, y: 5938};

	const translateCoordinates = (point: Coordinates): [number, number] => {
		let offset: offset = point.map === 0 ? easternKingdomOffset : kalimdorOffset;
		const mapX = offset.x - point.y * scale;
		const mapY = offset.y - point.x * scale;
		return [mapX, mapY];
	}

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
	})

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
				return object && object.name
			},
			initialViewState: {
				target: [MAP_SIZE / 2, MAP_SIZE / 2, 0],
				zoom: -4,
				maxZoom: 0,
				minZoom: -4
			},
			layers: [
				new TileLayer({
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
				}),
				new IconLayer({
					id: "PlayerIcons",
					data: players,
					getPosition: (player: CharacterDataWithCoordinates) => translateCoordinates(player.coordinates),
					getIcon: (player: CharacterDataWithCoordinates) => `${player.race.toLowerCase()}-${player.gender.toLowerCase()}`,
					iconAtlas: "race-texture.png",
					iconMapping: "race-texture-mapping.json",
					getSize: 32,
					pickable: true
				}),
			]
		});
	});

	$effect(() => {
		const iconLayer = new IconLayer({
			id: "PlayerIcons",
			data: players,
			getPosition: (player: CharacterDataWithCoordinates) => translateCoordinates(player.coordinates),
			getIcon: (player: CharacterDataWithCoordinates) => `${player.race.toLowerCase()}-${player.gender.toLowerCase()}`,
			iconAtlas: "race-texture.png",
			iconMapping: "race-texture-mapping.json",
			getSize: 32,
			pickable: true
		})
		deck.setProps({layers: [tileLayer, iconLayer]})
	})

	onDestroy(() => {
		deck?.finalize();
	});
</script>

<div bind:this={container} class="w-full h-full relative"></div>
