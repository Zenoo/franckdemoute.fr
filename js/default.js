// Pace js

(function () {
	var AjaxMonitor, Bar, DocumentMonitor, ElementMonitor, ElementTracker, EventLagMonitor, Evented, Events, NoTargetError, RequestIntercept, SOURCE_KEYS, Scaler, SocketRequestTracker, XHRRequestTracker, animation, avgAmplitude, bar, cancelAnimation, cancelAnimationFrame, defaultOptions, extend, extendNative, getFromDOM, getIntercept, handlePushState, ignoreStack, init, now, options, requestAnimationFrame, result, runAnimation, scalers, shouldIgnoreURL, shouldTrack, source, sources, uniScaler, _WebSocket, _XDomainRequest, _XMLHttpRequest,
	_i, _intercept, _len, _pushState, _ref, _ref1, _replaceState, __slice = [].slice, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) { for (var key in parent) if (__hasProp.call(parent, key)) child[key] = parent[key]; function ctor() { this.constructor = child } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child }, __indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++)if (i in this && this[i] === item) return i; return -1 }; defaultOptions = {
		catchupTime: 500,
		initialRate: .03, minTime: 500, ghostTime: 500, maxProgressPerFrame: 10, easeFactor: 1.25, startOnPageLoad: true, restartOnPushState: true, restartOnRequestAfter: 500, target: "#page-loader", elements: { checkInterval: 100, selectors: ["#page-loader"] }, eventLag: { minSamples: 10, sampleCount: 3, lagThreshold: 3 }, ajax: { trackMethods: ["GET"], trackWebSockets: true, ignoreURLs: [] }
	}; now = function () {
		var _ref; return (_ref = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) !=
			null ? _ref : +new Date
	}; requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame; if (requestAnimationFrame == null) { requestAnimationFrame = function (fn) { return setTimeout(fn, 50) }; cancelAnimationFrame = function (id) { return clearTimeout(id) } } runAnimation = function (fn) {
		var last, tick; last = now(); tick = function () {
			var diff; diff = now() - last; if (diff >=
				33) { last = now(); return fn(diff, function () { return requestAnimationFrame(tick) }) } else return setTimeout(tick, 33 - diff)
		}; return tick()
	}; result = function () { var args, key, obj; obj = arguments[0], key = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : []; if (typeof obj[key] === "function") return obj[key].apply(obj, args); else return obj[key] }; extend = function () {
		var key, out, source, sources, val, _i, _len; out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : []; for (_i = 0, _len = sources.length; _i <
			_len; _i++) { source = sources[_i]; if (source) for (key in source) { if (!__hasProp.call(source, key)) continue; val = source[key]; if (out[key] != null && typeof out[key] === "object" && val != null && typeof val === "object") extend(out[key], val); else out[key] = val } } return out
	}; avgAmplitude = function (arr) { var count, sum, v, _i, _len; sum = count = 0; for (_i = 0, _len = arr.length; _i < _len; _i++) { v = arr[_i]; sum += Math.abs(v); count++ } return sum / count }; getFromDOM = function (key, json) {
		var data, e, el; if (key == null) key = "options"; if (json == null) json = true; el = document.querySelector("[data-pace-" +
			key + "]"); if (!el) return; data = el.getAttribute("data-pace-" + key); if (!json) return data; try { return JSON.parse(data) } catch (_error) { e = _error; return typeof console !== "undefined" && console !== null ? console.error("Error parsing inline pace options", e) : void 0 }
	}; Evented = function () {
		function Evented() { } Evented.prototype.on = function (event, handler, ctx, once) {
			var _base; if (once == null) once = false; if (this.bindings == null) this.bindings = {}; if ((_base = this.bindings)[event] == null) _base[event] = []; return this.bindings[event].push({
				handler: handler,
				ctx: ctx, once: once
			})
		}; Evented.prototype.once = function (event, handler, ctx) { return this.on(event, handler, ctx, true) }; Evented.prototype.off = function (event, handler) { var i, _ref, _results; if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) return; if (handler == null) return delete this.bindings[event]; else { i = 0; _results = []; while (i < this.bindings[event].length) if (this.bindings[event][i].handler === handler) _results.push(this.bindings[event].splice(i, 1)); else _results.push(i++); return _results } }; Evented.prototype.trigger =
			function () { var args, ctx, event, handler, i, once, _ref, _ref1, _results; event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : []; if ((_ref = this.bindings) != null ? _ref[event] : void 0) { i = 0; _results = []; while (i < this.bindings[event].length) { _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once; handler.apply(ctx != null ? ctx : this, args); if (once) _results.push(this.bindings[event].splice(i, 1)); else _results.push(i++) } return _results } }; return Evented
	}(); if (window.Pace == null) window.Pace =
		{}; extend(Pace, Evented.prototype); options = Pace.options = extend({}, defaultOptions, window.paceOptions, getFromDOM()); _ref = ["ajax", "document", "eventLag", "elements"]; for (_i = 0, _len = _ref.length; _i < _len; _i++) { source = _ref[_i]; if (options[source] === true) options[source] = defaultOptions[source] } NoTargetError = function (_super) { __extends(NoTargetError, _super); function NoTargetError() { _ref1 = NoTargetError.__super__.constructor.apply(this, arguments); return _ref1 } return NoTargetError }(Error); Bar = function () {
			function Bar() {
			this.progress =
				0
			} Bar.prototype.getElement = function () {
				var targetElement; if (this.el == null) {
					targetElement = document.querySelector(options.target); if (!targetElement) throw new NoTargetError; this.el = document.createElement("div"); this.el.className = "pace pace-active"; document.body.className = document.body.className.replace(/pace-done/g, ""); document.body.className += " pace-running"; this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>'; if (targetElement.firstChild !=
						null) targetElement.insertBefore(this.el, targetElement.firstChild); else targetElement.appendChild(this.el)
				} return this.el
			}; Bar.prototype.finish = function () { var el; el = this.getElement(); el.className = el.className.replace("pace-active", ""); el.className += " pace-inactive"; document.body.className = document.body.className.replace("pace-running", ""); $("#page-loader").delay(100).fadeOut(700); return document.body.className += " pace-done" }; Bar.prototype.update = function (prog) { this.progress = prog; return this.render() };
			Bar.prototype.destroy = function () { try { this.getElement().parentNode.removeChild(this.getElement()) } catch (_error) { NoTargetError = _error } return this.el = void 0 }; Bar.prototype.render = function () {
				var el, progressStr; if (document.querySelector(options.target) == null) return false; el = this.getElement(); el.children[0].style.width = "" + this.progress + "%"; if (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) {
				el.children[0].setAttribute("data-progress-text", "" + (this.progress | 0) + "%"); if (this.progress >=
					100) progressStr = "99"; else { progressStr = this.progress < 10 ? "0" : ""; progressStr += this.progress | 0 } el.children[0].setAttribute("data-progress", "" + progressStr)
				} return this.lastRenderedProgress = this.progress
			}; Bar.prototype.done = function () { return this.progress >= 100 }; return Bar
		}(); Events = function () {
			function Events() { this.bindings = {} } Events.prototype.trigger = function (name, val) {
				var binding, _j, _len1, _ref2, _results; if (this.bindings[name] != null) {
					_ref2 = this.bindings[name]; _results = []; for (_j = 0, _len1 = _ref2.length; _j <
						_len1; _j++) { binding = _ref2[_j]; _results.push(binding.call(this, val)) } return _results
				}
			}; Events.prototype.on = function (name, fn) { var _base; if ((_base = this.bindings)[name] == null) _base[name] = []; return this.bindings[name].push(fn) }; return Events
		}(); _XMLHttpRequest = window.XMLHttpRequest; _XDomainRequest = window.XDomainRequest; _WebSocket = window.WebSocket; extendNative = function (to, from) {
			var e, key, val, _results; _results = []; for (key in from.prototype) try {
				val = from.prototype[key]; if (to[key] == null && typeof val !== "function") _results.push(to[key] =
					val); else _results.push(void 0)
			} catch (_error) { e = _error } return _results
		}; ignoreStack = []; Pace.ignore = function () { var args, fn, ret; fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : []; ignoreStack.unshift("ignore"); ret = fn.apply(null, args); ignoreStack.shift(); return ret }; Pace.track = function () { var args, fn, ret; fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : []; ignoreStack.unshift("track"); ret = fn.apply(null, args); ignoreStack.shift(); return ret }; shouldTrack = function (method) {
			var _ref2;
			if (method == null) method = "GET"; if (ignoreStack[0] === "track") return "force"; if (!ignoreStack.length && options.ajax) if (method === "socket" && options.ajax.trackWebSockets) return true; else if (_ref2 = method.toUpperCase(), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0) return true; return false
		}; RequestIntercept = function (_super) {
			__extends(RequestIntercept, _super); function RequestIntercept() {
				var monitorXHR, _this = this; RequestIntercept.__super__.constructor.apply(this, arguments); monitorXHR = function (req) {
					var _open;
					_open = req.open; return req.open = function (type, url, async) { if (shouldTrack(type)) _this.trigger("request", { type: type, url: url, request: req }); return _open.apply(req, arguments) }
				}; window.XMLHttpRequest = function (flags) { var req; req = new _XMLHttpRequest(flags); monitorXHR(req); return req }; extendNative(window.XMLHttpRequest, _XMLHttpRequest); if (_XDomainRequest != null) { window.XDomainRequest = function () { var req; req = new _XDomainRequest; monitorXHR(req); return req }; extendNative(window.XDomainRequest, _XDomainRequest) } if (_WebSocket !=
					null && options.ajax.trackWebSockets) { window.WebSocket = function (url, protocols) { var req; if (protocols != null) req = new _WebSocket(url, protocols); else req = new _WebSocket(url); if (shouldTrack("socket")) _this.trigger("request", { type: "socket", url: url, protocols: protocols, request: req }); return req }; extendNative(window.WebSocket, _WebSocket) }
			} return RequestIntercept
		}(Events); _intercept = null; getIntercept = function () { if (_intercept == null) _intercept = new RequestIntercept; return _intercept }; shouldIgnoreURL = function (url) {
			var pattern,
			_j, _len1, _ref2; _ref2 = options.ajax.ignoreURLs; for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) { pattern = _ref2[_j]; if (typeof pattern === "string") { if (url.indexOf(pattern) !== -1) return true } else if (pattern.test(url)) return true } return false
		}; getIntercept().on("request", function (_arg) {
			var after, args, request, type, url; type = _arg.type, request = _arg.request, url = _arg.url; if (shouldIgnoreURL(url)) return; if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === "force")) {
				args = arguments; after = options.restartOnRequestAfter ||
					0; if (typeof after === "boolean") after = 0; return setTimeout(function () { var stillActive, _j, _len1, _ref2, _ref3, _results; if (type === "socket") stillActive = request.readyState < 2; else stillActive = 0 < (_ref2 = request.readyState) && _ref2 < 4; if (stillActive) { Pace.restart(); _ref3 = Pace.sources; _results = []; for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) { source = _ref3[_j]; if (source instanceof AjaxMonitor) { source.watch.apply(source, args); break } else _results.push(void 0) } return _results } }, after)
			}
		}); AjaxMonitor = function () {
			function AjaxMonitor() {
				var _this =
					this; this.elements = []; getIntercept().on("request", function () { return _this.watch.apply(_this, arguments) })
			} AjaxMonitor.prototype.watch = function (_arg) { var request, tracker, type, url; type = _arg.type, request = _arg.request, url = _arg.url; if (shouldIgnoreURL(url)) return; if (type === "socket") tracker = new SocketRequestTracker(request); else tracker = new XHRRequestTracker(request); return this.elements.push(tracker) }; return AjaxMonitor
		}(); XHRRequestTracker = function () {
			function XHRRequestTracker(request) {
				var event, size, _j,
				_len1, _onreadystatechange, _ref2, _this = this; this.progress = 0; if (window.ProgressEvent != null) { size = null; request.addEventListener("progress", function (evt) { if (evt.lengthComputable) return _this.progress = 100 * evt.loaded / evt.total; else return _this.progress = _this.progress + (100 - _this.progress) / 2 }); _ref2 = ["load", "abort", "timeout", "error"]; for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) { event = _ref2[_j]; request.addEventListener(event, function () { return _this.progress = 100 }) } } else {
					_onreadystatechange = request.onreadystatechange;
					request.onreadystatechange = function () { var _ref3; if ((_ref3 = request.readyState) === 0 || _ref3 === 4) _this.progress = 100; else if (request.readyState === 3) _this.progress = 50; return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0 }
				}
			} return XHRRequestTracker
		}(); SocketRequestTracker = function () {
			function SocketRequestTracker(request) {
				var event, _j, _len1, _ref2, _this = this; this.progress = 0; _ref2 = ["error", "open"]; for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
					event = _ref2[_j]; request.addEventListener(event,
						function () { return _this.progress = 100 })
				}
			} return SocketRequestTracker
		}(); ElementMonitor = function () { function ElementMonitor(options) { var selector, _j, _len1, _ref2; if (options == null) options = {}; this.elements = []; if (options.selectors == null) options.selectors = []; _ref2 = options.selectors; for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) { selector = _ref2[_j]; this.elements.push(new ElementTracker(selector)) } } return ElementMonitor }(); ElementTracker = function () {
			function ElementTracker(selector) {
			this.selector = selector; this.progress =
				0; this.check()
			} ElementTracker.prototype.check = function () { var _this = this; if (document.querySelector(this.selector)) return this.done(); else return setTimeout(function () { return _this.check() }, options.elements.checkInterval) }; ElementTracker.prototype.done = function () { return this.progress = 100 }; return ElementTracker
		}(); DocumentMonitor = function () {
			DocumentMonitor.prototype.states = { loading: 0, interactive: 50, complete: 100 }; function DocumentMonitor() {
				var _onreadystatechange, _ref2, _this = this; this.progress = (_ref2 =
					this.states[document.readyState]) != null ? _ref2 : 100; _onreadystatechange = document.onreadystatechange; document.onreadystatechange = function () { if (_this.states[document.readyState] != null) _this.progress = _this.states[document.readyState]; return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0 }
			} return DocumentMonitor
		}(); EventLagMonitor = function () {
			function EventLagMonitor() {
				var avg, interval, last, points, samples, _this = this; this.progress = 0; avg = 0; samples = []; points = 0; last =
					now(); interval = setInterval(function () { var diff; diff = now() - last - 50; last = now(); samples.push(diff); if (samples.length > options.eventLag.sampleCount) samples.shift(); avg = avgAmplitude(samples); if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) { _this.progress = 100; return clearInterval(interval) } else return _this.progress = 100 * (3 / (avg + 3)) }, 50)
			} return EventLagMonitor
		}(); Scaler = function () {
			function Scaler(source) {
			this.source = source; this.last = this.sinceLastUpdate = 0; this.rate = options.initialRate;
				this.catchup = 0; this.progress = this.lastProgress = 0; if (this.source != null) this.progress = result(this.source, "progress")
			} Scaler.prototype.tick = function (frameTime, val) {
				var scaling; if (val == null) val = result(this.source, "progress"); if (val >= 100) this.done = true; if (val === this.last) this.sinceLastUpdate += frameTime; else { if (this.sinceLastUpdate) this.rate = (val - this.last) / this.sinceLastUpdate; this.catchup = (val - this.progress) / options.catchupTime; this.sinceLastUpdate = 0; this.last = val } if (val > this.progress) this.progress +=
					this.catchup * frameTime; scaling = 1 - Math.pow(this.progress / 100, options.easeFactor); this.progress += scaling * this.rate * frameTime; this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress); this.progress = Math.max(0, this.progress); this.progress = Math.min(100, this.progress); this.lastProgress = this.progress; return this.progress
			}; return Scaler
		}(); sources = null; scalers = null; bar = null; uniScaler = null; animation = null; cancelAnimation = null; Pace.running = false; handlePushState = function () { if (options.restartOnPushState) return Pace.restart() };
	if (window.history.pushState != null) { _pushState = window.history.pushState; window.history.pushState = function () { handlePushState(); return _pushState.apply(window.history, arguments) } } if (window.history.replaceState != null) { _replaceState = window.history.replaceState; window.history.replaceState = function () { handlePushState(); return _replaceState.apply(window.history, arguments) } } SOURCE_KEYS = { ajax: AjaxMonitor, elements: ElementMonitor, document: DocumentMonitor, eventLag: EventLagMonitor }; (init = function () {
		var type, _j,
		_k, _len1, _len2, _ref2, _ref3, _ref4; Pace.sources = sources = []; _ref2 = ["ajax", "elements", "document", "eventLag"]; for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) { type = _ref2[_j]; if (options[type] !== false) sources.push(new SOURCE_KEYS[type](options[type])) } _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : []; for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) { source = _ref4[_k]; sources.push(new source(options)) } Pace.bar = bar = new Bar; scalers = []; return uniScaler = new Scaler
	})(); Pace.stop = function () {
		Pace.trigger("stop"); Pace.running =
			false; bar.destroy(); cancelAnimation = true; if (animation != null) { if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(animation); animation = null } return init()
	}; Pace.restart = function () { Pace.trigger("restart"); Pace.stop(); return Pace.start() }; Pace.go = function () {
		var start; Pace.running = true; bar.render(); start = now(); cancelAnimation = false; return animation = runAnimation(function (frameTime, enqueueNextFrame) {
			var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
			remaining = 100 - bar.progress; count = sum = 0; done = true; for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) { source = sources[i]; scalerList = scalers[i] != null ? scalers[i] : scalers[i] = []; elements = (_ref2 = source.elements) != null ? _ref2 : [source]; for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) { element = elements[j]; scaler = scalerList[j] != null ? scalerList[j] : scalerList[j] = new Scaler(element); done &= scaler.done; if (scaler.done) continue; count++; sum += scaler.tick(frameTime) } } avg = sum / count; bar.update(uniScaler.tick(frameTime, avg));
			if (bar.done() || done || cancelAnimation) { bar.update(100); Pace.trigger("done"); return setTimeout(function () { bar.finish(); Pace.running = false; return Pace.trigger("hide") }, Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0))) } else return enqueueNextFrame()
		})
	}; Pace.start = function (_options) { extend(options, _options); Pace.running = true; try { bar.render() } catch (_error) { NoTargetError = _error } if (!document.querySelector(".pace")) return setTimeout(Pace.start, 50); else { Pace.trigger("start"); return Pace.go() } };
	if (typeof define === "function" && define.amd) define(function () { return Pace }); else if (typeof exports === "object") module.exports = Pace; else if (options.startOnPageLoad) Pace.start()
}).call(this);

// Jquery mousewheel

(function ($) {
	var types = ["DOMMouseScroll", "mousewheel"]; if ($.event.fixHooks) for (var i = types.length; i;)$.event.fixHooks[types[--i]] = $.event.mouseHooks; $.event.special.mousewheel = { setup: function () { if (this.addEventListener) for (var i = types.length; i;)this.addEventListener(types[--i], handler, false); else this.onmousewheel = handler }, teardown: function () { if (this.removeEventListener) for (var i = types.length; i;)this.removeEventListener(types[--i], handler, false); else this.onmousewheel = null } }; $.fn.extend({
		mousewheel: function (fn) {
			return fn ?
				this.bind("mousewheel", fn) : this.trigger("mousewheel")
		}, unmousewheel: function (fn) { return this.unbind("mousewheel", fn) }
	}); function handler(event) {
		var orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, returnValue = true, deltaX = 0, deltaY = 0; event = $.event.fix(orgEvent); event.type = "mousewheel"; if (orgEvent.wheelDelta) delta = orgEvent.wheelDelta / 120; if (orgEvent.detail) delta = -orgEvent.detail / 3; deltaY = delta; if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
			deltaY = 0; deltaX =
				-1 * delta
		} if (orgEvent.wheelDeltaY !== undefined) deltaY = orgEvent.wheelDeltaY / 120; if (orgEvent.wheelDeltaX !== undefined) deltaX = -1 * orgEvent.wheelDeltaX / 120; args.unshift(event, delta, deltaX, deltaY); return ($.event.dispatch || $.event.handle).apply(this, args)
	}
})(jQuery);

// Jquery Smartresize

