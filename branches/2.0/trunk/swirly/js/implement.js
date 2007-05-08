/*
Script: events.js
	SwirlyBlue Noticeboard actions

Version: 2.0
Release: 1

Authors:
	Kim 'Fyorl' Mantas, <http://soul-scape.com>

License:
	Creative Commons Attribution-Noncommercial-Share Alike 3.0
	<http://creativecommons.org/licenses/by-nc-sa/3.0/>

Credits:
	- Mootools Javascript framework and effects library v1.00 <http://mad4milk.net> (c) 2007 Valerio Proietti, MIT-style license
	- Design is based on Valerio Proietti's 'Mooglets'
	- Most of the graphical and design work (aka, those shiny buttons) was done by Ben Jenkinson and is (c) 2006/2007 Elemental Design <http://soul-scape.com>
*/

Window.addEvent('domready', function() {
	if($('loginBox')) $('loginBox').hide();
	eStack.get('ImgLoader');
	eStack.get('DebugBox');
	
	var evts = new Array(
		'OptBox',
		'Sweep'
	);
	
	var opts = new Array(
		'MU',
		'Snap'
	);
	
	evts.each(function(evt) {
		if(Evt[evt]) new Evt[evt];
	});
	
	opts.each(function(opt) {
		if(Opt && Opt[opt]) new Opt[opt];
	});
	
	eStack.contents.ImgLoader.load();
	var tooltips = new Tips(eStack.get('Notes').els, {
		onShow: function(el) {
			new Fx.Style(el, 'opacity', {duration: 400}).start(1);
		},
		onHide: function(el) { new Fx.Style(el, 'opacity', {duration: 400}).start(0); },
		fixed: true,
		offsets: {'x': 8, 'y': 8}
	});
	dStack.add(tooltips, 'Tooltips');
});

Window.addEvent('resize', function() {
	eStack.get('AddNote').resize();
	eStack.get('ViewNote').resize();
	eStack.get('OptBox').resize();
})