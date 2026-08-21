// Domain configuration - update these for your deployment
const MAIN_DOMAIN = 'xsinator.com'
const CROSSORIGIN_DOMAIN = 'crossorigin.xsinator.xyz'
const WS_DOMAIN = 'ws.xsinator.com'

const TEST_URL = `https://${CROSSORIGIN_DOMAIN}/`
const BASE_URL = `https://${MAIN_DOMAIN}/`
const WS_URL = `wss://${WS_DOMAIN}/`
const DEFAULT_TIMEOUT = 5000


export {BASE_URL, DEFAULT_TIMEOUT, TEST_URL, WS_URL, MAIN_DOMAIN, CROSSORIGIN_DOMAIN, WS_DOMAIN}
