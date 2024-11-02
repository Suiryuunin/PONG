class Button extends Dynamic
{
    constructor(page, type, {x,y,w,h,o}, c, a = 1, action = undefined, cc = undefined, cs = undefined, hc = undefined, hs = undefined, word = "", wc = undefined, wa = 1, wSize = undefined)
    {
        super(type, {x,y,w,h,o}, c);

        this.page = page;
        this.action = action;
        this.mouse = false;
        this.pressedFirst = false;

        this.alpha = a;
        this.wAlpha = wa;
        this.word = word;
        this.wc = wc;
        this.wox = 0;
        this.wSize = wSize;
        this.wh = this.t.h*wSize;
        this.border = false;

        this.cv = rr.sBoundingBox;
        this.ctx = rr.settings;

        this.interactable = true;
        this.canHover = false;
        this.canClick = false;

        if (hc != undefined)
        {
            this.canHover = true;
            this.hc = hc;
            this.hs = hs;

            document.addEventListener("mousemove", (e) =>
            {
                if (this.page != currentPage) return;
                
                const p = toCanvasCoords(this.cv, this.ctx, e.clientX, e.clientY);
                if (!this.isOCollidingWith({x:p.x, y:p.y, w:0, h:0, o:{x:-0.5,y:-0.5}}))
                {
                    this.hovering = false;
                    this.c = this.oc;
                    this.scaleTo({w:this.ot.w, h:this.ot.h});
                }
                else if (!this.hovering && this.canHover)
                {
                    this.c = this.hc;
                    this.scaleBy(hs);
                    this.hovering = true;
                }
            });
        }

        if (cc != undefined)
        {
            this.canClick = true;
            this.cc = cc;
            this.cs = cs;

            document.addEventListener("mousedown", (e) =>
            {
                if (this.page != currentPage) {this.pressedFirst = false; return;}
                this.pressedFirst = true;
                
                const p = toCanvasCoords(this.cv, this.ctx, e.clientX, e.clientY);
                if (this.isCollidingWith({x:p.x, y:p.y, w:0, h:0, o:{x:-0.5,y:-0.5}}) && this.canClick)
                {
                    this.mouse = true;
                    this.c = this.cc;
                    this.scaleBy(cs);
                }
            });

            document.addEventListener("mouseup", (e) =>
            {
                if (this.page != currentPage || this.pressedFirst == false) return;

                this.pressedFirst = false;

                this.mouse = false;
                const p = toCanvasCoords(this.cv, this.ctx, e.clientX, e.clientY);
                if (this.action != undefined && this.isOCollidingWith({x:p.x, y:p.y, w:0, h:0, o:{x:-0.5,y:-0.5}}))
                {
                    if (this.action != undefined) this.action();
                    if (this.canClick || this.canHover)
                    {
                        this.c = this.oc;
                        this.scaleTo({w:this.ot.w, h:this.ot.h});
                        if (this.hovering)
                        {
                            this.c = this.hc;
                            this.scaleBy(hs);
                        }
                    }
                }
            });
        }
    }

    renderMore(ctx = this.ctx)
    {
        this.wh = this.t.h * this.wSize;
        rr.drawWord(ctx, [this.word], this.t.x + this.wox, this.t.y, this.t.o, this.border, this.wh, this.wc, this.wAlpha);
    }
}

class Option extends Button
{
    constructor(page, type = "rect", {x,y,w,h,o}, c, a, wc, wa, ws, setting, options)
    {
        super(page, type, {x,y,w,h,o}, c, a, undefined, c, 0.8, c, 1.2, [options[0]], wc, wa, ws);
        
        this.content = "border";
        this.lineWidth = 8;
        this.wox = -32;

        this.setting = setting;
        this.options = options;
        this.index = 0;
        this.ot.w = rr.measureWordWidth(this.ctx, this.word[0], this.t.h/this.hs)+64;
        this.action = () => {
            this.setting(this.index = (this.index +1) % options.length);
            this.word = [this.options[this.index]];
            this.ot.w = rr.measureWordWidth(this.ctx, this.word[0], this.t.h)+64;
        }
    }
}

