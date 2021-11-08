# XSinator.com
XS-Leak Browser Test Suite 

[Xsinator.com](https://xsinator.com/) is an XS-Leak browser test suite that was created for the paper  XSinator.com: From a Formal Model to the Automatic Evaluation of Cross-Site Leaks in Web Browsers. 

### Setup

1. Clone the repository
1. Change cross-origin domain in `config.js`
    - for local testing: `let baseUrl = 'http://localhost:8000/'`
1. Build javascript: `npm install && npm run build`
1. Get cert with certbot `certbot certonly --standalone --cert-name "xsinator.com"  -d "xsinator.com" -d "xsinator.xyz" -d "crossorigin.xsinator.xyz" --register-unsafely-without-email`
1. docker-compose up
    


### Layout

- `/app/testcases` - php testcases 
- `/src` - javascript src 

