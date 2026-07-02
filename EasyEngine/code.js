// This is essential as it is when, well. The engine is loaded.
// If you try to run any engine related code before its loaded, errors may occur.

// This is essential as it is when, well. The engine is loaded.
// If you try to run any engine related code before its loaded, errors may occur.


window.addEventListener("engine-loaded", () => {
    console.log("Running Script : code.js");
    StartScript(); 
});

let plr = null;

let box = null;

let x_ref = null;

let tru_spd = null;
let gravity = 9.8;
let velocity = null;
let friction = -0.8;

function StartScript(){
    
    // Import engine library
    const Engine = window.Engine;
    const GameObject = window.GameObject;
    const Color = window.Color;
    const Components = window.Components;

    Engine.fullscreen = true;

    box = new GameObject();
    box.renderer.color = Color.Olive;
    box.transform.SetPosition(200, 200);
    box.transform.SetScale(50, 50);
    box.AddComponent(new Components.PhysicBody());
    
    velocity = new Vector2(0, 0);

    let player = new GameObject("player", "circle");
    plr = player;
    player.AddComponent(new Components.PhysicBody());

    player.renderer.color = Color.Green;
    player.renderer.type = "circle";
    player.transform.position = new Vector2(0, 0);
    player.transform.scale = new Vector2(10, 100);
    Engine.WindowSize = new Vector2(800, 500);

    let x = [];
    x_ref = x;
    
    for(let i = 0; i < 1000; i++){
        col = new Color(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 25);
        col = new Color(12, 155, 230);
        col.a = 25;
        new_go = new GameObject(null, "circle");
        new_go.renderer.color = col;
        x.push(new_go);
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
        x.forEach(obj => {
        obj.transform.position.y = -10;
        obj.transform.position.x = Math.round(Math.random() * Engine.WindowSize.x);
        });
        velocity = new Vector2(3, 3);
        
    }

    // called every engine update at TargetFPS rate
    function Update(){
        x.forEach(obj => {
            obj.transform.position.y += Math.round(Math.random() * 500) * Engine.deltaTime;
            if(obj.transform.position.y > Engine.WindowSize.y){
                obj.transform.position.y = -10;
            }
        });

        speed = true_speed * Engine.deltaTime;

        if(keys["w"]){
            velocity.y -= speed * Engine.deltaTime;  
        }
        if(keys["s"]){
            velocity.y += speed  * Engine.deltaTime; 
        }
        if(keys["a"]){
            velocity.x -= speed * Engine.deltaTime;
        }
        if(keys["d"]){
            velocity.x += speed * Engine.deltaTime;
        }

        //velocity.y += gravity * Engine.deltaTime * 0.1;

        player.transform.position.x += velocity.x;
        player.transform.position.y += velocity.y;


        if(player.transform.position.y > Engine.WindowSize.y){
            player.transform.position.y = velocity.y += 1;
        }
        if(player.transform.position.y < 0){
            player.transform.position.y = Engine.WindowSize.y;
        }

        if(player.transform.position.x < 0){
            player.transform.position.x = Engine.WindowSize.x;
        }
        if(player.transform.position.x > Engine.WindowSize.x){
            player.transform.position.x = velocity.x += 1;
        }

        velocity.x = velocity.x + (velocity.x - 0) * (friction * Engine.deltaTime);
        velocity.y = velocity.y + (velocity.y - 0) * (friction * Engine.deltaTime);
    }

    // Add methods above into Engine for it to run
    Engine.AddStart(Start);
    Engine.AddUpdate(Update);

    // Sets the target FPS for the engine and rendering to run at
    Engine.SetTargetFPS(100);

    // Starts engine
    Engine.Start("canvas");
}
