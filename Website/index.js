var PhysicsMath;
(function (PhysicsMath) {
    class Line {
        point1;
        point2;
        constructor(point1, point2) {
            this.point1 = point1;
            this.point2 = point2;
        }
    }
    PhysicsMath.Line = Line;
    class Scene {
        lines = [];
    }
    PhysicsMath.scene = new Scene();
    function drawScene(scene) {
        Render.context.beginPath();
        for (let line of scene.lines) {
            Render.context.moveTo(line.point1.x, line.point1.y);
            Render.context.lineTo(line.point2.x, line.point2.y);
        }
        Render.context.stroke();
        Render.context.closePath();
    }
    PhysicsMath.drawScene = drawScene;
    function vecMul(vec1, vec2) {
        return { x: vec1.x * vec2.x, y: vec1.y * vec2.y };
    }
    PhysicsMath.vecMul = vecMul;
    function vecMulNum(vec1, n) {
        return vecMul(vec1, { x: n, y: n });
    }
    PhysicsMath.vecMulNum = vecMulNum;
    function vecNormalize(vec) {
        const mag = vecMag(vec);
        vec.x /= mag;
        vec.y /= mag;
    }
    PhysicsMath.vecNormalize = vecNormalize;
    function vecMag(vec) {
        return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
    }
    PhysicsMath.vecMag = vecMag;
    function raycast(pos, dir, length) {
        let point = null;
        for (let line of PhysicsMath.scene.lines) {
            const x1 = line.point1.x;
            const y1 = line.point1.y;
            const x2 = line.point2.x;
            const y2 = line.point2.y;
            const x3 = pos.x;
            const y3 = pos.y;
            const x4 = pos.x + dir.x;
            const y4 = pos.y + dir.y;
            const den = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
            if (den === 0)
                continue;
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
    PhysicsMath.raycast = raycast;
})(PhysicsMath || (PhysicsMath = {}));
/// <reference path="physicsMath.ts" />
var Render;
(function (Render) {
    Render.canvas = document.getElementById("canvas");
    Render.context = Render.canvas.getContext("2d");
    Render.canvas.oncontextmenu = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    function clear() {
        Render.context.clearRect(0, 0, Render.canvas.width, Render.canvas.height);
    }
    Render.clear = clear;
    function drawRaycast(pos, dir, length) {
        // Physics
        const result = PhysicsMath.raycast(pos, dir, length);
        // Draw
        Render.context.beginPath();
        Render.context.moveTo(pos.x, pos.y);
        if (result.point) {
            Render.context.lineTo(result.point.x, result.point.y);
        }
        else {
            Render.context.lineTo(pos.x + (dir.x * 10000), pos.y + (dir.y * 10000));
        }
        Render.context.stroke();
        Render.context.closePath();
    }
    Render.drawRaycast = drawRaycast;
})(Render || (Render = {}));
/// <reference path="render.ts" />
/// <reference path="physicsMath.ts" />
var Input;
(function (Input) {
    Input.mousePosition = { x: 0, y: 0 };
    Render.canvas.addEventListener('pointermove', e => setMousePos(Input.mousePosition, Render.canvas, e));
    function setMousePos(pos, canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        pos.x = evt.clientX - rect.left;
        pos.y = evt.clientY - rect.top;
    }
    function onClick(callback) {
        Render.canvas.addEventListener('click', callback);
    }
    Input.onClick = onClick;
    let timeoutIndex;
    let isHolding = false;
    const holdingPosition = { x: 0, y: 0 };
    Render.canvas.addEventListener('pointerdown', () => {
        holdingPosition.x = Input.mousePosition.x;
        holdingPosition.y = Input.mousePosition.y;
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
            const e = {
                startPosition: { x: holdingPosition.x, y: holdingPosition.y },
                endPosition: { x: Input.mousePosition.x, y: Input.mousePosition.y }
            };
            for (let callback of onHoldReleaseCallbacks)
                callback(e);
        }
    });
    const onHoldCallbacks = [];
    function onHold(callback) {
        onHoldCallbacks.push(callback);
    }
    Input.onHold = onHold;
    const onHoldReleaseCallbacks = [];
    function onHoldRelease(callback) {
        onHoldReleaseCallbacks.push(callback);
    }
    Input.onHoldRelease = onHoldRelease;
})(Input || (Input = {}));
/// <reference path="render.ts" />
/// <reference path="physicsMath.ts" />
/// <reference path="input.ts" />
const pos = {
    x: 10, y: 100
};
const dir = {
    x: 1, y: 0
};
Input.onClick(e => {
    pos.x = Input.mousePosition.x;
    pos.y = Input.mousePosition.y;
});
Input.onHoldRelease(e => {
    PhysicsMath.scene.lines.push(new PhysicsMath.Line(e.startPosition, e.endPosition));
});
function draw() {
    Render.clear();
    dir.x = Input.mousePosition.x - pos.x;
    dir.y = Input.mousePosition.y - pos.y;
    PhysicsMath.vecNormalize(dir);
    PhysicsMath.drawScene(PhysicsMath.scene);
    Render.drawRaycast(pos, dir, 10000);
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
