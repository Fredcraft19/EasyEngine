
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

const Matter = window.Matter;
const MatterEngine = window.physicsEngine;
window.physicsEngine.world.gravity.y = 250000;


Components.PhysicBody = class PhysicBody extends Component{
    name = "PhysicBody";
    transform = null;
    body = null;

    friction = 10;;
    solid = false;

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
    }

    Update(){
        if (!this.body) return;

        this.transform.position.x = this.body.position.x;
        this.transform.position.y = this.body.position.y;
        this.transform.rotation = this.body.angle;
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
