
(function(){

var cur_domain = window.location.hostname;
var doc_referrer = document.referrer;
var protocol = "https:";
 
var link = document.createElement("script");
      link.setAttribute("type","text/javascript");
      link.setAttribute("src", protocol + '//pevp.mos.ru/bitrix/templates/.default/header-footer/build/assets/js/postmessage_and_container.js?1.0.27');
	  document.getElementsByTagName("head")[0].appendChild(link);
 
var counter = document.createElement("script");
      counter.setAttribute("type","text/javascript");
		  counter.setAttribute("id","statsmosru");
			counter.setAttribute("defer","defer");
			counter.setAttribute("async","true");
			counter.setAttribute("onLoad","statsMosRuCounter()");
      counter.setAttribute("src", "https://stats.mos.ru/counter.js");
	  document.getElementsByTagName("head")[0].appendChild(counter);

var l = document.createElement("link");
		l.rel = 'stylesheet';
		l.href = protocol + '//pevp.mos.ru/bitrix/templates/.default/header-footer/build/assets/css/evpFooterPopup.css?1.0.27';
		document.getElementsByTagName('head')[0].appendChild(l);

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
var evpIsPm = setTimeout(function evpIsPm() {
  if (window.pm === undefined) {
	  evpIsPm = setTimeout(evpIsPm, 0);
  }else{
		clearTimeout(evpIsPm);
		evpGetPopupFooter();
		evpIsPopupFooter();
		evpPushHeaderDomain();
		evpSearchHeader();
  }
}, 0);
function evpParseUrlQuery() {
    var data = {};
    if(window.parent.location.search) {
        var pair = (window.parent.location.search.substr(1)).split('&');
        for(var i = 0; i < pair.length; i ++) {
            var param = pair[i].split('=');
            data[param[0]] = param[1];
        }
    }
    return data;
}
var evpBlindUrl = evpParseUrlQuery();

/**
*
* метод вставки iframe для хедера
* 
* аргументы: 
* 
* возвращает: 
* 
*/
function load_header(){
	var add_url = "";
	if(evpBlindUrl.special == "Y" || evpBlindUrl.special == "N") {
	 add_url = "&special=" + evpBlindUrl.special;
	}
	var header = document.getElementsByTagName('body')[0];
	var node = document.getElementById("top-panel-frame-wrp");
	if(node){
				node.style.position = 'relative';
		node.style.zIndex = evpFuncMaxzIndex();
	    var headerFrameUrl = protocol + '//pevp.mos.ru/frame/v2/header.php?v=1.0.27&site_id=91&is_search_main=0&show_blind=0&text=&cur_domain='+cur_domain+'&ref_url='+encodeURIComponent(document.location.href)+'&ref_parent_url='+encodeURIComponent(doc_referrer)+add_url+'';
	    node.innerHTML = '<iframe src="' + headerFrameUrl + ' " frameborder="0" width="100%" scrolling="no" id="header_frame" class="top-panel-frame"></iframe>';
	} else{
				s = document.createElement("div"),
		s.className = 'top-panel-frame-wrp';
		s.style.height = '60px';
		s.style.position = 'relative';
		s.style.zIndex = evpFuncMaxzIndex();
	    var headerFrameUrl = protocol + '//pevp.mos.ru/frame/v2/header.php?v=1.0.27&site_id=91&is_search_main=0&show_blind=0&text=&cur_domain='+cur_domain+'&ref_url='+encodeURIComponent(document.location.href)+'&ref_parent_url='+encodeURIComponent(doc_referrer)+add_url+'';
		s.innerHTML = '<iframe src="' + headerFrameUrl + ' " frameborder="0" width="100%" scrolling="no" id="header_frame" class="top-panel-frame"></iframe>';

		function insertAfter(elem, refElem) {
			return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
		}
		
		header.insertBefore(s, header.firstChild);
	}
	
};

ready(load_header);
/**
*
* метод вставки iframe для футера
* 
* аргументы: 
* 
* возвращает: 
* 
*/
function load_footer(){
  var footer = document.getElementsByTagName('body')[0];
  s = document.createElement("div"),
  s.className = 'footer-frame-wrp';
  s.innerHTML = '<iframe src="' + protocol + '//pevp.mos.ru/frame/v2/footer.php?v=1.0.27&site_id=91&show_blind=0&hidesitemap=0&hidecounter=0&cur_domain='+cur_domain+'" id="footer_frame" frameborder="0" width="100%" scrolling="no"></iframe>';
  footer.insertBefore(s, null);
}

ready(load_footer);

  
})();
/**
*
* метод закрытия попапа
* 
* аргументы: 
* 
* возвращает: 
* 
*/
function evpHidePopupFooter(){
	var s = document.querySelectorAll(".evpFooterPopup");
	var footerFrame = document.getElementById('footer_frame');

	 for (var i = 0; i < s.length; i++) {
	   s[i].style.display='none';
	  }
		
	pm({
		target: footerFrame.contentWindow,
		type: 'hide-popup-frame',
		url: document.referrer
	});	
};
/**
*
* метод проверки наличия попапа на странице и создания его если нет
* 
* аргументы: 
* 
* возвращает: 
* 
*/
function evpIsPopupFooter(){
	pm.bind('existence-popup-frame', function(data) {
		var popup = document.getElementById("evpFooterPopup"+data.prefix);
		var footerFrame = document.getElementById('footer_frame');
		if(popup != null){
			popup.style.display = 'block';
			evpCenterPopupFooter(data.prefix);
			SimpleScrollbar.initAll();
		}else{
			var s = document.createElement("div");
			s.style.zIndex = evpFuncMaxzIndex()+1;
			s.id = "evpFooterPopup"+data.prefix;
			s.className = "evpFooterPopup"
			document.getElementsByTagName('body')[0].insertBefore(s, null);
			pm({
				target: footerFrame.contentWindow,
				type: 'is-popup-frame-popup-frame',
				data: data,
				url: document.referrer
			});	
		}
	});
};
/**
*
* метод определения максимального z-index на странице
* 
* аргументы: 
* 
* возвращает: 
* 
*/
function evpFuncMaxzIndex() {
	var elements = document.body.querySelectorAll('*:not(script)');
	var maxIndex = 0;
	for (var i = 0; i < elements.length; i++) {
		var indexZ = window.getComputedStyle ? getComputedStyle(elements[i]).zIndex : elements[i].currentStyle.zIndex;
		if (indexZ !== 'auto') {
			if (indexZ > maxIndex) {
				maxIndex = parseInt(indexZ);
			}
		}
	}
	return (maxIndex+1);
};

