<?php
	ini_set('register_globals', '0');
	session_start();
	require_once('php/functions.php');
	$config = simplexml_load_file('xml/config.xml');
	$users = simplexml_load_file('xml/users.xml');
	$opts = load_opts($config);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	<head>
	
		<title>Swirly Blue Noticeboard</title>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="imagetoolbar" content="no" />

		<meta name="Description" content="Just random notes and things." />

		<meta name="Author" content="Soul-Scape.com 2006" />
		<meta name="Copyright" content="Ben J, Fyorl - Soul-Scape.com 2007" />
		<meta name="Rating" content="General" />
		<meta name="Robots" content="noindex,nofollow" />

		<link rel="shortcut icon" type="image/ico" href="/favicon.ico" />

		<link href="css/style.css" rel="stylesheet" type="text/css" media="screen" />
		<link rel="shortcut icon" href="images/favicon.png" />
		
		<script type="text/javascript">
		var phpDumpHoverImgs = new Array(<?php
		$h = opendir('images');
		$str = '';
		while(false !== ($file = readdir($h))) {
			if($file{0} != '~' && substr($file, 0, 9) != 'resultset') continue;
			$str .= "'images/$file',";
		}
		echo substr($str, 0, strlen($str) - 1);
		?>);
		</script>
		
		<script type="text/javascript" src="js/mootools.js"></script>
		<script type="text/javascript" src="js/framework.js"></script>
		<script type="text/javascript" src="js/swirly.js?load=core,opts,sweep,_opt[mu],_opt[snap]"></script>
		<script type="text/javascript" src="js/notes.js"></script>
<?php
	if((string) $opts['MU'] -> value == 'off' || ((string) $opts['MU'] -> value == 'on' && check_login($_SESSION, $users))) {
		if((string) $opts['MU'] -> value == 'on' && check_login($_SESSION, $users)) {
		$user = get_user($_SESSION['uid'], $users);
?>
		<script type="text/javascript">
			var phpDumpNotes = <?=((string)$user -> notes != '') ? $user -> notes : '[]' ?>;
		</script>
<?php
	}
?>
		<script type="text/javascript" src="js/implement.js"></script>
<?php
	} else {
?>
		<script type="text/javascript">
			function resize(what) {
				var b = what.getCoordinates();
				var h = Window.getHeight();
				var w = Window.getWidth();
				what.setStyle('top', Math.floor((h/2)-(b.height/2)) + 'px');
				what.setStyle('left', Math.floor((w/2)-(b.width/2)) + 'px');
			}
		
			Window.addEvent('domready', function() {
				$('loadbox').hide();
				resize($('loginBox').getFirst().getFirst());
			});
			
			Window.addEvent('resize', function() {
				resize($('loginBox').getFirst().getFirst());
			})
		</script>
<?php
	}
?>
		<style type="text/css" media="screen">
<?php
	$dir = 'images/';
	$h = opendir($dir);
	while(false !== ($file = readdir($h))) {
		if($file == '.' || $file == '.' || $file{0} != '_') continue;
		$f = str_replace(array('.png', '_'), '', $file);
		echo "
		div.$f {background-image: url('images/_$f.png')}
		div.$f:hover {background-image: url('images/~$f.png')}
		div.$f.blue {background-image: url('images/=$f.png')}
		div.$f.orange {background-image: url('images/!$f.png')}
		div.$f.red {background-image: url('images/-$f.png')}
		div.$f.maroon {background-image: url('images/%23$f.png')}";
	}
