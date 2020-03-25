<?php
require_once('config.php');
header('Content-Type: text/plain');

$conn = mysql_connect($server, $user, $pass);
if(! $conn ){die(json_encode('Error in connecting to Server: ' . mysql_error()));}
mysql_select_db($dbName);

$result = mysql_query("SELECT * FROM examBeta");

if ($result) {
	$rows = array();
	$retobj->res = "success";
	while($r = mysql_fetch_assoc($result)) {
		$retobj->$r['id']->id = $r['id'];
		$retobj->$r['id']->name = $r['name'];
		$retobj->$r['id']->ques = $r['ques'];
		$retobj->$r['id']->status = $r['status'];
	}
	echo json_encode($retobj); 
}else{
	$retobj->res = "failed";
	echo json_encode($retobj);
}

?>