<?php
if (isset($_POST["config"]) && !empty($_POST["config"])) {
    $config = json_decode($_POST["config"], true);
    switch ($config["framework"]) {
        case 'laravel':
            // Creamos el proyecto de laravel
            system("composer create-project laravel/laravel proyects/{$config["name"]}");
            /** 
             * -- Auth
             * composer require laravel/ui
             * php artisan ui bootstrap --auth
             * npm install
             * npm audit fix
             * npm run dev
             * 
             * -- Migraciones
             * php artisan make:migration create_[nombre_tabla_plural]_table
             * php artisan migrate
             * php artisan make:model [nombre_tabla_singular_primera_letra_mayusculas]
             * 
             * -- Foro Laravel
             * composer require "devdojo/chatter=0.2.*"
             */ 

            $resultado["status"] = "Terminado";
            break;

        default:
            $resultado["status"] = "Error";
            break;
    }

    echo json_encode($resultado);
}