?>
	</style>
	
	</head>
	<body>
		<div id="debug">
			<p class="centred">No errors</p>
			<div id="debug-options"><div class="icon ActiveX"></div><div class="icon NetworkOffline"></div></div>
		</div>
		<div id="debug-maximise">
		</div>

		<div id="loadbox">
			<div id="loadicon"></div>
			<div id="loadtext">Loading...</div>
			<div id="loadbarContainer"><div id="loadbar"></div></div>
		</div>

		<div id="header">
			<h1 id='logo'></h1>

			<div id="menuitems">
				<a id="logout" href="javascript: void(0);" style="display: <?=((string) $opts['MU'] -> value == 'on') ? 'block' : 'none' ?>" title="Logout"></a>
				<a id="alignToGrid" class="silkico" href="javascript: void(0);" style="display: <?=((string) $opts['Snap'] -> value == 'on') ? 'block' : 'none' ?>" title="Align to grid"></a>
				<a id="moveAll" class="silkico" href="javascript: void(0);" title="Fit all notes onto screen"></a>
				<a id="save" href="javascript: void(0);"><span class="warn"></span></a>
				<a id="add" href="javascript: void(0);"></a>			
			</div>
		</div>
		
		<div id="opts">
			<div>
				<a href="javascript: void(0);" id="viewLink">View</a> or <a href="javascript: void(0);" id="reactLink">Reactivate</a>
			</div>
		</div>

		<div id="archive">
			<div id="brleft"><div class="go Prev" id="goPrev"></div><div class="butSpacer"></div><div class="go First" id="goFirst"></div></div>
			<div id="brright"><div class="go Next" id="goNext"></div><div class="butSpacer"></div><div class="go Last" id="goLast"></div></div>
			<div id="containerContents">
				<div id="Contents">
					<div class="clear">&nbsp;</div>
				</div>
			</div>
		</div>
		
		<div id="notecontainer">

		</div>

		<div id="cornerfolder">
			<img src="images/bigfolder.png" alt="archive folder" />
		</div>
		
		<div id="Options">
			<div class="lightbox">
				<div class="box">

				<img src="images/cross.png" id="closeOptions" class="closeBox" alt="close box" />
				<div class="slider">
				<div class="slideme">
				<h2>Noticeboard Settings</h2>
				<p>Use the settings below to configure your own Swirlyblue Noticeboard.</p>
				<form id="fOptions" action="index.php">
				<p>
<?php
	foreach($opts as $key => $option) {
		if((string) $option['supported'] == 'no') continue;
		echo '
					<input type="checkbox" name="' . $key . '" value="on"' . (((string) $option -> value == 'on') ? ' checked="checked"' : '' ) . (((string) $option['master'] == 'true' && $_SESSION['uid'] != 0) ? ' disabled="true"' : '') . ' />
					<label class="checkBox">' . $option -> name . '</label><br />
		';
	}
?>
				</p>
					<div class="subOpts" <?=((string)$opts['MU']['supported'] == 'yes') ? '' : 'style="display: none;"' ?>>
					<div class="scrollup"></div>
					<div>
<?php
	if(!$users -> user && (string) $opts['MU']['supported'] == 'yes') {
?>
						<label>Master User</label>
						<input type="text" name="masterUser" value="Username" class="temp" />
						<input type="password" name="masterPass" value="password" class="temp" /> <img src="images/user_gray.png" alt="user image" />
						<input type="button" name="saveMaster" value="Save" />
<?php
	} else {
		echo '
						<table><tbody>
		';
		foreach($users as $user) {
			echo '
						<tr id="user_' . $user['id'] . '">
							<td>' . $user -> name . '</td>
							<td><img src="images/' . $user -> img . '.png" alt="user image" /></td>
							<td><img src="images/pencil.png" class="editUser" alt="edit user" /> <img src="images/delete.png" class="delUser" alt="delete user" /></td>
						</tr>
			';
		}
		echo '
						</tbody></table>
		';
	}
?>
					</div>
					<img src="images/user_add.png" class="addUser" alt="add user" />
					<div class="scrolldown"></div>
					</div>
				</form>
				</div>
				<div class="slideme">
				<div class="slideBack">&nbsp;</div>
				<div id="extrasBox"></div>
				</div>
				</div>
				</div>
				
				<div class="moreOpts"><div><img src="images/user.png" alt="blue user" /><img src="images/user_female.png" alt="female user" /><img src="images/user_green.png" alt="green user" /><img src="images/user_orange.png" alt="orange user" /><img src="images/user_red.png" alt="red user" /><img src="images/group.png" alt="group user" /></div></div>
			</div>
		</div>
		
