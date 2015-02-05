<?php

$url = sprintf('http://adserver.adtech.de/multiad/3.0/1582/0/0/-1/mode=json;plcids=%s;grp=418;misc=%s', $_GET['placements'], time());
header('Content-type: application/json');
echo(file_get_contents($url));
