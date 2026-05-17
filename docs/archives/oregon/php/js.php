<?php 
	$arr = include $_SERVER["DOCUMENT_ROOT"].'/min/groupsConfig.php';
	foreach ($arr['js'] as $script) {
		$pieces = explode("//", $script);
		echo "<script src=\"/".$pieces[1]."\"></script>";
	} 

?>

