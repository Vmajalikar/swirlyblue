Evt.Loadbar = Evt.Base.extend({
	initialize: function() {
		this.parent('Loadbar', this);
		this.main = $('loadbarContainer');
		this.bar = $('loadbar');
		this.effects = {
			fade: new Fx.Style(this.main, 'opacity'),
			slide: new Fx.Style(this.bar, 'width', {duration: 400, unit: '%'})
		};
	},
	
	to: function(v) {
		if(this.effects.slide.timer) this.effects.slide.clearTimer();
		this.effects.slide.start(v);
	},
	
	inc: function(v, obj) {
		if(!obj) var obj = this;
		var now = parseFloat(obj.bar.getStyle('width'));
		var set = v + now;
		if(set > 100) var set = 100;
		obj.to(set);
	}
});
Evt.Loadbar.implement(hTog);