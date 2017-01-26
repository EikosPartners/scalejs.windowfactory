# windowmanager.js
[![npm version](https://badge.fury.io/js/windowmanager.svg)](https://badge.fury.io/js/windowmanager)<br>
A framework to manage multiple dockable HTML windows.<br>
This extension is designed to support multiple different different encapsulation runtimes.<br>
See [API Documentation](https://eikospartners.github.io/windowmanagerjs/) for more information.

Runtimes supported:
* Modern Web Browsers (Chrome, Firefox, IE, Edge, Safari)
* [OpenFin](https://openfin.co/)
* [Electron](http://electron.atom.io/)

Future runtimes:
* [NW.js](http://nwjs.io/)

## Live Example
You can see a live demo at [Eikos Partners Blotter Demonstration](http://blotter.eikospartners.com/install).<br>
An open source example can be found at: https://github.com/aesalazar/windowmanagerjsdemo<br>
A basic example to get started:
```javascript
// Create a new window:
let childWindow = new windowmanager.Window({
    url: "child.html", // Loads "child.html" based on the current window's url.
    width: 500,
    height: 500
});

// Execute code when window is ready for commands:
childWindow.onReady(() => {
    childWindow.focus(); // Set focus to childWindow.
});
```

## Installing via npm
Run `npm install --save windowmanager`<br>
The windowmanager script is located in `node_modules/windowmanager/dist/windowmanager.js`.

## Installing in Script Folder
1. Download either one of the following scripts from the dist folder (which contains the latest nightly version):
  * [windowmanager](https://raw.githubusercontent.com/EikosPartners/windowmanagerjs/master/dist/windowmanager.js)
  * [windowmanager.min](https://raw.githubusercontent.com/EikosPartners/windowmanagerjs/master/dist/windowmanager.min.js)
2. Add the script to the your application. Do not add it to a builder, since bundling or compiling with babelify will break the script.
