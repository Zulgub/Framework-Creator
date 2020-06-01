<?php

/**
 * Clase App
 * 
 * Contiene todos los datos a mostrar y funciones de la aplicación
 */
class App
{
    function __construct()
    {
        // Comprobamos si existe un archivo residual de alguna descarga fallida y la borramos. Límite de tiempo: 10 min de la ultima edición.
        $dir = "../../downloads/";
        if (file_exists($dir)) {
            $directorio = opendir($dir);
            while ($archivo = readdir($directorio)) {
                if (!is_dir($archivo)) {
                    $info = new SplFileInfo($dir . $archivo);
                    if ((time() - $info->getMTime()) > 600) {
                        unlink($dir . $archivo);
                    }
                }
            }
        }
    }

    /**
     * Lee el archivo de información del proyecto
     * @param String $ruta Ruta del proyecto
     * @param String $buscar Busca un proyecto específico
     * @return Any Devuelve el contenido de la configuración
     */
    public function infoProject($ruta, $buscar)
    {
        $file = $ruta . '/project-info.txt';

        if (file_exists($file)) {
            // Leemos el fichero de información del proyecto al completo
            $lineas = file($file);

            // Procesamos el fichero linea a linea
            foreach ($lineas as $linea) {
                $linea = trim($linea);
                if (strpos($linea, $buscar) !== false)
                    return explode("=", $linea)[1];
            }
        } else {
            return "unknown info";
        }
    }

    /**
     * Lista de los proyectos creados [Array]
     * @return Array Lista de los proyectos creados
     */
    public function listProjects()
    {
        $blackList = [".htaccess", "node_modules", ""];

        $resultado = [];
        $ruta = '../../../projects/';
        if (file_exists($ruta)) {
            $directorio = opendir($ruta);

            while ($archivo = readdir($directorio)) {

                if (!is_dir($archivo) && $archivo != ".htaccess") {
                    array_push($resultado, $archivo);
                }
            }
        }

        return $resultado;
    }

    /**
     * Lista los proyectos creados
     * @return String Información del proyecto (Elementos html)
     */
    public function projects()
    {
        $resultado = "";
        $ruta = '../../../projects/';
        foreach ($this->listProjects() as $archivo) {

            $project = array(
                'framework' => $this->infoProject($ruta . $archivo, "framework"),
                'name' => $this->infoProject($ruta . $archivo, "name")
            );

            $resultado .= '
            <div class="col-xl-3 my-1 project" data-name="' . strtoupper($project["name"]) . '">
                <div class="card">
                    <a href="./projects/' . $archivo . '/settings">
                        <div class="img-project rounded-top preview position-relative">
                            <div class="thumbnail-container w-100 h-100">
                                <div class="thumbnail">
                                    <iframe class="preview-img" src="view/' . $archivo . '" frameborder="0"></iframe>
                                </div>
                            </div>
                        </div>
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">' . ucfirst($project["name"]) . '</h5>
                        <p class="card-text">
                            <div class="badge badge-dark p-2" data-toggle="tooltip" data-placement="right" title="Fecha de creación"><i class="fa fa-clock"></i> ' . date("d/m/Y H:i:s", filectime($ruta . $archivo)) . '</div>
                            <br>
                            <div class="badge badge-secondary p-2 mt-2" data-toggle="tooltip" data-placement="right" title="Framework usado"><i class="fa fa-puzzle-piece"></i> ' . ucfirst($project["framework"]) . '</div>
                        </p>
                        <hr>
                        <div class="text-center">
                            <a href="./view/' . $archivo . '" target="_blank" class="btn btn-primary ">
                                Ver proyecto <i class="fa fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>';
        }


        return empty($resultado) ? "<div class=\"alert alert-info w-100 mx-3 text-center\">No se han encontrado proyectos</div>" : $resultado;
    }

    /**
     * Obtiene una array con los nombres de los frameworks
     * 
     * @return Array Array con los frameworks guardados
     */
    public function listFrameworksName()
    {
        $resultado = array();
        $dir = "../vistas/config/frameworks/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            $info = new SplFileInfo($archivo);
            if ($info->getExtension() == "json") {
                // Obtenemos el contenido del archivo
                $data = json_decode(file_get_contents($dir . $archivo), true);
                if (isset($data["name"])) {
                    array_push($resultado, $data["name"]);
                }
            }
        }