(function (window, $, undefined) {
	var $event = $.event, resizeTimeout; $event.special.smartresize = { setup: function () { $(this).bind("resize", $event.special.smartresize.handler) }, teardown: function () { $(this).unbind("resize", $event.special.smartresize.handler) }, handler: function (event, execAsap) { var context = this, args = arguments; event.type = "smartresize"; if (resizeTimeout) clearTimeout(resizeTimeout); resizeTimeout = setTimeout(function () { jQuery.event.dispatch.apply(context, args) }, execAsap === "execAsap" ? 0 : 50) } }; $.fn.smartresize =
		function (fn) { return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]) }
})(window, jQuery);
// Jscrollpane
(function (b, a, c) {
	b.fn.jScrollPane = function (e) {
		function d(D, O) {
			var az, Q = this, Y, ak, v, am, T, Z, y, q, aA, aF, av, i, I, h, j, aa, U, aq, X, t, A, ar, af, an, G, l, au, ay, x, aw, aI, f, L, aj = true, P = true, aH = false, k = false, ap = D.clone(false, false).empty(), ac = b.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp"; aI = D.css("paddingTop") + " " + D.css("paddingRight") + " " + D.css("paddingBottom") + " " + D.css("paddingLeft"); f = (parseInt(D.css("paddingLeft"), 10) || 0) + (parseInt(D.css("paddingRight"), 10) || 0); function at(aR) {
				var aM, aO, aN, aK, aJ, aQ, aP = false,
				aL = false; az = aR; if (Y === c) { aJ = D.scrollTop(); aQ = D.scrollLeft(); D.css({ overflow: "hidden", padding: 0 }); ak = D.innerWidth() + f; v = D.innerHeight(); D.width(ak); Y = b('<div class="jspPane" />').css("padding", aI).append(D.children()); am = b('<div class="jspContainer" />').css({ width: ak + "px", height: v + "px" }).append(Y).appendTo(D) } else {
					D.css("width", ""); aP = az.stickToBottom && K(); aL = az.stickToRight && B(); aK = D.innerWidth() + f != ak || D.outerHeight() != v; if (aK) {
						ak = D.innerWidth() + f; v = D.innerHeight(); am.css({
							width: ak + "px", height: v +
								"px"
						})
					} if (!aK && L == T && Y.outerHeight() == Z) { D.width(ak); return } L = T; Y.css("width", ""); D.width(ak); am.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()
				} Y.css("overflow", "auto"); if (aR.contentWidth) T = aR.contentWidth; else T = Y[0].scrollWidth; Z = Y[0].scrollHeight; Y.css("overflow", ""); y = T / ak; q = Z / v; aA = q > 1; aF = y > 1; if (!(aF || aA)) { D.removeClass("jspScrollable"); Y.css({ top: 0, width: am.width() - f }); n(); E(); R(); w(); ai() } else {
					D.addClass("jspScrollable"); aM = az.maintainPosition && (I || aa); if (aM) { aO = aD(); aN = aB() } aG();
					z(); F(); if (aM) { N(aL ? T - ak : aO, false); M(aP ? Z - v : aN, false) } J(); ag(); ao(); if (az.enableKeyboardNavigation) S(); if (az.clickOnTrack) p(); C(); if (az.hijackInternalLinks) m()
				} if (az.autoReinitialise && !aw) aw = setInterval(function () { at(az) }, az.autoReinitialiseDelay); else if (!az.autoReinitialise && aw) clearInterval(aw); aJ && D.scrollTop(0) && M(aJ, false); aQ && D.scrollLeft(0) && N(aQ, false); D.trigger("jsp-initialised", [aF || aA])
			} function aG() {
				if (aA) {
					am.append(b('<div class="jspVerticalBar" />').append(b('<div class="jspCap jspCapTop" />'),
						b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragTop" />'), b('<div class="jspDragBottom" />'))), b('<div class="jspCap jspCapBottom" />'))); U = am.find(">.jspVerticalBar"); aq = U.find(">.jspTrack"); av = aq.find(">.jspDrag"); if (az.showArrows) {
							ar = b('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", aE(0, -1)).bind("click.jsp", aC); af = b('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", aE(0, 1)).bind("click.jsp", aC); if (az.arrowScrollOnHover) {
								ar.bind("mouseover.jsp",
									aE(0, -1, ar)); af.bind("mouseover.jsp", aE(0, 1, af))
							} al(aq, az.verticalArrowPositions, ar, af)
						} t = v; am.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function () { t -= b(this).outerHeight() }); av.hover(function () { av.addClass("jspHover") }, function () { av.removeClass("jspHover") }).bind("mousedown.jsp", function (aJ) {
							b("html").bind("dragstart.jsp selectstart.jsp", aC); av.addClass("jspActive"); var s = aJ.pageY - av.position().top; b("html").bind("mousemove.jsp", function (aK) { V(aK.pageY - s, false) }).bind("mouseup.jsp mouseleave.jsp",
								ax); return false
						}); o()
				}
			} function o() { aq.height(t + "px"); I = 0; X = az.verticalGutter + aq.outerWidth(); Y.width(ak - X - f); try { if (U.position().left === 0) Y.css("margin-left", X + "px") } catch (s) { } } function z() {
				if (aF) {
					am.append(b('<div class="jspHorizontalBar" />').append(b('<div class="jspCap jspCapLeft" />'), b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragLeft" />'), b('<div class="jspDragRight" />'))), b('<div class="jspCap jspCapRight" />'))); an = am.find(">.jspHorizontalBar");
					G = an.find(">.jspTrack"); h = G.find(">.jspDrag"); if (az.showArrows) { ay = b('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", aE(-1, 0)).bind("click.jsp", aC); x = b('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", aE(1, 0)).bind("click.jsp", aC); if (az.arrowScrollOnHover) { ay.bind("mouseover.jsp", aE(-1, 0, ay)); x.bind("mouseover.jsp", aE(1, 0, x)) } al(G, az.horizontalArrowPositions, ay, x) } h.hover(function () { h.addClass("jspHover") }, function () { h.removeClass("jspHover") }).bind("mousedown.jsp", function (aJ) {
						b("html").bind("dragstart.jsp selectstart.jsp",
							aC); h.addClass("jspActive"); var s = aJ.pageX - h.position().left; b("html").bind("mousemove.jsp", function (aK) { W(aK.pageX - s, false) }).bind("mouseup.jsp mouseleave.jsp", ax); return false
					}); l = am.innerWidth(); ah()
				}
			} function ah() { am.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function () { l -= b(this).outerWidth() }); G.width(l + "px"); aa = 0 } function F() {
				if (aF && aA) {
					var aJ = G.outerHeight(), s = aq.outerWidth(); t -= aJ; b(an).find(">.jspCap:visible,>.jspArrow").each(function () { l += b(this).outerWidth() });
					l -= s; v -= s; ak -= aJ; G.parent().append(b('<div class="jspCorner" />').css("width", aJ + "px")); o(); ah()
				} if (aF) Y.width(am.outerWidth() - f + "px"); Z = Y.outerHeight(); q = Z / v; if (aF) { au = Math.ceil(1 / y * l); if (au > az.horizontalDragMaxWidth) au = az.horizontalDragMaxWidth; else if (au < az.horizontalDragMinWidth) au = az.horizontalDragMinWidth; h.width(au + "px"); j = l - au; ae(aa) } if (aA) {
					A = Math.ceil(1 / q * t); if (A > az.verticalDragMaxHeight) A = az.verticalDragMaxHeight; else if (A < az.verticalDragMinHeight) A = az.verticalDragMinHeight; av.height(A +
						"px"); i = t - A; ad(I)
				}
			} function al(aK, aM, aJ, s) { var aO = "before", aL = "after", aN; if (aM == "os") aM = /Mac/.test(navigator.platform) ? "after" : "split"; if (aM == aO) aL = aM; else if (aM == aL) { aO = aM; aN = aJ; aJ = s; s = aN } aK[aO](aJ)[aL](s) } function aE(aJ, s, aK) { return function () { H(aJ, s, this, aK); this.blur(); return false } } function H(aM, aL, aP, aO) {
				aP = b(aP).addClass("jspActive"); var aN, aK, aJ = true, s = function () {
					if (aM !== 0) Q.scrollByX(aM * az.arrowButtonSpeed); if (aL !== 0) Q.scrollByY(aL * az.arrowButtonSpeed); aK = setTimeout(s, aJ ? az.initialDelay :
						az.arrowRepeatFreq); aJ = false
				}; s(); aN = aO ? "mouseout.jsp" : "mouseup.jsp"; aO = aO || b("html"); aO.bind(aN, function () { aP.removeClass("jspActive"); aK && clearTimeout(aK); aK = null; aO.unbind(aN) })
			} function p() {
				w(); if (aA) aq.bind("mousedown.jsp", function (aO) {
					if (aO.originalTarget === c || aO.originalTarget == aO.currentTarget) {
						var aM = b(this), aP = aM.offset(), aN = aO.pageY - aP.top - I, aK, aJ = true, s = function () {
							var aS = aM.offset(), aT = aO.pageY - aS.top - A / 2, aQ = v * az.scrollPagePercent, aR = i * aQ / (Z - v); if (aN < 0) if (I - aR > aT) Q.scrollByY(-aQ); else V(aT);
							else if (aN > 0) if (I + aR < aT) Q.scrollByY(aQ); else V(aT); else { aL(); return } aK = setTimeout(s, aJ ? az.initialDelay : az.trackClickRepeatFreq); aJ = false
						}, aL = function () { aK && clearTimeout(aK); aK = null; b(document).unbind("mouseup.jsp", aL) }; s(); b(document).bind("mouseup.jsp", aL); return false
					}
				}); if (aF) G.bind("mousedown.jsp", function (aO) {
					if (aO.originalTarget === c || aO.originalTarget == aO.currentTarget) {
						var aM = b(this), aP = aM.offset(), aN = aO.pageX - aP.left - aa, aK, aJ = true, s = function () {
							var aS = aM.offset(), aT = aO.pageX - aS.left - au / 2, aQ =
								ak * az.scrollPagePercent, aR = j * aQ / (T - ak); if (aN < 0) if (aa - aR > aT) Q.scrollByX(-aQ); else W(aT); else if (aN > 0) if (aa + aR < aT) Q.scrollByX(aQ); else W(aT); else { aL(); return } aK = setTimeout(s, aJ ? az.initialDelay : az.trackClickRepeatFreq); aJ = false
						}, aL = function () { aK && clearTimeout(aK); aK = null; b(document).unbind("mouseup.jsp", aL) }; s(); b(document).bind("mouseup.jsp", aL); return false
					}
				})
			} function w() { if (G) G.unbind("mousedown.jsp"); if (aq) aq.unbind("mousedown.jsp") } function ax() {
				b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");
				if (av) av.removeClass("jspActive"); if (h) h.removeClass("jspActive")
			} function V(s, aJ) { if (!aA) return; if (s < 0) s = 0; else if (s > i) s = i; if (aJ === c) aJ = az.animateScroll; if (aJ) Q.animate(av, "top", s, ad); else { av.css("top", s); ad(s) } } function ad(aJ) { if (aJ === c) aJ = av.position().top; am.scrollTop(0); I = aJ; var aM = I === 0, aK = I == i, aL = aJ / i, s = -aL * (Z - v); if (aj != aM || aH != aK) { aj = aM; aH = aK; D.trigger("jsp-arrow-change", [aj, aH, P, k]) } u(aM, aK); Y.css("top", s); D.trigger("jsp-scroll-y", [-s, aM, aK]).trigger("scroll") } function W(aJ, s) {
				if (!aF) return;
				if (aJ < 0) aJ = 0; else if (aJ > j) aJ = j; if (s === c) s = az.animateScroll; if (s) Q.animate(h, "left", aJ, ae); else { h.css("left", aJ); ae(aJ) }
			} function ae(aJ) { if (aJ === c) aJ = h.position().left; am.scrollTop(0); aa = aJ; var aM = aa === 0, aL = aa == j, aK = aJ / j, s = -aK * (T - ak); if (P != aM || k != aL) { P = aM; k = aL; D.trigger("jsp-arrow-change", [aj, aH, P, k]) } r(aM, aL); Y.css("left", s); D.trigger("jsp-scroll-x", [-s, aM, aL]).trigger("scroll") } function u(aJ, s) { if (az.showArrows) { ar[aJ ? "addClass" : "removeClass"]("jspDisabled"); af[s ? "addClass" : "removeClass"]("jspDisabled") } }
			function r(aJ, s) { if (az.showArrows) { ay[aJ ? "addClass" : "removeClass"]("jspDisabled"); x[s ? "addClass" : "removeClass"]("jspDisabled") } } function M(s, aJ) { var aK = s / (Z - v); V(aK * i, aJ) } function N(aJ, s) { var aK = aJ / (T - ak); W(aK * j, s) } function ab(aW, aR, aK) {
				var aO, aL, aM, s = 0, aV = 0, aJ, aQ, aP, aT, aS, aU; try { aO = b(aW) } catch (aN) { return } aL = aO.outerHeight(); aM = aO.outerWidth(); am.scrollTop(0); am.scrollLeft(0); while (!aO.is(".jspPane")) { s += aO.position().top; aV += aO.position().left; aO = aO.offsetParent(); if (/^body|html$/i.test(aO[0].nodeName)) return } aJ =
					aB(); aP = aJ + v; if (s < aJ || aR) aS = s - az.verticalGutter; else if (s + aL > aP) aS = s - v + aL + az.verticalGutter; if (aS) M(aS, aK); aQ = aD(); aT = aQ + ak; if (aV < aQ || aR) aU = aV - az.horizontalGutter; else if (aV + aM > aT) aU = aV - ak + aM + az.horizontalGutter; if (aU) N(aU, aK)
			} function aD() { return -Y.position().left } function aB() { return -Y.position().top } function K() { var s = Z - v; return s > 20 && s - aB() < 10 } function B() { var s = T - ak; return s > 20 && s - aD() < 10 } function ag() {
				am.unbind(ac).bind(ac, function (aM, aN, aL, aJ) {
					var aK = aa, s = I; Q.scrollBy(aL * az.mouseWheelSpeed,
						-aJ * az.mouseWheelSpeed, false); return aK == aa && s == I
				})
			} function n() { am.unbind(ac) } function aC() { return false } function J() { Y.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function (s) { ab(s.target, false) }) } function E() { Y.find(":input,a").unbind("focus.jsp") } function S() {
				var s, aJ, aL = []; aF && aL.push(an[0]); aA && aL.push(U[0]); Y.focus(function () { D.focus() }); D.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function (aO) {
					if (aO.target !== this && !(aL.length && b(aO.target).closest(aL).length)) return;
					var aN = aa, aM = I; switch (aO.keyCode) { case 40: case 38: case 34: case 32: case 33: case 39: case 37: s = aO.keyCode; aK(); break; case 35: M(Z - v); s = null; break; case 36: M(0); s = null; break }aJ = aO.keyCode == s && aN != aa || aM != I; return !aJ
				}).bind("keypress.jsp", function (aM) { if (aM.keyCode == s) aK(); return !aJ }); if (az.hideFocus) { D.css("outline", "none"); if ("hideFocus" in am[0]) D.attr("hideFocus", true) } else { D.css("outline", ""); if ("hideFocus" in am[0]) D.attr("hideFocus", false) } function aK() {
					var aN = aa, aM = I; switch (s) {
						case 40: Q.scrollByY(az.keyboardSpeed,
							false); break; case 38: Q.scrollByY(-az.keyboardSpeed, false); break; case 34: case 32: Q.scrollByY(v * az.scrollPagePercent, false); break; case 33: Q.scrollByY(-v * az.scrollPagePercent, false); break; case 39: Q.scrollByX(az.keyboardSpeed, false); break; case 37: Q.scrollByX(-az.keyboardSpeed, false); break
					}aJ = aN != aa || aM != I; return aJ
				}
			} function R() { D.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp") } function C() {
				if (location.hash && location.hash.length > 1) {
					var aL, aJ, aK = escape(location.hash); try {
						aL =
						b(aK)
					} catch (s) { return } if (aL.length && Y.find(aK)) if (am.scrollTop() === 0) aJ = setInterval(function () { if (am.scrollTop() > 0) { ab(aK, true); b(document).scrollTop(am.position().top); clearInterval(aJ) } }, 50); else { ab(aK, true); b(document).scrollTop(am.position().top) }
				}
			} function ai() { b("a.jspHijack").unbind("click.jsp-hijack").removeClass("jspHijack") } function m() {
				ai(); b("a[href^=#]").addClass("jspHijack").bind("click.jsp-hijack", function () {
					var s = this.href.split("#"), aJ; if (s.length > 1) {
						aJ = s[1]; if (aJ.length > 0 && Y.find("#" +
							aJ).length > 0) { ab("#" + aJ, true); return false }
					}
				})
			} function ao() {
				var aK, aJ, aM, aL, aN, s = false; am.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function (aO) { var aP = aO.originalEvent.touches[0]; aK = aD(); aJ = aB(); aM = aP.pageX; aL = aP.pageY; aN = false; s = true }).bind("touchmove.jsp", function (aR) {
					if (!s) return; var aQ = aR.originalEvent.touches[0], aP = aa, aO = I; Q.scrollTo(aK + aM - aQ.pageX, aJ + aL - aQ.pageY); aN = aN || Math.abs(aM - aQ.pageX) > 5 || Math.abs(aL - aQ.pageY) > 5; return aP == aa && aO ==
						I
				}).bind("touchend.jsp", function (aO) { s = false }).bind("click.jsp-touchclick", function (aO) { if (aN) { aN = false; return false } })
			} function g() { var s = aB(), aJ = aD(); D.removeClass("jspScrollable").unbind(".jsp"); D.replaceWith(ap.append(Y.children())); ap.scrollTop(s); ap.scrollLeft(aJ) } b.extend(Q, {
				reinitialise: function (aJ) { aJ = b.extend({}, az, aJ); at(aJ) }, scrollToElement: function (aK, aJ, s) { ab(aK, aJ, s) }, scrollTo: function (aK, s, aJ) { N(aK, aJ); M(s, aJ) }, scrollToX: function (aJ, s) { N(aJ, s) }, scrollToY: function (s, aJ) { M(s, aJ) }, scrollToPercentX: function (aJ,
					s) { N(aJ * (T - ak), s) }, scrollToPercentY: function (aJ, s) { M(aJ * (Z - v), s) }, scrollBy: function (aJ, s, aK) { Q.scrollByX(aJ, aK); Q.scrollByY(s, aK) }, scrollByX: function (s, aK) { var aJ = aD() + Math[s < 0 ? "floor" : "ceil"](s), aL = aJ / (T - ak); W(aL * j, aK) }, scrollByY: function (s, aK) { var aJ = aB() + Math[s < 0 ? "floor" : "ceil"](s), aL = aJ / (Z - v); V(aL * i, aK) }, positionDragX: function (s, aJ) { W(s, aJ) }, positionDragY: function (aJ, s) { V(aJ, s) }, animate: function (aJ, aM, s, aL) {
						var aK = {}; aK[aM] = s; aJ.animate(aK, {
							duration: az.animateDuration, easing: az.animateEase, queue: false,
							step: aL
						})
					}, getContentPositionX: function () { return aD() }, getContentPositionY: function () { return aB() }, getContentWidth: function () { return T }, getContentHeight: function () { return Z }, getPercentScrolledX: function () { return aD() / (T - ak) }, getPercentScrolledY: function () { return aB() / (Z - v) }, getIsScrollableH: function () { return aF }, getIsScrollableV: function () { return aA }, getContentPane: function () { return Y }, scrollToBottom: function (s) { V(i, s) }, hijackInternalLinks: function () { m() }, destroy: function () { g() }
			}); at(O)
		} e = b.extend({},
			b.fn.jScrollPane.defaults, e); b.each(["mouseWheelSpeed", "arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function () { e[this] = e[this] || e.speed }); return this.each(function () { var f = b(this), g = f.data("jsp"); if (g) g.reinitialise(e); else { g = new d(f, e); f.data("jsp", g) } })
	}; b.fn.jScrollPane.defaults = {
		showArrows: false, maintainPosition: true, stickToBottom: false, stickToRight: false, clickOnTrack: true, autoReinitialise: false, autoReinitialiseDelay: 500, verticalDragMinHeight: 0, verticalDragMaxHeight: 99999, horizontalDragMinWidth: 0,
		horizontalDragMaxWidth: 99999, contentWidth: c, animateScroll: false, animateDuration: 300, animateEase: "linear", hijackInternalLinks: false, verticalGutter: 4, horizontalGutter: 4, mouseWheelSpeed: 0, arrowButtonSpeed: 0, arrowRepeatFreq: 50, arrowScrollOnHover: false, trackClickSpeed: 0, trackClickRepeatFreq: 70, verticalArrowPositions: "split", horizontalArrowPositions: "split", enableKeyboardNavigation: true, hideFocus: false, keyboardSpeed: 0, initialDelay: 300, speed: 30, scrollPagePercent: .8
	}
})(jQuery, this);

// mwheelIntent

(function ($) {
	var mwheelI = { pos: [-260, -260] }, minDif = 3, doc = document, root = doc.documentElement, body = doc.body, longDelay, shortDelay; function unsetPos() { if (this === mwheelI.elem) { mwheelI.pos = [-260, -260]; mwheelI.elem = false; minDif = 3 } } $.event.special.mwheelIntent = {
		setup: function () { var jElm = $(this).bind("mousewheel", $.event.special.mwheelIntent.handler); if (this !== doc && this !== root && this !== body) jElm.bind("mouseleave", unsetPos); jElm = null; return true }, teardown: function () {
			$(this).unbind("mousewheel", $.event.special.mwheelIntent.handler).unbind("mouseleave",
				unsetPos); return true
		}, handler: function (e, d) { var pos = [e.clientX, e.clientY]; if (this === mwheelI.elem || Math.abs(mwheelI.pos[0] - pos[0]) > minDif || Math.abs(mwheelI.pos[1] - pos[1]) > minDif) { mwheelI.elem = this; mwheelI.pos = pos; minDif = 250; clearTimeout(shortDelay); shortDelay = setTimeout(function () { minDif = 10 }, 200); clearTimeout(longDelay); longDelay = setTimeout(function () { minDif = 3 }, 1500); e = $.extend({}, e, { type: "mwheelIntent" }); return ($.event.dispatch || $.event.handle).apply(this, arguments) } }
	}; $.fn.extend({
		mwheelIntent: function (fn) {
			return fn ?
				this.bind("mwheelIntent", fn) : this.trigger("mwheelIntent")
		}, unmwheelIntent: function (fn) { return this.unbind("mwheelIntent", fn) }
	}); $(function () { body = doc.body; $(doc).bind("mwheelIntent.mwheelIntentDefault", $.noop) })
})(jQuery);

// History Js

