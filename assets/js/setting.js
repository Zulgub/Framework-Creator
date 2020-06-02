import {
    Interface
} from "./interface.js";

var interfaz = new Interface(false);

/**
 * Clase del apartado de configuración de los proyectos
 */
export class Setting {

    /**
     * Constructor de la clase setting
     * 
     * @param {String} project Nombre del proyecto
     * @param {String} framework Nombre del framework
     */
    constructor(project, framework) {
        /**
         * Indica el nombre del proyecto
         */
        this._project = project;
        /**
         * Indica el framework usado
         */
        this._framework = framework;

        /**
         * Nombre del framework formato HTML
         */
        this._frameworkHTML = framework.replace(' ', '_');
        /**
         * Datos del framework
         */
        this._datos = null;

        this.loadModules();
    }

    /**
     * Funcionalidad dle botón que acompaña a los inputs de introducir datos
     * @param {String} element Elemento del DOM
     * @param {type} type Tipo de elemento
     * @param {String} command Comando a ejecutar
     * @param {String} nameCommand Nombre del comando
     * @param {String} patron Patron que debe cumplir el formulario
     */
    btn(element, type = "input", command, nameCommand, patron = null) {
        var self = this;

        interfaz.waitUntilElement(`#${element}-exec`, function () {
            $(`#${element}-exec`).click(function () {
                const button = $(this);
                var valor = "";
                // Tipos de editor
                switch (type) {
                    case "tinymce":
                        valor = $(`.field-${element} iframe`).contents().find("body").html()
                        break;
                    case "quill":
                        valor = $(`#${element}`).find(".ql-editor").html();
                        break;
                    default:
                        valor = $(`#${element}`).val();
                }
                if (patron != null && new RegExp(patron).test(valor) || patron == null)
                    self.execCode(command, valor, nameCommand, button);
            });
        });
    }

    /**
     * Envía un comando a ejecutarse
     * @param {String} comamandID Comando a ejecutar
     * @param {String} value Contenido del comando
     * @param {String} nameCommand Nombre del comando
     * @param {Object} button Botón
     */
    execCode(comamandID, value, nameCommand, button) {
        var nameCommand = nameCommand.replace(/<\/?br>/g, "");
        var comandos = this._datos.commands != null ? this._datos.commands : null;
        var comando;
        if (comandos != null)
            Object.assign(comandos).forEach(cmd => {
                if (comamandID == cmd.DT_RowId) {
                    comando = cmd.comando;
                    var inputValue = interfaz.extraer(comando, /%\w+/g);
                    if (inputValue != null)
                        comando = comando.replace(new RegExp(/%this/g), value);
                }
            });
        else {
            comando = null;
        }

        var datos = {
            data: {
                project: this._project,
                cmd: comando,
                fileName: this._project + "-" + comamandID
            }
        }

        const content = button.html();
        button.html('Ejecutando...').prop('disabled', true);

        interfaz.ajax('assets/includes/class/runCode.php', datos, 'post', 'json', function (data) {
            if (data)
                interfaz.alerta("info", "Finalizado", "La ejecución de " + nameCommand + " ha finalizado", "success");
            else
                interfaz.alerta("exclamation-triangle", "Error", "Error al ejecutar \"" + nameCommand + "\"", "danger", false);
            button.html(content).prop('disabled', false);
        }, function (datos) {
            interfaz.alerta("exclamation-triangle", "Error", "Error al ejecutar \"" + nameCommand + "\"", "danger", false);
        });

    }

