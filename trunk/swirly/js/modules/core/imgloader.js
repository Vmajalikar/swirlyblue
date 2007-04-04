Evt.ImgLoader = Evt.Base.extend({
	initialize: function() {
		this.parent('ImgLoader', this);
		this.imgs = new Array(
			'images/bigfolder-trans.png',
			'img/adnote_lightblue.png',
			'img/savechanges_lightblue.png',
			'img/savechanges_orange.png',
			'img/savechanges_orange_highlight.png',
			'img/tooltip-top.png',
			'img/tooltip-bottom.png',
			'img/cancel_red_highlight.png',
			'img/savenote_green.png',
			'img/savenote_green_highlight.png',
			'img/logout-highlighted.png',
			'img/arrow_in_highlighted.png',
			'img/align_highlight.png'
		);
		this.imgs.extend(phpDumpHoverImgs);
		this.ar = new Array();
		this.controls = {
			box: eStack.get('Loadbox'),
			bar: eStack.get('Loadbar')
		};
	},
	
	load: function() {
		this.controls.box.toggle(2);
		this.controls.bar.toggle(2);
		var per = 100 / this.imgs.length;
		this.ar.extend(new Asset.images(this.imgs, {
			onProgress: this.controls.bar.inc.pass(per, this.controls.bar),
			onComplete: function() {
				this.controls.bar.toggle();
				this.controls.box.toggle();
			}.bind(this)
		}));
	}
});