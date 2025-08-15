<script lang="ts">
    import type { AccountData, CharacterData, CharacterDataWithCoordinates } from '$lib/db';
    import { Avatar, P, Tooltip } from "flowbite-svelte";

    // Accept players data as a prop
    let { players, activePlayer }: {players: AccountData<CharacterDataWithCoordinates>[], activePlayer: string | null} = $props();

    $inspect(activePlayer);

    type MapPoint = {db_x: number, db_y: number, px_x: number, px_y: number, character: CharacterData};
    type SampleMapPoint = Omit<MapPoint, 'character'>;

    const originalMapWidth = 2777;

    let mapHeight = $state(0);
    let mapWidth = $state(0);
    let containerHeight = $state(0);
    let containerWidth = $state(0);

    let scale = $derived(mapWidth/originalMapWidth);
    let offsetX = $derived((containerWidth - mapWidth)/2);
    let offsetY = $derived((containerHeight - mapHeight)/2);

    const getPortrait = (character: CharacterData | null): string | undefined => {
        if (character == null) return undefined;
        return `/races/${character.race.replace(' ', '').toLowerCase()}-${character.gender.toLowerCase()}.jpg`;
    };

    const samplePointsEK: SampleMapPoint[] = [
        { db_x: 2314.55004882812500000000, db_y: -5322.85986328125000000000, px_x: 2500, px_y: 417 }, // Dispatch Commander Metz
        { db_x: -11407.09960937500000000000, db_y: 1966.15002441406250000000, px_x: 1896, px_y: 1557 }, // Captain Grayson
    ]

    const samplePointsKalimdor: SampleMapPoint[] = [
        { db_x: 10417.70019531250000000000, db_y: 871.19396972656250000000, px_x: 437, px_y: 190}, // Gilshalan Windwalker
        { db_x: -6903.39990234375000000000, db_y: -4840.93994140625000000000, px_x: 903, px_y: 1627}, // Yeh'kinya
    ];

    const calculateScaleAndOffset = (samplePoints: SampleMapPoint[]): {scaleX: number, scaleY: number, origoX: number, origoY: number} => {
        // X and Y are swapped in the db coordinates
        const dPX = Math.max(...samplePoints.map(p => p.px_x)) - Math.min(...samplePoints.map(p => p.px_x));
        const dDbX = Math.max(...samplePoints.map(p => p.db_y)) - Math.min(...samplePoints.map(p => p.db_y));

        const dPY = Math.max(...samplePoints.map(p => p.px_y)) - Math.min(...samplePoints.map(p => p.px_y));
        const dDbY = Math.max(...samplePoints.map(p => p.db_x)) - Math.min(...samplePoints.map(p => p.db_x));

        const scaleX = dPX / dDbX;
        const scaleY = dPY / dDbY;
        const origoX = samplePoints[0].px_x + (samplePoints[0].db_y * scaleX);
        const origoY = samplePoints[0].px_y + (samplePoints[0].db_x * scaleX);

        console.log({dPX, dDbX, dPY, dDbY, scaleX, scaleY, origoX, origoY})

        return {scaleX, scaleY, origoX, origoY};
    };

    const eKScaleAndOffset = calculateScaleAndOffset(samplePointsEK);
    const kalimdorScaleAndOffset = calculateScaleAndOffset(samplePointsKalimdor);

    const mapToPixels = (player: CharacterDataWithCoordinates): MapPoint | undefined => {
        if (![0, 1].includes(player.coordinates.map)) return undefined;

        const scales = player.coordinates.map === 1 ? kalimdorScaleAndOffset : eKScaleAndOffset;

        const px_x = (player.coordinates.y * scales.scaleX * -1) + scales.origoX;
        const px_y = (player.coordinates.x * scales.scaleY * -1) + scales.origoY;

        return {db_x: player.coordinates.x, db_y: player.coordinates.y, px_x, px_y, character: player};
    };

    const playerCoordinates = $derived(players.map(player => mapToPixels(player.character)).filter(p => p !== undefined));
</script>

<div class="h-full w-full relative flex justify-center items-center" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>
    <img src="wow-map.png" alt="World Map" class="object-contain max-w-full max-h-full" bind:clientHeight={mapHeight} bind:clientWidth={mapWidth} />

    {#each playerCoordinates as player}
        <div style="left: {offsetX + (player.px_x * scale)}px; top: {offsetY + (player).px_y * scale}px;"
             class="z-10 absolute">
            {#if player.character?.name === activePlayer}
                <Avatar size="md" src={getPortrait(player.character)} class="transition-all transform -translate-x-1/2 -translate-y-1/2 z-50 border-2 dark:border-amber-500"/>
            {:else}
                <Avatar size="xs" src={getPortrait(player.character)} class="transition-all transform -translate-x-1/2 -translate-y-1/2 hover:h-8 hover:w-8"/>
                <Tooltip><P>{player.character?.name}</P></Tooltip>
            {/if}
        </div>
    {/each}
</div>