    /**
     * Ejecuta módulos y asigna funciones
     */
    loadModules() {
        var self = this;

        // Animación del botón de descarga
        if ($(".descarga").length > 0) {
            $(".descarga").click(function (e) {
                var btn = $(this);

                e.preventDefault();

                if (!btn.hasClass("stop")) {
                    btn.addClass("stop").html(`Creando archivo <i class="fa fa-spinner fa-spin"></i>`);

                    interfaz.ajax("assets/includes/class/runCode.php", {
                        download: self._project
                    }, "post", "json", function (data) {

                        if (data != false) {

                            try {
                                downloadFile(interfaz.fixRoot(`assets/downloads/${self._project}.zip`));

                                // Borramos le archivo temporal
                                interfaz.ajax('assets/includes/class/runCode.php', {
                                    Deldownload: self._project
                                }, 'post', 'json');

                            } catch (error) {

                            }

                            btn.removeClass("stop").html(`<i class="fa fa-download"></i> Descargar`);
                        } else {
                            interfaz.alerta("exclamation-triangle", "Error", "Error al descargar el proyecto", "danger", false);
                        }

                    }, function () {
                        btn.removeClass("stop").html(`<i class="fa fa-download"></i> Descargar`);
                        interfaz.alerta("exclamation-triangle", "Error", "Error al descargar el proyecto", "danger", false);
                    });

                }


            });
        }

        // Calculamos el tamaño del proyecto
        if ($(".size").length > 0) {
            interfaz.ajax('assets/includes/class/runCode.php', {
                size: 'projects/' + this._project
            }, "post", "json", function (data) {
                $(".size").html(`<i class="fa fa-hdd"></i> ${data}`);
            }, function () {
                $(".size").html(`<i class="fa fa-hdd"></i> Error`);
            });
        }

        // Funcionalidad del botón de borrar proyecto
        if ($(".delProject").length > 0) {
            $(".delProject").click(function () {
                var project = $(this).data("project");
                interfaz.modal("¿Desea borrar el proyecto?", "Perderás todo el contenido y no se podrá recuperar", "Borrar", function () {
                    interfaz.modal("Borrando...", 'Borrando proyecto <i class="fa fa-spinner fa-spin">');
                    interfaz.waitUntilElement(".btn-danger", function () {
                        $(".btn-danger").html("Cerrar");
                    });
                    interfaz.ajax("assets/includes/class/runCode.php", {
                        delProject: project
                    }, "POST", "json", function (data) {
                        if (data) {
                            $("#modal").modal("toggle");
                            interfaz.alerta("trash", "Borrado", "Proyecto borrado", "success");
                            setTimeout(function () {
                                window.location = interfaz.fixRoot(".");
                            }, 2000);
                        } else {
                            interfaz.alerta("exclamation-triangle", "Error", "Error al borrar el proyecto", "danger");
                        }
                    }, function () {
                        interfaz.alerta("exclamation-triangle", "Error", "Error al borrar el proyecto", "danger");
                    });
                }, null, false, false);
            });
        }

        this.funcionality();

    }

