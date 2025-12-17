<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Deck } from '@deck.gl/core';
  import { BitmapLayer } from '@deck.gl/layers';
  import {TileLayer} from "@deck.gl/geo-layers"
  import {load} from '@loaders.gl/core';
  import { OrthographicView, COORDINATE_SYSTEM } from '@deck.gl/core';
  import {clamp} from '@math.gl/core';

  let container: HTMLDivElement;
  let deck: Deck<OrthographicView>;

  const MAP_SIZE = 256*64;
  const TILE_SIZE = 256;

  onMount(() => {
    deck = new Deck({
      parent: container,
      style: {position: "static"},
      views: 
        new OrthographicView({
          id: 'ortho',
          controller: true,
        })
      ,

      initialViewState: {
        target: [MAP_SIZE/2, MAP_SIZE/2, 0],
        zoom: -4,
        maxZoom: 0,
        minZoom: -6
      },

      layers: [
        new TileLayer({
          id: 'tile-layer',

          data: 'tiles/{z}/{x}/{y}.png',

          minZoom: -6,
          maxZoom: 0,
          tileSize: TILE_SIZE,
            pickable: true,
            autoHighlight: true,
            highlightColor: [255, 255, 255, 50],
            
          coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
          getTileData: ({index}) => {
        const {x, y, z} = index;
        return load(
          `tiles/${6 + z}/${x}/${y}.png`
        ) as Promise<ImageBitmap>;
      },

            renderSubLayers: props => {
        const [[left, bottom], [right, top]] = props.tile.boundingBox;
        const {data, ...otherProps} = props;
        return new BitmapLayer(otherProps, {
          image: data,
          bounds: [
            clamp(left, 0, MAP_SIZE),
            clamp(top, 0, MAP_SIZE),
            clamp(right, 0, MAP_SIZE),
            clamp(bottom, 0, MAP_SIZE)
          ]
        })}}
        )
      ]
    });
  });

  onDestroy(() => {
    deck?.finalize();
  });
</script>

<div bind:this={container} class="w-full h-full"></div>
