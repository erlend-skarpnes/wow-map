<script lang="ts">
    import type { PlayerInfo } from '$lib/db';

    // Accept players data as a prop
    let { players } = $props<{ players: PlayerInfo[] }>();

    type MapPoint = {db_x: number, db_y: number, px_x: number, px_y: number};

    const originalMapWidth = 3000;

    let mapHeight = $state(0);
    let mapWidth = $state(0);
    let containerHeight = $state(0);
    let containerWidth = $state(0);

    let scale = $derived(mapWidth/originalMapWidth);
    let offsetX = $derived((containerWidth - mapWidth)/2);
    let offsetY = $derived((containerHeight - mapHeight)/2);

    const samplePointsEK: MapPoint[] = [
        //{ db_x: -8833.379883, db_y: 628.0627991, px_x: 2100, px_y: 1345 }, // Stormwind
        //{ db_x: -4918.879883, db_y: -940.406006, px_x: 2230, px_y: 1020 }, // Ironforge
        //{ db_x: 1584.069946, db_y: 241.9870000, px_x: 2135, px_y: 480 }, // Undercity
        //{ db_x: -14297.200195, db_y: 530.992981, px_x: 2115, px_y: 1810 }, // Bootybay
        { db_x: -15024.500000, db_y: 269.351989, px_x: 2135, px_y: 1875 }, // Fleet Master Firallon
        { db_x: 3397.34008, db_y: -4269.819824, px_x: 2510, px_y: 340 }, // Pathstrider
        { db_x: 1567.00000, db_y: -5611.379882, px_x: 2620, px_y: 480 }, // High General Abbendis
        { db_x: 1166.95996093750000000000, db_y: 2063.98999023437500000000, px_x: 1985, px_y: 520 }, // Killian Sanatha
        { db_x: 153.89300537109375000000, db_y: -62.18320083618164000000, px_x: 2160, px_y: 620 }, // Araga
    ]

    const samplePointsKalimdor: MapPoint[] = [
        // { db_x: 9949.559570, db_y: 2284.209961, px_x: 400, px_y: 240 }, // Darnassus
        // { db_x: 1629.359985, db_y: -4373.390137, px_x: 970, px_y: 930 }, // Orgrimmar
        // { db_x: -1277.369995, db_y: 124.804001, px_x: 620, px_y: 1150 }, // Thunder Bluff
        // { db_x: -7177.149902, db_y: -3785.340088, px_x: 915, px_y: 1655 } // Gadgetzan
        { db_x: 0, db_y: 0, px_x: 610, px_y: 1064 }, // Origo
        { db_x: -10293.09960937500000000000, db_y: -4319.39990234375000000000, px_x: 970, px_y: 1920 }, // Meridith the Mermaiden
        { db_x: 11056.29980468750000000000, db_y: 1925.18005371093750000000, px_x: 447, px_y: 150 }, // Sethir the Ancient
        { db_x: 2914.30004882812500000000, db_y: -7342.58984375000000000000, px_x: 1213, px_y: 827 }, // Hydraxian Honor Guard
        { db_x: -5346.68994140625000000000, db_y: 3824.87988281250000000000, px_x: 300, px_y: 1500 }, // Hatecrest Myrmidon
    ];

    const calculateScaleAndOffset = (samplePoints: MapPoint[]) => {
        const minX = Math.min(...samplePoints.map(point => point.db_x));
        const maxX = Math.max(...samplePoints.map(point => point.db_x));
        const minY = Math.min(...samplePoints.map(point => point.db_y));
        const maxY = Math.max(...samplePoints.map(point => point.db_y));

        const scaleX = mapWidth / (maxX - minX);
        const scaleY = mapHeight / (maxY - minY);

        return {scaleX, scaleY, minX, minY};
    };

    const eKScaleAndOffset = $derived(calculateScaleAndOffset(samplePointsEK));
    const kalimdorScaleAndOffset = $derived(calculateScaleAndOffset(samplePointsKalimdor));

    const mapToPixels = (player: PlayerInfo): MapPoint => {
        if (player.map === 0) {
            // const px_x = player.x - (eKScaleAndOffset.minY * eKScaleAndOffset.scaleY);
            // const px_y = player.y - ((eKScaleAndOffset.minX) * eKScaleAndOffset.scaleX);

            const px_x = (player.y * -0.085) + 2155;
            const px_y = (player.x * -0.0835) + 630;

            console.log({db_x: player.x, db_y: player.y, px_x, px_y})
            return {db_x: player.x, db_y: player.y, px_x, px_y};
        }
        const px_x = (player.y * -0.085) + 610;
        const px_y = (player.x * -0.0835) + 1064;
        // const px_x = player.x - (kalimdorScaleAndOffset.minX * kalimdorScaleAndOffset.scaleX);
        // const px_y = player.y - ((kalimdorScaleAndOffset.minY) * kalimdorScaleAndOffset.scaleY);
        return {db_x: player.x, db_y: player.y, px_x, px_y};
    };

    // const playerCoordinates = samplePointsKalimdor.map(p => ({x: p.db_x, y: p.db_y, map: 1})).map(p => mapToPixels(p));
    const playerCoordinates = $derived(players.map(player => mapToPixels(player)));
    // const playerCoordinates = $derived([{x: 0, y: 0, map: 0}, {x: 0, y: 0, map: 1}].map(player => mapToPixels(player)));

</script>

<div class="h-full w-full relative flex justify-center items-center" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>
    <img src="wow-map.jpg" alt="World Map" class="object-contain max-w-full max-h-full" bind:clientHeight={mapHeight} bind:clientWidth={mapWidth} />

    {#each playerCoordinates as player}
        <div
          class="absolute w-2 h-2 bg-blue-500 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:w-5 hover:h-5 transition-all z-10"
          style="left: {offsetX + (player.px_x * scale)}px; top: {offsetY + (player).px_y * scale}px;"
        >
            <div class="opacity-0 hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                DB: ({player.db_x.toFixed(2)}, {player.db_y.toFixed(2)})<br>
                Px: ({player.px_x}, {player.px_y})
            </div>
        </div>
    {/each}

    <!-- Sample points for Eastern Kingdoms -->
    {#each samplePointsEK as point}
        <div
            class="absolute w-0.5 h-0.5 bg-red-500 border-0 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:w-5 hover:h-5 transition-all z-10"
            style="left: {offsetX + (point.px_x * scale)}px; top: {offsetY + (point.px_y * scale)}px;"
        >
            <div class="opacity-0 hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                EK Sample Point<br>
                DB: ({point.db_x.toFixed(2)}, {point.db_y.toFixed(2)})<br>
                Px: ({point.px_x}, {point.px_y})
            </div>
        </div>
    {/each}

    <!-- Sample points for Kalimdor -->
    {#each samplePointsKalimdor as point}
        <div
            class="absolute w-0.5 h-0.5 bg-red-500 border-0 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:w-5 hover:h-5 transition-all z-10"
            style="left: {offsetX + (point.px_x * scale)}px; top: {offsetY + (point.px_y * scale)}px;"
        >
            <div class="opacity-0 hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Kalimdor Sample Point<br>
                DB: ({point.db_x.toFixed(2)}, {point.db_y.toFixed(2)})<br>
                Px: ({point.px_x}, {point.px_y})
            </div>
        </div>
    {/each}
</div>
