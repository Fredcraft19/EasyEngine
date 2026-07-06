
// The base game engine components

// ESSENTIAL CONPOENNTS
class Component{
    name = "Err: Not Defined Name!";    // manual!
    transform = null; // gameobject transform - auto set
    gameObject = null;  // gameobject/'parent' reference - auto set
    _bound_update = null; // gameobject will manage this - auto set
}

class Transform extends Component{
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

class Renderer extends Component{
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

class Trigger extends Component{
    name = "Trigger";
    type = "rect";
    transform = null;
    trigger_size = new Vector2(1, 1);
    match_transform = false;
    thickness = 0.1;

    // 1 = every 1 frame, it will check collisions,
    // 2 = every 2 frames, it will check collisions,
    // 10 = every 10 frames, it will check collisions,
    // just for performance and stuff. (e.g. you dont need high quality collision tracking for a slow moving object)
    check_rate = 1;
    frame_count = 0;
    
    #trigger_max = 0;

    #EngineReference = null;

    constructor(type = "rect", size = new Vector2(1, 1), match_transform = false) {
        super();
        this.type = type;
        this.match_transform = match_transform;
        this.trigger_size = size;
        
    }

    // gemini calculation slop for collisions (idk the math!)

    RectToRect(rect1, rect2) {
        const t1 = rect1.transform;
        const t2 = rect2.transform;

        const r1HalfX = t1.scale.x / 2;
        const r1HalfY = t1.scale.y / 2;
        const r2HalfX = t2.scale.x / 2;
        const r2HalfY = t2.scale.y / 2;

        const overlapX = Math.abs(t1.position.x - t2.position.x) <= (r1HalfX + r2HalfX);
        const overlapY = Math.abs(t1.position.y - t2.position.y) <= (r1HalfY + r2HalfY);

        return overlapX && overlapY;
    }

    CircleToCircle(circle1, circle2) {
        const t1 = circle1.transform;
        const t2 = circle2.transform;

        const r1 = t1.scale.x / 2;
        const r2 = t2.scale.x / 2;

        const dx = t1.position.x - t2.position.x;
        const dy = t1.position.y - t2.position.y;

        const distanceSquared = (dx * dx) + (dy * dy);
        const radiusSum = r1 + r2;

        return distanceSquared <= (radiusSum * radiusSum);
    }

    CircleToRect(circle, rect) {
        const cTransform = circle.transform;
        const rTransform = rect.transform;

        const radius = cTransform.scale.x / 2;
        const rectHalfX = rTransform.scale.x / 2;
        const rectHalfY = rTransform.scale.y / 2;

        const closestX = Math.max(rTransform.position.x - rectHalfX, Math.min(cTransform.position.x, rTransform.position.x + rectHalfX));

        const closestY = Math.max(rTransform.position.y - rectHalfY, Math.min(cTransform.position.y, rTransform.position.y + rectHalfY));

        const dx = cTransform.position.x - closestX;
        const dy = cTransform.position.y - closestY;
        const distanceSquared = (dx * dx) + (dy * dy);

        return distanceSquared <= (radius * radius);
    }
    // end of ai methods

    Start() {
        this.#EngineReference = this.gameObject.EngineReference();
        this.transform = this.gameObject.transform;
        if (this.match_transform) {
            if ((this.trigger_size.x != (this.transform.scale.x + this.thickness)) && (this.trigger_size.y != (this.transform.scale.y + this.thickness))) {
                this.trigger_size = new Vector2(this.transform.scale.x + this.thickness, this.transform.scale.y + this.thickness);
            }
        }
    }

    Update() {
        this.frame_count += 1;
        if (this.check_rate > this.frame_count) return;
        this.frame_count = 0;
        if(this.match_transform){
            if((this.trigger_size.x != (this.transform.scale.x + this.thickness)) && (this.trigger_size.y != (this.transform.scale.y + this.thickness)) ){
                this.trigger_size = new Vector2(this.transform.scale.x + this.thickness, this.transform.scale.y + this.thickness);
            }

            if (this.trigger_size.x > this.trigger_size.y) {
                this.#trigger_max = this.trigger_size.x;
            }
            else if (this.trigger_size.y >= this.trigger_size.x) {
                this.#trigger_max = this.trigger_size.y;
            }
        }
        // check collisions

        this.#EngineReference.GameObjects.forEach(obj => {
            if (obj != this.gameObject) {   // cant collide with itself
                if (this.gameObject.renderer.type == "rect" && obj.renderer.type == "rect") { // both rectangles
                    if (this.RectToRect(this.gameObject, obj)) this.Output(obj.name, obj.tag);
                }

                if (this.gameObject.renderer.type == "circle" && obj.renderer.type == "circle") {
                    if (this.CircleToCircle(this.gameObject, obj)) this.Output(obj.name, obj.tag);
                }

                if (this.gameObject.renderer.type != obj.renderer.type) { // different shapes!
                    let out = false;
                    if (this.gameObject.renderer.type == "rect") {
                        out = this.CircleToRect(obj, this.gameObject);
                    }
                    else {
                        out = this.CircleToRect(this.gameObject, obj);
                    }

                    if (out) this.Output(obj.name, obj.tag);
                }

            }
        });
    }

