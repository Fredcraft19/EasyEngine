window.GameObject = class GameObject{
    name = "";
    tag = "default";
    transform = null;
    renderer = null;
    // custom/optional conponents such as rigidbody
    components = [];

    enabled = true;
    #enabled = true;

    #display = true;

    id = 0; // DO NOT CHANGE THIS ID (this is for the engine to do)

    // Add Layers later?

    constructor(name = "GameObject ["+ (Engine.gameobjectCount+1) + "]", shape = "rect"){
        this.renderer = new window.Renderer(window.Color.Red, shape);
        this.transform = new window.Transform();
        this.transform.scale = new Vector2(20, 20);
        Engine.PushGameObject(this);

        this.name = name;

        this.renderer.gameObject = this;
        this.transform.gameObject = this;

        Engine.AddUpdate(this.EnabledCheck.bind(this));
    }
    EngineReference(){
        return Engine;
    }
    AddComponent(component){
        this.components.push(component);
        component.gameObject = this;
        if(typeof component.Start === "function"){
            if(component.name === "PhysicBody"){
                component.Start(this.transform, this.renderer.type);
            }
            else{
                component.Start();
            }
            component.gameObject = this;
        }
        if(typeof component.Update === "function"){
            let comp_update = component.Update.bind(component);
            component._bound_update = comp_update;
            Engine.AddUpdate(comp_update);
        }
    }
    RemoveComponent(component) {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] == component) {

                if(typeof component.Update == "function") Engine.PopUpdate(component.Update);
                if (typeof component.OnDelete == "function") component.OnDelete();

                this.components.splice(i, 1);
                console.warn(`Successfully deleted ${component.name} from GameObject backend!`);
                break;
            }
        }
    }
    GetComponent(name){
        if(name == "Renderer"){
            return this.renderer;
        }
        else if(name == "Transform"){
            return this.transform;
        }
        else {
            let output = null
            this.components.forEach( comp => {
                if(comp.name === name){
                    output = comp;
                }
            });
            if(output != null) return output;
        }
        console.log("failed to find compoennt of name: '" + name + "'.");
    }
    HasComponent(name){
        if(name == "Renderer"){
            return true;
        }
        else if(name == "Transform"){
            return true;
        }
        else{
            this.components.forEach( comp => {
                if(comp.name === name){
                    return true;
                }
            });
        }
        return false;
    }
    Destroy() {
        name = "deleted gameobject name";
        tag = "deleted gameobject tag";
        id = -1; // deleted id meaning
        renderer = null;
        transform = null;
        components = [];

        Engine.PopGameObject(this);
    }
    EnabledCheck() {
        
        if (this.enabled != this.#enabled) {
            this.#enabled = this.enabled; // for toggle memory
            console.log("setup!");
            // does renderer
            if (!this.enabled) {
                this.#display = this.renderer.display;
                this.renderer.display = false;
            } else {
                this.renderer.display = this.#display;
            }
            
            // toggles components
            try{
                this.components.forEach(c => {
                    if (typeof c.Update === "function" && c._bound_update) { 
                        console.log(c.name + ": has Update! TRUE");
                        if (!this.enabled) {
                            if (typeof c.OnDisabled === "function") c.OnDisabled();   
                            Engine.PopUpdate(c._bound_update);   
                            console.log("asked to delete UpdateMethod!"); 
                        } else {
                            if (typeof c.OnEnabled === "function") c.OnEnabled();

                            Engine.AddUpdate(c._bound_update);   
                            console.log("asked to add back UpdateMethod!"); 
                        }
                    }
                });
            }
            catch(e) {console.log(e);} 
        }
    }
}
