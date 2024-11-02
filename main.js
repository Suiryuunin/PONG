"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};


// UI

let cpts1 = 0;
const pts1 = new Word({x:res.w/2-64, y:64, h:128, o:{x:-1, y:-1}}, [cpts1+""], "white");
let cpts2 = 0;
const pts2 = new Word({x:res.w/2+64, y:64, h:128, o:{x:0, y:-1}}, [cpts2+""], "white");

//Game

const ball = new Dynamic("circle", {x:res.w/2,y:res.h/2,w:32,h:32, o: {x:-0.5,y:-0.5}}, "red", new CircleCollider());

const pad1 = new Dynamic("rect", {x:64,y:res.h/2-64,w:32,h:128, o: {x:0,y:0}}, "white", new RectCollider());
const pad2 = new Dynamic("rect", {x:res.w-64,y:res.h/2-64,w:32,h:128, o: {x:-1,y:0}}, "white", new RectCollider());

const EDGEL = new Dynamic("rect", {x:4,    y:0, w:res.w,h:res.h, o: {x:-1,y:0}},  "white", new RectCollider());
const EDGER = new Dynamic("rect", {x:res.w-4,y:0,w:res.w,h:res.h, o: {x:0,y:0}}, "white", new RectCollider());
const EDGET = new Dynamic("rect", {x:0,y:4,     w:res.w,h:res.h, o: {x:0,y:-1}},  "white", new RectCollider());
const EDGEB = new Dynamic("rect", {x:0,y:res.h-4,w:res.w,h:res.h, o: {x:0,y:0}}, "white", new RectCollider());

const DLHitbox = new Dynamic("rect", {x:res.w/2,y:0,w:16,h:res.h, o: {x:-0.5,y:0}}, "white", new RectCollider()); 
DLHitbox.hitbox.reposition = false;

const point = new Dynamic("circle", {x:0,y:-10,w:16,h:16, o: {x:-0.5,y:-0.5}}, "red");
const point2 = new Dynamic("circle", {x:0,y:-10,w:16,h:16, o: {x:-0.5,y:-0.5}}, "green");
const circle1 = new Dynamic("circle", {x:0,y:-10,w:ball.t.w,h:ball.t.h, o: {x:-0.5,y:-0.5}}, "yellow");
const circle2 = new Dynamic("circle", {x:0,y:-10,w:ball.t.w,h:ball.t.h, o: {x:-0.5,y:-0.5}}, "yellow");

point.alpha   = 0;
point2.alpha  = 0;
circle1.alpha = 0;
circle2.alpha = 0;

SCENE.elements = [point,
    point2, circle1, circle2, ball, pad1, pad2, EDGEL, EDGER, EDGET, EDGEB, 
    pts1, pts2];

ball.v.x = 1024;
ball.v.y = 512;

//HARD CODED HELPERS ;-;
let my = 0;
let my2 = 0;

let aa = 0;
let kk = 0;

let padSpeed = P_PADACCELERATION/(1/30);
let lps = padSpeed * _DELTATIME;

