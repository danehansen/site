<?php
	$to = "dang@dogsbollocks5.com";
	$email = $_POST['email'];
	$message = "Add me to the mailing list";
	$subject = "Add me to the mailing list";
	
	$body .= "\nEmail: " . $email;
	$body .= "\nMessage: " . $message;
	
	$headers = "From: " . $email;
	$headers .= "\nReply-To: " . $email;
	
	if(mail($to,$subject,$body,$headers))
	{
		echo "true";
	}
	else
	{
		echo "false";	
	}
?>