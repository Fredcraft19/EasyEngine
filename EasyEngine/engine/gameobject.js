class GameObject{
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
        this.renderer = new Renderer(window.Color.Red, shape);
        this.transform = new Transform();
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

                if(typeof component.Update == "function") Engine.PopUpdate(component._bound_update);
                if (typeof component.OnDelete == "function") component.OnDestroy();

                this.components.splice(i, 1);
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
    EnabledCheck() {
        
        if (this.enabled != this.#enabled) {
            this.#enabled = this.enabled; // for toggle memory
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
                        if (!this.enabled) {
                            if (typeof c.OnDisabled === "function") c.OnDisabled();   
                            Engine.PopUpdate(c._bound_update);   
                        } else {
                            if (typeof c.OnEnabled === "function") c.OnEnabled();

                            Engine.AddUpdate(c._bound_update);   
                        }
                    }
                });
            }
            catch(e) {console.log(e);} 
        }
    }
    Destroy() {
        Engine.PopGameObject(this);

        this.name = "deleted gameobject name";
        this.tag = "deleted gameobject tag";
        this.id = -1; // deleted id meaning

        this.enabled = false;
        this.#enabled = true;
        this.EnabledCheck();

        this.renderer = null;
        this.transform = null;
        
        this.components.forEach(comp => {
            if(typeof comp.OnDestroy == "function"){
                comp.OnDestroy();
            }
        });

        // reuse code to stop all component's update loops
        
        this.components = [];
    }

    Serialize(){
        return {
            name: this.name,
            tag: this.tag,
            enabled: this.enabled,
            display: this.#display,

            transform: {
                position: { x: this.transform.position.x, y: this.transform.position.y },
                scale: { x: this.transform.scale.x, y: this.transform.scale.y },
                rotation: this.transform.rotation
            },
            renderer: {
                color: { r: this.renderer.color.r, g: this.renderer.color.g, b: this.renderer.color.b, a: this.renderer.color.a },
                type: this.renderer.type,
                display: this.renderer.display
            },

            components: []
        }
    }

}
