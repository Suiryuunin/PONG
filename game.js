function toCanvasCoords(cv, ctx, pageX, pageY)
{
    const _rect = cv.getBoundingClientRect();
    const scale = {x: cv.width/ctx.canvas.width, y: cv.height/ctx.canvas.height};
    
    let x = (pageX-_rect.left) / scale.x;
    let y = (pageY-_rect.top) / scale.y;

    return {x, y};
}

let gameState = 0;

const rr = new Renderer(canvas);

let currentCtx = document.createElement("canvas").getContext("2d");
currentCtx.canvas.width = res.w;
currentCtx.canvas.height = res.h;
rr.settings.canvas.width = res.w*rr.sScale;
rr.settings.canvas.height = res.h*rr.sScale;

const SCENE = new Scene();

// addEventListener("keydown", (e) =>
// {
//     if ((e.code == _DSKEYS[0] || e.code == _DSKEYS[1]) && _DOWNSCALE != _PDOWNSCALE)
//     {
//         SCENE.elements.callNodeMethods((node) => {
//             node.t.x   = Math.round(node.t.x   / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.y   = Math.round(node.t.y   / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.w   = Math.round(node.t.w   / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.h   = Math.round(node.t.h   / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.o.x = Math.round(node.t.o.x / (_DOWNSCALE/_PDOWNSCALE));
//             node.t.o.y = Math.round(node.t.o.y / (_DOWNSCALE/_PDOWNSCALE));
//             node.v.x   = Math.round(node.v.x   / (_DOWNSCALE/_PDOWNSCALE));
//             node.v.y   = Math.round(node.v.y   / (_DOWNSCALE/_PDOWNSCALE));
//         });
//     }
// });

function SETUP()
{
                                
    P_VERSUS          = _VERSUS;
    P_MODE            = _MODE;
    P_TARGETSCORE     = _TARGETSCORE;
    P_PADACCELERATION = _PADACCELERATION;
    P_HORIZONTALSPEED = _HORIZONTALSPEED;

    pad1.t.y = res.h/2-64;
    pad1.v.y = 0;
    pad2.t.y = res.h/2-64;
    pad2.v.y = 0;

    padSpeed = P_PADACCELERATION/(1/30);

    ball.t.x = res.w/2;
    ball.t.y = res.h/2;
    ball.v.x = P_HORIZONTALSPEED * 64;
    ball.v.y = 512;

    cpts1 = 0;
    pts1.word = cpts1+"";
    cpts2 = 0;
    pts2.word = cpts2+"";
}

let ESCReleased = true;
let freeze = false;
let win = false;
let started = true;
addEventListener("keydown", (e) => {
    if (e.code == "Escape" && ESCReleased)
    {
        switch(gameState)
        {
            case 0:
                started = false;
                gameState = 1;
                freeze = false;

                if (_VERSUS != P_VERSUS || _MODE != P_MODE || _TARGETSCORE != P_TARGETSCORE || _PADACCELERATION != P_PADACCELERATION || P_HORIZONTALSPEED != _HORIZONTALSPEED)
                    SETUP();
                break;

            case 1:
                gameState = 0;
                freeze = true;
  
                P_VERSUS          = _VERSUS;
                P_MODE            = _MODE;
                P_TARGETSCORE     = _TARGETSCORE;
                P_PADACCELERATION = _PADACCELERATION;
                P_HORIZONTALSPEED = _HORIZONTALSPEED;
                if (win)
                {
                    started = true;
                    _VERSUS = 3;
                    SETUP();
                    _VERSUS = 0;

                    SCENE.elements = [point,
                        point2, circle1, circle2, ball, pad1, pad2, EDGEL, EDGER, EDGET, EDGEB, 
                        pts1, pts2];
                        win = false;

                        freeze = false;
                }
                break;
        }
        ESCReleased = false;
    }
});

addEventListener("keyup", (e) => {
    if (e.code == "Escape" && !ESCReleased)
        ESCReleased = true;
});