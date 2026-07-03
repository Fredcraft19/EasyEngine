window.GameObject = class GameObject{
    name = "";
    tag = "default";
    transform = null;
    renderer = null;
    // custom/optional conponents such as rigidbody
    components = [];

    // Add Layers later?

    constructor(name = "GameObject ["+ (Engine.gameobjectCount+1) + "]", shape = "rect"){
        this.renderer = new window.Components.Renderer(window.Color.Red, shape);
        this.transform = new window.Components.Transform();
        Engine.PushGameObject(this);

        this.renderer.gameObject = this;
        this.transform.gameObject = this;
    }
    EngineReference(){
        return Engine;
    }
    AddComponent(component){
        this.components.push(component);
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
        else{
            this.components.forEach( comp => {
                if(comp.name === name){
                    return comp;
                }
            });
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
}
