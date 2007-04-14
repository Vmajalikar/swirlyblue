<?php
	ini_set('register_globals', '0');
	function find_master($users) {
		foreach($users as $user) {
			if((string) $user -> master == 'yes') return true;
		}
		return false;
	}
	
	function check_login($s, $users) {
		if(!$s['login']) return false;
		$user = get_user($s['uid'], $users);
		if((string) $user -> pass != $s['pw']) {
			session_unset();
			session_destroy();
			return false;
		}
		return true;
	}
	
	function get_user($id, $users) {
		foreach($users as $user) {
			if((int) $user['id'] == $id) return $user;
		}
		return false;
	}
	
	function get_index($id, $users) {
		for($i = 0; $i < count($users -> user); $i++) {
			if((int) $users -> user[$i]['id'] == $id) return $i;
		}
		return false;
	}
	
	function write_xml($fn, $dat) {
		if(! @ file_put_contents('../xml/' . $fn . '.xml', $dat -> asXML())) {
			echo 'FAIL||No write access to ' . $fn . ' XML file.';
			return false;
		}
		return true;
	}
	
	function load_opts($cfg) {
		$opts = array();
		foreach($cfg as $opt) {
			$opts[(string) $opt['key']] = $opt;
		}
		return $opts;
	}
?>