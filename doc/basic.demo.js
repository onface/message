/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/message/0.1.0";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./doc/basic.demo.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var message = __webpack_require__("./lib/index.js");
// 默认延迟3秒关闭
message.info('信息');
message.success('成功');
message.error('错误');
message.warn('警告');
message.loading('加载');

message.info('延迟2秒', 2);

var info = message.info('手动关闭', false);
setTimeout(function () {
    info.hide();
}, parseFloat(Math.random() * 1000));

var dom = document.createElement('em');
setTimeout(function callee() {
    dom.innerHTML = 'dom' + Math.random();
    setTimeout(callee, 500);
}, 500);
message.info(dom);

document.getElementById('show').onclick = function () {
    message.loadingBar.show(2);
};

document.getElementById('hide').onclick = function () {
    message.loadingBar.hide();
};
document.getElementById('fail').onclick = function () {
    message.loadingBar.fail();
};

/***/ }),

/***/ "./lib/bar.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__("./node_modules/safe-extend/index.js");
var Motion = __webpack_require__("./node_modules/motion-logic/lib/index.js");
var bar = {
    el: {
        bar: null
    },
    _config: {
        prefixClassName: 'face-message'
    },
    config: function config(settings) {
        this._config = extend(true, this._config, settings);
    },
    defaultTitle: '',
    hideTimer: null,
    onAction: function onAction(bar, mountData) {
        bar.el.bar.style.width = parseFloat(bar.el.bar.style.width || 0) + mountData + '%';
    },
    show: function show(sec) {
        var self = this;
        if (!self.el.bar) {
            var barNode = document.createElement('div');
            barNode.setAttribute('class', self._config.prefixClassName + '-loading-bar');
            self.el.bar = barNode;
            document.body.appendChild(barNode);
        }
        self.el.bar.style.display = 'block';
        self.el.bar.style.width = '0%';
        self.motion = new Motion({
            value: 95,
            effect: 'easeOutCirc',
            duration: sec * 1000,
            onAction: function onAction(mountData) {
                self.onAction(self, mountData);
            }
        });
        self.motion.run();
    },
    hide: function hide() {
        var self = this;
        var prefixClassName = self._config.prefixClassName;
        if (!self.el.bar) {
            self.show(1);
        }
        self.el.bar.style.display = 'block';
        self.motion.stop();
        self.motion = new Motion({
            value: 100 - parseFloat(self.el.bar.style.width || 0),
            effect: 'easeOutCirc',
            duration: .5 * 1000,
            onAction: function onAction(mountData) {
                self.onAction(self, mountData);
            },
            onStop: function onStop() {
                clearTimeout(self.hideTimer);
            },
            onDone: function onDone() {
                self.el.bar.setAttribute('class', self.el.bar.getAttribute('class') + (' ' + prefixClassName + '-loading-bar--fadeout'));
                self.el.bar.setAttribute('class', self.el.bar.getAttribute('class') + (' ' + prefixClassName + '-loading-bar--done'));
                self.hideTimer = setTimeout(function () {
                    self.el.bar.style.display = 'none';
                    self.el.bar.setAttribute('class', self.el.bar.getAttribute('class').replace(new RegExp(prefixClassName + '-loading-bar--fadeout', 'g'), '').replace(new RegExp(prefixClassName + '-loading-bar--fail', 'g'), '').replace(new RegExp(prefixClassName + '-loading-bar--done', 'g'), '').replace(/\s+/g, ''));
                }, 500);
            }
        });
        self.motion.run();
    },
    fail: function fail() {
        var self = this;
        var prefixClassName = self._config.prefixClassName;
        if (!self.el.bar) {
            self.show(1);
        }
        self.el.bar.style.display = 'block';
        self.el.bar.setAttribute('class', self.el.bar.getAttribute('class') + (' ' + prefixClassName + '-loading-bar--fail'));
        self.hide();
    }
};
module.exports = bar;

/***/ }),

