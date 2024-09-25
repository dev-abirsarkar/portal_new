<?php
// Load PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'path/to/vendor/autoload.php'; // Include PHPMailer autoloader

// Create a new PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();                                    // Use SMTP
    $mail->Host       = 'smtp.gmail.com';               // SMTP server (Gmail)
    $mail->SMTPAuth   = true;                           // Enable SMTP authentication
    $mail->Username   = 'abir07sarkar@gmail.com';       // Your Gmail address (sender email)
    $mail->Password   = 'your-email-password';          // Your Gmail password or app password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
    $mail->Port       = 587;                            // TCP port to connect to (587 for TLS)

    // Recipients
    $mail->setFrom('abir07sarkar@gmail.com', 'Abir Sarkar'); // Sender address
    $mail->addAddress('dev.abirsarkar@gmail.com');          // Recipient address

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'New Response from the Website';      // Static subject for all emails
    $mail->Body    = 'Name: ' . $_POST['name'] . '<br>Email: ' . $_POST['email'] . '<br>Message: ' . $_POST['message']; // Email body
    $mail->AltBody = 'Name: ' . $_POST['name'] . "\nEmail: " . $_POST['email'] . "\nMessage: " . $_POST['message'];     // Plain text version

    // Send email
    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}
?>
