Evt.Notes = Evt.Base.extend({
	initialize: function() {
		this.parent('Notes', this);
		this.data.extend([
			new Data(phpDumpNotes)
		]);
		this.controls = {
			ajax: eStack.get('Jax')
		}
		this.cleanOldNotes();
		this.all = this.data[0].p;
		this.archive = this.load('archive');
		this.screen = this.load('screen');
		this.els = this.createNotes();
	},
	
	cleanOldNotes: function() {
		for(var i = 0; i < this.data[0].p.length; i++) {
			if(this.data[0].p[i].due.indexOf(' ') < 0 && this.data[0].p[i].due.length > 0) this.data[0].p[i].due += ' 0:0:0';
		}
	},
	
	load: function(what) {
		var ar = this.all;
		var r = new Array();
		for(var i = 0; i < ar.length; i++) {
			if(ar[i].sec == what) r.push(ar[i]);
		}
		return r;
	},
	
	getCats: function(sec) {
		var sc = sec || 'all';
		var used = new Array();
		var r = new Array();
		for(var i = 0; i < this[sc].length; i++) {
			if(!used.test(this[sc][i].cat)) r.push(this[sc][i].cat);
		}
		return r;
	},
	
	add: function(note, to) {
		note.sec = to;
		this.all.push(note);
		this[to].push(note);
		this.els.push(this.createNote(note));
	},
	
	remove: function(noteId, from) {
		var n = this.getNote(noteId);
		this.all.remove(n);
		this[from].remove(n);
		this.els.remove(this.getEl(noteId));
	},
	
	move: function(el, to) {
		if(to == 'archive') var from = 'screen';
		else var from = 'archive';
		var n = this.getNote(el.id.split('_')[1]);
		n.sec = to;
		this[from].remove(n);
		this[to].push(n);
	},
	
	getNote: function(id) {
		for(var i = 0; i < this.all.length; i++) {
			if(this.all[i].id == id) return this.all[i];
		}
	},
	
	getEl: function(id) {
		for(var i = 0; i < this.els.length; i++) {
			if(this.els[i].getProperty('id') == 'note_' + id) return this.els[i];
		}
	},
	
	getIndex: function(id) {
		for(var i = 0; i < this.all.length; i++) {
			if(this.all[i].id == id) return i;
		}
	},
	
	newId: function() {
		var last = 0;
		for(var i = 0; i < this.all.length; i++) {
			if(this.all[i].id > last) last = this.all[i].id;
		}
		return last.toInt() + 1;
	},
	
	save: function() {
		this.controls.ajax.start(Json.toString(this.all));
		$('save').removeClass('alert');
	},
	
	createNote: function(n) {
		return new Element('div').setStyles({
			top: n.y + 'px',
			left: n.x + 'px',
			'z-index': '999998',
			visibility: 'hidden'
		}).setProperties({
			id: 'note_' + n.id,
			title: n.title.replace(/!\[\[AMP\]\]/g, '&amp;') + '::&nbsp'
		}).addClass('note').addClass(n.img).addClass(this.calcColour(n.due));
	},
	
	createNotes: function(single) {
		var r = new Array();
		for(var i = 0; i < this.all.length; i++) {
			r.push(this.createNote(this.all[i]));
		}
		return r;
	},
	
	calcColour: function(due) {
		if(!due || due == '') return 'maroon';
		var today = new Date();
		var due = this.parseDate(due);
		var tmp1 = new Date(due); tmp1.setDate(due.getDate() - 2);
		var tmp2 = new Date(due); tmp2.setDate(due.getDate() - 5);
		if(today >= due || today >= tmp1) return 'red';
		else if(today < tmp1 && today >= tmp2) return 'orange';
		else return 'blue'
	},
	
	updatePos: function(el) {
		var n = this.getNote(el.getProperty('id').split('_')[1]);
		var c = el.getCoordinates();
		n.x = c.left;
		n.y = c.top;
	}
});
Evt.Notes.implement(dateFuncs);