// This is essential as it is when, well. The engine is loaded.
// If you try to run any engine related code before its loaded, errors may occur.

// This is essential as it is when, well. The engine is loaded.
// If you try to run any engine related code before its loaded, errors may occur.


window.addEventListener("engine-loaded", () => {
    console.log("running main");
    StartScript(); 
});

let plr = null;
let tru_spd = null;
let fps = 0;

function StartScript(){
    
    // Import engine library
    const Engine = window.Engine;
    const Shape = window.Shape;
    const Color = window.Color;
    
    let player = new Shape("rect", Color.Red);
    plr = player;
    player.transform.position = new Vector2(0, 0);
    player.transform.scale = new Vector2(100, 100);
    Engine.WindowSize = new Vector2(800, 500);

    let x = [];
    for(let i = 0; i < 5000; i++){
        col = new Color(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 25);
        col = new Color(12, 155, 230);
        col.a = 25;
        x.push(new Shape("circle", col));
    }

    x.forEach(obj => {
        obj.transform.scale = new Vector2(10, 10);
        
    });

    let true_speed = 80;
    tru_spd = true_speed;
    let speed = true_speed * Engine.deltaTime;

    // for input duh.
    const keys = {
        "w": false,
        "s": false,
        "a": false,
        "d": false
    }
    // input listeners
    addEventListener('keydown', function(event){keys[event.key] = true});
    addEventListener('keyup', function(event){keys[event.key] = false});


    // called on engine start
    // unity reference?
    function Start(){
        Engine.AddShape(player); 
        x.forEach(obj => {
        Engine.AddShape(obj);
        obj.transform.position.y = 0;
        obj.transform.position.x = Math.round(Math.random() * Engine.WindowSize.x);
        });
        
    }

    // called every engine update at TargetFPS rate
    function Update(){
        fps = Math.round(1 / Engine.deltaTime);
        x.forEach(obj => {
            obj.transform.position.y += Math.round(Math.random() * 500) * Engine.deltaTime;
            if(obj.transform.position.y > Engine.WindowSize.y){
                obj.transform.position.y = -10;
            }
        });

        speed = true_speed * Engine.deltaTime;

        if(keys["w"]){
            player.transform.position.y -= speed;
        }
        if(keys["s"]){
            player.transform.position.y += speed;
        }
        if(keys["a"]){
            player.transform.position.x -= speed;
        }
        if(keys["d"]){
            player.transform.position.x += speed;
        }
    }

    // Add methods above into Engine for it to run
    Engine.AddStart(Start);
    Engine.AddUpdate(Update);

    // Sets the target FPS for the engine and rendering to run at
    Engine.SetTargetFPS(60);

    // Starts engine
    Engine.Start("canvas");
}
