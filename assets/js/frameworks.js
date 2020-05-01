import {
    Interface
} from "./interface";

var interfaz = new Interface(false);

/**
 * Controla los frameworks
 */
export class Frameworks {

    /**
     * Tabla de comandos
     */
    _table = null;

    /**
     * Editor del framework
     */
    _editor = null;

    /**
     * Nombre del framework
     */
    _name;

    /**
     * Datos del archivo json
     */
    _datos;

    /**
     * Nombre del framework para uso especial (Se modificará, sin afectar a la estructura)
     */
    _tempName;

    /**
     * Nombre para estructuras html
     */
    _nameHTML;

    /**
     * Elemento padre
     */
    _parent;

    /**
     * Archivo de configuración
     */
    _file;

    /**
     * Lista de requisitos
     */
    _requirements;

    /**
     * Guardamos la lista de requisitos para ser usado en otros modulos
     */
    _requirementesData;;

    /**
     * Schema del framework
     * */
    _schema;

    /**
     * Schema quick
     * */
    _quick;

    /**
     * Ruta de archivos
     */
    _files;

    /**
     * Lista de comandos
     */
    _commands;

    /**
     * Estado bloqueado del botón de guardar
     */
    _lockSave;

    /**
     * Constructor de la clase Framework
     * 
     * @param {Object} datos Nombre del frameworks
     * @param {String} fileName Archivo de configuración
     */
    constructor(datos = null, fileName) {
        if (datos != null) {
            this._datos = datos;

            this._name = datos.name;

            this._tempName = datos.name;

            this._nameHTML = datos.name.replace(/\s/g, '_');

            this._parent = null;

            this._file = fileName;

            this._requirements = datos.requirements;

            this._schema = datos.forms != null ? JSON.parse(atob(datos.forms)) : null;

            this._quick = datos.quick != null ? JSON.parse(atob(datos.quick)) : null;

            this._files = datos.files != null ? datos.files : null;

            this._commands = datos.commands;

            this._lockSave = false;
        }
        var min = datos == null;
        // Cargamos los modulos
        this.loadModules(min);
    }

    /**
     * Cargamos los modulos necesarios y asignamos funciones
     * @param {Boolean} min Carga los servicios mínimos
     */
    loadModules(min = false) {
        var self = this;
        if (!min) {
            this.ui();

            this._requirementesData = this.requirementsTable('#requirements-' + this._nameHTML, this._requirements);

            this._filesData = this.filesTable();

            this._parent.find("form").submit(function (event) {
                event.preventDefault();
            });

            this._parent.find("button.save").click(function () {
                interfaz.getFrameList(true, function (lista) {
                    self.checkErrors(true, lista);
                    self.saveFramework();
                })
            });

            $("#" + this._nameHTML + "-form-tab").click(function () {
                self._editor = self.createFormEditor();
                // Limpiamos el evento, solo queremos que se ejecute 1 vez
                $(this).off().click(function () {
                    self.actualizarListaComandos();
                })
            });

            $("#" + this._nameHTML + "-quick-tab").click(function () {
                self._quickEditor = self.createFormEditor("#" + self._nameHTML + "-quick", self._quick, ['autocomplete', 'date', 'file', 'header', 'hidden', 'paragraph', 'radio-group', 'checkbox-group']);
                // Limpiamos el evento, solo queremos que se ejecute 1 vez
                $(this).off();

                $(this).click(function () {
                    self.actualizarListaComandos("#" + this._nameHTML + "-quick");
                })
            });

            // Asignamos la opción de borrar el framework
            this._parent.find("button.delete").click(function () {
                interfaz.modal("Borrar framework", `¿Desea borrar ${self._name} y toda su configuración?<div class="alert alert-danger mt-2"><i class="fa fa-exclamation-triangle"></i> La administracción de proyectos con este framework quedará obsoleta.</div>`, "Borrar", function () {
                    self.deleteFramework();
                })
            });

            this.commandsTable();
            interfaz.waitUntilElement("#" + this._nameHTML, function () {
                interfaz.getFrameList(true, function (list) {
                    self.checkErrors(false, list);
                })
            });

        }

        //Asignamos la creación de un nuevo framework
        $("#newFramework").off().click(function () {
            self.createFramework();
        });

        // Cargamos el fichero de configuración
        $("#files").off().on("change", function (e) {
            self.handleFileSelect(e);
        });

    }

