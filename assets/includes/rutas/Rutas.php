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

$R->new('projects/{proyecto}/download', function ($variables) {
    // Establecemos límite de bucle infinito
    set_time_limit(0);

    $dir = "projects/{$variables["proyecto"]}";
    if (file_exists($dir . "/project-info.txt")) {
        $name = preg_replace('/\s+/', '', $GLOBALS["app"]->infoProject($dir, "name") . ".zip");

        // Creamos un instancia de la clase ZipArchive
        $zip = new ZipArchive();
        // Creamos y abrimos un archivo zip temporal
        if (!$zip->open($name, ZipArchive::CREATE | ZipArchive::OVERWRITE)) {
            die("Error al crear zip $name");
        }


        // Crear un iterador recursivo que tendrá un iterador recursivo del directorio
        $archivos = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($archivos as $archivo) {
            // No queremos agregar los directorios, pues los nombres
            // de estos se agregarán cuando se agreguen los archivos
            if ($archivo->isDir()) {
                continue;
            }

            $rutaAbsoluta = $archivo->getRealPath();
            // Cortamos para que, suponiendo que la ruta base es: C:\imágenes ...
            // [C:\imágenes\perro.png] se convierta en [perro.png]
            // Modificamos la ruta para que los archivos/carpetas se inserten directamente en la raiz del zip
            $nombreArchivo = substr($rutaAbsoluta, strpos($rutaAbsoluta, preg_replace('/\//', "\\", $dir)) + strlen($dir) + 1);
            $zip->addFile($rutaAbsoluta, $nombreArchivo);
        }
        // No olvides cerrar el archivo
        $resultado = $zip->close();
        if (!$resultado) {
            die("Error creando archivo");
        } else {
            // Creamos las cabezeras que forzaran la descarga del archivo como archivo zip.
            header("Content-type: application/octet-stream");
            header("Content-disposition: attachment; filename=$name");
            header('Content-Length: ' . filesize($name));
            // leemos el archivo creado
            readfile($name);
        }

        if (file_exists($name))
            // Por último eliminamos el archivo temporal creado
            unlink($name); //Destruye el archivo temporal
    } else {
        $vista = new Vista;
        $vista->error("404", "Proyecto no encontrado");
    }
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
