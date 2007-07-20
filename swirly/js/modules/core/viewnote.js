Evt.ViewNote = Evt.Base.extend({
	initialize: function() {
		this.parent('ViewNote', this);
		this.data.extend([
			new Data($('viewnote')),
			new Data($('viewnote').getFirst().getFirst()),
			new Data($('closeViewNote')),
			new Data($('countdown')),
			new Data($E('#viewnote .lightbox .box h2')),
			new Data($E('#viewnote .lightbox .box p')),
			new Data($('editThisNote'))
		]);
		this.optionbar = $E('#viewnote div.optionbar');
		this.cont = $E('#viewnote div.container');
		this.effects = {
			fade: new Fx.Style(this.data[1].p, 'opacity', {duration: 400}),
			sideScroll: new Fx.Scroll(this.cont, {duration: 400})
		};
		this.controls = {
			add: eStack.get('AddNote'),
			n: eStack.get('Notes')
		};
		this.data[2].p.addEvent('click', this.close.bind(this));
		this.data[6].p.addEvent('click', this.edit.bind(this));
	},
	
	load: function(el) {
		this.el = el;
		this.data[0].p.show();
		var n = this.controls.n.getNote(el.getProperty('id').split('_')[1]);
		var due = this.getDueDate(n.due);
		this.data[3].p.setHTML(due.txt);
		this.optionbar.className = 'optionbar';
		this.optionbar.addClass(due.cl);
		this.data[4].p.setHTML(n.title.replace(/!\[\[AMP\]\]/g, '&amp;'));
		this.data[5].p.setHTML(n.txt.replace(/!\[\[AMP\]\]/g, '&amp;'));
		this.effects.fade.start(0, 1);
		this.resize();
	},
	
	getDueDate: function(due) {
		if(!due || due == '') return {txt: 'no deadline', cl: 'inactive'};
		var d = this.parseDate(due);
		var today = new Date();
		if(today >= d) {
			if(today.getYear() == d.getYear() && today.getMonth() == d.getMonth() && today.getDate() == d.getDate()) var txt = 'today!';
			else var txt = 'overdue!'
			var class = 'urgent';
		} else {
			var txt = '';
			var seconds = Math.round((d - today) / 1000);
			var years = Math.floor(seconds / 31536000);
			var months = Math.floor((seconds - (years * 31536000)) / 2592000);
			var days = Math.floor((seconds - (years * 31536000) - (months * 2592000)) / 86400);
			var hours = Math.floor((seconds - (years * 31536000) - (months * 2592000) - (days * 86400)) / 3600);
			var minutes = Math.floor((seconds - (years * 31536000) - (months * 2592000) - (days * 86400) - (hours * 3600)) / 60);
			seconds = seconds - (years * 31536000) - (months * 2592000) - (days * 86400) - (hours * 3600) - (minutes * 60);
			if(years) txt += years + ' ' + ((years > 1) ? 'years' : 'year');
			if(months) txt += ', ' + months + ' ' + ((months > 1) ? 'months' : 'month');
			if(days) txt += ', ' + days + ' ' + ((days > 1) ? 'days' : 'day');
			if(hours) txt += ', ' + hours + ' ' + ((hours > 1) ? 'hours' : 'hour');
			if(minutes) txt += ', ' + minutes + ' ' + ((minutes > 1) ? 'minutes' : 'minute');
			if(seconds) txt += ', ' + seconds + ' ' + ((seconds > 1) ? 'seconds' : 'second');
			if(txt.test(', ')) {
				var spl = txt.split(', ');
				var save = spl[spl.length - 1].toString();
				spl = spl.slice(0, spl.length - 1);
				txt = spl.join(', ');
				txt += ' and ' + save;
				if(txt.indexOf(',') == 0) txt = txt.substr(2, txt.length);
			}
			var class = 'safe';
			if(!txt.test('month') && !txt.test('year')) {
				if(txt.split(' ')[0].toInt() < 4) class = 'urgent';
				if(!txt.test('day')) class = 'urgent';
			}
		}
		return {txt: txt, cl: class};
	},
	
	edit: function() {
		this.close();
		this.controls.add.loadFullBox(this.el);
	}
});
Evt.ViewNote.implement(dateFuncs);
Evt.ViewNote.implement(resize);