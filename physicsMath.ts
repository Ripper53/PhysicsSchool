namespace PhysicsMath {
    export type Vector2 = {
        x: number
        y : number
    };

    export class Line {
        public point1: Vector2;
        public point2: Vector2;
        constructor(point1: Vector2, point2: Vector2) {
            this.point1 = point1;
            this.point2 = point2;
        }
    }

    class Scene {
        public readonly lines: Line[] = [];
    }
    export const scene: Scene = new Scene();

    export function drawScene(scene: Scene): void {
        Render.context.beginPath();
        for (let line of scene.lines) {
            Render.context.moveTo(line.point1.x, line.point1.y);
            Render.context.lineTo(line.point2.x, line.point2.y);
        }
        Render.context.stroke();
        Render.context.closePath();
    }

    export function vecMul(vec1: Vector2, vec2: Vector2): Vector2 {
        return { x: vec1.x * vec2.x, y: vec1.y * vec2.y };
    }
    export function vecMulNum(vec1: Vector2, n: number): Vector2 {
        return vecMul(vec1, { x: n, y: n });
    }
    export function vecNormalize(vec: Vector2): void {
        const mag: number = vecMag(vec);
        vec.x /= mag;
        vec.y /= mag;
    }
    export function vecMag(vec: Vector2): number {
        return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
    }

    export type RaycastResult = {
        point: Vector2
    }
    export function raycast(pos: Vector2, dir: Vector2, length: number): RaycastResult {
        
        let point: Vector2 = null;
        for (let line of scene.lines) {
            const x1 = line.point1.x;
            const y1 = line.point1.y;
            const x2 = line.point2.x;
            const y2 = line.point2.y;
            const x3 = pos.x;
            const y3 = pos.y;
            const x4 = pos.x + dir.x;
            const y4 = pos.y + dir.y;

            const den = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
            if (den === 0) continue;

            const t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / den;
            const u = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / den;
            
            console.clear();
            console.log(`${t} : ${u}`);
            if (t >= 0 && t <= 1 && u >= 0) {
                point = {
                    x: x1 + (t * (x2 - x1)),
                    y: y1 + (t * (y2 - y1))
                };
            }
        }

        return {
            point: point
        };
    }

}
