Evt.OptBox = Evt.Base.extend({
	initialize: function() {
		this.parent('OptBox', this);
		this.data.extend([
			new Data($('Options')),
			new Data($('Options').getFirst().getFirst()),
			new Data($('closeOptions')),
			new Data($('logo'))
		]);
		this.box = $('Options').getFirst().getFirst();
		this.main = $('Options');
		this.effects = {
			fade: new Fx.Style(this.box, 'opacity', {duration: 400, onComplete: this.resize.bind(this)})
		};
		this.controls = {
			ajax: eStack.get('Jax')
		};
		this.data[3].p.addEvent('click', this.open.bind(this));
		this.data[2].p.addEvent('click', this.close.bind(this));
		
		this.f = $('fOptions');
		this.customStack = Stack.extend({
			get: function(i) {
				if($type(i) == 'string' && !this.contents[i]) this.contents[i] = new Opt[i];
				return this.contents[i];
			}
		});
		this.stack = new this.customStack();
		this.opts = [];
	},
	
	open: function() {
		this.data[0].p.show();
		this.effects.fade.start(0, 1);
		this.stack.contents.each(function(opt) {
			opt.onOpen();
		});
		this.resize();
	},
	
	load: function(obj) {
		this.stack.add(obj);
	}
});
Evt.OptBox.implement(resize);

var Opt = {};

Opt.Base = new Class({
	initialize: function(obj, key) {
		this.f = $('fOptions');
		this.opt = this.f[key];
		this.master = eStack.get('OptBox');
		this.master.load(obj);
	}
});