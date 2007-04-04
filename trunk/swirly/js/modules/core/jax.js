Evt.Jax = Evt.Base.extend({
	initialize: function() {
		this.parent('Jax', this);
		this.data.extend([
			new Data({
				url: 'php/ajax.php',
				noData: 'Unable to create Ajax request: No data supplied',
				timeout: 'The ajax request has failed for some reason. Click the loading bubble to terminate it or wait a bit longer to see if it completes.',
				failed: 'The ajax request has failed. Please try again in a few minutes or so.'
			}),
			new Data({
				onComplete: this.done.bind(this),
				onRequest: this.start.bind(this),
				onStateChange: this.update.bind(this),
				method: 'post',
				onFailure: this.failed.bind(this),
				evalScripts: true
			}),
			new Data({active: 'no'}, 'JaxLocks')
		]);
		this.controls = {
			ajax: new Ajax(this.data[0].pr('url'), this.data[1].p),
			box: eStack.get('Loadbox'),
			error: eStack.get('DebugBox')
		}
	},
	
	start: function(dat, funcs) {
		if(this.tmpActive) return;
		this.tmpActive = true;
		if(!dat) {
			this.controls.error.add(this.data[0].pr('noData'));
			return;
		}
		var b = this.controls.box;
		b.effects.fade.start(1);
		b.controls.bar.effects.fade.start(1);
		this.controls.ajax.options.postBody = 'data=' + dat;
		this.controls.ajax.request();
		this.funcs = funcs || {};
	},
	
	update: function() {
		if(this.controls.box.controls.bar.effects.slide.timer) this.controls.box.controls.bar.effects.slide.clearTimer();
		this.controls.box.controls.bar.inc(25);
	},
	
	done: function(text) {
		var failed = false;
		if(!text) {
			this.controls.error.add(this.data[0].pr('failed'));
			failed = true;
		}
		if(text.indexOf('||') > -1 && text.split('||')[0] == 'FAIL') {
			if(text.split('||')[1] == 'LOGIN') location.href = 'index.php';
			this.controls.error.add(text.split('||')[1]);
			failed = true;
		}
		this.controls.box.effects.fade.clearTimer();
		this.controls.box.controls.bar.effects.fade.clearTimer();
		this.controls.box.effects.fade.start(0);
		this.controls.box.controls.bar.effects.fade.start(0);
		this.tmpActive = false;
		if(failed && this.funcs.onFail) this.funcs.onFail.call();
		else if(!failed && this.funcs.onPass) this.funcs.onPass.pass(text).call();
	},
	
	terminate: function() {
		this.controls.box.effects.fade.start(0);
		this.controls.box.controls.bar.effects.fade.start(0);
		this.controls.box.data[0].p.removeEvent('click');
	},
	
	failed: function() {
		this.controls.error.add(this.data[0].pr('failed'));
		this.terminate();
	}
});