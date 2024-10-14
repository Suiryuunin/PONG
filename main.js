"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};


const rect = new Dynamic("circle", {x:10,y:96,w:128,h:128, o: {x:0,y:0}}, "hotpink", new CircleCollider());
const rect2 = new Dynamic("circle", {x:512,y:0,w:128,h:128, o: {x:0,y:0}}, "black", new CircleCollider());
const rect3 = new Dynamic("rect", {x:16,y:0,w:128,h:128, o: {x:-1,y:0}}, "black", new RectCollider());

rect.v.x = 512;

const update = () =>
{
    rect.update();
    rect2.update();
    rect3.update();

    if (rect.hitbox.isCollidingWith(rect2.hitbox))
        rect.v.x *= -1;

    if (rect.hitbox.isCollidingWith(rect3.hitbox))
        rect.v.x *= -1;
};

const render = () =>
{
    rr.drawBackground(currentCtx, "white");
    // rr.drawRect(currentCtx, {x:0,y:0,w:128,h:128, o: {x:0,y:0}});
    rect.render();
    rect2.render();
    rect3.render();

    rr.render();
};


const _ENGINE = new Engine(30, update, render);
_ENGINE.start();

addEventListener("load", () => {resize();});

addEventListener("resize", resize);