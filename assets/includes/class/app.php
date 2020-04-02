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
    }

    /**
     * Lee el archivo de información del proyecto
     */
    public function infoProyect($ruta, $buscar)
    {
        $file = $ruta . '/proyect-info.txt';

        if (file_exists($file)) {
            // Leemos el fichero de información del proyecto al completo
            $lineas = file($file);

            // Procesamos el fichero linea a linea
            foreach ($lineas as $linea) {
                $linea = trim($linea);
                if (strpos($linea, $buscar) !== false)
                    return explode(": ", $linea)[1];
            }
        } else {
            return "unknown info";
        }
    }

    /**
     * Lista los proyectos creados
     */
    public function proyects($buscar = null)
    {
        $resultado = "";
        $ruta = '../../../proyects/';
        if (file_exists($ruta)) {
            $directorio = opendir($ruta);

            while ($archivo = readdir($directorio)) {

                if (!is_dir($archivo) && $archivo != ".htaccess") {

                    $proyect = array(
                        'framework' => $this->infoProyect($ruta . $archivo, "framework"),
                        'name' => $this->infoProyect($ruta . $archivo, "name")
                    );

                    if ($buscar == null || strpos(strtoupper(" " . $proyect["name"]), strtoupper($buscar)) != false) {

                        $resultado .= '
            <div class="col-xl-3 my-1">
                <div class="card">
                    <a href="./proyect/' . $archivo . '/settings">
                        <div class="img-proyect rounded-top">
                            <img src="assets/img/frameworks/' . $proyect["framework"] . '.png" class="card-img-top h-100" alt="' . $proyect["framework"] . '">
                        </div>
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">' . ucfirst($proyect["name"]) . '</h5>
                        <p class="card-text">
                            <div class="badge badge-dark p-2" data-toggle="tooltip" data-placement="top" title="Fecha de creación"><i class="fa fa-clock"></i> ' . date("d/m/Y H:i:s", filectime($ruta . $archivo)) . '</div>
                            <br>
                            <div class="badge badge-secondary p-2 mt-2" data-toggle="tooltip" data-placement="top" title="Framework usado"><i class="fa fa-puzzle-piece"></i> ' . ucfirst($proyect["framework"]) . '</div>
                        </p>
                        <hr>
                        <div class="text-center">
                            <a href="' . $ruta . $archivo . '" target="_blank" class="btn btn-primary ">
                                Ver proyecto <i class="fa fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>';
                    }
                }
            }
        }

        return empty($resultado) ? "<div class=\"alert alert-info w-100 mx-3 text-center\">No se han encontrado proyectos</div>" : $resultado;
    }

    /**
     * Lista de frameworks disponibles
     */
    public function listFrameworks()
    {
        $resultado = "";
        $dir = "assets/includes/vistas/config/frameworks/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            $info = new SplFileInfo($archivo);
            if ($info->getExtension() == "json") {
                // Obtenemos el contenido del archivo
                $data = json_decode(file_get_contents($dir . $archivo), true);
                $active = empty($resultado) ? " active" : "";
                $resultado .= "<a class=\"list-group-item list-group-item-action{$active}\" id=\"list-{$data["name"]}-list\" data-toggle=\"list\" href=\"#{$data["name"]}\" role=\"tab\" aria-controls=\"{$data["name"]}\">{$data["name"]}</a>";
            }
        }
        return $resultado;
    }

    /**
     * Obtiene la configuración del framework
     */
    public function listSettingFrameworks()
    {
        $resultado = "";
        $dir = "assets/includes/vistas/config/frameworks/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            $info = new SplFileInfo($archivo);
            if ($info->getExtension() == "json") {
                $active = empty($resultado) ? " fade show active" : "";
                // Obtenemos el contenido del archivo
                $data = json_decode(file_get_contents($dir . $archivo), true);

                // Recogemos cada requisito
                $requisitos = "";
                if (isset($data["required"]))
                    foreach ($data["required"] as $requisito) {
                        $coma = empty($requisitos) ? "" : ", ";
                        $requisitos .= $coma . $requisito;
                    }

                $resultado .= "<div class=\"tab-pane{$active}\" id=\"{$data["name"]}\" role=\"tabpanel\" aria-labelledby=\"list-{$data["name"]}-list\">
                <div class=\"float-left\">
                    <button class=\"btn btn-success\" data-file-name=\"{$archivo}\" data-save=\"{$data["name"]}\"><i class=\"fa fa-save\"></i> Guardar</button>
                    <button class=\"btn btn-danger\" data-form=\"{$data["name"]}\"  data-toggle=\"modal\" data-target=\"#modal\"><i class=\"fa fa-trash\"></i> Borrar</button>
                </div>
                <nav>
                    <div class=\"nav nav-tabs\" id=\"editor-tabs\" role=\"tablist\">
                        <a class=\"nav-item nav-link ml-auto active\" id=\"{$data["name"]}-general-tab\" data-toggle=\"tab\" href=\"#{$data["name"]}-general\" role=\"tab\" aria-selected=\"true\">General</a>
                        <a class=\"nav-item nav-link\" id=\"{$data["name"]}-form-tab\" data-toggle=\"tab\" href=\"#{$data["name"]}-forms\" role=\"tab\" aria-selected=\"true\">Formularios</a>
                        <a class=\"nav-item nav-link\" id=\"{$data["name"]}-commands-tab\" data-toggle=\"tab\" href=\"#{$data["name"]}-commands\" role=\"tab\" aria-selected=\"true\">Comandos</a>
                    </div>
                </nav>
                <div class=\"tab-content p-2\" id=\"nav-tabContent\">
                    <div class=\"tab-pane fade show active\" id=\"{$data["name"]}-general\" role=\"tabpanel\">
                        <form id=\"form-{$data["name"]}\">
                            <div class=\"form-group row\">
                                <label for=\"name-{$data["name"]}\" class=\"col-xl-2 col-form-label\">Nombre: </label>
                                <div class=\"col-sm-10\">
                                    <input type=\"text\" id=\"name-{$data["name"]}\" class=\"form-control\" value=\"{$data["name"]}\">
                                </div>
                            </div>
                            <div class=\"form-group row\">
                                <label for=\"requisitos-{$data["name"]}\" class=\"col-xl-2 col-form-label\">Requisitos:</label>
                                <div class=\"col-sm-10\">
                                    <input type=\"text\" id=\"requisitos-{$data["name"]}\" class=\"form-control\" value=\"{$requisitos}\">
                                </div>
                            </div>
                        </form>

                    </div>
                    <div class=\"tab-pane p-2 fade json-editor-form\" data-name=\"{$data["name"]}\" data-json=\"{$archivo}\" id=\"{$data["name"]}-forms\" role=\"tabpanel\"></div>
                    <div class=\"tab-pane p-2 fade\" id=\"{$data["name"]}-commands\" role=\"tabpanel\">comands...
                    </div>
                </div>
            </div>";
            }
        }
        return $resultado;
    }

    public function guardarArchivo($nombre, $contenido)
    {
        if (!empty($contenido) && !empty($nombre)) {
            $dir = "../vistas/config/frameworks/" . $nombre;
            file_put_contents($dir, $contenido, LOCK_EX);
            return 1;
        } else
            return 0;
    }

    /**
     * Ejecuta los comandos según el framework
     */
    private function commands()
    {
        system("cd ");
    }
}
