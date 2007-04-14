/*
Script: events.js
	SwirlyBlue Noticeboard actions

Version: 2.0
Release: 1

Authors:
	Kim 'Fyorl' Mantas, <http://soul-scape.com>

License:
	Creative Commons Attribution-Noncommercial-Share Alike 3.0
	<http://creativecommons.org/licenses/by-nc-sa/3.0/>

Credits:
	- Mootools Javascript framework and effects library v1.00 <http://mad4milk.net> (c) 2007 Valerio Proietti, MIT-style license
	- Design is based on Valerio Proietti's 'Mooglets'
	- Most of the graphical and design work (aka, those shiny buttons) was done by Ben Jenkinson and is (c) 2006/2007 Elemental Design <http://soul-scape.com>
*/

Element.extend({
	show: function() {
		this.setStyle('display', 'block');
		return this;
	},
	
	hide: function() {
		this.setStyle('display', 'none');
		return this;
	},
	
	toggle: function() {
		if(this.getStyle('display') == 'none') this.show();
		else this.hide();
		return this;
	},
	
	hasChild: function(needle) {
		return ($A(this.getElementsByTagName('*')).test(needle)) ? true : false;
	},
	
	addHoverImg: function(img) {
		if(!this.tmpOldImg) this.tmpOldImg = this.src.toString();
		this.addEvent('mouseover', function() { this.src = img; }.bind(this));
		this.addEvent('mouseout', function() { if(this.tmpOldImg) this.src = this.tmpOldImg; }.bind(this));
	},
	
	removeHoverImg: function() {
		if(this.tmpOldImg) this.tmpOldImg = null;
		this.removeEvents('mouseover');
		this.removeEvents('mouseout');
	}
});

Array.extend({
	last: function() { return this[this.length - 1] }
});

Tips = Tips.extend({
	off: function() { this.inactive = true; },
	on: function() { this.inactive = false; },
	start: function(el) {
		if(!this.inactive) this.parent(el);
	}
});

Drag.Move = Drag.Move.extend({
	drag: function(event) {
		if(this.options.grid) {
			for(var z in this.options.modifiers) {
				var zVal = this.element.getStyle(this.options.modifiers[z]).toInt();
				if((zVal + (event.page[z] - this.mouse.pos[z])) % this.options.grid) event.page[z] = zVal + this.mouse.pos[z];
			}
		}
		this.parent(event);
	}
});

Fx.CustomScroll = Fx.Base.extend({
	initialize: function(el, options) {
		this.element = $(el);
		this.setOptions(options);
		if(!this.options.dimension) this.options.dimension = 'y';
	},
	
	left: function(by) {
		this.options.dimension = 'x';
		if(!by) return this.custom(this.element.scrollLeft, 0);
		else return this.custom(this.now || 0, by);
	},
	
	right: function(by) {
		this.options.dimension = 'x';
		if(!by) return this.custom(this.element.scrollLeft, this.element.scrollWidth - this.element.offsetWidth);
		else return this.custom(this.now || 0, by);
	},
	
	increase: function() {
		if(this.options.dimension == 'y') this.element.scrollTop = this.now;
		else this.element.scrollLeft = this.now;
	}
});

var Reserved = new Array(
	'each',
	'copy',
	'remove',
	'test',
	'extend',
	'associate',
	'rgbToHex',
	'hexToRgb',
	'rgbToHsb',
	'hsbToRgb'
);

var Stack = new Class({
	initialize: function() {
		this.contents = new Array();
	},
	add: function(v, i) {
		if(!i || i == 'trivial') this.contents.extend([v]);
		else this.contents[i] = v;
	},
	
	get: function(i) {
		if($type(i) == 'string' && !this.contents[i]) this.contents[i] = new Evt[i];
		return this.contents[i];
	},
	
	find: function(obj) {
		for(var i in this.contents) {
			if(Reserved.test(i)) continue;
			if(obj == this.contents[i]) return i;
		}
		
		return false;
	},
	
	remove: function(i) {
		if($type(i) == 'number') this.contents.splice(key, 1);
		else this.contents[i] = undefined;
	}
});

var dStack = new Stack();
var eStack = new Stack();

var Data = new Class({
	initialize: function(properties, identifier) {
		this.p = properties || {};
		this.id = identifier || 'trivial';
		if($type(this.p) == 'object' || $type(this.p) == 'array') this.iType = 0;
		else if($type(this.p) == 'element') {
			this.iType = 1;
			$(this.p);
		}
		else this.iType = 2;
		dStack.add(this.p, this.id);
	},
	
	pr: function(p) {
		switch(this.iType) {
			case 0: return this.p[p]; break;
			case 1:
			if(p == 'innerHTML') return this.p.innerHTML;
			if(this.p.getProperty(p)) return this.p.getProperty(p);
			else return this.p.getStyle(p);
			break;
			case 2: return this.p; break;
		}
	},
	
	hasProperty: function(p) {
		switch(this.iType) {
			case 0:
			if(this.p[p]) return true;
			return false
			break;
			
			case 1:
			if(this.p.getProperty(p) || this.p.getStyle(p)) return true;
			return false;
			break;
			
			case 2:
			if(this.p == p) return true;
			return false;
			break;
		}
	},
	
	set: function(v, p) {
		if(!p) {
			if(this.iType == 1) {
				for(var ps in v) {
					if(this.p.getProperty(ps)) this.p.setProperty(ps, v);
					else this.p.setStyle(ps, v);
				}
				
				return;
			}
			switch($type(v)) {
				case 'object':
				for(var property in v) {
					this.p[property] = v[property];
				}
				break;
				
				case 'array':
				v.each(function(e, i, ar) {
					this.p[i] = e;
				});
				break;
				
				default: this.p = v;
			}
		} else {
			switch(this.iType) {
				case 0: this.p[p] = v; break;
				case 1:
				if(p == 'innerHTML') {this.p.setHTML(v); return;}
				if(this.p.getProperty(p)) this.p.setProperty(p, v);
				else this.p.setStyle(p, v);
				break;
			}
		}
	}
});

var Evt = {};

Evt.Base = new Class({
	initialize: function(id, obj) {
		this.data = new Array();
		this.effects = {};
		this.controls = {};
		eStack.add(obj, id);
	}
});