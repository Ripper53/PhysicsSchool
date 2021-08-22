/// <reference path="physicsMath.ts" />

namespace Render {
    export const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    export const context: CanvasRenderingContext2D = canvas.getContext("2d");

    canvas.oncontextmenu = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    export function clear(): void {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    export function drawRaycast(pos: PhysicsMath.Vector2, dir: PhysicsMath.Vector2, length: number): void {
        // Physics
        const result: PhysicsMath.RaycastResult = PhysicsMath.raycast(pos, dir, length);

        // Draw
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        if (result.point) {
            context.lineTo(result.point.x, result.point.y);
        } else {
            context.lineTo(pos.x + (dir.x * 10000), pos.y + (dir.y * 10000));
        }
        context.stroke();
        context.closePath();
    }
    
}