window.onresize = function(){
		evpHidePopupFooter();
};
document.onclick=function(){
		var headerFrame = document.getElementById('header_frame');
			pm({
				target: headerFrame.contentWindow,
				type: 'is-hide-header-navigator-frame',
				url: document.referrer
			});	
	};

/**
*
* метод запонения попапа html и открытия его
* 
* аргументы: 
* 
* возвращает: 
* 
*/
function evpGetPopupFooter(){
	pm.bind('show-popup-frame', function(data) {
		var popup = document.getElementById("evpFooterPopup"+data.prefix);
		popup.innerHTML = data.html;
		popup.style.display = 'block';
		evpCenterPopupFooter(data.prefix);
		SimpleScrollbar.initAll();
	});
	
};
/**
*
* метод для центрирования попапа на странице
* 
* аргументы: prefix  - prefix для айдишника попапа
* 
* возвращает: 
* 
*/
function evpCenterPopupFooter(prefix) {
					var s = document.getElementById("evpFooterPopup"+prefix);
					var scrollTop = window.pageYOffset || document.body.scrollTop;
					var popupHeight = s.firstChild.offsetHeight;
					var windowHeight = window.innerHeight;
					var windowWidth = window.innerWidth;
					var top = (windowHeight - popupHeight) / 2;

					if (top < scrollTop) {
						fillHeight = true;
					}
					if (windowWidth < 768) {
						s.firstChild.style.top = 0+'px';
						s.firstChild.style.height = windowHeight;
						/*window.scrollTo(0,0);*/
					} else {
						s.firstChild.style.top = top+'px';
						s.firstChild.style.height = '';
					}
};
/**
*
* метод передачи домена в шапку
* 
* аргументы: 
* 
* возвращает: 
* 
*/
function evpPushHeaderDomain(){
	pm.bind('get-domain-header-frame',  function(){
		return  window.location.hostname;
	}); 
};
/**
*
* метод обработки параметров поиска
* 
* аргументы: 
* 
* возвращает: 
* 
*/
function evpSearchHeader(){
	pm.bind('set-search-url-header-frame', function(data) {
		var evpHost = encodeURIComponent(window.location.hostname);
			var evpReferrer =  encodeURIComponent(window.location.href);
			var evpText = encodeURIComponent(data);
			var evpSearchTransUrl = 'https://www.mos.ru/search?host='+evpHost+'&q='+evpText+'&referer='+evpReferrer+'&mos_id='+'91'+'&lang=ru';
			window.location.href = evpSearchTransUrl;
	});
};
/**
*
* метод инициализации скролла в попапах
* 
* аргументы: 
* 
* возвращает: 
* 
*/
(function(w, d) {
  var raf = w.requestAnimationFrame || w.setImmediate || function(c) { return setTimeout(c, 0); };

  function initEl(el) {
    if (el.hasOwnProperty('data-simple-scrollbar')) return;
    Object.defineProperty(el, 'data-simple-scrollbar', new SimpleScrollbar(el));
  }

  /* Mouse drag handler*/
  function dragDealer(el, context) {
    var lastPageY;

    el.addEventListener('mousedown', function(e) {
      lastPageY = e.pageY;
      el.classList.add('ss-grabbed');
      d.body.classList.add('ss-grabbed');

      d.addEventListener('mousemove', drag);
      d.addEventListener('mouseup', stop);

      return false;
    });

    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;

      raf(function() {
        context.el.scrollTop += delta / context.scrollRatio;
      });
    }

    function stop() {
      el.classList.remove('ss-grabbed');
      d.body.classList.remove('ss-grabbed');
      d.removeEventListener('mousemove', drag);
      d.removeEventListener('mouseup', stop);
    }
  }

  /* Constructor*/
  function ss(el) {
    this.target = el;
    
    this.bar = '<div class="ss-wrap-scroll"><div class="ss-scroll"></div></div>';

    this.wrapper = d.createElement('div');
    this.wrapper.setAttribute('class', 'ss-wrapper');

    this.el = d.createElement('div');
    this.el.setAttribute('class', 'ss-content');

	this.child = d.createElement('div');
	this.el.appendChild(this.child);
    this.wrapper.appendChild(this.el);

    while (this.target.firstChild) {
      this.child.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;

    dragDealer(this.bar, this);
    this.moveBar();

    this.el.addEventListener('scroll', this.moveBar.bind(this));
    this.el.addEventListener('mouseenter', this.moveBar.bind(this));

    this.target.classList.add('ss-container'); 
      
    var css = window.getComputedStyle(el);
  	if (css['height'] === '0px' && css['max-height'] !== '0px') {
    	el.style.height = css['max-height'];
    }
  }

  ss.prototype = {
    moveBar: function(e) {
      var totalHeight = this.el.scrollHeight,
          ownHeight = this.el.clientHeight,
          _this = this;
      this.scrollRatio = ownHeight / totalHeight;
      raf(function() {
        /* Hide scrollbar if no scrolling is possible*/
        if(_this.scrollRatio >= 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden')
			_this.bar.style.cssText = 'right:-' + (_this.target.clientWidth - _this.bar.clientWidth) + 'px;';
          _this.bar.firstChild.style.cssText = 'height:' + (_this.scrollRatio) * 100 + '%; top:' + (_this.el.scrollTop / totalHeight ) * 100 + '%;';
        }
      });
    }
  }

  function initAll() {
    var nodes = d.querySelectorAll('.evp-popup-scroll');
    for (var i = 0; i < nodes.length; i++) {
      initEl(nodes[i]);
    }
  }

  d.addEventListener('DOMContentLoaded', initAll);
  ss.initEl = initEl;
  ss.initAll = initAll;

  w.SimpleScrollbar = ss;
})(window, document);