        return $resultado;
    }

    /**
     * Lista de frameworks disponibles
     * @return Array Lista de archivos de configuración
     */
    public function listFrameworks()
    {
        $resultado = [];
        $dir = "../vistas/config/frameworks/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            $info = new SplFileInfo($archivo);
            if ($info->getExtension() == "json") {
                $data = json_decode(file_get_contents($dir . $archivo), true);
                if (isset($data["name"]))
                    $resultado[$data["name"]] = array("data" => $data, "file" => $archivo);
                else
                    $resultado[$archivo] = false;
            }
        }
        return $resultado;
    }

    /**
     * Obtiene los datos del framework
     * @param String $buscar Busca un frameworks
     * @param String $dir Indica la ruta donde buscar
     * @param Int $count Indica las veces que se ha buscado en otra ruta, controla que se ejecute solo una vez
     * @return Array Datos del framework
     */
    public function getDataFramework($buscar = null, $dir = "./assets/includes/vistas/config/frameworks/", $count = 0)
    {
        $resultado = [];
        if (file_exists($dir)) {
            if (is_null($buscar)) {
                $directorio = opendir($dir);
                while ($archivo = readdir($directorio)) {
                    $info = new SplFileInfo($archivo);
                    if ($info->getExtension() == "json") {
                        $resultado[$info->getFilename()] = json_decode(file_get_contents($dir . $archivo), true);
                    }
                }
            } else if (file_exists($dir . $buscar . ".json")) {
                $resultado = json_decode(file_get_contents($dir . $buscar . ".json"), true);
            }
        } elseif ($count == 0) { // Busca automáticamente en la misma ruta con diferente origen
            $resultado = $this->getDataFramework($buscar, "../vistas/config/frameworks/", $count++);
        }
        return $resultado;
    }

    /**
     * Obtiene las instalaciones actuales
     * @return Array Instalaciones actuales
     */
    public function installing()
    {
        $resultado = array();
        $dir = "../installing/";
        if (file_exists($dir)) {
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
        }
        return $resultado;
    }

    /**
     * Borra el archivo de configuración con dicho nombre
     * @param String $nombre Archivo de configuración
     * @return Bolean Si existe el archivo o no
     */
    public function borrarArchivo($nombre)
    {
        $dir = "../vistas/config/frameworks/" . $nombre;
        if (file_exists($dir)) {
            unlink($dir);
        }
        return file_exists($dir);
    }

    /**
     * Guarda el archivo de configuración 
     * 
     * @param String $nombre Nombre del fichero
     * @param String $contenido Contenido del fichero
     * @return Integer Estado de la operación
     */
    public function guardarArchivo($nombre, $contenido)
    {
        if (!empty($contenido) && !empty($nombre)) {
            $contenido = json_encode($contenido, JSON_UNESCAPED_UNICODE);
            $dir = "../vistas/config/frameworks/" . $nombre;
            file_put_contents($dir, $contenido, LOCK_EX);
            return 1;
        } else
            return 0;
    }

    /**
     * Lee un archivo del proyecto
     * 
     * @param String $dir Directorio
     * @return String|Boolean Contenido
     */
    public function readFileProject($dir)
    {
        $dir = "../../../projects/" . $dir;
        if (file_exists($dir)) {
            $data["contenido"] = file_get_contents($dir);
            $data["lastEdit"] = filemtime($dir);
            return $data;
        } else
            return false;
    }

    /**
     * Guarda un archivo del proyecto
     * 
     * @param String $dir Directorio
     * @param String Contenido del fichero
     * @return Boolean Estado del guardado
     */
    public function saveFileProject($dir, $contenido)
    {
        $dir = "../../../projects/" . $dir;
        if (file_exists($dir)) {
            file_put_contents($dir, $contenido);
            $editado = file_get_contents($dir);
            return $editado == $contenido;
        } else
            return false;
    }

    /**
     * Extrae los archivos
     * 
     * @param String $dir Directorio
     */
    public function rmdir_recursive($dir)
    {
        foreach (scandir($dir) as $file) {
            if ('.' === $file || '..' === $file) continue;
            if (is_dir("$dir/$file")) $this->rmdir_recursive("$dir/$file");
            else unlink("$dir/$file");
        }

        rmdir($dir);
    }

    /**
     * Sube el proyecto
     * 
     * @param $data Archivo Zip
     * @return Number Mensaje de salida
     */
    public function uploadProject($data)
    {
        $message = 0;
        if (isset($data["projectsUpload"]["name"])) {
            $filename = $data["projectsUpload"]["name"];
            $source = $data["projectsUpload"]["tmp_name"];
            $type = $data["projectsUpload"]["type"];

            $name = explode(".", $filename);
            $accepted_types = array('application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-compressed');
            foreach ($accepted_types as $mime_type) {
                if ($mime_type == $type) {
                    $okay = true;
                    break;
                }
            }

            $continue = strtolower($name[1]) == 'zip' ? true : false;
            if (!$continue) {
                // El archivo que está subiendo no es un archivo ZIP
                $message = 1;
            }

            /* PHP current path */
            $path = dirname(__FILE__) . "/";  // absolute path to the directory where zipper.php is in
            $filenoext = basename($filename, '.zip');  // absolute path to the directory where zipper.php is in (lowercase)
            $filenoext = basename($filenoext, '.ZIP');  // absolute path to the directory where zipper.php is in (when uppercase)

            $targetdir = $path . $filenoext; // target directory
            $targetzip = $path . $filename; // target zip file

            /* create directory if not exists', otherwise overwrite */
            /* target directory is same as filename without extension */

            if (is_dir($targetdir))  $this->rmdir_recursive($targetdir);


            mkdir($targetdir, 0777);


            /* Upload .zip folder */
            if (move_uploaded_file($source, $targetzip)) {
                $zip = new ZipArchive();
                $x = $zip->open($targetzip);  // open the zip file to extract
                if ($x === true) {
                    $zip->extractTo($targetdir); // place in the directory with same name  
                    $zip->close();

                    unlink($targetzip);
                }
                // Proyecto subido
                $message = 2;
            } else {
                // Problema en la subida del proyecto
                $message = 3;
            }
        }
        return $message;
    }
}
