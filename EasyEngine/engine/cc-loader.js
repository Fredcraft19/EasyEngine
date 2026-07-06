class CustomComponentLoader{
    static injected_scripts = [];
    static components = null;
    static async LoadComponents() {
        if(!FileManager.directory) {
            return;
        }
        this.injected_scripts.forEach(src => {
           src.remove();
        });

        this.injected_scripts = [];

        let scripts = [];
        // get custom component directorys
        
        let comp_dir = await FileManager.GetDirectory("components", await FileManager.GetDirectory("assets"));
        this.components = await FileManager.GetFiles(comp_dir);
        this.components.forEach(c => {
            scripts.push(c.name);
        });

        // load the scripts
        for (script of scripts) {
            const ref = document.createElement('script');
            ref.src = "../EasyEngine/assets/components/" + script;
            ref.defer = true;
            document.head.appendChild(ref);
            this.injected_scripts.push(ref);
            console.log("Loaded Component: " + script);
        };
    }   
}