window.JSON || (window.JSON = {}), function () {
	function f(a) { return a < 10 ? "0" + a : a } function quote(a) { return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function (a) { var b = meta[a]; return typeof b == "string" ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + a + '"' } function str(a, b) {
		var c, d, e, f, g = gap, h, i = b[a]; i && typeof i == "object" && typeof i.toJSON == "function" && (i = i.toJSON(a)), typeof rep == "function" && (i = rep.call(b, a, i)); switch (typeof i) {
			case "string": return quote(i); case "number": return isFinite(i) ?
				String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; gap += indent, h = []; if (Object.prototype.toString.apply(i) === "[object Array]") { f = i.length; for (c = 0; c < f; c += 1)h[c] = str(c, i) || "null"; return e = h.length === 0 ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", gap = g, e } if (rep && typeof rep == "object") { f = rep.length; for (c = 0; c < f; c += 1)d = rep[c], typeof d == "string" && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e)) } else for (d in i) Object.hasOwnProperty.call(i,
					d) && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e)); return e = h.length === 0 ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", gap = g, e
		}
	} "use strict", typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function (a) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON =
		function (a) { return this.valueOf() }); var JSON = window.JSON, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, rep; typeof JSON.stringify != "function" && (JSON.stringify = function (a, b, c) {
			var d; gap = "", indent = ""; if (typeof c ==
				"number") for (d = 0; d < c; d += 1)indent += " "; else typeof c == "string" && (indent = c); rep = b; if (!b || typeof b == "function" || typeof b == "object" && typeof b.length == "number") return str("", { "": a }); throw new Error("JSON.stringify");
		}), typeof JSON.parse != "function" && (JSON.parse = function (text, reviver) {
			function walk(a, b) { var c, d, e = a[b]; if (e && typeof e == "object") for (c in e) Object.hasOwnProperty.call(e, c) && (d = walk(e, c), d !== undefined ? e[c] = d : delete e[c]); return reviver.call(a, b, e) } var j; text = String(text), cx.lastIndex = 0, cx.test(text) &&
				(text = text.replace(cx, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) })); if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse");
		})
}(), function (a, b) {
	var c = a.History = a.History || {}, d = a.jQuery; if (typeof c.Adapter != "undefined") throw new Error("History.js Adapter has already been loaded...");
	c.Adapter = { bind: function (a, b, c) { d(a).bind(b, c) }, trigger: function (a, b, c) { d(a).trigger(b, c) }, extractEventData: function (a, c, d) { var e = c && c.originalEvent && c.originalEvent[a] || d && d[a] || b; return e }, onDomLoad: function (a) { d(a) } }, typeof c.init != "undefined" && c.init()
}(window), function (a, b) {
	var c = a.document, d = a.setTimeout || d, e = a.clearTimeout || e, f = a.setInterval || f, g = a.History = a.History || {}; if (typeof g.initHtml4 != "undefined") throw new Error("History.js HTML4 Support has already been loaded..."); g.initHtml4 = function () {
		if (typeof g.initHtml4.initialized !=
			"undefined") return !1; g.initHtml4.initialized = !0, g.enabled = !0, g.savedHashes = [], g.isLastHash = function (a) { var b = g.getHashByIndex(), c; return c = a === b, c }, g.saveHash = function (a) { return g.isLastHash(a) ? !1 : (g.savedHashes.push(a), !0) }, g.getHashByIndex = function (a) { var b = null; return typeof a == "undefined" ? b = g.savedHashes[g.savedHashes.length - 1] : a < 0 ? b = g.savedHashes[g.savedHashes.length + a] : b = g.savedHashes[a], b }, g.discardedHashes = {}, g.discardedStates = {}, g.discardState = function (a, b, c) {
				var d = g.getHashByState(a), e;
				return e = { discardedState: a, backState: c, forwardState: b }, g.discardedStates[d] = e, !0
			}, g.discardHash = function (a, b, c) { var d = { discardedHash: a, backState: c, forwardState: b }; return g.discardedHashes[a] = d, !0 }, g.discardedState = function (a) { var b = g.getHashByState(a), c; return c = g.discardedStates[b] || !1, c }, g.discardedHash = function (a) { var b = g.discardedHashes[a] || !1; return b }, g.recycleState = function (a) { var b = g.getHashByState(a); return g.discardedState(a) && delete g.discardedStates[b], !0 }, g.emulated.hashChange && (g.hashChangeInit =
				function () {
				g.checkerFunction = null; var b = "", d, e, h, i; return g.isInternetExplorer() ? (d = "historyjs-iframe", e = c.createElement("iframe"), e.setAttribute("id", d), e.style.display = "none", c.body.appendChild(e), e.contentWindow.document.open(), e.contentWindow.document.close(), h = "", i = !1, g.checkerFunction = function () {
					if (i) return !1; i = !0; var c = g.getHash() || "", d = g.unescapeHash(e.contentWindow.document.location.hash) || ""; return c !== b ? (b = c, d !== c && (h = d = c, e.contentWindow.document.open(), e.contentWindow.document.close(),
						e.contentWindow.document.location.hash = g.escapeHash(c)), g.Adapter.trigger(a, "hashchange")) : d !== h && (h = d, g.setHash(d, !1)), i = !1, !0
				}) : g.checkerFunction = function () { var c = g.getHash(); return c !== b && (b = c, g.Adapter.trigger(a, "hashchange")), !0 }, g.intervalList.push(f(g.checkerFunction, g.options.hashChangeInterval)), !0
				}, g.Adapter.onDomLoad(g.hashChangeInit)), g.emulated.pushState && (g.onHashChange = function (b) {
					var d = b && b.newURL || c.location.href, e = g.getHashByUrl(d), f = null, h = null, i = null, j; return g.isLastHash(e) ? (g.busy(!1),
						!1) : (g.doubleCheckComplete(), g.saveHash(e), e && g.isTraditionalAnchor(e) ? (g.Adapter.trigger(a, "anchorchange"), g.busy(!1), !1) : (f = g.extractState(g.getFullUrl(e || c.location.href, !1), !0), g.isLastSavedState(f) ? (g.busy(!1), !1) : (h = g.getHashByState(f), j = g.discardedState(f), j ? (g.getHashByIndex(-2) === g.getHashByState(j.forwardState) ? g.back(!1) : g.forward(!1), !1) : (g.pushState(f.data, f.title, f.url, !1), !0))))
				}, g.Adapter.bind(a, "hashchange", g.onHashChange), g.pushState = function (b, d, e, f) {
					if (g.getHashByUrl(e)) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
					if (f !== !1 && g.busy()) return g.pushQueue({ scope: g, callback: g.pushState, args: arguments, queue: f }), !1; g.busy(!0); var h = g.createStateObject(b, d, e), i = g.getHashByState(h), j = g.getState(!1), k = g.getHashByState(j), l = g.getHash(); return g.storeState(h), g.expectedStateId = h.id, g.recycleState(h), g.setTitle(h), i === k ? (g.busy(!1), !1) : i !== l && i !== g.getShortUrl(c.location.href) ? (g.setHash(i, !1), !1) : (g.saveState(h), g.Adapter.trigger(a, "statechange"), g.busy(!1), !0)
				}, g.replaceState = function (a, b, c, d) {
					if (g.getHashByUrl(c)) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
					if (d !== !1 && g.busy()) return g.pushQueue({ scope: g, callback: g.replaceState, args: arguments, queue: d }), !1; g.busy(!0); var e = g.createStateObject(a, b, c), f = g.getState(!1), h = g.getStateByIndex(-2); return g.discardState(f, e, h), g.pushState(e.data, e.title, e.url, !1), !0
				}), g.emulated.pushState && g.getHash() && !g.emulated.hashChange && g.Adapter.onDomLoad(function () { g.Adapter.trigger(a, "hashchange") })
	}, typeof g.init != "undefined" && g.init()
}(window), function (a, b) {
	var c = a.console || b, d = a.document, e = a.navigator, f = a.sessionStorage ||
		!1, g = a.setTimeout, h = a.clearTimeout, i = a.setInterval, j = a.clearInterval, k = a.JSON, l = a.alert, m = a.History = a.History || {}, n = a.history; k.stringify = k.stringify || k.encode, k.parse = k.parse || k.decode; if (typeof m.init != "undefined") throw new Error("History.js Core has already been loaded..."); m.init = function () { return typeof m.Adapter == "undefined" ? !1 : (typeof m.initCore != "undefined" && m.initCore(), typeof m.initHtml4 != "undefined" && m.initHtml4(), !0) }, m.initCore = function () {
			if (typeof m.initCore.initialized != "undefined") return !1;
			m.initCore.initialized = !0, m.options = m.options || {}, m.options.hashChangeInterval = m.options.hashChangeInterval || 100, m.options.safariPollInterval = m.options.safariPollInterval || 500, m.options.doubleCheckInterval = m.options.doubleCheckInterval || 500, m.options.storeInterval = m.options.storeInterval || 1E3, m.options.busyDelay = m.options.busyDelay || 250, m.options.debug = m.options.debug || !1, m.options.initialTitle = m.options.initialTitle || d.title, m.intervalList = [], m.clearAllIntervals = function () {
				var a, b = m.intervalList;
				if (typeof b != "undefined" && b !== null) { for (a = 0; a < b.length; a++)j(b[a]); m.intervalList = null }
			}, m.debug = function () { (m.options.debug || !1) && m.log.apply(m, arguments) }, m.log = function () {
				var a = typeof c != "undefined" && typeof c.log != "undefined" && typeof c.log.apply != "undefined", b = d.getElementById("log"), e, f, g, h, i; a ? (h = Array.prototype.slice.call(arguments), e = h.shift(), typeof c.debug != "undefined" ? c.debug.apply(c, [e, h]) : c.log.apply(c, [e, h])) : e = "\n" + arguments[0] + "\n"; for (f = 1, g = arguments.length; f < g; ++f) {
					i = arguments[f];
					if (typeof i == "object" && typeof k != "undefined") try { i = k.stringify(i) } catch (j) { } e += "\n" + i + "\n"
				} return b ? (b.value += e + "\n-----\n", b.scrollTop = b.scrollHeight - b.clientHeight) : a || l(e), !0
			}, m.getInternetExplorerMajorVersion = function () {
				var a = m.getInternetExplorerMajorVersion.cached = typeof m.getInternetExplorerMajorVersion.cached != "undefined" ? m.getInternetExplorerMajorVersion.cached : function () {
					var a = 3, b = d.createElement("div"), c = b.getElementsByTagName("i"); while ((b.innerHTML = "\x3c!--[if gt IE " + ++a + "]><i></i><![endif]--\x3e") &&
						c[0]); return a > 4 ? a : !1
				}(); return a
			}, m.isInternetExplorer = function () { var a = m.isInternetExplorer.cached = typeof m.isInternetExplorer.cached != "undefined" ? m.isInternetExplorer.cached : Boolean(m.getInternetExplorerMajorVersion()); return a }, m.emulated = {
				pushState: !Boolean(a.history && a.history.pushState && a.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(e.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(e.userAgent)), hashChange: Boolean(!("onhashchange" in a || "onhashchange" in d) ||
					m.isInternetExplorer() && m.getInternetExplorerMajorVersion() < 8)
			}, m.enabled = !m.emulated.pushState, m.bugs = {
				setHash: Boolean(!m.emulated.pushState && e.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)), safariPoll: Boolean(!m.emulated.pushState && e.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)), ieDoubleCheck: Boolean(m.isInternetExplorer() && m.getInternetExplorerMajorVersion() < 8), hashEscape: Boolean(m.isInternetExplorer() && m.getInternetExplorerMajorVersion() <
					7)
			}, m.isEmptyObject = function (a) { for (var b in a) return !1; return !0 }, m.cloneObject = function (a) { var b, c; return a ? (b = k.stringify(a), c = k.parse(b)) : c = {}, c }, m.getRootUrl = function () { var a = d.location.protocol + "//" + (d.location.hostname || d.location.host); if (d.location.port || !1) a += ":" + d.location.port; return a += "/", a }, m.getBaseHref = function () { var a = d.getElementsByTagName("base"), b = null, c = ""; return a.length === 1 && (b = a[0], c = b.href.replace(/[^\/]+$/, "")), c = c.replace(/\/+$/, ""), c && (c += "/"), c }, m.getBaseUrl = function () {
				var a =
					m.getBaseHref() || m.getBasePageUrl() || m.getRootUrl(); return a
			}, m.getPageUrl = function () { var a = m.getState(!1, !1), b = (a || {}).url || d.location.href, c; return c = b.replace(/\/+$/, "").replace(/[^\/]+$/, function (a, b, c) { return /\./.test(a) ? a : a + "/" }), c }, m.getBasePageUrl = function () { var a = d.location.href.replace(/[#\?].*/, "").replace(/[^\/]+$/, function (a, b, c) { return /[^\/]$/.test(a) ? "" : a }).replace(/\/+$/, "") + "/"; return a }, m.getFullUrl = function (a, b) {
				var c = a, d = a.substring(0, 1); return b = typeof b == "undefined" ? !0 : b, /[a-z]+\:\/\//.test(a) ||
					(d === "/" ? c = m.getRootUrl() + a.replace(/^\/+/, "") : d === "#" ? c = m.getPageUrl().replace(/#.*/, "") + a : d === "?" ? c = m.getPageUrl().replace(/[\?#].*/, "") + a : b ? c = m.getBaseUrl() + a.replace(/^(\.\/)+/, "") : c = m.getBasePageUrl() + a.replace(/^(\.\/)+/, "")), c.replace(/\#$/, "")
			}, m.getShortUrl = function (a) { var b = a, c = m.getBaseUrl(), d = m.getRootUrl(); return m.emulated.pushState && (b = b.replace(c, "")), b = b.replace(d, "/"), m.isTraditionalAnchor(b) && (b = "./" + b), b = b.replace(/^(\.\/)+/g, "./").replace(/\#$/, ""), b }, m.store = {}, m.idToState = m.idToState ||
			{}, m.stateToId = m.stateToId || {}, m.urlToId = m.urlToId || {}, m.storedStates = m.storedStates || [], m.savedStates = m.savedStates || [], m.normalizeStore = function () { m.store.idToState = m.store.idToState || {}, m.store.urlToId = m.store.urlToId || {}, m.store.stateToId = m.store.stateToId || {} }, m.getState = function (a, b) { typeof a == "undefined" && (a = !0), typeof b == "undefined" && (b = !0); var c = m.getLastSavedState(); return !c && b && (c = m.createStateObject()), a && (c = m.cloneObject(c), c.url = c.cleanUrl || c.url), c }, m.getIdByState = function (a) {
				var b =
					m.extractId(a.url), c; if (!b) { c = m.getStateString(a); if (typeof m.stateToId[c] != "undefined") b = m.stateToId[c]; else if (typeof m.store.stateToId[c] != "undefined") b = m.store.stateToId[c]; else { for (; ;) { b = (new Date).getTime() + String(Math.random()).replace(/\D/g, ""); if (typeof m.idToState[b] == "undefined" && typeof m.store.idToState[b] == "undefined") break } m.stateToId[c] = b, m.idToState[b] = a } } return b
			}, m.normalizeState = function (a) {
				var b, c; if (!a || typeof a != "object") a = {}; if (typeof a.normalized != "undefined") return a; if (!a.data ||
					typeof a.data != "object") a.data = {}; b = {}, b.normalized = !0, b.title = a.title || "", b.url = m.getFullUrl(m.unescapeString(a.url || d.location.href)), b.hash = m.getShortUrl(b.url), b.data = m.cloneObject(a.data), b.id = m.getIdByState(b), b.cleanUrl = b.url.replace(/\??\&_suid.*/, ""), b.url = b.cleanUrl, c = !m.isEmptyObject(b.data); if (b.title || c) b.hash = m.getShortUrl(b.url).replace(/\??\&_suid.*/, ""), /\?/.test(b.hash) || (b.hash += "?"), b.hash += "&_suid=" + b.id; return b.hashedUrl = m.getFullUrl(b.hash), (m.emulated.pushState || m.bugs.safariPoll) &&
						m.hasUrlDuplicate(b) && (b.url = b.hashedUrl), b
			}, m.createStateObject = function (a, b, c) { var d = { data: a, title: b, url: c }; return d = m.normalizeState(d), d }, m.getStateById = function (a) { a = String(a); var c = m.idToState[a] || m.store.idToState[a] || b; return c }, m.getStateString = function (a) { var b, c, d; return b = m.normalizeState(a), c = { data: b.data, title: a.title, url: a.url }, d = k.stringify(c), d }, m.getStateId = function (a) { var b, c; return b = m.normalizeState(a), c = b.id, c }, m.getHashByState = function (a) {
				var b, c; return b = m.normalizeState(a),
					c = b.hash, c
			}, m.extractId = function (a) { var b, c, d; return c = /(.*)\&_suid=([0-9]+)$/.exec(a), d = c ? c[1] || a : a, b = c ? String(c[2] || "") : "", b || !1 }, m.isTraditionalAnchor = function (a) { var b = !/[\/\?\.]/.test(a); return b }, m.extractState = function (a, b) { var c = null, d, e; return b = b || !1, d = m.extractId(a), d && (c = m.getStateById(d)), c || (e = m.getFullUrl(a), d = m.getIdByUrl(e) || !1, d && (c = m.getStateById(d)), !c && b && !m.isTraditionalAnchor(a) && (c = m.createStateObject(null, null, e))), c }, m.getIdByUrl = function (a) {
				var c = m.urlToId[a] || m.store.urlToId[a] ||
					b; return c
			}, m.getLastSavedState = function () { return m.savedStates[m.savedStates.length - 1] || b }, m.getLastStoredState = function () { return m.storedStates[m.storedStates.length - 1] || b }, m.hasUrlDuplicate = function (a) { var b = !1, c; return c = m.extractState(a.url), b = c && c.id !== a.id, b }, m.storeState = function (a) { return m.urlToId[a.url] = a.id, m.storedStates.push(m.cloneObject(a)), a }, m.isLastSavedState = function (a) { var b = !1, c, d, e; return m.savedStates.length && (c = a.id, d = m.getLastSavedState(), e = d.id, b = c === e), b }, m.saveState = function (a) {
				return m.isLastSavedState(a) ?
					!1 : (m.savedStates.push(m.cloneObject(a)), !0)
			}, m.getStateByIndex = function (a) { var b = null; return typeof a == "undefined" ? b = m.savedStates[m.savedStates.length - 1] : a < 0 ? b = m.savedStates[m.savedStates.length + a] : b = m.savedStates[a], b }, m.getHash = function () { var a = m.unescapeHash(d.location.hash); return a }, m.unescapeString = function (b) { var c = b, d; for (; ;) { d = a.unescape(c); if (d === c) break; c = d } return c }, m.unescapeHash = function (a) { var b = m.normalizeHash(a); return b = m.unescapeString(b), b }, m.normalizeHash = function (a) {
				var b =
					a.replace(/[^#]*#/, "").replace(/#.*/, ""); return b
			}, m.setHash = function (a, b) { var c, e, f; return b !== !1 && m.busy() ? (m.pushQueue({ scope: m, callback: m.setHash, args: arguments, queue: b }), !1) : (c = m.escapeHash(a), m.busy(!0), e = m.extractState(a, !0), e && !m.emulated.pushState ? m.pushState(e.data, e.title, e.url, !1) : d.location.hash !== c && (m.bugs.setHash ? (f = m.getPageUrl(), m.pushState(null, null, f + "#" + c, !1)) : d.location.hash = c), m) }, m.escapeHash = function (b) {
				var c = m.normalizeHash(b); return c = a.escape(c), m.bugs.hashEscape || (c = c.replace(/\%21/g,
					"!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?")), c
			}, m.getHashByUrl = function (a) { var b = String(a).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2"); return b = m.unescapeHash(b), b }, m.setTitle = function (a) { var b = a.title, c; b || (c = m.getStateByIndex(0), c && c.url === a.url && (b = c.title || m.options.initialTitle)); try { d.getElementsByTagName("title")[0].innerHTML = b.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ") } catch (e) { } return d.title = b, m }, m.queues = [], m.busy = function (a) {
			typeof a != "undefined" ?
				m.busy.flag = a : typeof m.busy.flag == "undefined" && (m.busy.flag = !1); if (!m.busy.flag) { h(m.busy.timeout); var b = function () { var a, c, d; if (m.busy.flag) return; for (a = m.queues.length - 1; a >= 0; --a) { c = m.queues[a]; if (c.length === 0) continue; d = c.shift(), m.fireQueueItem(d), m.busy.timeout = g(b, m.options.busyDelay) } }; m.busy.timeout = g(b, m.options.busyDelay) } return m.busy.flag
			}, m.busy.flag = !1, m.fireQueueItem = function (a) { return a.callback.apply(a.scope || m, a.args || []) }, m.pushQueue = function (a) {
				return m.queues[a.queue || 0] = m.queues[a.queue ||
					0] || [], m.queues[a.queue || 0].push(a), m
			}, m.queue = function (a, b) { return typeof a == "function" && (a = { callback: a }), typeof b != "undefined" && (a.queue = b), m.busy() ? m.pushQueue(a) : m.fireQueueItem(a), m }, m.clearQueue = function () { return m.busy.flag = !1, m.queues = [], m }, m.stateChanged = !1, m.doubleChecker = !1, m.doubleCheckComplete = function () { return m.stateChanged = !0, m.doubleCheckClear(), m }, m.doubleCheckClear = function () { return m.doubleChecker && (h(m.doubleChecker), m.doubleChecker = !1), m }, m.doubleCheck = function (a) {
				return m.stateChanged =
					!1, m.doubleCheckClear(), m.bugs.ieDoubleCheck && (m.doubleChecker = g(function () { return m.doubleCheckClear(), m.stateChanged || a(), !0 }, m.options.doubleCheckInterval)), m
			}, m.safariStatePoll = function () { var b = m.extractState(d.location.href), c; if (!m.isLastSavedState(b)) c = b; else return; return c || (c = m.createStateObject()), m.Adapter.trigger(a, "popstate"), m }, m.back = function (a) {
				return a !== !1 && m.busy() ? (m.pushQueue({ scope: m, callback: m.back, args: arguments, queue: a }), !1) : (m.busy(!0), m.doubleCheck(function () { m.back(!1) }),
					n.go(-1), !0)
			}, m.forward = function (a) { return a !== !1 && m.busy() ? (m.pushQueue({ scope: m, callback: m.forward, args: arguments, queue: a }), !1) : (m.busy(!0), m.doubleCheck(function () { m.forward(!1) }), n.go(1), !0) }, m.go = function (a, b) { var c; if (a > 0) for (c = 1; c <= a; ++c)m.forward(b); else { if (!(a < 0)) throw new Error("History.go: History.go requires a positive or negative integer passed."); for (c = -1; c >= a; --c)m.back(b) } return m }; if (m.emulated.pushState) {
				var o = function () { }; m.pushState = m.pushState || o, m.replaceState = m.replaceState ||
					o
			} else m.onPopState = function (b, c) {
				var e = !1, f = !1, g, h; return m.doubleCheckComplete(), g = m.getHash(), g ? (h = m.extractState(g || d.location.href, !0), h ? m.replaceState(h.data, h.title, h.url, !1) : (m.Adapter.trigger(a, "anchorchange"), m.busy(!1)), m.expectedStateId = !1, !1) : (e = m.Adapter.extractEventData("state", b, c) || !1, e ? f = m.getStateById(e) : m.expectedStateId ? f = m.getStateById(m.expectedStateId) : f = m.extractState(d.location.href), f || (f = m.createStateObject(null, null, d.location.href)), m.expectedStateId = !1, m.isLastSavedState(f) ?
					(m.busy(!1), !1) : (m.storeState(f), m.saveState(f), m.setTitle(f), m.Adapter.trigger(a, "statechange"), m.busy(!1), !0))
			}, m.Adapter.bind(a, "popstate", m.onPopState), m.pushState = function (b, c, d, e) {
				if (m.getHashByUrl(d) && m.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors)."); if (e !== !1 && m.busy()) return m.pushQueue({ scope: m, callback: m.pushState, args: arguments, queue: e }), !1; m.busy(!0); var f = m.createStateObject(b, c, d); return m.isLastSavedState(f) ? m.busy(!1) :
					(m.storeState(f), m.expectedStateId = f.id, n.pushState(f.id, f.title, f.url), m.Adapter.trigger(a, "popstate")), !0
			}, m.replaceState = function (b, c, d, e) {
				if (m.getHashByUrl(d) && m.emulated.pushState) throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors)."); if (e !== !1 && m.busy()) return m.pushQueue({ scope: m, callback: m.replaceState, args: arguments, queue: e }), !1; m.busy(!0); var f = m.createStateObject(b, c, d); return m.isLastSavedState(f) ? m.busy(!1) : (m.storeState(f), m.expectedStateId =
					f.id, n.replaceState(f.id, f.title, f.url), m.Adapter.trigger(a, "popstate")), !0
			}; if (f) { try { m.store = k.parse(f.getItem("History.store")) || {} } catch (p) { m.store = {} } m.normalizeStore() } else m.store = {}, m.normalizeStore(); m.Adapter.bind(a, "beforeunload", m.clearAllIntervals), m.Adapter.bind(a, "unload", m.clearAllIntervals), m.saveState(m.storeState(m.extractState(d.location.href, !0))), f && (m.onUnload = function () {
				var a, b; try { a = k.parse(f.getItem("History.store")) || {} } catch (c) { a = {} } a.idToState = a.idToState || {}, a.urlToId =
					a.urlToId || {}, a.stateToId = a.stateToId || {}; for (b in m.idToState) { if (!m.idToState.hasOwnProperty(b)) continue; a.idToState[b] = m.idToState[b] } for (b in m.urlToId) { if (!m.urlToId.hasOwnProperty(b)) continue; a.urlToId[b] = m.urlToId[b] } for (b in m.stateToId) { if (!m.stateToId.hasOwnProperty(b)) continue; a.stateToId[b] = m.stateToId[b] } m.store = a, m.normalizeStore(), f.setItem("History.store", k.stringify(a))
			}, m.intervalList.push(i(m.onUnload, m.options.storeInterval)), m.Adapter.bind(a, "beforeunload", m.onUnload), m.Adapter.bind(a,
				"unload", m.onUnload)); if (!m.emulated.pushState) { m.bugs.safariPoll && m.intervalList.push(i(m.safariStatePoll, m.options.safariPollInterval)); if (e.vendor === "Apple Computer, Inc." || (e.appCodeName || "") === "Mozilla") m.Adapter.bind(a, "hashchange", function () { m.Adapter.trigger(a, "popstate") }), m.getHash() && m.Adapter.onDomLoad(function () { m.Adapter.trigger(a, "hashchange") }) }
		}, m.init()
}(window);

// Core.string.js

String.prototype.trim = String.prototype.trim || function () { return this.replace(/^\s+|\s+$/g, "") }; String.prototype.strip = String.prototype.strip || function (value, regex) { value = String(value); var str = this; if (value.length) { if (!(regex || false)) value = value.replace(/([\[\]\(\)\^\$\.\?\|\/\\])/g, "\\$1"); str = str.replace(eval("/^" + value + "+|" + value + "+$/g"), "") } return String(str) };
String.prototype.stripLeft = String.prototype.stripLeft || function (value, regex) { value = String(value); var str = this; if (value.length) { if (!(regex || false)) value = value.replace(/([\[\]\(\)\^\$\.\?\|\/\\])/g, "\\$1"); str = str.replace(eval("/^" + value + "+/g"), "") } return String(str) };
String.prototype.stripRight = String.prototype.stripRight || function (value, regex) { value = String(value); var str = this; if (value.length) { if (!(regex || false)) value = value.replace(/([\[\]\(\)\^\$\.\?\|\/\\])/g, "\\$1"); str = str.replace(eval("/" + value + "+$/g"), "") } return String(str) }; String.prototype.toInt = String.prototype.toInt || function () { return parseInt(this, 10) }; String.prototype.wrap = String.prototype.wrap || function (start, end) { return start + this + end };
String.prototype.wrapSelection = String.prototype.wrapSelection || function (start, end, a, z) { if (typeof a === "undefined" || a === null) a = this.length; if (typeof z === "undefined" || z === null) z = this.length; return this.substring(0, a) + start + this.substring(a, z) + end + this.substring(z) }; String.prototype.toSlug = String.prototype.toSlug || function () { return this.toLowerCase().replace(/[\s_]/g, "-").replace(/[^-a-z0-9]/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") };
String.prototype.queryStringToJSON = String.prototype.queryStringToJSON || function () {
	var params = String(this); params = params.substring(params.indexOf("?") + 1); params = params.replace(/\+/g, "%20"); if (params.substring(0, 1) === "{" && params.substring(params.length - 1) === "}") return eval(decodeURIComponent(params)); params = params.split(/\&(amp\;)?/); var json = {}; for (var i = 0, n = params.length; i < n; ++i) {
		var param = params[i] || null; if (param === null) continue; param = param.split("="); if (param === null) continue; var key = param[0] || null;
		if (key === null) continue; if (typeof param[1] === "undefined") continue; var value = param[1]; key = decodeURIComponent(key); value = decodeURIComponent(value); try { value = eval(value) } catch (e) { } var keys = key.split("."); if (keys.length === 1) json[key] = value; else {
			var path = "", cmd = ""; $.each(keys, function (ii, key) { path += '["' + key.replace(/"/g, '\\"') + '"]'; jsonCLOSUREGLOBAL = json; cmd = "if ( typeof jsonCLOSUREGLOBAL" + path + ' === "undefined" ) jsonCLOSUREGLOBAL' + path + " = {}"; eval(cmd); json = jsonCLOSUREGLOBAL; delete jsonCLOSUREGLOBAL });
			jsonCLOSUREGLOBAL = json; valueCLOSUREGLOBAL = value; cmd = "jsonCLOSUREGLOBAL" + path + " = valueCLOSUREGLOBAL"; eval(cmd); json = jsonCLOSUREGLOBAL; delete jsonCLOSUREGLOBAL; delete valueCLOSUREGLOBAL
		}
	} return json
};

// jQuery Easing

jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
	def: "easeOutQuad", swing: function (x, t, b, c, d) { return jQuery.easing[jQuery.easing.def](x, t, b, c, d) }, easeInQuad: function (x, t, b, c, d) { return c * (t /= d) * t + b }, easeOutQuad: function (x, t, b, c, d) { return -c * (t /= d) * (t - 2) + b }, easeInOutQuad: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t + b; return -c / 2 * (--t * (t - 2) - 1) + b }, easeInCubic: function (x, t, b, c, d) { return c * (t /= d) * t * t + b }, easeOutCubic: function (x, t, b, c, d) { return c * ((t = t / d - 1) * t * t + 1) + b }, easeInOutCubic: function (x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c /
			2 * t * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b
	}, easeInQuart: function (x, t, b, c, d) { return c * (t /= d) * t * t * t + b }, easeOutQuart: function (x, t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b }, easeInOutQuart: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b; return -c / 2 * ((t -= 2) * t * t * t - 2) + b }, easeInQuint: function (x, t, b, c, d) { return c * (t /= d) * t * t * t * t + b }, easeOutQuint: function (x, t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b }, easeInOutQuint: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b; return c / 2 * ((t -= 2) * t * t * t * t + 2) + b }, easeInSine: function (x,
		t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b }, easeOutSine: function (x, t, b, c, d) { return c * Math.sin(t / d * (Math.PI / 2)) + b }, easeInOutSine: function (x, t, b, c, d) { return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b }, easeInExpo: function (x, t, b, c, d) { return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b }, easeOutExpo: function (x, t, b, c, d) { return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b }, easeInOutExpo: function (x, t, b, c, d) { if (t == 0) return b; if (t == d) return b + c; if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b; return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b },
	easeInCirc: function (x, t, b, c, d) { return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b }, easeOutCirc: function (x, t, b, c, d) { return c * Math.sqrt(1 - (t = t / d - 1) * t) + b }, easeInOutCirc: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b }, easeInElastic: function (x, t, b, c, d) {
		var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3; if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a); return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 *
			Math.PI) / p)) + b
	}, easeOutElastic: function (x, t, b, c, d) { var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3; if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a); return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b }, easeInOutElastic: function (x, t, b, c, d) {
		var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5); if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a); if (t < 1) return -.5 * (a * Math.pow(2,
			10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
	}, easeInBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; return c * (t /= d) * t * ((s + 1) * t - s) + b }, easeOutBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b }, easeInOutBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b; return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b }, easeInBounce: function (x, t, b,
		c, d) { return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b }, easeOutBounce: function (x, t, b, c, d) { if ((t /= d) < 1 / 2.75) return c * (7.5625 * t * t) + b; else if (t < 2 / 2.75) return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b; else if (t < 2.5 / 2.75) return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b; else return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b }, easeInOutBounce: function (x, t, b, c, d) { if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b; return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b }
});

