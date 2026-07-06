class PlayerMovement extends Component {
    name = "PlayerMovement";
    speed = 15000;
    physic = null;
    Start() {
        this.physic = this.gameObject.GetComponent("PhysicBody");
    }
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
