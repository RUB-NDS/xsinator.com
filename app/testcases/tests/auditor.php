<?php

$script = '<script>console.log("block me 1")</script>';

// set it to block mode
header('X-XSS-Protection: 1; mode=block');

if(isset($_GET['1'])){
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: /testcases/tests/auditor.php?foo=$script");
    die();
}

if(isset($_GET['0'])){
    header("HTTP/1.1 301 Moved Permanently");
    $script = '<script>console.log("block me 0")</script>';
    header("Location: /testcases/tests/auditor.php?foo=$script");
    die();
}




echo $script;