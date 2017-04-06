import windowmanager from '../../global';
import { EventHandler } from '../../utils/index';
import { BoundingBox, Position } from '../../geometry/index';

function getBrowserInfo() {
    // Credit: http://www.gregoryvarghese.com/how-to-get-browser-name-and-version-via-javascript/
    let ua = navigator.userAgent;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let tem;

    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem !== null) { return { name: 'Opera', version: tem[1] }; }
        tem = ua.match(/\bedge\/(\d+)/i);
        if (tem !== null) { return { name: 'Edge', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

let browser = getBrowserInfo();

windowmanager.runtime.name = browser.name;
windowmanager.runtime.version = browser.version;
windowmanager.runtime.isBrowser = true;
windowmanager.runtime.isMain = (window.parent === window);

try {
    window.parent.document;
} catch (e) {
    // If the above access errors out, it's due to CORS violation.
    // So assume this JavaScript window is the top-level window:
    windowmanager.runtime.isMain = true;
}

if (windowmanager.runtime.isMain) {
    // This is the main/root window!
    let nextZIndex = 1000; // TODO: Recycle Z-Indexes! In case of a (probably never) overflow!

    // The following is to fix Edge not sharing Map values across windows:
    class _Map {
        constructor() {
            this._map = Object.create(null);
        }

        values() {
            let values = Object.keys(this._map);

            for (let index = 0; index < values.length; index += 1) {
                values[index] = this._map[values[index]];
            }

            return values;
        }

        set(key, value) {
            this._map[key] = value;
        }

        get(key) {
            return this._map[key];
        }

        delete(key) {
            delete this._map[key];
        }
    }

    windowmanager._launcher = window;
    windowmanager._internalBus = new EventHandler(Object.keys(windowmanager._eventListeners));
    windowmanager._windows = new _Map();

    // Create overlay:
    let overlay = window.document.createElement('div');

    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style['z-index'] = '10000000';
    overlay.style.display = 'none';
    window.document.body.appendChild(overlay);
    windowmanager._overlay = overlay;

    let getScale = () => {
        let scale = 1;

        if (screen.deviceXDPI) {
            // IE/Edge
            scale = screen.deviceXDPI / screen.systemXDPI;
        } else {
            // Chrome
            scale = screen.width / overlay.clientWidth;
        }

        return scale;
    };

    overlay.addEventListener('mousemove', (event) => {
        // if (windowmanager._resize.down === '') return;
        const scale = getScale();
        const delta = new Position(event.screenX, event.screenY).subtract(windowmanager._resize.mouseStart);
        let bounds = windowmanager._resize.targetStartBounds.clone();
        let that = windowmanager._resize.target;

        // Account for scaling:
        delta.left /= scale;
        delta.top /= scale;

        // Size horizontally:
        if (windowmanager._resize.down.includes('w')) {
            bounds.left = Math.min(bounds.left + delta.left, bounds.right - that._minSize.left);
        } else if (windowmanager._resize.down.includes('e')) {
            bounds.right = Math.max(bounds.right + delta.left, bounds.left + that._minSize.left);
        }

        // Size vertically:
        if (windowmanager._resize.down.includes('n')) {
            bounds.top = Math.min(bounds.top + delta.top, bounds.bottom - that._minSize.top);
        } else if (windowmanager._resize.down.includes('s')) {
            bounds.bottom = Math.max(bounds.bottom + delta.top, bounds.top + that._minSize.top);
        }

        // Resize the window:
        that.setBounds(bounds);

        // Disable propagation of event to any other element (prevent underlying clicks):
        event.preventDefault();
    }, true); // true argument makes it execute before its children get the event

    windowmanager._overlay.addEventListener('mouseup', (event) => {
        // Turn off resizing mode:
        windowmanager._resize.down = '';
        windowmanager._overlay.style.display = 'none';
    }, true); // true argument makes it execute before its children get the event

    windowmanager._resize = {
        isDown: false,
        mouseStart: new Position(),
        target: null,
        targetStartBounds: new BoundingBox()
    };

    windowmanager._getNextZIndex = () => {
        nextZIndex += 1;
        return nextZIndex;
    };
} else {
    // This is a child window of root!
    windowmanager._launcher = window.parent.windowmanager._launcher || window.parent;
    windowmanager._internalBus = window.parent.windowmanager._internalBus;
    windowmanager._windows = window.parent.windowmanager._windows;
    windowmanager._getNextZIndex = window.parent.windowmanager._getNextZIndex;
    windowmanager._overlay = window.parent.windowmanager._overlay;
    windowmanager._resize = window.parent.windowmanager._resize;
}

// Wire the internal bus to emit events on windowmanager:
windowmanager._internalBus.addPipe(windowmanager);

// This is used to store info across windows:
// Everything on here gets exported as windowmanager.
export default windowmanager;
