Evt.AddNote = Evt.Base.extend({
	initialize: function() {
		this.parent('AddNote', this);
		this.data.extend([
			new Data($('add')),
			new Data($('editnote')),
			new Data($('closeEditNote')),
			new Data($('fEditNote')),
			new Data($('noteImage')),
			new Data($('editnote').getFirst().getFirst()),
			new Data($('cancelEditNote')),
			new Data({
				x: 20,
				y: 50,
				leftShift: 30,
				cHover: 'img/cancel_red_highlight.png',
				sHover: 'img/savenote_green_highlight.png',
				saveBut: 'img/savenote_green.png',
				sButDis: 'img/savenote_disabled.png'
			}),
			new Data($('noteCat')),
			new Data({esc: 'off', leftShift: 'on'}, 'AddNoteLocks'),
			new Data($('saveNote')),
			new Data($$('.required')),
			new Data($('imgbox')),
			new Data($('closeImgbox')),
			new Data($$('.imgselect'))
		]);
		this.effects = {
			fade: new Fx.Style(this.data[5].p, 'opacity', {duration: 400}),
			shift: new Fx.Style(this.data[5].p, 'left', {transition: Fx.Transitions.backInOut}),
			load: new Fx.Style(this.data[12].p, 'opacity', {duration: 400})
		};
		this.controls = {
			n: eStack.get('Notes'),
			screen: eStack.get('Screen')
		};
		this.data[0].p.addEvent('click', this.loadClearBox.bind(this));
		this.data[2].p.addEvent('click', this.closeBox.bind(this));
		this.data[10].p.addEvent('click', this.saveNote.bind(this));
		this.data[8].p.addEvent('keydown', this.autoFill.bindWithEvent(this));
		this.data[11].p.each(function(e) {
			e.addEvent('keyup', this.checkValid.bind(this));
		}.bind(this));
		this.data[4].p.addEvent('click', this.loadImgBox.bind(this));
		this.data[13].p.addEvent('click', this.unloadImgBox.bind(this));
		this.data[14].p.each(function(e) {
			e.addEvent('click', this.changePic.pass(e, this));
		}.bind(this));
		this.data[10].p.addClass('secondary');
	},
	
	loadClearBox: function() {
		this.data[1].p.show();
		this.clearForm(this.data[3].p);
		this.effects.fade.start(0, 1);
		this.resize();
	},
	
	loadFullBox: function(el) {
		this.data[1].p.show();
		var id = el.getProperty('id').split('_')[1];
		var n = this.controls.n.getNote(id);
		if(n.due != '') {
			var d = n.due.split(' ');
			var t = d[1].split(':');
			var d = d[0].split('-');
		} else {
			var d = new Array('', '', ''); var t = d;
		}
		this.data[3].p['noteId'].value = id;
		this.data[3].p.elements[1].value = d[2];
		this.data[3].p.elements[2].value = d[1];
		this.data[3].p['date'].value = d[0];
		this.data[3].p['hour'].value = t[0];
		this.data[3].p['minute'].value = t[1];
		this.data[3].p['second'].value = t[2];
		this.data[3].p['Title'].value = n.title.replace(/!\[\[AMP\]\]/g, '&');
		this.data[3].p['Category'].value = n.cat.replace(/!\[\[AMP\]\]/g, '&');
		this.data[4].set('images/_' + n.img + '.png', 'src');
		this.data[3].p['contents'].value = n.txt.replace(/<br[^>]+>/g, "\n").replace(/!\[\[AMP\]\]/g, '&');
		this.data[10].p.removeClass('secondary');
		this.effects.fade.start(0, 1);
		this.resize();
	},
	
	closeBox: function() {
		this.effects.fade.start(0).chain(function() {
			this.data[1].p.hide();
		}.bind(this));
		this.effects.load.start(0);
		this.data[9].set('on', 'leftShift');
	},
	
	saveNote: function() {
		if(this.data[10].p.hasClass('secondary')) return;
		var dat = this.formToNote(this.data[3].p);
		if(this.data[3].p.noteId.value != '') {
			var el = this.controls.n.getEl(dat.id);
			el.className = 'note ' + dat.img + ' ' + this.controls.n.calcColour(dat.due);
			el.myTitle = dat.title.replace(/!\[\[AMP\]\]/g, '&amp;');
			var i = this.controls.n.getIndex(dat.id);
			this.controls.n.all[i] = dat;
		} else {
			this.controls.n.add(dat, 'screen');
			this.controls.screen.add(dat.id);
		}
		this.closeBox();
		$('save').addClass('alert');
	},
	
	autoFill: function(e) {
		if(e.key != 'esc') {
			this.data[9].set('off', 'esc');
			return;
		}
		if(this.data[9].pr('esc') == 'off') {
			this.iVal = this.data[8].p.value;
			this.iNow = 0;
			var cats = this.controls.n.getCats();
			this.iMatches = new Array();
			for(var i = 0; i < cats.length; i++) {
				if(false !== cats[i].test(this.iVal) && !this.iMatches.test(cats[i])) this.iMatches.push(cats[i]);
			}
			this.iMatches.push(this.iVal);
			this.data[9].set('on', 'esc');
		}
		this.hack.bind(this).delay(1);
	},
	
	hack: function() {
		this.data[8].p.value = this.iMatches[this.iNow];
		this.iNow++;
		if(this.iNow >= this.iMatches.length) this.iNow = 0;
	},
	
	resize: function() {
		var b = this.data[5].p.getCoordinates();
		var i = this.data[12].p.getCoordinates();
		var h = Window.getHeight();
		var w = Window.getWidth();
		this.data[5].set(Math.floor((h/2)-(b.height/2)) + 'px', 'top');
		this.data[12].set(Math.floor((h/2)-(i.height/2)) + 'px', 'top');
		if(this.data[9].pr('leftShift') == 'on') this.data[5].set(Math.floor((w/2)-(b.width/2)) + 'px', 'left');
	},
	
	checkValid: function() {
		var valid = true;
		this.data[11].p.each(function(e) {
			if(e.value == '') valid = false;
		});
		if(valid) this.data[10].p.removeClass('secondary');
		else this.data[10].p.addClass('secondary');
	},
	
	loadImgBox: function() {
		this.effects.shift.start(this.data[7].pr('leftShift')).chain(
		this.effects.load.start.pass(1, this.effects.load)
		);
		this.data[9].set('off', 'leftShift');
	},
	
	unloadImgBox: function() {
		this.effects.load.start(0).chain(
		this.effects.shift.start.pass(Math.floor((Window.getWidth()/2)-(this.data[5].p.getCoordinates().width/2)), this.effects.shift)
		);
		this.data[9].set('on', 'leftShift');
	},
	
	changePic: function(to) {
		this.data[4].set(to.title, 'src');
	}
});
Evt.AddNote.implement(fFunc);