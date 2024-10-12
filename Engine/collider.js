"use strict"

class RectCollider
{
    constructor(t, sides)
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

    checkRCCollision(target)
    {
        if (this.sides != _NOCOLLISION)
            return this.rectCircle(target.center);
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
                return this.compileSides(this.RRCollision(target, {l,r,t,b}));
                
            }
            if (target.type == "circle")
            {
                return this.checkRCCollision(target);
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

        console.log(_x+this.t.w +" vs "+ __x)

        if (_x+this.t.w   >= __x   &&
            oldx+this.t.w <= __x   &&
            _y+this.t.h   >= __y   &&
            _y            <= __y+h)
            return true;
        
        return false;
    }

    rectCircle({centerX,centerY})
    {
        const rx = this.t.x + this.t.w * this.t.o.x, ry = this.t.y + this.t.h * this.t.o.y;

        const cx = centerX, cy = centerY;
        
        let testX = cx;
        let testY = cy;
      
        // which edge is closest?
        if (cx < rx)        {testX = rx;  }    // test left edge
        else if (cx > rx+w) {testX = rx+w;}   // right edge
        if (cy < ry)        {testY = ry;  }    // top edge
        else if (cy > ry+h) {testY = ry+h;}   // bottom edge
      
        // get distance from closest edges
        const distX = cx-testX;
        const distY = cy-testY;
        const distance = Math.sqrt(distX**2+distY**2);
      
        // if the distance is less than the radius, collision!
        if (distance <= this.t.w/2)
            return true;

        return false;
    }

    setTransform(t)
    {
        this.t = t;
    }

    updateTransform()
    {
        console.log(this.parent)
        this.t = this.parent.t;
    }

    updateOldTransform()
    {
        this.oldt = this.parent.oldt;
    }
}

class CircleCollider
{
    constructor(t, sides)
    {
        this.parent = 0;
        this.t = t;
        this.sides = sides;

        this.type = "circle";
    }

    checkCRCollision(target)
    {
        if (this.sides != _NOCOLLISION)
            return this.circleRect(target);
    }
    checkCCCollision(target)
    {
        return this.circleCircle({x:this.center.x,y:this.center.y}, this.radius, target);
    }

    isCollidingWith(target)
    {
        if (target != undefined)
        {
            if (target.type == "rect")
            {
                console.log("a")
                return this.checkCRCollision(target.t);
            }
            if (target.type == "circle")
            {
                return this.checkCCCollision(target.center);
            }
        }
    }

    circleRect({x,y,w,h,o})
    {
        const rx = x + w * o.x, ry = y + h * o.y;

        const cx = this.center.x, cy = this.center.y;
        
        let testX = cx;
        let testY = cy;
      
        // which edge is closest?
        if (cx < rx)        {testX = rx;  }    // test left edge
        else if (cx > rx+w) {testX = rx+w;}   // right edge
        if (cy < ry)        {testY = ry;  }    // top edge
        else if (cy > ry+h) {testY = ry+h;}   // bottom edge
      
        // get distance from closest edges
        const distX = cx-testX;
        const distY = cy-testY;
        const distance = Math.sqrt(distX**2+distY**2);
      
        // if the distance is less than the radius, collision!
        if (distance <= this.t.w/2)
            return true;

        return false;
    }

    setTransform(t)
    {
        this.t = t;
    }

    updateTransform(t)
    {
        this.t = parent.t;
    }
}