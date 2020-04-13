<?php
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
require_once '../conf.inc.php';

/**
 * Área de intercambio de datos
 *  */
class Ajax_connect
{
    public function __construct($api = null)
    {
        if (!is_null($api))
            echo json_encode($this->data($api), JSON_UNESCAPED_UNICODE);
    }

    /**
     * Muestra los datos seguin la aplicación a usar
     */
    private function data($api)
    {
        switch ($api) {
            case 'projectList':
                $buscar = isset($_POST["search"]) && !empty($_POST["search"]) ? addslashes($_POST["search"]) : null;
                $resultado = $GLOBALS["app"]->projects($buscar);
                break;
            case 'saveFile':
                if (isset($_POST["nameFile"]) && !empty($_POST["nameFile"]) && isset($_POST["data"]) && !empty($_POST["data"]))
                    $resultado = $GLOBALS["app"]->guardarArchivo($_POST["nameFile"], $_POST["data"]);
                if (isset($_POST["oldFile"]) && !empty($_POST["oldFile"]))
                    $GLOBALS["app"]->borrarArchivo($_POST["oldFile"]);
                break;
            case 'delFile':
                if (isset($_POST["nameFile"]) && !empty($_POST["nameFile"]))
                    $resultado = $GLOBALS["app"]->borrarArchivo($_POST["nameFile"]);
                break;
            case 'listFrameworks':
                $resultado = $GLOBALS["app"]->listFrameworksName();
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