const update = () =>
{
    // bgm..
    BGM.volume = VOLUME/10/2;

    //pad speed based on deltatime
    lps = padSpeed * _DELTATIME;

    // Switch directions on input
    switch (true)
    {
        case (keys["KeyW"]):
            my = 1;
            break;

        case (keys["KeyS"]):
            my = -1;
            break;

        default:
            my = 0;
            break;
    }
    switch (true)
    {
        case (keys["ArrowUp"]):
            my2 = 1;
            break;

        case (keys["ArrowDown"]):
            my2 = -1;
            break;

        default:
            my2 = 0;
            break;
    }

    if (freeze || win) return;

    //pad controls/CPU
    if (P_VERSUS == 3)
        pad1.v.y += (ball.center.y > pad1.center.y ? -lps : (ball.center.y == pad1.center.y ? -pad1.v.y : lps));
    else
        pad1.v.y = my != 0 ? pad1.v.y + lps*my : (Math.abs(pad1.v.y)-lps >= 0 ? pad1.v.y-lps*Math.sign(pad1.v.y) : 0);

    if (P_VERSUS > 0)
        pad2.v.y += (ball.center.y > pad2.center.y ? -lps : (ball.center.y == pad2.center.y ? -pad2.v.y : lps));
    else
        pad2.v.y = my2 != 0 ? pad2.v.y + lps*my2 : (Math.abs(pad2.v.y)-lps >= 0 ? pad2.v.y-lps*Math.sign(pad2.v.y) : 0);

    SCENE.update();


    // pad top bottom limits
    if (pad1.t.y <= 4)
    {
        pad1.v.y = 0;
        pad1.t.y = 4 + pad1.t.h*pad1.t.o.y;
    }
    if (pad1.t.y >= res.h - 4 - pad1.t.h + pad1.t.h*pad1.t.o.y)
    {
        pad1.v.y = 0;
        pad1.t.y =  res.h - 4 - pad1.t.h + pad1.t.h*pad1.t.o.y;
    }
    if (pad2.t.y <= 4)
    {
        pad2.v.y = 0;
        pad2.t.y = 4 + pad2.t.h*pad2.t.o.y;
    }
    if (pad2.t.y >= res.h - 4 - pad2.t.h + pad2.t.h*pad2.t.o.y)
    {
        pad2.v.y = 0;
        pad2.t.y =  res.h - 4 - pad2.t.h + pad2.t.h*pad2.t.o.y;
    }

    // Collisions
    SCENE.collisionsWith (
        ball, (target) => {
            const sfx = new Audio(SFXPath);
            sfx.volume = VOLUME/10;
            sfx.play();
            target.saturation = 100;
            ball.saturation = 100;

            if (target === pad1 || target === pad2)
                ball.v.y += target.v.y *0.4;

            switch (target)
            {
                case EDGEL:
                    cpts2++;
                    pts2.word = [cpts2+""];

                    if (P_VERSUS == 2 && cpts2 >= 1)
                    {
                        SCENE.elements.push(new Word({x:res.w/2, y:res.h/2, h:128, o:{x:-0.5, y:-0.5}}, ["GAME OVER"], "white"));
                        SCENE.elements.push(new Word({x:res.w/2, y:res.h/2+128, h:64, o:{x:-0.5, y:-0.5}}, ["Press Esc. To Continue"], "white"));
                        win = true;
                        return;
                    }
                        
                    if (cpts2 >= P_TARGETSCORE && !started)
                    {
                        SCENE.elements.push(new Word({x:res.w/2, y:res.h/2, h:128, o:{x:-0.5, y:-0.5}}, ["PLAYER 2 WINS"], "white"));
                        SCENE.elements.push(new Word({x:res.w/2, y:res.h/2+128, h:64, o:{x:-0.5, y:-0.5}}, ["Press Esc. To Continue"], "white"));
                        win = true;
                    }

                    if (P_MODE == 1)
                    {
                        ball.t.x = res.w/2;
                        ball.t.y = res.h/2;
                        ball.v.x = P_HORIZONTALSPEED * 64;
                        ball.v.y = 512;
                    }
                    break;

                case EDGER:
                    cpts1++;
                    pts1.word = [cpts1+""];

                    if (cpts1 >= P_TARGETSCORE && !started)
                    {
                        SCENE.elements.push(new Word({x:res.w/2, y:res.h/2, h:128, o:{x:-0.5, y:-0.5}}, ["PLAYER 1 WINS"], "white"));
                        SCENE.elements.push(new Word({x:res.w/2, y:res.h/2+128, h:64, o:{x:-0.5, y:-0.5}}, ["Press Esc. To Continue"], "white"));
                        win = true;
                    }

                    if (P_MODE == 1 && P_VERSUS != 2)
                    {
                        ball.t.x = res.w/2;
                        ball.t.y = res.h/2;
                        ball.v.x = P_HORIZONTALSPEED * 64;
                        ball.v.y = 512;
                    }
                    break;
            }
        },
        // collide pad corner
        (target) => {
            
            ball.v.x *= -1;
            ball.v.y *= -1;
        },
        // collide pad edge
        (target, tsides, l = undefined, r = undefined, t = undefined, b = undefined) => {
            if (l != undefined)
            {
                tsides.l = (ball.oldcenter.x < l);
                tsides.r = (ball.oldcenter.x > r);
                tsides.t = (ball.oldcenter.x < t);
                tsides.b = (ball.oldcenter.x > b);
            }

            switch(true)
            {
                case tsides.l: case tsides.r:
                    ball.v.x *= -1;
                    break;

                case tsides.t: case tsides.b:
                    ball.v.y *= -1;
                    break;
            }
            aa = -ball.v.y/ball.v.x;
            kk = ball.hitbox.center.y - aa*ball.hitbox.center.x;
            xxx1 = 0;
            yyy1 = kk;
            xxx2 = res.w;
            yyy2 = res.w*aa+kk;
        },
    );

    // Dashed line color change
    if (ball.collideWith(DLHitbox))
        dsaturation = 100;

    // Ball clipped! Reset position
    if (ball.t.x < 0 || ball.t.x > res.w || ball.t.y < 0 || ball.t.y > res.h)
    {
        ball.t.x = res.w/2;
        ball.t.y = res.h/2;
        ball.v.x = P_HORIZONTALSPEED * 64;
        ball.v.y = 512;
    }

    // Ball clipped! Reset position
    if (ball.t.x != ball.t.x || ball.t.y != ball.t.y)
    {
        ball.t.x = res.w/2;
        ball.t.y = res.h/2;
    }

    // Retired Helpers
    // aa = (ball.center.y-ball.oldcenter.y) / (ball.center.x-ball.oldcenter.x);
    // kk = ball.center.y-aa*ball.center.x;
    xxx1 = 0;
    yyy1 = kk;
    xxx2 = res.w;
    yyy2 = res.w*aa+kk;
};

