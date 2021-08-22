/// <reference path="render.ts" />
/// <reference path="physicsMath.ts" />

namespace Input {
    export const mousePosition: PhysicsMath.Vector2 = { x: 0, y: 0 };

    Render.canvas.addEventListener('pointermove', e => setMousePos(mousePosition, Render.canvas, e));
    function setMousePos(pos: PhysicsMath.Vector2, canvas: HTMLCanvasElement, evt: MouseEvent): void {
        const rect = canvas.getBoundingClientRect();
        pos.x = evt.clientX - rect.left;
        pos.y = evt.clientY - rect.top;
    }

    export interface OnClickCallback {
        (e: MouseEvent): void;
    }
    export function onClick(callback: OnClickCallback) {
        Render.canvas.addEventListener('click', callback);
    }
    
    let timeoutIndex: number;
    let isHolding: boolean = false;
    const holdingPosition: PhysicsMath.Vector2 = { x: 0, y: 0 };
    Render.canvas.addEventListener('pointerdown', () => {
        holdingPosition.x = mousePosition.x;
        holdingPosition.y = mousePosition.y;
        timeoutIndex = setTimeout(() => {
            isHolding = true;
            for (let callback of onHoldCallbacks)
                callback();
        }, 200);
    });
    Render.canvas.addEventListener('pointerup', () => {
        clearTimeout(timeoutIndex);
        if (isHolding) {
            isHolding = false;
            const e: OnHoldReleaseEvent =  {
                startPosition: { x: holdingPosition.x, y: holdingPosition.y },
                endPosition: { x: mousePosition.x, y: mousePosition.y }
            };
            for (let callback of onHoldReleaseCallbacks)
                callback(e);
        }
    });

    export interface OnHoldCallback {
        (): void;
    }
    const onHoldCallbacks: OnHoldCallback[] = [];
    export function onHold(callback: OnHoldCallback) {
        onHoldCallbacks.push(callback);
    }

    export interface OnHoldReleaseEvent {
        readonly startPosition: PhysicsMath.Vector2;
        readonly endPosition: PhysicsMath.Vector2;
    }
    export interface OnHoldReleaseCallback {
        (e: OnHoldReleaseEvent): void;
    }
    const onHoldReleaseCallbacks: OnHoldReleaseCallback[] = [];
    export function onHoldRelease(callback: OnHoldReleaseCallback) {
        onHoldReleaseCallbacks.push(callback);
    }

}
