<?php
	$to = "kevinbello@snapbac.com";
	$firstName = $_POST['firstName'];
	$lastName = $_POST['lastName'];
	$email = $_POST['email'];
	$message = $_POST['message'];

	$subject = "Website Contact Box";
	
	$body = "Name: " . $firstName . " " . $lastName;
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