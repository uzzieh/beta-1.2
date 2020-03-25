<?php
require_once('config.php');
header('Content-Type: text/plain');
$data = utf8_encode($_POST['data']);
$data = json_decode(json_decode($data));

$file = '/tmp/Quizy-run.py';
file_put_contents($file, $data->{'ans'});

exec("python ".$file." 2>&1", $output);
$retobj->res = shell_exec(escapeshellcmd("python ".$file));
$retobj->error = $output;
echo json_encode($retobj);

?>