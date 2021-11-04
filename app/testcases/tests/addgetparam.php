<?php

if(isset($_GET['1'])){
    header("HTTP/1.1 302 Found");
    header("Location: /testcases/tests/blank.php?longparam=testing&". $_SERVER['QUERY_STRING']);
   
}

echo "//Ok";

