<?php
require_once('config.php');
header('Content-Type: text/plain');

$conn = mysql_connect($server, $user, $pass);
if(! $conn ){die(json_encode('Error in connecting to Server: ' . mysql_error()));}
mysql_select_db($dbName);

$result = mysql_query("SELECT * FROM submitBeta");

if ($result) {
	$rows = array();
	$retobj->res = "success";
	while($r = mysql_fetch_assoc($result)) {
		$retobj->$r['id']->id = $r['id'];
		$retobj->$r['id']->studentId = $r['studentId'];
		$retobj->$r['id']->examId = $r['examId'];
		$retobj->$r['id']->ques = $r['ques'];
		$retobj->$r['id']->ans = $r['ans'];
		$retobj->$r['id']->testRes = $r['testRes'];
		$retobj->$r['id']->point = $r['point'];
		$retobj->$r['id']->released = $r['released'];
		$retobj->$r['id']->comments = $r['comments'];
	}
	echo json_encode($retobj); 
}else{
	$retobj->res = "failed";
	echo json_encode($retobj);
}

?>