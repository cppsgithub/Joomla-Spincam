!function () {
	function defineDummyParentFunction() {
		if (window.SunFw) {
			SunFw.parent = function () {};
		} else {
			setTimeout(defineDummyParentFunction, 100);
		}
	}
	defineDummyParentFunction();
}();
React.extendClass = function (parent, classProps) {
	if (window[parent]) {
		for (var p in window[parent].prototype) {
			if (p == 'constructor') {
				continue;
			}
			if (window[parent].prototype.hasOwnProperty(p) && typeof window[parent].prototype[p] == 'function') {
				if (classProps.hasOwnProperty(p) && typeof classProps[p] == 'function') {
					var exp = /SunFw[\s\t\r\n]*\.[\s\t\r\n]*parent[\s\t\r\n]*\(([^\r\n]*)\)[\s\t\r\n]*;*/,
					    func = classProps[p].toString(),
					    match = func.match(exp);
					while (match) {
						if (SunFwString.trim(match[1]) != '') {
							func = func.replace(match[0], parent + '.prototype.' + p + '.call(this, ' + match[1] + ');');
						} else {
							func = func.replace(match[0], parent + '.prototype.' + p + '.apply(this, arguments);');
						}
						match = func.match(exp);
					}
					eval('classProps[p] = ' + func);
				} else {
					classProps[p] = window[parent].prototype[p];
				}
			} else if (p == 'propTypes' && !classProps.hasOwnProperty(p)) {
				classProps[p] = window[parent].prototype[p];
			}
		}
	}
	return React.createClass(classProps);
};
React.findComponent = function (node) {
	for (var p in node) {
		if (p.startsWith('__reactInternalInstance$')) {
			var internalNode = node[p]._currentElement,
			    componentWrapper = internalNode._owner,
			    component = componentWrapper._instance;
			return component;
		}
	}
	return null;
};
window.SunFwAjax = {
	toQueryString: function (obj, prefix) {
		if (typeof obj != 'object') {
			return obj;
		}
		var str = [];
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + '[' + p + ']' : p,
				    v = obj[p];
				str.push(typeof v == 'object' ? this.toQueryString(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
			}
		}
		return str.join('&');
	},
	request: function (url, callback, postData) {
		var XMLHttpFactories = [function () {
			return new XMLHttpRequest();
		}, function () {
			return new ActiveXObject('Msxml2.XMLHTTP');
		}, function () {
			return new ActiveXObject('Msxml3.XMLHTTP');
		}, function () {
			return new ActiveXObject('Microsoft.XMLHTTP');
		}];
		function createXMLHTTPObject() {
			var xmlhttp = false;
			for (var i = 0; i < XMLHttpFactories.length; i++) {
				try {
					xmlhttp = XMLHttpFactories[i]();
				} catch (e) {
					continue;
				}
				break;
			}
			return xmlhttp;
		}
		if (SunFw.requesting && SunFw.requesting[url]) {
			return SunFw.requesting[url].push(callback);
		}
		var req = createXMLHTTPObject();
		if (!req) {
			if (typeof callback == 'function') {
				callback(req);
			}
			return;
		}
		var method = postData ? 'POST' : 'GET';
		req.open(method, url, true);
		if (postData) {
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		req.onreadystatechange = function () {
			if (req.readyState != 4) {
				return;
			}
			if (parseInt(req.status.toString().substr(0, 1)) != 2 && req.status != 304) {
				var res = {};
				for (var p in req) {
					res[p] = req[p];
				}
				if ([401, 403].indexOf(req.status) > -1 && url.indexOf('index.php') > -1) {
					return window.location.reload();
				} else {
					res.response = res.responseText = req.status + ' ' + req.statusText;
				}
				req = res;
			}
			if (req.responseText.indexOf('{') > -1 && req.responseText.indexOf('}') > 0) {
				try {
					req.responseJSON = JSON.parse(req.responseText);
				} catch (e) {
					var match = req.responseText.match(/\{[\s\t\r\n]*"[^"]+"[\s\t\r\n]*:[\s\t\r\n]*([\{\[\d"]|true|false).*\}$/i);
					if (match) {
						try {
							req.responseJSON = JSON.parse(match[0]);
						} catch (e) {
							req.responseJSON = {
								type: 'error',
								data: req.responseText
							};
						}
					}
				}
			}
			for (var i = 0, n = SunFw.requesting[url].length; i < n; i++) {
				if (typeof SunFw.requesting[url][i] == 'function') {
					SunFw.requesting[url][i](req);
				}
			}
			delete SunFw.requesting[url];
		};
		if (req.readyState == 4) {
			return req.onreadystatechange();
		}
		req.send(this.toQueryString(postData));
		SunFw.requesting = SunFw.requesting || {};
		SunFw.requesting[url] = SunFw.requesting[url] || [];
		SunFw.requesting[url].push(callback);
		return req;
	},
	loadStylesheet: function (file, callback) {
		if (SunFw.loadedStylesheets && SunFw.loadedStylesheets[file]) {
			if (SunFw.loadedStylesheets[file] === true) {
				if (typeof callback == 'function') {
					callback();
				}
			} else {
				SunFw.loadedStylesheets[file].push(callback);
			}
			return;
		}
		var stylesheet = document.createElement('link');
		stylesheet.rel = 'stylesheet';
		stylesheet.href = file;
		stylesheet.type = 'text/css';
		stylesheet.async = 1;
		stylesheet.onload = function (event) {
			for (var i = 0, n = SunFw.loadedStylesheets[file].length; i < n; i++) {
				if (typeof SunFw.loadedStylesheets[file][i] == 'function') {
					SunFw.loadedStylesheets[file][i]();
				}
			}
			SunFw.loadedStylesheets[file] = true;
		};
		stylesheet.onreadystatechange = function () {
			if (this.readyState == 'complete' || this.readyState == 'loaded') {
				stylesheet.onload();
			}
		};
		stylesheet.onerror = function (event) {
			console.log('Failed to load stylesheet file ' + file, event);
		};
		SunFw.loadedStylesheets = SunFw.loadedStylesheets || {};
		SunFw.loadedStylesheets[file] = SunFw.loadedStylesheets[file] || [];
		SunFw.loadedStylesheets[file].push(callback);
		document.body.appendChild(stylesheet);
	},
	loadScript: function (file, callback, type) {
		if (file.indexOf('/') < 0 && SunFw.urls[file]) {
			file = SunFw.urls[file];
		}
		if (SunFw.loadedScripts && SunFw.loadedScripts[file]) {
			if (SunFw.loadedScripts[file] === true) {
				if (typeof callback == 'function') {
					callback();
				}
			} else {
				SunFw.loadedScripts[file].push(callback);
			}
			return;
		}
		var onload = function () {
			for (var i = 0, n = SunFw.loadedScripts[file].length; i < n; i++) {
				if (typeof SunFw.loadedScripts[file][i] == 'function') {
					SunFw.loadedScripts[file][i]();
				}
			}
			SunFw.loadedScripts[file] = true;
		};
		SunFw.loadedScripts = SunFw.loadedScripts || {};
		SunFw.loadedScripts[file] = SunFw.loadedScripts[file] || [];
		SunFw.loadedScripts[file].push(callback);
		if (type != 'babel') {
			var script = document.createElement('script');
			script.src = file;
			script.async = 1;
			script.onload = onload;
			script.onreadystatechange = function () {
				if (this.readyState == 'complete' || this.readyState == 'loaded') {
					script.onload();
				}
			};
			script.onerror = function (event) {
				console.log('Failed to load script file ' + file, event);
			};
			document.body.appendChild(script);
		} else {
			this.request(file, function (req) {
				if (window.babel === undefined) {
					this.loadScript('babel', function (script, callback) {
						babel.run(script);
						callback();
					}.bind(this, req.responseText, onload));
				} else {
					babel.run(req.responseText);
					onload();
				}
			}.bind(this));
		}
	},
	downloadFile: function (remote_url, progressBar, callback) {
		var file_name,
		    file_size,
		    last_size,
		    timer,
		    now,
		    idle,
		    progressBarInner = progressBar.querySelector('[role="progressbar"]'),
		    progressBarText = progressBar.querySelector('.percentage'),
		    check = function () {
			var url = remote_url + (remote_url.indexOf('?') < 0 ? '?' : '&') + 'task=status&size=' + file_size;
			this.request(url, function (req) {
				try {
					var res = req.responseJSON;
					if (res.type == 'error') {
						return finalize(req);
					}
					if (res.data.file != file_name) {
						return finalize();
					}
					if (file_size > 0) {
						var percentage = Math.round(parseInt(res.data.size) / file_size * 100);
						progressBarInner.style.width = percentage + '%';
						progressBarText.textContent = percentage + '%';
						if (res.data.done) {
							return finalize();
						}
					} else {
						var current = parseInt(res.data.size);
						progressBarText.textContent = Math.round(current / 1024) + 'KB';
						if (res.data.done) {
							progressBarInner.style.width = '100%';
							return finalize();
						}
					}
					timer = setTimeout(check, 50);
					now = new Date().getTime() / 1000;
					if (last_size && last_size == res.data.size) {
						if (!idle) {
							idle = now;
						} else if (now - idle > 300) {
							return finalize();
						}
					}
					last_size = res.data.size;
				} catch (e) {
					return finalize();
				}
			}.bind(this));
		}.bind(this),
		    finalize = function (req) {
			if (timer) {
				clearTimeout(timer);
			}
			var finish = function (req) {
				progressBar.classList.add('hidden');
				progressBarInner.className = progressBarInner.className.replace(' progress-bar-striped active', '');
				if (typeof callback == 'function') {
					callback(req);
				}
			};
			if (req) {
				return finish(req);
			}
			this.request(remote_url + (remote_url.indexOf('?') < 0 ? '?' : '&') + 'task=complete', finish);
		}.bind(this);
		progressBarInner.className += ' progress-bar-striped active';
		progressBarInner.style.width = '0%';
		progressBarText.textContent = '0%';
		progressBar.classList.remove('hidden');
		this.request(remote_url, function (req) {
			try {
				var res;
				if (res = req.responseText.match(/\{"[^:]+":.+\}/)) {
					res = JSON.parse(res[0]);
				} else {
					res = {
						type: 'error',
						data: req.responseText
					};
				}
				if (res.type == 'error') {
					return finalize(req);
				}
				if (res.data.done) {
					return finalize();
				}
				if (res.data.file) {
					file_name = res.data.file;
				} else {
					return finalize();
				}
				if (res.data.size) {
					file_size = res.data.size;
				}
				timer = setTimeout(check, 50);
			} catch (e) {
				return finalize();
			}
		}.bind(this));
	}
};
window.SunFwEvent = {
	handlers: {},
	add: function (el, evt, fn) {
		if (typeof el.addEventListener == 'function') {
			el.addEventListener(evt, fn, false);
		} else if (typeof el.attachEvent == 'function') {
			el.attachEvent(evt, fn);
		} else {
			this.handlers[el] = this.handlers[el] || {};
			this.handlers[el][evt] = this.handlers[el][evt] || [];
			this.handlers[el][evt].push(fn);
		}
	},
	remove: function (el, evt, fn) {
		if (typeof el.removeEventListener == 'function') {
			el.removeEventListener(evt, fn, false);
		} else if (typeof el.detachEvent == 'function') {
			el.detachEvent(evt, fn);
		} else {
			if (this.handlers[el] && this.handlers[el][evt]) {
				for (var i = 0, n = this.handlers[el][evt].length; i < n; i++) {
					if (this.handlers[el][evt][i] === fn) {
						delete this.handlers[el][evt][i];
					}
				}
			}
		}
	},
	trigger: function (el, evt) {
		var event = { target: el, type: evt };
		if (typeof el.dispatchEvent == 'function') {
			event = new Event(evt);
			el.dispatchEvent(event);
		} else if (typeof el.fireEvent == 'function') {
			event = doc.createEventObject();
			el.fireEvent('on' + evt, event);
		} else {
			if (this.handlers[el] && this.handlers[el][evt]) {
				for (var i = 0, n = this.handlers[el][evt].length; i < n; i++) {
					if (typeof this.handlers[el][evt][i] == 'function') {
						this.handlers[el][evt][i](event);
					}
				}
			}
		}
	}
};
window.SunFwModal = {
	get: function (state, reuse) {
		SunFw.modals = SunFw.modals || [];
		var modal,
		    n = SunFw.modals.length;
		if (n) {
			for (var i = 0; i < n; i++) {
				if (SunFw.modals[i].props.preserve) {
					continue;
				} else if (reuse || SunFw.modals[i].refs.mountedDOMNode.style.display == 'none') {
					modal = SunFw.modals[i];
					break;
				}
			}
		}
		if (!modal) {
			var id = SunFwString.toId('modal', true),
			    container = document.querySelector('#sunfw-modals'),
			    element = document.createElement('div');
			if (!container) {
				container = document.createElement('div');
				container.id = 'sunfw-modals';
				document.body.appendChild(container);
			}
			element.id = id + '_wrapper';
			container.appendChild(element);
			modal = ReactDOM.render(React.createElement(SunFwComponentModal, { id: id }), element);
			SunFw.modals.push(modal);
		}
		if (!state) {
			state = {};
		}
		if (state.show === undefined) {
			state.show = true;
		}
		if (state['class']) {
			state.className = state['class'];
			delete state['class'];
		}
		if (!state.buttons) {
			state.buttons = 'default';
		}
		if (!state.width) {
			modal.state.width = '';
		}
		if (!state.height) {
			modal.state.height = '';
		}
		modal.setState(state);
		return modal;
	}
};
window.SunFwStorage = {
	getNextIndex: function (items) {
		var max = -1;
		for (var index in items) {
			if (items.hasOwnProperty(index) && parseInt(index) > max) {
				max = index;
			}
		}
		return ++max;
	}
};
window.SunFwString = {
	trim: function (str) {
		return str.replace(/^([\s\t\r\n]+)?(.+)([\s\t\r\n]+)?$/g, '$2');
	},
	parse: function (str, raw) {
		if (typeof str == 'string') {
			if (SunFw.text[str]) {
				str = SunFw.text[str];
			}
			if (!raw && str.match(/(<\/?[a-zA-Z0-9\-_]+[^>]*\/?>|&#?[a-z0-9]+;)/)) {
				if (window.babel) {
					str = this.trim(str);
					str = str.replace(/ class=(['"\{])/g, ' className=$1');
					str = str.replace(/<input([\s\t\r\n]*)([^>]*)\/>/g, '<input$1$2>');
					str = str.replace(/<input([\s\t\r\n]*)([^>]*)>/g, '<input$1$2 />');
					if (!str.match(/^<[a-zA-Z0-9\-_]+/) || !str.match(/(\/>|<\/[a-zA-Z0-9\-_]+)>$/)) {
						str = '<span>' + str + '</span>';
					}
					var trans = babel.transform(str);
					if (trans.code) {
						str = eval(trans.code);
					}
				} else {
					SunFwAjax.loadScript('babel', this.loadingBabel ? null : function () {
						var component = React.findComponent(document.getElementById('sunfw-template-admin'));
						if (component) {
							component.forceUpdate();
						}
					});
					this.loadingBabel = true;
					str = str.replace(/(<\/?[a-zA-Z0-9\-_]+[^>]*\/?>|&#?[a-z0-9]+;)/g, '');
				}
			}
		}
		return str;
	},
	toId: function (str, unique) {
		var id = typeof str == 'string' ? this.toLatin(str).replace(/[^a-zA-Z0-9\-]+/g, '-').toLowerCase() : '';
		if (unique || typeof str != 'string' || str == '') {
			id += '_' + Math.round(parseInt(new Date().getTime()) * Math.random());
		}
		return id;
	},
	capitalize: function (str) {
		var words = str.split(/\s+/);
		for (var i = 0, n = words.length; i < n; i++) {
			words[i] = words[i].replace(/^[a-z]/, function (firstLetter) {
				return firstLetter.toUpperCase();
			});
		}
		return words.join(' ');
	},
	toCamelCase: function (str, ucfirst) {
		str = str.replace(/[^a-zA-Z0-9\s\-\._]+/g, '');
		return str.replace(/(?:\s|[A-Z]|\b\w)/g, function (letter, index) {
			return ucfirst && index == 0 || index > 0 ? letter.toUpperCase() : letter.toLowerCase();
		}).replace(/[\s\-\._]+/g, '');
	},
	toLatin: function (str) {
		window.latin_character_map = window.latin_character_map || { 'Á': 'A', 'Ă': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ǎ': 'A', 'Â': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ä': 'A', 'Ǟ': 'A', 'Ȧ': 'A', 'Ǡ': 'A', 'Ạ': 'A', 'Ȁ': 'A', 'À': 'A', 'Ả': 'A', 'Ȃ': 'A', 'Ā': 'A', 'Ą': 'A', 'Å': 'A', 'Ǻ': 'A', 'Ḁ': 'A', 'Ⱥ': 'A', 'Ã': 'A', 'Ꜳ': 'AA', 'Æ': 'AE', 'Ǽ': 'AE', 'Ǣ': 'AE', 'Ꜵ': 'AO', 'Ꜷ': 'AU', 'Ꜹ': 'AV', 'Ꜻ': 'AV', 'Ꜽ': 'AY', 'Ḃ': 'B', 'Ḅ': 'B', 'Ɓ': 'B', 'Ḇ': 'B', 'Ƀ': 'B', 'Ƃ': 'B', 'Ć': 'C', 'Č': 'C', 'Ç': 'C', 'Ḉ': 'C', 'Ĉ': 'C', 'Ċ': 'C', 'Ƈ': 'C', 'Ȼ': 'C', 'Ď': 'D', 'Ḑ': 'D', 'Ḓ': 'D', 'Ḋ': 'D', 'Ḍ': 'D', 'Ɗ': 'D', 'Ḏ': 'D', 'ǲ': 'D', 'ǅ': 'D', 'Đ': 'D', 'Ƌ': 'D', 'Ǳ': 'DZ', 'Ǆ': 'DZ', 'É': 'E', 'Ĕ': 'E', 'Ě': 'E', 'Ȩ': 'E', 'Ḝ': 'E', 'Ê': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ḙ': 'E', 'Ë': 'E', 'Ė': 'E', 'Ẹ': 'E', 'Ȅ': 'E', 'È': 'E', 'Ẻ': 'E', 'Ȇ': 'E', 'Ē': 'E', 'Ḗ': 'E', 'Ḕ': 'E', 'Ę': 'E', 'Ɇ': 'E', 'Ẽ': 'E', 'Ḛ': 'E', 'Ꝫ': 'ET', 'Ḟ': 'F', 'Ƒ': 'F', 'Ǵ': 'G', 'Ğ': 'G', 'Ǧ': 'G', 'Ģ': 'G', 'Ĝ': 'G', 'Ġ': 'G', 'Ɠ': 'G', 'Ḡ': 'G', 'Ǥ': 'G', 'Ḫ': 'H', 'Ȟ': 'H', 'Ḩ': 'H', 'Ĥ': 'H', 'Ⱨ': 'H', 'Ḧ': 'H', 'Ḣ': 'H', 'Ḥ': 'H', 'Ħ': 'H', 'Í': 'I', 'Ĭ': 'I', 'Ǐ': 'I', 'Î': 'I', 'Ï': 'I', 'Ḯ': 'I', 'İ': 'I', 'Ị': 'I', 'Ȉ': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ȋ': 'I', 'Ī': 'I', 'Į': 'I', 'Ɨ': 'I', 'Ĩ': 'I', 'Ḭ': 'I', 'Ꝺ': 'D', 'Ꝼ': 'F', 'Ᵹ': 'G', 'Ꞃ': 'R', 'Ꞅ': 'S', 'Ꞇ': 'T', 'Ꝭ': 'IS', 'Ĵ': 'J', 'Ɉ': 'J', 'Ḱ': 'K', 'Ǩ': 'K', 'Ķ': 'K', 'Ⱪ': 'K', 'Ꝃ': 'K', 'Ḳ': 'K', 'Ƙ': 'K', 'Ḵ': 'K', 'Ꝁ': 'K', 'Ꝅ': 'K', 'Ĺ': 'L', 'Ƚ': 'L', 'Ľ': 'L', 'Ļ': 'L', 'Ḽ': 'L', 'Ḷ': 'L', 'Ḹ': 'L', 'Ⱡ': 'L', 'Ꝉ': 'L', 'Ḻ': 'L', 'Ŀ': 'L', 'Ɫ': 'L', 'ǈ': 'L', 'Ł': 'L', 'Ǉ': 'LJ', 'Ḿ': 'M', 'Ṁ': 'M', 'Ṃ': 'M', 'Ɱ': 'M', 'Ń': 'N', 'Ň': 'N', 'Ņ': 'N', 'Ṋ': 'N', 'Ṅ': 'N', 'Ṇ': 'N', 'Ǹ': 'N', 'Ɲ': 'N', 'Ṉ': 'N', 'Ƞ': 'N', 'ǋ': 'N', 'Ñ': 'N', 'Ǌ': 'NJ', 'Ó': 'O', 'Ŏ': 'O', 'Ǒ': 'O', 'Ô': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ö': 'O', 'Ȫ': 'O', 'Ȯ': 'O', 'Ȱ': 'O', 'Ọ': 'O', 'Ő': 'O', 'Ȍ': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Ơ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ȏ': 'O', 'Ꝋ': 'O', 'Ꝍ': 'O', 'Ō': 'O', 'Ṓ': 'O', 'Ṑ': 'O', 'Ɵ': 'O', 'Ǫ': 'O', 'Ǭ': 'O', 'Ø': 'O', 'Ǿ': 'O', 'Õ': 'O', 'Ṍ': 'O', 'Ṏ': 'O', 'Ȭ': 'O', 'Ƣ': 'OI', 'Ꝏ': 'OO', 'Ɛ': 'E', 'Ɔ': 'O', 'Ȣ': 'OU', 'Ṕ': 'P', 'Ṗ': 'P', 'Ꝓ': 'P', 'Ƥ': 'P', 'Ꝕ': 'P', 'Ᵽ': 'P', 'Ꝑ': 'P', 'Ꝙ': 'Q', 'Ꝗ': 'Q', 'Ŕ': 'R', 'Ř': 'R', 'Ŗ': 'R', 'Ṙ': 'R', 'Ṛ': 'R', 'Ṝ': 'R', 'Ȑ': 'R', 'Ȓ': 'R', 'Ṟ': 'R', 'Ɍ': 'R', 'Ɽ': 'R', 'Ꜿ': 'C', 'Ǝ': 'E', 'Ś': 'S', 'Ṥ': 'S', 'Š': 'S', 'Ṧ': 'S', 'Ş': 'S', 'Ŝ': 'S', 'Ș': 'S', 'Ṡ': 'S', 'Ṣ': 'S', 'Ṩ': 'S', 'Ť': 'T', 'Ţ': 'T', 'Ṱ': 'T', 'Ț': 'T', 'Ⱦ': 'T', 'Ṫ': 'T', 'Ṭ': 'T', 'Ƭ': 'T', 'Ṯ': 'T', 'Ʈ': 'T', 'Ŧ': 'T', 'Ɐ': 'A', 'Ꞁ': 'L', 'Ɯ': 'M', 'Ʌ': 'V', 'Ꜩ': 'TZ', 'Ú': 'U', 'Ŭ': 'U', 'Ǔ': 'U', 'Û': 'U', 'Ṷ': 'U', 'Ü': 'U', 'Ǘ': 'U', 'Ǚ': 'U', 'Ǜ': 'U', 'Ǖ': 'U', 'Ṳ': 'U', 'Ụ': 'U', 'Ű': 'U', 'Ȕ': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ư': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ȗ': 'U', 'Ū': 'U', 'Ṻ': 'U', 'Ų': 'U', 'Ů': 'U', 'Ũ': 'U', 'Ṹ': 'U', 'Ṵ': 'U', 'Ꝟ': 'V', 'Ṿ': 'V', 'Ʋ': 'V', 'Ṽ': 'V', 'Ꝡ': 'VY', 'Ẃ': 'W', 'Ŵ': 'W', 'Ẅ': 'W', 'Ẇ': 'W', 'Ẉ': 'W', 'Ẁ': 'W', 'Ⱳ': 'W', 'Ẍ': 'X', 'Ẋ': 'X', 'Ý': 'Y', 'Ŷ': 'Y', 'Ÿ': 'Y', 'Ẏ': 'Y', 'Ỵ': 'Y', 'Ỳ': 'Y', 'Ƴ': 'Y', 'Ỷ': 'Y', 'Ỿ': 'Y', 'Ȳ': 'Y', 'Ɏ': 'Y', 'Ỹ': 'Y', 'Ź': 'Z', 'Ž': 'Z', 'Ẑ': 'Z', 'Ⱬ': 'Z', 'Ż': 'Z', 'Ẓ': 'Z', 'Ȥ': 'Z', 'Ẕ': 'Z', 'Ƶ': 'Z', 'Ĳ': 'IJ', 'Œ': 'OE', 'ᴀ': 'A', 'ᴁ': 'AE', 'ʙ': 'B', 'ᴃ': 'B', 'ᴄ': 'C', 'ᴅ': 'D', 'ᴇ': 'E', 'ꜰ': 'F', 'ɢ': 'G', 'ʛ': 'G', 'ʜ': 'H', 'ɪ': 'I', 'ʁ': 'R', 'ᴊ': 'J', 'ᴋ': 'K', 'ʟ': 'L', 'ᴌ': 'L', 'ᴍ': 'M', 'ɴ': 'N', 'ᴏ': 'O', 'ɶ': 'OE', 'ᴐ': 'O', 'ᴕ': 'OU', 'ᴘ': 'P', 'ʀ': 'R', 'ᴎ': 'N', 'ᴙ': 'R', 'ꜱ': 'S', 'ᴛ': 'T', 'ⱻ': 'E', 'ᴚ': 'R', 'ᴜ': 'U', 'ᴠ': 'V', 'ᴡ': 'W', 'ʏ': 'Y', 'ᴢ': 'Z', 'á': 'a', 'ă': 'a', 'ắ': 'a', 'ặ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ǎ': 'a', 'â': 'a', 'ấ': 'a', 'ậ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ä': 'a', 'ǟ': 'a', 'ȧ': 'a', 'ǡ': 'a', 'ạ': 'a', 'ȁ': 'a', 'à': 'a', 'ả': 'a', 'ȃ': 'a', 'ā': 'a', 'ą': 'a', 'ᶏ': 'a', 'ẚ': 'a', 'å': 'a', 'ǻ': 'a', 'ḁ': 'a', 'ⱥ': 'a', 'ã': 'a', 'ꜳ': 'aa', 'æ': 'ae', 'ǽ': 'ae', 'ǣ': 'ae', 'ꜵ': 'ao', 'ꜷ': 'au', 'ꜹ': 'av', 'ꜻ': 'av', 'ꜽ': 'ay', 'ḃ': 'b', 'ḅ': 'b', 'ɓ': 'b', 'ḇ': 'b', 'ᵬ': 'b', 'ᶀ': 'b', 'ƀ': 'b', 'ƃ': 'b', 'ɵ': 'o', 'ć': 'c', 'č': 'c', 'ç': 'c', 'ḉ': 'c', 'ĉ': 'c', 'ɕ': 'c', 'ċ': 'c', 'ƈ': 'c', 'ȼ': 'c', 'ď': 'd', 'ḑ': 'd', 'ḓ': 'd', 'ȡ': 'd', 'ḋ': 'd', 'ḍ': 'd', 'ɗ': 'd', 'ᶑ': 'd', 'ḏ': 'd', 'ᵭ': 'd', 'ᶁ': 'd', 'đ': 'd', 'ɖ': 'd', 'ƌ': 'd', 'ı': 'i', 'ȷ': 'j', 'ɟ': 'j', 'ʄ': 'j', 'ǳ': 'dz', 'ǆ': 'dz', 'é': 'e', 'ĕ': 'e', 'ě': 'e', 'ȩ': 'e', 'ḝ': 'e', 'ê': 'e', 'ế': 'e', 'ệ': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ḙ': 'e', 'ë': 'e', 'ė': 'e', 'ẹ': 'e', 'ȅ': 'e', 'è': 'e', 'ẻ': 'e', 'ȇ': 'e', 'ē': 'e', 'ḗ': 'e', 'ḕ': 'e', 'ⱸ': 'e', 'ę': 'e', 'ᶒ': 'e', 'ɇ': 'e', 'ẽ': 'e', 'ḛ': 'e', 'ꝫ': 'et', 'ḟ': 'f', 'ƒ': 'f', 'ᵮ': 'f', 'ᶂ': 'f', 'ǵ': 'g', 'ğ': 'g', 'ǧ': 'g', 'ģ': 'g', 'ĝ': 'g', 'ġ': 'g', 'ɠ': 'g', 'ḡ': 'g', 'ᶃ': 'g', 'ǥ': 'g', 'ḫ': 'h', 'ȟ': 'h', 'ḩ': 'h', 'ĥ': 'h', 'ⱨ': 'h', 'ḧ': 'h', 'ḣ': 'h', 'ḥ': 'h', 'ɦ': 'h', 'ẖ': 'h', 'ħ': 'h', 'ƕ': 'hv', 'í': 'i', 'ĭ': 'i', 'ǐ': 'i', 'î': 'i', 'ï': 'i', 'ḯ': 'i', 'ị': 'i', 'ȉ': 'i', 'ì': 'i', 'ỉ': 'i', 'ȋ': 'i', 'ī': 'i', 'į': 'i', 'ᶖ': 'i', 'ɨ': 'i', 'ĩ': 'i', 'ḭ': 'i', 'ꝺ': 'd', 'ꝼ': 'f', 'ᵹ': 'g', 'ꞃ': 'r', 'ꞅ': 's', 'ꞇ': 't', 'ꝭ': 'is', 'ǰ': 'j', 'ĵ': 'j', 'ʝ': 'j', 'ɉ': 'j', 'ḱ': 'k', 'ǩ': 'k', 'ķ': 'k', 'ⱪ': 'k', 'ꝃ': 'k', 'ḳ': 'k', 'ƙ': 'k', 'ḵ': 'k', 'ᶄ': 'k', 'ꝁ': 'k', 'ꝅ': 'k', 'ĺ': 'l', 'ƚ': 'l', 'ɬ': 'l', 'ľ': 'l', 'ļ': 'l', 'ḽ': 'l', 'ȴ': 'l', 'ḷ': 'l', 'ḹ': 'l', 'ⱡ': 'l', 'ꝉ': 'l', 'ḻ': 'l', 'ŀ': 'l', 'ɫ': 'l', 'ᶅ': 'l', 'ɭ': 'l', 'ł': 'l', 'ǉ': 'lj', 'ſ': 's', 'ẜ': 's', 'ẛ': 's', 'ẝ': 's', 'ḿ': 'm', 'ṁ': 'm', 'ṃ': 'm', 'ɱ': 'm', 'ᵯ': 'm', 'ᶆ': 'm', 'ń': 'n', 'ň': 'n', 'ņ': 'n', 'ṋ': 'n', 'ȵ': 'n', 'ṅ': 'n', 'ṇ': 'n', 'ǹ': 'n', 'ɲ': 'n', 'ṉ': 'n', 'ƞ': 'n', 'ᵰ': 'n', 'ᶇ': 'n', 'ɳ': 'n', 'ñ': 'n', 'ǌ': 'nj', 'ó': 'o', 'ŏ': 'o', 'ǒ': 'o', 'ô': 'o', 'ố': 'o', 'ộ': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ö': 'o', 'ȫ': 'o', 'ȯ': 'o', 'ȱ': 'o', 'ọ': 'o', 'ő': 'o', 'ȍ': 'o', 'ò': 'o', 'ỏ': 'o', 'ơ': 'o', 'ớ': 'o', 'ợ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ȏ': 'o', 'ꝋ': 'o', 'ꝍ': 'o', 'ⱺ': 'o', 'ō': 'o', 'ṓ': 'o', 'ṑ': 'o', 'ǫ': 'o', 'ǭ': 'o', 'ø': 'o', 'ǿ': 'o', 'õ': 'o', 'ṍ': 'o', 'ṏ': 'o', 'ȭ': 'o', 'ƣ': 'oi', 'ꝏ': 'oo', 'ɛ': 'e', 'ᶓ': 'e', 'ɔ': 'o', 'ᶗ': 'o', 'ȣ': 'ou', 'ṕ': 'p', 'ṗ': 'p', 'ꝓ': 'p', 'ƥ': 'p', 'ᵱ': 'p', 'ᶈ': 'p', 'ꝕ': 'p', 'ᵽ': 'p', 'ꝑ': 'p', 'ꝙ': 'q', 'ʠ': 'q', 'ɋ': 'q', 'ꝗ': 'q', 'ŕ': 'r', 'ř': 'r', 'ŗ': 'r', 'ṙ': 'r', 'ṛ': 'r', 'ṝ': 'r', 'ȑ': 'r', 'ɾ': 'r', 'ᵳ': 'r', 'ȓ': 'r', 'ṟ': 'r', 'ɼ': 'r', 'ᵲ': 'r', 'ᶉ': 'r', 'ɍ': 'r', 'ɽ': 'r', 'ↄ': 'c', 'ꜿ': 'c', 'ɘ': 'e', 'ɿ': 'r', 'ś': 's', 'ṥ': 's', 'š': 's', 'ṧ': 's', 'ş': 's', 'ŝ': 's', 'ș': 's', 'ṡ': 's', 'ṣ': 's', 'ṩ': 's', 'ʂ': 's', 'ᵴ': 's', 'ᶊ': 's', 'ȿ': 's', 'ɡ': 'g', 'ᴑ': 'o', 'ᴓ': 'o', 'ᴝ': 'u', 'ť': 't', 'ţ': 't', 'ṱ': 't', 'ț': 't', 'ȶ': 't', 'ẗ': 't', 'ⱦ': 't', 'ṫ': 't', 'ṭ': 't', 'ƭ': 't', 'ṯ': 't', 'ᵵ': 't', 'ƫ': 't', 'ʈ': 't', 'ŧ': 't', 'ᵺ': 'th', 'ɐ': 'a', 'ᴂ': 'ae', 'ǝ': 'e', 'ᵷ': 'g', 'ɥ': 'h', 'ʮ': 'h', 'ʯ': 'h', 'ᴉ': 'i', 'ʞ': 'k', 'ꞁ': 'l', 'ɯ': 'm', 'ɰ': 'm', 'ᴔ': 'oe', 'ɹ': 'r', 'ɻ': 'r', 'ɺ': 'r', 'ⱹ': 'r', 'ʇ': 't', 'ʌ': 'v', 'ʍ': 'w', 'ʎ': 'y', 'ꜩ': 'tz', 'ú': 'u', 'ŭ': 'u', 'ǔ': 'u', 'û': 'u', 'ṷ': 'u', 'ü': 'u', 'ǘ': 'u', 'ǚ': 'u', 'ǜ': 'u', 'ǖ': 'u', 'ṳ': 'u', 'ụ': 'u', 'ű': 'u', 'ȕ': 'u', 'ù': 'u', 'ủ': 'u', 'ư': 'u', 'ứ': 'u', 'ự': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ȗ': 'u', 'ū': 'u', 'ṻ': 'u', 'ų': 'u', 'ᶙ': 'u', 'ů': 'u', 'ũ': 'u', 'ṹ': 'u', 'ṵ': 'u', 'ᵫ': 'ue', 'ꝸ': 'um', 'ⱴ': 'v', 'ꝟ': 'v', 'ṿ': 'v', 'ʋ': 'v', 'ᶌ': 'v', 'ⱱ': 'v', 'ṽ': 'v', 'ꝡ': 'vy', 'ẃ': 'w', 'ŵ': 'w', 'ẅ': 'w', 'ẇ': 'w', 'ẉ': 'w', 'ẁ': 'w', 'ⱳ': 'w', 'ẘ': 'w', 'ẍ': 'x', 'ẋ': 'x', 'ᶍ': 'x', 'ý': 'y', 'ŷ': 'y', 'ÿ': 'y', 'ẏ': 'y', 'ỵ': 'y', 'ỳ': 'y', 'ƴ': 'y', 'ỷ': 'y', 'ỿ': 'y', 'ȳ': 'y', 'ẙ': 'y', 'ɏ': 'y', 'ỹ': 'y', 'ź': 'z', 'ž': 'z', 'ẑ': 'z', 'ʑ': 'z', 'ⱬ': 'z', 'ż': 'z', 'ẓ': 'z', 'ȥ': 'z', 'ẕ': 'z', 'ᵶ': 'z', 'ᶎ': 'z', 'ʐ': 'z', 'ƶ': 'z', 'ɀ': 'z', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ĳ': 'ij', 'œ': 'oe', 'ﬆ': 'st', 'ₐ': 'a', 'ₑ': 'e', 'ᵢ': 'i', 'ⱼ': 'j', 'ₒ': 'o', 'ᵣ': 'r', 'ᵤ': 'u', 'ᵥ': 'v', 'ₓ': 'x' };
		return str.replace(/[^A-Za-z0-9\[\] ]/g, function (a) {
			return latin_character_map[a] || a;
		});
	}
};
window.SunFwMixinBase = React.createClass({
	displayName: 'SunFwMixinBase',
	propTypes: {
		id: React.PropTypes.string,
		url: React.PropTypes.string
	},
	componentWillMount: function () {
		if (this.props.url && this.props.url != '') {
			SunFwAjax.request(this.props.url, function (req) {
				if (req.responseJSON) {
					this.setState(req.responseJSON.data);
				}
			}.bind(this));
		}
	},
	render: function () {
		return null;
	},
	componentDidMount: function () {
		this.initActions();
	},
	componentDidUpdate: function (oldProps, oldState) {
		this.initActions();
	},
	initActions: function () {
		if (this.props && this.props.id && this.props.id != '') {
			var mountedNode = this.refs.mountedDOMNode || ReactDOM.findDOMNode(this);
			if (mountedNode && (!mountedNode.id || mountedNode.id != this.props.id)) {
				mountedNode.id = this.props.id;
			}
		}
	}
});
window.SunFwMixinInput = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		form: React.PropTypes.element,
		value: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.array, React.PropTypes.object, React.PropTypes.number, React.PropTypes.string]),
		setting: React.PropTypes.string,
		control: React.PropTypes.object
	},
	getDefaultProps: function () {
		return {
			id: '',
			form: null,
			value: '',
			setting: '',
			control: {}
		};
	},
	getInitialState: function () {
		return {
			value: this.props.value
		};
	},
	componentWillReceiveProps: function (newProps) {
		if (this.props.value != newProps.value) {
			this.setState({
				value: newProps.value
			});
		}
	},
	componentWillMount: function () {
		this.prepareControl();
	},
	componentWillUpdate: function () {
		this.prepareControl();
	},
	prepareControl: function () {
		this.label = '';
		this.description = '';
		if (this.props.control.label && this.props.control.label != '') {
			this.label = SunFwString.parse(this.props.control.label);
		}
		if (this.props.control.description && this.props.control.description != '') {
			this.description = SunFwString.parse(this.props.control.description);
		}
		this.tooltip = '';
		if (this.props.control.hint && this.props.control.hint != '') {
			this.tooltip = React.createElement(SunFwElementTooltip, { hint: SunFwString.parse(this.props.control.hint, true) });
		}
	},
	initActions: function () {
		SunFw.parent();
		if (this.state.chosen !== false && this.props.control.chosen !== false) {
			this.loadingChosenTimer && clearTimeout(this.loadingChosenTimer);
			this.loadingChosenTimer = setTimeout(function () {
				SunFwAjax.loadStylesheet(SunFw.urls.root + '/media/jui/css/chosen.css');
				SunFwAjax.loadScript(SunFw.urls.root + '/media/jui/js/chosen.jquery.min.js', this.initChosen.bind(this));
			}.bind(this), 500);
		}
	},
	initChosen: function (options, force) {
		var modal;
		try {
			modal = this.refs.wrapper || ReactDOM.findDOMNode(this);
		} catch (e) {
		}
		if (modal) {
			while (!modal.classList.contains('modal') && modal.nodeName != 'BODY') {
				modal = modal.parentNode;
			}
			if (modal.nodeName != 'BODY') {
				return;
			}
		}
		var options = options || {
			disable_search: true
		};
		var selects;
		try {
			selects = (this.refs.wrapper || ReactDOM.findDOMNode(this)).querySelectorAll('select');
		} catch (e) {
			selects = [];
		}
		for (var i = 0; i < selects.length; i++) {
			if ((this.changed || force) && selects[i]._initialized_chosen) {
				delete this.changed;
				delete selects[i]._initialized_chosen;
				jQuery(selects[i]).chosen('destroy');
			}
			if (!selects[i]._initialized_chosen) {
				jQuery(selects[i]).chosen(options).on('change', function (event, params) {
					this.change(event.target.name, params.selected);
				}.bind(this));
				selects[i]._initialized_chosen = true;
			}
		}
	},
	componentWillUnmount: function () {
		var selects = (this.refs.wrapper || ReactDOM.findDOMNode(this)).querySelectorAll('select');
		for (var i = 0; i < selects.length; i++) {
			if (selects[i]._initialized_chosen) {
				delete selects[i]._initialized_chosen;
				jQuery(selects[i]).chosen('destroy');
			}
		}
	},
	change: function (event) {
		var setting = this.props.setting,
		    value;
		if (arguments.length == 2 && arguments[0] == setting) {
			value = arguments[1];
		}
		else {
				var control = event.target ? event.target : event;
				if (control.nodeName == 'SELECT') {
					if (control.multiple) {
						var options = control.querySelectorAll('option');
						value = [];
						for (var i = 0, n = options.length; i < n; i++) {
							if (options[i].selected) {
								value.push(options[i].value);
							}
						}
					} else {
						value = control.options[control.selectedIndex].value;
					}
				} else {
					if (control.nodeName == 'INPUT') {
						if (control.type == 'checkbox') {
							if (control.name.substr(-2) == '[]') {
								value = [];
								var container = control.parentNode;
								while (!container.classList.contains('form-group') && container.nodeName != 'BODY') {
									container = container.parentNode;
								}
								var checkboxes = container.querySelectorAll('input');
								for (var i = 0, n = checkboxes.length; i < n; i++) {
									if (checkboxes[i].checked) {
										value.push(checkboxes[i].value);
									}
								}
							} else {
								value = control.checked ? control.value : null;
							}
						} else if (control.type == 'radio') {
							value = control.checked ? control.value : null;
						} else {
							value = control.value;
						}
					} else {
						value = control.value;
					}
				}
			}
		if (typeof value == 'string' && value.match(/^[\[\{].+[\}\]]$/)) {
			value = JSON.parse(value);
		}
		if (this.props.form.skipSaving) {
			this.setState({ value: value });
		}
		this.props.form.updateState(setting, value);
	},
	resetState: function (event) {
		if (this.state.value != '') {
			this.change(this.props.setting, '');
		}
	},
	renderPopupInput: function (title) {
		return React.createElement(
			'div',
			{
				key: this.props.id,
				className: 'form-group'
			},
			React.createElement(
				'label',
				null,
				this.label,
				this.tooltip
			),
			React.createElement(
				'div',
				{ className: 'input-group snfw-input-popup' },
				React.createElement('input', {
					ref: 'field',
					name: this.props.setting,
					value: this.value || this.state.value,
					disabled: 'disabled',
					className: 'form-control'
				}),
				React.createElement(
					'span',
					{ className: 'input-group-addon' },
					React.createElement(
						'a',
						{ href: '#', onClick: this.popupForm.bind(this, title || this.props.control.type) },
						'...'
					)
				),
				React.createElement(
					'span',
					{ className: 'input-group-addon' },
					React.createElement(
						'a',
						{ href: '#', onClick: this.resetState },
						React.createElement('i', { className: 'fa fa-remove' })
					)
				)
			)
		);
	},
	popupForm: function (title) {
		var data = this.popupData();
		if (!data.form && data.rows) {
			data = { form: data };
		}
		if (!data.rel) {
			data.rel = this;
		}
		if (!data.editor && this.props.form.props.editor) {
			data.editor = this.props.form.props.editor;
		}
		if (!data.values) {
			data.values = this.state.value;
		}
		if (!data.form['class']) {
			data.form['class'] = 'container-fluid';
		} else {
			data.form['class'] += ' container-fluid';
		}
		SunFwModal.get({
			id: SunFwString.toId(title),
			title: title,
			type: 'form',
			content: data,
			className: ''
		});
	},
	saveSettings: function (values) {
		this.change(this.props.setting, values);
	}
});
