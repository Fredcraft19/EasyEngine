# EasyEngine Documentation

## Editor
Use somewhat like the Unity Editor but its just much worse..

## Custom Components
Template component looks like this:
```js
class COMPONENTNAME extends Component {
    name = "COMPONENTNAME";

    Start() {  // called once when object is added to gameobject

    }
    Update() {  // called every frame unless gameobject parent is disabled

    }
}
```

Example Script for PlayerMovement with a PhysicBody (my wrapper for Matter.Js):
```js
class PlayerMovement extends Component {
    name = "PlayerMovement";
    speed = 15000;
    physic = null;

    // runs on the first frame
    Start() {
        this.physic = this.gameObject.GetComponent("PhysicBody");
    }

    // runs every frame
    Update() {
        if (Input.key["w"]) {
            this.physic.AddForce(new Vector2(0, -this.speed));
        }
        if (Input.key["e"]) {
            this.physic.SetVelocity(new Vector2(0, 0));
        }
        if (Input.key["s"]) {
            this.physic.AddForce(new Vector2(0, this.speed));
        }

        if (Input.key["a"]) {
            this.physic.AddForce(new Vector2(-this.speed, 0));
        }
        if (Input.key["d"]) {
            this.physic.AddForce(new Vector2(this.speed, 0));
        }
    }
}

window.PlayerMovement = PlayerMovement;
```

Sorry for a lack of Documentation. I'm working with a friend on a [C++ GameEngine](https://github.com/carrotking362-design/Vulkan-Game-Engine) in Vulkan instead so yeah...

