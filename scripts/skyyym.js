// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () { };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// edge easing plugin

"use strict";

var __extends = this && this.__extends || function () {
	var extendStatics = function (d, b) {
		extendStatics = Object.setPrototypeOf ||
			{ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; } ||
			function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
		return extendStatics(d, b);
	};
	return function (d, b) {
		extendStatics(d, b);
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
}();

var EdgeEasingPlugin = /** @class */function (_super) {
	__extends(EdgeEasingPlugin, _super);
	function EdgeEasingPlugin() {
		var _this = _super !== null && _super.apply(this, arguments) || this;
		_this._remainMomentum = {
			x: 0,
			y: 0
		};

		return _this;
	}

	EdgeEasingPlugin.prototype.transformDelta = function (delta) {
		var _a = this.scrollbar, limit = _a.limit, offset = _a.offset;
		var x = this._remainMomentum.x + delta.x;
		var y = this._remainMomentum.y + delta.y;
		// clamps momentum within [-offset, limit - offset]
		this.scrollbar.setMomentum(Math.max(-offset.x, Math.min(x, limit.x - offset.x)), Math.max(-offset.y, Math.min(y, limit.y - offset.y)));
		return { x: 0, y: 0 };
	};

	EdgeEasingPlugin.prototype.onRender = function (remainMomentum) {
		Object.assign(this._remainMomentum, remainMomentum);
	};

	EdgeEasingPlugin.pluginName = "edgeEasing";
	return EdgeEasingPlugin;

}(Scrollbar.ScrollbarPlugin);

Scrollbar.use(EdgeEasingPlugin);

// hash plugin

class AnchorPlugin extends Scrollbar.ScrollbarPlugin {
	static pluginName = 'anchor';

	onHashChange = () => {
		this.handleHash(location.hash);
	};

	onClick = (event) => {
		const { target } = event;

		if (target.tagName !== 'A') {
			return;
		}

		const hash = target.getAttribute('href');

		if (!hash || hash.charAt(0) !== '#') {
			return;
		}

		this.handleHash(hash);
	}

	handleHash = (hash) => {
		console.log('hash:', hash);

		if (!hash) {
			return;
		}

		if (hash === '#start') {
			scrollbar.setMomentum(0, -scrollbar.scrollTop);
		} else {
			console.log('scrollTop:', scrollbar.containerEl.scrollTop);

			scrollbar.scrollIntoView(document.querySelector(hash), {
				offsetTop: -scrollbar.containerEl.scrollTop,
			});
		}
	};

	onInit() {
		this.handleHash(location.hash);
		window.addEventListener('hashchange', this.onHashChange);
		this.scrollbar.contentEl.addEventListener('click', this.onClick);
	}

	onDestory() {
		window.removeEventListener('hashchange', this.onHashChange);
		this.scrollbar.contentEl.removeEventListener('click', this.onClick);
	}
}

Scrollbar.use(AnchorPlugin);


// scrollbar init
const scrollbar = Scrollbar.init(document.querySelector('main'), {
	damping: 0.05, // 0.05
    alwaysShowTracks: true
});

// hash removal
