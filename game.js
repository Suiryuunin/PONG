function toCanvasCoords(pageX, pageY)
{
    const _rect = document.querySelector("canvas").getBoundingClientRect();
    const scale = {x: canvas.width/currentCtx.canvas.width, y: canvas.height/currentCtx.canvas.height};
    
    let x = (pageX-_rect.left) / scale.x;
    let y = (pageY-_rect.top) / scale.y;

    return {x, y};
}

const rr = new Renderer(canvas);

const _RECTCOLLIDER = new RectCollider({x:0,y:0,w:0,h:0, o: {x:0,y:0}}, _BLOCKALL)

let currentCtx = document.createElement("canvas").getContext("2d");
currentCtx.canvas.width = res.w;
currentCtx.canvas.height = res.h;