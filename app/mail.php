<?php
if(isset($_POST['fullname'])) {

    $fullname = "ФИО:\r\n" . $_POST['fullname'] . "\r\n\r\n";
    $phone = "Телефон:\r\n" . $_POST['phone'] . "\r\n\r\n";

    $message = ''; //message body

    $message .= $fullname . $phone;

    if(isset($_POST['totalPrice'])) {
        $delivery = "Доставка:\r\n" .  $_POST['delivery'] . "\r\n\r\n";
        $build = "Сборка:\r\n" .  $_POST['build'] . "\r\n\r\n";
        $product = "Продукт:\r\n" .  $_POST['product'] . "\r\n\r\n";
        $count = "Количество:\r\n" .  $_POST['count'] . "\r\n\r\n";
        $totalPrice = "Итоговая цена:\r\n" .  $_POST['totalPrice'] . "\r\n\r\n";

        $message .= $delivery . $build . $product . $count . $totalPrice;
    }

    $from_email = 'no-repeat@helena-wall.ru'; //sender email
    // $recipient_email = 'yurabogatyrenko@gmail.com'; //recipient email
    $recipient_email = 'na@yasno.mobi'; //recipient email
    $subject = $_POST['name']; //subject of email


    $boundary = md5("sanwebe");


//header
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From:".$from_email."\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";

//plain text
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=utf-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($message));


    $sentMail = @mail($recipient_email, $subject, $body, $headers);

    if($sentMail) {
        echo 1;
    }else{
        die('Could not send mail! Please check your PHP mail configuration.');
    }
}