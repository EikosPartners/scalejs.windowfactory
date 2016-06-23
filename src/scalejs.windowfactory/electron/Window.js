"use strict";
/*global nodeRequire*/
if (typeof define !== "undefined" && define) {
	define([
		"../geometry"
	], function (
		geometry
	) {
        if (!(typeof nodeRequire !== "undefined" && nodeRequire && nodeRequire.electron)) { return; }

		var Vector = geometry.Vector,
			Position = geometry.Position,
			Size = geometry.Size,
			BoundingBox = geometry.BoundingBox;
		var remote = nodeRequire("electron").remote;
		var BrowseWindow = remote.BrowseWindow;
		var defaultConfig = {
			width: 600,
			height: 600,
			frame: false,
			resizable: false,
			hasShadow: false
			//transparent: true
		};
		defaultConfig.__proto__ = null;

		/**
		 * Wraps a window object.
		 * @constructor
		 * @alias Window
		 * @param {object} config - Configuration
		 */
		function Window(config) {
			if (!(this instanceof Window)) { return new Window(config); }

			config = config || {}; // If no arguments are passed, assume we are creating a default blank window
			var isArgConfig = (config.webContents === undefined);

			if (isArgConfig) {
				for (var prop in defaultConfig) {
					if (defaultConfig.hasOwnProperty(prop)) {
						config[prop] = config[prop] || defaultConfig[prop];
					}
				}

				this._window = new BrowseWindow(config);
				this._ready = true;
			} else {
				this._window = config;
				this._ready = true;
			}
		}

        /**
         * @method
         * @returns {module:geometry.Vector}
         */
		Window.prototype.getPosition = function () {
			var pos = this._window.getPosition();

			return new Position(pos[0], pos[1]);
		};

        /**
         * @method
         * @returns {number}
         */
		Window.prototype.getWidth = function () {
			var size = this._window.getSize();

			return size[0];
		};

        /**
         * @method
         * @returns {number}
         */
		Window.prototype.getHeight = function () {
			var size = this._window.getSize();

			return size[1];
		};

        /**
         * @method
         * @returns {module:geometry.Position}
         */
		Window.prototype.getSize = function () {
			var size = this._window.getSize();

			return new Position(size[0], size[1]);
		};

        /**
         * @method
         * @returns {module:geometry.BoundingBox}
         */
		Window.prototype.getBounds = function () {
			var bounds = this._window.getBounds();

			return new BoundingBox(bounds.x, bounds.y, bounds.x + bounds.width, bounds.y + bounds.height);
		};



		/**
		 * @callback callback
		 * @param  {string|null} error - String on error, or null if no error
		 */

        /**
		 * Closes the window instance.
         * @method
		 * @param {callback=}
         */
		Window.prototype.close = function (callback) {
			this._window.close();
			if (callback) { callback(); }
		};

        /**
		 * Minimizes the window instance.
         * @method
		 * @param {callback=}
         */
		Window.prototype.minimize = function (callback) {
			if (!this._ready) { throw "minimize can't be called on an unready window"; }

			this._window.minimize();
			if (callback) { callback(); }
		};

        /**
		 * Maximizes the window instance.
         * @method
		 * @param {callback=}
         */
		Window.prototype.maximize = function (callback) {
			if (!this._ready) { throw "maximize can't be called on an unready window"; }

			this._window.maximize();
			if (callback) { callback(); }
		};

        /**
		 * Unhides the window instance.
         * @method
		 * @param {callback=}
         */
		Window.prototype.show = function (callback) {
			if (!this._ready) { throw "show can't be called on an unready window"; }

			this._window.show();
			if (callback) { callback(); }
		};

        /**
		 * Hides the window instance.
         * @method
		 * @param {callback=}
         */
		Window.prototype.hide = function (callback) {
			if (!this._ready) { throw "hide can't be called on an unready window"; }

			this._window.hide();
			if (callback) { callback(); }
		};

        /**
		 * Restores the window instance from the minimized or maximized states.
         * @method
		 * @param {callback=}
         */
		Window.prototype.restore = function (callback) {
			if (!this._ready) { throw "restore can't be called on an unready window"; }

			this._window.restore();
			if (callback) { callback(); }
		};

        /**
		 * Brings the window instance to the front of all windows.
         * @method
		 * @param {callback=}
         */
		Window.prototype.bringToFront = function (callback) {
			if (!this._ready) { throw "bringToFront can't be called on an unready window"; }

			this._window.setAlwaysOnTop(true);
			this._window.setAlwaysOnTop(false);
			if (callback) { callback(); }
		};

        /**
		 * Sets focus to the window instance.
         * @method
		 * @param {callback=}
         */
		Window.prototype.focus = function (callback) {
			if (!this._ready) { throw "focus can't be called on an unready window"; }

			this._window.focus();
			if (callback) { callback(); }
		};

        /**
		 * Resizes the window instance.
         * @method
		 * @param {number} width
		 * @param {number} height
		 * @param {callback=}
         */
		Window.prototype.resizeTo = function (width, height, callback) {
			if (!this._ready) { throw "resizeTo can't be called on an unready window"; }
			var size = new Position(width, height);

			this._window.setSize(size.left, size.top);
			if (callback) { callback(); }
		};

        /**
		 * Moves the window instance.
         * @method
		 * @param {number} left
		 * @param {number} top
		 * @param {callback=}
         */
		Window.prototype.moveTo = function (left, top, callback) {
			if (!this._ready) { throw "moveTo can't be called on an unready window"; }
			var pos = new Position(left, top);

			this._window.setPosition(left, top);
			if (callback) { callback(); }
		};

        /**
		 * Moves the window instance relative to its current position.
         * @method
		 * @param {number} deltaLeft
		 * @param {number} deltaTop
		 * @param {callback=}
         */
		Window.prototype.moveBy = function (deltaLeft, deltaTop, callback) {
			if (!this._ready) { throw "moveBy can't be called on an unready window"; }
			var bounds = this.getBounds();
			var deltaPos = new Position(deltaLeft, deltaTop);

			this._window.setPosition(bounds.left + deltaPos.left, bounds.top + deltaPos.top);
			if (callback) { callback(); }
		};

        /**
		 * Sets the bounds of the window instance.
         * @method
		 * @param {number} left
		 * @param {number} top
		 * @param {number} right
		 * @param {number} bottom
		 * @param {callback=}
         */
		Window.prototype.setBounds = function (left, top, right, bottom, callback) {
			if (!this._ready) { throw "resizeTo can't be called on an unready window"; }
			var bounds = new BoundingBox(left, top, right, bottom);

			this._window.setSize({
				x: left,
				y: top,
				width: right - left,
				height: bottom - top
			});
			if (callback) { callback(); }
		};

		return Window;
	});
}