"use strict"

class RectCollider
{
    constructor(t = {x:0,y:0,w:0,h:0, o: {x:0,y:0}}, sides = _BLOCKALL)
    {
        this.parent = 0;
        this.t = t;
        this.oldt = t;
        this.sides = sides;
        this.type = "rect";
    }

    RRCollision(target, {l,r,t,b})
    {
        if (this.sides.r && !l)
            l = this.collideLeft(target.t);
        if (this.sides.l && !r)
            r = this.collideRight(target.t);
        if (this.sides.b && !t)
            t = this.collideTop(target.t);
        if (this.sides.t && !b)
            b = this.collideBottom(target.t);

        return {l:l,r:r,t:t,b:b};
    }

    compileSides({l,r,t,b})
    {
        return (l+r+t+b) > 0;
    }

    isCollidingWith(target, {l,r,t,b} = {l:false,r:false,t:false,f:false})
    {
        if (target != undefined)
        {
            if (target.type == "rect")
            {
                if (this.sides != _NOCOLLISION)
                    return this.compileSides(this.RRCollision(target, {l,r,t,b}));
                return false;
            }
            if (target.type == "circle")
            {
                if (this.sides != _NOCOLLISION)
                    return this.compileSides(this.rectCircle(target, this.sides));
                return false;
            }
        }
    }

    areSidesCollidingWith(target, {l,r,t,b} = {l:false,r:false,t:false,f:false})
    {
        if (target != undefined)
        {
            if (target.type == "rect")
            {
                if (this.sides != _NOCOLLISION)
                    return this.RRCollision(target, {l,r,t,b});
                return false;
            }
            if (target.type == "circle")
            {
                if (this.sides != _NOCOLLISION)
                    return this.rectCircle(target, this.sides);
                return false;
            }
        }
    }

    collideTop({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;
        const _x = this.t.x + this.t.w * this.t.o.x, _y = this.t.y + _o;
        const oldy = this.oldt.y + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x+this.t.w >= __x   &&
            _x          <= __x+w &&
            _y          <= __y+h &&
            oldy        >= __y+h)
            return true;
        
        return false;
    }
    collideBottom({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;
        const _x = this.t.x + this.t.w * this.t.o.x, _y = this.t.y + _o;
        const oldy = this.oldt.y + _o;
        const __x = x + w * o.x, __y = y + h * o.y;
        
        if (_x+this.t.w   >= __x   &&
            _x            <= __x+w &&
            _y+this.t.h   >= __y   &&
            oldy+this.t.h <= __y)
            return true;
        
        if (this.grounded != undefined)
            this.grounded = false;
        return false;
    }
    collideLeft({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x          <= __x+w &&
            oldx        >= __x+w &&
            _y+this.t.h >= __y   &&
            _y          <= __y+h)
            return true;
        
        return false;
    }
    collideRight({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x+this.t.w   >= __x   &&
            oldx+this.t.w <= __x   &&
            _y+this.t.h   >= __y   &&
            _y            <= __y+h)
            return true;
        
        return false;
    }

    rectCircle(target)
    {
        const rx = this.t.x + this.t.w * this.t.o.x, ry = this.t.y + this.t.h * this.t.o.y;

        const cx = target.center.x, cy = target.center.y;
        
        let testX = cx;
        let testY = cy;

        let l = false,r = false,t = false,b = false;
      
        // which edge is closest?
        if (cx < rx)               {testX = rx; l = true}    // test left edge
        else if (cx > rx+this.t.w) {testX = rx+this.t.w; r = true}   // right edge
        if (cy < ry)               {testY = ry; t = true;}    // top edge
        else if (cy > ry+this.t.h) {testY = ry+this.t.h; b = true}   // bottom edge
      
        // get distance from closest edges
        const distX = cx-testX;
        const distY = cy-testY;
        const distance = Math.sqrt(distX**2+distY**2);
      
        // if the distance is less than the radius, collision!
        if (distance <= target.t.w/2)
            return {l,r,t,b};

        return false;
    }

    setTransform(t)
    {
        this.t = t;
    }

    updateTransform()
    {
        this.t = this.parent.t;
    }

    updateOldTransform()
    {
        this.oldt = this.parent.oldt;
    }
}

class CircleCollider
{
    constructor(t = {x:0,y:0,w:0,h:0, o: {x:0,y:0}})
    {
        this.parent = 0;
        this.t = t;

        this.type = "circle";
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
    }

    isCollidingWith(target)
    {
        if (target != undefined)
        {
            if (target.type == "rect")
            {
                if (target.sides != _NOCOLLISION)
                    return this.circleRect(target.t, target.sides);
                return false;
            }
            if (target.type == "circle")
            {
                return this.circleCircle(target.center, target.t.w/2);
            }
        }
    }

    circleRect({x,y,w,h,o}, sides)
    {
        const rx = x + w * o.x, ry = y + h * o.y;

        const cx = this.center.x, cy = this.center.y;
        
        let testX = cx;
        let testY = cy;
      
        // which edge is closest?
        if      (cx < rx && sides.l)   {testX = rx;  }    // test left edge
        else if (cx > rx+w && sides.r) {testX = rx+w;}   // right edge
        if      (cy < ry && sides.t)   {testY = ry;  }    // top edge
        else if (cy > ry+h && sides.b) {testY = ry+h;}   // bottom edge
      
        // get distance from closest edges
        const distX = cx-testX;
        const distY = cy-testY;
        const distance = Math.sqrt(distX**2+distY**2);
      
        // if the distance is less than the radius, collision!
        if (distance != 0 && distance <= this.t.w/2)
            return true;

        return false;
    }
    
    circleCircle({x,y}, r)
    {

        const cx = this.center.x, cy = this.center.y;

        const distX = cx-x;
        const distY = y-cy;
        const distance = Math.sqrt(distX**2+distY**2);

        if (distance <= (r+this.t.w/2))
        {
            return true;
        }
        return false;
    }

    setTransform(t)
    {
        this.t = t;
    }

    updateTransform()
    {
        this.t = this.parent.t;
        this.center = this.parent.center;
    }

    updateOldTransform()
    {
        this.oldt = this.parent.oldt;
        this.oldcenter = this.parent.oldcenter;
    }
}