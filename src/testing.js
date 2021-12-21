// XSinator

// import config
import {DEFAULT_TIMEOUT, BASE_URL} from './config.js'
// import utils
import {parseResult, generateUrls} from './utils.js'
// import testcases
import {testcases} from './testcases.js'
// import BSN 
import BSN from 'bootstrap.native/dist/bootstrap-native-v4-esm.min.js'
// import Prism
import './prism.js';



// event handlers and buttons
window.onload = () => {
    console.log("%cXSinator", "color: black; font-size: x-large");
    // console.log('%c  XSinator','background-image:url("https://xsinator.com/static/img/leak.svg");font-size:40px; background-size: contain; background-repeat: no-repeat;');
    // load previous results from LocalStorage 
    loadResultsFromLocalStorage()
    // load testcases
    makeTable(testcases)
    //add event listener to remove hash
    testModal.addEventListener('hide.bs.modal', (e) => {
        location.hash = ''
    })
    // open modal
    handleHash()
    // set Navigator string
    setNavigatorVersion()
}

window.onhashchange = () => {
    handleHash()
}

runAllTestsBtn.onclick = async (e) => {
    // setup
    toggleButtons()
    setNavigatorVersion()
    resetResults()

    let savedText = runAllTestsBtn.innerHTML
    runAllTestsBtn.innerText = 'Running ...'

    // open popup
    window.WW = openPopup()

    // run the tests
    for(let test of testcases){
        test.test_result = await runTest(test)
        colorRows(test)
    }
    // cleanup
    toggleButtons()
    runAllTestsBtn.innerHTML = savedText

    // Send result to server 
    exportToServer(BASE_URL)

    // close popup
    window.WW.close()

    // save in localStorage
    localStorage.setItem('results', JSON.stringify(exportResult('Your Browser',"",""))) // empty version, platform

    // activate compare button
    compareResultsBtn.disabled = false

}


compareResultsBtn.onclick = () => {
    // go back index
    location = '/'
}

clearResultsBtn.onclick = () => {
    localStorage.clear()
    location.reload()
}

exportResultsBtn.onclick = async () => {
    showExportModal()
}

// helper functions

// make the big table
const makeTable = (testcases) => {
    let counter = 0
    leakTable.innerText = ''
    for(let test of testcases){
        let {test_name, 
            test_description
        } = test
        let row = leakTable.insertRow()

        row.insertCell(0).innerText = `${counter}`
        
        // link to test
        let testLink = document.createElement('a')
        testLink.innerText = test_name
        testLink.href = `#`
        row.insertCell(1).appendChild(testLink)

        row.insertCell(2).innerText = `${test_description}`

        // make row clickable
        row.onclick = () => {
            showTestModal(test)
        }
        // increase counter
        counter++
        test.test_row = row
        if(test.test_result){
            colorRows(test)
        }
        else{
            test.test_result = {'res0':'no result', 'res1':'no result'}
        }
    }
}

const runTest = async (test) => {
    let {test_name, test_url, test_function, test_row, test_timeout, test_needsWindow} = test
    colorSingleRow(test_row, 'secondary')
    let res0, res1
    let {url0, url1} = generateUrls(test_url)

    // no timeout: set default timeout
    if(!test_timeout){
        test_timeout = DEFAULT_TIMEOUT
    }
    // do we need a window?
    if(test_needsWindow){
        if(!window.WW || window.WW.closed){
            window.WW = openPopup()
        }
    }

    // test 0
    try {
        res0 = await timeoutPromise(test_timeout, new Error('Timed Out!'), test_function(url0))
    }
    catch (e) {
        console.log(`Error running ${test_name} for ${url0}`)
        console.log(e)
        res0 = e.message
    }

    // test 1
    try {
        res1 = await timeoutPromise(test_timeout, new Error('Timed Out!'), test_function(url1))
    }
    catch (e) {
        console.log(`Error running ${test_name} for ${url1}`)
        console.log(e)
        res1 = e.message
    }

    return {'res0': res0, 'res1': res1}    

}


const colorRows = (test) => {
    let {test_row, test_result} = test
    colorSingleRow(test_row, parseResult(test_result))
}



const colorSingleRow = (row, result) => {
    row.classList.remove('table-success', 'table-danger', 'table-secondary', 'table-warning', 'table-default')
    row.classList.add(`table-${result}`)
}

const resetResults = () => {
    for(let test of testcases){
        test.test_result = {'res0':'no result', 'res1':'no result'}
        if(test.test_row){
            colorSingleRow(test.test_row, 'default')
        }
    }
}


