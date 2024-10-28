"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};


const rect = new Dynamic("rect", {x:10,y:16,w:128,h:128, o: {x:0,y:0}}, "hotpink", new RectCollider());
let rect2 = new Dynamic("circle", {x:512,y:0,w:128,h:128, o: {x:0,y:0}}, "black", new CircleCollider());
const rect3 = new Dynamic("rect", {x:16,y:0,w:128,h:128, o: {x:-1,y:0}}, "black", new RectCollider());
SCENE.init(rect);
SCENE.addBulk([rect2, rect3]);

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