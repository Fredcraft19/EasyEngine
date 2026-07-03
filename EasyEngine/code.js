// This event listener is essentail as we dont want the
// game script to start running before the engine is loaded.

// F12 Accessable variables (for debugging)
rb = null;
pl = null;

window.addEventListener("engine-loaded", () => {
    // Engine setup
    Engine.fullscreen = true;
    Engine.Start("canvas");

    // GameObject Creation

    player = new GameObject("Player", "rect");
    player.transform.scale = new Vector2(100, 100);
    player.transform.position = new Vector2(Engine.WindowSize.x / 2, 200);
    pb = new Components.PhysicBody();
    pb.inertia = 0.7;
    //pb.mass = 5;
    player.AddComponent(pb);
    player.renderer.color = Color.Red;
    rb = pb;
    pl = player;

    glb_scale = 5

    parts = []
    red = false;
    for(let i = 0; i < 1000; i++){   // any more and the thread will die
        red = !red;
        ball = new GameObject("ball", "circle");
        ball.transform.scale = new Vector2(glb_scale, glb_scale);
        ball.transform.position = new Vector2(150 + Math.round(Math.random() * (Engine.WindowSize.x - 250)), 50 + Math.round(Math.random() * 500));
        
        phy = new Components.PhysicBody();
        ball.AddComponent(phy);
        ball.renderer.color = Color.Blue;
        if(red) {ball.renderer.color = Color.Magenta;
            ball.transform.position = new Vector2(50 + Math.round(Math.random() * (Engine.WindowSize.x - 250)), 50 + Math.round(Math.random() * 500));
        }
        parts.push(phy);
    }

    ground = new GameObject("ground", "rect");
    ground.transform.position.y = Engine.WindowSize.y + 100;
    ground.transform.position.x = Engine.WindowSize.x / 2;
    ground.transform.scale = new Vector2(1500, 250);
    ground.renderer.color = Color.Red;
    ground.renderer.display = false;
    ground_pb = new Components.PhysicBody();
    ground_pb.solid = true;
    ground.AddComponent(ground_pb);

    ground = new GameObject("roof", "rect");
    ground.transform.position.y = -100;
    ground.transform.position.x = Engine.WindowSize.x / 2;
    ground.transform.scale = new Vector2(1500, 250);
    ground.renderer.color = Color.Red;
        ground.renderer.display = false;

    roof = new Components.PhysicBody();
    roof.solid = true;
    ground.AddComponent(roof);

    ground = new GameObject("wall", "rect");
    ground.transform.position.y = 0;
    ground.transform.position.x = Engine.WindowSize.x;
    ground.transform.scale = new Vector2(150, 15000);
    ground.renderer.color = Color.Red;
        ground.renderer.display = false;

    x = new Components.PhysicBody();
    x.solid = true;
    ground.AddComponent(x);

    ground = new GameObject("wall", "rect");
    ground.transform.position.y = 0;
    ground.transform.position.x = 0;
    ground.transform.scale = new Vector2(150, 15000);
    ground.renderer.color = Color.Red;
        ground.renderer.display = false;

    y = new Components.PhysicBody();
    y.solid = true;
    ground.AddComponent(y);
    

    // Game Logic

    speed = 50000;
    
    function Start(){

    }
    
    function Update(){
        if(Input.key["w"]){
            pb.AddForce(new Vector2(0, -speed));
        }
        if(Input.key["s"]){
            pb.AddForce(new Vector2(0, speed));
        }
        if(Input.key["a"]){
            pb.AddForce(new Vector2(-speed, 0));
        }
        if(Input.key["d"]){
            pb.AddForce(new Vector2(speed, 0));
        }
        if(Input.key["e"]){
            pb.SetVelocity(new Vector2(0, 0));
        }

        parts.forEach(part => {
            part.AddForce(new Vector2(Math.round(Math.random() * 500) - 250, Math.round(Math.random() * 500) - 250));
        });
    }

    Engine.AddStart(Start);
    Engine.AddUpdate(Update);
    Engine.SetTargetFPS(9999); // no upperlimit basically
});
