<?php
set_time_limit(0);

header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

/**
 * Ejecuta el comandos, y actualiza el progreso
 * 
 * @param String $cmd Comando
 * @param String $name Nombre del progreso
 * @param String $progress Progreso
 * @param String $fileName Nombre del fichero de salida
 */
function runExec($root, $cmd, $name, $progress, $fileName)
{
    $dir = "../installing{$fileName}_status.json";
    if (file_exists($dir))
        $data = json_decode(file_get_contents($dir), true);

    // Si existe el dato cancel significa que se ha iniciado un proceso de cancelación
    if (!isset($data["cancel"])) {
        $process = proc_open("cd \"$root\"" . $cmd, array(), $foo);
        $status = proc_get_status($process);

        $info["name"] = $name;
        $info["progress"] = $progress;
        $info["pid"] = $status["pid"];

        file_put_contents($dir, json_encode($info, JSON_UNESCAPED_UNICODE));

        do {
            usleep(50000);
            $status = proc_get_status($process)["running"];
        } while ($status);
    }
}

/**
 * Recibe los datos y ejecuta
 * @param Array $data Datos con comandos y nombres
 * @return Boolean True - Indica que se ha finalizado todos los procesos
 */
function commands($data)
{
    $root = "../../../projects";
    $max = count($data["comandos"]) + 1;
    runExec($root, " && " . $data["install"], "Instalando", "1/$max", $data["root"]);

    $count = 2;

    foreach ($data["comandos"] as $key => $value) {
        runExec($root . $data["root"], " && " . $value, $key, $count++ . "/" . $max, $data["root"]);
    }

    // Creamos el archivo de información
    if (file_exists($root . $data["root"])) {
        file_put_contents($root . $data["root"] . "/project-info.txt", "name=" . substr($data["root"], 1) . "\nframework={$data["framework"]}
        ");
    }

    unlink("../installing{$data["root"]}_status.json");

    return true;
}

/**
 * Obtiene los requisitos del framework
 * 
 * @param String $framework Nombre del framework
 * @return Boolean|String Si tiene los requisitos o no
 */
function requirements($framework)
{
    require_once("./app.php");
    $app = new App;

    $resultado = true;

    $requisitos = $app->getDataFramework($framework, 2)["requirements"];

    $error = "";

    foreach ($requisitos as $key => $value) {
        exec($value["comando"], $output, $return);
        if ($return == 1)
            $error .= "<li>" . $value["nombre"] . "</li>";
    }

    return empty($error) ? $resultado : $error;
}

if (isset($_POST["commands"]) && !empty($_POST["commands"])) {
    echo json_encode(commands($_POST["commands"]), JSON_UNESCAPED_UNICODE);
}


if (isset($_POST["requirements"]) && !empty($_POST["requirements"])) {
    echo json_encode(requirements($_POST["requirements"]), JSON_UNESCAPED_UNICODE);
}
