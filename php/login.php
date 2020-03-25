<?php
require_once('config.php');
header('Content-Type: text/plain');
$cred = utf8_encode($_POST['data']);
$cred = json_decode(json_decode($cred));

$conn = mysql_connect($server, $user, $pass);
if(! $conn ){die(json_encode('Error in connecting to Server: ' . mysql_error()));}

mysql_select_db($dbName);
$result = mysql_query("SELECT name,pass,role FROM loginBeta WHERE user IN ('".$cred->{'ucid'}."')");

if ($result) {
    $row = mysql_fetch_array($result);
    if($cred->{'pass'} == $row['pass']){
    	$retobj->res = "success";
		$retobj->user = $cred->{'ucid'};
		$retobj->name = $row['name'];
		$retobj->role = $row['role'];
	  	echo json_encode($retobj);
    }else{
    	$retobj->res = "failed";
        $retobj->user = $cred->{'ucid'};
		$retobj->name = "none";
		$retobj->role = "none";
      	echo json_encode($retobj);
    }

}else {echo json_encode('MySQL query failed with error: ' . mysql_error());}

mysql_close($conn);
?>
