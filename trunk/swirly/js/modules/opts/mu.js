Opt.MU = Opt.Base.extend({
	initialize: function() {
		this.parent(this, 'MU');
		this.sub = $E('div.subOpts');
		this.insub = this.sub.getElements('div')[1];
		this.popup = this.master.main.getElement('div div.moreOpts');
		this.tMasterUser = $('tMasterUser');
		this.ext = $('extrasBox');
		this.consts = { left: 15, top: 10, mxH: 4, tr: 21 };
		this.scroll = new Scroller(this.insub, {area: 5});
		this.scrollers = {top: this.sub.getElement('div.scrollup'), bottom: this.sub.getElement('div.scrolldown')};
		
		this.effects = {
			height: function(el) { return new Fx.Style(el, 'height'); },
			opts: new Fx.Style(this.popup, 'opacity', {duration: 400}),
			slide: new Fx.Scroll(this.master.box),
			fade: function(el) { return new Fx.Style(el, 'opacity', {duration: 400}); }
		};
		
		this.controls = {
			ajax: eStack.get('Jax')
		};
		
		if(!this.opt.disabled) this.opt.addEvent('change', this.extendMU.bindAsEventListener(this));
		else {
			$$('div.subOpts div table tbody tr td img.editUser').each(function(el) { el.remove(); });
			$$('div.subOpts div table tbody tr td img.delUser').each(function(el) { el.remove(); });
			$E('div img.addUser').remove();
		}
		if(this.f.masterUser) {
			var fn = function() {
				if(this.className.test('temp')) {
					this.className = '';
					this.value = '';
				}
			};
			this.f.masterUser.addEvent('focus', fn.bind(f.masterUser));
			this.f.masterPass.addEvent('focus', fn.bind(f.masterPass));
			this.f.saveMaster.addEvent('click', this.addMaster.bind(this));
		}
		if(this.sub.getElement('img.addUser')) this.sub.getElement('img.addUser').addEvent('click', this.loadAddUserBox.bind(this));
		this.popup.getElements('div img').each(function(el) {
			el.addEvent('click', function() {
				$('userImg').src = el.src;
				if(this.effects.opts.timer) $clear(this.effects.opts);
				this.effects.opts.start(1, 0);
			}.bind(this));
		}.bind(this));
		if(this.sub.getElements('div table tbody tr td img.editUser')) {
			this.sub.getElements('div table tbody tr td img.editUser').each(function(el) {
				el.addEvent('click', this.loadEditUserBox.pass(el, this));
			}.bind(this));
			this.sub.getElements('div table tbody tr td img.delUser').each(function(el) {
				el.addEvent('click', this.delUser.pass(el, this));
			}.bind(this));
		}
		this.logout = $('logout');
		this.logout.addEvent('click', function() { this.controls.ajax.start('LOGOUT'); }.bind(this));
		this.slideBack = $E('div.slideme div.slideBack');
		this.slideBack.addEvent('click', this.closeExtrasBox.bind(this));
	},
	
	onOpen: function() {
		if(!this.opt.checked) this.sub.setStyle('height', '0px');
		else {
			if(this.sub.getElements('div table tbody tr').length > this.consts.mxH) {
				this.insub.setStyle('height', this.consts.mxH * this.consts.tr + 'px');
				this.loadScroller();
			}
			else this.stopScroller();
		}
	},
	
	loadScroller: function() {
		this.scroll.start();
		if(this.scrollers.top.getStyle('visibility') == 'hidden') {
			for(var scroller in this.scrollers) {
				this.effects.fade(this.scrollers[scroller]).start(0, 1);
			}
		}
	},
	
	stopScroller: function() {
		this.scroll.stop();
		if(this.scrollers.top.getStyle('visibility') != 'hidden') {
			for(var scroller in this.scrollers) this.effects.fade(this.scrollers[scroller]).start(1, 0);
		}
	},
	
	extendMU: function(e) {
		var ch = e.target;
		var el = ch.getParent().getNext();
		if(el.myFx && el.myFx.timer) el.myFx.clearTimer();
		el.myFx = this.effects.height(el);
		if(ch.checked) {
			this.controls.ajax.start('ENABLE_OPT&opt=MU&notes=' + Json.toString(eStack.get('Notes').all));
			el.myFx.start(el.scrollHeight);
			this.logout.show();
		}
		else {
			this.controls.ajax.start('DISABLE_OPT&opt=MU&notes=' + Json.toString(eStack.get('Notes').all));
			el.myFx.options.extend({onComplete: this.effects.height(this.master.box)});
			el.myFx.start(0);
			this.logout.hide();
		}
	},
	
	addMaster: function() {
		this.addUser(this.f.masterUser.value, this.f.masterPass.value, 'user_gray', true);
	},
	
	addUser: function(user, pass, img, master) {
		if($type(user) == 'element' && user.tagName == 'FORM') {
			var f = user;
			var master = pass;
			var user = f.user.value;
			var pass = f.pass.value;
			var img = $('userImg').src.split('/').last().split('.png')[0];
		}
		var fn = { onPass: this.displayUser.bind(this) };
		if(master) {
			master = 'yes&notes=' + Json.toString(eStack.get('Notes').all);
			fn.onPass = this.displayMaster.bind(this);
		}
		else master = 'no';
		this.controls.ajax.start('ADD_USER&user=' + user + '&pass=' + pass + '&img=' + img + '&master=' + master, fn);
	},
	
	editUser: function(f) {
		var img = $('userImg').src.split('/').last().split('.png')[0];
		var fn = { onPass: this.displayEdit.bind(this) };
		this.controls.ajax.start('EDIT_USER&user=' + f.user.value + '&oldPass=' + f.oldPass.value + '&newPass=' + f.newPass.value + '&img=' + img + '&id=' + f.userId.value, fn);
	},
	
	displayEdit: function(text) {
		var x = text.split('||');
		var user = x[1]; var img = x[2]; var id = x[3];
		var tr = $('user_' + id);
		tr.setStyle('visibility', 'hidden');
		var tds = tr.getElements('td');
		tds[0].innerHTML = user;
		tds[1].getFirst().src = 'images/' + img + '.png';
		new Fx.Style(tr, 'opacity', {duration: 400}).start(0, 1);
		this.closeExtrasBox();
	},
	
	displayMaster: function(text) {
		var x = text.split('||');
		var user = x[1]; var id = x[2];
		this.sub.getFirst().setHTML(this.tMasterUser.innerHTML);
		var tr = this.sub.getElement('div table tbody tr');
		tr.setProperty('id', 'user_' + id);
		tr.getFirst().setHTML(user);
		tr.getChildren()[1].getFirst().src = 'images/user_gray.png';
		tr.getElement('td img.delUser').remove();
		tr.getElement('td img.editUser').addEvent('click', this.loadEditUserBox.pass(tr.getElement('td img.editUser'), this));
		this.sub.getElement('img.addUser').addEvent('click', this.loadAddUserBox.bind(this));
		this.closeExtrasBox();
		this.checkScroll();
	},
	
	displayUser: function(text) {
		var x = text.split('||');
		var user = x[1]; var img = x[2]; var id = x[3];
		var tbody = this.sub.getElement('div table tbody');
		var el = this.tMasterUser.getElement('table tbody tr').clone();
		el.injectInside(tbody);
		var tr = tbody.getElements('tr').last();
		tr.setProperty('id', 'user_' + id);
		tr.getFirst().setHTML(user);
		tr.getChildren()[1].getFirst().src = 'images/' + img + '.png';
		tr.getElement('td img.delUser').addEvent('click', this.delUser.pass(tr.getElement('td img.delUser'), this))
		tr.getElement('td img.editUser').addEvent('click', this.loadEditUserBox.pass(tr.getElement('td img.editUser'), this));
		this.closeExtrasBox();
		this.checkScroll();
	},
	
	checkScroll: function() {
		if(this.sub.getElements('div table tbody tr').length > this.consts.mxH) {
			this.insub.setStyle('height', this.consts.mxH * this.consts.tr + 'px');
			this.loadScroller();
		} else {
			this.insub.setStyle('height', 'auto');
			this.stopScroller();
		}
	},
	
	loadExtrasBox: function(template) {
		var el = this.ext;
		if($('userImg')) $('userImg').setProperty('id', '');
		el.setHTML(template.innerHTML);
		this.slideBack.setStyle('height', this.master.box.scrollHeight + 'px');
		this.effects.slide.scrollTo(460);
	},
	
	loadAddUserBox: function() {
		this.loadExtrasBox($('tAddUser'));
		var el = this.ext;
		var f = el.getElement('form');
		el.getElement('img.userImg').setProperty('id', 'userImg');
		$('userImg').addEvent('click', this.chooseUserImg.bind(this));
		f.saveUser.addEvent('click', this.addUser.pass([f, false], this));
	},
	
	loadEditUserBox: function(rows) {
		rows = rows.getParent().getParent().getElements('td');
		var el = this.ext;
		this.loadExtrasBox($('tEditUser'));
		el.getElement('img.userImg').setProperty('id', 'userImg');
		var f = el.getElement('form');
		f.userId.value = rows[0].getParent().id.split('_')[1];
		if(!f.saveUser.events) f.saveUser.addEvent('click', this.editUser.pass(f, this));
		f.user.value = rows[0].innerHTML;
		f.oldPass.value = '';
		f.newPass.value = '';
		$('userImg').src = rows[1].getFirst().src;
		if($('userImg').src.test('gray')) $('userImg').removeEvents('click');
		else if(!$('userImg').events || !$('userImg').events.click) $('userImg').addEvent('click', this.chooseUserImg.bind(this));
	},
	
	closeExtrasBox: function() {
		this.effects.slide.scrollTo(0);
	},
	
	chooseUserImg: function() {
		var c = $('userImg').getCoordinates();
		var anim = true;
		if(this.popup.getStyle('left').toInt() != (c.left - 460) - this.consts.left && this.popup.getStyle('visibility') == 'visible') var anim = false;
		this.popup.setStyles({
			left: (c.left - 460) - this.consts.left + 'px',
			top: c.top + this.consts.top + 'px'
		});
		if(this.effects.opts.timer) this.effects.opts.clearTimer();
		if(anim) {
			if(this.popup.getStyle('visibility') == 'visible') this.effects.opts.start(1, 0);
			else this.effects.opts.start(0, 1);
		}
	},
	
	delUser: function(el) {
		var tr = el.getParent().getParent();
		var tds = tr.getElements('td');
		var ans = confirm("Are you sure you want to delete user '" + tds[0].innerHTML + "'");
		if(!ans) return;
		this.controls.ajax.start('DEL_USER&id=' + tr.id.split('_')[1], {onPass: this.removeRow.bind(this)});
	},
	
	removeRow: function(text) {
		var tr = $('user_' + text.split('||')[1]);
		new Fx.Style(tr, 'opacity', {duration: 400, onComplete: function() {
			tr.remove();
			this.checkScroll();
		}.bind(this)}).start(1, 0);
	}
});