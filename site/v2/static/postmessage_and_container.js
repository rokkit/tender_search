/**
The MIT License

Copyright (c) 2010 Daniel Park (http://metaweb.com, http://postmessage.freebaseapps.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
**/

/* 
* cookie
*/

var NO_JQUERY = {};
(function(window, $, undefined) {

        if (!("console" in window)) {
            var c = window.console = {};
            c.log = c.warn = c.error = c.debug = function(){};
        }

        if ($ === NO_JQUERY) {
            // jQuery is optional
            $ = {
                fn: {},
                extend: function() {
                    var a = arguments[0];
                    for (var i=1,len=arguments.length; i<len; i++) {
                        var b = arguments[i];
                        for (var prop in b) {
                            a[prop] = b[prop];
                        }
                    }
                    return a;
                }
            };
        }

        $.fn.pm = function() {
            console.log("usage: \nto send:    $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])");
            return this;
        };

        // send postmessage
        $.pm = window.pm = function(options) {
            pm.send(options);
        };

        // bind postmessage handler
        $.pm.bind = window.pm.bind = function(type, fn, origin, hash, async_reply) {
            pm.bind(type, fn, origin, hash, async_reply === true);
        };

        // unbind postmessage handler
        $.pm.unbind = window.pm.unbind = function(type, fn) {
            pm.unbind(type, fn);
        };

        // default postmessage origin on bind
        $.pm.origin = window.pm.origin = null;

        // default postmessage polling if using location hash to pass postmessages
        $.pm.poll = window.pm.poll = 200;

        var pm = {

            send: function(options) {
                var o = $.extend({}, pm.defaults, options),
                target = o.target;
                if (!o.target) {
                    console.warn("postmessage target window required");
                    return;
                }
                if (!o.type) {
                    console.warn("postmessage type required");
                    return;
                }
                var msg = {data:o.data, type:o.type};
                if (o.success) {
                    msg.callback = pm._callback(o.success);
                }
                if (o.error) {
                    msg.errback = pm._callback(o.error);
                }
                if (("postMessage" in target) && !o.hash) {
                    pm._bind();
                    target.postMessage(JSON.stringify(msg), o.origin || '*');
                }
                else {
                    pm.hash._bind();
                    pm.hash.send(o, msg);
                }
            },

            bind: function(type, fn, origin, hash, async_reply) {
                pm._replyBind ( type, fn, origin, hash, async_reply );
            },

            _replyBind: function(type, fn, origin, hash, isCallback) {
                if (("postMessage" in window) && !hash) {
                    pm._bind();
                }
                else {
                    pm.hash._bind();
                }
                var l = pm.data("listeners.postmessage");
                if (!l) {
                    l = {};
                    pm.data("listeners.postmessage", l);
                }
                var fns = l[type];
                if (!fns) {
                    fns = [];
                    l[type] = fns;
                }
                fns.push({fn:fn, callback: isCallback, origin:origin || $.pm.origin});
            },

            unbind: function(type, fn) {
                var l = pm.data("listeners.postmessage");
                if (l) {
                    if (type) {
                        if (fn) {
                            // remove specific listener
                            var fns = l[type];
                            if (fns) {
                                var m = [];
                                for (var i=0,len=fns.length; i<len; i++) {
                                    var o = fns[i];
                                    if (o.fn !== fn) {
                                        m.push(o);
                                    }
                                }
                                l[type] = m;
                            }
                        }
                        else {
                            // remove all listeners by type
                            delete l[type];
                        }
                    }
                    else {
                        // unbind all listeners of all type
                        for (var i in l) {
                            delete l[i];
                        }
                    }
                }
            },

            data: function(k, v) {
                if (v === undefined) {
                    return pm._data[k];
                }
                pm._data[k] = v;
                return v;
            },

            _data: {},

            _CHARS: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),

            _random: function() {
                var r = [];
                for (var i=0; i<32; i++) {
                    r[i] = pm._CHARS[0 | Math.random() * 32];
                };
                return r.join("");
            },

            _callback: function(fn) {
                var cbs = pm.data("callbacks.postmessage");
                if (!cbs) {
                    cbs = {};
                    pm.data("callbacks.postmessage", cbs);
                }
                var r = pm._random();
                cbs[r] = fn;
                return r;
            },

            _bind: function() {
                // are we already listening to message events on this w?
                if (!pm.data("listening.postmessage")) {
                    if (window.addEventListener) {
                        window.addEventListener("message", pm._dispatch, false);
                    }
                    else if (window.attachEvent) {
                        window.attachEvent("onmessage", pm._dispatch);
                    }
                    pm.data("listening.postmessage", 1);
                }
            },

            _dispatch: function(e) {
                //console.log("$.pm.dispatch", e, this);
                try {
                    var msg = JSON.parse(e.data);
                }
                catch (ex) {
                    //console.warn("postmessage data invalid json: ", ex);
                    return;
                }
                if (!msg.type) {
                    console.warn("postmessage message type required");
                    return;
                }
                var cbs = pm.data("callbacks.postmessage") || {},
                cb = cbs[msg.type];
                if (cb) {
                    cb(msg.data);
                }
                else {
                    var l = pm.data("listeners.postmessage") || {};
                    var fns = l[msg.type] || [];
                    for (var i=0,len=fns.length; i<len; i++) {
                        var o = fns[i];
                        if (o.origin && o.origin !== '*' && e.origin !== o.origin) {
                            console.warn("postmessage message origin mismatch", e.origin, o.origin);
                            if (msg.errback) {
                                // notify post message errback
                                var error = {
                                    message: "postmessage origin mismatch",
                                    origin: [e.origin, o.origin]
                                };
                                pm.send({target:e.source, data:error, type:msg.errback});
                            }
                            continue;
                        }

                        function sendReply ( data ) {
                            if (msg.callback) {
                                pm.send({target:e.source, data:data, type:msg.callback});
                            }
                        }

                        try {
                            if ( o.callback ) {
                                o.fn(msg.data, sendReply, e);
                            } else {
                                sendReply ( o.fn(msg.data, e) );
                            }
                        }
                        catch (ex) {
                            if (msg.errback) {
                                // notify post message errback
                                pm.send({target:e.source, data:ex, type:msg.errback});
                            } else {
                                throw ex;
                            }
                        }
                    };
                }
            }
        };

        // location hash polling
        pm.hash = {

            send: function(options, msg) {
                //console.log("hash.send", target_window, options, msg);
                var target_window = options.target,
                target_url = options.url;
                if (!target_url) {
                    console.warn("postmessage target window url is required");
                    return;
                }
                target_url = pm.hash._url(target_url);
                var source_window,
                source_url = pm.hash._url(window.location.href);
                if (window == target_window.parent) {
                    source_window = "parent";
                }
                else {
                    try {
                        for (var i=0,len=parent.frames.length; i<len; i++) {
                            var f = parent.frames[i];
                            if (f == window) {
                                source_window = i;
                                break;
                            }
                        };
                    }
                    catch(ex) {
                        // Opera: security error trying to access parent.frames x-origin
                        // juse use window.name
                        source_window = window.name;
                    }
                }
                if (source_window == null) {
                    console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list");
                    return;
                }
                var hashmessage = {
                    "x-requested-with": "postmessage",
                    source: {
                        name: source_window,
                        url: source_url
                    },
                    postmessage: msg
                };
                var hash_id = "#x-postmessage-id=" + pm._random();
                target_window.location = target_url + hash_id + encodeURIComponent(JSON.stringify(hashmessage));
            },

            _regex: /^\#x\-postmessage\-id\=(\w{32})/,

            _regex_len: "#x-postmessage-id=".length + 32,

            _bind: function() {
                // are we already listening to message events on this w?
                if (!pm.data("polling.postmessage")) {
                    setInterval(function() {
                            var hash = "" + window.location.hash,
                            m = pm.hash._regex.exec(hash);
                            if (m) {
                                var id = m[1];
                                if (pm.hash._last !== id) {
                                    pm.hash._last = id;
                                    pm.hash._dispatch(hash.substring(pm.hash._regex_len));
                                }
                            }
                        }, $.pm.poll || 200);
                    pm.data("polling.postmessage", 1);
                }
            },

            _dispatch: function(hash) {
                if (!hash) {
                    return;
                }
                try {
                    hash = JSON.parse(decodeURIComponent(hash));
                    if (!(hash['x-requested-with'] === 'postmessage' &&
                            hash.source && hash.source.name != null && hash.source.url && hash.postmessage)) {
                        // ignore since hash could've come from somewhere else
                        return;
                    }
                }
                catch (ex) {
                    // ignore since hash could've come from somewhere else
                    return;
                }
                var msg = hash.postmessage,
                cbs = pm.data("callbacks.postmessage") || {},
                cb = cbs[msg.type];
                if (cb) {
                    cb(msg.data);
                }
                else {
                    var source_window;
                    if (hash.source.name === "parent") {
                        source_window = window.parent;
                    }
                    else {
                        source_window = window.frames[hash.source.name];
                    }
                    var l = pm.data("listeners.postmessage") || {};
                    var fns = l[msg.type] || [];
                    for (var i=0,len=fns.length; i<len; i++) {
                        var o = fns[i];
                        if (o.origin) {
                            var origin = /https?\:\/\/[^\/]*/.exec(hash.source.url)[0];
                            if (o.origin !== '*' && origin !== o.origin) {
                                console.warn("postmessage message origin mismatch", origin, o.origin);
                                if (msg.errback) {
                                    // notify post message errback
                                    var error = {
                                        message: "postmessage origin mismatch",
                                        origin: [origin, o.origin]
                                    };
                                    pm.send({target:source_window, data:error, type:msg.errback, hash:true, url:hash.source.url});
                                }
                                continue;
                            }
                        }

                        function sendReply ( data ) {
                            if (msg.callback) {
                                pm.send({target:source_window, data:data, type:msg.callback, hash:true, url:hash.source.url});
                            }
                        }

                        try {
                            if ( o.callback ) {
                                o.fn(msg.data, sendReply);
                            } else {
                                sendReply ( o.fn(msg.data) );
                            }
                        }
                        catch (ex) {
                            if (msg.errback) {
                                // notify post message errback
                                pm.send({target:source_window, data:ex, type:msg.errback, hash:true, url:hash.source.url});
                            } else {
                                throw ex;
                            }
                        }
                    };
                }
            },

            _url: function(url) {
                // url minus hash part
                return (""+url).replace(/#.*$/, "");
            }

        };

        $.extend(pm, {
                defaults: {
                    target: null,  /* target window (required) */
                    url: null,     /* target window url (required if no window.postMessage or hash == true) */
                    type: null,    /* message type (required) */
                    data: null,    /* message data (required) */
                    success: null, /* success callback (optional) */
                    error: null,   /* error callback (optional) */
                    origin: "*",   /* postmessage origin (optional) */
                    hash: false    /* use location hash for message passing (optional) */
                }
        });

})(this, typeof jQuery === "undefined" ? NO_JQUERY : jQuery);