// Shuffle js

window.Modernizr = function (a, b, c) {
	function z(a) { j.cssText = a } function A(a, b) { return z(m.join(a + ";") + (b || "")) } function B(a, b) { return typeof a === b } function C(a, b) { return !!~("" + a).indexOf(b) } function D(a, b) { for (var d in a) { var e = a[d]; if (!C(e, "-") && j[e] !== c) return b == "pfx" ? e : !0 } return !1 } function E(a, b, d) { for (var e in a) { var f = b[a[e]]; if (f !== c) return d === !1 ? a[e] : B(f, "function") ? f.bind(d || b) : f } return !1 } function F(a, b, c) {
		var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + o.join(d + " ") + d).split(" "); return B(b,
			"string") || B(b, "undefined") ? D(e, b) : (e = (a + " " + p.join(d + " ") + d).split(" "), E(e, b, c))
	} var d = "2.6.2", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k, l = {}.toString, m = " -webkit- -moz- -o- -ms- ".split(" "), n = "Webkit Moz O ms", o = n.split(" "), p = n.toLowerCase().split(" "), q = {}, r = {}, s = {}, t = [], u = t.slice, v, w = function (a, c, d, e) {
		var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body"); if (parseInt(d, 10)) while (d--) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
		return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i
	}, x = {}.hasOwnProperty, y; !B(x, "undefined") && !B(x.call, "undefined") ? y = function (a, b) { return x.call(a, b) } : y = function (a, b) { return b in a && B(a.constructor.prototype[b], "undefined") }, Function.prototype.bind ||
		(Function.prototype.bind = function (b) { var c = this; if (typeof c != "function") throw new TypeError; var d = u.call(arguments, 1), e = function () { if (this instanceof e) { var a = function () { }; a.prototype = c.prototype; var f = new a, g = c.apply(f, d.concat(u.call(arguments))); return Object(g) === g ? g : f } return c.apply(b, d.concat(u.call(arguments))) }; return e }), q.csstransforms = function () { return !!F("transform") }, q.csstransforms3d = function () {
			var a = !!F("perspective"); return a && "webkitPerspective" in g.style && w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",
				function (b, c) { a = b.offsetLeft === 9 && b.offsetHeight === 3 }), a
		}, q.csstransitions = function () { return F("transition") }; for (var G in q) y(q, G) && (v = G.toLowerCase(), e[v] = q[G](), t.push((e[v] ? "" : "no-") + v)); return e.addTest = function (a, b) { if (typeof a == "object") for (var d in a) y(a, d) && e.addTest(d, a[d]); else { a = a.toLowerCase(); if (e[a] !== c) return e; b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b } return e }, z(""), i = k = null, e._version = d, e._prefixes = m, e._domPrefixes = p, e._cssomPrefixes =
			o, e.testProp = function (a) { return D([a]) }, e.testAllProps = F, e.testStyles = w, e.prefixed = function (a, b, c) { return b ? F(a, b, c) : F(a, "pfx") }, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + t.join(" ") : ""), e
}(this, this.document);
(function (b, c) { var $ = b.jQuery || b.Cowboy || (b.Cowboy = {}), a; $.throttle = a = function (e, f, j, i) { var h, d = 0; if (typeof f !== "boolean") { i = j; j = f; f = c } function g() { var o = this, m = +new Date - d, n = arguments; function l() { d = +new Date; j.apply(o, n) } function k() { h = c } if (i && !h) l(); h && clearTimeout(h); if (i === c && m > e) l(); else if (f !== true) h = setTimeout(i ? k : l, i === c ? e - m : e) } if ($.guid) g.guid = j.guid = j.guid || $.guid++; return g }; $.debounce = function (d, e, f) { return f === c ? a(d, e, false) : a(d, f, e !== false) } })(this);
!function (t, e, i) {
	t.fn.sorted = function (e) { var n = t.extend({}, t.fn.sorted.defaults, e), s = this.get(), r = !1; return s.length ? n.randomize ? t.fn.sorted.randomize(s) : (n.by !== t.noop && null !== n.by && n.by !== i && s.sort(function (e, s) { if (r) return 0; var o = n.by(t(e)), a = n.by(t(s)); return o === i && a === i ? (r = !0, 0) : "sortFirst" === o || "sortLast" === a ? -1 : "sortLast" === o || "sortFirst" === a ? 1 : a > o ? -1 : o > a ? 1 : 0 }), r ? this.get() : (n.reverse && s.reverse(), s)) : [] }, t.fn.sorted.defaults = { reverse: !1, by: null, randomize: !1 }, t.fn.sorted.randomize = function (t) {
		var e,
		i, n = t.length; if (!n) return t; for (; --n;)i = Math.floor(Math.random() * (n + 1)), e = t[i], t[i] = t[n], t[n] = e; return t
	}; var n = 0, s = function (e, i) { var r = this; t.extend(r, s.options, i, s.settings), r.$container = e, r.$window = t(window), r.unique = "shuffle_" + n++ , r._fire("loading"), r._init(), r._fire("done") }; s.prototype = {
		_init: function () {
			var e, i = this, n = t.proxy(i._onResize, i), s = i.throttle ? i.throttle(i.throttleTime, n) : n, r = i.initialSort ? i.initialSort : null; i._setVars(), i._resetCols(), i._addClasses(), i._initItems(), i.$window.on("resize.shuffle." +
				i.unique, s), e = i.$container.css(["paddingLeft", "paddingRight", "position", "width"]), "static" === e.position && i.$container.css("position", "relative"), i.offset = { left: parseInt(e.paddingLeft, 10) || 0, top: parseInt(e.paddingTop, 10) || 0 }, i._setColumns(parseInt(e.width, 10)), i.shuffle(i.group, r), i.supported && setTimeout(function () { i._setTransitions(), i.$container[0].style[i.transitionName] = "height " + i.speed + "ms " + i.easing }, 0)
		}, _addClasses: function () {
			var t = this; return t.$container.addClass("shuffle"), t.$items.addClass("shuffle-item filtered"),
				t
		}, _setVars: function () {
			var e = this; return e.$items = e._getItems(), e.transitionName = e.prefixed("transition"), e.transitionDelayName = e.prefixed("transitionDelay"), e.transitionDuration = e.prefixed("transitionDuration"), e.transform = e.getPrefixed("transform"), e.transitionend = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd", msTransition: "MSTransitionEnd", transition: "transitionend" }[e.transitionName], e.isFluid = e.columnWidth && "function" == typeof e.columnWidth,
				0 === e.columnWidth && null !== e.sizer && (e.columnWidth = e.sizer), "string" == typeof e.columnWidth ? e.$sizer = e.$container.find(e.columnWidth) : e.columnWidth && e.columnWidth.nodeType && 1 === e.columnWidth.nodeType ? e.$sizer = t(e.columnWidth) : e.columnWidth && e.columnWidth.jquery && (e.$sizer = e.columnWidth), e.$sizer && e.$sizer.length && (e.useSizer = !0, e.sizer = e.$sizer[0]), e
		}, _filter: function (e, n) {
			var s = this, r = n !== i, o = r ? n : s.$items, a = t(); return e = e || s.lastFilter, s._fire("filter"), t.isFunction(e) ? o.each(function () {
				var i = t(this),
				n = e.call(i[0], i, s); n && (a = a.add(i))
			}) : (s.group = e, "all" !== e ? o.each(function () { var i = t(this), n = i.data("groups"), r = s.delimeter && !t.isArray(n) ? n.split(s.delimeter) : n, o = t.inArray(e, r) > -1; o && (a = a.add(i)) }) : a = o), s._toggleFilterClasses(o, a), o = null, n = null, a
		}, _toggleFilterClasses: function (e, i) {
			var n = "concealed", s = "filtered"; e.filter(i).each(function () { var e = t(this); e.hasClass(n) && e.removeClass(n), e.hasClass(s) || e.addClass(s) }), e.not(i).each(function () {
				var e = t(this); e.hasClass(n) || e.addClass(n), e.hasClass(s) &&
					e.removeClass(s)
			})
		}, _initItems: function (t) { return t = t || this.$items, t.css(this.itemCss) }, _updateItemCount: function () { return this.visibleItems = this.$items.filter(".filtered").length, this }, _setTransition: function (t) { var e = this; return t.style[e.transitionName] = e.transform + " " + e.speed + "ms " + e.easing + ", opacity " + e.speed + "ms " + e.easing, t }, _setTransitions: function (t) { var e = this; return t = t || e.$items, t.each(function () { e._setTransition(this) }), e }, _setSequentialDelay: function (e) {
			var i = this; i.supported && t.each(e,
				function (e) { this.style[i.transitionDelayName] = "0ms," + (e + 1) * i.sequentialFadeDelay + "ms", t(this).one(i.transitionend, function () { this.style[i.transitionDelayName] = "0ms" }) })
		}, _getItems: function () { return this.$container.children(this.itemSelector) }, _getPreciseDimension: function (e, i) { var n; return n = window.getComputedStyle ? window.getComputedStyle(e, null)[i] : t(e).css(i), parseFloat(n) }, _setColumns: function (t) {
			var e, i = this, n = t || i.$container.width(), s = "function" == typeof i.gutterWidth ? i.gutterWidth(n) : i.useSizer ?
				i._getPreciseDimension(i.sizer, "marginLeft") : i.gutterWidth; i.colWidth = i.isFluid ? i.columnWidth(n) : i.useSizer ? i._getPreciseDimension(i.sizer, "width") : i.columnWidth || i.$items.outerWidth(!0) || n, i.colWidth = i.colWidth || n, i.colWidth += s, e = (n + s) / i.colWidth, Math.ceil(e) - e < .01 && (e = Math.ceil(e)), i.cols = Math.floor(e), i.cols = Math.max(i.cols, 1), i.containerWidth = n
		}, _setContainerSize: function () { var t = this, e = Math.max.apply(Math, t.colYs); t.$container.css("height", e + "px") }, _fire: function (t, e) {
			this.$container.trigger(t +
				".shuffle", e && e.length ? e : [this])
		}, _layout: function (e, i, n, s) { var r = this; i = i || r.filterEnd, r.layoutTransitionEnded = !1, t.each(e, function (o) { var a = t(e[o]), l = Math.ceil(a.outerWidth(!0) / r.colWidth); if (l = Math.min(l, r.cols), 1 === l) r._placeItem(a, r.colYs, i, n, s); else { var u, d, c = r.cols + 1 - l, f = []; for (d = 0; c > d; d++)u = r.colYs.slice(d, d + l), f[d] = Math.max.apply(Math, u); r._placeItem(a, f, i, n, s) } }), r._processStyleQueue(), r._setContainerSize() }, _resetCols: function () { var t = this.cols; for (this.colYs = []; t--;)this.colYs.push(0) },
		_reLayout: function (t, e) { var i = this; t = t || i.filterEnd, i._resetCols(), i.keepSorted && i.lastSort ? i.sort(i.lastSort, !0, e) : i._layout(i.$items.filter(".filtered").get(), i.filterEnd, e) }, _placeItem: function (t, e, i, n, s) {
			for (var r = this, o = Math.min.apply(Math, e), a = 0, l = 0, u = e.length; u > l; l++)if (e[l] >= o - r.buffer && e[l] <= o + r.buffer) { a = l; break } var d = r.colWidth * a, c = o; d = Math.round(d + r.offset.left), c = Math.round(c + r.offset.top), t.data({ x: d, y: c }); var f = o + t.outerHeight(!0), h = r.cols + 1 - u; for (l = 0; h > l; l++)r.colYs[a + l] = f; var p = {
				from: "layout",
				$this: t, x: d, y: c, scale: 1
			}; n ? p.skipTransition = !0 : (p.opacity = 1, p.callback = i), s && (p.opacity = 0), r.styleQueue.push(p)
		}, _shrink: function (e, i) { var n = this, s = e || n.$items.filter(".concealed"), r = {}, o = i || n.shrinkEnd; s.length && (n._fire("shrink"), n.shrinkTransitionEnded = !1, s.each(function () { var e = t(this), i = e.data(); r = { from: "shrink", $this: e, x: i.x, y: i.y, scale: .001, opacity: 0, callback: o }, n.styleQueue.push(r) })) }, _onResize: function () {
			var t, e = this; e.enabled && !e.destroyed && (t = e.$container.width(), t !== e.containerWidth &&
				e.resized())
		}, setPrefixedCss: function (t, e, i) { t.css(this.prefixed(e), i) }, getPrefixed: function (t) { var e = this.prefixed(t); return e ? e.replace(/([A-Z])/g, function (t, e) { return "-" + e.toLowerCase() }).replace(/^ms-/, "-ms-") : e }, transition: function (e) {
			var n, s = this, r = function () { s.layoutTransitionEnded || "layout" !== e.from ? s.shrinkTransitionEnded || "shrink" !== e.from || (e.callback.call(s), s.shrinkTransitionEnded = !0) : (s._fire("layout"), e.callback.call(s), s.layoutTransitionEnded = !0) }; if (e.callback = e.callback || t.noop,
				s.supported) e.scale === i && (e.scale = 1), n = s.threeD ? "translate3d(" + e.x + "px, " + e.y + "px, 0) scale3d(" + e.scale + ", " + e.scale + ", 1)" : "translate(" + e.x + "px, " + e.y + "px) scale(" + e.scale + ", " + e.scale + ")", e.x !== i && s.setPrefixedCss(e.$this, "transform", n), e.opacity !== i && e.$this.css("opacity", e.opacity), e.$this.one(s.transitionend, r); else { var o = { left: e.x, top: e.y, opacity: e.opacity }; e.$this.stop(!0).animate(o, s.speed, "swing", r) }
		}, _processStyleQueue: function () {
			var e = this, i = e.styleQueue; t.each(i, function (t, i) {
				i.skipTransition ?
				e._skipTransition(i.$this[0], function () { e.transition(i) }) : e.transition(i)
			}), e.styleQueue.length = 0
		}, shrinkEnd: function () { this._fire("shrunk") }, filterEnd: function () { this._fire("filtered") }, sortEnd: function () { this._fire("sorted") }, _skipTransition: function (e, i, n) { var s, r = this, o = r.transitionDuration, a = e.style[o]; e.style[o] = "0ms", t.isFunction(i) ? i() : e.style[i] = n, s = e.offsetWidth, e.style[o] = a }, _addItems: function (t, e, n) {
			var s, r, o = this; o.supported || (e = !1), t.addClass("shuffle-item"), o._initItems(t), o._setTransitions(t),
				o.$items = o._getItems(), t.css("opacity", 0), s = o._filter(i, t), r = s.get(), o._updateItemCount(), e ? (o._layout(r, null, !0, !0), n && o._setSequentialDelay(s), o._revealAppended(s)) : o._layout(r)
		}, _revealAppended: function (e) { var i = this; setTimeout(function () { e.each(function (e, n) { i.transition({ from: "reveal", $this: t(n), opacity: 1 }) }) }, i.revealAppendedDelay) }, shuffle: function (t, e) { var i = this; i.enabled && (t || (t = "all"), i._filter(t), i.lastFilter = t, i._updateItemCount(), i._resetCols(), i._shrink(), e && (i.lastSort = e), i._reLayout()) },
		sort: function (t, e, i) { var n = this, s = n.$items.filter(".filtered").sorted(t); e || n._resetCols(), n._layout(s, function () { e && n.filterEnd(), n.sortEnd() }, i), n.lastSort = t }, resized: function (t) { this.enabled && (t || this._setColumns(), this._reLayout()) }, layout: function () { this.update(!0) }, update: function (t) { this.resized(t) }, appended: function (t, e, i) { e = e === !1 ? !1 : !0, i = i === !1 ? !1 : !0, this._addItems(t, e, i) }, disable: function () { this.enabled = !1 }, enable: function (t) { this.enabled = !0, t !== !1 && this.update() }, remove: function (t) {
			if (t.length &&
				t.jquery) { var e = this; return e._shrink(t, function () { var e = this; t.remove(), setTimeout(function () { e.$items = e._getItems(), e.layout(), e._updateItemCount(), e._fire("removed", [t, e]), t = null }, 0) }), e._processStyleQueue(), e }
		}, destroy: function () { var t = this; t.$window.off("." + t.unique), t.$container.removeClass("shuffle").removeAttr("style").removeData("shuffle"), t.$items.removeAttr("style").removeClass("concealed filtered shuffle-item"), t.destroyed = !0 }
	}, s.options = {
		group: "all", speed: 250, easing: "ease-out", itemSelector: "",
		sizer: null, gutterWidth: 0, columnWidth: 0, delimeter: null, buffer: 0, initialSort: null, throttle: t.throttle || null, throttleTime: 300, sequentialFadeDelay: 150, supported: e.csstransforms && e.csstransitions
	}, s.settings = { $sizer: null, useSizer: !1, itemCss: { position: "absolute", top: 0, left: 0 }, offset: { top: 0, left: 0 }, revealAppendedDelay: 300, keepSorted: !0, enabled: !0, destroyed: !1, styleQueue: [], prefixed: e.prefixed, threeD: e.csstransforms3d }, t.fn.shuffle = function (e) {
		var i = Array.prototype.slice.call(arguments, 1); return this.each(function () {
			var n =
				t(this), r = n.data("shuffle"); r || (r = new s(n, e), n.data("shuffle", r)), "string" == typeof e && r[e] && r[e].apply(r, i)
		})
	}
}(jQuery, Modernizr);

