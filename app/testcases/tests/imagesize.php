<?php


if(isset($_GET['0'])){
    readImg('../files/image0.gif');
}

if(isset($_GET['1'])){
    readImg('../files/image1.gif');
}


function readImg($img){
    if (file_exists($img)) {
        $image_info = getimagesize($img);
        header('Content-Type: ' . $image_info['mime']);
        readfile($img);
    }else{
        die('File not found!');
    }
}