/**
* http://www.JSON.org/json2.js
**/
if (! ("JSON" in window && window.JSON)){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());


(function ($) {
	
        if ($ === NO_JQUERY) {
            // jQuery is optional
            $ = {
                fn: {},
                extend: function() {
                    var a = arguments[0];
                    for (var i=1,len=arguments.length; i<len; i++) {
                        var b = arguments[i];
                        for (var prop in b) {
                            a[prop] = b[prop];
                        }
                    }
                    return a;
                }
            };
        }

    pm.bind('header-ready', function() {
		// Скрипты для хэдера
		var header = document.getElementById('header_frame');

		if ( header != null ) {

			var addEvent =  window.attachEvent||window.addEventListener;
			
			addEvent('resize', function() {
				pm({
					target: header.contentWindow,
					type: 'resizeParent',
					data: {},
					success: function(data) {},
					url: document.referrer
				});
			});
			pm.bind('resaiz_frame', function(data) {
				var frameElement = header,
					val = data['value'] === 'bodyHeight' ? document.body.offsetHeight : data['value'];

				if (data['onlyFrame']) {
					frameElement.style[data.param] = val + 'px';
					frameElement.parentNode.style.zIndex = evpFuncMaxzIndex();

				} else {
					frameElement.style[data.param] = val + 'px';
					frameElement.parentNode.style.zIndex = evpFuncMaxzIndex();
				}
				return data;
			});

			pm.bind('resaiz_content', function(data) {
				/*var contentElement = document.getElementsByClassName('page-content-container');
				for ( var i=0; i < contentElement.length; i++  ) {
					contentElement[i].style[data['param']] = data['value'];
				}
				*/
				 document.body.style.overflowY = 'visible';
				document.documentElement.style.overflowY = 'visible';
				header.style.overflow = 'hidden';
				header.setAttribute('scrolling', 'no');
				return data;
			});

		

			addEvent('load', function() {

				pm({
					target: header.contentWindow,
					type: 'request_resize_header',
					url: document.referrer
				});

			});
			
			pm.bind('frameMaxHeight', function() {
				//выставляем высоту фрейма = высоте окна
				var winH = window.offsetHeight;
				header.style.height = winH;
				header.style.overflow = 'scroll';
				header.setAttribute('scrolling', 'auto');
				//посылаем во фрейм высоту окна, чтобы выставить высоту меню
				pm({
					target: header.contentWindow,
					type: 'frameMaxHeight__content',
					data: winH,
					success: function() {
						 document.body.style.overflowY = 'hidden';
						 document.documentElement.style.overflowY = 'hidden';
					},
					url: document.referrer
				});
			});
			
			var footer = document.getElementById('footer_frame');

			pm({
				target: footer.contentWindow,
				type: 'request_resize_footer',
				url: document.referrer
			});
			
			/*setTimeout(function(){ footerMaxWidth(); }, 100);
			
			function footerMaxWidth() {
				var
					container = $('.page-content-container').filter(':visible').filter(function() {
				    	return $(this).height() > 0;
					}).filter(':first');
					
				//var firstChildren 
					
				var footerMaxWidth = container.children().width() + 30;
				
				//var footerMaxWidth = $('.page-content-container').filter(':visible:first').children().width();
				pm({
					target: footer.contentWindow,
					type: 'footerMaxWidth',
					data: footerMaxWidth
				});
			}
			
			$(window).resize(function() {
				footerMaxWidth();
			});
			*/

		}
	});
	

	pm.bind('footer-ready', function() {

		// Скрипты для футера
		var footer = document.getElementById('footer_frame');

		if ( footer != null ) {

			pm.bind('resize_footer', function(data) {
				for (prop in data) {
					footer.style[prop] = data[prop];
				}
			});

		}
			pm.bind('blindVersion', function(data) {
				if (data.blindVersion) {
					// Вызов версии для слабовидящих в основном фрейме
					window.location.search = "special=Y";
				} else {
					// Отмена версии для слабовидящих в основном фрейме
					window.location.search = "special=N";
				}

				// Шлем привет хедеру, если он есть

				var header = document.getElementById('header_frame');

				if ( header != null ) {
					pm({
						target: header.contentWindow,
						type: 'blindVersion',
						data: data,
						success: function(data) {},
						url: document.referer
					});
				}

			});
			
			pm.bind('blindVersion_found', function(data) {
				if (data.blindVersion) {
					// Вызов версии для слабовидящих в основном фрейме
					window.location.search = "special=Y";
				} else {
					// Отмена версии для слабовидящих в основном фрейме
					window.location.search = "special=N";
				}

				// Шлем привет футеру, если он есть

				var header = document.getElementById('header-frame');

				if ( header != null ) {
					pm({
						target: header.contentWindow,
						type: 'blindVersion',
						data: data,
						success: function(data) {},
						url: document.referer
					});
				}

			});

	});

	bindReady(function() {

		// Скрипты для "нашли то, что искали"

		var foundWrap = document.getElementById('found-frame-wrap'),
			found = document.getElementById('found-frame');

		if ( foundWrap != null && found != null ) {

			function showFound() {
				found.className = 'found-wrp';
				clearTimeout(showTO);
				openedFlag = true;
				
			};

			function hideFound() {
				found.className = 'found-wrp hidden';
			};
			
			var	w = window,
				b = document.body,
				found = foundWrap,
				showTO = setTimeout(showFound, 1000),
				openedFlag = false;

			w.addEventListener('scroll.found', function() {
				if (!openedFlag) {
					var topDiff = w.scrollTop() - (b.offsetHeight - window.innerHeight);
					if (topDiff > -200) {
						showFound();
					}
				}
			});

			pm.bind('closeFound', hideFound);
		}

	});



	// DOM-ready функция
	function bindReady(handler){

		var called = false

		function ready() { // (1)
			if (called) return
			called = true
			handler()
		}

		if ( document.addEventListener ) { // (2)
			document.addEventListener( "DOMContentLoaded", function(){
				ready()
			}, false )
		} else if ( document.attachEvent ) {  // (3)

			// (3.1)
			if ( document.documentElement.doScroll && window == window.top ) {
				function tryScroll(){
					if (called) return
					if (!document.body) return
					try {
						document.documentElement.doScroll("left")
						ready()
					} catch(e) {
						setTimeout(tryScroll, 0)
					}
				}
				tryScroll()
			}

			// (3.2)
			document.attachEvent("onreadystatechange", function(){

				if ( document.readyState === "complete" ) {
					ready()
				}
			})
		}

		// (4)
	    if (window.addEventListener)
	        window.addEventListener('load', ready, false)
	    else if (window.attachEvent)
	        window.attachEvent('onload', ready)
	    /*  else  // (4.1)
	        window.onload=ready
		*/
	};
	
	pm.bind('search_helper', function(data) {
		document.getElementsByTagName('body')[0].insertBefore(data, null);
	});
	
	/*pm.bind('container_class', function() {
		//give content classes to move
		$('body').children().not('script').not('#bx-panel').not('.top-panel-frame-wrp').each(function() {
	    	$(this).addClass('page-content-container');
	    });
	    $('body').contents().each(function() {
	    	if (this.nodeType == 3 && $.trim(this.nodeValue) != '') {
		       $(this).wrap('<div class="page-content-container"></div>');
		    }
	    });
	});*/
	
	document.body.onclick=function() {
		var header = document.getElementById('header_frame');
		if ( header != null ) {
		pm({
			target: header.contentWindow,
			type: 'lang_close',
			url: document.referrer
		});
		}
	};


	//добавление формы ошибок
	pm.bind('error-block', function(data) {
		document.getElementsByTagName('body')[0].insertBefore(data, null);
	});
	
	pm.bind('error-close', function(data) {
		
		var errorFrame = document.getElementById('c-error-frame');
		var errorWrap = document.getElementById('c-error-block');
		errorWrap.fadeOut(function() {
			pm({
				target: errorFrame.contentWindow,
				type: 'hide-thanks',
				url: document.referer
			});
		});
		document.body.style.overflow = 'visible';
      
		//$('html').css({ 'padding-right': '0' });
	});
	
	bindReady(function() {
		
		var
			errorWrap = document.getElementById('c-error-block'),
			errorFrame = document.getElementById('c-error-frame');
			
			
		document.body.onkeydown = function (event) {
			var keyCode = (event.which ? event.which : event.keyCode);
			if ((keyCode == 10 || keyCode == 13) && event.ctrlKey) {
				//console.log('ctrl+enter');
				doSomethingWithSelectedText();
			}
			//$('html').css({ 'padding-right': getScrollbarWidth() });
		};
		
		function getScrollbarWidth() {
		    var outer = document.createElement("div");
		    outer.style.visibility = "hidden";
		    outer.style.width = "100px";
		    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
		
		    document.body.appendChild(outer);
		
		    var widthNoScroll = outer.offsetWidth;
		    // force scrollbars
		    outer.style.overflow = "scroll";
		
		    // add innerdiv
		    var inner = document.createElement("div");
		    inner.style.width = "100%";
		    outer.appendChild(inner);        
		
		    var widthWithScroll = inner.offsetWidth;
		
		    // remove divs
		    outer.parentNode.removeChild(outer);
		
		    return widthNoScroll - widthWithScroll;
		}
		
		function getSelectedText() {
		    var text = "";
		    if (typeof window.getSelection != "undefined") {
		        text = window.getSelection().toString();
		    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
		        text = document.selection.createRange().text;
		    }
		    return text;
		}
		
		function doSomethingWithSelectedText() {
		    var selectedText = getSelectedText();
		    if (selectedText) {
		        if ( errorFrame != null ) {
		        	document.body.style.overflow = 'hidden'; //скрываем скролл основного документа
		        	errorWrap.fadeIn(); //показываем фрейм ошибок
		        	//передаём во фрейм выделенный текст
					pm({
						target: errorFrame.contentWindow,
						type: 'error-text',
						data: selectedText,
						url: document.referer
					});
					document.getSelection().removeAllRanges();
				}
		    }
		}
		
	});

	
})(this, typeof jQuery === "undefined" ? NO_JQUERY : jQuery);
