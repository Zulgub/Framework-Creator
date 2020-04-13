<?php
require_once 'core.php';
/**
 * Queda por hacer, eliminar las lineas del install, si al final no se usa
 * 
 */

/**
 * Controlador de capas - vistas
 */
class Ruta
{

    private $vistaCapas;

    public function __construct()
    {
        $this->vistaCapas = [];
    }

    /**
     * Establece la ruta a seguir
     * @param String $vista Vista que se debe mostrar
     * @param String $capa Capa que debe mostrarse
     * @param String $rutaPersonalizada Ruta que hace referencia al controlador
     */
    public function new($vista, $capa = null, $rutaPersonalizada = null)
    {
        $rutaPersonalizada = is_null($rutaPersonalizada) ? $vista : $rutaPersonalizada;
        $vista = preg_replace('/\./', "/", $vista);
        $capa = is_null($capa) ? 'default' : preg_replace('/\./', "/", $capa);
        $this->vistaCapas[$rutaPersonalizada] = new Controlador($vista, $capa);
    }

    /**
     * Ejecuta el controlador
     */
    public function run()
    {
        $pagina = isset($_GET["vista"]) && !empty($_GET["vista"]) && $_GET["vista"] != "index.php" ? addslashes($_GET["vista"]) : 'index';
        // Eliminar estas 2 lineas
        if(file_exists("assets/includes/vistas/install/index2.php"))
            $pagina = "install";
        $pagina = preg_replace('/\.php$/', '', $pagina);
        $titulo = $pagina == "404" ? "Error 404" : "RoqueMove";
        $contenido = isset($this->vistaCapas[$pagina]) ? $this->vistaCapas[$pagina] : new Controlador('error');
        $contenido->setTitle($titulo);
        $contenido->capa();
    }
}
