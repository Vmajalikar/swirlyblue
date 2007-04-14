Evt.Screen = Evt.Base.extend({
	initialize: function() {
		this.parent('Screen', this);
		this.data.extend([
			new Data($E('body')),
			new Data($('save')),
			new Data({
				onStart: function() { this.element.setOpacity(.8) },
				container: $E('body'),
				onComplete: this.dropped.bind(this)
			}, 'dragOpts'),
			new Data({bVertical: 50, bHorizontal: 20}),
			new Data([], 'Draggables')
		]);
		this.effects = {
			fade: function(el) { return new Fx.Style(el, 'opacity', {duration: 400}); }
		};
		Object.extend(this.effects, jFx);
		this.controls = {
			folder: eStack.get('Folder'),
			n: eStack.get('Notes'),
			view: eStack.get('ViewNote'),
			alert: this.still.bind(this)
		};
		Object.extend(this.data[2].p, {droppables: [this.controls.folder.data[0].p]});
		this.notes = this.controls.n.screen;
		this.populate();
		this.data[1].p.addEvent('click', this.controls.n.save.bind(this.controls.n));
	},
	
	populate: function() {
		for(var i = 0; i < this.notes.length; i++) {
			var el = this.controls.n.getEl(this.notes[i].id);
			el.injectInside(this.data[0].p);
			this.effects.fade(el).start(1);
			el.addEvent('dblclick', this.controls.view.load.pass(el, this.controls.view));
			el.makeDraggable(this.data[2].p);
		}
	},
	
	dropped: function(what) {
		what.setOpacity(1);
		this.jerk(what, this.data[2].pr('container'), this.data[3].pr('bVertical'), this.data[3].pr('bHorizontal'), this.controls.alert);
	},
	
	add: function(id) {
		var el = this.controls.n.getEl(id);
		el.injectInside(this.data[0].p);
		dStack.get('Tooltips').build(el);
		this.effects.fade(el).start(1);
		el.makeDraggable(this.data[2].p);
		el.addEvent('dblclick', this.controls.view.load.pass(el, this.controls.view));
		this.still(el);
	},
	
	still: function(el) {
		this.data[1].p.addClass('alert');
		this.controls.n.updatePos(el);
	},
	
	reAttachEvts: function(el) {
		el.makeDraggable(this.data[2].p);
		el.addEvent('dblclick', this.controls.view.load.pass(el, this.controls.view));
		this.data[1].p.addClass('alert');
	}
});
Evt.Screen.implement(jFunc);