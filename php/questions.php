<?php
require_once('config.php');
header('Content-Type: text/plain');

$conn = mysql_connect($server, $user, $pass);
if(! $conn ){die(json_encode('Error in connecting to Server: ' . mysql_error()));}
mysql_select_db($dbName);

$result = mysql_query("SELECT * FROM questionBeta");

if ($result) {
	$rows = array();
	$retobj->res = "success";
	while($r = mysql_fetch_assoc($result)) {
		$retobj->$r['id']->id = $r['id'];
		$retobj->$r['id']->question = $r['question'];
		$retobj->$r['id']->type = $r['type'];
		$retobj->$r['id']->diff = $r['diff'];
		$retobj->$r['id']->fName = $r['fName'];
		$retobj->$r['id']->testCases = $r['testCases'];
		$retobj->$r['id']->constrain = $r['constrain'];
	}
	echo json_encode($retobj); 
}else{
	$retobj->res = "failed";
	echo json_encode($retobj);
}

?>