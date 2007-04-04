Evt.Sweep = Evt.Base.extend({
	initialize: function() {
		this.parent(this, 'Sweep');
		this.but = $('moveAll');
		this.body = $E('body');
		this.n = eStack.get('Notes');
		this.debug = eStack.get('DebugBox');
		this.scr = eStack.get('Screen');
		this.but.show();
		this.but.addEvent('click', this.moveAll.bind(this));
		this.chn = new Chain();
		this.consts = {v: 50, h: 20};
		this.effects = {};
		this.controls = {folder: eStack.get('Folder')};
		Object.extend(this.effects, jFx);
	},
	
	moveAll: function() {
		this.jerk(
			this.debug.data[0].p,
			this.debug.data[8].pr('container'),
			this.consts.v,
			this.consts.h,
			this.debug.rejig.bind(this.debug)
		);
		
		this.n.screen.each(function(e) {
			var el = this.n.getEl(e.id);
			var c = el.getCoordinates(); var bc = this.body.getCoordinates();
			if(c.top > bc.top + this.consts.v && c.left > bc.left + this.consts.h && c.left + c.width < bc.width - this.consts.h && c.top + c.height < bc.height - this.consts.h) return;
			this.chn.chain(this.jerk.pass([
				el,
				this.body,
				this.consts.v,
				this.consts.h,
				this.scr.still.pass(el, this.scr)
			], this));
		}.bind(this));
		this.fireChain.periodical(400, this);
	},
	
	fireChain: function() {
		if(this.chn.chains.length < 1) $clear(this.active);
		this.chn.callChain();
	}
});
Evt.Sweep.implement(jFunc);