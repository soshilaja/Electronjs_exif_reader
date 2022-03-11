//preload.js allows up to do some initial setup of some functions
//that will be exposed to the window process. In our case, we're
//creating a couple of functions to allow us to do ipc (inter-process-communication)
//between the main process(node) and the renderer process(window/chromium)


const { contextBridge, ipcRenderer } = require("electron");

//create a custom set of functions that our window will be able to call
contextBridge.exposeInMainWorld(
    'electronapi',
    {
        sendFilePath: function(filepath){
            ipcRenderer.send('filepath', filepath)
        },
        onFileDataRetrieved: function(func){
            //when the main process sends back the exif file info, it invokes
            //the webContents.send() method on the main window.
            //the following line of code is listening for that
            //call to happen and will respond accordingly

            //renderer.js provides a function (func) that ipcRenderer can call
            //when there's data to send to the window
            ipcRenderer.on('fileDataRetrieved', (event, fileData) => func(fileData));
        },
    }
)