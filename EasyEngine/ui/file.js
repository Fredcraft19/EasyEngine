class FileManager {

    static directory = null;

    // Requests the project directory
    static async RequestRootDirectory(){
        alert("Please input the project folder.\n\n(the file containing editor.html and other folders)");
        this.directory = await window.showDirectoryPicker();
    }

    // returns folder
    static async GetDirectory(name, dir = this.directory) {
        return await dir.getDirectoryHandle(name);
    }

    // returns file
    static async GetFile(name, dir = this.directory){
        const handle = await dir.getFileHandle(name);
        return await handle.getFile();
    }   

    // returns all files of a directory
    static async GetFiles(dir = this.directory) { 
        const files = []; 

        for await (const [, handle] of dir.entries()) {   
            if (handle.kind === "file") {     
                files.push(await handle.getFile()); 
            }  
        } 

        return files; 
    }
}
