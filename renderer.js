//javascript for the index.html page

//this code executes when ipcRenderer in preload receives a 'fileDataRetrieved'
//message from the main process
window.electronapi.onFileDataRetrieved(fileData => {

    console.log(fileData)

    const fileDataDisplayArea = document.querySelector('#fileInfo')

    const hTag = document.createElement('h3')
    hTag.innerText = 'Retrieved File Information:'
    fileDataDisplayArea.appendChild(hTag)

    for(const property in fileData){
        const newPTag = document.createElement('p')
        newPTag.innerHTML = `<strong>${property}:</strong> ${fileData[property]}`
        fileDataDisplayArea.appendChild(newPTag)
    }
});

document.querySelector('#photo').addEventListener('input', () => {
    clearAnyPreviousFileInfoFromDisplay();
})

//create a click event for the button
document.querySelector('#submitButton').addEventListener('click', () => {

    //extract the file location for the file that been selected
    //and send that location to main.js
    const selectedPhoto = document.querySelector('#photo')

    if(selectedPhoto.files.length > 0) {
        clearAnyPreviousFileInfoFromDisplay()
        const filepath = document.querySelector('#photo').files[0].path
        console.log(filepath)
        electronapi.sendFilePath(filepath)
    }
    else {
        alert('You havent\'s selected a file yet!')
    }
   
})

const clearAnyPreviousFileInfoFromDisplay = () => {
    document.querySelector('#fileInfo').innerHTML = ''
}