    /**
     * Crea elementos del DOM del framework
     */
    ui() {
        // Nav
        if ($("#list-frame").length == 0 || $("#nav-frame").length == 0)
            $(".frame-body").html(`<div class="row">
                                        <div class="col-sm-3">
                                            <div class="list-group" id="list-frame"></div>
                                        </div>
                                        <div class="col-sm-9">
                                            <div class="tab-content" id="nav-frame"></div>
                                        </div>
                                    </div>`);

        var active = $(".list-group a").length > 0 ? "" : " active";

        $("#list-frame").append(`<a class="list-group-item list-group-item-action${active}\" id="list-${this._nameHTML}-list" data-toggle="list" href="#${this._nameHTML}" role="tab" aria-controls="${this._nameHTML}">${this._name}</a>`);

        var install = this._datos.installCommand != undefined ? this._datos.installCommand : "";
        var root = this._datos.mainRoot != undefined ? this._datos.mainRoot : "";

        // Contenido
        var contenido = this._nameHTML == null && this._nameHTML == undefined ? `<div class=\"alert alert-danger w-100 text-center\">Hay un error grave en la estructura del archivo ${this._file}</div>` : `<div class="tab-pane ${active}" id="${this._nameHTML}" role="tabpanel" aria-labelledby="list-${this._nameHTML}-list">
        <div class="float-left">
            <button class="btn btn-success save"><i class="fa fa-save"></i> Guardar</button>
            <button class="btn btn-danger delete" data-toggle="modal" data-target="#modal"><i class="fa fa-trash"></i> Borrar</button>
        </div>
        <nav>
            <div class="nav nav-tabs" id="editor-tabs" role="tablist">
                <a class="nav-item nav-link ml-auto active" id="${this._nameHTML}-general-tab" data-toggle="tab" href="#${this._nameHTML}-general" role="tab" aria-selected="true">General</a>
                <a class="nav-item nav-link" id="${this._nameHTML}-form-tab" data-toggle="tab" href="#${this._nameHTML}-form" role="tab" aria-selected="true">Formularios</a>
                <a class="nav-item nav-link" id="${this._nameHTML}-commands-tab" data-toggle="tab" href="#${this._nameHTML}-commands" role="tab" aria-selected="true">Comandos</a>
                <a class="nav-item nav-link" id="${this._nameHTML}-quick-tab" data-toggle="tab" href="#${this._nameHTML}-quick" role="tab" aria-selected="true">Acceso rápido</a>
                <a class="nav-item nav-link" id="${this._nameHTML}-files-tab" data-toggle="tab" href="#${this._nameHTML}-files" role="tab" aria-selected="true">Archivos</a>
            </div>
        </nav>
        <div class="tab-content p-2" id="nav-editor">
            <div class="tab-pane fade show active" id="${this._nameHTML}-general" role="tabpanel">
                <form id="form-${this._nameHTML}">
                    <div class="form-group row">
                        <label for="name-${this._nameHTML}" class="col-xl-4 col-form-label oglibatorio">Nombre:</label>
                        <div class="col-sm-10">
                            <input type="text" id="name-${this._nameHTML}" class="form-control" value="${this._name}" required>
                            <div class="invalid-feedback">
                                ¡Debe escribir un nombre para el framework! Mínimo 5 carácteres
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="requirements-${this._nameHTML}" class="col-xl-4 col-form-label oglibatorio">Requisitos:</label>
                        <div class="col-sm-10">
                            <table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="requirements-${this._nameHTML}" width="100%">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Comando de versión</th>
                                    </tr>
                                </thead>
                            </table>
                            <div class="invalid-feedback" id="requirements-error">
                                ¡Debe incluir al menos un requisito!
                            </div>
                            <div class="text-muted">Para comprobar si tenemos instaladas las dependencias, lo averiguaremos por el comando de versión.</div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="main-root-${this._nameHTML}" class="col-xl-4 col-form-label">Ruta principal</label>
                        <div class="col-sm-10">
                            <input type="text" id="main-root-${this._nameHTML}" class="form-control" value="${root}" placeholder="ej: public">
                            <div class="invalid-feedback">¡Debes indicar la ruta principal!</div>
                            <div class="text-muted">La ruta principal se usará para enlazar con la vista del proyecto</div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="install-command-${this._nameHTML}" class="col-xl-4 col-form-label oglibatorio">Comando de instalación:</label>
                        <div class="col-sm-10">
                            <input type="text" id="install-command-${this._nameHTML}" class="form-control" value="${install}" required>
                            <div class="invalid-feedback">
                                ¡Debes establecer un comando de instalación!
                                <br>
                                ¡Debe aparecer $name!
                            </div>
                            <div class="text-muted">Usa <strong>$name</strong> para obtener el nombre del proyecto</div>
                        </div>
                    </div>
                </form>

            </div>
            <div class="tab-pane p-2 fade" id="${this._nameHTML}-form" role="tabpanel">
                <div class="lds-spinner d-block mx-auto">
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
            <div class="tab-pane p-2 fade" id="${this._nameHTML}-commands" role="tabpanel">
                <button class="btn btn-primary d-block mx-auto mb-3" data-toggle="collapse" data-target="#info"><i class="fa fa-question-circle"></i> Ayuda</button>
                <div class="alert alert-primary collapse" id="info">
                    Para editar/borrar pulse sobre el área de la fila que desea editar/borrar (La columna orden no sirve).<br>
                    Puede editar/borrar múltiples filas haciendo clic en sus áreas y manteniendo la tecla <strong>CTRL</strong> pulsada.<br>
                    Puede editar/borrar múltiples filas consecutivas haciendo clic en sus áreas y manteniendo la tecla <strong>Mayus</strong> pulsada.<br>
                    Los comandos se ejecutan según el orden a la hora de crear un nuevo proyecto.<br>
                    Para ordenar los comandos tienes que hacer click sobre el número del orden, y arrastrar.<br>
                    Formas de obtener valores:
                    <ul>
                        <li>Valor de un input: %<nombre del input>, ej: %frontend</li>
                        <li>Valor del input asociado: %this</li>
                    </ul>
                </div>
                <table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="comandos-${this._nameHTML}" width="100%">
                    <thead>
                        <tr>
                            <th>Orden</th>
                            <th>Nombre</th>
                            <th>Comando</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="tab-pane p-2 fade" id="${this._nameHTML}-quick" role="tabpanel">
                <div class="lds-spinner d-block mx-auto">
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
            <div class="tab-pane p-2 fade" id="${this._nameHTML}-files" role="tabpanel">
                <button class="btn btn-primary d-block mx-auto mb-3" data-toggle="collapse" data-target="#info-file"><i class="fa fa-info"></i> Información</button>
                <div class="alert alert-primary collapse" id="info-file">
                    Indique la ruta de los principales archivos de configuración.<br>
                    O agrege los que más uses.
                </div>
                <table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="files-${this._nameHTML}" width="100%">
                    <thead>
                        <tr>
                            <th>Orden</th>
                            <th>Ruta</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>`;

        $("#nav-frame").append(contenido);

        this._parent = $("#" + this._nameHTML);
    }

    /**
     * Indica un error del archivo subido
     * 
     * @param {Event} evt Evento
     */
    errorHandler(evt) {
        var msg = "";
        switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
                msg = "Archivo no encontrado";
                break;
            case evt.target.error.NOT_READABLE_ERR:
                msg = "No se puede leer el archivo";
                break;
            default:
                msg = "Ocurrió un error al leer el archivo";
        };

