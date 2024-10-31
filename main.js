"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};


const ball = new Dynamic("circle", {x:res.w/2,y:res.h/2,w:32,h:32, o: {x:-0.5,y:-0.5}}, "red", new CircleCollider());

const pad1 = new Dynamic("rect", {x:64,y:res.h/2-64,w:32,h:128, o: {x:0,y:0}}, "white", new RectCollider());
const pad2 = new Dynamic("rect", {x:res.w-64,y:res.h/2-64,w:32,h:128, o: {x:-1,y:0}}, "white", new RectCollider());

const EDGEL = new Dynamic("rect", {x:0,    y:0,w:4,h:res.h, o: {x:0,y:0}},  "white", new RectCollider());
const EDGER = new Dynamic("rect", {x:res.w,y:0,w:4,h:res.h, o: {x:-1,y:0}}, "white", new RectCollider());
const EDGET = new Dynamic("rect", {x:0,y:0,    w:res.w,h:4, o: {x:0,y:0}},  "white", new RectCollider());
const EDGEB = new Dynamic("rect", {x:0,y:res.h,w:res.w,h:4, o: {x:0,y:-1}}, "white", new RectCollider());

const point = new Dynamic("circle", {x:0,y:-10,w:16,h:16, o: {x:-0.5,y:-0.5}}, "red");
const point2 = new Dynamic("circle", {x:0,y:-10,w:16,h:16, o: {x:-0.5,y:-0.5}}, "green");
const circle1 = new Dynamic("circle", {x:0,y:-10,w:ball.t.w,h:ball.t.h, o: {x:-0.5,y:-0.5}}, "yellow");
const circle2 = new Dynamic("circle", {x:0,y:-10,w:ball.t.w,h:ball.t.h, o: {x:-0.5,y:-0.5}}, "yellow");

point.alpha = 0;
point2.alpha = 0;
circle1.alpha = 0;
circle2.alpha = 0;

SCENE.init(point);
SCENE.addBulk([point2, circle1, circle2, ball, pad1, pad2, EDGEL, EDGER, EDGET, EDGEB]);

ball.v.x = 1024;
ball.v.y = 512;
let my = 0;

let aa = 0;
let kk = 0;

const update = () =>
{
    switch (true)
    {
        case (keys["KeyW"] || keys["ArrowUp"]):
            my = 1;
            break;

        case (keys["KeyS"] || keys["ArrowDown"]):
            my = -1;
            break;

        default:
            my = 0;
            break;
    }

    pad1.v.y += my != 0 ? 32*my : -32*Math.sign(pad1.v.y);
    pad2.v.y += (ball.center.y > pad2.center.y ? -32 : (ball.center.y == pad2.center.y ? -pad2.v.y : 32));

    SCENE.update();


    if (pad1.t.y <= EDGET.t.h)
    {
        pad1.v.y = 0;
        pad1.t.y = EDGET.t.h + pad1.t.h*pad1.t.o.y;
    }
    if (pad1.t.y >= res.h - EDGET.t.h - pad1.t.h + pad1.t.h*pad1.t.o.y)
    {
        pad1.v.y = 0;
        pad1.t.y =  res.h - EDGET.t.h - pad1.t.h + pad1.t.h*pad1.t.o.y;
    }
    if (pad2.t.y <= EDGET.t.h)
    {
        pad2.v.y = 0;
        pad2.t.y = EDGET.t.h + pad2.t.h*pad2.t.o.y;
    }
    if (pad2.t.y >= res.h - EDGET.t.h - pad2.t.h + pad2.t.h*pad2.t.o.y)
    {
        pad2.v.y = 0;
        pad2.t.y =  res.h - EDGET.t.h - pad2.t.h + pad2.t.h*pad2.t.o.y;
    }

    SCENE.collisionsWith (
        ball, undefined,
        (target) => {
            target.parent.red = 0;
            ball.red = 0;
            ball.v.x *= -1;
            ball.v.y *= -1;
        },
        (target, tsides) => {
            target.parent.red = 0;
            ball.red = 0;
            switch(true)
            {
                case tsides.l: case tsides.r:
                    ball.v.x *= -1;
                    break;

                case tsides.t: case tsides.b:
                    ball.v.y *= -1;
                    break;
            }
            // aa = -ball.v.y/ball.v.x;
            // kk = ball.hitbox.center.y - aa*ball.hitbox.center.x;
            xxx1 = 0;
            yyy1 = kk;
            xxx2 = res.w;
            yyy2 = res.w*aa+kk;
        },
    )
            
    aa = (ball.center.y-ball.oldcenter.y) / (ball.center.x-ball.oldcenter.x);
    kk = ball.center.y-aa*ball.center.x;
    xxx1 = 0;
    yyy1 = kk;
    xxx2 = res.w;
    yyy2 = res.w*aa+kk;
};

let xx1 = 0;
let yy1 = 0;
let xx2 = 0;
let yy2 = 0;

let xxx1 = 0;
let yyy1 = 0;
let xxx2 = 0;
let yyy2 = 0;
const render = () =>
{
    rr.drawBackground(currentCtx, "black");
    rr.drawLine(currentCtx, {x1:res.w/2, y1:64}, {x2:res.w/2, y2:res.h-32}, "red", 1, 16, 64, 64);

    SCENE.render();
    // rr.drawLine(currentCtx, {x1:xx1, y1:yy1}, {x2:xx2, y2:yy2}, "hotpink", 0);
    // rr.drawLine(currentCtx, {x1:xxx1, y1:yyy1}, {x2:xxx2, y2:yyy2}, "hotpink", 0);
    // rr.drawLine(currentCtx, {x1:ball.center.x, y1:ball.center.y}, {x2:ball.oldcenter.x, y2:ball.oldcenter.y}, "green", 0);

    rr.render();
};

const keys = {
    "KeyW": false,
    "KeyS": false,
    "ArrowUp": false,
    "ArrowDown": false
}

window.addEventListener("keydown", (e) => {
    if(keys[e.code] === false)
        keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
    if(keys[e.code] === true)
        keys[e.code] = false;
});

// window.addEventListener("click", () =>
// {
//     SCENE.deleteItem(rect2);
//     rect2 = null;
// });


const _ENGINE = new Engine(30, update, render);
_ENGINE.start();

addEventListener("load", () => {resize();});

addEventListener("resize", resize);