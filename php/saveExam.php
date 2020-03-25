<?php
require_once('config.php');
header('Content-Type: text/plain');
$data = utf8_encode($_POST['data']);
$data = json_decode(json_decode($data));

$conn = mysql_connect($server, $user, $pass);
if(! $conn ){die(json_encode('Error in connecting to Server: ' . mysql_error()));}
mysql_select_db($dbName);

if(strcmp($data->{'id'}, "-1") == 0){
	mysql_query("INSERT INTO submitBeta (studentId, examId, ques, ans, testRes, point, released, comments) VALUES ('".$data->{'studentId'}."', '".$data->{'examId'}."', '".$data->{'ques'}."', '".$data->{'ans'}."', '".$data->{'testRes'}."', '".$data->{'point'}."', '".$data->{'released'}."', '".$data->{'comments'}."')",$conn) or die(json_encode(mysql_error()));;
	$retobj->res = "success";
	echo json_encode($retobj); 
}else{
	mysql_query("UPDATE submitBeta SET released='".$data->{'released'}."', comments='".$data->{'comments'}."' WHERE id='".$data->{'id'}."'",$conn) or die(json_encode(mysql_error()));
	$retobj->res = "success";
	echo json_encode($retobj);
}
mysql_close($conn);
?>