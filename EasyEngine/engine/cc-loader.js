async function async_main() {
    // component directorys
    const scripts = [
        'PlayerMovement.js',
        'RandomMovement.js'
    ];

    // load the scripts
    for (script of scripts) {
        const ref = document.createElement('script');
        ref.src = "../EasyEngine/components/" + script;
        //   PATH: /components/PlayerMovement.js
        ref.defer = true;
        document.head.appendChild(ref);
        console.log("Loaded Component: " + script);
    };
}
async_main();
