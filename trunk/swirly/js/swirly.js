var Swirly = {
	JsFiles: new Hash({
		core: new Array(
			'core/utils.js',
			'core/loadbox.js',
			'core/loadbar.js',
			'core/imgloader.js',
			'core/debugbox.js',
			'core/folder.js',
			'core/notes.js',
			'core/jax.js',
			'core/archive.js',
			'core/screen.js',
			'core/addnote.js',
			'core/viewnote.js'
		),
		opts: 'optbox.js',
		sweep: 'sweep.js',
		_opt_mu: 'opts/mu.js',
		_opt_snap: 'opts/snap.js'
	}),
	
	getModules: function() {
		var ucMods = this.srcString.split('?')[1].split(',');
		ucMods[0] = ucMods[0].split('=')[1];
		var cMods = new Array();
		ucMods.each(function(mod) {
			var mtch = mod.match(/_opt\[([A-z]+)\]/ig);
			if(mtch) cMods.push('_opt_' + RegExp.$1);
			else cMods.push(mod);
		});
		return cMods;
	},
	
	loadScript: function(file) {
		document.write('<script type="text/javascript" src="js/modules/'+file+'"></script>');
	},
	
	load: function() {
		$$('script').each(function(s) {
			if(s.src && s.src.test(/swirly\.js/i)) this.srcString = s.src;
		}.bind(this));
		if(!this.srcString) throw('The noticeboard cannot function without the inclusion of swirly.js');
		this.mods = this.getModules();
		this.mods.each(function(mod) {
			var files = this.JsFiles.get(mod);
			if($type(files) != 'array') files = new Array(files);
			files.each(this.loadScript);
		}.bind(this));
	}
};

Swirly.load();