<?php
	if((string) $opts['MU'] -> value == 'on') {
?>
		<div id="loginBox">
			<div class="lightbox">
				<div class="box">
				<h2>Please Log In</h2>
				<form id="fLogin" action="php/login.php" method="post">
				<h2 class="moveup">
					<label>Username</label>
					<input type="text" name="user" class="bigtext" />
					
					<label>Password</label>
					<input type="password" name="pass" class="bigtext" />
					
					<input type="submit" name="login" value="Login" />
				</h2>
				</form>
				</div>
			</div>
		</div>
<?php
	}
?>
		
		<div id="tMasterUser" class="template">
			<table><tbody>
			<tr>
				<td></td>
				<td><img src="" alt="user image" /></td>
				<td><img src="images/pencil.png" class="editUser" alt="edit user" /> <img src="images/delete.png" class="delUser" alt="delete user" /></td>
			</tr>
			</tbody></table>
		</div>
		
		<div id="tEditUser" class="template">
		<div>
			<h2>Edit User</h2>
			<form action="index.php">
				<h2 class="moveup">
				<input type="hidden" name="userId" value="" />
				<label>Username</label>
				<input type="text" name="user" />
				<img src="images/user.png" class="userImg" alt="user image" />
				</h2>
				
				<h2 class="moveup lineup">
				<label>Password (Old &amp; New)</label>
				<input type="password" name="oldPass" /> <input type="password" name="newPass" />
				</h2>
				
				<h2 class="moveup" style="clear: both;">
				<input type="button" name="saveUser" value="Edit" />
				</h2>
			</form>
		</div>
		</div>
		
		<div id="tAddUser" class="template">
		<div>
			<h2>Add User</h2>
			<form action="index.php">
				<h2 class="moveup">
				<label>Username</label>
				<input type="text" name="user" />
				
				<label>Password</label>
				<input type="password" name="pass" />
				
				<img src="images/user.png" class="userImg" alt="user image" />
				<input type="button" name="saveUser" value="Add" />
				</h2>
			</form>
		</div>
		</div>

		<div id="viewnote">
			<div class="lightbox">
				<div class="box">

				<img src="images/cross.png" id="closeViewNote" class="closeBox" alt="close box" />

				<div id="duedate" class="urgent">3 days</div>

				<h2>Note Title</h2>

				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

				<div class="noteactions">
					<a href="javascript: void(0);">Edit this note</a>
				</div>

				</div>

			</div>
		</div>

		<div id="editnote">
			<div class="lightbox">
				<div class="box">
				<img src="images/cross.png" id="closeEditNote" class="closeBox" alt="close box" />
				<form id="fEditNote" action="index.php">
					<div class="urgent duedate">
					<input type="hidden" name="noteId" value="" />
					<input class="date-dd" name="date-dd" maxlength="2" type="text" /> / <input class="date-mm" name="date-mm" maxlength="2" type="text" /> / <input class="date" name="date" maxlength="4" type="text" /></div>

					<h2>
						<label>Title</label>
						<input type="text" name="Title" class="bigtext required" />
					</h2>
					
					<h2 class="lineup">
						<label>Category</label>
						<input type="text" name="Category" id="noteCat" class="bigtext half required" />
					</h2>

					<h2 class="lineup">
						<label>Image</label>
						<img src="images/_fourimp.png" id="noteImage" alt="note image" />
					</h2>

					<h2>
					<textarea rows="10" cols="70" name="contents" class="required">Note contents</textarea>
					</h2>

				<div class="noteactions">
					<img src="img/savenote_disabled.png" id="saveNote" alt="save note" /> <img src="img/cancel_red.png" id="cancelEditNote" alt="cancel editing note" />
				</div>
				</form>
				</div>
			</div>
			
			<div id="imgbox">
				<img src="images/cross.png" id="closeImgbox" alt="close image box" />
<?php
	$dir = 'images/';
	$h = opendir($dir);
	while(false !== ($file = readdir($h))) {
		if($file == '.' || $file == '.' || $file{0} != '_') continue;
		$f = str_replace(array('.png', '_'), '', $file);
		echo "
				<div class=\"imgselect $f\" title=\"images/_$f.png\"></div>
		";
	}
?>
			</div>
		</div>


</body>
</html>