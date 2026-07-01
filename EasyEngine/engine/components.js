// The base game engine components

window.Transform = class Transform{
    position = new Vector2();
    scale = new Vector2();

    SetPosition(x, y){
        this.position.x = x;
        this.position.y = y;
    }

    SetScale(x, y){
        this.scale.x = x;
        this.scale.y = y;
    }
}

window.Renderer = class Renderer{
    color = null;
    type = "";

    constructor(_color, _type){
        this.color = _color
        this.type = _type;
    }
    
    SetColor(col){
        this.color = col;
    }
    SetType(typ){
        this.type = typ;
    }
}
