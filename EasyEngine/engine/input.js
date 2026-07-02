// The input system
window.Input = class Input{
    static key = {
        "a": false, "b": false, "c": false, "d": false, "e": false, "f": false, 
        "g": false, "h": false, "i": false, "j": false, "k": false, "l": false, 
        "m": false, "n": false, "o": false, "p": false, "q": false, "r": false, 
        "s": false, "t": false, "u": false, "v": false, "w": false, "x": false, 
        "y": false, "z": false,

        "0": false, "1": false, "2": false, "3": false, "4": false, 
        "5": false, "6": false, "7": false, "8": false, "9": false,

        "ArrowUp": false, "ArrowDown": false, "ArrowLeft": false, "ArrowRight": false,
        "Backspace": false, "Tab": false, "Enter": false, "Escape": false, 
        "Delete": false, "Insert": false, "Home": false, "End": false, 
        "PageUp": false, "PageDown": false,

        "Shift": false, "Control": false, "Alt": false, "Meta": false, "CapsLock": false,

        " ": false, "!": false, "@": false, "#": false, "$": false, "%": false, 
        "^": false, "&": false, "*": false, "(": false, ")": false, "-": false, 
        "_": false, "=": false, "+": false, "[": false, "]": false, "{": false, 
        "}": false, "\\": false, "|": false, ";": false, ":": false, "'": false, 
        "\"": false, ",": false, "<": false, ".": false, ">": false, "/": false, 
        "?": false, "`": false, "~": false,

        "F1": false, "F2": false, "F3": false, "F4": false, "F5": false, "F6": false, 
        "F7": false, "F8": false, "F9": false, "F10": false, "F11": false, "F12": false
    };
    static run() {
        window.addEventListener('keydown', (e) => {
            if (this.key.hasOwnProperty(e.key)) {
                this.key[e.key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.key.hasOwnProperty(e.key)) {
                this.key[e.key] = false;
            }
        });
    }

}

Input.run();
