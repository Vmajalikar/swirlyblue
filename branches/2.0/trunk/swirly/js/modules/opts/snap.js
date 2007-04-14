Evt.Screen = Evt.Screen.extend({
	dropped: function(what) {
		if(!what.events.drop) what.addEvent('drop', this.snap.bindAsEventListener(this));
		this.parent(what);
	},
	
	snap: function(e) {
		if(this.snapToGrid) {
			this.effects.toGrid(e.element).start({
				top: Math.round(e.element.getPosition().y / this.snapToGrid) * this.snapToGrid,
				left: Math.round(e.element.getPosition().x / this.snapToGrid) * this.snapToGrid
			});
		}
	}
});

Opt.Snap = Opt.Base.extend({
	initialize: function() {
		this.parent(this, 'Snap');
		this.align = $('alignToGrid');
		this.consts = { grid: 16 };
		this.scr = eStack.get('Screen');
		this.jax = eStack.get('Jax');
		this.n = eStack.get('Notes');
		
		this.scr.effects.toGrid = function(el) {
			 return new Fx.Styles(el, {duration: 250, onComplete: this.still.pass(el, this)});
		}.bind(this.scr);
		
		if(!this.opt.disabled) this.opt.addEvent('change', this.check.bind(this));
		this.align.addEvent('click', this.alignToGrid.bind(this));
		this.check(true);
	},
	
	check: function(firsttry) {
		if(this.opt.checked) this.load(firsttry);
		else if($type(firsttry) != 'boolean') this.clear();
	},
	
	load: function(firsttry) {
		if($type(firsttry) != 'boolean') {
			this.jax.start('ENABLE_OPT&opt=Snap');
		}
		this.align.show();
		this.scr.snapToGrid = this.consts.grid;
	},
	
	clear: function() {
		this.jax.start('DISABLE_OPT&opt=Snap');
		this.align.hide();
		this.scr.snapToGrid = false;
	},
	
	alignToGrid: function() {
		this.scr.notes.each(function(note) {
			var el = this.n.getEl(note.id);
			['top', 'left'].each(function(pr) {
				el.setStyle(pr, Math.round(el.getCoordinates()[pr] / this.consts.grid) * this.consts.grid + 'px');
			}.bind(this));
			this.scr.still(el);
		}.bind(this));
	},
	
	onOpen: function() {}
});