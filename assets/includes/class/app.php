<?php

/**
 * Queda por hacer
 * 
 * ejecución de comandos, notificación de cuanto haya terminado
 * 
 * poder ver el progreso
 * 
 * comprobar requisitos
 */

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
     * Lista los proyectos creados
     * @param String $buscar Busca un proyecto
     * @return String Información del proyecto (Elementos html)
     */
    public function projects($buscar = null)
    {
        $resultado = "";
        $ruta = '../../../projects/';
        if (file_exists($ruta)) {
            $directorio = opendir($ruta);

            while ($archivo = readdir($directorio)) {

                if (!is_dir($archivo) && $archivo != ".htaccess") {

                    $project = array(
                        'framework' => $this->infoProject($ruta . $archivo, "framework"),
                        'name' => $this->infoProject($ruta . $archivo, "name")
                    );

                    if ($buscar == null || strpos(strtoupper(" " . $project["name"]), strtoupper($buscar)) != false) {

                        $resultado .= '
            <div class="col-xl-3 my-1">
                <div class="card">
                    <a href="./projects/' . $archivo . '/settings">
                        <div class="img-project rounded-top">
                            <img src="assets/img/frameworks/' . $project["framework"] . '.png" class="card-img-top h-100" alt="' . $project["framework"] . '">
                        </div>
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">' . ucfirst($project["name"]) . '</h5>
                        <p class="card-text">
                            <div class="badge badge-dark p-2" data-toggle="tooltip" data-placement="top" title="Fecha de creación"><i class="fa fa-clock"></i> ' . date("d/m/Y H:i:s", filectime($ruta . $archivo)) . '</div>
                            <br>
                            <div class="badge badge-secondary p-2 mt-2" data-toggle="tooltip" data-placement="top" title="Framework usado"><i class="fa fa-puzzle-piece"></i> ' . ucfirst($project["framework"]) . '</div>
                        </p>
                        <hr>
                        <div class="text-center">
                            <a href="./projects/' . $archivo . '/" target="_blank" class="btn btn-primary ">
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
                $nombreHTML = preg_replace('/\s/', "_", $data["name"]);
                $active = empty($resultado) ? " active" : "";
                $resultado .= "<a class=\"list-group-item list-group-item-action{$active}\" id=\"list-{$nombreHTML}-list\" data-toggle=\"list\" href=\"#{$nombreHTML}\" role=\"tab\" aria-controls=\"{$nombreHTML}\">{$data["name"]}</a>";
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

                $nombreHTML = preg_replace('/\s/', "_", $data["name"]);

                // Recogemos cada requisito
                $requisitos = "";
                if (isset($data["required"]))
                    foreach ($data["required"] as $requisito) {
                        $coma = empty($requisitos) ? "" : ", ";
                        $requisitos .= $coma . $requisito;
                    }

                $resultado .= "<div class=\"tab-pane{$active}\" id=\"{$nombreHTML}\" role=\"tabpanel\" aria-labelledby=\"list-{$nombreHTML}-list\">
                <div class=\"float-left\">
                    <button class=\"btn btn-success save\"><i class=\"fa fa-save\"></i> Guardar</button>
                    <button class=\"btn btn-danger delete\" data-toggle=\"modal\" data-target=\"#modal\"><i class=\"fa fa-trash\"></i> Borrar</button>
                </div>
                <nav>
                    <div class=\"nav nav-tabs\" id=\"editor-tabs\" role=\"tablist\">
                        <a class=\"nav-item nav-link ml-auto active\" id=\"{$nombreHTML}-general-tab\" data-toggle=\"tab\" href=\"#{$nombreHTML}-general\" role=\"tab\" aria-selected=\"true\">General</a>
                        <a class=\"nav-item nav-link\" id=\"{$nombreHTML}-form-tab\" data-toggle=\"tab\" href=\"#{$nombreHTML}-forms\" role=\"tab\" aria-selected=\"true\">Formularios</a>
                        <a class=\"nav-item nav-link\" id=\"{$nombreHTML}-commands-tab\" data-toggle=\"tab\" href=\"#{$nombreHTML}-commands\" role=\"tab\" aria-selected=\"true\">Comandos</a>
                    </div>
                </nav>
                <div class=\"tab-content p-2\" id=\"nav-tabContent\">
                    <div class=\"tab-pane fade show active\" id=\"{$nombreHTML}-general\" role=\"tabpanel\">
                        <form id=\"form-{$nombreHTML}\">
                            <div class=\"form-group row\">
                                <label for=\"name-{$nombreHTML}\" class=\"col-xl-2 col-form-label\">Nombre: </label>
                                <div class=\"col-sm-10\">
                                    <input type=\"text\" id=\"name-{$nombreHTML}\" class=\"form-control\" value=\"{$data["name"]}\" required>
                                    <div class=\"invalid-feedback\">
                                        ¡Debe escribir un nombre para el framework! Mínimo 5 carácteres
                                    </div>
                                </div>
                            </div>
                            <div class=\"form-group row\">
                                <label for=\"requirements-{$nombreHTML}\" class=\"col-xl-2 col-form-label\">Requisitos:</label>
                                <div class=\"col-sm-10\">
                                    <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"table table-striped table-bordered\" id=\"requirements-{$nombreHTML}\" width=\"100%\">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Comando de versión</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class=\"invalid-feedback\" id=\"requirements-error\">
                                        ¡Debe incluir al menos un requisito!
                                    </div>
                                    <div class=\"text-muted\">Para comprobar si tenemos instaladas las dependencias, lo averiguaremos por el comando de versión.</div>
                                </div>
                            </div>
                            <div class=\"form-group row\">
                                <label for=\"install-command-{$nombreHTML}\" class=\"col-xl-4 col-form-label\">Comando de instalación:</label>
                                <div class=\"col-sm-10\">
                                    <input type=\"text\" id=\"install-command-{$nombreHTML}\" class=\"form-control\" value=\"{$data["installCommand"]}\" required>
                                    <div class=\"invalid-feedback\">
                                        ¡Debes establecer un comando de instalación!
                                    </div>
                                    <div class=\"text-muted\">Usa <strong>\$name</strong> para obtener el nombre del proyecto</div>
                                </div>
                            </div>
                        </form>

                    </div>
                    <div class=\"tab-pane p-2 fade json-editor-form\" data-json=\"{$archivo}\" id=\"{$nombreHTML}-forms\" role=\"tabpanel\">
                        <div class=\"lds-spinner d-block mx-auto\">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div class=\"tab-pane p-2 fade\" id=\"{$nombreHTML}-commands\" role=\"tabpanel\">
                        <button class=\"btn btn-primary d-block mx-auto mb-3\" data-toggle=\"collapse\" data-target=\"#info\"><i class=\"fa fa-info\"></i> Ayuda</button>
                        <div class=\"alert alert-primary collapse\" id=\"info\">
                            Para editar/borrar pulse sobre el área de la fila que desea editar/borrar (La columna orden no sirve).<br>
                            Puede editar/borrar múltiples filas haciendo clic en sus áreas y manteniendo la tecla <strong>CTRL</strong> pulsada.<br>
                            Puede editar/borrar múltiples filas consecutivas haciendo clic en sus áreas y manteniendo la tecla <strong>Mayus</strong> pulsada.<br>
                            Los comandos se ejecutan según el orden a la hora de crear un nuevo proyecto.<br>
                            Para ordenar los comandos tienes que hacer click sobre el número del orden, y arrastrar.<br>
                            Formas de obtener valores:
                            <ul>
                                <li>Valor php: \$<nombre de la variable>, ej: \$name</li>
                                <li>Valor de un input: %<nombre del input>, ej: %frontend</li>
                                <li>Valor del input asociado: %this</li>
                            </ul>
                        </div>
                        <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"table table-striped table-bordered\" id=\"comandos-{$nombreHTML}\" width=\"100%\">
                            <thead>
                                <tr>
                                    <th>Orden</th>
                                    <th>Nombre</th>
                                    <th>Comando</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>";
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
     * Ejecuta los comandos según el framework
     */
    private function commands()
    {
        system("cd ");
    }
}
