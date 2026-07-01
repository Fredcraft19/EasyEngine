async function async_main(){
    // sleep
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // script directorys
    const scripts = [
        'engine/math.js',
        'engine/components.js',
        'engine/engine.js',
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
        await sleep(10);
    };
}
async_main();
