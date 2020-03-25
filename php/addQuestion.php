<?php
require_once('config.php');
header('Content-Type: text/plain');
$data = utf8_encode($_POST['data']);
$data = json_decode(json_decode($data));

$conn = mysql_connect($server, $user, $pass);
if(! $conn ){die(json_encode('Error in connecting to Server: ' . mysql_error()));}
mysql_select_db($dbName);

if(strcmp($data->{'id'}, "-1") == 0){
	mysql_query("INSERT INTO questionBeta (question, type, diff, fName, testCases, constrain) VALUES ('".$data->{'question'}."', '".$data->{'type'}."', '".$data->{'diff'}."', '".$data->{'fName'}."', '".$data->{'testCases'}."', '".$data->{'constrain'}."')",$conn) or die(json_encode(mysql_error()));;
	$retobj->res = "success";
	echo json_encode($retobj); 
}else{
	mysql_query("UPDATE questionBeta SET question='".$data->{'question'}."', type='".$data->{'type'}."', diff='".$data->{'diff'}."', fName='".$data->{'fName'}."', testCases='".$data->{'testCases'}."', constrain='".$data->{'constrain'}."' WHERE id='".$data->{'id'}."'",$conn) or die(json_encode(mysql_error()));
	$retobj->res = "success";
	echo json_encode($retobj);
}
mysql_close($conn);
?>