// Magnific popup

(function (e) {
	var t, n, i, o, r, a, s, l = "Close", c = "BeforeClose", d = "AfterClose", u = "BeforeAppend", p = "MarkupParse", f = "Open", m = "Change", g = "mfp", h = "." + g, v = "mfp-ready", C = "mfp-removing", y = "mfp-prevent-close", w = function () { }, b = !!window.jQuery, I = e(window), x = function (e, n) { t.ev.on(g + e + h, n) }, k = function (t, n, i, o) { var r = document.createElement("div"); return r.className = "mfp-" + t, i && (r.innerHTML = i), o ? n && n.appendChild(r) : (r = e(r), n && r.appendTo(n)), r }, T = function (n, i) {
		t.ev.triggerHandler(g + n, i), t.st.callbacks && (n = n.charAt(0).toLowerCase() +
			n.slice(1), t.st.callbacks[n] && t.st.callbacks[n].apply(t, e.isArray(i) ? i : [i]))
	}, E = function (n) { return n === s && t.currTemplate.closeBtn || (t.currTemplate.closeBtn = e(t.st.closeMarkup.replace("%title%", t.st.tClose)), s = n), t.currTemplate.closeBtn }, _ = function () { e.magnificPopup.instance || (t = new w, t.init(), e.magnificPopup.instance = t) }, S = function () { var e = document.createElement("p").style, t = ["ms", "O", "Moz", "Webkit"]; if (void 0 !== e.transition) return !0; for (; t.length;)if (t.pop() + "Transition" in e) return !0; return !1 }; w.prototype =
		{
			constructor: w, init: function () { var n = navigator.appVersion; t.isIE7 = -1 !== n.indexOf("MSIE 7."), t.isIE8 = -1 !== n.indexOf("MSIE 8."), t.isLowIE = t.isIE7 || t.isIE8, t.isAndroid = /android/gi.test(n), t.isIOS = /iphone|ipad|ipod/gi.test(n), t.supportsTransition = S(), t.probablyMobile = t.isAndroid || t.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), o = e(document), t.popupsCache = {} }, open: function (n) {
				i || (i = e(document.body)); var r; if (n.isObj === !1) {
				t.items = n.items.toArray(),
					t.index = 0; var s, l = n.items; for (r = 0; l.length > r; r++)if (s = l[r], s.parsed && (s = s.el[0]), s === n.el[0]) { t.index = r; break }
				} else t.items = e.isArray(n.items) ? n.items : [n.items], t.index = n.index || 0; if (t.isOpen) return t.updateItemHTML(), void 0; t.types = [], a = "", t.ev = n.mainEl && n.mainEl.length ? n.mainEl.eq(0) : o, n.key ? (t.popupsCache[n.key] || (t.popupsCache[n.key] = {}), t.currTemplate = t.popupsCache[n.key]) : t.currTemplate = {}, t.st = e.extend(!0, {}, e.magnificPopup.defaults, n), t.fixedContentPos = "auto" === t.st.fixedContentPos ? !t.probablyMobile :
					t.st.fixedContentPos, t.st.modal && (t.st.closeOnContentClick = !1, t.st.closeOnBgClick = !1, t.st.showCloseBtn = !1, t.st.enableEscapeKey = !1), t.bgOverlay || (t.bgOverlay = k("bg").on("click" + h, function () { t.close() }), t.wrap = k("wrap").attr("tabindex", -1).on("click" + h, function (e) { t._checkIfClose(e.target) && t.close() }), t.container = k("container", t.wrap)), t.contentContainer = k("content"), t.st.preloader && (t.preloader = k("preloader", t.container, t.st.tLoading)); var c = e.magnificPopup.modules; for (r = 0; c.length > r; r++) {
						var d = c[r];
						d = d.charAt(0).toUpperCase() + d.slice(1), t["init" + d].call(t)
					} T("BeforeOpen"), t.st.showCloseBtn && (t.st.closeBtnInside ? (x(p, function (e, t, n, i) { n.close_replaceWith = E(i.type) }), a += " mfp-close-btn-in") : t.wrap.append(E())), t.st.alignTop && (a += " mfp-align-top"), t.fixedContentPos ? t.wrap.css({ overflow: t.st.overflowY, overflowX: "hidden", overflowY: t.st.overflowY }) : t.wrap.css({ top: I.scrollTop(), position: "absolute" }), (t.st.fixedBgPos === !1 || "auto" === t.st.fixedBgPos && !t.fixedContentPos) && t.bgOverlay.css({
						height: o.height(),
						position: "absolute"
					}), t.st.enableEscapeKey && o.on("keyup" + h, function (e) { 27 === e.keyCode && t.close() }), I.on("resize" + h, function () { t.updateSize() }), t.st.closeOnContentClick || (a += " mfp-auto-cursor"), a && t.wrap.addClass(a); var u = t.wH = I.height(), m = {}; if (t.fixedContentPos && t._hasScrollBar(u)) { var g = t._getScrollbarSize(); g && (m.marginRight = g) } t.fixedContentPos && (t.isIE7 ? e("body, html").css("overflow", "hidden") : m.overflow = "hidden"); var C = t.st.mainClass; return t.isIE7 && (C += " mfp-ie7"), C && t._addClassToMFP(C), t.updateItemHTML(),
						T("BuildControls"), e("html").css(m), t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo || i), t._lastFocusedEl = document.activeElement, setTimeout(function () { t.content ? (t._addClassToMFP(v), t._setFocus()) : t.bgOverlay.addClass(v), o.on("focusin" + h, t._onFocusIn) }, 16), t.isOpen = !0, t.updateSize(u), T(f), n
			}, close: function () { t.isOpen && (T(c), t.isOpen = !1, t.st.removalDelay && !t.isLowIE && t.supportsTransition ? (t._addClassToMFP(C), setTimeout(function () { t._close() }, t.st.removalDelay)) : t._close()) }, _close: function () {
				T(l);
				var n = C + " " + v + " "; if (t.bgOverlay.detach(), t.wrap.detach(), t.container.empty(), t.st.mainClass && (n += t.st.mainClass + " "), t._removeClassFromMFP(n), t.fixedContentPos) { var i = { marginRight: "" }; t.isIE7 ? e("body, html").css("overflow", "") : i.overflow = "", e("html").css(i) } o.off("keyup" + h + " focusin" + h), t.ev.off(h), t.wrap.attr("class", "mfp-wrap").removeAttr("style"), t.bgOverlay.attr("class", "mfp-bg"), t.container.attr("class", "mfp-container"), !t.st.showCloseBtn || t.st.closeBtnInside && t.currTemplate[t.currItem.type] !==
					!0 || t.currTemplate.closeBtn && t.currTemplate.closeBtn.detach(), t._lastFocusedEl && e(t._lastFocusedEl).focus(), t.currItem = null, t.content = null, t.currTemplate = null, t.prevHeight = 0, T(d)
			}, updateSize: function (e) { if (t.isIOS) { var n = document.documentElement.clientWidth / window.innerWidth, i = window.innerHeight * n; t.wrap.css("height", i), t.wH = i } else t.wH = e || I.height(); t.fixedContentPos || t.wrap.css("height", t.wH), T("Resize") }, updateItemHTML: function () {
				var n = t.items[t.index]; t.contentContainer.detach(), t.content && t.content.detach(),
					n.parsed || (n = t.parseEl(t.index)); var i = n.type; if (T("BeforeChange", [t.currItem ? t.currItem.type : "", i]), t.currItem = n, !t.currTemplate[i]) { var o = t.st[i] ? t.st[i].markup : !1; T("FirstMarkupParse", o), t.currTemplate[i] = o ? e(o) : !0 } r && r !== n.type && t.container.removeClass("mfp-" + r + "-holder"); var a = t["get" + i.charAt(0).toUpperCase() + i.slice(1)](n, t.currTemplate[i]); t.appendContent(a, i), n.preloaded = !0, T(m, n), r = n.type, t.container.prepend(t.contentContainer), T("AfterChange")
			}, appendContent: function (e, n) {
			t.content = e, e ?
				t.st.showCloseBtn && t.st.closeBtnInside && t.currTemplate[n] === !0 ? t.content.find(".mfp-close").length || t.content.append(E()) : t.content = e : t.content = "", T(u), t.container.addClass("mfp-" + n + "-holder"), t.contentContainer.append(t.content)
			}, parseEl: function (n) {
				var i, o = t.items[n]; if (o.tagName ? o = { el: e(o) } : (i = o.type, o = { data: o, src: o.src }), o.el) { for (var r = t.types, a = 0; r.length > a; a++)if (o.el.hasClass("mfp-" + r[a])) { i = r[a]; break } o.src = o.el.attr("data-mfp-src"), o.src || (o.src = o.el.attr("href")) } return o.type = i || t.st.type ||
					"inline", o.index = n, o.parsed = !0, t.items[n] = o, T("ElementParse", o), t.items[n]
			}, addGroup: function (e, n) { var i = function (i) { i.mfpEl = this, t._openClick(i, e, n) }; n || (n = {}); var o = "click.magnificPopup"; n.mainEl = e, n.items ? (n.isObj = !0, e.off(o).on(o, i)) : (n.isObj = !1, n.delegate ? e.off(o).on(o, n.delegate, i) : (n.items = e, e.off(o).on(o, i))) }, _openClick: function (n, i, o) {
				var r = void 0 !== o.midClick ? o.midClick : e.magnificPopup.defaults.midClick; if (r || 2 !== n.which && !n.ctrlKey && !n.metaKey) {
					var a = void 0 !== o.disableOn ? o.disableOn : e.magnificPopup.defaults.disableOn;
					if (a) if (e.isFunction(a)) { if (!a.call(t)) return !0 } else if (a > I.width()) return !0; n.type && (n.preventDefault(), t.isOpen && n.stopPropagation()), o.el = e(n.mfpEl), o.delegate && (o.items = i.find(o.delegate)), t.open(o)
				}
			}, updateStatus: function (e, i) {
				if (t.preloader) {
				n !== e && t.container.removeClass("mfp-s-" + n), i || "loading" !== e || (i = t.st.tLoading); var o = { status: e, text: i }; T("UpdateStatus", o), e = o.status, i = o.text, t.preloader.html(i), t.preloader.find("a").on("click", function (e) { e.stopImmediatePropagation() }), t.container.addClass("mfp-s-" +
					e), n = e
				}
			}, _checkIfClose: function (n) { if (!e(n).hasClass(y)) { var i = t.st.closeOnContentClick, o = t.st.closeOnBgClick; if (i && o) return !0; if (!t.content || e(n).hasClass("mfp-close") || t.preloader && n === t.preloader[0]) return !0; if (n === t.content[0] || e.contains(t.content[0], n)) { if (i) return !0 } else if (o && e.contains(document, n)) return !0; return !1 } }, _addClassToMFP: function (e) { t.bgOverlay.addClass(e), t.wrap.addClass(e) }, _removeClassFromMFP: function (e) { this.bgOverlay.removeClass(e), t.wrap.removeClass(e) }, _hasScrollBar: function (e) {
				return (t.isIE7 ?
					o.height() : document.body.scrollHeight) > (e || I.height())
			}, _setFocus: function () { (t.st.focus ? t.content.find(t.st.focus).eq(0) : t.wrap).focus() }, _onFocusIn: function (n) { return n.target === t.wrap[0] || e.contains(t.wrap[0], n.target) ? void 0 : (t._setFocus(), !1) }, _parseMarkup: function (t, n, i) {
				var o; i.data && (n = e.extend(i.data, n)), T(p, [t, n, i]), e.each(n, function (e, n) {
					if (void 0 === n || n === !1) return !0; if (o = e.split("_"), o.length > 1) {
						var i = t.find(h + "-" + o[0]); if (i.length > 0) {
							var r = o[1]; "replaceWith" === r ? i[0] !== n[0] && i.replaceWith(n) :
								"img" === r ? i.is("img") ? i.attr("src", n) : i.replaceWith('<img src="' + n + '" class="' + i.attr("class") + '" />') : i.attr(o[1], n)
						}
					} else t.find(h + "-" + e).html(n)
				})
			}, _getScrollbarSize: function () { if (void 0 === t.scrollbarSize) { var e = document.createElement("div"); e.id = "mfp-sbm", e.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(e), t.scrollbarSize = e.offsetWidth - e.clientWidth, document.body.removeChild(e) } return t.scrollbarSize }
		}, e.magnificPopup = {
			instance: null,
			proto: w.prototype, modules: [], open: function (t, n) { return _(), t = t ? e.extend(!0, {}, t) : {}, t.isObj = !0, t.index = n || 0, this.instance.open(t) }, close: function () { return e.magnificPopup.instance && e.magnificPopup.instance.close() }, registerModule: function (t, n) { n.options && (e.magnificPopup.defaults[t] = n.options), e.extend(this.proto, n.proto), this.modules.push(t) }, defaults: {
				disableOn: 0, key: null, midClick: !1, mainClass: "", preloader: !0, focus: "", closeOnContentClick: !1, closeOnBgClick: !0, closeBtnInside: !0, showCloseBtn: !0, enableEscapeKey: !0,
				modal: !1, alignTop: !1, removalDelay: 0, prependTo: null, fixedContentPos: "auto", fixedBgPos: "auto", overflowY: "auto", closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>', tClose: "Close (Esc)", tLoading: "Loading..."
			}
		}, e.fn.magnificPopup = function (n) {
			_(); var i = e(this); if ("string" == typeof n) if ("open" === n) {
				var o, r = b ? i.data("magnificPopup") : i[0].magnificPopup, a = parseInt(arguments[1], 10) || 0; r.items ? o = r.items[a] : (o = i, r.delegate && (o = o.find(r.delegate)), o = o.eq(a)), t._openClick({ mfpEl: o },
					i, r)
			} else t.isOpen && t[n].apply(t, Array.prototype.slice.call(arguments, 1)); else n = e.extend(!0, {}, n), b ? i.data("magnificPopup", n) : i[0].magnificPopup = n, t.addGroup(i, n); return i
		}; var P, O, z, M = "inline", B = function () { z && (O.after(z.addClass(P)).detach(), z = null) }; e.magnificPopup.registerModule(M, {
			options: { hiddenClass: "hide", markup: "", tNotFound: "Content not found" }, proto: {
				initInline: function () { t.types.push(M), x(l + "." + M, function () { B() }) }, getInline: function (n, i) {
					if (B(), n.src) {
						var o = t.st.inline, r = e(n.src); if (r.length) {
							var a =
								r[0].parentNode; a && a.tagName && (O || (P = o.hiddenClass, O = k(P), P = "mfp-" + P), z = r.after(O).detach().removeClass(P)), t.updateStatus("ready")
						} else t.updateStatus("error", o.tNotFound), r = e("<div>"); return n.inlineElement = r, r
					} return t.updateStatus("ready"), t._parseMarkup(i, {}, n), i
				}
			}
		}); var F, H = "ajax", L = function () { F && i.removeClass(F) }, A = function () { L(), t.req && t.req.abort() }; e.magnificPopup.registerModule(H, {
			options: { settings: null, cursor: "mfp-ajax-cur", tError: '<a href="%url%">The content</a> could not be loaded.' },
			proto: {
				initAjax: function () { t.types.push(H), F = t.st.ajax.cursor, x(l + "." + H, A), x("BeforeChange." + H, A) }, getAjax: function (n) {
				F && i.addClass(F), t.updateStatus("loading"); var o = e.extend({
					url: n.src, success: function (i, o, r) { var a = { data: i, xhr: r }; T("ParseAjax", a), t.appendContent(e(a.data), H), n.finished = !0, L(), t._setFocus(), setTimeout(function () { t.wrap.addClass(v) }, 16), t.updateStatus("ready"), T("AjaxContentAdded") }, error: function () {
					L(), n.finished = n.loadError = !0, t.updateStatus("error", t.st.ajax.tError.replace("%url%",
						n.src))
					}
				}, t.st.ajax.settings); return t.req = e.ajax(o), ""
				}
			}
		}); var j, N = function (n) { if (n.data && void 0 !== n.data.title) return n.data.title; var i = t.st.image.titleSrc; if (i) { if (e.isFunction(i)) return i.call(t, n); if (n.el) return n.el.attr(i) || "" } return "" }; e.magnificPopup.registerModule("image", {
			options: {
				markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
				cursor: "mfp-zoom-out-cur", titleSrc: "title", verticalFit: !0, tError: '<a href="%url%">The image</a> could not be loaded.'
			}, proto: {
				initImage: function () { var e = t.st.image, n = ".image"; t.types.push("image"), x(f + n, function () { "image" === t.currItem.type && e.cursor && i.addClass(e.cursor) }), x(l + n, function () { e.cursor && i.removeClass(e.cursor), I.off("resize" + h) }), x("Resize" + n, t.resizeImage), t.isLowIE && x("AfterChange", t.resizeImage) }, resizeImage: function () {
					var e = t.currItem; if (e && e.img && t.st.image.verticalFit) {
						var n = 0;
						t.isLowIE && (n = parseInt(e.img.css("padding-top"), 10) + parseInt(e.img.css("padding-bottom"), 10)), e.img.css("max-height", t.wH - n)
					}
				}, _onImageHasSize: function (e) { e.img && (e.hasSize = !0, j && clearInterval(j), e.isCheckingImgSize = !1, T("ImageHasSize", e), e.imgHidden && (t.content && t.content.removeClass("mfp-loading"), e.imgHidden = !1)) }, findImageSize: function (e) {
					var n = 0, i = e.img[0], o = function (r) {
					j && clearInterval(j), j = setInterval(function () {
						return i.naturalWidth > 0 ? (t._onImageHasSize(e), void 0) : (n > 200 && clearInterval(j),
							n++ , 3 === n ? o(10) : 40 === n ? o(50) : 100 === n && o(500), void 0)
					}, r)
					}; o(1)
				}, getImage: function (n, i) {
					var o = 0, r = function () { n && (n.img[0].complete ? (n.img.off(".mfploader"), n === t.currItem && (t._onImageHasSize(n), t.updateStatus("ready")), n.hasSize = !0, n.loaded = !0, T("ImageLoadComplete")) : (o++ , 200 > o ? setTimeout(r, 100) : a())) }, a = function () { n && (n.img.off(".mfploader"), n === t.currItem && (t._onImageHasSize(n), t.updateStatus("error", s.tError.replace("%url%", n.src))), n.hasSize = !0, n.loaded = !0, n.loadError = !0) }, s = t.st.image, l = i.find(".mfp-img");
					if (l.length) { var c = document.createElement("img"); c.className = "mfp-img", n.img = e(c).on("load.mfploader", r).on("error.mfploader", a), c.src = n.src, l.is("img") && (n.img = n.img.clone()), c = n.img[0], c.naturalWidth > 0 ? n.hasSize = !0 : c.width || (n.hasSize = !1) } return t._parseMarkup(i, { title: N(n), img_replaceWith: n.img }, n), t.resizeImage(), n.hasSize ? (j && clearInterval(j), n.loadError ? (i.addClass("mfp-loading"), t.updateStatus("error", s.tError.replace("%url%", n.src))) : (i.removeClass("mfp-loading"), t.updateStatus("ready")),
						i) : (t.updateStatus("loading"), n.loading = !0, n.hasSize || (n.imgHidden = !0, i.addClass("mfp-loading"), t.findImageSize(n)), i)
				}
			}
		}); var W, R = function () { return void 0 === W && (W = void 0 !== document.createElement("p").style.MozTransform), W }; e.magnificPopup.registerModule("zoom", {
			options: { enabled: !1, easing: "ease-in-out", duration: 300, opener: function (e) { return e.is("img") ? e : e.find("img") } }, proto: {
				initZoom: function () {
					var e, n = t.st.zoom, i = ".zoom"; if (n.enabled && t.supportsTransition) {
						var o, r, a = n.duration, s = function (e) {
							var t =
								e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"), i = "all " + n.duration / 1E3 + "s " + n.easing, o = { position: "fixed", zIndex: 9999, left: 0, top: 0, "-webkit-backface-visibility": "hidden" }, r = "transition"; return o["-webkit-" + r] = o["-moz-" + r] = o["-o-" + r] = o[r] = i, t.css(o), t
						}, d = function () { t.content.css("visibility", "visible") }; x("BuildControls" + i, function () {
							if (t._allowZoom()) {
								if (clearTimeout(o), t.content.css("visibility", "hidden"), e = t._getItemToZoom(), !e) return d(), void 0; r = s(e), r.css(t._getOffset()),
									t.wrap.append(r), o = setTimeout(function () { r.css(t._getOffset(!0)), o = setTimeout(function () { d(), setTimeout(function () { r.remove(), e = r = null, T("ZoomAnimationEnded") }, 16) }, a) }, 16)
							}
						}), x(c + i, function () { if (t._allowZoom()) { if (clearTimeout(o), t.st.removalDelay = a, !e) { if (e = t._getItemToZoom(), !e) return; r = s(e) } r.css(t._getOffset(!0)), t.wrap.append(r), t.content.css("visibility", "hidden"), setTimeout(function () { r.css(t._getOffset()) }, 16) } }), x(l + i, function () { t._allowZoom() && (d(), r && r.remove(), e = null) })
					}
				}, _allowZoom: function () {
					return "image" ===
						t.currItem.type
				}, _getItemToZoom: function () { return t.currItem.hasSize ? t.currItem.img : !1 }, _getOffset: function (n) { var i; i = n ? t.currItem.img : t.st.zoom.opener(t.currItem.el || t.currItem); var o = i.offset(), r = parseInt(i.css("padding-top"), 10), a = parseInt(i.css("padding-bottom"), 10); o.top -= e(window).scrollTop() - r; var s = { width: i.width(), height: (b ? i.innerHeight() : i[0].offsetHeight) - a - r }; return R() ? s["-moz-transform"] = s.transform = "translate(" + o.left + "px," + o.top + "px)" : (s.left = o.left, s.top = o.top), s }
			}
		}); var Z = "iframe",
			q = "//about:blank", D = function (e) { if (t.currTemplate[Z]) { var n = t.currTemplate[Z].find("iframe"); n.length && (e || (n[0].src = q), t.isIE8 && n.css("display", e ? "block" : "none")) } }; e.magnificPopup.registerModule(Z, {
				options: {
					markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>', srcAction: "iframe_src", patterns: {
						youtube: { index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1" }, vimeo: {
							index: "vimeo.com/",
							id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1"
						}, gmaps: { index: "//maps.google.", src: "%id%&output=embed" }
					}
				}, proto: {
					initIframe: function () { t.types.push(Z), x("BeforeChange", function (e, t, n) { t !== n && (t === Z ? D() : n === Z && D(!0)) }), x(l + "." + Z, function () { D() }) }, getIframe: function (n, i) {
						var o = n.src, r = t.st.iframe; e.each(r.patterns, function () {
							return o.indexOf(this.index) > -1 ? (this.id && (o = "string" == typeof this.id ? o.substr(o.lastIndexOf(this.id) + this.id.length, o.length) : this.id.call(this, o)), o = this.src.replace("%id%",
								o), !1) : void 0
						}); var a = {}; return r.srcAction && (a[r.srcAction] = o), t._parseMarkup(i, a, n), t.updateStatus("ready"), i
					}
				}
			}); var K = function (e) { var n = t.items.length; return e > n - 1 ? e - n : 0 > e ? n + e : e }, Y = function (e, t, n) { return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, n) }; e.magnificPopup.registerModule("gallery", {
				options: {
					enabled: !1, arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', preload: [0, 2], navigateByImgClick: !0, arrows: !0, tPrev: "Previous (Left arrow key)", tNext: "Next (Right arrow key)",
					tCounter: "%curr% of %total%"
				}, proto: {
					initGallery: function () {
						var n = t.st.gallery, i = ".mfp-gallery", r = Boolean(e.fn.mfpFastClick); return t.direction = !0, n && n.enabled ? (a += " mfp-gallery", x(f + i, function () { n.navigateByImgClick && t.wrap.on("click" + i, ".mfp-img", function () { return t.items.length > 1 ? (t.next(), !1) : void 0 }), o.on("keydown" + i, function (e) { 37 === e.keyCode ? t.prev() : 39 === e.keyCode && t.next() }) }), x("UpdateStatus" + i, function (e, n) { n.text && (n.text = Y(n.text, t.currItem.index, t.items.length)) }), x(p + i, function (e, i,
							o, r) { var a = t.items.length; o.counter = a > 1 ? Y(n.tCounter, r.index, a) : "" }), x("BuildControls" + i, function () {
								if (t.items.length > 1 && n.arrows && !t.arrowLeft) {
									var i = n.arrowMarkup, o = t.arrowLeft = e(i.replace(/%title%/gi, n.tPrev).replace(/%dir%/gi, "left")).addClass(y), a = t.arrowRight = e(i.replace(/%title%/gi, n.tNext).replace(/%dir%/gi, "right")).addClass(y), s = r ? "mfpFastClick" : "click"; o[s](function () { t.prev() }), a[s](function () { t.next() }), t.isIE7 && (k("b", o[0], !1, !0), k("a", o[0], !1, !0), k("b", a[0], !1, !0), k("a", a[0], !1, !0)),
										t.container.append(o.add(a))
								}
							}), x(m + i, function () { t._preloadTimeout && clearTimeout(t._preloadTimeout), t._preloadTimeout = setTimeout(function () { t.preloadNearbyImages(), t._preloadTimeout = null }, 16) }), x(l + i, function () { o.off(i), t.wrap.off("click" + i), t.arrowLeft && r && t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(), t.arrowRight = t.arrowLeft = null }), void 0) : !1
					}, next: function () { t.direction = !0, t.index = K(t.index + 1), t.updateItemHTML() }, prev: function () { t.direction = !1, t.index = K(t.index - 1), t.updateItemHTML() }, goTo: function (e) {
					t.direction =
						e >= t.index, t.index = e, t.updateItemHTML()
					}, preloadNearbyImages: function () { var e, n = t.st.gallery.preload, i = Math.min(n[0], t.items.length), o = Math.min(n[1], t.items.length); for (e = 1; (t.direction ? o : i) >= e; e++)t._preloadItem(t.index + e); for (e = 1; (t.direction ? i : o) >= e; e++)t._preloadItem(t.index - e) }, _preloadItem: function (n) {
						if (n = K(n), !t.items[n].preloaded) {
							var i = t.items[n]; i.parsed || (i = t.parseEl(n)), T("LazyLoad", i), "image" === i.type && (i.img = e('<img class="mfp-img" />').on("load.mfploader", function () { i.hasSize = !0 }).on("error.mfploader",
								function () { i.hasSize = !0, i.loadError = !0, T("LazyLoadError", i) }).attr("src", i.src)), i.preloaded = !0
						}
					}
				}
			}); var U = "retina"; e.magnificPopup.registerModule(U, {
				options: { replaceSrc: function (e) { return e.src.replace(/\.\w+$/, function (e) { return "@2x" + e }) }, ratio: 1 }, proto: {
					initRetina: function () {
						if (window.devicePixelRatio > 1) {
							var e = t.st.retina, n = e.ratio; n = isNaN(n) ? n() : n, n > 1 && (x("ImageHasSize." + U, function (e, t) { t.img.css({ "max-width": t.img[0].naturalWidth / n, width: "100%" }) }), x("ElementParse." + U, function (t, i) {
							i.src = e.replaceSrc(i,
								n)
							}))
						}
					}
				}
			}), function () {
				var t = 1E3, n = "ontouchstart" in window, i = function () { I.off("touchmove" + r + " touchend" + r) }, o = "mfpFastClick", r = "." + o; e.fn.mfpFastClick = function (o) {
					return e(this).each(function () {
						var a, s = e(this); if (n) {
							var l, c, d, u, p, f; s.on("touchstart" + r, function (e) {
							u = !1, f = 1, p = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0], c = p.clientX, d = p.clientY, I.on("touchmove" + r, function (e) {
							p = e.originalEvent ? e.originalEvent.touches : e.touches, f = p.length, p = p[0], (Math.abs(p.clientX - c) > 10 || Math.abs(p.clientY -
								d) > 10) && (u = !0, i())
							}).on("touchend" + r, function (e) { i(), u || f > 1 || (a = !0, e.preventDefault(), clearTimeout(l), l = setTimeout(function () { a = !1 }, t), o()) })
							})
						} s.on("click" + r, function () { a || o() })
					})
				}, e.fn.destroyMfpFastClick = function () { e(this).off("touchstart" + r + " click" + r), n && I.off("touchmove" + r + " touchend" + r) }
			}(), _()
})(window.jQuery || window.Zepto);