/***/ "./lib/index.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./lib/index.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/less-loader/index.js!./index.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/less-loader/index.js!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__("./node_modules/safe-extend/index.js");
__webpack_require__("./lib/index.css");
function setProps() {
    message.el.wrapNode.setAttribute('class', message._config.prefixClassName + '-wrap');
}
var message = {
    el: {},
    _config: {
        duration: 3,
        prefixClassName: 'face-message',
        iconMap: {
            'info': 'info-of',
            'success': 'check-of',
            'error': 'close-of',
            'warn': 'warning-of',
            'loading': 'loading'
        }
    },
    init: function init() {
        var message = this;
        message.el.wrapNode = document.createElement('div');
        setProps();
        document.body.appendChild(message.el.wrapNode);
    },
    config: function config(settings) {
        this._config = extend(true, this._config, settings);
        setProps();
    },
    show: function show(type, content, duration) {
        var message = this;
        duration = typeof duration === 'undefined' ? message._config.duration : duration;
        if (duration === false) {
            // 60*24*30
            duration = 43200;
        }
        if (typeof message.el.wrapNode === 'undefined') {
            message.init();
        }
        var itemNode = document.createElement('div');
        var prefixClassName = message._config.prefixClassName;
        itemNode.setAttribute('class', prefixClassName + '-item');
        itemNode.innerHTML = '\n        <div class="' + prefixClassName + ' ' + prefixClassName + '--themes-' + type + '">\n            <span class="' + prefixClassName + '-icon">\n                <div class="fi fi-' + (message._config.iconMap[type] || type) + '"></div>\n            </span>\n            <div class="' + prefixClassName + '-content">\n            </div>\n        </div>\n        ';
        var messageNode = itemNode.getElementsByClassName(prefixClassName)[0];
        var contentNode = itemNode.getElementsByClassName(prefixClassName + '-content')[0];
        if (typeof content === 'string') {
            contentNode.innerHTML = content;
        } else {
            contentNode.appendChild(content);
        }
        message.el.wrapNode.appendChild(itemNode);
        setTimeout(function () {
            messageNode.setAttribute('class', messageNode.getAttribute('class') + (' ' + prefixClassName + '--fadein'));
        }, 10);
        var command = {
            el: {
                root: itemNode,
                message: messageNode,
                content: contentNode
            }
        };
        command.hide = function () {
            messageNode.setAttribute('class', messageNode.getAttribute('class') + (' ' + prefixClassName + '--fadeout'));
            setTimeout(function () {
                message.el.wrapNode.removeChild(itemNode);
            }, 500);
            command.hide = function () {};
        };
        setTimeout(function () {
            command.hide();
        }, duration * 1000);
        return command;
    },
    info: function info(content, duration) {
        return this.show('info', content, duration);
    },
    success: function success(content, duration) {
        return this.show('success', content, duration);
    },
    error: function error(content, duration) {
        return this.show('error', content, duration);
    },
    warn: function warn(content, duration) {
        return this.show('warn', content, duration);
    },
    loading: function loading(content, duration) {
        return this.show('loading', content, duration);
    }
};
message.loadingBar = __webpack_require__("./lib/bar.js");
module.exports = message;

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/less-loader/index.js!./lib/index.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.i, ".face-message-wrap {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1350;\n  width: 100%;\n  text-align: center;\n  pointer-events: none;\n}\n.face-message {\n  pointer-events: auto;\n  opacity: 0;\n  text-align: left;\n  box-shadow: 0px 0.05em 0.3em rgba(11, 11, 11, 0.2);\n  display: inline-block;\n  padding: .5em 1em;\n  border-radius: .3em;\n  margin-top: .5em;\n  margin-bottom: .5em;\n  color: #444;\n  font-size: 0.8em;\n  background-color: white;\n}\n.face-message--fadein {\n  opacity: 1;\n  transition: opacity .5s;\n}\n.face-message--fadeout {\n  opacity: 0;\n  transition: opacity .5s;\n}\n.face-message-icon {\n  vertical-align: middle;\n  display: inline-block;\n  font-size: 1.3em;\n  margin-bottom: -0.1em;\n  margin-left: .2em;\n  margin-right: .5em;\n  color: #4387fd;\n}\n.face-message-content {\n  vertical-align: middle;\n  display: inline-block;\n}\n.face-message-remove {\n  line-height: 1.58;\n  vertical-align: top;\n  display: inline-block;\n  font-weight: 300;\n  padding-left: .5em;\n  padding-right: .5em;\n  opacity: .6;\n  color: #333;\n  cursor: pointer;\n  margin-right: .4em;\n}\n.face-message-remove:hover {\n  opacity: 1;\n  color: #d85c4b;\n}\n.face-message--remove {\n  padding-right: 0;\n}\n@keyframes faceMessageLoadinganimatedBackground {\n  from {\n    background-position: 100% 0;\n  }\n  to {\n    background-position: 0 0;\n  }\n}\n.face-message-icon-loading {\n  width: 1em;\n  height: 1em;\n  vertical-align: middle;\n  margin-top: -0.1em;\n}\n.face-message--themes-success .face-message-icon {\n  color: #5dc75d;\n}\n.face-message--themes-error .face-message-icon {\n  color: #d85c4b;\n}\n.face-message--themes-warn .face-message-icon {\n  color: #F2AD54;\n}\n.face-message-loading-bar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 0;\n  height: .1em;\n  background-color: #318CF2;\n  box-shadow: 0px 0px .1em #ccc;\n  transition: opacity 0.5s, background-color 0.5s;\n  z-index: 99999;\n}\n.face-message-loading-bar--fadeout {\n  opacity: 0;\n}\n.face-message-loading-bar--done {\n  background-color: #5dc75d;\n}\n.face-message-loading-bar--fail {\n  background-color: #f96371;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),

