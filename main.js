//console.log(require('electron'));
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const ExifReader = require('exifreader')
const fs = require('fs')
const requestedTags = require('./requestedTags')
// determine if this is running on a mac
const isMac = process.platform === 'darwin';

//define the 
let firstWindow = null;

app.on('ready', () => {
    //create a first window in our application
    firstWindow = new BrowserWindow({
        webPreferences: {
            preload: `${__dirname}/preload.js`
        }
    })
    firstWindow.loadURL(`file://${__dirname}/index.html`)
})


//create a template
//assign the template to the app
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {role: 'about'},
            {role:'quit'},
            {label: 'Quit', click (){app.quit()}}
        ]
    },
    {
        label: 'Developer',
        submenu:[{role:'toggleDevtools'}]
    }
];

//add empty menu-item if running on mac
if(isMac){
    menuTemplate.unshift({label:'empty'});
}

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)


//this code executes when the window process (renderer) sends
//the filepath from the window. (ie. when the 'Submit Photo' button is clicked)
ipcMain.on('filepath', async (event, filepath) => {
    //use the exif package to extract the data about
    //the image at the specified filepath
    const tags = await ExifReader.load(filepath);

    //package the required image information in a
    //javascript object so it can be sent to the
    //renderer process (window)
    const fileData = getRequestedFileData(tags)

    //use webContents.send to send the message/data to the window for display
    firstWindow.webContents.send('fileDataRetrieved', fileData);
})

const getRequestedFileData = tags => {
    //start with an empty object which will be filled with data
    const fileData = {}

    //loop through the array or selected properties
    //from the exif data that was read by the package
    requestedTags.forEach(tag => {
        //if the requested information is in the EXIF data
        //then add it to the object
        if(tags.hasOwnProperty(tag)){ //hasOwnProperty checks that the property
                                      //exists in the object
            
            //set the property and value in the fileData object
            fileData[tag] = tags[tag].description
        }
    })

    return fileData
}