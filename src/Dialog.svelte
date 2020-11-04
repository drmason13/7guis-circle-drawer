<script>
    import { tick } from 'svelte';
    import { actions, circles, history, selected } from './stores.js';

    export let isEditing = false;
    export let position;
    let currentRadius;

    let radiusInput;

    async function focusIt() {
        await tick();
        radiusInput.focus();
    }

    $: if (isEditing) {
        focusIt()
    }

    export const syncRadius = radius => currentRadius = radius;

    // update the radius of the currently selected circle
    $: if ($selected) {
        circles.update(circles => {
            circles[$selected].radius = currentRadius;
            return circles;
        });
    }

    export function confirmRadius() {
        if ($selected && currentRadius !== $circles[$selected].confirmedRadius) {
            history.do(actions.confirmRadius({ id: $selected, newRadius: currentRadius }))
        }
        close();
    }

    export function close() {
        selected.set(null);
        isEditing = false;
    }

    // cancels the current radius edit
    export function cancelRadius() {
        circles.update(c => {
            let circle = c[$selected];
            circle.radius = circle.confirmedRadius;
            currentRadius = circle.confirmedRadius;
            close()
            return c
        });
    }
</script>

<article id="modal" class="bg-beige-100 max-w-xs px-2 rounded border shadow-lg" class:hidden="{$selected === null}" class:absolute="{$selected !== null}" style="left: {position.x}px; top: {position.y}px;">
    <div class:hidden="{!isEditing}">
        <div class="flex flex-grow-0 justify-between">
            <p>radius: {currentRadius}</p>
            <button on:click={() => cancelRadius()}>X</button>
        </div>
        <input bind:this={radiusInput} type="range" min="5" max="200" bind:value={currentRadius} />
    </div>
    <button class:hidden="{isEditing}" on:click={() => isEditing = !isEditing}>Adjust Diameter...</button>
</article>