/***/ "./node_modules/extend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ }),

/***/ "./node_modules/motion-logic/lib/animate.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = aniamte;

var _index = __webpack_require__("./node_modules/motion-logic/lib/index.js");

var _index2 = _interopRequireDefault(_index);

var _extend = __webpack_require__("./node_modules/extend/index.js");

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function aniamte(settings) {
    var valueArray = Object.keys(settings.value);
    var outout = {
        run: function run() {
            var self = this;
            valueArray.forEach(function (valueKey) {
                self[valueKey].run();
            });
        }
    };
    var emitAction = function emitAction(key, mount) {
        var mountData = {};
        valueArray.forEach(function (valueKey) {
            mountData[valueKey] = 0;
        });
        mountData[key] = mount;
        settings.onAction(mountData);
    };
    valueArray.forEach(function (valueKey) {
        if (valueKey === 'run') {
            throw new Error('node_module/motion: animate({value})  value not allow has `"run"`');
        }
        var cloneSettings = (0, _extend2.default)(true, {}, settings);
        var target = cloneSettings.value[valueKey];

        switch (typeof target === "undefined" ? "undefined" : _typeof(target)) {
            case 'number':
                cloneSettings.value = target;
                break;
            case 'object':
                (0, _extend2.default)(true, cloneSettings, target);
                break;
            default:
                throw new Error('node_module/motion: animate({value}) value must be a number or object');
        }
        cloneSettings.onAction = function (mount) {
            emitAction(valueKey, mount);
        };
        outout[valueKey] = new _index2.default(cloneSettings);
    });
    return outout;
}

/***/ }),

/***/ "./node_modules/motion-logic/lib/easing.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/*
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 * you can visit 'http://easings.net/zh-cn' to get effect
*/