const showTestModal = async (test) => {
    let {test_name, test_url, test_file, test_description, test_result} = test
    let {url0, url1} = generateUrls(test_url)

    testModalTitel.innerText = test_name
    testModalDescription.innerText = test_description
    testModalRes0.innerText = test_result.res0
    testModalUrl0.href = url0
    testModalUrl0.innerText = url0
    testModalRes1.innerText = test_result.res1
    testModalUrl1.href = url1
    testModalUrl1.innerText = url1

    // set test_file as a link
    testModalFileLink.href = test_file
    testModalFileLink.innerText = test_file

    // highlight code with prism
    let response = await fetch(test_file)
    testModalCode.textContent = await response.text()
    Prism.highlightElement(testModalCode)

    // set url
    runCustomTestUrl.placeholder = 'https?://'
    runCustomTestUrl.value = url1
    runCustomTestResult.innerText = ''

    // custom test
    runCustomTestBtn.onclick = async() => {
        // very secure
        let url = runCustomTestUrl.value
        let res = `Invalid URL` 

        // run test if url is valid
        if(isValidUrl(url)){
            runCustomTestBtn.disabled = true
            res = await runCustomTest(url, test)
            runCustomTestBtn.disabled = false
        }
        // show results
        if(runCustomTestResult.innerText !== ''){
            runCustomTestResult.appendChild(document.createElement('hr'))
        }
        let cmd = document.createElement('div')
        cmd.innerText = `leak('${url}')
        -> ${res}`
        runCustomTestResult.appendChild(cmd)


        // close window
        if (window.WW){
            window.WW.close()
        }
    }

    // show modal
    let m = new BSN.Modal('#testModal', {backdrop: true})
    m.show()

    // set location hash
    location.hash = `${test_name}`
    
    // rerun test
    runTestBtn.onclick = async () => {
        // disable button
        runTestBtn.disabled = true
        // run the test
        test.test_result = await runTest(test)
        // enable button
        runTestBtn.disabled = false
        // update row color
        colorRows(test)
        // save again 
        localStorage.setItem('results', JSON.stringify(exportResult('Your Browser',"",""))) // empty version, platform
        // reopen the modal
        showTestModal(test)
        // close window
        if (window.WW){
            window.WW.close()
        }
 
    }
}

const runCustomTest =  async (url, test) => {
    let {test_name, test_function, test_timeout, test_needsWindow} = test
    let res0
    let url0 = url

    // no timeout: set default timeout
    if(!test_timeout){
        test_timeout = DEFAULT_TIMEOUT
    }
    // do we need a window?
    if(test_needsWindow){
        if(!window.WW || window.WW.closed){
            window.WW = openPopup()
        }
    }

    // test 0
    try {
        res0 = await timeoutPromise(test_timeout, new Error('Timed Out!'), test_function(url0))
    }
    catch (e) {
        console.log(`Error running ${test_name} for ${url0}`)
        console.log(e)
        res0 = e.message
    }
    return res0
}

const showExportModal = () => {
    exportModalText.innerText = JSON.stringify(exportResult())
    new BSN.Modal('#exportModal', {backdrop: true}).show()
}

const openPopup = () => {
    let WW = window.open(
        '/blank.html',
        'targetWindow',
        `toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,left=${screen.width-250},width=250,height=250`
    )

    return WW
}

const timeoutPromise = (t, err, promise) => {
    return new Promise((res,rej) => {
        promise.then(res,rej)
        setTimeout(rej.bind(null, err), t)
    })
}

const isValidUrl = (url) => {
    let input = document.createElement('input')
    input.type = 'url'
    input.value = url

    if (input.checkValidity() && url.startsWith('http')){
        return true
    }
    return false
}

const exportResult = (name='BrowserName', platform="Desktop/iOS/Android", version="XX.X.X") => {
    return {
        'metadata': {
            'name': name,
            'platform': platform,
            'version': version,
            'appVersion': appVersionField.innerText,

        },
        'testcases': testcases.map(({test_name, test_result}) => {
            return {test_name, test_result}
        })
    }
}
// to extract the result
window.exportResult = exportResult

const handleHash = () => {
    // open specifc test from hash
    if(window.location.hash){
        let tname = decodeURI(window.location.hash.slice(1))
        // find testcase
        for(let test of testcases){
            if(test.test_name === tname){
                showTestModal(test)
            }
        }
    }
    // close modal on back
    else if(testModal.Modal){
        testModal.Modal.hide()
    }
}


const loadResultsFromLocalStorage = () => {
    if(localStorage.getItem('results')){
        try {
            let r = JSON.parse(localStorage.getItem('results'))
            // load results
            for(let t1 of testcases){
                // clear results
                t1.test_result = {'res0':'no result', 'res1':'no result'}
                for(let t2 of r.testcases){
                    if(t1.test_name === t2.test_name){
                        t1.test_result = t2.test_result
                    }
                }
            }
            setNavigatorVersion(r.metadata.appVersion)
        } catch (error) {
            console.error(error)
        }
    }
}


const toggleButtons = () => {
    runAllTestsBtn.disabled ? runAllTestsBtn.disabled = false : runAllTestsBtn.disabled = true
    exportResultsBtn.disabled ? exportResultsBtn.disabled = false : exportResultsBtn.disabled = true
}


const setNavigatorVersion = (version=navigator.userAgent) => {
    appVersionField.innerText = version
}

// heck
window.exportToServer = async (url) => {
    await fetch(url + '?' + btoa(JSON.stringify(exportResult())))
    .catch()
}
