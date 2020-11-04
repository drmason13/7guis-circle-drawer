<script>
    import {selected} from './stores.js';

    export let id, x, y, radius, selectCircle;
    export let stroke = "black";
    export let fill = "transparent";
    export let strokeWidth = 1;
</script>

<circle class="text-transparent fill-current hover:text-beige-300" class:text-beige-300="{$selected === id}" cx={x} cy={y} r={radius} {stroke} {fill} stroke-width={strokeWidth} on:click|stopPropagation={e => selectCircle(id, e)}/>