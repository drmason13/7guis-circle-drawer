<script>
    import {v4 as uuid} from 'uuid';

    import { actions, circles, history, selected } from './stores.js';
    import Circle from './Circle.svelte';
    import Dialog from './Dialog.svelte';

    // parameters
    const defaultRadius = 20; // new circles are created with this radius

    // element references
    let dialog; // Dialog for altering the selected circle's radius

    // state //

    // is the Dialog currently editing a circle?
    let isEditing;

    // stores the position to draw Dialog
    let dialogPosition = {
        x: 0,
        y: 0,
    };

    // handlers //

    // selects a circle, moves dialog to the click event's coordinates and focuses the dialog
    function selectCircle(id, { x, y }) {
        // don't allow selecting a new circle while the dialog is open
        if (!$selected) {
            selected.set(id);
            dialog.syncRadius($circles[id].radius)

            dialogPosition = { x, y };
        } else {
            dialog.confirmRadius();
        }
    }
    
    // creates a new circle with unique id for referencing
    function newCircle(x, y) {
        // don't allow creating a new circle while the dialog is open
        if (!$selected) {
            // record the new circle in history
            history.do(actions.newCircle({ id: uuid(), x, y, radius: defaultRadius }));
        } else {
            dialog.confirmRadius();
        }
    }
</script>

<article class="flex flex-col flex-grow-0 items-center justify-center mb-4 bg-beige-50 px-2 py-4">
    <section id="actions" class="flex flex-row flex-grow-0 items-center justify-center mb-4 bg-beige-50">
        <button id="undo" on:click={() => { if ($selected) { dialog.close() } history.undo() }} disabled="{$history.undo.length == 0}" class="btn btn-outline-beige flex-grow-0 mx-2 disabled:opacity-50 disabled:cursor-not-allowed">Undo</button>
        <button id="redo" on:click={() => { if ($selected) { dialog.close() } history.redo() }} disabled="{$history.redo.length == 0}" class="btn btn-outline-beige flex-grow-0 mx-2">Redo</button>
    </section>
    <section id="canvas" class="border">
        <svg on:click={e => newCircle(e.offsetX, e.offsetY)} height="500px" width="500px">
            {#each Object.values($circles) as { id, x, y, radius }}
                <Circle {id} {x} {y} {radius} {selectCircle}></Circle>
            {/each}
        </svg>
        <Dialog bind:this={dialog} position={dialogPosition} bind:isEditing></Dialog>
    </section>
</article>
