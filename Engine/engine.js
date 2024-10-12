let _DELTATIME = 0;

class Engine
{
    constructor (fps, update, render)
    {
        this.time = 0;
        this.timeStamp = 0;
        this.delta = 0;
        this.update = update;
        this.render = render;
        this.fps = fps;
        this.stopQueued = 0;

        this.run = (time) =>
        {
            this.time = time;
            this.delta = this.time - this.timeStamp;

            if (this.delta >= Math.floor(1000 / this.fps))
            {
                this.update();
                this.render();

                // FPSDISPLAY.word = ["UPDATE: "+(1000/this.delta).toFixed(2)];
                // FPSDISPLAYR.word = ["RENDER: "+(1000/this.deltaR).toFixed(2)];

                this.timeStamp = time;
                _DELTATIME = this.delta / 1000;
            }

            this.animationRequest = window.requestAnimationFrame(this.run);
        }
    }

    start()
    {
        this.animationRequest = window.requestAnimationFrame(this.run);
    }

    stop()
    {
        window.cancelAnimationFrame(this.animationRequest);
    }
}