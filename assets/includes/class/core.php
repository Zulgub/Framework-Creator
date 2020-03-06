<?php

class Controlador
{

    private $pagina, $capa, $title;
    private $ruta = "assets/includes/";

    public function __construct($pagina = "index", $capa = "default")
    {
        $this->pagina = $pagina;
        $this->setTitle($pagina);
        $this->capa = $capa;
    }

    public function getTitle()
    {
        echo $this->title;
    }

    public function setTitle($valor){
        $this->title = $valor;
    }

    public function error($code,$infoCode=null){
        if(file_exists($this->ruta . 'vistas/error.php')){
            require_once $this->ruta . "vistas/error.php";
        }else{
            header("HTTP/1.0 404 Not Found");
            echo "Error 404";
            die();
        }
    }

    public function contenido()
    {
        if (file_exists($this->ruta . 'vistas/' . $this->pagina . '.php'))
            require_once $this->ruta . 'vistas/' . $this->pagina . '.php';
        else{
            $this->error("404");
        }
    }

    public function capa()
    {
        require_once 'assets/includes/conf.inc.php';
        if (file_exists($this->ruta . 'capas/' . $this->capa . '.php'))
            require_once $this->ruta . 'capas/' . $this->capa . '.php';
        else
            $this->error("404");
    }
}
