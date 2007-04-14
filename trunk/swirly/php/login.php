<?php
	ini_set('register_globals', '0');
	session_start();
	$users = new SimpleXMLElement(file_get_contents('../xml/users.xml'));
	$username = strtolower($_POST['user']);
	$pass = md5($_POST['pass']);
	
	foreach($users as $user) {
		if(strtolower((string) $user -> name) == $username && (string) $user -> pass == $pass) $u = $user;
	}
	
	if(isset($u)) {
		$_SESSION['login'] = 1;
		$_SESSION['uid'] = (int) $u['id'];
		$_SESSION['pw'] = $pass;
	}
	
	header('Location: ../index.php');
?>