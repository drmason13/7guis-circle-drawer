import { writable } from 'svelte/store';

// makes a new Circle
function newCircle({ id, x, y, radius }) {
    return {
        do: ()  => {
            circles.update(c => {
                c[id] = { id, x, y, radius, confirmedRadius: radius };
                return c
            });
        },
        undo: () => {
            circles.update(c => {
                delete c[id];
                return c
            });
        }
    }
}

// confirms the current radius as significant for the history
function confirmRadius({ id, newRadius }) {
    // oh filthy!
    let previousRadius;

    return {
        do: () => {
            circles.update(c => {
                let circle = c[id];
                previousRadius = circle.confirmedRadius;
                circle.radius = newRadius;
                circle.confirmedRadius = newRadius;
                return c
            });
        },
        undo: () => {
            circles.update(c => {
                let circle = c[id];
                circle.radius = previousRadius;
                circle.confirmedRadius = previousRadius;
                return c
            });
        }
    }
}

// custom history store to implement undo / redo
export function buildHistory() {
    const { subscribe, update } = writable({
        undo: [],
        redo: [],
    });

    return {
        subscribe,
        do: action => update(({ undo, redo }) => {
            action.do();
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
                action.do();
                undo.push(action);
            }
            return { undo, redo }
        }),
	};
}

export const circles = writable({});
export const selected = writable(null);
export const history = buildHistory();
export const actions = {
    newCircle,
    confirmRadius,
}
