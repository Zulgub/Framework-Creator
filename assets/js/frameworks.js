import {
    Interface
} from "./interface";

var interfaz = new Interface(false);
/**
 * Queda por hacer
 * 
 * loadConfigFile
 * 
 * Por añadir (Más adelante) Botones de acceso rápido (DataTable)
 */

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
     * Constructor de la clase Framework
     * 
     * @param {String} name Nombre del frameworks
     * @param {String} fileName Archivo de configuración
     * @param {Object} requirements Requisitos del frameworks
     * @param {Object} schema Esquema de los formularios
     * @param {Object} commands Comandos del framework
     */
    constructor(name, fileName, requirements, schema, commands) {
        /**
         * Nombre del framework
         */
        this._name = name;

        /**
         * Nombre del framework para uso especial (Se modificará, sin afectar a la estructura)
         */
        this._tempName = name;

        /**
         * Nombre para estructuras html
         */
        this._nameHTML = name.replace(/\s/g, '_');

        /**
         * Elemento padre
         */
        this._parent = $("#" + this._nameHTML);

        /**
         * Archivo de configuración
         */
        this._file = fileName;

        /**
         * Lista de requisitos
         */
        this._requirements = requirements;

        /**
         * Guardamos la lista de requisitos para ser usado en otros modulos
         */
        this._requirementesData;

        /**
         * Schema del framework
         * */
        this._schema = schema != null ? JSON.parse(atob(schema)) : null;

        /**
         * Lista de comandos
         */
        this._commands = commands;

        /**
         * Estado bloqueado del botón de guardar
         */
        this._lockSave = false;

        // Cargamos los modulos
        this.loadModules();
    }

    /**
     * Cargamos los modulos necesarios y asignamos funciones
     */
    loadModules() {
        var self = this;

        this._requirementesData = this.requirementsTable('#requirements-' + this._nameHTML, this._requirements);

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
            self.createFormEditor();
            // Limpiamos el evento, solo queremos que se ejecute 1 vez
            $(this).off();

            $(this).click(function () {
                self.actualizarListaComandos();
            })
        });

        // Asignamos la opción de borrar el framework
        this._parent.find("button.delete").click(function () {
            interfaz.modal("Borrar framework", `¿Desea borrar ${self._name} y toda su configuración?<div class="alert alert-danger mt-2"><i class="fa fa-exclamation-triangle"></i> La administracción de proyectos con este framework quedará obsoleta.</div>`, "Borrar", function () {
                self.deleteFramework();
            })
        });

        //Asignamos la creación de un nuevo framework
        $("#newFramework").off();
        $("#newFramework").click(function () {
            self.createFramework();
        });

        this.commandsTable();
        interfaz.getFrameList(false, function (list) {
            self.checkErrors(false, list);
        })
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
                        if (comando.nombre == name.val()) {
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

        var frameRoot = this._parent.find('#main-root-' + this._nameHTML);
        if (!frameRoot.val().length > 0) {
            errores++;
            frameRoot.addClass("is-invalid");
            $(`#main-root-${this._nameHTML} ~ .invalid-feedback`).show();
        } else {
            frameRoot.removeClass("is-invalid");
            $(`#main-root-${this._nameHTML} ~ .invalid-feedback`).hide();

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
        var formList = this._editor != null ? this._editor.actions.getData() : this._schema;
        var noEncontrados = 0;
        var elementosFormularioErrores = [];
        var listComands = this.listComands();
        if (formList != null) {
            var contador = 0;
            formList.forEach(form => {
                if (!listComands[form.shape]) {
                    noEncontrados++;
                    elementosFormularioErrores.push(contador);
                }
                contador++;
            });
        }

        // Reseteanos las alertas
        $(`#${this._nameHTML}-form-tab i`).remove();
        $(`#${this._nameHTML}-forms .alert`).remove();
        $('.commandNotFound').removeClass("commandNotFound");

        if (noEncontrados > 0) {
            errores++;
            elementosFormularioErrores.forEach(element => {
                var elemento = "ul.frmb li.form-field";
                interfaz.waitUntilElement(elemento, function () {
                    $(elemento).eq(element).addClass("commandNotFound");
                });
            });

            mensaje += "¡Debe solucionar los errores marcados en la página!";

            var ese = noEncontrados == 1 ? "" : "s";

            $(`#${this._nameHTML}-form-tab`).append(` <i class="fa fa-exclamation-triangle text-danger"></i>`);

            $(`#${this._nameHTML}-forms`).prepend(`<div class="alert alert-danger text-center">
                        <i class="fa fa-exclamation-triangle"></i> ¡Hay ${noEncontrados} elemento${ese} del formulario con comandos no existentes o que recientemente has borrado!
                    </div>`);

        }

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
                        if (comando.nombre == name.val()) {
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
                if ($("#list-tab a").length > 0)
                    $("#list-tab a").eq(0).click();
                else
                    $(".card-body").html(`<div class="alert alert-info text-center w-100">No hay ninguna configuración de framework creada.</div>`);

            } else
                interfaz.alerta("exclamation-triangle", "Errors", "Se ha producido un error al borrar", "danger");
        }, function (data) {
            console.log("Error:" + data);
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
                <label for="frameName" class="col-xl-2 col-form-label">Nombre: </label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="frameName" required autofocus>
                    <div class="invalid-feedback">
                        ¡Debe escribir un nombre para el framework! Mínimo 5 carácteres
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="frameReq" class="col-xl-2 col-form-label">Requisitos: </label>
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
                <label for="commandInstall" class="col-sm-6 col-form-label">Comando de instalación:</label>
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
            console.error("¡Ha ocurrido un error al crear la tabla! Error: #newTable01");
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

                var frameRoot = $("#frameRoot");
                if (!frameRoot.val().length > 0) {
                    errores++;
                    frameRoot.addClass("is-invalid");
                    $(`#frameRoot ~ .invalid-feedback`).show();
                } else {
                    frameRoot.removeClass("is-invalid");
                    $(`#frameRoot ~ .invalid-feedback`).hide();

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

                            // Refrescamos la página tras 1 segundo
                            setTimeout(function () {
                                sessionStorage.setItem("target", jsonschema.name);
                                location.reload();
                            }, 1000);
                        } else
                            interfaz.alerta("exclamation-triangle", "Errors", "Se ha producido un error al crear", "danger");
                    }, function (data) {
                        console.log("Error:" + data);
                        interfaz.alerta("exclamation-triangle", "Error", "Se ha producido un error al crear", "danger");
                    });

                    // Cerramos el modal
                    $("#modal").modal("toggle");
                }
            }

        }, null, false, false);
    }

    /**
     * Carga un archivo de configuración
     */
    loadConfigFile() {

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
     */
    actualizarListaComandos() {
        // Actualizamos la lista de comandos
        var self = this;
        var padre = $("li.form-field.editing");

        var selector = padre.find("select[title='Comando']");
        if (selector.length > 0) {
            var dValue = {
                nombre: "Seleccione un comando",
                valor: ""
            };
            var valor = selector.val();

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
            var changeSelect = padre.find(`select[title='Comando'] > option[value="${valor}"]`);
            if (changeSelect.length > 0) {
                changeSelect.attr("selected", true);
                changeColor();
            } else {
                selector.val(dValue.valor);
                changeColor();
            }
        }
    }

    /**
     * Crea el editor de formularios
     */
    createFormEditor() {
        if (this._editor == null) {

            var opciones = {}
            var dValue = {
                nombre: "Seleccione un comando",
                valor: ""
            };

            // Atributos customizados donde almacenamos los comandos
            var sameCustomAttrs = {
                shape: {
                    label: 'Comando',
                    multiple: false,
                    options: this.listComands(dValue),
                    required: true
                }
            }

            var self = this;


            var options = {
                defaultFields: this._schema,
                fieldRemoveWarn: true,
                editOnAdd: true,
                disabledActionButtons: ['data', 'save', 'clear'],
                stickyControls: {
                    enable: true
                },
                scrollToFieldOnAdd: false,
                disableFields: ['autocomplete', 'date', 'file', 'header', 'hidden', 'paragraph', 'button'],
                typeUserAttrs: {
                    'checkbox-group': sameCustomAttrs,
                    number: sameCustomAttrs,
                    'radio-group': sameCustomAttrs,
                    select: sameCustomAttrs,
                    text: sameCustomAttrs,
                    textarea: sameCustomAttrs
                },
                typeUserDisabledAttrs: {
                    'checkbox-group': ['access', 'other'],
                    number: ['access'],
                    'radio-group': ['access', 'other'],
                    select: ['access'],
                    text: ['access'],
                    textarea: ['access']
                },
                onOpenFieldEdit: function () {
                    self.actualizarListaComandos();
                },
                onAddField: function (fieldID) {
                    // Cuando creamos un nuevo field y lo eliminamos, actualizamos los errores

                    //Pequeño arreglo con el ID
                    var fieldID = fieldID.split("fld-");
                    var boton = `#${fieldID[0]}fld-${(Number.parseInt(fieldID[1])+1)} .field-actions a.del-button`;
                    interfaz.waitUntilElement(boton, function () {
                        $(boton).off();
                        $(boton).click(function () {
                            var confirmar = ".button-wrap .yes";
                            interfaz.waitUntilElement(confirmar, function () {
                                $(confirmar).off();
                                $(confirmar).click(function () {
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
            this._editor = this._parent.find(".json-editor-form").formBuilder(options);
            this._parent.find(".lds-spinner").remove();

            // Limpiamos los residuos de consola del generador
            interfaz.waitUntilElement(".form-builder", function(){
                console.clear();
            });
        }
    }
}

/**
 * Lista de configuración de frameworks
 */
var listFrameworks = [];

// Cargamos todos los frameworks
$(".json-editor-form").each(function () {
    var self = this;
    var json = $(this).data("json");

    interfaz.ajax("./assets/includes/vistas/config/frameworks/" + json, null, null, undefined, function (datos) {
        listFrameworks.push(new Frameworks(datos.name, json, datos.requirements, datos.forms, datos.commands));
    }, function () {
        $(self).html(`<div class="alert alert-danger w-100 text-center mx-2">
        Se ha producido un error al obtener los resultados.<br>
        <span class="text-muted">Error: #loadSchema_01</span>
        </div>`);
    });
});

// Hacemos target al elemento recientemente creado
var target = sessionStorage.getItem("target");

if (target != null) {
    interfaz.waitUntilElement(`#list-${target}-list`, function () {
        $(`#list-${target}-list`).click();

        // Destruimos los datos
        sessionStorage.removeItem("target");
    });
}