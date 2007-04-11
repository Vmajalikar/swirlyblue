Evt.Archive = Evt.Base.extend({
	initialize: function() {
		this.parent('Archive', this);
		this.data.extend([
			new Data($('containerContents')),
			new Data($('Contents')),
			new Data($('goPrev')),
			new Data($('goNext')),
			new Data($('goFirst')),
			new Data($('goLast')),
			new Data({move: 4, yOffset: 8, xOffset: 13}),
			new Data($('opts')),
			new Data($('viewLink')),
			new Data($('reactLink')),
			new Data($('cornerfolder'))
		]);
		this.effects = {
			scroll: new Fx.CustomScroll(this.data[0].p, {onComplete: this.checkButtons.bind(this)}),
			fade: function(el) { return new Fx.Style(el, 'opacity', {duration: 400}); },
			slide: new Fx.Styles(this.data[7].p, {transition: Fx.Transitions.backOut}),
			fall: function(el) { return new Fx.Style(el, 'top', {
				transition: Fx.Transitions.backOut,
				onComplete: this.controls.n.updatePos.pass(el, this.controls.n)
			}) }.bind(this)
		};
		this.controls = {
			n: eStack.get('Notes'),
			view: eStack.get('ViewNote'),
			scr: eStack.get('Screen')
		};
		this.notes = this.controls.n.archive;
		this.data[2].p.addEvent('click', this.prev.bind(this));
		this.data[3].p.addEvent('click', this.next.bind(this));
		this.data[4].p.addEvent('click', this.first.bind(this));
		this.data[5].p.addEvent('click', this.last.bind(this));
		this.checkButtons();
		this.populate();
	},
	
	checkButtons: function() {
		if(this.data[0].p.scrollLeft < 1) {
			this.data[2].p.addClass('grey');
			this.data[4].p.addClass('grey');
		} else {
			this.data[2].p.removeClass('grey');
			this.data[4].p.removeClass('grey');
		}
		
		if(this.data[0].p.scrollLeft >= this.calcLimit()) {
			this.data[3].p.addClass('grey');
			this.data[5].p.addClass('grey');
		} else {
			this.data[3].p.removeClass('grey');
			this.data[5].p.removeClass('grey');
		}
	},
	
	calcMax: function() {
		return Math.floor(this.data[0].pr('width').toInt() / 32);
	},
	
	calcLimit: function() {
		return (this.notes.length * 32) - (this.calcMax() * 32);
	},
	
	prev: function() {
		if(this.effects.scroll.timer) this.effects.scroll.clearTimer();
		if(this.data[0].p.scrollLeft - (32 * this.data[6].pr('move')) < 0) var mv = 0;
		else var mv = this.data[0].p.scrollLeft - (32 * this.data[6].pr('move'));
		this.effects.scroll.left(mv);
	},
	
	next: function() {
		if(this.effects.scroll.timer) this.effects.scroll.clearTimer();
		if((32 * this.data[6].pr('move')) + this.data[0].p.scrollLeft > this.calcLimit()) var mv = this.calcLimit();
		else var mv = (this.data[6].pr('move') * 32) + this.data[0].p.scrollLeft;
		this.effects.scroll.right(mv);
	},
	
	first: function() {
		if(this.effects.scroll.timer) this.effects.scroll.clearTimer();
		this.effects.scroll.left(0);
	},
	
	last: function() {
		if(this.effects.scroll.timer) this.effects.scroll.clearTimer();
		this.effects.scroll.right(this.calcLimit());
	},
	
	populate: function() {
		for(var i = 0; i < this.notes.length; i++) {
			var el = this.controls.n.getEl(this.notes[i].id);
			el.setStyles({
				top: 0,
				left: 0,
			}).injectBefore(this.data[1].p.getLast());
			this.effects.fade(el).start(1);
			el.addEvent('click', this.loadOpts.bindAsEventListener(this));
		}
	},
	
	add: function(el, drag) {
		el.setStyles({
			position: '',
			top: 0,
			left: 0
		});
		el.removeEvents('dblclick');
		this.controls.n.move(el, 'archive');
		el.addEvent('click', this.loadOpts.bindAsEventListener(this));
		drag.detach();
		el.injectBefore(this.data[1].p.getFirst());
		$$('.tool-tip')[0].setStyle.pass(['visibility', 'hidden'], $$('.tool-tip')[0]).delay(500);
	},
	
	hideTools: function() {
		var tt = dStack.get('Tooltips');
		tt.off();
		tt.options.onHide($$('.tool-tip')[0]);
	},
	
	loadOpts: function(e) {
		var el = e.target;
		var f = this.data[10].p.getCoordinates();
		if(e.pageX > f.left && e.pageX < f.right && e.pageY < f.bottom && e.pageY > f.top) return;
		if(this.optsDisplay != el && $type(e) == 'object') {
			if(this.controls.n.getNote(el.id.split('_')[1]).sec != 'archive') return;
			this.hideTools();
			var c = el.getCoordinates();
			if(this.data[7].pr('visibility') == 'hidden') {
				this.data[7].p.setStyles({
					top: c.top + c.height - this.data[6].pr('yOffset') + 'px',
					left: c.left - this.data[6].pr('xOffset') + 'px'
				});
				if(this.effects.fade.timer) this.effects.fade.clearTimer();
				this.effects.fade(this.data[7].p).start(1);
			} else {
				this.effects.slide.clearTimer();
				this.effects.slide.start({
					top: c.top + c.height - this.data[6].pr('yOffset'),
					left: c.left - this.data[6].pr('xOffset')
				});
			}
			this.data[8].p.removeEvents('click');
			this.data[9].p.removeEvents('click');
			this.data[8].p.addEvent('click', this.controls.view.load.pass(el, this.controls.view));
			this.data[9].p.addEvent('click', this.reactivate.pass(el, this));
			this.optsDisplay = el;
		} else {
			if(this.data[7].pr('visibility') == 'hidden') return;
			this.effects.fade(this.data[7].p).start(0);
			this.optsDisplay = false;
			dStack.get('Tooltips').on();
		}
	},
	
	reactivate: function(el) {
		el.removeEvents('click');
		var c = el.getCoordinates();
		el.setStyles({
			position: 'absolute',
			top: c.top + 'px',
			left: c.left + 'px',
			zIndex: 999999
		}).injectInside($E('body'));
		this.effects.fall(el).start(c.top, 50 + $('archive').getStyle('height').toInt()).chain(el.setStyle.pass(['zIndex', 999998], el));
		this.loadOpts(1);
		this.controls.n.move(el, 'screen');
		this.controls.scr.reAttachEvts(el);
	}
});