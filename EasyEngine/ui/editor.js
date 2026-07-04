let fps = document.getElementById("fps_count");

let play = document.getElementById("play");
let pause = document.getElementById("pause");

let hierarchy = document.getElementById("hierarchy");
let hierarchy_objects = [];

let go_count = 0;

window.addEventListener('engine-loaded', function () {
    console.log("Running editor.js");

    document.getElementById("tt").innerText = "EasyEngine Editor " + Engine.version;
    document.getElementById("tv").innerText = "EasyEngine " + Engine.version;
    // Methods

    // Play
    play.addEventListener('click', function () {
        Engine.deltaTime = 0;
        Engine.SetTargetFPS(9999);
    });

    // Pause
    pause.addEventListener('click', function () {
        Engine.SetTargetFPS(-1);
        Engine.deltaTime = 0;
    });


    // Update FPS
    setInterval(function () {
        if (Engine.deltaTime > 0.001) {
            if (Engine.fps < 1000) {
                fps.innerText = "FPS: " + Engine.fps;
            }
            else {
                fps.innerText = "FPS: 1k+";
            }
        }
        else {
            fps.innerText = "FPS: 0";
        }

        // Also update hierarchy
        if (go_count != Engine.GameObjects.length) {
            UpdateHierarchy();
            go_count = Engine.GameObjects.length;
        }

    }, 100);

});

function UpdateHierarchy() {
    hierarchy.innerHTML = "<h1>Hierarchy</h1>";
    Engine.GameObjects.forEach(obj => {
        let div = document.createElement('div');
        div.className = "object";
        div.id = obj.id;
        let p = document.createElement('p');
        p.className = "object-text";
        p.innerText = obj.name;
        p.id = obj.id;
        div.appendChild(p);
        hierarchy.appendChild(div);
        div.addEventListener('click', ObjectClicked);
    });
}

function ObjectClicked(e) {
    console.log(e.currentTarget.id);
}