// Porfolio DropDown filter

(function ($) {
	var cards = $(".card-drop"), toggler = cards.find(".toggle"), links = cards.find("ul>li>a"), li = links.parent("li"), count = links.length, width = links.outerWidth(); links.parent("li").each(function (i) { $(this).css("z-index", count - i) }); links.each(function () { $(this).css("box-shadow", "none") }); function setClosed() { li.each(function (index) { $(this).css("top", index * 0).css("width", width - index * 0).css("margin-left", index * 2 / 2) }); li.addClass("closed"); toggler.removeClass("active") } setClosed(); toggler.on("mousedown",
		function () { var $this = $(this); if ($this.is(".active")) { setClosed(); links.each(function () { $(this).css("box-shadow", "none") }) } else { $this.addClass("active"); li.removeClass("closed"); links.each(function () { $(this).css("box-shadow", "0px 1px 3px rgba(0, 0, 0, 0.1)") }); li.each(function (index) { $(this).css("top", 40 * (index + 1)).css("width", "100%").css("margin-left", "0px") }) } }); links.on("click", function (e) {
			var $this = $(this), label = $this.data("label"); li.removeClass("active"); if ($this.parent("li").is("active")) $this.parent("li").removeClass("active");
			else $this.parent("li").addClass("active"); toggler.children("span").text(label); links.each(function () { $(this).css("box-shadow", "none") }); setClosed(); e.preventDefault
		})
})(jQuery);

// Placeholder js

(function (window, document, $) {
	var isOperaMini = Object.prototype.toString.call(window.operamini) == "[object OperaMini]"; var isInputSupported = "placeholder" in document.createElement("input") && !isOperaMini; var isTextareaSupported = "placeholder" in document.createElement("textarea") && !isOperaMini; var prototype = $.fn; var valHooks = $.valHooks; var propHooks = $.propHooks; var hooks; var placeholder; if (isInputSupported && isTextareaSupported) {
		placeholder = prototype.placeholder = function () { return this }; placeholder.input =
			placeholder.textarea = true
	} else {
		placeholder = prototype.placeholder = function () { var $this = this; $this.filter((isInputSupported ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({ "focus.placeholder": clearPlaceholder, "blur.placeholder": setPlaceholder }).data("placeholder-enabled", true).trigger("blur.placeholder"); return $this }; placeholder.input = isInputSupported; placeholder.textarea = isTextareaSupported; hooks = {
			"get": function (element) {
				var $element = $(element); var $passwordInput = $element.data("placeholder-password");
				if ($passwordInput) return $passwordInput[0].value; return $element.data("placeholder-enabled") && $element.hasClass("placeholder") ? "" : element.value
			}, "set": function (element, value) {
				var $element = $(element); var $passwordInput = $element.data("placeholder-password"); if ($passwordInput) return $passwordInput[0].value = value; if (!$element.data("placeholder-enabled")) return element.value = value; if (value == "") { element.value = value; if (element != safeActiveElement()) setPlaceholder.call(element) } else if ($element.hasClass("placeholder")) clearPlaceholder.call(element,
					true, value) || (element.value = value); else element.value = value; return $element
			}
		}; if (!isInputSupported) { valHooks.input = hooks; propHooks.value = hooks } if (!isTextareaSupported) { valHooks.textarea = hooks; propHooks.value = hooks } $(function () { $(document).delegate("form", "submit.placeholder", function () { var $inputs = $(".placeholder", this).each(clearPlaceholder); setTimeout(function () { $inputs.each(setPlaceholder) }, 10) }) }); $(window).bind("beforeunload.placeholder", function () {
			$(".placeholder").each(function () {
			this.value =
				""
			})
		})
	} function args(elem) { var newAttrs = {}; var rinlinejQuery = /^jQuery\d+$/; $.each(elem.attributes, function (i, attr) { if (attr.specified && !rinlinejQuery.test(attr.name)) newAttrs[attr.name] = attr.value }); return newAttrs } function clearPlaceholder(event, value) {
		var input = this; var $input = $(input); if (input.value == $input.attr("placeholder") && $input.hasClass("placeholder")) if ($input.data("placeholder-password")) {
			$input = $input.hide().next().show().attr("id", $input.removeAttr("id").data("placeholder-id")); if (event ===
				true) return $input[0].value = value; $input.focus()
		} else { input.value = ""; $input.removeClass("placeholder"); input == safeActiveElement() && input.select() }
	} function setPlaceholder() {
		var $replacement; var input = this; var $input = $(input); var id = this.id; if (input.value == "") {
			if (input.type == "password") {
				if (!$input.data("placeholder-textinput")) {
					try { $replacement = $input.clone().attr({ "type": "text" }) } catch (e) { $replacement = $("<input>").attr($.extend(args(this), { "type": "text" })) } $replacement.removeAttr("name").data({
						"placeholder-password": $input,
						"placeholder-id": id
					}).bind("focus.placeholder", clearPlaceholder); $input.data({ "placeholder-textinput": $replacement, "placeholder-id": id }).before($replacement)
				} $input = $input.removeAttr("id").hide().prev().attr("id", id).show()
			} $input.addClass("placeholder"); $input[0].value = $input.attr("placeholder")
		} else $input.removeClass("placeholder")
	} function safeActiveElement() { try { return document.activeElement } catch (exception) { } }
})(this, document, jQuery);

// PanelSlider

(function (e) {
	function r(e, r) { var i = e.outerWidth(true), s = {}, o = {}; if (e.is(":visible") || n) return; n = true; e.addClass("ps-active-panel").css({ position: "fixed", top: 0, height: "100%", "z-index": 999999 }); e.data(r); switch (r.side) { case "left": e.css({ left: "-" + i + "px", right: "auto" }); s["margin-left"] = "+=" + i; o.left = "+=" + i; break; case "right": e.css({ left: "auto", right: "-" + i + "px" }); s["margin-left"] = "-=" + i; o.right = "+=" + i; break }t.animate(s, r.duration); e.show().animate(o, r.duration, function () { n = false }) } var t = e("body"), n = false;
	e.panelslider = function (t, n) { var i = e(".ps-active-panel"); var s = { side: "left", duration: 200, clickClose: true }; n = e.extend({}, s, n); if (i.is(":visible") && i[0] != t[0]) e.panelslider.close(function () { r(t, n) }); else if (!i.length || i.is(":hidden")) r(t, n) }; e.panelslider.close = function (r) {
		var i = e(".ps-active-panel"), s = i.data("duration"), o = i.outerWidth(true), u = {}, a = {}; if (!i.length || i.is(":hidden") || n) return; n = true; switch (i.data("side")) {
			case "left": u["margin-left"] = "-=" + o; a.left = "-=" + o; break; case "right": u["margin-left"] =
				"+=" + o; a.right = "-=" + o; break
		}i.animate(a, s); t.animate(u, s, function () { i.hide(); i.removeClass("ps-active-panel"); n = false; if (r) r() })
	}; e(document).bind("click keyup", function (t) { var n = e(".ps-active-panel"); if (t.type == "keyup" && t.keyCode != 27) return; if (n.is(":visible") && n.data("clickClose")) e.panelslider.close() }); e(document).on("click", ".ps-active-panel", function (e) { e.stopPropagation() }); e.fn.panelslider = function (t) {
		this.click(function (n) {
			var r = e(".ps-active-panel"), i = e(this.getAttribute("href")); if (r.is(":visible") &&
				i[0] == r[0]) e.panelslider.close(); else e.panelslider(i, t); n.preventDefault(); n.stopPropagation()
		}); return this
	}
})(jQuery);

// jquery-resize

(function ($, h, c) {
	var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow"; e[b] = 250; e[f] = true; $.event.special[j] = {
		setup: function () { if (!e[f] && this[k]) return false; var l = $(this); a = a.add(l); $.data(this, d, { w: l.width(), h: l.height() }); if (a.length === 1) g() }, teardown: function () { if (!e[f] && this[k]) return false; var l = $(this); a = a.not(l); l.removeData(d); if (!a.length) clearTimeout(i) }, add: function (l) {
			if (!e[f] && this[k]) return false; var n; function m(s,
				o, p) { var q = $(this), r = $.data(this, d); r.w = o !== c ? o : q.width(); r.h = p !== c ? p : q.height(); n.apply(this, arguments) } if ($.isFunction(l)) { n = l; return m } else { n = l.handler; l.handler = m }
		}
	}; function g() { i = h[k](function () { a.each(function () { var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d); if (m !== o.w || l !== o.h) n.trigger(j, [o.w = m, o.h = l]) }); g() }, e[b]) }
})(jQuery, this);
// marquee_jquery_plugin
(function (A) {
A.marquee = { version: "1.0.01" }; A.fn.marquee = function (E) {
	var F = typeof arguments[0] == "string" && arguments[0]; var D = F && Array.prototype.slice.call(arguments, 1) || arguments; var C = this.length == 0 ? null : A.data(this[0], "marquee"); if (C && F && this.length) if (F.toLowerCase() == "object") return C; else if (C[F]) { var B; this.each(function (G) { var H = A.data(this, "marquee")[F].apply(C, D); if (G == 0 && H) if (!!H.jquery) B = A([]).add(H); else { B = H; return false } else if (!!H && !!H.jquery) B = B.add(H) }); return B || this } else return this;
	else return this.each(function () { new A.Marquee(this, E) })
}; A.Marquee = function (E, Q) {
	Q = A.extend({}, A.Marquee.defaults, Q); var O = this, M = A(E), F = M.find("> li"), H = -1, G = false, L = false, N = 0; A.data(M[0], "marquee", O); this.pause = function () { G = true; P() }; this.resume = function () { G = false; D() }; this.update = function () { var R = F.length; F = M.find("> li"); if (R <= 1) D() }; function K(R) {
		if (F.filter("." + Q.cssShowing).length > 0) return false; var T = F.eq(R); if (A.isFunction(Q.beforeshow)) Q.beforeshow.apply(O, [M, T]); var S = {
			top: (Q.yScroll ==
				"top" ? "-" : "+") + T.outerHeight() + "px", left: 0
		}; M.data("marquee.showing", true); T.addClass(Q.cssShowing); T.css(S).animate({ top: "0px" }, Q.showSpeed, Q.fxEasingShow, function () { if (A.isFunction(Q.show)) Q.show.apply(O, [M, T]); M.data("marquee.showing", false); J(T) })
	} function J(S, R) {
		if (L == true) return false; R = R || Q.pauseSpeed; if (C(S)) setTimeout(function () { if (L == true) return false; var V = S.outerWidth(), T = V * -1, U = parseInt(S.css("left"), 10); S.animate({ left: T + "px" }, (V + U) * Q.scrollSpeed, Q.fxEasingScroll, function () { I(S) }) },
			R); else if (F.length > 1) setTimeout(function () { if (L == true) return false; S.animate({ top: (Q.yScroll == "top" ? "+" : "-") + M.innerHeight() + "px" }, Q.showSpeed, Q.fxEasingScroll); I(S) }, R)
	} function I(R) { if (A.isFunction(Q.aftershow)) Q.aftershow.apply(O, [M, R]); R.removeClass(Q.cssShowing); B() } function P() { L = true; if (M.data("marquee.showing") != true) F.filter("." + Q.cssShowing).dequeue().stop() } function D() { L = false; if (M.data("marquee.showing") != true) J(F.filter("." + Q.cssShowing), 1) } if (Q.pauseOnHover) M.hover(function () {
		if (G) return false;
		P()
	}, function () { if (G) return false; D() }); function C(R) { return R.outerWidth() > M.innerWidth() } function B() { H++; if (H >= F.length) { if (!isNaN(Q.loop) && Q.loop > 0 && ++N >= Q.loop) return false; H = 0 } K(H) } if (A.isFunction(Q.init)) Q.init.apply(O, [M, Q]); B()
}; A.Marquee.defaults = { yScroll: "top", showSpeed: 850, scrollSpeed: 12, pauseSpeed: 5E3, pauseOnHover: true, loop: -1, fxEasingShow: "swing", fxEasingScroll: "linear", cssShowing: "marquee-showing", init: null, beforeshow: null, show: null, aftershow: null }
})(jQuery);