    Output(_name, _tag) {
        let evt = new CustomEvent(this.gameObject.name + ' trigger', { tag: _tag });
        window.dispatchEvent(evt);
        console.log(`[${this.gameObject.name}] Collision with: '${_name}'`);
    }

}


const Matter = window.Matter;
const MatterEngine = window.physicsEngine;
window.physicsEngine.world.gravity.y = 250000; // base gravity: 250000


class PhysicBody extends Component {
    name = "PhysicBody";
    transform = null;
    body = null;

    TITLE_1 = "Data";

    position = new Vector2(0, 0);
    scale = new Vector2(0, 0);
    rotation = 0;

    velocity = new Vector2(0, 0);

    TITLE_2 = "Settings";
    mass = 5;
    friction = 10;
    inertia = 0.5;
    
    TITLE_3 = "Key Toggles";
    solid = false;
    isKinematic = false;

    HIDDEN_lastSyncedX = 0;
    HIDDEN_lastSyncedY = 0;
    HIDDEN_lastSyncedRotation = 0;
    HIDDEN_lastSyncedVx = 0;
    HIDDEN_lastSyncedVy = 0;
    HIDDEN_lastScale = new Vector2(0, 0);
    HIDDEN_lastMass = 5;

    Start(transform, type = "rect") {
        this.transform = transform;
        this.scale = transform.scale;

        if (type == "circle") {
            this.body = Matter.Bodies.circle(transform.position.x, transform.position.y, transform.scale.x / 2);
        } else { // if not circle. rectangle then.
            this.body = Matter.Bodies.rectangle(transform.position.x, transform.position.y, transform.scale.x, transform.scale.y);
        }
        this.HIDDEN_lastScale = transform.scale;

        Matter.Composite.add(MatterEngine.world, this.body);
        this.body.friction = this.friction;
        Matter.Body.setStatic(this.body, this.solid);
    }

    Update() {
        if (!this.body) return;

        Matter.Body.setStatic(this.body, this.solid);

        let userMovedIt = this.position.x !== this.HIDDEN_lastSyncedX || this.position.y !== this.HIDDEN_lastSyncedY;
        let userRotatedIt = this.rotation !== this.HIDDEN_lastSyncedRotation;
        let userChangedVelocity = this.velocity.x !== this.HIDDEN_lastSyncedVx || this.velocity.y !== this.HIDDEN_lastSyncedVy;
        let userChangedMass = this.mass !== this.HIDDEN_lastMass;

        if (userMovedIt) {
            Matter.Body.setPosition(this.body, { x: this.position.x, y: this.position.y });
        }
        if (userRotatedIt) {
            Matter.Body.setAngle(this.body, this.rotation * (Math.PI / 180));
        }
        if (userChangedVelocity) {
            Matter.Body.setVelocity(this.body, { x: this.velocity.x, y: this.velocity.y });
        }
        if(this.scale != this.HIDDEN_lastScale){
            Matter.Body.setVelocity(this.body, { x: 0, y: 0});
            Matter.Body.scale(this.body, this.scale.x, this.scale.y);
            this.HIDDEN_lastScale = this.scale;
        }

        this.position.x = this.body.position.x;
        this.position.y = this.body.position.y;
        this.rotation = this.body.angle * (180 / Math.PI);
        this.velocity.x = this.body.velocity.x;
        this.velocity.y = this.body.velocity.y;

        if (this.transform) {
            this.transform.position.x = this.position.x;
            this.transform.position.y = this.position.y;
            this.transform.rotation = this.rotation;
        }

        this.HIDDEN_lastSyncedX = this.position.x;
        this.HIDDEN_lastSyncedY = this.position.y;
        this.HIDDEN_lastSyncedRotation = this.rotation;
        this.HIDDEN_lastSyncedVx = this.velocity.x;
        this.HIDDEN_lastSyncedVy = this.velocity.y;
    }

    AddForce(force) {
        Matter.Body.applyForce(this.body, this.body.position, { x: force.x, y: force.y });
    }

    GetVelocity() {
        return new Vector2(this.body.velocity.x, this.body.velocity.y);
    }

    GetScale(){
        return new Vector2(this.body.scale.x, this.body.scale.y);
    }

    OnDelete() {
        Matter.Composite.remove(MatterEngine.world, this.body);
    }

    SetVelocity(newVelocity) {
        Matter.Body.setVelocity(this.body, {
            x: newVelocity.x,
            y: newVelocity.y
        });
        this.velocity.x = newVelocity.x;
        this.velocity.y = newVelocity.y;
        this.HIDDEN_lastSyncedVx = newVelocity.x;
        this.HIDDEN_lastSyncedVy = newVelocity.y;
    }
}
