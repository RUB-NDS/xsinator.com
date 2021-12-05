import {TEST_URL} from './config.js'

// give results color
const parseResult = (test_result) => {
    let {res0, res1} = test_result
    // exploitable 
    if(res0 === 0 && res1 === 1){
        return 'danger'
    }
    // empty results 
    else if(res0 === undefined || res1 === undefined){
        return 'success'
    }
    else if(res0 === '' || res1 === ''){
        return 'success'
    }
    // no results
    else if(res0 === 'no result' && res1 === 'no result'){
        return 'default'
    }
    // timeouts
    else if(res0 === 'Timed Out!' && res1 === 'Timed Out!'){
        // TODO: how to handle timeouts
        return 'secondary'
    }
    // payment api
    else if(res0 === 'PaymentRequest not supported.' && res1 === 'PaymentRequest not supported.'){
        return 'success'
    }
    // Cache Leak is safe when no timing difference is found
    else if(res0 === 'No timing difference.' || res1 === 'No timing difference.'){
        return 'success'
    }

    // MediaError Leak 
    else if (res0 === 'DEMUXER_ERROR_COULD_NOT_OPEN: FFmpegDemuxer: open context failed' && res1 === 'MEDIA_ELEMENT_ERROR: Format error'){
        return 'danger'
    }
    else if (res0 === 'Failed to open media' && res1 === 'Failed to open media'){
        return 'success'
    }
    

    // errors
    else if(typeof res0 === 'string' || typeof res1 === 'string'){
        return 'warning'
    }
    else{
        return 'success'
    }
}


const generateUrls = (test_url) => {
    let baseUrl = TEST_URL
    return {'url0': `${baseUrl}${test_url}?0`, 'url1':`${baseUrl}${test_url}?1`}
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}




export {parseResult, generateUrls, sleep}