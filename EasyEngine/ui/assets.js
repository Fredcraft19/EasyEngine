// Dependencies

class DisplayFile{
    div = null;
    text = null;
    constructor(div, text){
        this.div = div;
        this.text = text;
    }

    static Text     =   "ui/icons/default.png";
    static Folder   =   "ui/icons/folder.png";
}

async function DisplayDirectory(dirHandle) {
    const assetParent = document.getElementById("assets");
    assetParent.innerHTML = "";
    display_files = [];        

    if (historyStack.length > 0) {
        AddBackFolder(); 
    }

    for await (const [name, handle] of dirHandle.entries()) {
        AddFile(name, handle.kind);
        const lastAdded = display_files[display_files.length - 1];
        assetParent.appendChild(lastAdded.div);
    }
}

function AddBackFolder() {
    let child = document.createElement('div');
    child.className = "asset-child";
    child.innerHTML = `<img src="${DisplayFile.Folder}"><p>..</p>`;
    
    // Clicking ".." pops the history
    child.onclick = async () => {
        const parentDir = historyStack.pop();
        await NavigateTo(parentDir);
    };
    document.getElementById("assets").appendChild(child);
}

function RemoveFile(reference){
    display_files.splice(display_files.indexOf(reference), 1);
}

function AddFile(name, type) {
    let child = document.createElement('div');    
    child.className = "asset-child";
    child.id = `asset-${name}`;

    let img = document.createElement('img');
    img.src = (type === "directory") ? DisplayFile.Folder : DisplayFile.Text;

    let text = document.createElement('p');
    text.innerText = name;

    child.appendChild(img);
    child.appendChild(text);
    
    display_files.push(new DisplayFile(child, text));
}

// --------------- code here

console.log("Running assets.js");

let asset_pannel = document.getElementById("assets");
let display_files = []; // list of DiplayFile's

let currentDirHandle = null;
let historyStack = []; // folder history

async function NavigateTo(dirHandle) {
    currentDirHandle = dirHandle;
    await DisplayDirectory(dirHandle);
}

async function run() {
    await NavigateTo(await FileManager.GetDirectory("assets"));
}
run();

asset_pannel.addEventListener('click', async (e) => {
    try{
    let target = e.target.closest('.asset-child');
    if (!target) return;

    let fileName = target.id.replace('asset-', '');
    
    const handle = await currentDirHandle.getDirectoryHandle(fileName);
    
    if (handle.kind === "directory") {
        historyStack.push(currentDirHandle);
        await NavigateTo(handle);
    }
    }
    // console clogger
    catch(e){}
});