exports.default = {
	linear: function linear(t, b, c, d) {
		return c * t / d + b;
	},
	easeInQuad: function easeInQuad(t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function easeOutQuad(t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function easeInOutQuad(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * (--t * (t - 2) - 1) + b;
	},
	easeInCubic: function easeInCubic(t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	easeOutCubic: function easeOutCubic(t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeInOutCubic: function easeInOutCubic(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	easeInQuart: function easeInQuart(t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutQuart: function easeOutQuart(t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeInOutQuart: function easeInOutQuart(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	easeInQuint: function easeInQuint(t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	easeOutQuint: function easeOutQuint(t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	easeInOutQuint: function easeInOutQuint(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	easeInSine: function easeInSine(t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine: function easeOutSine(t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine: function easeInOutSine(t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo: function easeInExpo(t, b, c, d) {
		return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function easeOutExpo(t, b, c, d) {
		return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function easeInOutExpo(t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function easeInCirc(t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	easeOutCirc: function easeOutCirc(t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	easeInOutCirc: function easeInOutCirc(t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	easeInElastic: function easeInElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function easeOutElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInOutElastic: function easeInOutElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	easeInBack: function easeInBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	easeOutBack: function easeOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	easeInOutBack: function easeInOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	},
	easeInBounce: function easeInBounce(t, b, c, d) {
		return c - this.easeOutBounce(d - t, 0, c, d) + b;
	},
	easeOutBounce: function easeOutBounce(t, b, c, d) {
		if ((t /= d) < 1 / 2.75) {
			return c * (7.5625 * t * t) + b;
		} else if (t < 2 / 2.75) {
			return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
		} else if (t < 2.5 / 2.75) {
			return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
		}
	},
	easeInOutBounce: function easeInOutBounce(t, b, c, d) {
		if (t < d / 2) return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
		return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
};

/***/ }),

/***/ "./node_modules/motion-logic/lib/getDefaultSettings.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        effect: 'linear',
        onRun: function onRun() {},
        onStop: function onStop() {},
        onDone: function onDone() {}
        // onBegin: function () {}
    };
};

/***/ }),

/***/ "./node_modules/motion-logic/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _class, _temp;

var _extend = __webpack_require__("./node_modules/extend/index.js");

var _extend2 = _interopRequireDefault(_extend);

var _getDefaultSettings = __webpack_require__("./node_modules/motion-logic/lib/getDefaultSettings.js");

var _getDefaultSettings2 = _interopRequireDefault(_getDefaultSettings);

var _easing = __webpack_require__("./node_modules/motion-logic/lib/easing.js");

var _easing2 = _interopRequireDefault(_easing);

var _animate = __webpack_require__("./node_modules/motion-logic/lib/animate.js");

var _animate2 = _interopRequireDefault(_animate);

var _mount = __webpack_require__("./node_modules/motion-logic/lib/mount.js");

var _mount2 = _interopRequireDefault(_mount);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MotionLogic = (_temp = _class = function MotionLogic(settings) {
    _classCallCheck(this, MotionLogic);

    var self = this;
    self.settings = (0, _extend2.default)(true, (0, _getDefaultSettings2.default)(), settings);
    self.isRuning = false;
    // mountValue 记录运动过得距离，用于计算速度和矫正变化值
    self.mountValue = 0;
    self.isAccAnimate = typeof self.settings.startSpeed !== 'undefined';
    if (self.isAccAnimate) {
        // 算出运动总时间
        // 应该是 / 2 这里 改成 / 2.4 是因为发现只能运动 90% 的 value。
        // 每找出原因暂时改成 2.4，也可能永远都是 2.4
        var averageSpeed = (self.settings.startSpeed + self.settings.endSpeed) / 2;
        self.settings.$duration = self.settings.value / averageSpeed;
    }
    // self.effect
    // t: current time, b: begInnIng value, c: change In value, d: duration
    switch (_typeof(self.settings.effect)) {
        case 'string':
            self.effect = _easing2.default[self.settings.effect];
            if (typeof self.effect === 'undefined') {
                throw new Error('motion-logic: settings.effect(' + self.settings.effect + ') not found!');
            }
            break;
        case 'function':
            self.effect = self.settings.effect;
            break;
        default:
            throw new Error('motion-logic: settings.effect must be a string or a function!');
    }
}, _class.animate = _animate2.default, _class.easing = _easing2.default, _class.mount = _mount2.default, _temp);

MotionLogic.prototype.run = function () {
    var self = this;
    var settings = self.settings;
    if (typeof self.lastRunTime === 'undefined') {
        self.lastRunTime = new Date().getTime();
    }
    if (typeof self.lastActionTime === 'undefined') {
        self.lastActionTime = new Date().getTime();
    }
    self.isRuning = true;
    requestAnimationFrame(function action() {
        if (!self.isRuning) {
            return;
        }
        var nowTime = new Date().getTime();
        var actionTime = nowTime - self.lastRunTime;
        var elapsedTime = nowTime - self.lastActionTime;
        var animateDuration = typeof settings.$duration === 'number' ? settings.$duration : settings.duration;
        // 修复 elapsedTime actionTime 因为 requestAnimationFrame 不是精准控制时间
        if (actionTime > animateDuration) {
            elapsedTime = elapsedTime - (actionTime - animateDuration);
            actionTime = animateDuration;
        }
        var mount = void 0;

        if (self.isAccAnimate) {
            // 算出速度差，速度递增或递减的差值
            var speedDiff = settings.endSpeed - settings.startSpeed;
            var progress = actionTime / animateDuration;
            var lastProgress = (actionTime - elapsedTime) / animateDuration;

            var nowSpeed = speedDiff * progress;
            var lastActionSpeed = speedDiff * lastProgress;

            var averageAcc = (nowSpeed + lastActionSpeed) / 2;
            var speed = settings.startSpeed + averageAcc;

            mount = elapsedTime * speed;
        } else {
            var currentMount = self.effect.apply(_easing2.default, [actionTime, 0, settings.value, animateDuration]);
            mount = currentMount - self.mountValue;
        }
        if (settings.integer) {
            mount = Math.round(mount);
        }
        self.mountValue = self.mountValue + mount;
        settings.onAction(mount);
        // 千万不要直接附值 lastActionTime = new Date().getTime()
        // 因为上面代码运行需要时间
        self.lastActionTime = nowTime;
        if (actionTime === animateDuration) {
            settings.onDone();
        } else {
            if (self.isRuning) {
                requestAnimationFrame(action);
            }
        }
    });
};
MotionLogic.prototype.stop = function () {
    var self = this;
    self.isRuning = false;
    self.settings.onStop();
};
module.exports = MotionLogic;
exports.default = MotionLogic;

/***/ }),

/***/ "./node_modules/motion-logic/lib/mount.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mount;
function mount(target, data) {
    Object.keys(data).forEach(function (key) {
        target[key] = target[key] + data[key];
    });
    return target;
}

/***/ }),

/***/ "./node_modules/safe-extend/index.js":
/***/ (function(module, exports, __webpack_require__) {

var extend = __webpack_require__("./node_modules/extend/index.js")
module.exports = function safeExtend () {
    var arg = Array.from(arguments).map(function (item) {
        var cloneItem
        // object and array
        if(typeof item === 'object') {
            if (Array.isArray(item)) {
                cloneItem = extend(true, [], item)
            }
            else {
                cloneItem = extend(true, {}, item)
            }
        }
        return cloneItem? cloneItem: item
    })
    return extend.apply(undefined, arg)
}
module.exports.clone = function clone(target) {
    return JSON.parse(JSON.stringify(target))
}


/***/ }),

/***/ "./node_modules/style-loader/addStyles.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./doc/basic.demo.js");


/***/ })

/******/ });