var hTog = {
	toggle: function(force) {
		if(this.effects.fade.timer) this.effects.fade.clearTimer();
		if(force) {
			switch(force) {
				case 1: this.effects.fade.start(0); break;
				case 2: this.effects.fade.start(1); break;
			}
		} else {
			if(this.main.getStyle('visibility') == 'visible') this.effects.fade.start(0)
			else this.effects.fade.start(1);
		}
	}
};

var jFunc = {
	jerk: function(dropped, cont, v, h, onComplete) {
		var a = dropped.getCoordinates();
		var b = cont.getCoordinates();
		if(this.controls.folder.folder.getStyle('height').toInt() == this.controls.folder.archive.getStyle('height')) v += this.controls.folder.archive.getStyle('height');
		var tFx = this.effects.top(dropped);
		var lFx = this.effects.left(dropped);
		
		if(a.left < b.left + h) lFx.start(h);
		if(a.top < b.top + v) tFx.start(v);
		if(a.left + a.width > b.width - h) lFx.start(b.width - (h + a.width));
		if(a.top + a.height > b.height - h) tFx.start(b.height - (h + a.height));
		if($type(onComplete) == 'function') {
			if(lFx.timer || tFx.timer) onComplete.pass(dropped, this).delay(400);
			else onComplete.pass(dropped, this).call();
		}
	}
};

var jFx = {
	left: function(el) { return new Fx.Style(el, 'left', {duration: 400, transition: Fx.Transitions.backOut}); },
	
	top: function(el) { return new Fx.Style(el, 'top', {duration: 400, transition: Fx.Transitions.backOut}); }
};

var dateFuncs = {
	parseDate: function(string) {
		var d = string.split(' ');
		if(!d[1]) d[1] = '0:0:0';
		var t = d[1].split(':');
		var nd = d[0].split('-');
		var tmp = new Date();
		tmp.setTime(0);
		var m = nd[1].toInt() - 1;
		tmp.setFullYear(nd[0].toInt(), m, nd[2].toInt());
		tmp.setHours(t[0], t[1], t[2]);
		return tmp;
	}
};

var fFunc = {
	clearForm: function(f) {
		var protected = f.getElements('.protect');
		for(var i = 0; i < f.elements.length; i++) {
			if(f.elements[i].value && !protected.test(f.elements[i])) f.elements[i].value = '';
		}
	},
	
	formToNote: function(f) {
		var id = (f.noteId.value == '') ? this.controls.n.newId().toInt() : f.noteId.value.toInt();
		var c = (f.noteId.value == '') ? { left: this.data[7].pr('x'), top: this.data[7].pr('y') } : $('note_' + f.noteId.value).getCoordinates();
		var d = new Date();
		var due = new Date();
		due.setTime(0);
		if(f.elements[1].value != '' && f.elements[2].value != '' && f.date.value != '') due.setFullYear(f.date.value.toInt(), f.elements[2].value.toInt() - 1, f.elements[1].value.toInt());
		else due = '';
		var time = new Array();
		for(var i = 4; i <= 6; i++) {
			if(f.elements[i].value == '') var k = 0;
			else var k = f.elements[i].value.toInt();
			time.push(k);
		}
		if(due != '') {
			due.setHours(time[0], time[1], time[2]);
		}
		var today = new Date();
		if(due != '' && due < today && f.noteId.value == '') due = '';
		if(due != '') {
			due = (due.getYear() + 1900) + '-' + (due.getMonth() + 1) + '-' + due.getDate() + ' ' + due.getHours() + ':' + due.getMinutes() + ':' + due.getSeconds();
		}
		return {
			id: id,
			sec: (f.noteId.value == '') ? 'screen' : this.controls.n.getNote(id).sec,
			created: (d.getYear() + 1900) + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getHours(),
			due: due,
			x: c.left,
			y: c.top,
			img: this.parseImg(this.data[4].pr('src')),
			cat: f.Category.value.replace(/&/g, '![[AMP]]'),
			title: f.Title.value.replace(/&/g, '![[AMP]]'),
			txt: f.contents.value.replace(/\n/g, '<br />').replace(/&/g, '![[AMP]]')
		};
	},
	
	parseImg: function(str) {
		return(str.split('/')[str.split('/').length - 1].substr(1).split('.png')[0]);
	}
};

var resize = {
	resize: function() {
		var b = this.data[1].p.getCoordinates();
		var h = Window.getHeight();
		var w = Window.getWidth();
		this.data[1].set(Math.floor((h/2)-(b.height/2)) + 'px', 'top');
		this.data[1].set(Math.floor((w/2)-(b.width/2)) + 'px', 'left');
	},
	
	close: function() {
		this.effects.fade.start(1, 0).chain(this.data[0].p.hide.bind(this.data[0].p));
	}
};