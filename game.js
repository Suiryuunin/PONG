function toCanvasCoords(pageX, pageY)
{
    const _rect = document.querySelector("canvas").getBoundingClientRect();
    const scale = {x: canvas.width/currentCtx.canvas.width, y: canvas.height/currentCtx.canvas.height};
    
    let x = (pageX-_rect.left) / scale.x;
    let y = (pageY-_rect.top) / scale.y;

    return {x, y};
}

const rr = new Renderer(canvas);

let currentCtx = document.createElement("canvas").getContext("2d");
currentCtx.canvas.width = res.w;
currentCtx.canvas.height = res.h;

const SCENE = new Scene();