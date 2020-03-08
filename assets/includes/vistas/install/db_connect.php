<?php
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
if (isset($_GET["config"]) && !empty($_GET["config"])) {
    require_once '../../class/db.php';
    $config = json_decode($_GET["config"], true);
    $db = new DBConnection($config);
    $json["status"] =  empty($db->getPDOConnection()) ? 1 : 0;
    if ($json["status"] == 0) {
        $config["dbname"] = "information_schema";
        $db2 = new DBConnection($config);
        $json["status"] =  empty($db2->getPDOConnection()) ? 2 : $json["status"];
    }
    echo json_encode($json);
}
