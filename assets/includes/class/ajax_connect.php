<?php
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
require_once '../conf.inc.php';
set_time_limit(0);

/**
 * Área de intercambio de datos
 *  */
class Ajax_connect
{
    /**
     * Detecta el sistema operativo
     */
    private $os;
    public function __construct($api = null)
    {
        if (!is_null($api)) {
            $this->os = php_uname('s');
            echo json_encode($this->data($api), JSON_UNESCAPED_UNICODE);
        }
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

        $get = true;

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

        if (file_exists("../../../projects/$nombre"))
            $get = $this->delTree("../../../projects/$nombre");

        // Si cancelamos la instalación de manera temprana, puede quedar como residuo la carpeta vendor que crea composer
        if (file_exists("../../../projects/vendor"))
            $get = $this->delTree("../../../projects/vendor");

        return $get;
    }

    /**
     * Muestra los datos seguin la aplicación a usar
     */
    private function data($api)
    {
        $get = false;

        switch ($api) {
            case 'projectList':
                $resultado = $GLOBALS["app"]->projects();
                break;
            case 'saveFile':
                if (isset($_POST["oldFile"]) && !empty($_POST["oldFile"]))
                    $GLOBALS["app"]->borrarArchivo($_POST["oldFile"]);
                if (isset($_POST["nameFile"]) && !empty($_POST["nameFile"]) && isset($_POST["data"]) && !empty($_POST["data"]))
                    $resultado = $GLOBALS["app"]->guardarArchivo($_POST["nameFile"], $_POST["data"]);
                break;
            case 'delFile':
                if (isset($_POST["nameFile"]) && !empty($_POST["nameFile"]))
                    $resultado = $GLOBALS["app"]->borrarArchivo($_POST["nameFile"]);
                break;
            case 'frameworks':
                $resultado = $GLOBALS["app"]->listFrameworks();
                break;
            case 'listFrameworks':
                $resultado = $GLOBALS["app"]->listFrameworksName();
                break;
            case 'listProjects':
                $resultado = $GLOBALS["app"]->listProjects();
                break;
            case 'installing':
                $resultado = $GLOBALS["app"]->installing();
                if (empty($resultado))
                    $resultado = true;
                break;
            case 'cancelAll':
                $instalaciones = $GLOBALS["app"]->installing();
                $get = count($instalaciones) > 0 ? false : true;
                $errores = 0;
                foreach ($instalaciones as $key => $value) {
                    $get = $this->cancelInstall($key);
                    if (!$get) $errores++;
                }
                $resultado = $errores != 0 ? false : $get;
                break;
            case 'cancelInstall':
                if (isset($_POST["name"]) && !empty($_POST["name"])) {
                    $get = $this->cancelInstall($_POST["name"]);
                }
                $resultado = $get;
                break;
            case 'delProject':
                if (isset($_POST["name"]) && !empty($_POST["name"]))
                    $get = $this->delTree("../../../projects/{$_POST["name"]}");
                $resultado = $get;
                break;
            case 'session':
                $resultado = $_SESSION;
                break;
            case 'readFile':
                if (isset($_POST["dir"]) && !empty($_POST["dir"]))
                    $get = $GLOBALS["app"]->readFileProject($_POST["dir"]);

                $resultado = $get;
                break;
            case 'saveFileProject':
                if (isset($_POST["dir"]) && !empty($_POST["dir"]) && isset($_POST["contenido"]) && !empty($_POST["contenido"]))
                    $get = $GLOBALS["app"]->saveFileProject($_POST["dir"], $_POST["contenido"]);
                $resultado = $get;
                break;
            default:
                $resultado = null;
                break;
        }

        return $resultado;
    }
}

$api = isset($_POST["api"]) && !empty($_POST["api"]) ? addslashes($_POST["api"]) : null;
$ajax_connect = new Ajax_connect($api);
