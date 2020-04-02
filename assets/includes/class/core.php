<?php
/**
 * Núcleo principal del MVC propio
 * 
 */
class Controlador
{

    private $pagina, $capa, $title;
    private $ruta = "assets/includes/";

    public function __construct($pagina = "index", $capa = "empty")
    {
        $this->pagina = $pagina;
        $this->setTitle($pagina);
        $this->capa = $capa;
    }

    /**
     * Obitiene el titulo de la ruta
     */
    public function getTitle()
    {
        echo $this->title;
    }

    /**
     * Establece el titulo de la ruta
     */
    public function setTitle($valor){
        $this->title = $valor;
    }

    /**
     * Muestra un error con las rutas
     */
    public function error(){
        if(file_exists($this->ruta . 'vistas/error.php')){
            require_once $this->ruta . "vistas/error.php";
        }else{
            header("HTTP/1.0 404 Not Found");
            echo "Error 404";
            die();
        }
    }

    /**
     * Muestra el contenido de la ruta
     */
    public function contenido()
    {
        if (file_exists($this->ruta . 'vistas/' . $this->pagina . '.php'))
            require_once $this->ruta . 'vistas/' . $this->pagina . '.php';
        else{
            $this->error("404");
        }
    }

    /**
     * Muestra la capa de la ruta
     */
    public function capa()
    {
        require_once 'assets/includes/conf.inc.php';
        if (file_exists($this->ruta . 'capas/' . $this->capa . '.php'))
            require_once $this->ruta . 'capas/' . $this->capa . '.php';
        else
            $this->error("404");
    }
}
