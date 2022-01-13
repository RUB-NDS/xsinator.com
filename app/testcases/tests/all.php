<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$files = scandir(__DIR__);
// remove .. and .
$files = array_slice($files, 2);
$files = array_map(function($file) {
    return 'https://xsinator.xyz/testcases/tests/' . $file;
}, $files);

echo json_encode($files);