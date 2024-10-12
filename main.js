"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};

const rect = new Dynamic("color", {x:0,y:0,w:128,h:128, o: {x:0,y:0}}, "hotpink", _RECTCOLLIDER);
// const rect2 = new Dynamic("color", {x:512,y:0,w:128,h:128, o: {x:0,y:0}}, "black", _RECTCOLLIDER);

const update = () =>
{
    rect.t.x+=4;

    rect.update();
    // rect2.update();

    // if (rect.hitbox.isCollidingWith(rect2.hitbox))
    //     console.log("HIT");
};

const render = () =>
{
    rr.drawBackground(currentCtx, "white");
    // rr.drawRect(currentCtx, {x:0,y:0,w:128,h:128, o: {x:0,y:0}});
    rect.render();
    // rect2.render();

    rr.render();
};


const _ENGINE = new Engine(60, update, render);
_ENGINE.start();

addEventListener("load", () => {resize();});

addEventListener("resize", resize);