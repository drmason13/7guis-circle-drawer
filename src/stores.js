import { writable } from 'svelte/store';
import { get } from 'svelte/store';

export const history = writable([]);

// custom store to implement undo / redo
export const undo = () => { console.log(`Undo: ${get(history)}`) };
export const redo = () => { console.log(`Redo: ${get(history)}`) };

export const circles = writable({});
export const selected = writable(null);