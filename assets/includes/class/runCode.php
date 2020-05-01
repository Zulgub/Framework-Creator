<?php
set_time_limit(0);

header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

class RunCode
{

    /**
     * Detecta el sistema operativo
     */
    private $os;

    /**
     * Construnctor de la clase RunCode
     */
    public function __construct()
    {
        $this->os = php_uname('s');
        $resultado = false;

        if (isset($_POST["commands"]) && !empty($_POST["commands"]))
            $resultado = $this->commands($_POST["commands"]);

        if (isset($_POST["requirements"]) && !empty($_POST["requirements"]))
            $resultado = $this->requirements($_POST["requirements"]);

        if (isset($_POST["data"]) && !empty($_POST["data"])) {
            $data = $_POST["data"];
            $resultado = $this->runExec("../../../projects/" . $data["project"], $data["cmd"], null, null, $data["fileName"], null, "executing/");
        }

        if (isset($_POST["size"]) && !empty($_POST["size"]))
            $resultado = $this->getBinderSize("../../../" . $_POST["size"]);

        if (isset($_POST["download"]) && !empty($_POST["download"]))
            $resultado = $this->download($_POST["download"]);

        if (isset($_POST["Deldownload"]) && !empty($_POST["Deldownload"]))
            $resultado = $this->deleteDownload($_POST["Deldownload"]);

        if (isset($_POST["cancelAll"])) {
            $instalaciones = $this->installing();
            $get = count($instalaciones) > 0 ? false : true;
            $errores = 0;
            foreach ($instalaciones as $key => $value) {
                $get = $this->cancelInstall($key);
                if (!$get) $errores++;
            }
            $resultado = $errores != 0 ? false : $get;
        }

        if (isset($_POST["cancelInstall"]) && !empty($_POST["cancelInstall"])) {
            $resultado = $this->cancelInstall($_POST["cancelInstall"]);
        }

        if (isset($_POST["delProject"]) && !empty($_POST["delProject"])) {
            $resultado  = $this->delTree("../../../projects/{$_POST["delProject"]}");
        }

        echo json_encode($resultado, JSON_UNESCAPED_UNICODE);
    }


    /**
     * Obtiene las instalaciones actuales
     * @return Array Instalaciones actuales
     */
    public function installing()
    {
        $resultado = array();
        $dir = "../installing/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            $info = new SplFileInfo($archivo);
            if ($info->getExtension() == "json") {
                // Obtenemos el contenido del archivo
                $data = json_decode(file_get_contents($dir . $archivo), true);
                if (!isset($data["cancel"]))
                    $resultado[explode("_status", $archivo)[0]] = array("progress" => $data["progress"], "pid" => $data["pid"], "name" => $data["name"], "frame" => $data["framework"]);
            }
        }
        return $resultado;
    }

    /**
     * Elimina en arbol el contenido del directorio
     * @param String $dir Directorio
     * @return Boolean Si se ha borrado correctamente
     */
    private function delTree($dir)
    {
        if ($this->os != 'Windows NT')
            exec("rm -r $dir");
        else
            shell_exec("rmdir /s /q \"$dir\"");

        return file_exists($dir) ? false : true;
    }

    /**
     * Cancela la instalación de un proyecto
     * @param String $nombre Nombre del proyecto
     * @return Boolean Estado de la cancelación
     */
    private function cancelInstall($nombre)
    {

        $nombre = addslashes($nombre);
        $file = "../installing/{$nombre}_status.json";

        $errores = 0;

        if (file_exists($file)) {
            $info["cancel"] = true;
            $data = json_decode(file_get_contents($file), true);
            file_put_contents($file, json_encode($info, JSON_UNESCAPED_UNICODE));

            if ($this->os == 'Windows NT') { // En el caso de windows
                // Detiene el arbol de procesos
                shell_exec("TASKKILL /F /PID {$data["pid"]} /T");
            } else { // En sistemas Linux
                exec("kill -9 php.exe", $output);
            }
        }

        if (file_exists("../../../projects/$nombre") && !$this->delTree("../../../projects/$nombre"))
            $errores++;

        // Si cancelamos la instalación de manera temprana, puede quedar como residuo la carpeta vendor que crea composer
        if (file_exists("../../../projects/vendor") && !$this->delTree("../../../projects/vendor"))
            $errores++;

        return $errores == 0;
    }

    /**
     * Borra el archivo de descarga
     * @param String $name Nombre del archivo
     */
    private function deleteDownload($name)
    {
        sleep(8);
        $dir = "../../downloads/{$name}.zip";
        if (file_exists($dir)) {
            unlink($dir);
        }

        return file_exists($dir);
    }

    /**
     * Genera el archivo de descarga
     * @param String $project Nombre de la carpeta del proyecto
     * @return Boolean Estado de la generación del zip
     */
    private function download($project)
    {
        $dir = "../../../projects/${project}";
        if (file_exists($dir . "/project-info.txt")) {
            $name = "../../downloads/" . $project . ".zip";

            // Si hay un archivo residual, los borramos
            if (file_exists($name))
                unlink($name);

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
                $nombreArchivo = substr($rutaAbsoluta, strpos($rutaAbsoluta, $project) + strlen($project) + 1);

                $zip->addFile($rutaAbsoluta, $nombreArchivo);
            }
            // No olvides cerrar el archivo
            $resultado = $zip->close();
            if (!$resultado)
                return false;
        } else {
            return false;
        }
    }

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
    private function runExec($root, $cmd, $name = null, $progress = null, $fileName, $frame = null, $rootInfo = "installing/")
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
    private function commands($data)
    {
        $cancel = false;
        $root = "../../../projects";
        $max = count($data["comandos"]) + 1;

        if (!file_exists($root))
            mkdir($root);

        // Obligamos a composer a ejecutar la instalación en modo no interacción
        preg_match('/(?:^composer)(?:.*create-project)(?!.*-n)/', $data["install"], $matches, PREG_OFFSET_CAPTURE);
        $install = count($matches) == 1 ? preg_replace('/create\-project/', "create-project -n", $data["install"]) : $data["install"];

        $cancel = $this->runExec($root, $install, "Instalando", "1/$max", $data["root"], $data["framework"]);

        $count = 2;

        foreach ($data["comandos"] as $key => $value) {
            $cancel = $this->runExec($root . $data["root"], $value, $key, $count++ . "/" . $max, $data["root"], $data["framework"]);
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
    private function requirements($framework)
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
    private function fileSizeConvert($bytes)
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
    private function getBinderSize($dir, $convert = true)
    {
        $totalfiles = 0;
        if (file_exists($dir)) {
            $files = array_diff(scandir($dir), array('.', '..'));
            foreach ($files as $file) {
                $totalfiles += (is_dir("$dir/$file")) ? $this->getBinderSize("$dir/$file", false) : filesize("$dir/$file");
            }
        }
        return $convert ? $this->fileSizeConvert($totalfiles) : $totalfiles;
    }
}

new Runcode;
