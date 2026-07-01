window.Vector2 = class Vector2{
    x = 0;
    y = 0;
    constructor(_x = 0, _y = 0){
        this.x = _x;
        this.y = _y;
    }

    add(other){
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    subtract(other){
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    multiply(other){
        return new Vector2(this.x * other.x, this.y * other.y);
    }
    divide(other){
        return new Vector2(this.x / other.x || 1, this.y / other.y || 1);
    }
}

window.Color = class Color{
    r = 0;
    g = 0;
    b = 0;
    a = 255;

    static Red = new Color(255, 0, 0);

    constructor(r = 0, g = 0, b = 0, a = 255){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    static {
        this.Black = new Color(0, 0, 0);
        this.White = new Color(255, 255, 255);
        this.Red = new Color(255, 0, 0);
        this.Green = new Color(0, 128, 0);
        this.Blue = new Color(0, 0, 255);
        
        this.Yellow = new Color(255, 255, 0);
        this.Cyan = new Color(0, 255, 255);
        this.Magenta = new Color(255, 0, 255);
        this.Orange = new Color(255, 165, 0);
        this.Purple = new Color(128, 0, 128);
        this.Pink = new Color(255, 192, 203);
        this.Brown = new Color(165, 42, 42);
        this.Gray = new Color(128, 128, 128);
        this.Silver = new Color(192, 192, 192);
        this.Gold = new Color(255, 215, 0);
        this.Navy = new Color(0, 0, 128);
        this.Teal = new Color(0, 128, 128);
        this.Maroon = new Color(128, 0, 0);
        this.Olive = new Color(128, 128, 0);
    }
    GetRGB(){
        const alpha = this.a / 255;
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
    }
}

