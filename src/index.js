// XSinator

// import utils
import {parseResult, generateUrls} from './utils.js'
// import results
import {resultsList} from './testresults/resultsList.js'
// import testcases
import {testcases} from './testcases.js'
// import BSN 
import BSN from 'bootstrap.native/dist/bootstrap-native-v4-esm.min.js'


// event handlers and buttons
window.onload = () => {
    console.log("%cXSinator", "color: black; font-size: x-large");
    // generate the table from results
    makeResultsTable(addResultLocalStorage(resultsList))

}


const makeResultsTable = (resultsList, filterValues = {}) => {
    // clear maybe there is something
    resultTableHead.innerHTML = ''
    resultTableBody.innerHTML = ''
    // make head
    let head0 = resultTableHead.insertRow(0)
    makeFilterField('version', head0, filterValues)
    let head1 = resultTableHead.insertRow(0)
    makeFilterField('platform', head1, filterValues)
    let head2 = resultTableHead.insertRow(0)
    makeFilterField('name', head2, filterValues)


    for(let result of resultsList){
        let th0 = document.createElement('th')
        th0.classList.add('text-center', 'align-middle')
        let span0 = document.createElement('span')
        span0.title = result.metadata.appVersion
        span0.innerText = result.metadata.version
        th0.appendChild(span0)
        head0.appendChild(th0)

        let th1 = document.createElement('th')
        th1.classList.add('text-center', 'align-middle')
        let span1 = document.createElement('span')
        span1.title = result.metadata.appVersion
        span1.innerText = result.metadata.platform
        th1.appendChild(span1)
        head1.appendChild(th1)

        let th2 = document.createElement('th')
        th2.classList.add('text-center', 'align-middle')
        let span2 = document.createElement('span')
        span2.title = result.metadata.appVersion
        span2.innerText = result.metadata.name
        th2.appendChild(span2)
        head2.appendChild(th2)

        // remove Your Browser from local Storage
        if(result.metadata.name === 'Your Browser'){
            span2.ondblclick = () => {
                localStorage.clear()
                location.reload()
            }
        }

    }

    // handle categories
    let last_category = ''

    // fill body
    for(let t1 of testcases){
        if(t1.test_category !== last_category){
            last_category = t1.test_category
            let c_row = resultTableBody.insertRow(-1)
            c_row.classList.add('separator')
            let c_cell = c_row.insertCell(-1)
            let c_span = document.createElement('b')
            c_span.innerText = t1.test_category
            c_cell.appendChild(c_span)
            // fill up table
            for(let i = 0; i<resultsList.length; i++){
                c_row.insertCell(-1)
            }

        }
        let row = resultTableBody.insertRow(-1)
        let firstCell = row.insertCell(-1)

        // create link to test
        let testLink = document.createElement('a')
        testLink.innerText = t1.test_name
        testLink.href = `/testing.html#${t1.test_name}`
        firstCell.appendChild(testLink)

        // fill rest
        for(let result of resultsList){
            let need_empty_row = true
            for(let t2 of result.testcases){
                if(t2.test_name === t1.test_name){
                    need_empty_row = false
                    let currentRow = row.insertCell(-1)
                    currentRow.classList.add('text-center')
                    
                    t2.test_row = currentRow
                    t2.test_description = t1.test_description
                    t2.test_url = t1.test_url
                    currentRow.title = t1.test_description

                    // color row
                    colorRows(t2)
                    // create button

                    currentRow.title = "Show Result"

                    currentRow.classList.add('showtest')
                    currentRow.onclick = (e) => {
                        e.preventDefault()
                        showTestModal(t2, result.metadata)
                    }
                }
            }
            // handle missing results
            if(need_empty_row){
                row.insertCell(-1)
            }
            
        }
    }

}