    /**
     * Ejecuta funcionalidades del acceso rápido && archivos
     */
    funcionality() {
        var self = this;

        interfaz.ajax(`assets/includes/vistas/config/frameworks/${interfaz.ucFirst(this._framework)}.json`, null, null, undefined, function (datos) {
            self._datos = datos;

            if (datos.quick != null){
                interfaz.setFixedRender(".quickContent", datos.quick);
                JSON.parse(atob(datos.quick)).forEach(element => {

                    var comando = element.cmd;
                    var label = element.label;
                    var name = element.name;

                    if (element.type == "button") {
                        interfaz.waitUntilElement(`#${name}`, function () {
                            $(`#${name}`).click(function () {
                                const button = $(this);
                                self.execCode(comando, null, label, button);
                            });
                        });
                    } else {
                        interfaz.waitUntilElement(".field-" + name, function () {
                            $(".field-" + name).addClass("position-relative").append(`<button class="btn btn-success btn-sm custom-btn" type="button" id="${name}-exec">Ejecutar</button>`);
                        });

                        self.btn(name, element.subtype, comando, label, element.pattern);
                    }
                });}

            if (datos.files != null) {
                var opciones = "";
                datos.files.forEach(file => {
                    var ruta = file.ruta;
                    var root = ruta.split("/");
                    var nombre = root[root.length - 1];
                    opciones += `<option value="${ruta}">${nombre}</option>`;
                });
                var list = `<select class="form-control" id="file-selected"><option value="">Seleccione un archivo</option>${opciones}</select>`;
                var msg = `<i class="fa fa-info"></i> Seleccione un archivo del selector para editar`;

                interfaz.waitUntilElement("#file-selected", function () {
                    $("#file-selected").bind("change keyup", function () {
                        var value = $(this).val();

                        if (value != "") {

                            $(".file-content").html(`<div class="lds-spinner d-block mx-auto">
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
                          </div>`);

                            /**
                             * Carga el archivo
                             */
                            function loadFile() {
                                interfaz.ajax("common", {
                                    api: "readFile",
                                    dir: self._project + "/" + value
                                }, "POST", "json", function (data) {
                                    if (data.contenido != false && data.lastEdit != null) {

                                        /**
                                         * Asigna la fecha
                                         * 
                                         * @param {Int} data Tiempo en Unix
                                         */
                                        function setDate(data = null) {
                                            const event = data == null ? new Date() : new Date(data * 1000);

                                            const options = {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                second: 'numeric'
                                            };

                                            $(".last-edit").html('<i class="fa fa-clock"></i> ' + event.toLocaleDateString(undefined, options));
                                        }

                                        $(".save-file").removeClass("invisible");
                                        $(".file-content").html(`
                                        <div class="col-xl-4 mb-1 text-left">
                                            <span class="badge badge-primary p-1 last-edit" data-toggle="tooltip" data-placement="right" title="" data-original-title="Ultima edición"></span>
                                        </div>
                                        <div class="col-xl-4 mb-1 text-center">
                                        <button class="btn btn-primary p-1" data-toggle="collapse" data-target="#info"><i class="fa fa-question-circle"></i> Ayuda</button>
                                        </div>
                                        <div class="col-xl-4 mb-1 text-right">
                                            <span class="badge badge-secondary p-1" data-toggle="tooltip" data-placement="right" title="" data-original-title="Ruta del archivo"><i class="fa fa-folder-open"></i> ${$("#file-selected").val()}</span>
                                        </div>
                                        <div class="col-xl-12">
                                            <div class="mt-1 alert alert-primary collapse text-left" id="info">
                                            Dentro del editor: 
                                            <hr>
                                            <div class="row">
                                            <div class="col-xl-6">
                                                <dl>
                                                    <dt>Ctrl-F / Cmd-F</dt><dd>Comience a buscar</dd>
                                                    <dt>Ctrl-G / Cmd-G</dt><dd>Buscar siguiente</dd>
                                                    <dt>Shift-Ctrl-G / Shift-Cmd-G</dt><dd>Buscar anterior</dd>
                                                    <dt>Shift-Ctrl-F / Cmd-Option-F</dt><dd>Reemplazar</dd>
                                                    <dt>Shift-Ctrl-R / Shift-Cmd-Option-F</dt><dd>Reemplazar todo</dd>
                                                </dl>
                                            </div>
                                            <div class="col-xl-6">
                                                <dl>
                                                    <dt>Alt-F</dt><dd>Búsqueda persistente:<br>
                                                    El diálogo no se cierra automáticamente.<br>
                                                    Enter para encontrar el siguiente<br>
                                                    Shift-Enter para encontrar el anterior</dd>
                                                    <dt>Alt-G</dt><dd>Saltar a línea</dd>
                                                </dl>
                                            </div>   
                                            </div>
                                        </div>
                                        </div>
                                        <div class="mt-2 col-12">
                                        <textarea class="form-control w-100" id="file-editor">${data.contenido }</textarea></div>`);

                                        setDate(data.lastEdit);

                                        // Iniciamos el editor
                                        var editor = CodeMirror.fromTextArea(document.getElementById("file-editor"), {
                                            lineNumbers: true,
                                            matchBrackets: true,
                                            lineWrapping: true,
                                            mode: "text/x-less",
                                            extraKeys: {
                                                "Alt-F": "findPersistent"
                                            }
                                        });

                                        $(".CodeMirror").addClass("col-12");

                                        $('[data-toggle="tooltip"]').tooltip();

                                        $(".save-file").off().click(function () {
                                            $(this).html("Guardando archivo...").prop("disabled", true);

                                            const button = $(this);

                                            interfaz.ajax("common", {
                                                api: "saveFileProject",
                                                dir: self._project + "/" + $("#file-selected").val(),
                                                contenido: editor.getValue()
                                            }, "post", "json", function (datos) {
                                                if (datos) {
                                                    interfaz.alerta("save", "Guardado", "Archivo guardado", "success");
                                                    setDate();
                                                } else
                                                    interfaz.alerta("triangle-exclamation", "Error", "Error al guardar el archivo", "danger", false);

                                                button.html("Guardar").prop("disabled", false);
                                            }, function (datos) {
                                                interfaz.alerta("triangle-exclamation", "Error", "Error al guardar el archivo", "danger", false);
                                            });
                                        });
                                    } else {
                                        $(".save-file").off().addClass("invisible");
                                        $(".file-content").html(`<div class="alert alert-danger text-center mx-auto">Error: ¡Archivo no encontrado!</div>`);
                                    }
                                }, function (datos) {
                                    $(".file-content").html(`<div class="alert alert-danger text-center mx-auto">Error: ¡Archivo no encontrado!</div>`);
                                });
                            }

                            loadFile();

                        } else {
                            $(".file-content").html(`<div class="alert alert-primary text-center mx-auto">${msg}</div>`);
                            $(".save-file").off().addClass("invisible");
                        }
                    });
                });
            } else {
                var list = "";
                var msg = `No hay archivos de configuración asignados. <a href="${interfaz.fixRoot("config")}#${self._frameworkHTML}#files">¿Desea crearlos?</a>`;
            }

            $(".list-files").html(list);
            $(".file-content").html(`<div class="alert alert-primary text-center mx-auto">${msg}</div>`);


        }, function () {
            interfaz.alerta("exclamation-triangle", "Error", "Fallo al obtener los datos del framework", "danger", false);
        });
    }
}