// EasePack

var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
	_gsScope._gsDefine("easing.Back", ["easing.Ease"], function (t) {
		var e, i, s, r = _gsScope.GreenSockGlobals || _gsScope, n = r.com.greensock, a = 2 * Math.PI, o = Math.PI / 2, h = n._class, l = function (e, i) { var s = h("easing." + e, function () { }, !0), r = s.prototype = new t; return r.constructor = s, r.getRatio = i, s }, _ = t.register || function () { }, u = function (t, e, i, s) { var r = h("easing." + t, { easeOut: new e, easeIn: new i, easeInOut: new s }, !0); return _(r, t), r }, c = function (t, e, i) {
		this.t = t, this.v =
			e, i && (this.next = i, i.prev = this, this.c = i.v - e, this.gap = i.t - t)
		}, p = function (e, i) { var s = h("easing." + e, function (t) { this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1 }, !0), r = s.prototype = new t; return r.constructor = s, r.getRatio = i, r.config = function (t) { return new s(t) }, s }, f = u("Back", p("BackOut", function (t) { return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1 }), p("BackIn", function (t) { return t * t * ((this._p1 + 1) * t - this._p1) }), p("BackInOut", function (t) {
			return 1 > (t *= 2) ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 +
				1) * t + this._p2) + 2)
		})), m = h("easing.SlowMo", function (t, e, i) { e = e || 0 === e ? e : .7, null == t ? t = .7 : t > 1 && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = i === !0 }, !0), d = m.prototype = new t; return d.constructor = m, d.getRatio = function (t) { var e = t + (.5 - t) * this._p; return this._p1 > t ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e }, m.ease = new m(.7, .7), d.config =
			m.config = function (t, e, i) { return new m(t, e, i) }, e = h("easing.SteppedEase", function (t) { t = t || 1, this._p1 = 1 / t, this._p2 = t + 1 }, !0), d = e.prototype = new t, d.constructor = e, d.getRatio = function (t) { return 0 > t ? t = 0 : t >= 1 && (t = .999999999), (this._p2 * t >> 0) * this._p1 }, d.config = e.config = function (t) { return new e(t) }, i = h("easing.RoughEase", function (e) {
				e = e || {}; for (var i, s, r, n, a, o, h = e.taper || "none", l = [], _ = 0, u = 0 | (e.points || 20), p = u, f = e.randomize !== !1, m = e.clamp === !0, d = e.template instanceof t ? e.template : null, g = "number" == typeof e.strength ?
					.4 * e.strength : .4; --p > -1;)i = f ? Math.random() : 1 / u * p, s = d ? d.getRatio(i) : i, "none" === h ? r = g : "out" === h ? (n = 1 - i, r = n * n * g) : "in" === h ? r = i * i * g : .5 > i ? (n = 2 * i, r = .5 * n * n * g) : (n = 2 * (1 - i), r = .5 * n * n * g), f ? s += Math.random() * r - .5 * r : p % 2 ? s += .5 * r : s -= .5 * r, m && (s > 1 ? s = 1 : 0 > s && (s = 0)), l[_++] = { x: i, y: s }; for (l.sort(function (t, e) { return t.x - e.x }), o = new c(1, 1, null), p = u; --p > -1;)a = l[p], o = new c(a.x, a.y, o); this._prev = new c(0, 0, 0 !== o.t ? o : o.next)
			}, !0), d = i.prototype = new t, d.constructor = i, d.getRatio = function (t) {
				var e = this._prev; if (t > e.t) {
					for (; e.next &&
						t >= e.t;)e = e.next; e = e.prev
				} else for (; e.prev && e.t >= t;)e = e.prev; return this._prev = e, e.v + (t - e.t) / e.gap * e.c
			}, d.config = function (t) { return new i(t) }, i.ease = new i, u("Bounce", l("BounceOut", function (t) { return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375 }), l("BounceIn", function (t) {
				return 1 / 2.75 > (t = 1 - t) ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) *
					t + .984375)
			}), l("BounceInOut", function (t) { var e = .5 > t; return t = e ? 1 - 2 * t : 2 * t - 1, t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5 })), u("Circ", l("CircOut", function (t) { return Math.sqrt(1 - (t -= 1) * t) }), l("CircIn", function (t) { return -(Math.sqrt(1 - t * t) - 1) }), l("CircInOut", function (t) { return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1) })), s = function (e, i, s) {
				var r = h("easing." + e, function (t, e) {
				this._p1 =
					t || 1, this._p2 = e || s, this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0)
				}, !0), n = r.prototype = new t; return n.constructor = r, n.getRatio = i, n.config = function (t, e) { return new r(t, e) }, r
			}, u("Elastic", s("ElasticOut", function (t) { return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * a / this._p2) + 1 }, .3), s("ElasticIn", function (t) { return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2)) }, .3), s("ElasticInOut", function (t) {
				return 1 > (t *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2) :
					.5 * this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2) + 1
			}, .45)), u("Expo", l("ExpoOut", function (t) { return 1 - Math.pow(2, -10 * t) }), l("ExpoIn", function (t) { return Math.pow(2, 10 * (t - 1)) - .001 }), l("ExpoInOut", function (t) { return 1 > (t *= 2) ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1))) })), u("Sine", l("SineOut", function (t) { return Math.sin(t * o) }), l("SineIn", function (t) { return -Math.cos(t * o) + 1 }), l("SineInOut", function (t) { return -.5 * (Math.cos(Math.PI * t) - 1) })), h("easing.EaseLookup", { find: function (e) { return t.map[e] } },
				!0), _(r.SlowMo, "SlowMo", "ease,"), _(i, "RoughEase", "ease,"), _(e, "SteppedEase", "ease,"), f
	}, !0)
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()();

// TweenLite

