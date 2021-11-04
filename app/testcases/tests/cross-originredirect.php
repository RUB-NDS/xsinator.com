<?php

if(isset($_GET['1'])){
    header("HTTP/1.1 302 Found");
    header("Location: https://example.com?secret#secret");
}

echo "//Ok";
