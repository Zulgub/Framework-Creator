<?php

#################### [ COMO USAR LAS RUTAS ] #########################
/**
 * 
 * ¡¡¡ATENCIÓN!!! El orden es importante, si dos urls contienen parte del mismo principio, para diferenciarlas se debe poner primero el que más contenido tenga. Ejemplo:
 * 
 * URL1: /usuario <- vista del perfil
 * URL2: /usuario/edit <- edición del perfil
 * 
 * Para que funcione correctamente, se debe poner primero URL2, SIEMPRE el que tenga más especificaciones primero.
 * 
 * url_personalizada = "projects/{id}" <- id será una variable pasada por url
 * $R->new(url_personalizada, function($variable - opcional){
 * 
 * opcional: $variables[] = $variable
 *  new controlador('vista',$variables - opcional); vista => dirección de la vista, cambiamos las / por .
 * });
 */

$R->new('index', function () {
    new Vista('index');
});

$R->new('config', function () {
    new Vista('config.index');
});

$R->new('projects/{proyecto}/settings', function ($variables) {
    $dir = "projects/{$variables["proyecto"]}";
    if (file_exists($dir . "/project-info.txt")) {
        $framework = $GLOBALS["app"]->infoProject($dir, "framework");
        $name = $GLOBALS["app"]->infoProject($dir, "name");
        $data = $GLOBALS["app"]->getDataFramework($framework);
        $variables["data"] = $data;
        $variables["name"] = $name;
        new Vista('projects.index', $variables);
    } else {
        $vista = new Vista;
        $vista->error("404", "Proyecto no encontrado");
    }
});

$R->new('view/{proyecto}', function ($get) {
    $dir = "projects/{$get["proyecto"]}";
    if (file_exists($dir . "/project-info.txt")) {
        $framework = $GLOBALS["app"]->infoProject($dir, "framework");
        $data = $GLOBALS["app"]->getDataFramework($framework);
        if (isset($data["mainRoot"]) && !empty($data["mainRoot"]))
            header("Location: ../$dir/{$data["mainRoot"]}");
        else
            header("Location: ../$dir/");
    } else {
        $vista = new Vista;
        $vista->error("404", "Proyecto no encontrado");
    }
});

$R->new('info', function () {
    new Vista('info');
});

$R->new('docs', function () {
    new Vista('docs.index');
});
