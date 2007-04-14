Evt.Loadbox = Evt.Base.extend({
	initialize: function() {
		this.parent('Loadbox', this);
		this.main = $('loadbox');
		this.effects = {
			fade: new Fx.Style(this.main, 'opacity')
		};
		this.controls = {
			bar: eStack.get('Loadbar')
		};
		this.cont = this.controls.bar.main;
	}
});
Evt.Loadbox.implement(hTog);