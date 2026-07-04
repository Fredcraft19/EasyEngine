async function async_main(){
    // sleep
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // script directorys
    const scripts = [
        'engine/matter/matter.min.js',      // physics engine
        'engine/math.js',                   // base mathmatical classes
        'engine/components.js',             // pre-made components
        'engine/engine.js',                 // engine logic
        'engine/gameobject.js',             // game object class
        'engine/input.js',                  // input manager
        'engine/cc-loader.js',              // loads all custom components

        'engine/setup/setup.js'  ,           // Project Setup (creates all gameobjects with components)

        'engine/event.js'                   // starts the 'engine and loads everything kinda'

    ];

    // load the scripts
    for(script of scripts){
        const ref = document.createElement('script');
        ref.src = script;
        ref.defer = true;
        document.head.appendChild(ref);
        console.log("Injected script: " + script);
        await sleep(75);
    };
}
async_main();
