<?php

if(isset($_GET['1'])){
    header('Content-type: text/plain');
    header('Content-Disposition: attachment; filename="leak.txt"');

}


echo "Ok";