
// The base game engine components

// ESSENTIAL CONPOENNTS
class Component{
    name = "BASE COMPONENT";
    transform = null; // gameobject transform
    gameObject = null;
}

window.Components = class Components{}

Components.Transform = class Transform extends Component{
    name = "Transform";
    parent = null;

    position = new Vector2();
    scale = new Vector2();
    rotation = 0;

    SetPosition(_x, _y){
        if(this.gameObject.HasComponent("PhysicBody")){
            physic = this.gameObject.GetComponent("PhysicBody");
            
            Matter.Body.setPosition(physic.body, {
            x: _x,
            y: _y
        });
        }
        else{
            this.position.x = _x;
            this.position.y = _y;
        }

    }

    SetScale(x, y){
        this.scale.x = x;
        this.scale.y = y;
    }
    
    SetParent(parent_transform){
        this.parent = parent_transform;
    }
}

Components.Renderer = class Renderer extends Component{
    name = "Renderer";
    color = null;

    display = true;
    
    type = "";

    constructor(_color = new window.Color(255,0,0), _type = "rect"){
        super();
        this.color = _color || new window.Color.Red;
        this.type = _type;
    }
    
    SetColor(col){
        this.color = col;
    }
    SetType(typ){
        this.type = typ;
    }
}

// OPTIONAL CONPOENENTS

Components.Trigger = class Trigger extends Component{
    name = "Trigger";
    transform = null;
    trigger_size = new Vector2(0, 0);
    match_transform = false;
    thickness = 0.1;
    
    #trigger_max = 0;

    constructor(size = new Vector2(1, 1), match_transform = false){
        this.match_transform = match_transform;
        this.trigger_size = size;
        this.transform = this.gameObject.transform;
    }

    Update(){
        if(this.match_transform){
            if((this.trigger_size.x != (this.transform.scale.x + this.thickness)) && (this.trigger_size.y != (this.transform.scale.y + this.thickness)) ){
                this.trigger_size = new Vector2(this.transform.scale.x + this.thickness, this.transform.scale.y + this.thickness);
            }
        }
        // check collisions

        Engine = this.gameObject.EngineReference();

        Engine.GameObjects().forEach(obj => {
            comp = this.transform.posiiton.subtract(obj.transform.position);
            // If object is inside trigger
            if  (!(comp.x > this.#trigger_max || -comp.x < -this.#trigger_max) &&   // X
                !(comp.y > this.#trigger_max || -comp.y < -this.#trigger_max)){     // Y

                evt = new CustomEvent(this.gameObject.name + ' trigger', {tag: obj.tag});
                window.dispatchEvent(evt);
            }
        });
    }
}


const Matter = window.Matter;
const MatterEngine = window.physicsEngine;
window.physicsEngine.world.gravity.y = 0; // was 250000


Components.PhysicBody = class PhysicBody extends Component{
    name = "PhysicBody";
    transform = null;
    body = null;

    mass = 5;
    friction = 10;
    solid = false;
    inertia = 0.5;

    velocity = new Vector2(0, 0);

    Start(transform, type = "rect"){
        this.transform = transform;

        if(type == "circle"){ 
            this.body = Matter.Bodies.circle( transform.position.x, transform.position.y, transform.scale.x);
        }
        else{ // Rectangle
            this.body = Matter.Bodies.rectangle(transform.position.x, transform.position.y, transform.scale.x, transform.scale.y);
        }

        Matter.Composite.add(MatterEngine.world, this.body);

        this.body.friction = this.friction;
        Matter.Body.setStatic(this.body, this.solid);
        //Matter.Body.setInertia(this.body, this.inertia);
        //Matter.Body.setMass(this.body, this.mass);
    }

    Update(){
        if (!this.body) return;

        this.transform.position.x = this.body.position.x;
        this.transform.position.y = this.body.position.y;
        this.transform.rotation = this.body.angle * 180 / Math.PI;
    }

    AddForce(force){
        Matter.Body.applyForce(this.body, this.body.position, {x: force.x, y: force.y});
    }

    GetVelocity(){
        return new Vector2(this.body.velocity.x, this.body.velocity.y);
    }
    SetVelocity(newVelocity){
        Matter.Body.setVelocity(this.body, {
            x: newVelocity.x,
            y: newVelocity.y
        });
    }
}
