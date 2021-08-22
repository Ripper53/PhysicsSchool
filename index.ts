/// <reference path="render.ts" />
/// <reference path="physicsMath.ts" />
/// <reference path="input.ts" />

const pos: PhysicsMath.Vector2 = {
    x: 10, y: 100
};

const dir: PhysicsMath.Vector2 = {
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
