/* eslint-disable @next/next/no-assign-module-variable */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HSStepForm"] = factory();
	else
		root["HSStepForm"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/hs-step-form.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/hs-step-form.js":
/*!********************************!*\
  !*** ./src/js/hs-step-form.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return HSStepForm; });\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/*\n* HSStepForm Plugin\n* @version: 3.0.1 (Sun, 1 Aug 2021)\n* @author: HtmlStream\n* @event-namespace: .HSStepForm\n* @license: Htmlstream Libraries (https://htmlstream.com/)\n* Copyright 2021 Htmlstream\n*/\nvar dataAttributeName = 'data-hs-step-form-options';\nvar defaults = {\n  progressSelector: null,\n  progressItems: null,\n  stepsSelector: null,\n  stepsItems: null,\n  stepsActiveItem: null,\n  nextSelector: '[data-hs-step-form-next-options]',\n  prevSelector: '[data-hs-step-form-prev-options]',\n  endSelector: null,\n  isValidate: false,\n  classMap: {\n    active: 'active',\n    checked: 'is-valid',\n    error: 'is-invalid',\n    required: 'js-step-required',\n    focus: 'focus'\n  },\n  finish: function finish() {},\n  preventNextStep: function preventNextStep() {\n    return new Promise(function (resolve, reject) {\n      resolve();\n    });\n  },\n  onNextStep: function onNextStep() {},\n  onPrevStep: function onPrevStep() {}\n};\n\nvar HSStepForm = /*#__PURE__*/function () {\n  function HSStepForm(el, options, id) {\n    _classCallCheck(this, HSStepForm);\n\n    this.collection = [];\n    var that = this;\n    var elems;\n\n    if (el instanceof HTMLElement) {\n      elems = [el];\n    } else if (el instanceof Object) {\n      elems = el;\n    } else {\n      elems = document.querySelectorAll(el);\n    }\n\n    for (var i = 0; i < elems.length; i += 1) {\n      that.addToCollection(elems[i], options, id || elems[i].id);\n    }\n\n    if (!that.collection.length) {\n      return false;\n    } // initialization calls\n\n\n    that._init();\n\n    return this;\n  }\n\n  _createClass(HSStepForm, [{\n    key: \"_init\",\n    value: function _init() {\n      var that = this;\n\n      var _loop = function _loop(i) {\n        var _$el = void 0;\n\n        var _options = void 0;\n\n        if (that.collection[i].hasOwnProperty('$initializedEl')) {\n          return \"continue\";\n        }\n\n        _$el = that.collection[i].$el;\n        _options = that.collection[i].options;\n        _options.progressItems = _$el.querySelector(_options.progressSelector).children;\n        _options.stepsItems = _$el.querySelector(_options.stepsSelector).children;\n        _options.stepsActiveItem = _$el.querySelector(_options.stepsSelector).querySelector(\".\".concat(_options.classMap.active));\n\n        that._prepareObject(_$el, _options);\n\n        _$el.querySelectorAll(_options.nextSelector).forEach(function (item) {\n          item.addEventListener('click', function () {\n            that._nextClickEvents(_$el, _options, item);\n          });\n        });\n\n        _$el.querySelectorAll(_options.prevSelector).forEach(function (item) {\n          item.addEventListener('click', function () {\n            that._prevClickEvents(_$el, _options, item);\n          });\n        });\n\n        _$el.querySelectorAll(_options.endSelector).forEach(function (item) {\n          item.addEventListener('click', function () {\n            that._endClickEvents(_$el, _options);\n          });\n        });\n\n        that.collection[i].$initializedEl = _options;\n      };\n\n      for (var i = 0; i < that.collection.length; i += 1) {\n        var _ret = _loop(i);\n\n        if (_ret === \"continue\") continue;\n      }\n    }\n  }, {\n    key: \"_prepareObject\",\n    value: function _prepareObject($el, settings) {\n      $el.querySelector(settings.stepsSelector).querySelectorAll(\":scope > :not(.\".concat(settings.classMap.active, \")\")).forEach(function (item) {\n        item.style.display = 'none';\n      });\n\n      settings.progressItems[_toConsumableArray(settings.stepsActiveItem.parentNode.children).indexOf(settings.stepsActiveItem)].classList.add(settings.classMap.active, settings.classMap.focus);\n    }\n  }, {\n    key: \"_endClickEvents\",\n    value: function _endClickEvents($el, settings) {\n      var isValid = true;\n\n      if (settings.isValidate) {\n        $el.classList.remove('was-validated');\n        settings.progressItems[settings.progressItems.length - 1].classList.remove(settings.classMap.error);\n        Array.from($el.elements).forEach(function (item) {\n          if (item.offsetParent !== null && !item.checkValidity()) {\n            isValid = false;\n            settings.progressItems[settings.progressItems.length - 1].classList.add(settings.classMap.error);\n\n            if (settings.validator) {\n              settings.validator.updateFieldStete(item);\n              $el.classList.add('was-validated');\n            }\n          }\n        });\n      }\n\n      if (isValid) {\n        return settings.finish($el, settings);\n      }\n    }\n  }, {\n    key: \"_nextClickEvents\",\n    value: function _nextClickEvents($el, settings, nextEl) {\n      var _this = this;\n\n      var nextDataSettings = nextEl.hasAttribute('data-hs-step-form-next-options') ? JSON.parse(nextEl.getAttribute('data-hs-step-form-next-options')) : {};\n      var nextItemDefaults = {\n        targetSelector: null\n      },\n          nextItemOptions = Object.assign({}, nextItemDefaults, nextDataSettings);\n      var targetSelector = $el.querySelector(nextItemOptions.targetSelector);\n\n      var targetIndex = _toConsumableArray(targetSelector.parentNode.children).indexOf(targetSelector);\n\n      for (var i = 0; i < settings.progressItems.length; i++) {\n        if (settings.isValidate) {\n          if (settings.validator) {\n            $el.classList.remove('was-validated');\n          }\n\n          if (targetIndex > i) {\n            settings.progressItems[i].classList.add(settings.classMap.error);\n            var requiredSelector = settings.progressItems[i].querySelector(settings.nextSelector).getAttribute('data-hs-step-form-next-options');\n\n            var _iterator = _createForOfIteratorHelper(settings.stepsItems),\n                _step;\n\n            try {\n              for (_iterator.s(); !(_step = _iterator.n()).done;) {\n                var item = _step.value;\n                item.classList.remove(settings.classMap.active);\n                item.style.display = 'none';\n              }\n            } catch (err) {\n              _iterator.e(err);\n            } finally {\n              _iterator.f();\n            }\n\n            var newTargetSelector = $el.querySelector(JSON.parse(requiredSelector).targetSelector);\n            newTargetSelector.classList.add(settings.classMap.active);\n            newTargetSelector.style.display = 'block';\n            var isValid = true;\n            Array.from($el.elements).forEach(function (item) {\n              if (item.offsetParent !== null && !item.checkValidity()) {\n                isValid = false;\n\n                if (settings.validator) {\n                  settings.validator.updateFieldStete(item);\n                  $el.classList.add('was-validated');\n                }\n              }\n            });\n\n            if (!isValid) {\n              settings.progressItems[i].classList.remove(settings.classMap.checked);\n              return false;\n            } else {\n              settings.progressItems[i].classList.remove(settings.classMap.error);\n            }\n          }\n\n          if (targetIndex > i && settings.isValidate) {\n            settings.progressItems[i].classList.add(settings.classMap.checked);\n          }\n        } else {\n          if (targetIndex > i && settings.isValidate) {\n            settings.progressItems[i].classList.add(settings.classMap.checked);\n          }\n\n          if (targetIndex > i && !settings.isValidate) {\n            settings.progressItems[i].classList.add(settings.classMap.active);\n          }\n        }\n      }\n\n      settings.preventNextStep($el).then(function () {\n        var _iterator2 = _createForOfIteratorHelper(settings.progressItems),\n            _step2;\n\n        try {\n          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {\n            var _item = _step2.value;\n\n            _item.classList.remove(settings.classMap.active, settings.classMap.focus);\n          }\n        } catch (err) {\n          _iterator2.e(err);\n        } finally {\n          _iterator2.f();\n        }\n\n        settings.progressItems[targetIndex].classList.add(settings.classMap.active, settings.classMap.focus);\n\n        var _iterator3 = _createForOfIteratorHelper(settings.stepsItems),\n            _step3;\n\n        try {\n          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {\n            var _item2 = _step3.value;\n\n            _item2.classList.remove(settings.classMap.active);\n\n            _item2.style.display = 'none';\n          }\n        } catch (err) {\n          _iterator3.e(err);\n        } finally {\n          _iterator3.f();\n        }\n\n        targetSelector.classList.add(settings.classMap.active);\n\n        _this.fadeIn(targetSelector, 400);\n\n        return settings.onNextStep();\n      });\n    }\n  }, {\n    key: \"_prevClickEvents\",\n    value: function _prevClickEvents($el, settings, prevEl) {\n      var prevDataSettings = prevEl.hasAttribute('data-hs-step-form-prev-options') ? JSON.parse(prevEl.getAttribute('data-hs-step-form-prev-options')) : {};\n      var prevItemDefaults = {\n        targetSelector: null\n      },\n          prevItemOptions = Object.assign({}, prevItemDefaults, prevDataSettings);\n      var targetSelector = $el.querySelector(prevItemOptions.targetSelector);\n\n      var targetIndex = _toConsumableArray(targetSelector.parentNode.children).indexOf(targetSelector);\n\n      for (var i = 0; i < settings.progressItems.length; i++) {\n        if (settings.isValidate) {\n          if (targetIndex > i) {\n            settings.progressItems[i].classList.add(settings.classMap.error);\n            var requiredSelector = settings.progressItems[i].querySelector(settings.nextSelector).getAttribute('data-hs-step-form-next-options');\n\n            var _iterator4 = _createForOfIteratorHelper(settings.stepsItems),\n                _step4;\n\n            try {\n              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {\n                var item = _step4.value;\n                item.classList.remove(settings.classMap.active);\n                item.style.display = 'none';\n              }\n            } catch (err) {\n              _iterator4.e(err);\n            } finally {\n              _iterator4.f();\n            }\n\n            var newTargetSelector = $el.querySelector(JSON.parse(requiredSelector).targetSelector);\n            newTargetSelector.classList.add(settings.classMap.active);\n            newTargetSelector.style.display = 'block';\n            var isValid = true;\n            Array.from($el.elements).forEach(function (item) {\n              if (item.offsetParent !== null && !item.checkValidity()) {\n                isValid = false;\n              }\n            });\n\n            if (!isValid) {\n              settings.progressItems[i].classList.remove(settings.classMap.checked);\n              return false;\n            } else {\n              settings.progressItems[i].classList.remove(settings.classMap.error);\n            }\n          }\n\n          if (targetIndex > i && settings.isValidate) {\n            settings.progressItems[i].classList.add(settings.classMap.checked);\n          }\n        } else {\n          if (targetIndex > i && settings.isValidate) {\n            settings.progressItems[i].classList.add(settings.classMap.checked);\n          }\n\n          if (targetIndex > i && !settings.isValidate) {\n            settings.progressItems[i].classList.add(settings.classMap.active);\n          }\n        }\n      }\n\n      var _iterator5 = _createForOfIteratorHelper(settings.progressItems),\n          _step5;\n\n      try {\n        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {\n          var _item3 = _step5.value;\n\n          _item3.classList.remove(settings.classMap.active, settings.classMap.focus);\n        }\n      } catch (err) {\n        _iterator5.e(err);\n      } finally {\n        _iterator5.f();\n      }\n\n      settings.progressItems[targetIndex].classList.add(settings.classMap.active, settings.classMap.focus);\n\n      var _iterator6 = _createForOfIteratorHelper(settings.stepsItems),\n          _step6;\n\n      try {\n        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {\n          var _item4 = _step6.value;\n\n          _item4.classList.remove(settings.classMap.active);\n\n          _item4.style.display = 'none';\n        }\n      } catch (err) {\n        _iterator6.e(err);\n      } finally {\n        _iterator6.f();\n      }\n\n      targetSelector.classList.add(settings.classMap.active);\n      this.fadeIn(targetSelector, 400);\n      return settings.onPrevStep();\n    }\n  }, {\n    key: \"fadeIn\",\n    value: function fadeIn(el, time) {\n      el.style.opacity = 0;\n      el.style.display = 'block';\n      var last = +new Date();\n\n      var tick = function tick() {\n        el.style.opacity = +el.style.opacity + (new Date() - last) / time;\n        last = +new Date();\n\n        if (+el.style.opacity < 1) {\n          window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);\n        }\n      };\n\n      tick();\n    }\n  }, {\n    key: \"addToCollection\",\n    value: function addToCollection(item, options, id) {\n      this.collection.push({\n        $el: item,\n        id: id || null,\n        options: Object.assign({}, defaults, item.hasAttribute(dataAttributeName) ? JSON.parse(item.getAttribute(dataAttributeName)) : {}, options)\n      });\n    }\n  }, {\n    key: \"getItem\",\n    value: function getItem(item) {\n      if (typeof item === 'number') {\n        return this.collection[item].$initializedEl;\n      } else {\n        return this.collection.find(function (el) {\n          return el.id === item;\n        }).$initializedEl;\n      }\n    }\n  }]);\n\n  return HSStepForm;\n}();\n\n\n\n//# sourceURL=webpack://HSStepForm/./src/js/hs-step-form.js?");

/***/ })

/******/ })["default"];
});