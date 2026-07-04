window.RandomMovement = class RandomMovement extends Component {
    name = "RandomMovement";
    particle_phys = null;

    Start() {
        this.particle_phys = this.gameObject.GetComponent("PhysicBody");
    }
    Update() {
        this.particle_phys.AddForce(new Vector2(Math.round(Math.random() * 100) - 50, Math.round(Math.random() * 100) - 50))
    }
}
