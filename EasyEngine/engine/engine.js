// Main engine code
window.Engine = class Engine{
    /** @type {CanvasRenderingContext2D} */
    static #draw = null;
    static #canvas = null;
    static #starts = [];
    static #updates = [];
    static #interval = null;
    static #running = false;

    static #gameobjects = [];
    static gameobjectCount = 0;

    static #oldTime = Date.now();

    static deltaTime = 0.0;
    static fps = 0;
    static #targetFps = 60;

    static #framecount = 0;
    static #frametime = 0;

    static matter_js = window.physicsEngine;


    static fullscreen = false;
    static WindowSize = new Vector2(800, 500);
    static #memorySize = this.WindowSize;

    static updates = this.#updates;

    // renders frame
    static #RenderFrame(){
        this.#draw.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        // Render
        this.deltaTime = (Date.now() - this.#oldTime) / 1000;
        this.#oldTime = Date.now();
        this.#frametime += this.deltaTime;
        this.#framecount += 1;
        if(this.#frametime > 1){
            this.#frametime = 0;
            this.fps = this.#framecount;
            this.#framecount = 0;
        }

        this.#gameobjects.forEach(shape => {
            // if there is no renderer. dont render. duh
            if(shape.renderer != null && shape.renderer.display){
                this.#draw.save();
                // for every shape in shapes[] list, render it.

                this.#draw.fillStyle = shape.renderer.color.GetRGB();

                // radical!!?
                let rad_ical = shape.transform.rotation * Math.PI / 180;

                this.#draw.translate(shape.transform.position.x, shape.transform.position.y);
                this.#draw.rotate(rad_ical);

                if(shape.renderer.type == "rectangle" || shape.renderer.type == "square" || shape.renderer.type == "rect"){
                    this.#draw.fillRect(-(shape.transform.scale.x / 2), -(shape.transform.scale.y / 2), shape.transform.scale.x, shape.transform.scale.y);
                }
                else if(shape.renderer.type == "circle"){
                    this.#draw.beginPath();
                    this.#draw.arc(-(shape.transform.scale.x / 2), -(shape.transform.scale.x / 2), shape.transform.scale.x, 0, 2 * Math.PI);
                    this.#draw.fill();  
                    this.#draw.closePath();
                }
                this.#draw.restore();
            }
            
        });
    }
    static #UpdatePhysics(){
        if(this.deltaTime > 0.1){
            this.deltaTime = 0.1;
        }
        Matter.Engine.update(window.physicsEngine, this.deltaTime);
    }

    // Updates engine by:
    // Rendering everything,
    // Running all Update Methods on scripts.

    static #Update(){
        // Every Engine update:
        for(let x = 0; x < this.#updates.length; x++){
            this.#updates[x]();
        }

        this.#UpdatePhysics();

        this.#RenderFrame();     
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
        if(this.#running){
            method();
        }
    }

    static get GameObjects(){
        return this.#gameobjects;
    }

    static AddUpdate(method){
        this.#updates.push(method);
    }

    static PushGameObject(shape){
        this.gameobjectCount+=1;
        this.#gameobjects.push(shape);
    }
    static PopGameObject(shape){
        this.gameobjectCount-=1;
        this.#gameobjects.pop(shape);
    }

    static Start(canvas_id){
        // cant start the engine twice
        if(this.#running) return;

        this.#running = true;

        // Get Canvas from ID
        this.#canvas = document.getElementById(canvas_id);
        this.#draw = this.#canvas.getContext('2d');

        // Set canvas size
        if(this.fullscreen){
            this.#memorySize = this.WindowiSze
            this.WindowSize.x = window.innerWidth;
            this.WindowSize.y = window.innerHeight;
            
            this.#canvas.width = this.WindowSize.x;
            this.#canvas.height = this.WindowSize.y;
        }
        else{
            this.WindowSize = this.#memorySize;
            this.#canvas.width = this.WindowSize.x;
            this.#canvas.height = this.WindowSize.y;
        }

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
