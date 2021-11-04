import {leak as leak_performance_error} from './leaks/leak_performance_error.js'
import {leak as leak_eventhandler_object} from './leaks/leak_eventhandler_object.js'
import {leak as leak_eventhandler_stylesheet} from './leaks/leak_eventhandler_stylesheet.js'
import {leak as leak_eventhandler_script} from './leaks/leak_eventhandler_script.js'
import {leak as leak_mediaerror} from './leaks/leak_mediaerror.js'
import {leak as leak_stylereload_error} from './leaks/leak_stylereload_error.js'
import {leak as leak_requestmerging_error} from './leaks/leak_requestmerging_error.js'
import {leak as leak_cors_error} from './leaks/leak_cors_error.js'
import {leak as leak_performanceiframe_redirect} from './leaks/leak_performanceiframe_redirect.js'
import {leak as leak_performancefetch_redirect} from './leaks/leak_performancefetch_redirect.js'
import {leak as leak_fetch_redirect} from './leaks/leak_fetch_redirect.js'
import {leak as leak_urlmaxlength} from './leaks/leak_urlmaxlength.js'
import {leak as leak_maxredirectlength} from './leaks/leak_maxredirectlength.js'
import {leak as leak_historylength} from './leaks/leak_historylength.js'
import {leak as leak_csp_blockeduri} from './leaks/leak_csp_blockeduri.js'
import {leak as leak_csp_detect} from './leaks/leak_csp_detect.js'
import {leak as leak_websocket_ff} from './leaks/leak_websocket_ff.js'
import {leak as leak_websocket_gc} from './leaks/leak_websocket_gc.js'
import {leak as leak_payment} from './leaks/leak_payment.js'
import {leak as leak_windowlength} from './leaks/leak_windowlength.js'
import {leak as leak_medialeak_dimension} from './leaks/leak_medialeak_dimension.js'
import {leak as leak_medialeak_duration} from './leaks/leak_medialeak_duration.js'
import {leak as leak_performance_empty} from './leaks/leak_performance_empty.js'
import {leak as leak_performance_auditor} from './leaks/leak_performance_auditor.js'
import {leak as leak_cache_cors} from './leaks/leak_cache_cors.js'
import {leak as leak_cache_post} from './leaks/leak_cache_post.js'
import {leak as leak_onblur} from './leaks/leak_onblur.js'
import {leak as leak_getcomputedstyle} from './leaks/leak_getcomputedstyle.js'
import {leak as leak_sri_error} from './leaks/leak_sri_error.js'
import {leak as leak_contentdocument} from './leaks/leak_contentdocument.js'
import {leak as leak_performance_xframe} from './leaks/leak_performance_xframe.js'
import {leak as leak_performance_corp} from './leaks/leak_performance_corp.js'
import {leak as leak_fetch_corp} from './leaks/leak_fetch_corp.js'
import {leak as leak_corb} from './leaks/leak_corb.js'
// import {leak as leak_typemustmatch} from './leaks/leak_typemustmatch.js'
import {leak as leak_download} from './leaks/leak_download.js'
import {leak as leak_performance_download} from './leaks/leak_performance_download.js'
import {leak as leak_csp_directive} from './leaks/leak_csp_directive.js'
import {leak as leak_coop} from './leaks/leak_coop.js'

