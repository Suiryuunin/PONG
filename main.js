"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};


const ball = new Dynamic("circle", {x:256,y:256,w:32,h:32, o: {x:-0.7,y:-0.7}}, "hotpink", new CircleCollider());
const pad1 = new Dynamic("rect", {x:64,y:256,w:32,h:128, o: {x:0,y:0}}, "black", new RectCollider());
const pad2 = new Dynamic("rect", {x:res.w-64,y:256,w:32,h:128, o: {x:-1,y:0}}, "black", new RectCollider());
const point = new Dynamic("circle", {x:0,y:0,w:16,h:16, o: {x:-0.5,y:-0.5}}, "black");
point.alpha = 0;

SCENE.init(point);
SCENE.addBulk([ball, pad1, pad2]);

ball.v.x = -512;

const update = () =>
{
    SCENE.update();
    SCENE.collisionsWith(ball, () =>
    {
        ball.v.x *= -1;
    });
};

const render = () =>
{
    rr.drawBackground(currentCtx, "white");
    rr.drawRect(currentCtx, {x:0,y:0,w:res.w,h:res.h, o: {x:0,y:0}}, "black", 1, "border", 4)
    // rr.drawRect(currentCtx, {x:0,y:0,w:128,h:128, o: {x:0,y:0}});

    SCENE.render();

    rr.render();
};

// window.addEventListener("click", () =>
// {
//     SCENE.deleteItem(rect2);
//     rect2 = null;
// });


const _ENGINE = new Engine(30, update, render);
_ENGINE.start();

addEventListener("load", () => {resize();});

addEventListener("resize", resize);