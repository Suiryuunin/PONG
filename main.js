"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};


const rect = new Dynamic("rect", {x:256,y:256,w:128,h:128, o: {x:-0.7,y:0.7}}, "hotpink", new RectCollider());
let rect2 = new Dynamic("circle", {x:512,y:256,w:128,h:128, o: {x:0,y:0}}, "black", new CircleCollider());
const rect3 = new Dynamic("circle", {x:64,y:256,w:128,h:128, o: {x:-0.5,y:0}}, "black", new CircleCollider());
let rect4 = new Dynamic("circle", {x:128*2,y:0,w:128,h:128, o: {x:0,y:0}}, "pink", new CircleCollider());
let rect5 = new Dynamic("circle", {x:128*2,y:512,w:128,h:128, o: {x:0,y:0}}, "pink", new CircleCollider());
let point = new Dynamic("circle", {x:0,y:0,w:16,h:16, o: {x:-0.5,y:-0.5}}, "red");

SCENE.init(rect);
SCENE.addBulk([point,rect2, rect3, rect4, rect5]);

rect.v.x = 512;

const update = () =>
{
    SCENE.update();
    SCENE.collisionsWith(rect, () =>
    {
        rect.v.x *= -1;
        
    });
};

const render = () =>
{
    rr.drawBackground(currentCtx, "white");
    // rr.drawRect(currentCtx, {x:0,y:0,w:128,h:128, o: {x:0,y:0}});

    SCENE.render();

    rr.render();
};

window.addEventListener("click", () =>
{
    SCENE.deleteItem(rect2);
    rect2 = null;
});


const _ENGINE = new Engine(30, update, render);
_ENGINE.start();

addEventListener("load", () => {resize();});

addEventListener("resize", resize);