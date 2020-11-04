import { writable } from 'svelte/store';

// makes a record of a "New Circle" action for the history
export function newCircleAction({ id, x, y, radius }) {
    return {
        undo: () => {
            circles.update(c => {
                delete c[id];
                return c
            });
        },
        redo: () => {
            circles.update(c => {
                c[id] = { id, x, y, radius };
                return c
            });
        }
    }
}

// makes a record of a "Changed Radius" action for the history
export function changedRadiusAction({ id, prevRadius, newRadius }) {
    return {
        undo: () => {
            circles.update(c => {
                c[id].radius = prevRadius;
                return c
            });
        },
        redo: () => {
            circles.update(c => {
                c[id].radius = newRadius;
                return c
            });
        }
    }
}

// custom history store to implement undo / redo
export function buildHistory() {
    const { subscribe, set, update } = writable({
        undo: [],
        redo: [],
    });

    return {
        subscribe,
        do: action => update(({ undo, redo }) => {
            // remember what we did so we can undo it later
            undo.push(action);
            // doing something new clears the redo buffer
            redo = [];
            return { undo, redo }
        }),
		undo: () => update(({ undo, redo }) => {
            const action = undo.pop();
            if (typeof action !== 'undefined') {
                action.undo();
                redo.push(action);
            }
            return { undo, redo }
        }),
		redo: () => update(({ undo, redo }) => {
            const action = redo.pop();
            if (typeof action !== 'undefined') {
                action.redo();
                undo.push(action);
            }
            return { undo, redo }
        }),
		clear: () => set({ undo: [], redo: [] }),
	};
}

export const circles = writable({});
export const selected = writable(null);
export const history = buildHistory();