(function (t, e) {
	var i = t.GreenSockGlobals = t.GreenSockGlobals || t; if (!i.TweenLite) {
		var s, n, r, a, o, l = function (t) { var e, s = t.split("."), n = i; for (e = 0; s.length > e; e++)n[s[e]] = n = n[s[e]] || {}; return n }, h = l("com.greensock"), _ = 1E-10, u = function (t) { var e, i = [], s = t.length; for (e = 0; e !== s; i.push(t[e++])); return i }, f = function () { }, m = function () { var t = Object.prototype.toString, e = t.call([]); return function (i) { return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e) } }(), p = {}, c = function (s, n, r, a) {
		this.sc =
			p[s] ? p[s].sc : [], p[s] = this, this.gsClass = null, this.func = r; var o = []; this.check = function (h) {
				for (var _, u, f, m, d = n.length, v = d; --d > -1;)(_ = p[n[d]] || new c(n[d], [])).gsClass ? (o[d] = _.gsClass, v--) : h && _.sc.push(this); if (0 === v && r) for (u = ("com.greensock." + s).split("."), f = u.pop(), m = l(u.join("."))[f] = this.gsClass = r.apply(r, o), a && (i[f] = m, "function" == typeof define && define.amd ? define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + s.split(".").pop(), [], function () { return m }) : s === e && "undefined" != typeof module && module.exports &&
					(module.exports = m)), d = 0; this.sc.length > d; d++)this.sc[d].check()
			}, this.check(!0)
		}, d = t._gsDefine = function (t, e, i, s) { return new c(t, e, i, s) }, v = h._class = function (t, e, i) { return e = e || function () { }, d(t, [], function () { return e }, i), e }; d.globals = i; var g = [0, 0, 1, 1], T = [], y = v("easing.Ease", function (t, e, i, s) { this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? g.concat(e) : g }, !0), w = y.map = {}, P = y.register = function (t, e, i, s) {
			for (var n, r, a, o, l = e.split(","), _ = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --_ >
				-1;)for (r = l[_], n = s ? v("easing." + r, null, !0) : h.easing[r] || {}, a = u.length; --a > -1;)o = u[a], w[r + "." + o] = w[o + r] = n[o] = t.getRatio ? t : t[o] || new t
		}; for (r = y.prototype, r._calcEnd = !1, r.getRatio = function (t) { if (this._func) return this._params[0] = t, this._func.apply(null, this._params); var e = this._type, i = this._power, s = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t); return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : .5 > t ? s / 2 : 1 - s / 2 }, s = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], n = s.length; --n > -1;)r =
			s[n] + ",Power" + n, P(new y(null, null, 1, n), r, "easeOut", !0), P(new y(null, null, 2, n), r, "easeIn" + (0 === n ? ",easeNone" : "")), P(new y(null, null, 3, n), r, "easeInOut"); w.linear = h.easing.Linear.easeIn, w.swing = h.easing.Quad.easeInOut; var b = v("events.EventDispatcher", function (t) { this._listeners = {}, this._eventTarget = t || this }); r = b.prototype, r.addEventListener = function (t, e, i, s, n) {
				n = n || 0; var r, l, h = this._listeners[t], _ = 0; for (null == h && (this._listeners[t] = h = []), l = h.length; --l > -1;)r = h[l], r.c === e && r.s === i ? h.splice(l, 1) : 0 === _ &&
					n > r.pr && (_ = l + 1); h.splice(_, 0, { c: e, s: i, up: s, pr: n }), this !== a || o || a.wake()
			}, r.removeEventListener = function (t, e) { var i, s = this._listeners[t]; if (s) for (i = s.length; --i > -1;)if (s[i].c === e) return s.splice(i, 1), void 0 }, r.dispatchEvent = function (t) { var e, i, s, n = this._listeners[t]; if (n) for (e = n.length, i = this._eventTarget; --e > -1;)s = n[e], s.up ? s.c.call(s.s || i, { type: t, target: i }) : s.c.call(s.s || i) }; var k = t.requestAnimationFrame, A = t.cancelAnimationFrame, S = Date.now || function () { return (new Date).getTime() }, x = S(); for (s = ["ms",
				"moz", "webkit", "o"], n = s.length; --n > -1 && !k;)k = t[s[n] + "RequestAnimationFrame"], A = t[s[n] + "CancelAnimationFrame"] || t[s[n] + "CancelRequestAnimationFrame"]; v("Ticker", function (t, e) {
					var i, s, n, r, l, h = this, u = S(), m = e !== !1 && k, p = 500, c = 33, d = function (t) { var e, a, o = S() - x; o > p && (u += o - c), x += o, h.time = (x - u) / 1E3, e = h.time - l, (!i || e > 0 || t === !0) && (h.frame++ , l += e + (e >= r ? .004 : r - e), a = !0), t !== !0 && (n = s(d)), a && h.dispatchEvent("tick") }; b.call(h), h.time = h.frame = 0, h.tick = function () { d(!0) }, h.lagSmoothing = function (t, e) {
					p = t || 1 / _, c = Math.min(e,
						p, 0)
					}, h.sleep = function () { null != n && (m && A ? A(n) : clearTimeout(n), s = f, n = null, h === a && (o = !1)) }, h.wake = function () { null !== n ? h.sleep() : h.frame > 10 && (x = S() - p + 5), s = 0 === i ? f : m && k ? k : function (t) { return setTimeout(t, 0 | 1E3 * (l - h.time) + 1) }, h === a && (o = !0), d(2) }, h.fps = function (t) { return arguments.length ? (i = t, r = 1 / (i || 60), l = this.time + r, h.wake(), void 0) : i }, h.useRAF = function (t) { return arguments.length ? (h.sleep(), m = t, h.fps(i), void 0) : m }, h.fps(t), setTimeout(function () { m && (!n || 5 > h.frame) && h.useRAF(!1) }, 1500)
				}), r = h.Ticker.prototype =
				new h.events.EventDispatcher, r.constructor = h.Ticker; var C = v("core.Animation", function (t, e) { if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = e.immediateRender === !0, this.data = e.data, this._reversed = e.reversed === !0, B) { o || a.wake(); var i = this.vars.useFrames ? q : B; i.add(this, i._time), this.vars.paused && this.paused(!0) } }); a = C.ticker = new h.Ticker, r = C.prototype, r._dirty = r._gc = r._initted = r._paused = !1, r._totalTime = r._time = 0, r._rawPrevTime =
					-1, r._next = r._last = r._onUpdate = r._timeline = r.timeline = null, r._paused = !1; var R = function () { o && S() - x > 2E3 && a.wake(), setTimeout(R, 2E3) }; R(), r.play = function (t, e) { return null != t && this.seek(t, e), this.reversed(!1).paused(!1) }, r.pause = function (t, e) { return null != t && this.seek(t, e), this.paused(!0) }, r.resume = function (t, e) { return null != t && this.seek(t, e), this.paused(!1) }, r.seek = function (t, e) { return this.totalTime(Number(t), e !== !1) }, r.restart = function (t, e) {
						return this.reversed(!1).paused(!1).totalTime(t ? -this._delay :
							0, e !== !1, !0)
					}, r.reverse = function (t, e) { return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1) }, r.render = function () { }, r.invalidate = function () { return this }, r.isActive = function () { var t, e = this._timeline, i = this._startTime; return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && i + this.totalDuration() / this._timeScale > t }, r._enabled = function (t, e) {
						return o || a.wake(), this._gc = !t, this._active = this.isActive(), e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime -
							this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1
					}, r._kill = function () { return this._enabled(!1, !1) }, r.kill = function (t, e) { return this._kill(t, e), this }, r._uncache = function (t) { for (var e = t ? this : this.timeline; e;)e._dirty = !0, e = e.timeline; return this }, r._swapSelfInParams = function (t) { for (var e = t.length, i = t.concat(); --e > -1;)"{self}" === t[e] && (i[e] = this); return i }, r.eventCallback = function (t, e, i, s) {
						if ("on" === (t || "").substr(0, 2)) {
							var n = this.vars; if (1 === arguments.length) return n[t]; null == e ? delete n[t] :
								(n[t] = e, n[t + "Params"] = m(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, n[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e)
						} return this
					}, r.delay = function (t) { return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay }, r.duration = function (t) {
						return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime *
							(t / this._duration), !0), this) : (this._dirty = !1, this._duration)
					}, r.totalDuration = function (t) { return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration }, r.time = function (t, e) { return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time }, r.totalTime = function (t, e, i) {
						if (o || a.wake(), !arguments.length) return this._totalTime; if (this._timeline) {
							if (0 > t && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
							this._dirty && this.totalDuration();
								var s = this._totalDuration, n = this._timeline; if (t > s && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : n._time) - (this._reversed ? s - t : t) / this._timeScale, n._dirty || this._uncache(!1), n._timeline) for (; n._timeline;)n._timeline._time !== (n._startTime + n._totalTime) / n._timeScale && n.totalTime(n._totalTime, !0), n = n._timeline
							} this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (this.render(t, e, !1), O.length && M())
						} return this
					}, r.progress = r.totalProgress = function (t, e) {
						return arguments.length ?
							this.totalTime(this.duration() * t, e) : this._time / this.duration()
					}, r.startTime = function (t) { return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime }, r.timeScale = function (t) {
						if (!arguments.length) return this._timeScale; if (t = t || _, this._timeline && this._timeline.smoothChildTiming) {
							var e = this._pauseTime, i = e || 0 === e ? e : this._timeline.totalTime(); this._startTime = i - (i - this._startTime) * this._timeScale /
								t
						} return this._timeScale = t, this._uncache(!1)
					}, r.reversed = function (t) { return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed }, r.paused = function (t) {
						if (!arguments.length) return this._paused; if (t != this._paused && this._timeline) {
						o || t || a.wake(); var e = this._timeline, i = e.rawTime(), s = i - this._pauseTime; !t && e.smoothChildTiming && (this._startTime += s, this._uncache(!1)),
							this._pauseTime = t ? i : null, this._paused = t, this._active = this.isActive(), !t && 0 !== s && this._initted && this.duration() && this.render(e.smoothChildTiming ? this._totalTime : (i - this._startTime) / this._timeScale, !0, !0)
						} return this._gc && !t && this._enabled(!0, !1), this
					}; var D = v("core.SimpleTimeline", function (t) { C.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0 }); r = D.prototype = new C, r.constructor = D, r.kill()._gc = !1, r._first = r._last = null, r._sortChildren = !1, r.add = r.insert = function (t, e) {
						var i, s; if (t._startTime =
							Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), i = this._last, this._sortChildren) for (s = t._startTime; i && i._startTime > s;)i = i._prev; return i ? (t._next = i._next, i._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = i, this._timeline && this._uncache(!0), this
					}, r._remove = function (t, e) {
						return t.timeline === this &&
							(e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, this._timeline && this._uncache(!0)), this
					}, r.render = function (t, e, i) {
						var s, n = this._first; for (this._totalTime = this._time = this._rawPrevTime = t; n;)s = n._next, (n._active || t >= n._startTime && !n._paused) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) *
							n._timeScale, e, i)), n = s
					}, r.rawTime = function () { return o || a.wake(), this._totalTime }; var I = v("TweenLite", function (e, i, s) {
						if (C.call(this, i, s), this.render = I.prototype.render, null == e) throw "Cannot tween a null target."; this.target = e = "string" != typeof e ? e : I.selector(e) || e; var n, r, a, o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType), l = this.vars.overwrite; if (this._overwrite = l = null == l ? Q[I.defaultOverwrite] : "number" == typeof l ? l >> 0 : Q[l], (o || e instanceof Array || e.push && m(e)) && "number" !=
							typeof e[0]) for (this._targets = a = u(e), this._propLookup = [], this._siblings = [], n = 0; a.length > n; n++)r = a[n], r ? "string" != typeof r ? r.length && r !== t && r[0] && (r[0] === t || r[0].nodeType && r[0].style && !r.nodeType) ? (a.splice(n--, 1), this._targets = a = a.concat(u(r))) : (this._siblings[n] = $(r, this, !1), 1 === l && this._siblings[n].length > 1 && K(r, this, null, 1, this._siblings[n])) : (r = a[n--] = I.selector(r), "string" == typeof r && a.splice(n + 1, 1)) : a.splice(n--, 1); else this._propLookup = {}, this._siblings = $(e, this, !1), 1 === l && this._siblings.length >
								1 && K(e, this, null, 1, this._siblings); (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -_, this.render(-this._delay))
					}, !0), E = function (e) { return e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType) }, z = function (t, e) { var i, s = {}; for (i in t) G[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!U[i] || U[i] && U[i]._autoCSS) || (s[i] = t[i], delete t[i]); t.css = s }; r = I.prototype = new C, r.constructor =
						I, r.kill()._gc = !1, r.ratio = 0, r._firstPT = r._targets = r._overwrittenProps = r._startAt = null, r._notifyPluginsOfEnabled = r._lazy = !1, I.version = "1.13.1", I.defaultEase = r._ease = new y(null, null, 1, 1), I.defaultOverwrite = "auto", I.ticker = a, I.autoSleep = !0, I.lagSmoothing = function (t, e) { a.lagSmoothing(t, e) }, I.selector = t.$ || t.jQuery || function (e) {
							var i = t.$ || t.jQuery; return i ? (I.selector = i, i(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ?
								e.substr(1) : e)
						}; var O = [], L = {}, N = I._internals = { isArray: m, isSelector: E, lazyTweens: O }, U = I._plugins = {}, F = N.tweenLookup = {}, j = 0, G = N.reservedProps = {
							ease: 1, delay: 1, overwrite: 1, onComplete: 1, onCompleteParams: 1, onCompleteScope: 1, useFrames: 1, runBackwards: 1, startAt: 1, onUpdate: 1, onUpdateParams: 1, onUpdateScope: 1, onStart: 1, onStartParams: 1, onStartScope: 1, onReverseComplete: 1, onReverseCompleteParams: 1, onReverseCompleteScope: 1, onRepeat: 1, onRepeatParams: 1, onRepeatScope: 1, easeParams: 1, yoyo: 1, immediateRender: 1, repeat: 1,
							repeatDelay: 1, data: 1, paused: 1, reversed: 1, autoCSS: 1, lazy: 1
						}, Q = { none: 0, all: 1, auto: 2, concurrent: 3, allOnStart: 4, preexisting: 5, "true": 1, "false": 0 }, q = C._rootFramesTimeline = new D, B = C._rootTimeline = new D, M = N.lazyRender = function () { var t = O.length; for (L = {}; --t > -1;)s = O[t], s && s._lazy !== !1 && (s.render(s._lazy, !1, !0), s._lazy = !1); O.length = 0 }; B._startTime = a.time, q._startTime = a.frame, B._active = q._active = !0, setTimeout(M, 1), C._updateRoot = I.render = function () {
							var t, e, i; if (O.length && M(), B.render((a.time - B._startTime) * B._timeScale,
								!1, !1), q.render((a.frame - q._startTime) * q._timeScale, !1, !1), O.length && M(), !(a.frame % 120)) { for (i in F) { for (e = F[i].tweens, t = e.length; --t > -1;)e[t]._gc && e.splice(t, 1); 0 === e.length && delete F[i] } if (i = B._first, (!i || i._paused) && I.autoSleep && !q._first && 1 === a._listeners.tick.length) { for (; i && i._paused;)i = i._next; i || a.sleep() } }
						}, a.addEventListener("tick", C._updateRoot); var $ = function (t, e, i) {
							var s, n, r = t._gsTweenID; if (F[r || (t._gsTweenID = r = "t" + j++)] || (F[r] = { target: t, tweens: [] }), e && (s = F[r].tweens, s[n = s.length] = e,
								i)) for (; --n > -1;)s[n] === e && s.splice(n, 1); return F[r].tweens
						}, K = function (t, e, i, s, n) {
							var r, a, o, l; if (1 === s || s >= 4) { for (l = n.length, r = 0; l > r; r++)if ((o = n[r]) !== e) o._gc || o._enabled(!1, !1) && (a = !0); else if (5 === s) break; return a } var h, u = e._startTime + _, f = [], m = 0, p = 0 === e._duration; for (r = n.length; --r > -1;)(o = n[r]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (h = h || H(e, 0, p), 0 === H(o, h, p) && (f[m++] = o)) : u >= o._startTime && o._startTime + o.totalDuration() / o._timeScale > u && ((p || !o._initted) && 2E-10 >= u - o._startTime || (f[m++] =
								o))); for (r = m; --r > -1;)o = f[r], 2 === s && o._kill(i, t) && (a = !0), (2 !== s || !o._firstPT && o._initted) && o._enabled(!1, !1) && (a = !0); return a
						}, H = function (t, e, i) { for (var s = t._timeline, n = s._timeScale, r = t._startTime; s._timeline;) { if (r += s._startTime, n *= s._timeScale, s._paused) return -100; s = s._timeline } return r /= n, r > e ? r - e : i && r === e || !t._initted && 2 * _ > r - e ? _ : (r += t.totalDuration() / t._timeScale / n) > e + _ ? 0 : r - e - _ }; r._init = function () {
							var t, e, i, s, n, r = this.vars, a = this._overwrittenProps, o = this._duration, l = !!r.immediateRender, h = r.ease;
							if (r.startAt) { this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), n = {}; for (s in r.startAt) n[s] = r.startAt[s]; if (n.overwrite = !1, n.immediateRender = !0, n.lazy = l && r.lazy !== !1, n.startAt = n.delay = null, this._startAt = I.to(this.target, 0, n), l) if (this._time > 0) this._startAt = null; else if (0 !== o) return } else if (r.runBackwards && 0 !== o) if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null; else {
								i = {}; for (s in r) G[s] && "autoCSS" !== s || (i[s] = r[s]); if (i.overwrite = 0, i.data = "isFromStart",
									i.lazy = l && r.lazy !== !1, i.immediateRender = l, this._startAt = I.to(this.target, 0, i), l) { if (0 === this._time) return } else this._startAt._init(), this._startAt._enabled(!1)
							} if (this._ease = h = h ? h instanceof y ? h : "function" == typeof h ? new y(h, r.easeParams) : w[h] || I.defaultEase : I.defaultEase, r.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, r.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets) for (t = this._targets.length; --t > -1;)this._initProps(this._targets[t],
								this._propLookup[t] = {}, this._siblings[t], a ? a[t] : null) && (e = !0); else e = this._initProps(this.target, this._propLookup, this._siblings, a); if (e && I._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), r.runBackwards) for (i = this._firstPT; i;)i.s += i.c, i.c = -i.c, i = i._next; this._onUpdate = r.onUpdate, this._initted = !0
						}, r._initProps = function (e, i, s, n) {
							var r, a, o, l, h, _; if (null == e) return !1; L[e._gsTweenID] && M(), this.vars.css || e.style && e !== t && e.nodeType && U.css && this.vars.autoCSS !==
								!1 && z(this.vars, e); for (r in this.vars) {
									if (_ = this.vars[r], G[r]) _ && (_ instanceof Array || _.push && m(_)) && -1 !== _.join("").indexOf("{self}") && (this.vars[r] = _ = this._swapSelfInParams(_, this)); else if (U[r] && (l = new U[r])._onInitTween(e, this.vars[r], this)) {
										for (this._firstPT = h = { _next: this._firstPT, t: l, p: "setRatio", s: 0, c: 1, f: !0, n: r, pg: !0, pr: l._priority }, a = l._overwriteProps.length; --a > -1;)i[l._overwriteProps[a]] = this._firstPT; (l._priority || l._onInitAllProps) && (o = !0), (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled =
											!0)
									} else this._firstPT = i[r] = h = { _next: this._firstPT, t: e, p: r, f: "function" == typeof e[r], n: r, pg: !1, pr: 0 }, h.s = h.f ? e[r.indexOf("set") || "function" != typeof e["get" + r.substr(3)] ? r : "get" + r.substr(3)]() : parseFloat(e[r]), h.c = "string" == typeof _ && "=" === _.charAt(1) ? parseInt(_.charAt(0) + "1", 10) * Number(_.substr(2)) : Number(_) - h.s || 0; h && h._next && (h._next._prev = h)
								} return n && this._kill(n, e) ? this._initProps(e, i, s, n) : this._overwrite > 1 && this._firstPT && s.length > 1 && K(e, this, i, this._overwrite, s) ? (this._kill(i, e), this._initProps(e,
									i, s, n)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (L[e._gsTweenID] = !0), o)
						}, r.render = function (t, e, i) {
							var s, n, r, a, o = this._time, l = this._duration, h = this._rawPrevTime; if (t >= l) this._totalTime = this._time = l, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (s = !0, n = "onComplete"), 0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > h || h === _) && h !== t && (i = !0, h > _ && (n = "onReverseComplete")), this._rawPrevTime =
								a = !e || t || h === t ? t : _); else if (1E-7 > t) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== o || 0 === l && h > 0 && h !== _) && (n = "onReverseComplete", s = this._reversed), 0 > t ? (this._active = !1, 0 === l && (this._initted || !this.vars.lazy || i) && (h >= 0 && (i = !0), this._rawPrevTime = a = !e || t || h === t ? t : _)) : this._initted || (i = !0); else if (this._totalTime = this._time = t, this._easeType) {
									var u = t / l, f = this._easeType, m = this._easePower; (1 === f || 3 === f && u >= .5) && (u = 1 - u), 3 === f && (u *= 2), 1 === m ? u *= u : 2 === m ? u *= u * u : 3 === m ?
										u *= u * u * u : 4 === m && (u *= u * u * u * u), this.ratio = 1 === f ? 1 - u : 2 === f ? u : .5 > t / l ? u / 2 : 1 - u / 2
								} else this.ratio = this._ease.getRatio(t / l); if (this._time !== o || i) {
									if (!this._initted) {
										if (this._init(), !this._initted || this._gc) return; if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = o, this._rawPrevTime = h, O.push(this), this._lazy = t, void 0; this._time && !s ? this.ratio = this._ease.getRatio(this._time / l) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 ===
											this._time ? 0 : 1))
									} for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0), 0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : n || (n = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === l) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || T))), r = this._firstPT; r;)r.f ? r.t[r.p](r.c * this.ratio + r.s) : r.t[r.p] = r.c * this.ratio + r.s, r = r._next; this._onUpdate && (0 > t && this._startAt && this._startTime && this._startAt.render(t, e, i),
										e || (this._time !== o || s) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || T)), n && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[n] && this.vars[n].apply(this.vars[n + "Scope"] || this, this.vars[n + "Params"] || T), 0 === l && this._rawPrevTime === _ && a !== _ && (this._rawPrevTime = 0))
								}
						}, r._kill = function (t, e) {
							if ("all" === t && (t = null), null == t && (null == e || e ===
								this.target)) return this._lazy = !1, this._enabled(!1, !1); e = "string" != typeof e ? e || this._targets || this.target : I.selector(e) || e; var i, s, n, r, a, o, l, h; if ((m(e) || E(e)) && "number" != typeof e[0]) for (i = e.length; --i > -1;)this._kill(t, e[i]) && (o = !0); else {
									if (this._targets) for (i = this._targets.length; --i > -1;) { if (e === this._targets[i]) { a = this._propLookup[i] || {}, this._overwrittenProps = this._overwrittenProps || [], s = this._overwrittenProps[i] = t ? this._overwrittenProps[i] || {} : "all"; break } } else {
										if (e !== this.target) return !1; a = this._propLookup,
											s = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
									} if (a) { l = t || a, h = t !== s && "all" !== s && t !== a && ("object" != typeof t || !t._tempKill); for (n in l) (r = a[n]) && (r.pg && r.t._kill(l) && (o = !0), r.pg && 0 !== r.t._overwriteProps.length || (r._prev ? r._prev._next = r._next : r === this._firstPT && (this._firstPT = r._next), r._next && (r._next._prev = r._prev), r._next = r._prev = null), delete a[n]), h && (s[n] = 1); !this._firstPT && this._initted && this._enabled(!1, !1) }
								} return o
						}, r.invalidate = function () {
							return this._notifyPluginsOfEnabled && I._onPluginEvent("_onDisable",
								this), this._firstPT = null, this._overwrittenProps = null, this._onUpdate = null, this._startAt = null, this._initted = this._active = this._notifyPluginsOfEnabled = this._lazy = !1, this._propLookup = this._targets ? {} : [], this
						}, r._enabled = function (t, e) {
							if (o || a.wake(), t && this._gc) { var i, s = this._targets; if (s) for (i = s.length; --i > -1;)this._siblings[i] = $(s[i], this, !0); else this._siblings = $(this.target, this, !0) } return C.prototype._enabled.call(this, t, e), this._notifyPluginsOfEnabled && this._firstPT ? I._onPluginEvent(t ? "_onEnable" :
								"_onDisable", this) : !1
						}, I.to = function (t, e, i) { return new I(t, e, i) }, I.from = function (t, e, i) { return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new I(t, e, i) }, I.fromTo = function (t, e, i, s) { return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new I(t, e, s) }, I.delayedCall = function (t, e, i, s, n) { return new I(e, 0, { delay: t, onComplete: e, onCompleteParams: i, onCompleteScope: s, onReverseComplete: e, onReverseCompleteParams: i, onReverseCompleteScope: s, immediateRender: !1, useFrames: n, overwrite: 0 }) },
							I.set = function (t, e) { return new I(t, 0, e) }, I.getTweensOf = function (t, e) { if (null == t) return []; t = "string" != typeof t ? t : I.selector(t) || t; var i, s, n, r; if ((m(t) || E(t)) && "number" != typeof t[0]) { for (i = t.length, s = []; --i > -1;)s = s.concat(I.getTweensOf(t[i], e)); for (i = s.length; --i > -1;)for (r = s[i], n = i; --n > -1;)r === s[n] && s.splice(i, 1) } else for (s = $(t).concat(), i = s.length; --i > -1;)(s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1); return s }, I.killTweensOf = I.killDelayedCallsTo = function (t, e, i) {
							"object" == typeof e && (i = e, e = !1); for (var s =
								I.getTweensOf(t, e), n = s.length; --n > -1;)s[n]._kill(i, t)
							}; var J = v("plugins.TweenPlugin", function (t, e) { this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = J.prototype }, !0); if (r = J.prototype, J.version = "1.10.1", J.API = 2, r._firstPT = null, r._addTween = function (t, e, i, s, n, r) {
								var a, o; return null != s && (a = "number" == typeof s || "=" !== s.charAt(1) ? Number(s) - i : parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2))) ? (this._firstPT = o = {
									_next: this._firstPT, t: t, p: e, s: i, c: a,
									f: "function" == typeof t[e], n: n || e, r: r
								}, o._next && (o._next._prev = o), o) : void 0
							}, r.setRatio = function (t) { for (var e, i = this._firstPT, s = 1E-6; i;)e = i.c * t + i.s, i.r ? e = Math.round(e) : s > e && e > -s && (e = 0), i.f ? i.t[i.p](e) : i.t[i.p] = e, i = i._next }, r._kill = function (t) {
								var e, i = this._overwriteProps, s = this._firstPT; if (null != t[this._propName]) this._overwriteProps = []; else for (e = i.length; --e > -1;)null != t[i[e]] && i.splice(e, 1); for (; s;)null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT ===
									s && (this._firstPT = s._next)), s = s._next; return !1
							}, r._roundProps = function (t, e) { for (var i = this._firstPT; i;)(t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e), i = i._next }, I._onPluginEvent = function (t, e) { var i, s, n, r, a, o = e._firstPT; if ("_onInitAllProps" === t) { for (; o;) { for (a = o._next, s = n; s && s.pr > o.pr;)s = s._next; (o._prev = s ? s._prev : r) ? o._prev._next = o : n = o, (o._next = s) ? s._prev = o : r = o, o = a } o = e._firstPT = n } for (; o;)o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next; return i }, J.activate =
								function (t) { for (var e = t.length; --e > -1;)t[e].API === J.API && (U[(new t[e])._propName] = t[e]); return !0 }, d.plugin = function (t) {
									if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition."; var e, i = t.propName, s = t.priority || 0, n = t.overwriteProps, r = { init: "_onInitTween", set: "setRatio", kill: "_kill", round: "_roundProps", initAll: "_onInitAllProps" }, a = v("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function () { J.call(this, i, s), this._overwriteProps = n || [] }, t.global === !0), o = a.prototype = new J(i); o.constructor =
										a, a.API = t.API; for (e in r) "function" == typeof t[e] && (o[r[e]] = t[e]); return a.version = t.version, J.activate([a]), a
								}, s = t._gsQueue) { for (n = 0; s.length > n; n++)s[n](); for (r in p) p[r].func || t.console.log("GSAP encountered missing dependency: com.greensock." + r) } o = !1
	}
})("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenLite");

// canvas

(function () {
	var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true; (function () {
		var lastTime = 0; var vendors = ["ms", "moz", "webkit", "o"]; for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) { window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"]; window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"] } if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
			var currTime =
				(new Date).getTime(); var timeToCall = Math.max(0, 16 - (currTime - lastTime)); var id = window.setTimeout(function () { callback(currTime + timeToCall) }, timeToCall); lastTime = currTime + timeToCall; return id
		}; if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) { clearTimeout(id) }
	})(); initHeader(); initAnimation(); addListeners(); function initHeader() {
		width = window.innerWidth; height = window.innerHeight; target = { x: width / 2, y: height / 2 }; largeHeader = document.getElementById("page-loader"); largeHeader.style.height =
			height + "px"; canvas = document.getElementById("demo-canvas"); canvas.width = width; canvas.height = height; ctx = canvas.getContext("2d"); points = []; for (var x = 0; x < width; x = x + width / 5)for (var y = 0; y < height; y = y + height / 5) { var px = x + Math.random() * width / 5; var py = y + Math.random() * height / 5; var p = { x: px, originX: px, y: py, originY: py }; points.push(p) } for (var i = 0; i < points.length; i++) {
				var closest = []; var p1 = points[i]; for (var j = 0; j < points.length; j++) {
					var p2 = points[j]; if (!(p1 == p2)) {
						var placed = false; for (var k = 0; k < 5; k++)if (!placed) if (closest[k] ==
							undefined) { closest[k] = p2; placed = true } for (var k = 0; k < 5; k++)if (!placed) if (getDistance(p1, p2) < getDistance(p1, closest[k])) { closest[k] = p2; placed = true }
					}
				} p1.closest = closest
			} for (var i in points) { var c = new Circle(points[i], 2 + Math.random() * 2, "rgba(255,255,255,0.3)"); points[i].circle = c }
	} function addListeners() { if (!("ontouchstart" in window)) window.addEventListener("mousemove", mouseMove); window.addEventListener("scroll", scrollCheck); window.addEventListener("resize", resize) } function mouseMove(e) {
		var posx = posy = 0;
		if (e.pageX || e.pageY) { posx = e.pageX; posy = e.pageY } else if (e.clientX || e.clientY) { posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop } target.x = posx; target.y = posy
	} function scrollCheck() { if (document.body.scrollTop > height) animateHeader = false; else animateHeader = true } function resize() { width = window.innerWidth; height = window.innerHeight; largeHeader.style.height = height + "px"; canvas.width = width; canvas.height = height }
	function initAnimation() { animate(); for (var i in points) shiftPoint(points[i]) } function animate() {
		if (animateHeader) {
			ctx.clearRect(0, 0, width, height); for (var i in points) {
				if (Math.abs(getDistance(target, points[i])) < 4E3) { points[i].active = .3; points[i].circle.active = .6 } else if (Math.abs(getDistance(target, points[i])) < 2E4) { points[i].active = .1; points[i].circle.active = .3 } else if (Math.abs(getDistance(target, points[i])) < 4E4) { points[i].active = .02; points[i].circle.active = .1 } else {
					points[i].active = 0; points[i].circle.active =
						0
				} drawLines(points[i]); points[i].circle.draw()
			}
		} window.requestAnimationFrame(animate)
	} function shiftPoint(p) { TweenLite.to(p, 1 + 1 * Math.random(), { x: p.originX - 50 + Math.random() * 100, y: p.originY - 50 + Math.random() * 100, ease: Circ.easeInOut, onComplete: function () { shiftPoint(p) } }) } function drawLines(p) { if (!p.active) return; for (var i in p.closest) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.closest[i].x, p.closest[i].y); ctx.strokeStyle = "rgba(156,217,249," + p.active + ")"; ctx.stroke() } } function Circle(pos, rad, color) {
		var _this =
			this; (function () { _this.pos = pos || null; _this.radius = rad || null; _this.color = color || null })(); this.draw = function () { if (!_this.active) return; ctx.beginPath(); ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false); ctx.fillStyle = "rgba(156,217,249," + _this.active + ")"; ctx.fill() }
	} function getDistance(p1, p2) { return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) }
})();