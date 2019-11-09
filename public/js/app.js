const btnShort = document.getElementById('btn-short')
const url = document.getElementById('url')
const urlAlert = document.getElementById('url-alert')
const urlAlertText = document.getElementById('url-alert-text')

const validURL = (str) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
      '((\\d{1,3}\\.){3}\\d{1,3}))'+
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
      '(\\?[;&a-z\\d%_.~+=-]*)?'+
      '(\\#[-a-z\\d_]*)?$','i');

    return !!pattern.test(str);
}

function saveClipBoard(data) {
    var dummy = document.createElement('input');
    var text = data;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    var success = document.execCommand('copy');
    document.body.removeChild(dummy);
    
    return success;
}

const shortenerResponse = (isValidUrl, serverMessage) => {

    let message = ''

    if (isValidUrl) {
        urlAlert.classList.remove('alert-danger')
        urlAlert.classList.add('alert-success')
        urlAlert.classList.remove('invisible')

        message = `
            <strong>Your URL:</strong> 
            <a id="shorted-url" href="${serverMessage}" target="_blank">${serverMessage}</a>
            <button class="btn btn-sm btn-primary right" id="btn-copy-link">Copy</button>
            <span class="mr-2 right d-none" id="copied">Copied</span>
            
        `
    } else {
        urlAlert.classList.remove('alert-success')
        urlAlert.classList.add('alert-danger')
        urlAlert.classList.remove('invisible')

        message = `<strong>Warning:</strong> ${serverMessage}`
    }

    urlAlertText.innerHTML = message
}

url.addEventListener('keypress', (e) => {
    if (e.which == 13 || e.keyCode == 13 || e.key == 'Enter') {
        btnShort.click()
    }
})

btnShort.addEventListener('click', async () => {
    
    const longUrl = url.value

    const isValidUrl = validURL(longUrl)
    
    if(isValidUrl) {
        const response = await fetch('/create', {
            method: 'POST',
            body: JSON.stringify({
                url: longUrl
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json())

        let success = response.success
        let message = '' 

        if(success) {
            const { url } = response
            message = `${window.location.origin}/${url}`
        } else {
            message = `URL couldn't shortened`
        }

        shortenerResponse(success, message)

        
    } else {
        shortenerResponse(isValidUrl, 'Please enter a correct URL')
    }    
})

document.addEventListener('click', (e) => {
    if (e.target && e.target.id == 'btn-copy-link') {
        const shortedUrl = document.getElementById("shorted-url")

        const isCopied = saveClipBoard(shortedUrl.href)

        if (isCopied) {
            document.getElementById('copied').classList.remove('d-none')
        }

    }
    
})