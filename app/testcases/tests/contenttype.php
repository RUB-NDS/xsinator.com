<?php


if(isset($_GET['0'])){
    header('Content-Type: text/css');
}

if(isset($_GET['1'])){
    header('Content-Type: text/plain');
}

echo "Ok";

