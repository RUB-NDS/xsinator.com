<?php


if(isset($_GET['0'])){
    readAudio('../files/audio0.wav');
}

if(isset($_GET['1'])){
    readAudio('../files/audio1.wav');
}


function readAudio($Audio){
    if (file_exists($Audio)) {
        header('Content-Type: audio/wav');
        header('Content-Length: ' . filesize($Audio));
        readfile($Audio);
    }else{
        die('File not found!');
    }
}

