// bob the builder reference?
// (can he fix it?)

class ProjectSetup{
    // project settings
    target_fps = 60;
    fullscreen = true;
    display_size = null;

    // project storage/setup
    gameobjects = [];
}

class Builder{
    static projectState = null;

    static build_directory = null;

    static start_time = null;
 
    static project_name = "default_name";
 
    static setup_json = "";
    static cc_js = "";

    static async SaveProject(){
        console.log("saving project..")
        this.projectState = new ProjectSetup();

        this.projectState.target_fps = Engine.targetFps
        this.projectState.fullscreen = Engine.fullscreen;
        this.projectState.display_size = {x: Engine.DisplaySize.x, y: Engine.DisplaySize.y};

        Engine.GameObjects.forEach(obj => {
            let data = obj.Serialize();
            obj.components.forEach(c => {
                data.components.push(c.Serialize());
            });
            this.projectState.gameobjects.push(data);
        });

        // Done
        console.log("project saved");
        console.log(this.projectState);

        
    }

    static async Build(){
        await this.SaveProject();
        this.start_time = Date.now();

        this.build_directory = await FileManager.GetDirectory("build");

        setup_json = await this.#JSON();
        cc_js = await this.#CustomComponents();

        await this.#OutputBuild();
    }

    static async #JSON() {
        const seen = new WeakSet();

        const replacer = (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    console.warn(`Circular reference detected at key: "${key}"`);
                    return "[Circular]"; 
                }
                seen.add(value);
            }
            return value;
        };

        return JSON.stringify(this.projectState, replacer, 2);
    }

    static async #CustomComponents(){
        
        let full_cc = "";
        let scripts = [];
        let Directory = await FileManager.GetDirectory("components", await FileManager.GetDirectory("assets"));
        this.components = await FileManager.GetFiles(Directory);

        this.components.forEach(c => {
            scripts.push(c.name);
        });

        scripts.forEach(script =>{
            full_cc += "\n" + script.text();
        });

        return full_cc;
    }

    static async #GenerateHTML(){
        return `<!DOCTYPE html><html><head><title>${this.project_name}</title><script src='deps/init.js'></script></head><body><canvas id="canvas"></canvas></body> </html>`;
    }

    static async #OutputBuild(){
        console.log("outputing build..");
        let deps_dir = await FileManager.GetDirectory("deps", await FileManager.MakeFOlder("deps", this.build_directory));
        console.log("made deps/");
        await FileManager.MakeFile("setup.json", this.setup_json, deps_dir);
        console.log("made deps/setup.json");
        await FileManager.MakeFile("cc.js", this.cc_js, deps_dir);
        console.log("made deps/cc.js");
        await FileManager.MakeFile(`${this.project_name}.html`, await this.#GenerateHTML(), this.build_directory);
        console.log(`made deps/${this.project_name}.html`);
        let end_time = Date.now()
        console.log(`Build Complete in:\n${(end_time - start_time) / 1000}s | ${end_time - start_time}ms`);
    }
}


window.Builder = Builder;