const makeFilterField = (filter, head, filterValues) => {
    let form = document.createElement('form')
    let input = document.createElement('input')
    if(filterValues && filterValues[filter]){
        input.value = filterValues[filter]
    }
    input.id = `filter${filter}`
    input.placeholder = `Filter by ${filter}`
    input.classList.add('form-control')

    form.onsubmit = (e) => {
        e.preventDefault()
        filterColumns(filtername.value, filterplatform.value, filterversion.value)
    }
    form.classList.add('input-group')
    form.appendChild(input)

    let clearButton = document.createElement('button')
    let div = document.createElement('div')
    div.classList.add('input-group-append')
    clearButton.classList.add('btn', 'bg-light', 'border')
    clearButton.type = 'button'
    clearButton.onclick = (e) => {
        e.preventDefault()
        input.value=''
        filterColumns(filtername.value, filterplatform.value, filterversion.value)
    }
    let x = document.createElement('span')
    x.classList.add('fa', 'fa-times')
    clearButton.appendChild(x)
    div.appendChild(clearButton)
    form.appendChild(div)

    let th = document.createElement('th')
    th.appendChild(form)
    th.classList.add('align-middle')
    head.appendChild(th)
}

const filterColumns = (name='', platform='', version='') => {
    if(name === '' && platform ==='' && version === ''){
        makeResultsTable(resultsList)
    }
    // we want to filter the list (bad code)
    else{
        let FilteredResultsList = []
        let trackLatestVersion = []
        for(let result of resultsList){
            if(result.metadata.name === 'Your Browser'){
                FilteredResultsList.push(result)
                continue
            }
            if(!result.metadata.name.toLowerCase().includes(name.toLowerCase())){
                continue
            }
            if(!result.metadata.platform.toLowerCase().includes(platform.toLowerCase())){
                continue
            }
            if(version.toLowerCase() === 'latest'){
                let s = `${result.metadata.name.toLowerCase()} - ${result.metadata.platform.toLowerCase()}`
                if(trackLatestVersion.includes(s)){
                    continue
                }else{
                    trackLatestVersion.push(s)
                }
            }
            else if(!result.metadata.version.toLowerCase().includes(version.toLowerCase())){
                continue
            }

            FilteredResultsList.push(result)
        }
        makeResultsTable(FilteredResultsList, {'name':name, 'platform':platform, 'version':version})
    }
    
}

const colorRows = (test) => {
    let {test_row, test_result} = test
    colorSingleRow(test_row, parseResult(test_result))
}

const colorSingleRow = (row, result) => {
    row.classList.remove('table-success', 'table-danger', 'table-secondary', 'table-warning', 'table-default')
    row.classList.add(`table-${result}`)
}

const addResultLocalStorage = (resultsList) => {
    if(localStorage.getItem('results')){
        try {
            let myResults = JSON.parse(localStorage.getItem('results'))
            resultsList.unshift(myResults)
            // highlight "Your Browser"
            resultTableBody.classList.add('highlight')
        } catch (error) {
            console.error(error)
        }
    }
    return resultsList
}

const showTestModal = (test, metadata) => {
    let {test_name, test_url, test_result} = test
    let {url0, url1} = generateUrls(test_url)
    testModalTitel.innerText = `Results: ${test_name}`
    testModalRes0.innerText = test_result.res0
    testModalUrl0.href = url0
    testModalUrl0.innerText = url0
    testModalRes1.innerText = test_result.res1
    testModalUrl1.href = url1
    testModalUrl1.innerText = url1
    testModalBrowser.innerText = `${metadata.name} ${metadata.platform} Version ${metadata.version}`
    testModalAppVersionField.innerText = metadata.appVersion
    testModalLink.href = `testing.html#${test_name}`

    // show result 
    testModalResult.innerText = ''
    let span = document.createElement('span')
    span.classList.add('badge', `badge-${parseResult(test_result)}`)
    testModalResult.appendChild(span)


    testModal.addEventListener('hide.bs.modal', (e) => {
        // console.log(e)
    });

    new BSN.Modal(testModal, { backdrop: true}).show()


}