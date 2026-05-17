<?php
	$to = "support@powerpractical.com";
	$fullName = $_POST['fullName'];
	$email = $_POST['email'];
	$message = $_POST['message'];

	$subject = "Website Contact Box";
	
	$body = "Name: " . $fullName;
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