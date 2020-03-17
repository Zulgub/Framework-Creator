<?php
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
require_once '../../class/db.php';
$json = [];

if (isset($_GET["config"]) && !empty($_GET["config"])) {
    $config = json_decode($_GET["config"], true);
    $db = new DBConnection($config);
    $json["status"] =  empty($db->getPDOConnection()) ? 1 : 0;
    if ($json["status"] == 0) {
        unset($config["dbname"]);
        $db2 = new DBConnection($config);
        $json["status"] =  empty($db2->getPDOConnection()) ? 2 : $json["status"];
    }
}

if (isset($_GET["install"]) && !empty($_GET["install"])) {
    $config = json_decode($_GET["install"], true);
    $dbToCreate = $config["dbname"];

    // Eliminamos de la configuración el nombre de la base de datos
    unset($config["dbname"]);
    $db = new DBConnection($config);
    $crearDB = $db->runQuery("CREATE DATABASE IF NOT EXISTS `{$dbToCreate}`");

    // Una vez creada la base de datos comprobamos que se puede acceder a ella con la configuración básica de la clase base de datos
    $config["dbname"] = $dbToCreate;
    $db2 = new DBConnection($config);
    $json["status"] =  empty($db2->getPDOConnection()) ? 1 : 0;
}
echo json_encode($json);
