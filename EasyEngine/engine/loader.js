async function async_main(){
    // sleep
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // script directorys
    const scripts = [
        'engine/matter/matter.min.js',
        'engine/math.js',
        'engine/components.js',
        'engine/engine.js',
        'engine/gameobject.js',
        'engine/input.js',

        // Just sends 'engine-loaded' event out
        'engine/event.js'
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
