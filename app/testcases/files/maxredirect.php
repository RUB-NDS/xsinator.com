<?php

if(isset($_GET['n']) && isset($_GET['url']) && is_string($_GET['url'])){
    $n = ( int ) $_GET['n'];
    $url = $_GET['url'];
    // dont even try url parsing
    if(substr($url,0,4) !== "http"){
        die('must have http');
    }
    if($n === 0){
        header("Location: ${url}");
        die();
    }
    else{
        $n--;
        header("Location: maxredirect.php?n=${n}&url=" .urlencode($url));
        die();
    }
}

echo "Ok";