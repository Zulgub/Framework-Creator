<?php

/**
 * Núcleo principal del MVC propio
 * 
 */
class Vista
{

    /**
     * Vista a cargar
     */
    private $vista;
    /**
     * Ruta de los archivos
     */
    private $ruta = "assets/includes/";
    /**
     * Variables pasadas por URL
     */
    private $variables;

    /**
     * Constructor de la clase Vista
     * @param String $vista Vista a buscar
     * @param Array $variables Variables pasadas por url
     */
    public function __construct($vista = null, $variables = null)
    {
        $this->vista = preg_replace('/\./', "/", $vista);
        if ($variables != null)
            $this->variables = $variables;
        if ($vista != null)
            $this->contenido();
    }

    /**
     * Muestra un error con las rutas
     */
    public function error($code = "404", $infoCode = "File not found")
    {
        if (file_exists($this->ruta . 'vistas/error.php')) {
            ob_start();
            require_once($this->ruta . 'vistas/error.php');
            $documento =  ob_get_contents();
            ob_end_clean();
            echo $documento;
        } else {
            header("HTTP/1.0 404 Not Found");
            echo "Error 404";
            die();
        }
    }

    /**
     * Obtiene las configuraciones de la vista y las elimina del documento
     * 
     * @param Regex $reGex Expresión regular
     * @param String $stirng Cadena
     * @param Boolean $unico Por defecto verdadero, indica si es solo un resultado
     * @return String|Boolean Resultado de la búsqueda
     */
    private function getConfig($reGex, &$string, $unico = true, $delete = true)
    {
        preg_match_all($reGex, $string, $return, PREG_OFFSET_CAPTURE);
        if ($delete)
            $string = preg_replace($reGex, "", $string);
        if (isset($return[1][0]))
            return $unico ? $return[1][0][0] : $return[0];
        else
            return false;
    }


    /**
     * Obtiene el contenido renderizado (php) de un fichero
     * @param String $ruta Ruta del archivo
     * @return String Documento renderizado
     */
    private function getFileContent($ruta)
    {
        ob_start();
        $get = $this->variables;
        require_once($ruta);
        $resultado = ob_get_contents();
        ob_end_clean();
        return $resultado;
    }

    /**
     * Obtiene el array de una configuración
     */
    private function getArrayCongif($data)
    {
        $resultado = [];
        // Quitamos los tags
        $data = preg_replace("/@\w+\(([^)]+)\)/", "$1", $data);
        // Separamos el conjunto de array
        preg_match_all('/("([^"]+)"\s?=>\s?)+/', $data, $keys, PREG_OFFSET_CAPTURE);
        preg_match_all('/\[("[^"]+",?)+\]/', $data, $datos, PREG_OFFSET_CAPTURE);

        // Recorremos las claves
        for ($i = 0; $i < count($keys[2]); $i++) {
            // Añadimos los datos
            if (isset($datos[0][$i][0]))
                $resultado[$keys[2][$i][0]] = preg_split("/,/", preg_replace('/[\[\]"]/', "", $datos[0][$i][0]));
        }
        return $resultado;
    }

    /**
     * Modifica la ruta hasta encontrar el archivo
     * @param String $dir Directorio
     * @return Boolean|String Boolean si no se encuentra la ruta, String si ha encontrado la ruta
     */
    private function assets($dir)
    {
        $resta = substr_count($_SERVER["PHP_SELF"], "/");
        $max = substr_count(parse_url($_SERVER['REQUEST_URI'])["path"], "/") - $resta;
        if ($max > 0) {
            $path = "";
            for ($i = 0; $i < $max; $i++) {
                $path .= "../";
            }
            $resultado = $path . $dir;
        } else {
            $resultado = $dir;
        }
        return $resultado;
    }

    /**
     * Muestra el contenido de la ruta
     */
    public function contenido()
    {
        if (file_exists($this->ruta . 'vistas/' . $this->vista . '.php')) {
            require_once 'assets/includes/conf.inc.php';
            $contenido = $this::getFileContent($this->ruta . 'vistas/' . $this->vista . '.php');
            // Capa de la vista
            $capa = $this::getConfig('/@capa\(\"([\w\.]+)\"\)\n?/', $contenido);
            // Cambia el título
            $title = $this::getConfig('/@title\(\"([^"]+)\"\)\n?/', $contenido);
            // Añade al titulo actual
            $addTitle = $this::getConfig('/@addTitle\(\"([^"]+)\"\)\n?/', $contenido);
            // Añade archivos css
            $addCss = $this::getConfig('/@addCss\(("[^"]+"\s?=>\s?\[("[^"]+",?)+\],?\s?)+\)\n?/', $contenido, false)[0][0];
            // Añade archivos js
            $addJs = $this::getConfig('/@addJs\(("[^"]+"\s?=>\s?\[("[^"]+",?)+\],?\s?)+\)\n?/', $contenido, false)[0][0];

            if ($capa) {
                $capa = $this->capa($capa);

                // Cambiamos el título si existe la configuración de cambiar título
                if ($title)
                    $capa = preg_replace('/<title>[^<]+<\/title>/', "<title>{$title}</title>", $capa);

                // Añade el título de la vista
                if ($addTitle)
                    $capa = preg_replace('/<title>([^<]+)<\/title>/', "<title>$1{$addTitle}</title>", $capa);

                // Añade ficheros css
                $css = "";
                foreach ($this::getArrayCongif($addCss) as $key => $value) {
                    $root = $this->assets($key);
                    for ($i = 0; $i < count($value); $i++) {
                        $css .= '<link rel="stylesheet" type="text/css" href="' . $root . $value[$i] . "\">\n";
                    }
                }
                $capa = preg_replace('/<!--\s*@css\s*-->/', $css, $capa);

                // Añade ficheros js
                $js = "";
                foreach ($this::getArrayCongif($addJs) as $key => $value) {
                    $root = $this->assets($key);
                    for ($i = 0; $i < count($value); $i++) {
                        $js .= '<script defer type="text/javascript" src="' . $root . $value[$i] . "\"></script>\n";
                    }
                }
                $capa = preg_replace('/<!--\s*@js\s*-->/', $js, $capa);

                $contenido = str_replace("@contenido", $contenido, $capa);

                // Aplicamos la funcion assets
                $regex = '/(\{\{assets\(([^\)]+)\)\}\})/';
                $assets = $this::getConfig($regex, $contenido, false, false);
                if (!empty($assets))
                    foreach ($assets as $key => $value) {
                        preg_match_all($regex, $value[0], $return, PREG_OFFSET_CAPTURE);
                        $contenido = str_replace($value[0], $this->assets($return[2][0][0]), $contenido);
                    }
            }
            echo $contenido;
        } else {
            $this->error("404", "Vista no encontrada");
        }
    }

    /**
     * Muestra la capa de la ruta
     * 
     * @param String $capa Nombre de la capa
     * @return String Resultado de la busqueda de la capa
     */
    private function capa($capa)
    {
        // Obtenemos la ruta de la capa
        $capa = preg_replace('/\./', "/", $capa);
        if (file_exists($this->ruta . 'capas/' . $capa . '.php')) {
            $contenido = $this::getFileContent($this->ruta . 'capas/' . $capa . '.php');
            return $contenido;
        } else
            return $this->error("404", "Capa no encontrada");
    }
}
