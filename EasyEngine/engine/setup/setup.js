global_scale = 12;
window.addEventListener("engine-loaded", () => {

    // Engine settings

    Engine.SetTargetFPS(9999); // no upperlimit basically

    Engine.fullscreen = true;
    Engine.Start("canvas");

    // Scene building

    plr = new GameObject("player", "circle");
    plr.tag = "player";
    plr.transform.scale = new Vector2(75, 75);
    plr.transform.position = new Vector2(Engine.WindowSize.x / 2, Engine.WindowSize.y / 2);
    plr.renderer.color = new Color(255, 0, 0);
    plrM = new PhysicBody();
    plr.AddComponent(plrM);
    plrX = new PlayerMovement();
    plr.AddComponent(plrX);

    for (let i = 0; i < 1200; i++) {
        b = new GameObject("particle", "circle");
        b.tag = "particle";
        b.transform.scale = new Vector2(global_scale, global_scale);
        b.transform.position = new Vector2(Engine.WindowSize.x / 2 + Math.round((Math.random() * 200) - 100), Engine.WindowSize.y / 2 + Math.round((Math.random() * 200) - 100));
        b.renderer.color = new Color(60, 60, 200);
        b.AddComponent(new PhysicBody());
        //b.AddComponent(new RandomMovement());
    }

    let boundsCol = new Color(65, 65, 65);

    box = new GameObject();
    box.tag = "grounds";
    box.transform.scale = new Vector2(5000, 50);
    box.transform.position = new Vector2(0, Engine.WindowSize.y);
    box.renderer.color = boundsCol;
    phy = new PhysicBody();
    phy.solid = true;
    box.AddComponent(phy);

    box = new GameObject();
    box.tag = "grounds";
    box.transform.scale = new Vector2(5000, 50);
    box.transform.position = new Vector2(0, 0);
    box.renderer.color = boundsCol;
    phy = new PhysicBody();
    phy.solid = true;
    box.AddComponent(phy);

    box = new GameObject();
    box.tag = "grounds";
    box.transform.scale = new Vector2(50, 5000);
    box.transform.position = new Vector2(0, 0);
    box.renderer.color = boundsCol;
    phy = new PhysicBody();
    phy.solid = true;
    box.AddComponent(phy);

    box = new GameObject();
    box.tag = "grounds";
    box.transform.scale = new Vector2(50, 5000);
    box.transform.position = new Vector2(Engine.WindowSize.x, 0);
    box.renderer.color = boundsCol;
    phy = new PhysicBody();
    phy.solid = true;
    box.AddComponent(phy);
});

