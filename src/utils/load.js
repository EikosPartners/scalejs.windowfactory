function ajax(type, url, params, cb) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {

            // Successful request.
            if (request.status === 200) {
                cb(null, request.response);
            } else {
                cb({
                    error: 'There was an error requesting that URL'
                });
            }
        }
    };

    request.open(type, url, true);

    // Set the content-type header if we're making a POST request.
    if (params && type === 'POST') {
        request.setRequestHeader('Content-type', 'application/json');
    }

    request.send(params ? JSON.stringify(params) : null);
}

function evalScript(script) {
    if (script && script.src !== '') {
        let tag = document.createElement('script');

        tag.src = script.src;
        document.getElementsByTagName('head')[0].appendChild(tag);
    }
}

/**
 * Load a url into a page.
 * Taken from jquery's load function https://github.com/jquery/jquery/blob/f18ca7bfe0f5e3184bf1ed55daf1668702c5577a/src/ajax/load.js
 * @param url {String} - The url to load
 * @param params {Object} - Object of key/value pairs for parameters
 * @param id {String} - The id of the element to attach the response to
 * @param callback {Function} - Function to call after the load completes, will be passed an error if one occurred
 */
function load(url, params, id, callback) {
    let type = 'GET';

    // If params is an object, set the type to be POST.
    if (params && typeof params === 'object') {
        type = 'POST';
    }

    ajax(type, url, params, (err, response) => {
        if (err) {
            if (callback && typeof callback === 'function') {
                callback(err);
            } else {
                console.error('Error not being handled: ', err);
            }
            return;
        }

        // Find the scripts that were already there so we can execute only new ones.
        let oldScripts = Array.prototype.slice.call(document.getElementsByTagName('script'));

        let elem = document.getElementById(id);
        let div = document.createElement('div');

        div.innerHTML = response;

        if (!elem) {
            elem = document.getElementsByTagName('body')[0];
        }

        elem.appendChild(div);

        // Find the new scripts.
        let scripts = document.getElementsByTagName('script');
        let newScripts = [];

        for (let i = 0; i < scripts.length; i++) {
            if (oldScripts.indexOf(scripts[i]) < 0) {
                newScripts.push(scripts[i]);
            }
        }

        for (let i = 0; i < scripts.length; i++) {
            let script = scripts[i];

            if (script.parentNode) {script.parentNode.removeChild(script);}
            evalScript(scripts[i]);
        }

        console.log(newScripts);

        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}

export default load;