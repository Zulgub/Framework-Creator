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

    public function __construct($api = null)
    {
        if (!is_null($api)) {
            echo json_encode($this->data($api), JSON_UNESCAPED_UNICODE);
        }
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
            case 'uploadProject':
                if(isset($_POST["project"]))
                    $get = $GLOBALS["app"]->projectsUpload($_POST["project"]);
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
