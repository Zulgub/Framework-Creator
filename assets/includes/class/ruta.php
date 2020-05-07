<?php

require_once 'vista.php';

/**
 * Controlador de capas - vistas
 */
class Ruta
{
    /**
     * Array de rutas preestablecidas en rutas/Rutas.php
     */
    private $rutas;

    public function __construct()
    {
        $this->rutas = [];
    }

    /**
     * Establece la ruta a seguir
     * @param String $rutaPersonalizada Ruta que hace referencia al controlador
     * @param Function $callBack Función que se ejecuta al obtener la ruta personalizada
     */
    public function new($rutaPersonalizada, $callBack = null)
    {
        preg_match_all('/(\{[^\}]+\})/', $rutaPersonalizada, $variablesFound, PREG_OFFSET_CAPTURE);
        $variableNames = [];

        if (isset($variablesFound[0][0])) {
            foreach ($variablesFound[0] as $key => $value) {
                $variableNames[substr($value[0], 1, -1)] = null;
                $rutaPersonalizada = preg_replace('{' . $value[0] . '}', "([^/]+)", $rutaPersonalizada);
            }
        }
        $rutaPersonalizada = preg_replace('/\//', "\/", $rutaPersonalizada);
        $this->rutas[] = array("url" => $rutaPersonalizada, "callBack" => $callBack, "variables" => $variableNames);
    }

    /**
     * Ejecuta el controlador
     */
    public function run()
    {
        if ($GLOBALS["warnPhp"]) {
            $vista = new Vista;
            $vista->error(">:(", '<i class="fa fa-exclamation-triangle"></i> Versión de PHP: ' . $GLOBALS["phpV"] . '<br><br>Debe usar <strong>PHP5+</strong>');
        } else {
            $pagina = isset($_GET["vista"]) && !empty($_GET["vista"]) && $_GET["vista"] != "index.php" ? addslashes($_GET["vista"]) : 'index';

            $pagina = preg_replace('/\.php$/', '', $pagina);
            $encontrado = 0;
            foreach ($this->rutas as $key => $value) {
                // Para permitir URL terminadas en barra o no
                $final = substr($value["url"], -1) == "/" ? "?" : "\/?";
                preg_match_all('/^' . $value["url"] . $final . '$/', $pagina, $found);
                if (isset($found[0][0])) {
                    $variables = $value["variables"];
                    $i = 1;
                    foreach ($variables as $key => $var) {
                        if (isset($found[$i][0]))
                            $variables[$key] = $found[$i][0];
                        $i++;
                    }
                    $encontrado++;
                    $value["callBack"]($variables);
                    break;
                } else if ($pagina == $value["url"]) {
                    $encontrado++;
                    $value["callBack"](null);
                    break;
                }
            }

            if ($encontrado == 0)
                new Vista('error');
        }
    }
}
