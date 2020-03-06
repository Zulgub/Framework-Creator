<?php
header('Content-type: application/json; charset=utf-8');
require_once "conf.inc.php";
require_once '../../vendor/autoload.php';
if (isset($_REQUEST["api_key"]) && !empty($_REQUEST["api_key"])) {
    $api_key = addslashes($_REQUEST["api_key"]);
    switch ($api_key) {
        case "nearBusStop":
            if (isset($_REQUEST["latitud"]) && !empty($_REQUEST["latitud"]) && isset($_REQUEST["longitud"]) && !empty($_REQUEST["longitud"]));
            $latitud = floatval($_REQUEST["latitud"]);
            $longitud = floatval($_REQUEST["longitud"]);
            require_once 'class/Parada.php';
            $parada = new Parada($db);
            $parada->setCoordUser($latitud, $longitud);
            echo $parada->paradaMasCercana();
            break;
        case "busStop":
            if (isset($_REQUEST["id"]) && !empty($_REQUEST["id"])) {
                require_once 'class/Parada.php';
                $parada = new Parada($db, intval($_REQUEST["id"]));
                echo $parada->infoParada();
            }
            break;
        default:
            break;
    }
}
