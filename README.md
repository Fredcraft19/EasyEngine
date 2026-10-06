# EasyEngine
A Somewhat functional Game Engine made in JavaScript using the HTML5 Canvas. It allows for JavaScript custom scripting via Custom Components. It can build projects which creates a copy of the project without the editor code.
## EasyEngine File Structure
The `editor.html` file is the one you run to use the editor.

The `engine/` folder contains all the core EasyEngine source files, this is the actual engine.

The `assets/` folder contains all dev-made/dev-uploaded files from the editor

The `ui/` folder contains all the editor files

The `build/` folder contains the build. DO NOT Delete/touch builder.js. Your build project will be in `build/output/`

Everything in EasyEngine folder is the Editor with an example project. When the editor is 'ready for release'* then there will be the editor, without any example project, in the releases tab of the repository.

*by 'ready for release', that doesnt mean high quality. it just means im happy with it and that its most likely fully functional.

To get just the engine's source files, install the latest relase.
## Features
* Physics with matter.js
* Ability to view at runtime (via scripting and console logs) and in editor FPS
* Editor
* Inspector page in Editor to change variables during project runtime
* Custom Components in JavaScript
* Project building
## Planned Features
* Saving and loading projects in the editor
## Physics
EasyEngine uses 'Matter.js' for its physics.

For more information of Matter.js, go to their [repository](https://github.com/liabru/matter-js/tree/master)

## Documentation
Go to 'Documentation.MD' for the EasyEngine's documentation.
