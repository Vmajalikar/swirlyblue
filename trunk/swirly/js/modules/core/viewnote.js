Evt.ViewNote = Evt.Base.extend({
	initialize: function() {
		this.parent('ViewNote', this);
		this.data.extend([
			new Data($('viewnote')),
			new Data($('viewnote').getFirst().getFirst()),
			new Data($('closeViewNote')),
			new Data($E('#viewnote .lightbox .box #duedate')),
			new Data($E('#viewnote .lightbox .box h2')),
			new Data($E('#viewnote .lightbox .box p')),
			new Data($E('#viewnote .lightbox .box .noteactions a'))
		]);
		this.effects = {
			fade: new Fx.Style(this.data[1].p, 'opacity', {duration: 400})
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
		this.data[3].p.className = '';
		this.data[3].p.addClass(due.cl);
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
			var days = Math.round((d - today) / (3600 * 24 * 1000));
			var years = Math.floor(days / 365);
			var months = Math.floor((days - (years * 365)) / 30);
			days = days - (years * 365) - (months * 30) + 1;
			if(years) txt += years + ' ' + ((years > 1) ? 'years' : 'year');
			if(months) txt += ((txt != '') ? ', ' : '') + months + ' ' + ((months > 1) ? 'months' : 'month');
			if(days) txt += ((txt != '') ? ' and ' : '') + days + ' ' + ((days > 1) ? 'days' : 'day');
			var class = 'safe';
			if(!txt.test('month') && !txt.test('year')) {
				if(txt.split(' ')[0].toInt() < 4) class = 'urgent';
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