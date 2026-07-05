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

// Component Inspector Class
class Inspector_Component {
    name = "";
    fields = {};
    ref = null; // & -> gameobject's component reference;.
    constructor(_name) {
        this.name = _name;
    }
}

let inspector = document.getElementById("inspecter-components"); // 'An Inspector Calls' reference& ?
let inspector_base = document.getElementById("inspector-base");
inspector_base.style.display = "none";
let go_target = null;
let selected_id = -1;
let ui_id = -1;

inspector_memory = {};
i_count = 0; 

current_component = "";

delete_btns = {};


// create component inspector map


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
        //console.log("SELECTED ID = -1;");
        //if (go_target != null) { selected_id = -1; go_target = null; UpdateInspector(); }
        
    });

    // input field in base inspector (above components areas)
    inspector_base.addEventListener('input', (e) => {
        if (e.target.id == "go-name") {
            e.target.value.trim();
            if (e.target.value == "" || e.target.value == null) {
                target.name = "GameObject";
                e.target.value = target.name;
            }
            else {
                target.name = e.target.value;
                e.target.value = target.name;
            }
        }
        else if (e.target.id == "go-tag") {
            e.target.value.trim();
            if (e.target.value != "" || e.target.value != null) {
                target.tag = e.target.value;
                e.target.value = target.tag;
            }
        }
        else {
            console.log("input not for me..");
            return;
        }
        UpdateHierarchy();
    });
    inspector_base.addEventListener('click', (e) => {
        if (e.target.id == "go-enabled") {
            target.enabled = e.target.value;
            console.log("set go's enabled!");
        }
    });

    // input field edited in inspector
    // MOST CONFUSING METHOD OF MY LIFEEEE
    inspector.addEventListener('input', (e) => {
        console.log("Typing in: '" + e.target.id + "'.");
        let i_c = e.target.id.split('-')[0];
        let i_v = e.target.id.split('-')[1];
        let n_v = e.target.value;

        let active_component = null;

        if (i_c == 1) {
            active_component = target.transform;
        }
        else if (i_c == 2) {
            active_component = target.renderer;
        }
        else {
            let saved_ui_component = inspector_memory[i_c];
            if (saved_ui_component && saved_ui_component.reference) {
                active_component = saved_ui_component.reference;
            }
        }

        let target_object = active_component;
        let target_key = i_v;

        if (i_v.includes('.')) {
            let parts = i_v.split('.');
            let parent_key = parts[0];
            target_key = parts[1];

            if (active_component) {
                target_object = active_component[parent_key];
            }
        }

        if (target_object && target_key in target_object) {
            let o_v = target_object[target_key];

            if (typeof o_v === "number") n_v = Number(n_v);
            if (typeof o_v === "boolean") n_v = e.target.checked;

            if (typeof o_v === typeof n_v) {
                console.log("same type. setting!");
                console.log(o_v + " >> " + n_v);

                target_object[target_key] = n_v;
            }
            else {
                console.warn(`Type mismatch! Expected ${typeof o_v}, got ${typeof n_v}`);
                alert("Not the same type!");
                e.target.value = o_v;
            }
        } else {
            console.error(`Could not find component or variable for ID: ${e.target.id}`);
        }
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
    selected_id = e.currentTarget.id;

}

function UpdateInspector() {
    inspector_memory = {};
    delete_btns = {};
    ui_id = selected_id;
    inspector.innerHTML = "";
    if (ui_id == -1) {
        
        inspector_base.style.display = "none";
    }

    

    target = null;

    Engine.GameObjects.forEach(obj => {
        if (obj.id == ui_id) {
            target = obj;
        }
    });

    if (target == null) {
        console.error(`Target not found of id '${ui_id}'`);
        return;
    }

    document.getElementById("go-name").value = target.name;
    document.getElementById("go-tag").value = target.tag;
    //document.getElementById("go-enabled").checked = target.enabled;

    // go found. get compoentns -> display components!
    inspector_base.style.display = "block";

    // transform
    let pparent = CreateComponentHeader(target.transform);
    let variableEntries = Object.entries(target.transform);
    variableEntries.forEach(([key, value]) => {
        let field = CreateComponentField(key, value);
        if (field != null) pparent.appendChild(field);
    });

    // renderer
     pparent = CreateComponentHeader(target.renderer);
     variableEntries = Object.entries(target.renderer);
    variableEntries.forEach(([key, value]) => {
        let field = CreateComponentField(key, value);
        if (field != null) pparent.appendChild(field);
    });

    // all other components
    target.components.forEach(component => {
        let pparent = CreateComponentHeader(component);
        let variableEntries = Object.entries(component);
        variableEntries.forEach(([key, value]) => {
            let field = CreateComponentField(key, value);
            if (field != null) pparent.appendChild(field); 
        });
        

    });   
}
function CreateComponentHeader(component) {

    i_count++;
    inspector_memory[i_count] = new Inspector_Component();
    inspector_memory[i_count].name = i_count;
    inspector_memory[i_count].reference = component; // give the i-memory a reference to the gameobject's component its showing
    console.log(`created new i-component of key: ${i_count}`)
    current_component = i_count;

    let parent = document.createElement('div');
    parent.className = "inspector-component";

    let pparent = document.createElement('div');
    pparent.className = "inspector-component2";

    let comp_header = document.createElement('div');
    comp_header.className = "component-header";


    let img = document.createElement('img');
    if (i_count == 1) img.src = "ui/components/transform.png";
    else if (i_count == 2) img.src = "ui/components/renderer.png";
    else img.src = "ui/components/custom.png";
    img.className = "mini-icon";

    let comp_name = document.createElement('p');
    comp_name.className = "no-margin";
    comp_name.innerText = component.name;

    let del_btn = document.createElement('button');
    del_btn.className = "small-text";
    del_btn.innerText = "delete";
    del_btn.id = "del-" + i_count;
    delete_btns[del_btn.id] = true;

    comp_header.appendChild(img);
    comp_header.appendChild(comp_name);
    comp_header.appendChild(del_btn);
    pparent.appendChild(comp_header);

    parent.appendChild(pparent);
    inspector.appendChild(parent);

    return pparent;
}

function CreateComponentField(name, value) {
    if (value === null) {
        return null;
    }
    try {
        if (name == "name" || name.split('_')[0] == "HIDDEN") {
            console.log("field uses hidden tag. Not showing!")
            return null;
        }
    }
    catch (e) { console.log(e); }
    if (typeof value == "number" || typeof value == "string" || typeof value == "boolean" || value instanceof Vector2 || value instanceof Color) {
        // add to i-component (i = inspector)

        console.log(`Adding Variable to i-component:\nI-Component: ${current_component}\nVariable: ${name}:${value}`);
        inspector_memory[current_component].fields[name] = value;

        let field = document.createElement('div');
        field.className = "inspector-field";

        if (value instanceof Vector2 || value instanceof Color) { // custom value
            if (value instanceof Vector2) { // vector2 (2 input fields)
                console.log("VECTOR2 NAME :" + name); 
                let fLabel = document.createElement('p');
                fLabel.className = "inspector-label";
                fLabel.innerText = name;
                let fInput = document.createElement('input');
                fInput.className = "inspector-input";
                fInput.id = current_component + "-" + name + ".x";
                fInput.value = value["x"];

                field.appendChild(fLabel);
                field.appendChild(fInput);

                let ffInput = document.createElement('input');
                ffInput.className = "inspector-input";
                ffInput.id = current_component + "-" + name + ".y";
                ffInput.value = value["y"];

                field.appendChild(fLabel);

                field.appendChild(fInput);
                field.appendChild(ffInput);
            }
            else { // color (3/4 input fields)
                let fLabel = document.createElement('p');
                fLabel.className = "inspector-label";
                fLabel.innerText = name;
                let fInput = document.createElement('input');
                fInput.className = "inspector-input";
                fInput.id = current_component + "-" + name + ".r";
                fInput.value = value["r"];

                field.appendChild(fLabel);
                field.appendChild(fInput);

                let ffInput = document.createElement('input');
                ffInput.className = "inspector-input";
                ffInput.id = current_component + "-" + name + ".g";
                ffInput.value = value["g"];

                let fffInput = document.createElement('input');
                fffInput.className = "inspector-input";
                fffInput.id = current_component + "-" + name + ".b";
                fffInput.value = value["b"];

                let ffffInput = document.createElement('input');
                ffffInput.className = "inspector-input";
                ffffInput.id = current_component + "-" + name + ".a";
                ffffInput.value = value["a"];

                field.appendChild(fLabel);

                field.appendChild(fInput);
                field.appendChild(ffInput);
                field.appendChild(fffInput);
                field.appendChild(ffffInput);
            }
        }
        else { //primative value
            let fLabel = document.createElement('p');
            fLabel.className = "inspector-label";
            fLabel.innerText = name;
            let fInput = document.createElement('input');
            fInput.className = "inspector-input";
            fInput.id = current_component + "-" + name;
            fInput.value = value;
            if (typeof value == "boolean") {
                fInput.type = "checkbox";
                fInput.checked = value;
            }

            field.appendChild(fLabel);
            field.appendChild(fInput);
        }
        
        return field;

        // FOR EACH DONE


    }
    else {
    }
}