        interfaz.alerta("exclamation-triangle", "Error", msg, "danger", false);
    }


    /**
     * Lee el archivo
     * 
     * @param {Event} evt Evento
     */
    handleFileSelect(evt) {
        var reader = new FileReader();
        reader.onerror = this.errorHandler;
        reader.onloadstart = function (e) {
            interfaz.alerta("spinner fa-spin", "Cargando", "Leyendo archivo", "success");
        };

        reader.onload = function (e) {
            var fileName = $(evt.target).val().replace("C:\\fakepath\\", "");
            var ext = fileName.split(".");
            ext = ext[ext.length - 1];

            if (ext == 'json') {
                try {
                    var contenido = JSON.parse(reader.result);

                    if (contenido.name != undefined && contenido.requirements.length > 0 && /(?=.*\$name)(?=.{6,}$)/.test(contenido.installCommand))
                        interfaz.getFrameList(true, function (lista) {

                            if (lista != false && lista.includes(contenido.name)) {
                                interfaz.alerta("exclamation-triangle", "Error", "Ya existe un framework con ese nombre", "danger", false);
                            } else {

                                interfaz.ajax("common", {
                                    api: "saveFile",
                                    nameFile: fileName,
                                    data: contenido
                                }, "POST", "json", function (datos) {
                                    if (datos) {
                                        interfaz.alerta("upload", "Configuración guardada", "Archivo guardado", "success");

                                        new Frameworks(contenido, fileName);
                                        $("#list-frame a").last().click();

                                    } else {
                                        interfaz.alerta("exclamation-triangle", "Error", "Error al subir el archivo", "danger", false);
                                    }

                                }, function () {
                                    interfaz.alerta("exclamation-triangle", "Error", "Error al subir el archivo", "danger", false);
                                });
                            }
                        });
                    else {
                        interfaz.alerta("exclamation-triangle", "Error", "El archivo no tiene un contenido válido", "danger", false);
                    }

                } catch (error) {
                    interfaz.alerta("exclamation-triangle", "Error", "Formato JSON inválido", "danger", false);
                }

            } else {
                interfaz.alerta("exclamation-triangle", "Error", "Sólo se permiten archivos con extensión JSON", "danger", false);

            }
        }

        reader.readAsText(evt.target.files.item(0));
    }

    /**
     * Encuentra el elemento de configuración
     * 
     * @param {String} name nombre del elemento
     * @return {Integer, String} valor del elemento
     */
    findElementConfig(name) {
        return this._parent.find("#" + name + "-" + this._nameHTML).val();
    }

    /**
     * Crea la tabla de archivos
     */
    filesTable() {
        var element = '#files-' + this._nameHTML;
        // Configuración del editor
        var editor = new $.fn.dataTable.Editor({
            table: element,
            fields: [{
                label: 'Orden:',
                name: 'readingOrder',
                fieldInfo: 'Este campo solo puede ser editado arrastrando y soltando.',
                "type": "readonly",
                "def": function () {
                    return filesTable.rows().data().length + 1;
                }
            }, {
                "label": "Ruta:",
                "name": "ruta",
                attr: {
                    autofocus: true
                }
            }]
        });

        // Instanciamos la tabla
        var filesTable = $(element).DataTable({
            data: this._files,
            bFilter: false,
            bPaginate: false,
            bInfo: false,
            columns: [{
                data: 'readingOrder',
                className: 'reorder'
            }, {
                "data": "ruta"
            }],
            select: true,
            lengthChange: false,
            rowReorder: {
                dataSrc: 'readingOrder',
                editor: editor
            },
            columnDefs: [{
                orderable: false,
                targets: [1]
            }],
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ rutas",
                "sZeroRecords": "No se encontraron rutas",
                "sEmptyTable": "No hay ninguna ruta expecificada",
                "sInfoFiltered": "(filtrado de un total de _MAX_ rutas)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copy": "Copiar",
                    "colvis": "Visibilidad",
                    "create": "Añadir",
                    "edit": "Editar",
                    "remove": "Borrar",
                    "delete": "Borrar",
                }
            }
        }).on('order', function () {
            /*  Evitamos numeros no consecutivos en el orden cuando borramos una fila
                es decir, si tenemos 1,2,3 comandos, borramos el comando 2,
                evitamos tener en tabla 1,3 de orden
            */
            var index = 1;
            filesTable.rows().every(function (rowIdx) {
                filesTable.cell(rowIdx, 0).data(index++);
            })
        });

        // Botones
        new $.fn.dataTable.Buttons(filesTable, [{
                extend: "create",
                editor: editor
            },
            {
                extend: "edit",
                editor: editor
            },
            {
                extend: "remove",
                editor: editor
            }
        ]);

        // Añadimos los botones
        filesTable.buttons().container()
            .appendTo($('.col-md-6:eq(0)', filesTable.table().container()));

        editor.on('preSubmit', function (e, o, action) {
            if (action !== 'remove') {

                var ruta = this.field('ruta');
                if (ruta.val() != undefined) {
                    if (!ruta.val().trim().length > 0) {
                        ruta.error('¡Debes introducir una ruta!');
                        ruta.focus();
                    }
                    var repetido = false;

                    for (let index = 0; index < filesTable.rows().data().length; index++) {
                        var comando = filesTable.rows().data()[index];

                        if (comando.ruta == ruta.val() && comando.DT_RowId != Object.keys(o.data)[0]) {
                            repetido = true;
                        }
                    }

                    if (repetido) {
                        ruta.error('¡Ya existe esa ruta!');
                        ruta.focus();
                    }
                }

                // Si no hay un error, no mutesra nada
                if (this.inError()) {
                    return false;
                }
            }
        }).on('open', function (e, o, action) {
            var btn = $(".DTE_Footer .btn");
            var title = $(".modal-title");
            if (action !== 'remove') {
                $(".DTE_Form_Content [autofocus]").focus();

                if (action == 'edit') {
                    btn.html("Editar");
                    title.html("Editar");
                } else {
                    btn.html("Añadir");
                    title.html("Indicar nueva ruta");
                }
            } else {
                title.html("Borrar");
                $(".DTE_Form_Info").html(`<div class="alert alert-danger text-center">¿Estás seguro que quieres borrar este archivo de la lista?</div>`);
                btn.html("Borrar");
            }
        })

        /**
         * Extra los datos
         */
        function getData() {
            var filesTableContent = [];
            for (let index = 0; index < filesTable.rows().data().length; index++) {
                filesTableContent.push(filesTable.rows().data()[index]);
            }
            return filesTableContent;
        }

        return getData;
    }

    /**
     * Crea la tabla de requisitos
     * @param {String} element Elemento HTML de referencia
     * @param {Object} data Datos de la tabla
     */
    requirementsTable(element, data = null) {
        // Configuración del editor
        var editor = new $.fn.dataTable.Editor({
            table: element,
            fields: [{
                    "label": "Nombre:",
                    "name": "nombre",
                    attr: {
                        autofocus: true
                    }
                },
                {
                    "label": "Comando de la versión:",
                    "name": "comando",
                }
            ]
        });

        // Instanciamos la tabla
        var requisitos = $(element).DataTable({
            data: data,
            bFilter: false,
            bPaginate: false,
            bInfo: false,
            columns: [{
                    "data": "nombre"
                },
                {
                    "data": "comando"
                }
            ],
            select: true,
            lengthChange: false,
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ requisitos",
                "sZeroRecords": "No se encontraron requisitos",
                "sEmptyTable": "No hay ningún requisito",
                "sInfoFiltered": "(filtrado de un total de _MAX_ requisitos)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copy": "Copiar",
                    "colvis": "Visibilidad",
                    "create": "Añadir",
                    "edit": "Editar",
                    "remove": "Borrar",
                    "delete": "Borrar",
                }
            }
        });

        // Botones
        new $.fn.dataTable.Buttons(requisitos, [{
                extend: "create",
                editor: editor
            },
            {
                extend: "edit",
                editor: editor
            },
            {
                extend: "remove",
                editor: editor
            }
        ]);

        // Añadimos los botones
        requisitos.buttons().container()
            .appendTo($('.col-md-6:eq(0)', requisitos.table().container()));

        editor.on('preSubmit', function (e, o, action) {
            if (action !== 'remove') {

                var name = this.field('nombre');
                if (name.val() != undefined) {
                    if (!name.val().trim().length > 0) {
                        name.error('¡Debes introducir un nombre!');
                        name.focus();
                    }
                    var repetido = false;

                    for (let index = 0; index < requisitos.rows().data().length; index++) {
                        var comando = requisitos.rows().data()[index];

                        if (comando.nombre == name.val() && comando.DT_RowId != Object.keys(o.data)[0]) {
                            repetido = true;
                        }
                    }

                    if (repetido) {
                        name.error('¡Ya existe un requisito con ese nombre!');
                        name.focus();
                    }

                    var command = this.field('comando');
                    if (!command.val().trim().length > 0) {
                        command.error('¡Debes introducir un comando!');
                        if (name.val().trim().length > 0 && !repetido)
                            command.focus();
                    }
                }

                // Si no hay un error, no mutesra nada
                if (this.inError()) {
                    return false;
                }
            }
        }).on('open', function (e, o, action) {
            var btn = $(".DTE_Footer .btn");
            var title = $(".modal-title");
            if (action !== 'remove') {
                $(".DTE_Form_Content [autofocus]").focus();

                if (action == 'edit') {
                    btn.html("Editar");
                    title.html("Editar");
                } else {
                    btn.html("Crear");
                    title.html("Crear nuevo requisito");
                }
            } else {
                title.html("Borrar");
                $(".DTE_Form_Info").html(`<div class="alert alert-danger text-center">¿Estás seguro de borrar este requisito?<br> Todo aquel comando que use este requisito quedará inutilizado</div>`);
                btn.html("Borrar");
            }
        })

        /**
         * Extra los datos
         */
        function getData() {
            var listRequisitos = [];
            for (let index = 0; index < requisitos.rows().data().length; index++) {
                listRequisitos.push(requisitos.rows().data()[index]);
            }
            return listRequisitos;
        }

        return getData;
    }


    /**
     * Comprueba errores
     * @param {Boolean} mostrarMensaje Indica si se debe mostrar el mensaje
     * @param {Array} listaFrameworks Lista de nombre de los frameworks
     */
    checkErrors(mostrarMensaje = false, listaFrameworks = null) {
        var errores = 0;

        // Comprobamos los requisitos de los imputs
        var mensaje = "";

        var nombre = this._parent.find('#name-' + this._nameHTML);
        var mensajeNombre = "¡Debe escribir un nombre para el framework! Mínimo 5 carácteres";

        var frameworkYaexiste = false;
        var patron = /^[0-9a-zA-Z_-áéíóúÁÉÍÓÚñÑçÇ\s]{5,}$/;

        // Comprobamos si existe un framework con el nuevo nombre
        if (listaFrameworks != null) {
            if (nombre.val() != this._tempName) {
                frameworkYaexiste = listaFrameworks.includes(nombre.val());
                if (!frameworkYaexiste && patron.test(nombre.val()))
                    this._tempName = nombre.val();
            }
            if (patron.test(nombre.val()))
                mensajeNombre = "¡Ya existe un framework con ese nombre!";
        }

        if (!patron.test(nombre.val()) || frameworkYaexiste) {
            mensaje += mensajeNombre + "<br>";
            errores++;
            nombre.addClass("is-invalid");
            this._parent.find(`#name-${this._nameHTML} ~ .invalid-feedback`).html(mensajeNombre).show();
        } else {
            nombre.removeClass("is-invalid");
            this._parent.find(`#name-${this._nameHTML} ~ .invalid-feedback`).hide();
        }

        if (this._requirementesData().length == 0) {
            mensaje += "¡Debe incluir al menos un requisito!<br>";
            errores++;
            $(`#requirements-${this._nameHTML}`).css("border", "solid 1px red");
            this._parent.find("#requirements-error").show();
        } else {
            $(`#requirements-${this._nameHTML}`).css("border", "");
            this._parent.find("#requirements-error").hide();
        }

        var install = this._parent.find('#install-command-' + this._nameHTML);
        var patron = /(?=.*\$name)(?=.{6,}$)/;
        // 9 - composer | laravel new length
        if (!patron.test(install.val())) {
            mensaje += "¡Debes establecer un comando de instalación!<br>¡Debe incluir \$name!";
            errores++;
            this._parent.find(`#install-command-${this._nameHTML} ~ .invalid-feedback`).show();
            install.addClass("is-invalid");
        } else {
            install.removeClass("is-invalid");
            this._parent.find(`#install-command-${this._nameHTML} ~ .invalid-feedback`).hide();
        }

        $(`#${this._nameHTML}-general-tab i`).remove();
        if (mensaje.length > 0)
            $(`#${this._nameHTML}-general-tab`).append(` <i class="fa fa-exclamation-triangle text-danger"></i>`);


        // Reiniciamos el estado de guardado
        this._lockSave = false;
        var self = this;
        var listComands = this.listComands();

        /**
         * Comprueba el editor de formularios
         * @param {Variable} variable Variable donde coger los datos
         * @param {JSON} schema Schema de datos
         * @param {String} pill Elemento del DOM donde mostrar errores
         */
        function comprobarForms(variable, schema, pill) {
            var noEncontrados = 0;
            var elementosFormularioErrores = [];


            var formList = variable != null ? variable.actions.getData() : schema;
            if (formList != null) {
                var contador = 0;
                formList.forEach(form => {
                    if (!listComands[form.cmd]) {
                        noEncontrados++;
                        elementosFormularioErrores.push(contador);
                    }
                    contador++;
                });
            }

            // Reseteanos las alertas
            $(`#${self._nameHTML}-${pill}-tab i`).remove();
            $(`#${self._nameHTML}-${pill} .alert`).remove();
            $(`#${self._nameHTML}-${pill} .commandNotFound`).removeClass("commandNotFound");

            if (noEncontrados > 0) {
                errores++;
                var elemento = `#${self._nameHTML}-${pill} ul.frmb li.form-field`;
                elementosFormularioErrores.forEach(element => {
                    interfaz.waitUntilElement(elemento, function () {
                        $(elemento).eq(element).addClass("commandNotFound");
                    });
                });

                mensaje += "¡Debe solucionar los errores marcados en la página!";

                var ese = noEncontrados == 1 ? "" : "s";

                $(`#${self._nameHTML}-${pill}-tab`).append(` <i class="fa fa-exclamation-triangle text-danger"></i>`);

                $(`#${self._nameHTML}-${pill}`).prepend(`<div class="alert alert-danger text-center">
                        <i class="fa fa-exclamation-triangle"></i> ¡Hay ${noEncontrados} elemento${ese} del formulario con comandos no existentes o que recientemente has borrado!
                    </div>`);

            }
        }

        comprobarForms(this._editor, this._schema, "form");

        comprobarForms(this._quickEditor, this._quick, "quick");


        $(`#list-${this._nameHTML}-list i`).remove();
        if (errores > 0) {
            this._lockSave = true;
            $(`#list-${this._nameHTML}-list`).append(` <i class="fa fa-exclamation-triangle text-danger mt-1 float-right"></i>`);
            if (mensaje.length > 0 && mostrarMensaje)
                interfaz.modal("¡Atención!", mensaje, "Cerrar", null, null, true);
        }
    }

    /**
     * Crea la tabla de edición de comandos
     */
    commandsTable() {
        var self = this;

        // Configuración del editor
        var editor = new $.fn.dataTable.Editor({
            table: '#comandos-' + this._nameHTML,
            fields: [{
                    label: 'Orden:',
                    name: 'readingOrder',
                    fieldInfo: 'Este campo solo puede ser editado arrastrando y soltando.',
                    "type": "readonly",
                    "def": function () {
                        return self._table.rows().data().length + 1;
                    },
                    attr: {
                        disabled: true,
                        class: "d-none"
                    }
                }, {
                    label: "Nombre:",
                    name: "nombre",
                    attr: {
                        autofocus: true
                    }
                },
                {
                    label: "Comando:",
                    name: "comando",
                    allowEmpty: false
                }
            ]
        });

        // Instanciamos la tabla
        this._table = $('#comandos-' + this._nameHTML).DataTable({
            data: this._commands,
            columns: [{
                    data: 'readingOrder',
                    className: 'reorder'
                },
                {
                    "data": "nombre"
                },
                {
                    "data": "comando"
                }
            ],
            select: true,
            lengthChange: false,
            rowReorder: {
                dataSrc: 'readingOrder',
                editor: editor
            },
            columnDefs: [{
                orderable: false,
                targets: [1, 2]
            }],
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ comandos",
                "sZeroRecords": "No se encontraron comandos",
                "sEmptyTable": "Ningún comando disponible =(",
                "sInfo": "Mostrando comandos del _START_ al _END_ de un total de _TOTAL_ comandos",
                "sInfoEmpty": "Mostrando comandos del 0 al 0 de un total de 0 comandos",
                "sInfoFiltered": "(filtrado de un total de _MAX_ comandos)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copy": "Copiar",
                    "colvis": "Visibilidad",
                    "create": "Añadir",
                    "edit": "Editar",
                    "remove": "Borrar",
                    "delete": "Borrar",
                }
            }
        }).on('order', function () {
            /*  Evitamos numeros no consecutivos en el orden cuando borramos una fila
                es decir, si tenemos 1,2,3 comandos, borramos el comando 2,
                evitamos tener en tabla 1,3 de orden
            */
            var index = 1;
            self._table.rows().every(function (rowIdx) {
                self._table.cell(rowIdx, 0).data(index++);
            })

            self.checkErrors();
        })

        // Botones
        new $.fn.dataTable.Buttons(this._table, [{
                extend: "create",
                editor: editor
            },
            {
                extend: "edit",
                editor: editor
            },
            {
                extend: "remove",
                editor: editor
            }
        ]);

        // Añadimos los botones
        this._table.buttons().container()
            .appendTo($('.col-md-6:eq(0)', this._table.table().container()));

        editor.on('preSubmit', function (e, o, action) {
            if (action !== 'remove') {

                var name = this.field('nombre');
                if (name.val() != undefined) {
                    if (!name.val().trim().length > 0) {
                        name.error('¡Debes introducir un nombre!');
                        name.focus();
                    }

                    var repetido = false;

                    for (let index = 0; index < self._table.rows().data().length; index++) {
                        var comando = self._table.rows().data()[index];
                        if (comando.nombre == name.val() && comando.DT_RowId != Object.keys(o.data)[0]) {
                            repetido = true;
                        }
                    }

                    if (repetido) {
                        name.error('¡Ya existe un comando con ese nombre!');
                        name.focus();
                    }

                    var command = this.field('comando');
                    if (!command.val().trim().length > 0) {
                        command.error('¡Debes introducir un comando!');
                        if (name.val().trim().length > 0 && !repetido)
                            command.focus();
                    }
                }

                // Si no hay un error, no mutesra nada
                if (this.inError()) {
                    return false;
                }

            }
        }).on('open', function (e, o, action) {
            var btn = $(".DTE_Footer .btn");
            var title = $(".modal-title");
            if (action !== 'remove') {
                $(".DTE_Form_Content [autofocus]").focus();

                if (action == 'edit') {
                    btn.html("Editar");
                    title.html("Editar");
                } else {
                    btn.html("Crear");
                    title.html("Crear nuevo comando");
                }
            } else {
                title.html("Borrar");
                $(".DTE_Form_Info").html(`<div class="alert alert-danger text-center">Al borrar este comando, todo aquel elemento que lo use quedará inutilizado.<br><strong>¿Estás seguro de borrarlo?</strong></div>`);
                btn.html("Borrar");
            }
        })

    }

    /**
     * Borra la configuración del framework
     */
    deleteFramework() {
        var self = this;
        var datos = {
            "nameFile": this._file,
            "api": "delFile"
        }

        interfaz.ajax("common", datos, undefined, undefined, function (data) {
            if (!data) {
                interfaz.alerta("trash", "Borrado", `La configuración de ${self._name} ha sido borrada`, "success");

                // Borramos los elementos del DOM
                $("#list-" + self._nameHTML + "-list").remove();
                $("#" + self._nameHTML).remove();

                // Cambiamos al primero de la lista de frameworks
                if ($("#list-frame a").length > 0)
                    $("#list-frame a").eq(0).click();
                else
                    $(".frame-body").html(`<div class="alert alert-info text-center w-100">No hay ninguna configuración de framework creada.</div>`);

            } else
                interfaz.alerta("exclamation-triangle", "Errors", "Se ha producido un error al borrar", "danger");
        }, function (data) {
            interfaz.alerta("exclamation-triangle", "Error", "Se ha producido un error al borrar", "danger");
        });
    }

    /**
     * Guarda el framework
     */
    saveFramework() {
        // comprobar antes de guardar que en json tenga nombre, requisitos, comandos y formularios
        let self = this;

        if (!self._lockSave) {
            let jsonschema = {};

            // Guardamos el nombre
            jsonschema.name = self.findElementConfig("name");

            // Guardamos requisitos
            jsonschema.requirements = self._requirementesData();

            // Guardamos los archivos
            jsonschema.files = self._filesData();

            // Guardamos la ruta principal
            jsonschema.mainRoot = self.findElementConfig("main-root");

            // Guardamos el comando de instalación
            jsonschema.installCommand = self.findElementConfig("install-command");

            // Guardamos formularios
            // Si el editor no es nulo, recogemos sus datos, si no, guardamos los datos actuales
            jsonschema.forms = self._editor != null ? self._editor.actions.getData() : self._schema;

            // Si el contenido está vacío no guardamos nada, si no es asi, lo coficamos
            if (jsonschema.forms != null && jsonschema.forms.length > 0)
                jsonschema.forms = btoa(JSON.stringify(jsonschema.forms));
            else
                delete jsonschema.forms;

            jsonschema.quick = self._quickEditor != null ? self._quickEditor.actions.getData() : self._quick;

            if (jsonschema.quick != null && jsonschema.quick.length > 0)
                jsonschema.quick = btoa(JSON.stringify(jsonschema.quick));
            else
                delete jsonschema.quick;

            // Guardamos los comandos
            jsonschema.commands = [];
            for (let index = 0; index < self._table.rows().data().length; index++) {
                jsonschema.commands.push(self._table.rows().data()[index]);
            }

            if (jsonschema.commands.length == 0)
                delete jsonschema.commands;


            var datos = {
                "data": jsonschema,
                "nameFile": interfaz.ucFirst(jsonschema.name) + '.json',
                "api": "saveFile"
            }
            // Borramos el antiguo fichero si se cambia el nombre
            if (self._file != datos.nameFile) {
                datos.oldFile = self._file;
                self._file = datos.nameFile;
            }


            interfaz.ajax("common", datos, undefined, undefined, function (data) {
                if (data == 1) {
                    interfaz.alerta("save", "Guardado de " + self._name, "Configuración guardada", "success");
                    $("#list-" + self._nameHTML + "-list").html(jsonschema.name);
                } else
                    interfaz.alerta("exclamation-triangle", "Errors", "Se ha producido un error al guardar", "danger");
            }, function (data) {
                console.log("Error:" + data);
                interfaz.alerta("exclamation-triangle", "Error", "Se ha producido un error al guardar", "danger");
            });
        }
    }

    /**
     * Crea un nuevo framework
     */
    createFramework() {
        // Código aleatorio temporal
        const id = Math.random().toString(36).substr(2, 9);

        var forms = `
        <form id="${id}">
            <div class="form-group row">
                <label for="frameName" class="col-xl-4 col-form-label oglibatorio">Nombre:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="frameName" required autofocus>
                    <div class="invalid-feedback">
                        ¡Debe escribir un nombre para el framework! Mínimo 5 carácteres
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="frameReq" class="col-xl-4 col-form-label oglibatorio">Requisitos:</label>
                <div class="col-sm-10">
                    <table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="frameReq" width="100%">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Comando</th>
                            </tr>
                        </thead>
                    </table>
                    <div class="invalid-feedback" id="frameReq-error">
                        ¡Debe incluir al menos un requisito!
                    </div>
                    <div class="text-muted">Para comprobar si tenemos instaladas las dependencias, lo averiguaremos por el comando de versión.</div>
                </div>
            </div>
            <div class="form-group row">
                <label for="frameRoot" class="col-xl-4 col-form-label">Ruta principal</label>
                <div class="col-sm-10">
                    <input type="text" id="frameRoot" class="form-control" placeholder="ej: public">
                    <div class="invalid-feedback">¡Debes indicar la ruta principal!</div>
                    <div class="text-muted">La ruta principal se usará para enlazar con la vista del proyecto</div>
                </div>
            </div>
            <div class="form-group row">
                <label for="commandInstall" class="col-sm-6 col-form-label oglibatorio">Comando de instalación:</label>
                <div class="col-sm-10">
                    <input type="text" id="commandInstall" class="form-control" required>
                    <div class="invalid-feedback">
                        ¡Debes establecer un comando de instalación!<br>
                        ¡Debe aparecer $name!
                    </div>
                    <div class="text-muted">Usa <strong>\$name</strong> para obtener el nombre del proyecto</div>
                </div>
            </div>
        </form>`;

        var self = this;

        /**
         * DataTable de la tabla de requisitos del modal
         */
        var requisitos = null;

        interfaz.waitUntilElement(`#${id} #frameReq`, function () {
            requisitos = self.requirementsTable("#frameReq");
        }, function () {
            interfaz.alerta("exclamation-triangle", "Error", "¡Ha ocurrido un error al crear la tabla! Error: #newTable01", "danger", false);
        });

        interfaz.modal("Crear nueva configuración de framework", forms, "Crear", function () {


            interfaz.getFrameList(true, function (lista) {
                comprobar(lista)
            });

            /**
             * Comprueba que todo esté correctamente
             * 
             * @param {Array} lista Lista de nombre de los framework
             */
            function comprobar(lista) {
                var errores = 0;

                var nombre = $('#frameName');
                var mensajeNombre = "¡Debe escribir un nombre para el framework! Mínimo 5 carácteres";

                var frameworkYaexiste = false;
                var patron = /^[0-9a-zA-Z_-áéíóúÁÉÍÓÚñÑçÇ\s]{5,}$/;

                // Comprobamos si existe un framework con el nuevo nombre
                if (lista != false)
                    frameworkYaexiste = lista.includes(nombre.val());

                if (patron.test(nombre.val()))
                    mensajeNombre = "¡Ya existe un framework con ese nombre!";

                if (!patron.test(nombre.val()) || frameworkYaexiste) {
                    errores++;
                    nombre.addClass("is-invalid");
                    $(`#frameName ~ .invalid-feedback`).html(mensajeNombre).show();
                } else {
                    nombre.removeClass("is-invalid");
                    $(`#frameName ~ .invalid-feedback`).hide();
                }

                if (requisitos().length == 0) {
                    errores++;
                    $(`#frameReq`).css("border", "solid 1px red");
                    $("#frameReq-error").show();
                } else {
                    $(`#frameReq`).css("border", "");
                    $("#frameReq-error").hide();
                }

                var install = $("#commandInstall");
                var patron = /(?=.*\$name)(?=.{6,}$)/;
                // 9 - composer | laravel new length
                if (!patron.test(install.val())) {
                    errores++;
                    $(`#commandInstall ~ .invalid-feedback`).show();
                    install.addClass("is-invalid");
                } else {
                    install.removeClass("is-invalid");
                    $(`#commandInstall ~ .invalid-feedback`).hide();
                }

                // Si los datos son correctos, guardamos
                if (errores == 0) {
                    /**
                     * Formulario del modal
                     */
                    var form = $("#" + id);

                    let jsonschema = {};

                    // Guardamos el nombre
                    jsonschema.name = form.find("#frameName").val();

                    // Guardamos requisitos
                    jsonschema.requirements = requisitos();

                    // Guardamos el comando de instalación
                    jsonschema.installCommand = form.find("#commandInstall").val();

                    // Guardamos la ruta principal
                    jsonschema.mainRoot = form.find("#frameRoot").val();

                    var datos = {
                        "data": jsonschema,
                        "nameFile": interfaz.ucFirst(jsonschema.name) + '.json',
                        "api": "saveFile"
                    }

                    // Creamos la nueva configuración
                    interfaz.ajax("common", datos, undefined, undefined, function (data) {
                        if (data == 1) {
                            interfaz.alerta("plus", "Nueva configuración", "Configuración creada", "success");

                            new Frameworks(datos.data, datos.nameFile);
                            $("#list-frame a").last().click();
                        } else
                            interfaz.alerta("exclamation-triangle", "Errors", "Se ha producido un error al crear", "danger");
                    }, function (data) {
                        interfaz.alerta("exclamation-triangle", "Error", "Se ha producido un error al crear", "danger");
                    });

                    // Cerramos el modal
                    $("#modal").modal("toggle");
                }
            }

        }, null, false, false);
    }

    /**
     * Obtiene la lista de comandos
     * @param {Object} porDefecto Valor por defecto 
     * @return {Object} Lista de comandos
     */
    listComands(porDefecto = null) {
        var listCommands = {};

        if (porDefecto != null)
            listCommands[porDefecto.valor] = porDefecto.nombre;

        // Obtenemos la lista de comandos de la tabla
        if (this._table.rows().data().length > 0)
            for (let index = 0; index < this._table.rows().data().length; index++) {
                var comando = this._table.rows().data()[index];
                listCommands[comando.DT_RowId] = comando.nombre;
            }

        return listCommands;
    }

    /**
     * Actualiza la lista de comandos del editor de formularios
     * @param {String} tab Pestaña de configuración
     */
    actualizarListaComandos(tab = "#" + this._nameHTML + "-form") {
        // Actualizamos la lista de comandos
        var self = this;

        $(`${tab} li.form-field.editing select[title='Comando']`).toArray().forEach(selector => {
            var id = selector.id;
            selector = $(selector);

            if (selector.length > 0) {
                var dValue = {
                    nombre: "Seleccione un comando",
                    valor: ""
                };
                let valor = selector.val();

                selector.css("border", "");

                // Borramos el contenido
                selector.empty();
                // Añadimos las opciones
                var comandos = this.listComands(dValue);
                Object.keys(comandos).forEach(opcion => {
                    selector.append(`<option value='${opcion}' >${comandos[opcion]}</option>`);
                });

                /**
                 * Función local que cambia el color si está seleccinada la opción por defecto
                 */
                function changeColor() {
                    // Borramos eventos anteriores para evitar la acumulación de eventos
                    selector.off();

                    // Ejecutamos al instante para mostrar el borde rojo
                    if (selector.val() != dValue.valor)
                        selector.css("border", "");
                    else
                        selector.css("border", "red solid 1px");

                    self.checkErrors();


                    selector.bind("change keyup", function () {
                        if (selector.val() != dValue.valor)
                            selector.css("border", "");
                        else
                            selector.css("border", "red solid 1px");
                        self.checkErrors();
                    });
                }

                // Seleccionamos la opción que estaba seleccionada antes de borrar todo
                var changeSelect = $(`#${id} > option[value="${valor}"]`);
                if (changeSelect.length > 0) {
                    changeSelect.attr("selected", true);
                    changeColor();
                } else {
                    selector.val(dValue.valor);
                    changeColor();
                }
            }

        });
    }

    /**
     * Crea el editor de formularios
     * @param {String} element Elemento que debe detectar para cargar
     * @param {JSON} data Datos del formulario
     * @param {Array} disable Elementos desabilitados
     */
    createFormEditor(element = "#" + this._nameHTML + "-form", data = this._schema, disable = ['autocomplete', 'date', 'file', 'header', 'hidden', 'paragraph', 'button']) {
        var variable = null;
        var dValue = {
            nombre: "Seleccione un comando",
            valor: ""
        };

        // Atributos customizados donde almacenamos los comandos
        var sameCustomAttrs = {
            cmd: {
                label: 'Comando',
                multiple: false,
                options: this.listComands(dValue),
                required: true
            }
        }

        var patternAttr = {
            pattern: {
                label: "Pattern",
                placeholder: "Introduce una expresión regular a buscar",
                value: ""
            },
            patternInfo: {
                label: "Pattern-info",
                placeholder: "Introduce información sobre el patrón",
                value: ""
            }
        }

        patternAttr.cmd = sameCustomAttrs.cmd;

        var self = this;


        var options = {
            defaultFields: data,
            fieldRemoveWarn: true,
            editOnAdd: true,
            disabledActionButtons: ['data', 'save', 'clear'],
            stickyControls: {
                enable: true
            },
            scrollToFieldOnAdd: false,
            disableFields: disable,
            typeUserAttrs: {
                'checkbox-group': sameCustomAttrs,
                number: sameCustomAttrs,
                'radio-group': sameCustomAttrs,
                select: sameCustomAttrs,
                text: patternAttr,
                textarea: patternAttr,
                button: sameCustomAttrs
            },
            typeUserDisabledAttrs: {
                'checkbox-group': ['access', 'other'],
                number: ['access'],
                'radio-group': ['access', 'other'],
                select: ['access'],
                text: ['access'],
                textarea: ['access'],
                button: ['access']
            },
            onOpenFieldEdit: function () {
                self.actualizarListaComandos(element);
            },
            onAddField: function (fieldID) {
                // Cuando creamos un nuevo field y lo eliminamos, actualizamos los errores

                //Pequeño arreglo con el ID
                var fieldID = fieldID.split("fld-");
                var boton = `#${fieldID[0]}fld-${(Number.parseInt(fieldID[1])+1)} .field-actions a.del-button`;
                interfaz.waitUntilElement(boton, function () {
                    $(boton).off().click(function () {
                        var confirmar = ".button-wrap .yes";
                        interfaz.waitUntilElement(confirmar, function () {
                            $(confirmar).off().click(function () {
                                /**
                                 * Ejecutamos el chequeo cuando se oculte el modal
                                 */
                                function checkError() {
                                    setTimeout(function () {
                                        if ($(confirmar).length > 0)
                                            checkError();
                                        else
                                            self.checkErrors()
                                    }, 300);
                                }

                                checkError();

                            });
                        });

                    });
                });
            }
        };
        variable = this._parent.find(element).formBuilder(options);
        this._parent.find(".lds-spinner").remove();

        // Limpiamos los residuos de consola del generador
        interfaz.waitUntilElement(`${element} .form-builder`, function () {
            console.clear();
        });
        return variable;
    }
}

// Se ejecutará en la página de configuración
if ($("#newFramework").length > 0) {

    interfaz.ajax("common", {
        api: "frameworks"
    }, "POST", "json", function (data) {
        if (data != "") {

            $(".frame-body").html(`<div class="row">
                                        <div class="col-sm-3">
                                            <div class="list-group" id="list-frame"></div>
                                        </div>
                                        <div class="col-sm-9">
                                            <div class="tab-content" id="nav-frame"></div>
                                        </div>
                                    </div>`);

            Object.keys(data).forEach(datos => {
                var file = data[datos].file;
                datos = data[datos].data;
                new Frameworks(datos, file);
            });
        } else {
            new Frameworks;
            $(".frame-body").html(`<div class="alert alert-primary w-100 text-center mx-2">
            No hay frameworks configurados.
            </div>`);
        }
    }, function () {
        $(".frame-body").html(`<div class="alert alert-danger w-100 text-center mx-2">
            Se ha producido un error al obtener los resultados.<br>
            <span class="text-muted">Error: #loadSchema_01</span>
            </div>`);
    });
}