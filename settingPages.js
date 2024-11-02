const _SettingsCenter = {x:Math.floor(rr.settings.canvas.width / 2), y:Math.floor(rr.settings.canvas.height / 2)}
const _SettingsRes = {x:rr.settings.canvas.width, y:rr.settings.canvas.height}


let _VERSUS           = 0;
let _MODE             = 0;
let _TARGETSCORE      = 5;
let _PADACCELERATION  = 32;
let _HORIZONTALSPEED  = 16;

let P_VERSUS          = 3;
let P_MODE            = 0;
let P_TARGETSCORE     = 5;
let P_PADACCELERATION = 32;
let P_HORIZONTALSPEED  = 16;

let HUE = 0;
let VOLUME = 5;

let currentPage = 0;

const pages =
[
    [ // 0. Instructions
        new Word({x:_SettingsCenter.x, y:160, h:128, o:{x:-0.5,y:0}}, ["PONG"], "white"),
        
        new Word({x:_SettingsCenter.x, y:256+32, h:64, o:{x:-0.5,y:0}}, ["Controls","","Player 1: W/S", "Player 2: ↑/↓","","Change Target FPS: [/]", "","Pause/Resume: Esc."], "white"),

        new Button(0, "rect", {x:128, y:128, w:64, h:64, o:{x:0, y:-0.5}}, "white", 0, ()=>{},"white", 0.8, "white", 1.2, "<", "white", 0.5, 1),
        new Button(0, "rect", {x:_SettingsRes.x-128, y:128, w:64, h:64, o:{x:-1, y:-0.5}}, "white", 0, ()=>{currentPage=1},"white", 0.8, "white", 1.2, ">", "white", 1, 1)
    ],
    [ // 1. SETUP
        new Word({x:_SettingsCenter.x, y:160, h:128, o:{x:-0.5,y:0}}, ["Settings"], "white"),

        new Word({x:128, y:256, h:64, o:{x:0,y:-0.5}}, ["Versus"], "white"),
        new Option(1,"rect", {x:_SettingsRes.x-128, y:256, w:64,h:64, o:{x:-1, y:-0.5}}, "white", 1, "white", 1, 0.8, (value)=>_VERSUS=value, ["Player vs Player", "Player vs CPU", "Survival", "Simulation"]),

        new Word({x:128, y:128*3, h:64, o:{x:0,y:-0.5}}, ["Mode"], "white"),
        new Option(1,"rect", {x:_SettingsRes.x-128, y:128*3, w:64,h:64, o:{x:-1, y:-0.5}}, "white", 1, "white", 1, 0.8, (value)=>_MODE=value, ["Bouncy Edges", "Classic"]),

        new Word({x:128, y:128*4, h:64, o:{x:0,y:-0.5}}, ["Target Score"], "white"),
        new Slider(1,"rect", {y:128*4, w:64, h:64}, "white", 1, _SettingsCenter.x+128, _SettingsRes.x-256-16, (value)=>_TARGETSCORE=value, [1,100]),
        new Word({x:_SettingsRes.x-128, y:128*4, h:64, o:{x:-1,y:-0.5}}, _TARGETSCORE, "white", false, ()=>{return _TARGETSCORE}),

        new Word({x:128, y:128*5, h:64, o:{x:0,y:-0.5}}, ["Pad Acceleration"], "white"),
        new Slider(1,"rect", {y:128*5, w:64, h:64}, "white", 1, _SettingsCenter.x+128, _SettingsRes.x-256-16, (value)=>_PADACCELERATION=value, [32,128]),
        new Word({x:_SettingsRes.x-128, y:128*5, h:64, o:{x:-1,y:-0.5}}, _PADACCELERATION, "white", false, ()=>{return _PADACCELERATION}),

        new Word({x:128, y:128*6, h:64, o:{x:0,y:-0.5}}, ["Horizontal Speed"], "white"),
        new Slider(1,"rect", {y:128*6, w:64, h:64}, "white", 1, _SettingsCenter.x+128, _SettingsRes.x-256-16, (value)=>_HORIZONTALSPEED=value, [16,32]),
        new Word({x:_SettingsRes.x-128, y:128*6, h:64, o:{x:-1,y:-0.5}}, _HORIZONTALSPEED, "white", false, ()=>{return _HORIZONTALSPEED}),

        new Button(1, "rect", {x:128, y:128, w:64, h:64, o:{x:0, y:-0.5}}, "white", 0, ()=>{currentPage=0},"white", 0.8, "white", 1.2, "<", "white", 1, 1),
        new Button(1, "rect", {x:_SettingsRes.x-128, y:128, w:64, h:64, o:{x:-1, y:-0.5}}, "white", 0, ()=>{currentPage=2},"white", 0.8, "white", 1.2, ">", "white", 1, 1)
    ],
    [ // 2. Graphics
        new Word({x:_SettingsCenter.x, y:160, h:128, o:{x:-0.5,y:0}}, ["Extra"], "white"),
        new Word({x:128, y:128*3, h:64, o:{x:0,y:-0.5}}, ["HUE"], "white"),
        new Slider(2,"rect", {y:128*3, w:64, h:64}, "white", 1, _SettingsCenter.x+128, _SettingsRes.x-256-16, (value)=>HUE=value, [0,360]),
        new Word({x:_SettingsRes.x-128, y:128*3, h:64, o:{x:-1,y:-0.5}}, HUE, "white", false, ()=>{return HUE}),

        new Word({x:128, y:128*4, h:64, o:{x:0,y:-0.5}}, ["Volume"], "white"),
        new Slider(2,"rect", {y:128*4, w:64, h:64}, "white", 1, _SettingsCenter.x+128, _SettingsRes.x-256-16, (value)=>VOLUME=value, [1,10]),
        new Word({x:_SettingsRes.x-128, y:128*4, h:64, o:{x:-1,y:-0.5}}, VOLUME, "white", false, ()=>{return VOLUME}),

        new Button(2, "rect", {x:128, y:128, w:64, h:64, o:{x:0, y:-0.5}}, "white", 0, ()=>{currentPage=1},"white", 0.8, "white", 1.2, "<", "white", 1, 1),
        new Button(2, "rect", {x:_SettingsRes.x-128, y:128, w:64, h:64, o:{x:-1, y:-0.5}}, "white", 0, ()=>{},"white", 0.8, "white", 1.2, ">", "white", 0.5, 1)
    ],

];