let testcases = [
    {
        'test_name': 'Performance API Error Leak',
        'test_category': 'Status Code',
        'test_url': 'testcases/tests/servererror.php',
        'test_description': 'Detect errors with Performance API.',
        'test_file': '/src/leaks/leak_performance_error.js',
        'test_function': leak_performance_error,
    },
    {
        'test_name': 'Event Handler Leak (Object)',
        'test_category': 'Status Code',
        'test_url': 'testcases/tests/servererror.php',
        'test_description': 'Detect errors with onload/onerror with object.',
        'test_file': '/src/leaks/leak_eventhandler_object.js',
        'test_function': leak_eventhandler_object,
        'test_timeout': 4000,

    },
    {
        'test_name': 'Event Handler Leak (Stylesheet)',
        'test_category': 'Status Code',
        'test_url': 'testcases/tests/servererror.php',
        'test_description': 'Detect errors with onload/onerror with stylesheet.',
        'test_file': '/src/leaks/leak_eventhandler_stylesheet.js',
        'test_function': leak_eventhandler_stylesheet,
    },
    {
        'test_name': 'Event Handler Leak (Script)',
        'test_category': 'Status Code',
        'test_url': 'testcases/tests/servererror.php',
        'test_description': 'Detect errors with onload/onerror with script.',
        'test_file': '/src/leaks/leak_eventhandler_script.js',
        'test_function': leak_eventhandler_script,
    },
    {
        'test_name': 'MediaError Leak',
        'test_category': 'Status Code',
        'test_url': 'testcases/tests/servererror.php',
        'test_description': 'Detect status codes with MediaError message.',
        'test_file': '/src/leaks/leak_mediaerror.js',
        'test_function': leak_mediaerror,
    },
    {
        'test_name': 'Style Reload Error Leak',
        'test_category': 'Status Code',
        'test_url': 'testcases/tests/servererror.php',
        'test_description': 'Detect errors with style reload bug.',
        'test_file': '/src/leaks/leak_stylereload_error.js',
        'test_function': leak_stylereload_error,
        'test_timeout': 6000,
    },
    {
        'test_name': 'Request Merging Error Leak',
        'test_category': 'Status Code',
        'test_url': 'testcases/tests/servererror.php',
        'test_description': 'Detect errors with request merging.',
        'test_file': '/src/leaks/leak_requestmerging_error.js',
        'test_function': leak_requestmerging_error,
        'test_timeout': 4000,
    },
    {
        'test_name': 'CORS Error Leak',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/cross-originredirect.php',
        'test_description': 'Leak redirect target URL with CORS error.',
        'test_file': '/src/leaks/leak_cors_error.js',
        'test_function': leak_cors_error,
    },
    {
        'test_name': 'Redirect Start Leak',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/cross-originredirect.php',
        'test_description': 'Detect cross-origin HTTP redirects by checking redirectStart time.',
        'test_file': '/src/leaks/leak_performanceiframe_redirect.js',
        'test_function': leak_performanceiframe_redirect,
    },
    {
        'test_name': 'Duration Redirect Leak',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/cross-originredirect.php',
        'test_description': 'Detect cross-origin redirects by checking the duration.',
        'test_file': '/src/leaks/leak_performancefetch_redirect.js',
        'test_function': leak_performancefetch_redirect,
    },
    {
        'test_name': 'Fetch Redirect Leak',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/redirect.php',
        'test_description': 'Detect HTTP redirects with Fetch API.',
        'test_file': '/src/leaks/leak_fetch_redirect.js',
        'test_function': leak_fetch_redirect,
    },
    {
        'test_name': 'URL Max Length Leak',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/addgetparam.php',
        'test_description': 'Detect server redirect by abusing URL max length.',
        'test_file': '/src/leaks/leak_urlmaxlength.js',
        'test_function': leak_urlmaxlength,
        'test_timeout': 10000,
    },
    {
        'test_name': 'Max Redirect Leak',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/cross-originredirect.php',
        'test_description': 'Detect server redirect by abusing max redirect limit.',
        'test_file': '/src/leaks/leak_maxredirectlength.js',
        'test_function': leak_maxredirectlength,
        'test_timeout': 6000,
    },
    {
        'test_name': 'History Length Leak',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/javascriptredirect.php',
        'test_description': 'Detect javascript redirects with History API.',
        'test_file': '/src/leaks/leak_historylength.js',
        'test_function': leak_historylength,
        'test_timeout': 7000,
        'test_needsWindow': true
    },
    {
        'test_name': 'CSP Violation Leak',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/cross-originredirect.php',
        'test_description': 'Leak cross-origin redirect target with CSP violation event.',
        'test_file': '/src/leaks/leak_csp_blockeduri.js',
        'test_function': leak_csp_blockeduri,
        'test_timeout': 4000,
    },
    {
        'test_name': 'CSP Redirect Detection',
        'test_category': 'Redirects',
        'test_url': 'testcases/tests/cross-originredirect.php',
        'test_description': 'Detect cross-origin redirects with CSP violation event.',
        'test_file': '/src/leaks/leak_csp_detect.js',
        'test_function': leak_csp_detect,
        'test_timeout': 4000,
    },
    {
        'test_name': 'WebSocket Leak (FF)',
        'test_category': 'API Usage',
        'test_url': 'testcases/tests/websocket.php',
        'test_description': 'Detect the number of websockets on a page by exausting the socket limit.',
        'test_file': '/src/leaks/leak_websocket_ff.js',
        'test_function': leak_websocket_ff,
        'test_timeout': 8000,
        'test_needsWindow': true,
    },
    {
        'test_name': 'WebSocket Leak (GC)',
        'test_category': 'API Usage',
        'test_url': 'testcases/tests/websocket.php',
        'test_description': 'Detect the number of websockets on a page by exausting the socket limit.',
        'test_file': '/src/leaks/leak_websocket_gc.js',
        'test_function': leak_websocket_gc,
        'test_timeout': 40000,
        'test_needsWindow': true,
    },
    {
        'test_name': 'Payment API Leak',
        'test_category': 'API Usage',
        'test_url': 'testcases/tests/payment.php',
        'test_description': 'Detect if another tab is using the Payment API.',
        'test_file': '/src/leaks/leak_payment.js',
        'test_function': leak_payment,
        'test_timeout': 5000,
        'test_needsWindow': true
    },
    {
        'test_name': 'Frame Count Leak',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/iframe.php',
        'test_description': 'Detect the number of iframes on a page.',
        'test_file': '/src/leaks/leak_windowlength.js',
        'test_function': leak_windowlength,
        'test_timeout': 4000,
        'test_needsWindow': true
    },
    {
        'test_name': 'Media Dimensions Leak',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/imagesize.php',
        'test_description': 'Leak dimensions of images or videos.',
        'test_file': '/src/leaks/leak_medialeak_dimension.js',
        'test_function': leak_medialeak_dimension,
        'test_timeout': 4000,
    },
    {
        'test_name': 'Media Duration Leak',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/audiolength.php',
        'test_description': 'Leak duration of audio or videos.',
        'test_file': '/src/leaks/leak_medialeak_duration.js',
        'test_function': leak_medialeak_duration,
        'test_timeout': 4000,
    },
    {
        'test_name': 'Performance API Empty Page Leak',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/empty.php',
        'test_description': 'Detect empty responses with Performance API.',
        'test_file': '/src/leaks/leak_performance_empty.js',
        'test_function': leak_performance_empty,
    },
    {
        'test_name': 'Performance API XSS Auditor Leak',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/auditor.php',
        'test_description': 'Detect scripts/event handlers in a page with Performance API.',
        'test_file': '/src/leaks/leak_performance_auditor.js',
        'test_function': leak_performance_auditor,
    },
    {
        'test_name': 'Cache Leak (CORS)',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/cacheimage.php',
        'test_description': 'Detect resources loaded by page. Cache is deleted with CORS error.',
        'test_file': '/src/leaks/leak_cache_cors.js',
        'test_function': leak_cache_cors,
        'test_timeout': 15000,
    },
    {
        'test_name': 'Cache Leak (POST)',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/cacheimage.php',
        'test_description': 'Detect resources loaded by page. Cache is deleted with a POST request.',
        'test_file': '/src/leaks/leak_cache_post.js',
        'test_function': leak_cache_post,
        'test_timeout': 15000,
    },
    {
        'test_name': 'Id Attribute Leak',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/inputid.php',
        'test_description': 'Leak id attribute of focusable HTML elements with onblur.',
        'test_file': '/src/leaks/leak_onblur.js',
        'test_function': leak_onblur,
        'test_timeout': 4000,
    },
    {
        'test_name': 'CSS Property Leak',
        'test_category': 'Page Content',
        'test_url': 'testcases/tests/cssrule.php',
        'test_description': 'Leak CSS rules with getComputedStyle.',
        'test_file': '/src/leaks/leak_getcomputedstyle.js',
        'test_function': leak_getcomputedstyle,
    },
    {
        'test_name': 'SRI Error Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/imagesize.php',
        'test_description': 'Leak content length with SRI error.',
        'test_file': '/src/leaks/leak_sri_error.js',
        'test_function': leak_sri_error,
        'test_timeout': 4000,
    },
    {
        'test_name': 'ContentDocument X-Frame Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/xframe.php',
        'test_description': 'Detect X-Frame-Options with ContentDocument.',
        'test_file': '/src/leaks/leak_contentdocument.js',
        'test_function': leak_contentdocument,
    },
    {
        'test_name': 'Performance API X-Frame Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/xframe.php',
        'test_description': 'Detect X-Frame-Options with Performance API.',
        'test_file': '/src/leaks/leak_performance_xframe.js',
        'test_function': leak_performance_xframe,
    },
    {
        'test_name': 'Performance API CORP Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/corp.php',
        'test_description': 'Detect Cross-Origin-Resource-Policy header with Performance API.',
        'test_file': '/src/leaks/leak_performance_corp.js',
        'test_function': leak_performance_corp,
    },
    {
        'test_name': 'CORP Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/corp.php',
        'test_description': 'Detect Cross-Origin-Resource-Policy header with fetch.',
        'test_file': '/src/leaks/leak_fetch_corp.js',
        'test_function': leak_fetch_corp,
    },
    {
        'test_name': 'CORB Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/corb.php',
        'test_description': 'Detect X-Content-Type-Options in combination with specific content type using CORB.',
        'test_file': '/src/leaks/leak_corb.js',
        'test_function': leak_corb,
    },
    /*
    {
        'test_name': 'TypeMustMatch Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/contenttype.php',
        'test_description': 'Leak Content-Type with typeMustMatch.',
        'test_file': '/src/leaks/leak_typemustmatch.js',
        'test_function': leak_typemustmatch,
    },
    */
    {
        'test_name': 'Download Detection',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/download.php',
        'test_description': 'Detect downloads (Content-Disposition header).',
        'test_file': '/src/leaks/leak_download.js',
        'test_function': leak_download,
        'test_timeout': 6000,
    },
    {
        'test_name': 'Performance API Download Detection',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/download.php',
        'test_description': 'Detect downloads (Content-Disposition header) with Performance API.',
        'test_file': '/src/leaks/leak_performance_download.js',
        'test_function': leak_performance_download,
        'test_timeout': 4000,
    },
    {
        'test_name': 'CSP Directive Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/cspdirective.php',
        'test_description': 'Detect CSP directives with CSP iframe attribute.',
        'test_file': '/src/leaks/leak_csp_directive.js',
        'test_function': leak_csp_directive,
        'test_timeout': 3000,
    },
    {
        'test_name': 'COOP Leak',
        'test_category': 'HTTP Header',
        'test_url': 'testcases/tests/coop.php',
        'test_description': 'Detect Cross-Origin-Opener-Policy header with popup.',
        'test_file': '/src/leaks/leak_coop.js',
        'test_function': leak_coop,
        'test_timeout': 4000,
        'test_needsWindow': true,
    }
    
]



export {testcases}