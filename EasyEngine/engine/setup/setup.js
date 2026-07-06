
// Engine setup

Engine.Reset();
Engine.DisplaySize = new Vector2(640, 360);
Engine.SetTargetFPS(100000);
Engine.Start("canvas");

// Scene building

plr = new GameObject("player", "circle");
plr.tag = "player-tag";
plr.transform.scale = new Vector2(75, 75);
plr.transform.position = new Vector2(Engine.GameSize.x / 2, Engine.GameSize.y / 2);
plr.renderer.color = new Color(255, 0, 0);
plrM = new PhysicBody();
plr.AddComponent(plrM);
plrX = new PlayerMovement();
plr.AddComponent(plrX);

let boundsCol = new Color(65, 65, 65);

box = new GameObject(`wall [${Engine.GameObjects.length + 1}]`);
box.tag = "grounds";
box.transform.scale = new Vector2(5000, 50);
box.transform.position = new Vector2(0, Engine.GameSize.y);
box.renderer.color = boundsCol;
phy = new PhysicBody();
phy.solid = true;
box.AddComponent(phy);

box1 = new GameObject(`wall [${Engine.GameObjects.length + 1}]`);
box1.tag = "grounds";
box1.transform.scale = new Vector2(5000, 50);
box1.transform.position = new Vector2(0, 0);
box1.renderer.color = boundsCol;
phy = new PhysicBody();
phy.solid = true;
box1.AddComponent(phy);

box2 = new GameObject(`wall [${Engine.GameObjects.length+1}]`);
box2.tag = "grounds";
box2.transform.scale = new Vector2(50, 5000);
box2.transform.position = new Vector2(0, 0);
box2.renderer.color = boundsCol;
phy = new PhysicBody();
phy.solid = true;
box2.AddComponent(phy);

box3 = new GameObject(`wall [${Engine.GameObjects.length + 1}]`);
box3.tag = "grounds";
box3.transform.scale = new Vector2(50, 5000);
box3.transform.position = new Vector2(Engine.GameSize.x, 0);
box3.renderer.color = boundsCol;
phy = new PhysicBody();
phy.solid = true;
box3.AddComponent(phy);

Engine.Update();
Engine.SetTargetFPS(-1); // pauses engine