// Retired Helpers
// hard coded helpers (BLASPHEMEOUS!!!!!!!!)
let xx1 = 0;
let yy1 = 0;
let xx2 = 0;
let yy2 = 0;

let xxx1 = 0;
let yyy1 = 0;
let xxx2 = 0;
let yyy2 = 0;

let dsaturation = 0;
let dcolor = `hsl(${HUE}, ${dsaturation}%, ${50-dsaturation/2+50}%)`;
const render = () =>
{
    rr.drawBackground(currentCtx, "black");

    // *special for pong (color)
    if (dsaturation < 0) dsaturation = 0;
    dcolor = `hsl(${HUE}, ${dsaturation}%, ${50-dsaturation/2+50}%)`;
    if (dsaturation > 0) dsaturation-=2/(1/30)*_DELTATIME;
    rr.drawLine(currentCtx, {x1:res.w/2, y1:64}, {x2:res.w/2, y2:res.h-32}, dcolor, 1, 16, 64, 64);

    SCENE.render();
    // Retired Helpers
    // rr.drawLine(currentCtx, {x1:xx1, y1:yy1}, {x2:xx2, y2:yy2}, "hotpink", 0.5);
    // rr.drawLine(currentCtx, {x1:xxx1, y1:yyy1}, {x2:xxx2, y2:yyy2}, "hotpink", 0.5);
    rr.drawLine(currentCtx, {x1:ball.center.x, y1:ball.center.y}, {x2:ball.oldcenter.x, y2:ball.oldcenter.y}, "white", 0.3);


    // Draw Settings Panel
    if (gameState == 0)
    {
        currentCtx.globalAlpha = 0.3;
        rr.drawBackground(currentCtx, `hsl(${HUE}, 100%, 50%)`);

        rr.drawBackground(rr.settings, "black");
        rr.drawRect(rr.settings, {x:0,y:0,w:rr.settings.canvas.width, h:rr.settings.canvas.height, o:{x:0,y:0}}, "white", 1, "border", 4);
        for (const e of pages[currentPage])
        {
            e.render(rr.settings);
        }
            
    }
    currentCtx.globalAlpha = 0.5/(1/30)*_DELTATIME;

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