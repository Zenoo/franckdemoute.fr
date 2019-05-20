<?php
	$dbHost = "es15.siteground.eu";
	$dbName = "zenoo829_generalSite";
	$dbUser = "zenoo829_su";
	$dbPassword = "n9q4nzn9q4nz";

	$dsn = 'mysql:dbname='.$dbName.';host='.$dbHost.';charset=UTF8';
	try {
		$db = new PDO($dsn, $dbUser, $dbPassword);
	} catch (Exception $e) {
		$res = array('error' => 'Unable to connect to database');
	}
?>