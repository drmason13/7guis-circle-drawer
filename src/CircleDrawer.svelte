<script>
    import {v4 as uuid} from 'uuid';
    import { tick } from 'svelte';

    import { circles, history, undo, redo, selected } from './stores.js';
    import Circle from './Circle.svelte';
    
    // parameters
    const defaultRadius = 20; // new circles are created with this radius

    // element references
    let svg; // the svg "canvas" where circles are drawn
    let radiusInput; // the popup dialog's input for altering the selected circle's radius

    // state //

    // modal will have its (absolute) position set to this
    let modalPosition = {
        x: 0,
        y: 0,
    };

    // stores the current radius selected using the popup dialog (modal)
    let currentRadius;

    // derived values //

    // update the radius of the currently selected circle
    $: if ($selected) {
        circles.update(circles => {
            circles[$selected].radius = currentRadius;
            return circles;
        });
    }

    // handlers //

    // selects a circle, moves modal to it and focuses its input
    async function selectCircle(id, e) {
        selected.set(id);
        const rect = svg.getBoundingClientRect();
        modalPosition = {
            x: rect.x + e.offsetX,
            y: rect.y + e.offsetY,
        };
        currentRadius = $circles[id].radius;
        
        await tick();
        radiusInput.focus();
    }
    
    // creates a new circle with unique id for referencing
    function newCircle(x, y) {
        const id = uuid();
        circles.set({
            ...$circles,
            [id]: { id, x, y, radius: defaultRadius }
        });
    }
</script>

<article class="flex flex-col flex-grow-0 items-center justify-center mb-4 bg-beige-50 px-2 py-4">
    <section id="actions" class="flex flex-row flex-grow-0 items-center justify-center mb-4 bg-beige-50">
        <button id="undo" on:click={undo} class="btn btn-outline-beige flex-grow-0 mx-2">Undo</button>
        <button id="redo" on:click={redo} class="btn btn-outline-beige flex-grow-0 mx-2">Redo</button>
    </section>
    <section id="canvas" class="border">
        <svg bind:this={svg} on:click={e => newCircle(e.offsetX, e.offsetY)} height="500px" width="500px">
            {#each Object.values($circles) as {id, x, y, radius}}
                <Circle {id} {x} {y} {radius} {selectCircle}></Circle>
            {/each}
        </svg>
        
        <article id="modal" class="bg-beige-100 max-w-xs" class:hidden="{$selected === null}" class:absolute="{$selected !== null}" style="left: {modalPosition.x}px; top: {modalPosition.y}px;">
            <p>radius: {currentRadius}</p>
            <input bind:this={radiusInput} type="range" min="1" max="200" bind:value={currentRadius} on:blur={() => selected.set(null)} />
        </article>
    </section>
</article>
