<?php

if(isset($_GET['1'])){
    header("Content-Security-Policy: default-src 'self';");
}

echo 'Ok';
?>

