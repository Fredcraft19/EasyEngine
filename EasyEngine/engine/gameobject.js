window.GameObject = class GameObject{
    name = "";
    tag = "default";
    transform = null;
    renderer = null;
    // custom/optional conponents such as rigidbody
    components = [];

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
            Engine.AddUpdate(component.Update.bind(component));
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
}
