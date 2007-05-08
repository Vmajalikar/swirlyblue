<?php
	if(!isset($_REQUEST['data'])) {
		echo 'FAIL';
		exit;
	}
	error_reporting(E_ERROR);
	ini_set('register_globals', '0');
	session_start();
	require_once('functions.php');
	$config = simplexml_load_file('../xml/config.xml');
	$users = simplexml_load_file('../xml/users.xml');
	$opts = load_opts($config);
	$bad = array('>', '<', '=', '"', "'", ')', '(', ';');
	switch($_REQUEST['data']) {
		case 'ENABLE_OPT':
			$opt = $_REQUEST['opt'];
			switch($opt) {
				case 'MU':
					if(check_login($_SESSION, $users) && $_SESSION['uid'] != 0) {
						echo 'FAIL||You do not have permission to enable this option.';
						exit;
					}
					$notes = stripslashes($_REQUEST['notes']);
					if(find_master($users)) {
						$opts['MU'] -> value = 'on';
						$user = get_user(0, $users);
						$user -> notes = $notes;
						if(!write_xml('users', $users)) exit;
						$_SESSION['login'] = 1;
						$_SESSION['uid'] = 0;
						$_SESSION['pw'] = (string) $user -> pass;
					}
				break;
				
				default:
					$opts[$opt] -> value = 'on';
			}
			if(write_xml('config', $config)) echo 'PASS';
		break;
		
		case 'DISABLE_OPT':
			$opt = $_REQUEST['opt'];
			
			switch($opt) {
				case 'MU':
					$notes = stripslashes($_REQUEST['notes']);
					if(check_login($_SESSION, $users) && $_SESSION['uid'] == 0) {
						$opts['MU'] -> value = 'off';
						$str = "var phpDumpNotes = " . stripslashes($_REQUEST['notes']) . ";";
						if(! @ file_put_contents('../js/notes.js', $str)) {
							echo "FAIL||No write access to notes file.";
							exit;
						}
						session_unset();
						session_destroy();
					} else {
						if(check_login($_SESSION, $users) && $_SESSION['uid'] != 0) {
							echo 'FAIL||You do not have permission to disable this option.';
							exit;
						}
						if(!$users -> user[0]) $opts['MU'] -> value = 'off';
					}
				break;
				
				default:
					$opts[$opt] -> value = 'off';
			}
			if(write_xml('config', $config)) echo 'PASS';
		break;
		
		case 'ADD_USER':
			$usern = str_replace($bad, '', $_REQUEST['user']);
			$pass = $_REQUEST['pass'];
			$img = str_replace($bad, '', $_REQUEST['img']);
			$master = $_REQUEST['master'];
			$notes = $_REQUEST['notes'];
			
			$md5pw = md5($pass);
			
			if($master == 'yes' && find_master($users)) {
				echo 'FAIL||Only one master user may be created.';
				exit;
			}
			if($master == 'yes' && $_SESSION['login']) {
				echo 'FAIL||A master user can only be created when multi-user mode is first enabled.';
				exit;
			}
			if($master != 'yes') {
				if(!check_login($_SESSION, $users)) {
					echo 'FAIL||LOGIN';
					exit;
				}
				if($_SESSION['uid'] != 0) {
					echo 'FAIL||Only master users can add other users.';
					exit;
				}
			}
			$id = ($master == 'yes') ? 0 : count($users -> user);
			
			$user = $users -> addChild('user');
			$user['id'] = $id;
			$user -> addChild('name', $usern);
			$user -> addChild('pass', $md5pw);
			$user -> addChild('img', $img);
			$user -> addChild('master', $master);
			$user -> addChild('notes', stripslashes($notes));
			
			if(write_xml('users', $users)) {
				echo "PASS||$usern||";
				if($master == 'yes') {
					echo 0;
					$_SESSION['login'] = 1;
					$_SESSION['uid'] = 0;
					$_SESSION['pw'] = $md5pw;
					$opts['MU'] -> value = 'on';
					write_xml('config', $config);
				}
				else echo "$img||$id";
			}
		break;
		
		case 'EDIT_USER':
			if(check_login($_SESSION, $users) && $_SESSION['uid'] != 0) {
				echo 'FAIL||You do not have permission to edit users.';
				exit;
			}
			$usern = str_replace($bad, '', $_REQUEST['user']);
			$oldPass = md5($_REQUEST['oldPass']);
			$newPass = ($_REQUEST['newPass'] != '') ? md5($_REQUEST['newPass']) : $oldPass;
			$img = str_replace($bad, '', $_REQUEST['img']);
			$id = str_replace($bad, '', $_REQUEST['id']);
			
			if(!$user = get_user((int) $id, $users)) {
				echo 'FAIL||That user does not exist.';
				exit;
			}
			
			if($oldPass != (string) $user -> pass) {
				echo 'FAIL||Passwords do not match.';
				exit;
			}
			
			$user -> name = $usern;
			$user -> pass = $newPass;
			if($id != 0) $user -> img = $img;
			$user['id'] = $id;
			
			if(write_xml('users', $users)) echo "PASS||$usern||$img||$id";
		break;
		
		case 'DEL_USER':
			if(check_login($_SESSION, $users) && $_SESSION['uid'] != 0) {
				echo 'FAIL||You do not have permission to delete users.';
				exit;
			}
			$id = str_replace($bad, '', $_REQUEST['id']);
			
			if(!$idx = get_index((int) $id, $users)) {
				echo 'FAIL||That user does not exist.';
				exit;
			}
			
			if($id == 0) {
				echo 'FAIL||You cannot delete the master user once created. If you no longer want multi-user mode enabled, you can turn it off normally.';
				exit;
			}
			
			unset($users -> user[$idx]);
			if(write_xml('users', $users)) echo "PASS||$id";
		break;
		
		case 'LOGOUT':
			session_unset();
			session_destroy();
			echo 'FAIL||LOGIN';
		break;
	
		default:
		if((string) $opts['MU'] -> value == 'on' && check_login($_SESSION, $users)) {
			$user = get_user($_SESSION['uid'], $users);
			$user -> notes = stripslashes($_REQUEST['data']);
			if(write_xml('users', $users)) echo 'PASS';
			exit;
		}
		$str = "var phpDumpNotes = " . stripslashes($_REQUEST['data']) . ";";
		if(! @ file_put_contents('../js/notes.js', $str)) echo "FAIL||No write access to notes file.";
		else echo "PASS";
	}
?>