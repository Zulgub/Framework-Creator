<?php
if (isset($_POST["config"]) && !empty($_POST["config"])) {
    $config = json_decode($_POST["config"], true);
    switch ($config["framework"]) {
        case 'laravel':
            // Creamos el proyecto de laravel
            system("composer create-project laravel/laravel proyects/{$config["name"]}");
            $resultado["status"] = "Terminado";
            break;

        default:
            $resultado["status"] = "Error";
            break;
    }

    echo json_encode($resultado);
}