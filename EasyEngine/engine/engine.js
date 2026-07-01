window.Shape = class Shape{
    transform = null;
    renderer = null;

    // Add Layers later?

    constructor(_type = "square", _color = "black"){
        this.renderer = new window.Renderer(_color, _type);
        this.transform = new window.Transform();
    }
}


// Main engine code
window.Engine = class Engine{
    /** @type {CanvasRenderingContext2D} */
    static #draw = null;
    static #canvas = null;

    static deltaTime = 0.0;
    static #targetFps = 60;
    static #starts = [];
    static #updates = [];
    static #interval = null;
    static #running = false;

    static #shapes = [];

    static #oldTime = Date.now();

    static isFullscreen = false;
    static WindowSize = new Vector2(800, 500);

    // renders frame
    static #RenderFrame(){

        if(this.isFullscreen){
            this.#canvas.width = window.innerWidth;
            this.#canvas.height = window.innerHeight;
        }
        else{
            this.#canvas.width = this.WindowSize.x;
            this.#canvas.height = this.WindowSize.y;
        }

        this.#draw.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        // Render
        this.deltaTime = (Date.now() - this.#oldTime) / 1000;
        this.#oldTime = Date.now();

        this.#shapes.forEach(shape => {
            // for every shape in shapes[] list, render it.
            this.#draw.fillStyle = shape.renderer.color.GetRGB();

            if(shape.renderer.type == "rectangle" || shape.renderer.type == "square" || shape.renderer.type == "rect"){
                this.#draw.fillRect(shape.transform.position.x, shape.transform.position.y, shape.transform.scale.x, shape.transform.scale.y);
            }
            else if(shape.renderer.type == "circle"){
                this.#draw.beginPath();
                this.#draw.arc(shape.transform.position.x, shape.transform.position.y, shape.transform.scale.x, 0, 2 * Math.PI);
                this.#draw.fill();  
                this.#draw.closePath();
            }
            
        });
    }

    // Updates engine by:
    // Rendering everything,
    // Running all Update Methods on scripts.

    static #Update(){
        // Every Engine update:
        // Render FIRST

        this.#RenderFrame();

        // Run Update
        for(let x = 0; x < this.#starts.length; x++){
            this.#updates[x]();
        }
    }

    // sets target fps
    static SetTargetFPS(newFPS){
        this.#targetFps = newFPS;
        clearInterval(this.#interval);
        if(this.#running){ 
            this.#interval = setInterval(() => {
                this.#Update();
            }, 1000/this.#targetFps);
        }
    }

    static AddStart(method){
        this.#starts.push(method);
    }

    static AddUpdate(method){
        this.#updates.push(method);
    }

    static AddShape(shape){
        this.#shapes.push(shape);
    }
    static RemoveShape(shape){
        this.#shapes.pop(shape);
    }

    static Start(canvas_id){
        // cant start the engine twice
        if(this.#running) return;

        this.#running = true;

        // Get Canvas from ID
        this.#canvas = document.getElementById(canvas_id);
        this.#draw = this.#canvas.getContext('2d');

        // Call all start functions
        for(let i = 0; i < this.#starts.length; i++){
            this.#starts[i]();
        }

        // Engine start logic
        this.#interval = setInterval(() => {
                this.#Update();
            }, 1000/this.#targetFps);
    }
}

