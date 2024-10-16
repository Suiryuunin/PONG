const canvas = document.querySelector("canvas");

class Renderer
{
    "use strict";

    constructor(canvas)
    {

        this.display = canvas.getContext("2d");
        this.canvas = canvas;
        
        this.settings = document.createElement("canvas").getContext("2d");
        
        this.color = "black";
        this.font = "VCR_OSD";
        this.shakeStr = 8;
        this.stacks = 0;
        this.camShake = 0;
        this.downscale = 1;

        addEventListener("keydown", (e) =>
        {
            switch(e.code)
            {
                case "BracketLeft":
                    this.downscale--;
                    if (this.downscale < 1)
                        this.downscale = 1;
                    this.resize(window.innerWidth, window.innerHeight, res.h/res.w);
                    this.render();
                    break;
                case "BracketRight":
                    this.downscale++;
                    this.resize(window.innerWidth, window.innerHeight, res.h/res.w);
                    this.render();
                    break;
            }
        });
    }

    drawBackground(ctx, color = this.color)
    {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    measureWordWidth(ctx, word, size = 16)
    {
        ctx.font = `${size}px ${this.font}`;
        return ctx.measureText(word)["width"];
    }

    drawWord(ctx, {word, x, y, o = {x:0,y:0}, border = true, size = 16, color = this.color, alpha = 1, linesMargin = 1})
    {
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1;

        ctx.font = `${size}px ${this.font}`;
        let w = 0;
        let widths = [];
        for (let i = 0; i < word.length; i++)
        {
            w = Math.max(w, widths[i] = ctx.measureText(word[i])["width"]);
        }
        
        ctx.fillStyle = color;

        for (let i = 0; i < word.length; i++)
        {
            ctx.fillText(word[i], x + widths[i] * o.x, i*linesMargin + y - size*o.y/1.5, w);
        }

        if (border)
        {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.rect(x + Math.floor(w * o.x), y + o.y, w + 8, size * word.length);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    drawImg(ctx, {x, y, w, h, o}, img, alpha = 1, r = 0, sx=1,sy=1)
    {
        if (alpha == 0) return;

        ctx.globalAlpha = alpha;
        if (o != undefined && r == 0 && sx == 1 && sy == 1)
        {
            x += w * o.x;
            y += h * o.y;
            
            ctx.drawImage(img, x, y, w, h);
            return;
        }
        
        ctx.save();

        if ((sx != 1 || sy != 1) && r != 0)
        {
            ctx.translate(x, y);
            ctx.rotate(r * Math.PI / 180);
            ctx.scale(sx,sy);
            
        }
        else
        {
            if (sx != 1 || sy != 1)
            {
                ctx.translate(x, y);
                ctx.scale(sx,sy);
            }

            if (r != 0)
            {
                ctx.translate(x, y);
                ctx.rotate(r * Math.PI / 180);
            }
        }

        ctx.drawImage(img, w * o.x, h * o.y, w, h);

        // restore the context to its untranslated/unrotated state
        ctx.restore();
    }

    drawRect(ctx, {x, y, w, h, o}, color = this.color, alpha = 1, content = "fill", thickness = 1, color2)
    {
        if (alpha == 0) return;

        ctx.globalAlpha = alpha;
        if (o != undefined)
        {
            x += w*o.x;
            y += h*o.y;
        }

        if (content.includes("border"))
        {
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color2 == undefined ? color : color2;
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.stroke();
        }
        
        if (content.includes("fill"))
        {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        }
        ctx.globalAlpha = 1;
    }

    drawCircle(ctx, {x, y}, r, color = this.color, alpha = 1, content = "fill", thickness = 1, color2)
    {
        if (alpha == 0) return;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);

        if (content.includes("border"))
        {
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color2 == undefined ? color : color2;
            ctx.stroke();
        }
        
        if (content.includes("fill"))
        {
            ctx.fillStyle = color;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    resize(w, h, ratio)
    {
        if (h / w > ratio)
        {
            this.display.canvas.height = Math.ceil(w * ratio/this.downscale);
            this.display.canvas.width =  Math.ceil(w/this.downscale);
        }
        else
        {
            this.display.canvas.height = Math.ceil(h/this.downscale);
            this.display.canvas.width =  Math.ceil(h / ratio/this.downscale);
        }
        this.canvas.style.transform = "translate(-50%, -50%)scale("+this.downscale+"00%)";
    }

    render()
    {
        this.display.imageSmoothingEnabled = true;

        this.display.drawImage(currentCtx.canvas,
            0, 0,
            currentCtx.canvas.width, currentCtx.canvas.height,
            0, 0,
            this.display.canvas.width, this.display.canvas.height);
    }
}