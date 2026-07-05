// if you see 'go' in a variable name, it probably means GameObject

// Engine Performance Information
let fps = document.getElementById("fps_count");
// add drawcalls?

// Engine Control
let play = document.getElementById("play");
let pause = document.getElementById("pause");

// Hierarchy Varibles
let hierarchy = document.getElementById("hierarchy");
let go_count = -1;

// Inspector Variables
let inspector = document.getElementById("inspecter-components"); // 'An Inspector Calls' reference& ?
let inspector_base = document.getElementById("inspector-base");
inspector_base.style.display = "none";
let go_target = null;
let selected_id = -1;
let ui_id = -1;


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

    // Dis-select gameobject:
    hierarchy.addEventListener('click', function () {
        console.log("SELECTED ID = -1;");
        selected_id = -1;
    })


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

        if (ui_id != selected_id) {
            UpdateInspector();
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

function UpdateInspector() {
    ui_id = selected_id;
    if (ui_id == -1) {
        inspector.innerHTML = "";
        inspector_base.style.display = "none";
    }
    target = null;

    Engine.GameObjects.forEach(obj => {
        if (obj.id == ui_id) {
            target = obj;
            console.log("target found!");
        }
    });

    if (target == null) {
        console.error(`Target not found of id '${ui_id}'`);
        return;
    }
    // go found. get compoentns -> display components!
    inspector_base.style.display = "block";

    // foreach compoennt btw...
    target.components.forEach(component => {
    
        CreateComponentField(component);

    });   
}
function CreateComponentField(component){
    let parent = document.createElement('div');
    parent.className = "inspector-component";

    let pparent = document.createElement('div');
    pparent.className = "inspector-component2";

    let comp_header = document.createElement('div');
    comp_header.className = "component-header";


    let img = document.createElement('img');
    img.src = "ui/components/custom.png";
    img.className = "mini-icon";

    let comp_name = document.createElement('p');
    comp_name.className = "no-margin";
    comp_name.innerText = component.name;

    comp_header.appendChild(img);
    comp_header.appendChild(comp_name);
    pparent.appendChild(comp_header);
    // FOR EACH FIELD
    let field = document.createElement('div');
    field.className = "inspector-field";

    let fLabel = document.createElement('p');
    fLabel.className = "inspector-label";
    fLabel.innerText = "Variable Name";
    let fInput = document.createElement('input');
    fInput.className = "inspector-input";
    field.appendChild(fLabel);
    field.appendChild(fInput);
    pparent.appendChild(field);

    // FOR EACH DONE

    parent.appendChild(pparent);
    inspector.appendChild(parent);
}
