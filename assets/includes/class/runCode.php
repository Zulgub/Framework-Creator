<?php
set_time_limit(0);

header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

/**
 * Ejecuta el comandos, y actualiza el progreso
 * 
 * @param String $root Ruta donde ejecutar el comando
 * @param String $cmd Comando
 * @param String $name Nombre del progreso
 * @param String $progress Progreso
 * @param String $fileName Nombre del fichero de salida
 * @param String $frame Nombre del framework
 * @param String $rootInfo Ruta del fichero de información
 * @return Boolean Si se está cancelando la instalación
 */
function runExec($root, $cmd, $name = null, $progress = null, $fileName, $frame = null, $rootInfo = "installing/")
{
    $dir = "../{$rootInfo}{$fileName}_status.json";
    if (file_exists($dir))
        $data = json_decode(file_get_contents($dir), true);

    // Si existe el dato cancel significa que se ha iniciado un proceso de cancelación
    if (!isset($data["cancel"])) {
        $process = proc_open("cd \"$root\" && " . $cmd, array(), $foo);
        $status = proc_get_status($process);

        $info["pid"] = $status["pid"];

        if ($rootInfo == "installing/") {
            $info["framework"] = $frame;
            $info["progress"] = $progress;
            $info["name"] = $name;
        }
        file_put_contents($dir, json_encode($info, JSON_UNESCAPED_UNICODE));

        do {
            usleep(50000);
            $status = proc_get_status($process)["running"];
        } while ($status);
    }

    // Elimina el archivo si es de ejecución
    if ($rootInfo != "installing/" && file_exists($dir))
        unlink($dir);

    return $rootInfo == "installing/" ? isset($data["cancel"]) : !file_exists($dir);
}

/**
 * Recibe los datos y ejecuta
 * @param Array $data Datos con comandos y nombres
 * @return Boolean True - Indica que se ha finalizado todos los procesos
 */
function commands($data)
{
    $cancel = false;
    $root = "../../../projects";
    $max = count($data["comandos"]) + 1;

    // Obligamos a composer a ejecutar la instalación en modo no interacción
    preg_match('/(?:^composer)(?:.*create-project)(?!.*-n)/', $data["install"], $matches, PREG_OFFSET_CAPTURE);
    $install = count($matches) == 1 ? preg_replace('/create\-project/', "create-project -n", $data["install"]) : $data["install"];

    $cancel = runExec($root, $install, "Instalando", "1/$max", $data["root"], $data["framework"]);

    $count = 2;

    foreach ($data["comandos"] as $key => $value) {
        $cancel = runExec($root . $data["root"], $value, $key, $count++ . "/" . $max, $data["root"], $data["framework"]);
    }

    // Creamos el archivo de información
    if (file_exists($root . $data["root"]) && !$cancel) {
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

    $requisitos = $app->getDataFramework($framework);

    $error = "";

    $resultado = true;
    if (isset($requisitos["requirements"])) {
        foreach ($requisitos["requirements"] as $key => $value) {
            exec($value["comando"], $output, $return);
            if ($return == 1)
                $error .= "<li>" . $value["nombre"] . "</li>";
        }
    } else
        $resultado = false;

    return empty($error) ? $resultado : $error;
}

/**
 * Converts bytes into human readable file size.
 *
 * @param string $bytes
 * @return string human readable file size (2,87 Мб)
 * @author Mogilev Arseny
 */
function fileSizeConvert($bytes)
{
    $bytes = floatval($bytes);
    $arBytes = array(
        0 => array(
            "UNIT" => "TB",
            "VALUE" => pow(1024, 4)
        ),
        1 => array(
            "UNIT" => "GB",
            "VALUE" => pow(1024, 3)
        ),
        2 => array(
            "UNIT" => "MB",
            "VALUE" => pow(1024, 2)
        ),
        3 => array(
            "UNIT" => "KB",
            "VALUE" => 1024
        ),
        4 => array(
            "UNIT" => "B",
            "VALUE" => 1
        ),
    );

    foreach ($arBytes as $arItem) {
        if ($bytes >= $arItem["VALUE"]) {
            $result = $bytes / $arItem["VALUE"];
            $result = str_replace(".", ",", strval(round($result, 2))) . " " . $arItem["UNIT"];
            break;
        }
    }
    return $result;
}
/**
 * Obtiene el tamaño total de la carpeta
 * @param String $dir Ruta
 * @return Float tamaño total
 */
function getBinderSize($dir, $convert = true)
{
    $totalfiles = 0;
    if (file_exists($dir)) {
        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            $totalfiles += (is_dir("$dir/$file")) ? getBinderSize("$dir/$file", false) : filesize("$dir/$file");
        }
    }
    return $convert ? fileSizeConvert($totalfiles) : $totalfiles;
}

if (isset($_POST["commands"]) && !empty($_POST["commands"]))
    echo json_encode(commands($_POST["commands"]), JSON_UNESCAPED_UNICODE);



if (isset($_POST["requirements"]) && !empty($_POST["requirements"]))
    echo json_encode(requirements($_POST["requirements"]), JSON_UNESCAPED_UNICODE);


if (isset($_POST["data"]) && !empty($_POST["data"])) {
    $data = $_POST["data"];
    echo json_encode(runExec("../../../projects/" . $data["project"], $data["cmd"], null, null, $data["fileName"], null, "executing/"), JSON_UNESCAPED_UNICODE);
}

if (isset($_POST["size"]) && !empty($_POST["size"]))
    echo json_encode(getBinderSize("../../../" . $_POST["size"]), JSON_UNESCAPED_UNICODE);