class Slider extends StaticObject
{
    constructor(page, type = "rect", {y,w,h}, c, a, min, max, setting, range)
    {
        super("rect", {x:max, y, w:max-min, h:h/3, o:{x:-1, y:-0.5}}, c);

        this.page = page;

        this.btn = new Button(page, type, {x:min,y,w,h,o:{x:-0.5,y:-0.5}}, c, a, undefined, c, 0.8, c, 1.2, "▣", "black", 0.5, 1.5);

        this.cv = rr.sBoundingBox;
        this.ctx = rr.settings;
        this.setting = setting;
        
        document.addEventListener("mousemove", (e) => {
            if (this.page != currentPage) return;

            if (this.btn.mouse == true)
            {
                const p = toCanvasCoords(this.cv, this.ctx, e.clientX, e.clientY);
                
                if (p.x <= min)
                {
                    this.btn.t.x = min;
                    this.setting(Math.round((this.btn.t.x-min)/((max-min))*(range[1]-range[0])+range[0]));
                    return;
                }
                if (p.x >= max)
                {
                    this.btn.t.x = max;
                    this.setting(Math.round((this.btn.t.x-min)/((max-min))*(range[1]-range[0])+range[0]));
                    return;
                }

                this.btn.t.x = p.x;
                this.setting(Math.round((this.btn.t.x-min)/((max-min))*(range[1]-range[0])+range[0]));
            }
        })
    }

    renderMore(ctx = this.ctx)
    {
        this.btn.render(ctx);
    }
}

// class HealthBar extends Dynamic
// {
//     constructor({x,y,w,h,o},target, c = "red", c2 = "#ff9438", c3 = "black", name = "", collision = _NOCOLLISION)
//     {
//         super("color", {x,y,w,h,o}, c, collision);
//         this.target = target;
//         this.initWidth = w;
//         this.c2 = c2;
//         this.c3 = c3;
//         this.name = name
//         this.ut =
//         {
//             x:this.t.x,
//             y:this.t.y,
//             w:this.initWidth,
//             h:this.t.h,
//             o:this.t.o
//         };
//         this.ht =
//         {
//             x:this.t.x + this.initWidth,
//             y:this.t.y,
//             w:0,
//             h:this.t.h,
//             o:{x:-1,y:this.t.o.y}
//         };
//     }

//     update()
//     {
//         if (this.t.w < this.ut.w)
//             this.ut.w = Math.abs(this.ut.w-this.t.w) < 1 ? this.t.w: (this.ut.w - ((this.ut.w-this.t.w)/20));
        
//         if (this.t.w < this.initWidth*this.target.hp/this.target.maxHp)
//             this.ut.w = this.initWidth*this.target.hp/this.target.maxHp < 0 ? 0 : this.initWidth*this.target.hp/this.target.maxHp;

//         this.t.w = this.initWidth*this.target.hp/this.target.maxHp < 0 ? 0 : this.initWidth*this.target.hp/this.target.maxHp;

//         if (this.target.hardDmg != undefined)
//             this.ht.w = this.initWidth*this.target.hardDmg/this.target.maxHp;
//     }
//     render()
//     {
//         const shake = {x:this.target.hp <= 0 ? (Math.random()-0.5)*16 : 0,
//             y:this.target.hp <= 0 ? (Math.random()-0.5)*16 : 0};
        
//         renderer.drawRect(currentCtx, {x:this.ot.x+shake.x, y:this.ot.y+shake.y, w:this.ot.w, h:this.ot.h, o:this.ot.o}, "black", 1, "fill");
//         renderer.drawRect(currentCtx, {x:this.ut.x+shake.x, y:this.ut.y+shake.y, w:this.ut.w, h:this.ut.h, o:this.ut.o}, this.c2, 1, "fill");
//         renderer.drawRect(currentCtx, {x:this.t .x+shake.x, y:this.t .y+shake.y, w:this.t .w, h:this.t .h, o:this.t .o}, this.c, 1, "fill");
//         renderer.drawRect(currentCtx, {x:this.ht.x+shake.x, y:this.ht.y+shake.y, w:this.ht.w, h:this.ht.h, o:this.ht.o}, "gray", 1, "fill");
//         renderer.drawRect(currentCtx, {                  x:shake.y+this.t.x+this.ot.w*this.t.o.x+this.ot.w/2,    y:shake.x+this.t.y, w:this.ot.w+16,h:this.ot.h+16, o:{x:-0.5,y:-0.5}}, this.c3, 0.5, "border", 16);
//         renderer.drawWord(currentCtx, {word:[this.name], x:shake.y+this.t.x+this.ot.w*this.t.o.x+this.ot.w/2,  y:shake.x+this.t.y, o:{x:-0.5,y:-0.5}, border:false, size:this.t.h, color:"white"});
//     }
// }