Evt.DebugBox = Evt.Base.extend({
	initialize: function() {
		this.parent('DebugBox', this);
		this.data.extend([
			new Data($('debug-maximise')),
			new Data($('debug')),
			new Data($('debug-options')),
			new Data($('debug').getFirst()),
			new Data($('debug-options').getFirst()),
			new Data($('debug-options').getChildren()[1]),
			new Data({height: 210, width: 340, bVertical: 50, bHorizontal: 20}),
			new Data({hover: 'off'}, 'debugBoxLocks'),
			new Data({
				onStart: function() {this.element.setOpacity(.8)},
				container: $E('body')
			})
		]);
		this.effects = {
			max: new Fx.Styles(this.data[1].p, {onComplete: this.jerk.pass([this.data[1].p, this.data[8].pr('container'), this.data[6].pr('bVertical'), this.data[6].pr('bHorizontal'), this.rejig], this)}),
			min: new Fx.Styles(this.data[1].p, {onComplete: this.data[1].p.hide.bind(this.data[1].p)}),
			scroll: new Fx.Scroll(this.data[1].p, {duration: 400})
		};
		Object.extend(this.effects, jFx);
		this.controls = {
			dblclick: this.maximise,
			clickMin: this.minimise,
			clickErr: this.clear,
			hover: this.hover,
			dropped: this.dropped,
			reAlign: this.rejig.bind(this),
			outOfBounds: this.jerk.bind(this),
			write: this.add.bind(this),
			folder: eStack.get('Folder')
		};
		Object.extend(this.data[8].p, {onComplete: this.controls.dropped.bind(this)});
		this.data[0].p.addEvent('dblclick', this.controls.dblclick.bind(this));
		this.data[5].p.addEvent('click', this.controls.clickMin.bind(this));
		this.data[1].p.addEvent('mouseover', this.controls.hover.bind(this));
		this.data[1].p.addEvent('mouseout', this.controls.hover.bind(this));
		this.data[4].p.addEvent('click', this.controls.clickErr.bind(this));
		this.data[0].p.makeDraggable(this.data[8].p);
		this.data[1].p.makeDraggable(this.data[8].p);
	},
	
	maximise: function() {
		this.data[0].p.hide();
		this.data[1].p.show();
		this.data[1].set('hidden', 'overflow');
		this.effects.max.start({
			'height': this.data[6].pr('height'),
			'width': this.data[6].pr('width')
		}).chain(this.data[1].set.pass(['auto', 'overflow'], this.data[1])).chain(this.effects.scroll.toBottom.bind(this.effects.scroll));
	},
	
	minimise: function() {
		this.data[0].p.show();
		this.effects.min.start({
			'height': 0,
			'width': 0
		});
	},
	
	hover: function(e) {
		switch(e.type) {
			case 'mouseover':
			if(this.data[7].pr('hover') == 'on') return;
			this.data[3].p.hide();
			this.data[2].p.show();
			this.data[7].set('on', 'hover');
			break;
			
			case 'mouseout':
			if(this.data[1].p.hasChild(e.relatedTarget)) return;
			this.data[3].p.show();
			this.data[2].p.hide();
			this.data[7].set('off', 'hover');
			break;
		}
	},
	
	clear: function() {
		this.data[3].set('No errors', 'innerHTML');
		this.data[3].p.addClass('centred');
	},
	
	dropped: function(drag) {
		drag.setOpacity(1);
		this.controls.outOfBounds(drag, this.data[8].pr('container'), this.data[6].pr('bVertical'), this.data[6].pr('bHorizontal'), this.rejig);
	},
	
	rejig: function(what) {
		var a = what.getCoordinates();
		if(what == this.data[0].p) var b = this.data[1].p;
		else var b = this.data[0].p;
		b.setStyles({
			top: a.top + 'px',
			left: a.left + 'px'
		});
	},
	
	add: function(text) {
		if(this.data[3].pr('innerHTML') == 'No errors') this.data[3].set('', 'innerHTML');
		if(this.data[0].pr('display') != 'none') this.maximise();
		this.data[3].p.removeClass('centred');
		this.data[3].set(this.data[3].pr('innerHTML') + '> ' + text + '<br />', 'innerHTML');
		this.effects.scroll.toBottom();
	}
});
Evt.DebugBox.implement(jFunc);