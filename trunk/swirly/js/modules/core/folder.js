Evt.Folder = Evt.Base.extend({
	initialize: function() {
		this.parent('Folder', this);
		this.data.extend([
			new Data($('cornerfolder')),
			new Data($('archive')),
			new Data({
				height: 75,
				src: 'images/bigfolder-trans.png',
				orig: 'images/bigfolder.png'
			}),
			new Data($('cornerfolder').getFirst())
		]);
		this.folder = $('cornerfolder');
		this.archive = $('archive');
		this.effects = {
			slide: new Fx.Style(this.data[1].p, 'height', {fps: 75})
		};
		this.controls = {
			mousedown: function() {this.data[3].set(this.data[2].pr('src'), 'src')}.bind(this),
			mouseup: function() {this.data[3].set(this.data[2].pr('orig'), 'src')}.bind(this),
			click: this.clicked,
			debug: eStack.get('DebugBox'),
			shove: this.shove,
			archive: eStack.get('Archive')
		};
		this.data[0].p.addEvents({
			over: this.controls.mousedown,
			leave: this.controls.mouseup,
			drop: function(el, drag) {
				this.effects.slide.start(this.data[2].pr('height'));
				this.controls.archive.add.pass([el, drag], this.controls.archive).call();
				this.controls.mouseup();
			}.bind(this)
		});
		this.effects.slide.addEvent('onComplete', this.controls.shove.bind(this));
		this.data[0].p.addEvent('mousedown', this.controls.mousedown);
		this.data[0].p.addEvent('mouseup', this.controls.mouseup);
		this.data[0].p.addEvent('click', this.controls.click.bind(this));
	},
	
	clicked: function() {
		var h = this.data[2].pr('height').toInt();
		if(this.effects.slide.timer) this.effects.slide.clearTimer();
		if(this.effects.slide.to == h || this.data[1].pr('height').toInt() == h) {
			this.effects.slide.start(0);
			this.controls.archive.loadOpts(1);
		}
		else this.effects.slide.start(h);
	},
	
	shove: function() {
		var h = this.data[2].pr('height')
		if(this.data[1].pr('height').toInt() != h) return;
		var d = this.controls.debug;
		if(d.data[0].pr('display') == 'none') var e = d.data[1];
		else var e = d.data[0];
		var max = h + d.data[6].pr('bVertical');
		if(e.pr('top').toInt() < max) d.effects.top(e.p).start(max);
	}
});