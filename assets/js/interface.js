/**
 * Clase interface
 * 
 * Esta clase contiene módulos globales a usar en todas las páginas, modals, alertas, consulta AJAX...
 */
export class Interface {

    constructor(loadModules = true) {
        this._listFrameworks = [];

        /**
         * Máximo numero de Slash, usado para indicar la ruta absoluta
         */
        this._maxSlash = window.location["pathname"].match(/\//g).length - 1;
        /**
         * Resguardo de notificaciones para ver si hay cambios
         */

        /**
         * Almacena la ruta fixeada
         */
        this._fixedPath = "";

        this._temporal = {};
        if (loadModules) {
            this.loadModules();
            this.vistaPrevia();
        }
    }

    /**
     * Carga los modulos y asigna funciones
     */
    loadModules() {
        var self = this;

        Push.Permission.request(null, function () {
            self.modal("Permitir notificaciones", "Permite a este sitio que te envíe notificaciones cuando no estés en la web", "Aceptar", null, null, true);
        });

        if ($("#projectlist").length > 0) {
            this.listProject();
            this.listaFrameworksIntermediate();
            $("#buscarProyecto").bind("keyup change", function () {
                self.searchProject($(this).val());
            });
            $("#actualizarProyectos").click(function () {
                self.listProject();
            });
        }

        $(".newProject").click(function () {
            self.getFrameList(true, function (list) {              
                if (list.length > 0) {
                    var select = '<select class="form-control" id="frameSelected"><option value="">Seleccione un framework</option>';
                    list.forEach(op => {
                        select += `<option>${op}</option>`
                    });

                    self.modal("Nuevo proyecto", `<label class="form-label row p-4">Seleccione un framework: ${select}</select></label><div class="invalid-feedback">¡Debes selecionar un framework!</div>`, "Siguiente", function () {
                        var parent = $(".modal-content");
                        var selected = $("#frameSelected").val();
                        parent.find(".invalid-feedback").hide();
                        if (selected != "") {
                            self.modal("Requisitos del framework", `<div class="text-center">Comprobando requisitos <i class="fa fa-spinner fa-spin"></i></div>`);

                            self.ajax("assets/includes/class/runCode.php", {
                                requirements: selected
                            }, "post", "json", function (datos) {
                                if (datos === true && $(".modal.show").length > 0) {
                                    self.modal(`Nuevo proyecto - ${selected}`, "", `Crear`, function () {
                                        /**
                                         * Lista negra de nombre de carpetas en linux y windows
                                         * 
                                         * Primera parte - Comprueba que el nombre no sea así
                                         * Segunda parte - Comprueba que no exista esos caracteres en el nombre
                                         * Tercera parte - Comprueba que no termina en punto o espacio
                                         */
                                        var blackList = /^(?!(CON|VENDOR|PRN|AUX|CLOCK|NUL|[A-Z]\:|COM[1-9]|LPT[1-9])$)(?!.*[\<\>\:\"\/\\\|\?\*])(?!^.*[\.\s]+$)/gi;
                                        var nombre = $("#name-project");
                                        if (nombre.val().length > 0)
                                            self.ajax("common", {
                                                "api": "listProjects"
                                            }, "post", "json", function (datos) {
                                                datos = datos.map(function (x) {
                                                    return x.toUpperCase()
                                                });
                                                nombre = $("#name-project");

                                                if (datos.includes(nombre.val().toUpperCase())) {
                                                    $("#invalid-project-name").html("¡Ya existe un proyecto con ese nombre!").show();
                                                    nombre.focus();
                                                } else if (!blackList.test(nombre.val())) {
                                                    $("#invalid-project-name").html(`¡Nombre inválido!
                                                <br>Nombres no permitidos:
                                                <ul>
                                                    <li>con</li>
                                                    <li>prn</li>
                                                    <li>aux</li>
                                                    <li>clock</li>
                                                    <li>nul</li>
                                                    <li>A: - Z:</li>
                                                    <li>com1 - com9</li>
                                                    <li>lpt1 - lpt9</li>
                                                    <li>vendor</li>
                                                </ul>
                                                No se permite nombres con los siguientes caracteres: <, >, :, ", \\, \/, \|, ?, *<br>
                                                No puede acabar en punto o espacio`).show();
                                                    nombre.focus();
                                                } else {
                                                    var modal = $(".modal-dialog");

                                                    // Posición de la notificación
                                                    var position = $(".notify").offset();

                                                    modal.animate({
                                                        width: 0 + 'px',
                                                        height: 0 + 'px',
                                                        left: Math.abs(position.left - modal.offset().left - (modal.width() / 2)) + 'px',
                                                        top: position.top + 'px'
                                                    }, 300, "linear", function () {
                                                        $("#modal").modal("hide");

                                                        // Devolvemos el modal a su estado original
                                                        setTimeout(function () {
                                                            modal.removeAttr("style");
                                                        }, 500);
                                                    });

                                                    self._comands();
                                                }
                                            }, function () {
                                                self.alerta("exclamation-triangle", "Error", "Error al comprobar si existe un proyecto con ese nombre", "danger", false);
                                            });
                                        else {
                                            $("#invalid-project-name").show();
                                            nombre.focus();
                                        }
                                    }, null, false, false);

                                    self.ajax(`assets/includes/vistas/config/frameworks/${self.ucFirst(selected)}.json`, null, null, undefined, function (datos) {
                                        self.waitUntilElement(".modal-body", function () {
                                            if(self.checkErrors(datos)){
                                                self._comands = self.doCommands(datos, self.ucFirst(selected));
                                                if (datos.forms && datos.commands)
                                                    self.setFixedRender(".modal-body", datos.forms);
                                                $(".modal-body").prepend('<label class="form-label row px-4 oglibatorio">Nombre del proyecto: <input type="text" id="name-project" autofocus class="form-control" placeholder="Introduce un nombre para el proyecto"></input><div class="invalid-feedback" id="invalid-project-name">Introduce un nombre</div></label>');
                                                $("#modal").find("[autofocus]").focus();
                                            } else {
                                                $(".modal-body").prepend(`<div class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i> Error: La configuración del framework no es correcta. <a href="${self.fixRoot(`config#${datos.name.replace(/\s/g, '_')}`)}">Revise la configuración</a></div>`);
                                            }
                                        }, function () {
                                            self.alerta("exclamation-triangle", "Error", "#Error formRender_01", "danger", false);
                                        });
                                    }, function () {
                                        self.alerta("exclamation-triangle", "Error", "Ha ocurrido un error al obtener los datos del framework", "danger", false);

                                    });
                                } else {
                                    $(".modal-body").html(`<div class="alert alert-danger">Para que este framework funcione se require lo siguiente:
                                <ul>${datos}</ul></div>`);
                                }
                            }, function (datos) {
                                console.log(datos);
                                self.alerta("exclamation-triangle", "Error", "Error al comprobar los requisitos", "danger", false);
                            });

                        } else
                            parent.find(".invalid-feedback").show();

                    }, null, false, false);
                } else {
                    var link = self.fixRoot("config");
                    self.modal("No se han encontrado frameworks", `<div class="alert alert-primary text-center"><i class="fa fa-info"></i> No se ha encontrado frameworks. <a href="${link}">¿Desea añadir uno?</a></div>`, "Aceptar", null, null, true);
                }
            });
        });

        if ($(".notify-content").length > 0)
            this._notify = setInterval(function () {
                self.actualizarNotificaciones();
            }, 1000);

        $(".cancelAll").click(function () {

            // Indicamos la cancelación de todo
            Object.keys(self._temporal).forEach(temp => {
                sessionStorage.setItem(temp, "cancel");
            });

            var errorMSG = `Se ha detectado un posible error al borrar los archivos de instalación, compruebe manualmente si quedan archivos residuales en "/projects"`;

            self.ajax("assets/includes/class/runCode.php", {
                "cancelAll": null
            }, "post", "json", function (datos) {
                var mensaje = datos ? `Instalaciones canceladas` : errorMSG;
                var color = datos ? "success" : "danger";
                var icon = datos ? "times" : "exclamation-triangle";
                self.alerta(icon, "Cancelar todos", mensaje, color, false);
            }, function () { // Mensaje de error
                self.alerta("exclamation-triangle", "Error", errorMSG, "danger", false);
            });
        });
    }

    /**
     * Comprueba los errores
     * 
     * @param {JSON} datos del framework 
     * @return {Boolean} Estado de la comprobación
     */
    checkErrors(datos){
        const self = this;

        const commands = datos.commands;

        const commandsIds = commands != null ? commands.map(function(x){ return x.DT_RowId}) : null;

        /**
         * Comprueba el editor de formularios
         * @param {string} formList Formulario
         * @return {Boolean} Estado de la comprobación
         */
        function comprobarForms(formList) {

            let noEncontrados = 0;

            if (formList != null) {
                formList = JSON.parse(atob(formList));
                var contador = 0;
                formList.forEach(form => {
                    if (commandsIds != null && !commandsIds.includes(form.cmd)) {
                        noEncontrados++;
                    }
                    contador++;
                });
            }

            return noEncontrados == 0;
        }

        /**
         * Comprueba los comandos
         * 
         * @param {Array} commands Lista de comandos
         * @param {string} formList Formulario
         * @return {Boolean} Estado de la comprobación
         */
        function comprobarCommands(commands, formList = null){

            formList = formList != null ? JSON.parse(atob(formList)).map(form => {return form.name;}) : null;

            const pattern = /(?:\%([^\s'"]+))/g;
            let commandError = 0;
            if(commands != undefined){
                for (let index = 0; index < commands.length; index++) {
                    const now = commands[index];                    
                    const command = now.comando;
                    const id = now.DT_RowId;
                    if (pattern.test(command)) {
                        let formGroup = self.extraer(command, pattern);
                        formGroup = formGroup.map(function(x){ return x.substr(1); });
                        self.removeItemFromArr(formGroup, "this");
                        if(formGroup.length && formGroup.length > 0){
                            if(formList != null){
                                formGroup.map(function(elm) { if(!formList.includes(elm)){commandError++; $(`#comandos-${self._nameHTML} #${id}`).addClass("commandNotFound")}});
                            }
                        }
                    }
                }
            }

            return commandError == 0;
        }

        return /^[0-9a-zA-Z_-áéíóúÁÉÍÓÚñÑçÇ\s]{5,}$/.test(datos.name) && datos.requirements.length > 0 && /(?=.*\$name)(?=.{6,}$)/.test(datos.installCommand) && comprobarForms(datos.forms) && comprobarForms(datos.quick) && comprobarCommands(datos.commands, datos.forms);
    }

    /**
     * Actualiza el area de notificaciones
     */
    actualizarNotificaciones() {
        var self = this;

        this.ajax("common", {
            api: "installing"
        }, "post", "json", function (datos) {
            if (datos != null && Object.keys(datos).length > 0) {
                var count = 0;
                Object.keys(datos).forEach(instalacion => {
                    // Si no existe lo añadimos
                    if (self._temporal[instalacion] == undefined) {
                        self._temporal[instalacion] = datos[instalacion];
                        var porcentaje = datos[instalacion].progress.split("/");
                        porcentaje = (100 / porcentaje[1] * porcentaje[0]).toFixed(2);
                        // En la ultima etapa le daremos un aspecto de que está a punto de acabar
                        if (porcentaje == 100)
                            porcentaje = 95;
                        $(".notify-content").append(`<div id="install-${instalacion}">
                        <div class="row m-0 position-relative">
                            <div class="col-sm-12 h5">${instalacion}<br><span class="frame-info badge badge-warning"><i class="fa fa-puzzle-piece"></i> ${datos[instalacion].frame}</span></div>
                            <div class="col-sm-3">${datos[instalacion].progress}</div>
                            <div class="col-sm-9">${datos[instalacion].name}</div>
                            <div class="position-absolute h-100 progress-bar" style="width: ${porcentaje}%;">
                            </div>
                            <button class="btn btn-danger btn-sm position-absolute cancelInstall" data-install="${instalacion}" ><i class="fa fa-times"></i></button>
                        </div>
                    </div>`);

                        $(`.cancelInstall[data-install="${instalacion}"]`).click(function () {
                            sessionStorage.setItem(instalacion, "cancel");
                            // Mensaje de error
                            var errorMSG = `Error grave al cancelar la instalación.<br>Sigue estos pasos para evitar futuros errores:
                                <ul>
                                    <li>Compruebe que el proceso <strong>Php.exe</strong> no está activo</li>
                                    <li>Revise que el archivo "assets/includes/installing/${datos[instalacion].name}_status.json" ha sido eliminado, en caso contrario, <strong>elimínelo</strong>.</li>
                                    <li>Revise que se ha eliminado la carpeta "projects/${datos[instalacion].name}", en caso contrario, <strong>elimínelo</strong>.</li>
                                </ul>`;
                            // Enviamos el proceso de cancelación
                            self.ajax("assets/includes/class/runCode.php", {
                                "cancelInstall": instalacion
                            }, "post", "json", function (datos) {
                                var mensaje = datos ? `Instalación cancelada` : errorMSG;
                                var color = datos ? "success" : "danger";
                                var icon = datos ? "times" : "exclamation-triangle";
                                self.alerta(icon, instalacion, mensaje, color, false);
                                if (datos) $(`#install-${instalacion}`).remove();
                                delete self._temporal[instalacion];
                            }, function (datos) { // Mensaje de error
                                self.alerta("exclamation-triangle", "Error", errorMSG, "danger", false);
                            });
                        });
                    } else if (self._temporal[instalacion].progress != datos[instalacion].progress) {
                        // Si detecta cambios en el progreso, actualizamos
                        self._temporal[instalacion].progress = datos[instalacion].progress;
                        var porcentaje = datos[instalacion].progress.split("/");
                        porcentaje = (100 / porcentaje[1] * porcentaje[0]).toFixed(2);
                        if (porcentaje == 100)
                            porcentaje = 95;

                        var parent = $(`#install-${instalacion}`);
                        parent.find(".col-sm-3").html(datos[instalacion].progress);
                        parent.find(".col-sm-9").html(datos[instalacion].name);
                        parent.find(".progress-bar").css("width", porcentaje + "%");
                    } else if (datos[instalacion].cancel) {
                        // Si cancelamos la instalación
                        var parent = $(`#install-${instalacion}`);
                        parent.find(".col-sm-9").html("Cancelando...");
                        parent.find(".col-sm-3").html();
                        parent.find(".progress-bar").css("width", "100%");
                        self._temporal[instalacion].cancel = true;
                    }
                    count++;
                });

                if (count > 0 && $(".installing").html() != count)
                    $(".installing").html(count);
                $(".notify").addClass("visible");
            } else {
                $(".notify").removeClass("visible");
                $(".notify-card.show").removeClass("show");
            }

            // Buscamos si se ha terminado alguna instalación
            if (self._temporal != null)
                Object.keys(self._temporal).forEach(temporal => {
                    if (datos && datos[temporal] == undefined) {
                        $(`#install-${temporal}`).remove();
                        if (sessionStorage.getItem(temporal) == null) {
                            self.alerta("info", temporal, "Instalación terminada", "success", false);
                            self.listProject();
                        } else {
                            sessionStorage.removeItem(temporal);
                        }
                        delete self._temporal[temporal];
                    }
                });
        }, function () {
            clearInterval(self._notify);
            console.error("Se ha perdido la conexión");
        });
    }

    /**
     * Extrae parte de la cedena
     * 
     * @param {String} cadena Cadena de caracteres
     * @param {RegExp} extraer Expresión regular
     * @return {Object} Coincidencias
     */
    extraer(cadena, extraer) {
        return cadena.match(extraer);
    }

    /**
     * Ejecuta los comandos dependiendo del input
     * 
     * @param {JSON} data Datos del framework
     * @param {String} nombre Nombre del framework
     */
    doCommands(data, nombre) {
        var forms = data.forms ? JSON.parse(atob(data.forms)) : null;
        var comandos = data.commands ? data.commands : null;
        var install = data.installCommand;

        var self = this;

        /**
         * Ejecuta los comandos
         */
        function exec() {
            /**
             * Seleccionamos los comandos para ejecutar
             */
            var selectedCommands = {};

            /**
             * 
             */
            var commandsToDo = {};

            /**
             * Guardado temporal de los valores de los inputs
             */
            var tempValues = {};

            commandsToDo.framework = nombre;

            var nombreProyecto = $("#name-project").val();

            if (nombreProyecto != null && nombreProyecto.trim().length > 0) {

                install = install.replace(new RegExp("\\$name", "gm"), `"${nombreProyecto}"`);

                // Comando de instalación
                commandsToDo.install = install;

                // Acceso a la carpeta
                commandsToDo.root = "/" + nombreProyecto;

                commandsToDo.comandos = {};

                // Leemos cada formulario, si está rellenado, obtenemos su comando
                if (forms != null)
                    Object.assign(forms).forEach(element => {
                        var nombre = element.name
                        var elem = $("#" + nombre);
                        var pushCommand = false;
                        var value = null;
                        var label = element.label;
                        switch (element.type) {
                            case "checkbox-group":
                                if ($(`#${nombre}-0`).is(':checked')) {
                                    pushCommand = true;
                                    value = $(`#${nombre}-0`).val();
                                    label = element.values[0].label;
                                }
                                break;
                            case "radio-group":
                                var val = $(`input[name='${nombre}']:checked`).val();
                                if (val != null && val.trim() != "") {
                                    pushCommand = true;
                                    value = val;
                                }
                                break;
                            default:
                                if (elem.val() != null && elem.val().trim() != "") {
                                    pushCommand = true;
                                    value = elem.val();
                                }
                                break;
                        }

                        if (value == null) value = "";

                        tempValues[nombre] = value;

                        if (pushCommand)
                            selectedCommands[element.cmd] = label + "[@]" + value;
                    });

                if (comandos != null){
                    const pattern = /(?:\%([^\s"']+))/g;
                    // Recorremos cada comando por orden y guardamos aquellos que vamos a usar
                    Object.assign(comandos).forEach(command => {
                        if (selectedCommands[command.DT_RowId]) {
                            let comandSelected = selectedCommands[command.DT_RowId].split("[@]");

                            let comando = command.comando;
                            let inputValue = self.extraer(comando, pattern);

                            if (pattern.test(comando) && inputValue.length > 0){
                                inputValue.map(function(x){ 
                                    switch (x) {
                                        case '%this':
                                            comando = comando.replace(new RegExp(/%this/g), comandSelected[1]);
                                            break;
                                        default:
                                            comando = comando.replace(x, tempValues[x.split('%')[1]]);
                                    }
                                 });
                            }
                                 
                            commandsToDo.comandos[comandSelected[0]] = comando;
                        }
                    });
                }

                const datos = {
                    'commands': commandsToDo
                };

                // Enviamos los comandos a ejecutar
                self.ajax('assets/includes/class/runCode.php', datos, 'post', 'json', null);

                $(".modal-body").html(`<div class="w-100 text-center p-4">Iniciando <i class="fa fa-spinner fa-spin"></i></div>`);
                $(".modal-footer .btn").hide();

            } else {
                $(".modal-body").html('<div class="alert alert-danger text-center"><i class="fa fa-exclamation-triangle"></i> ¡No se ha podido obtener el nombre del proyecto!</div>');
            }

        }

        return exec;
    }

    /**
     * Elimina un elemento del array
     * 
     * @param {Array} arr Array
     * @param {String} item Elemento
     */
    removeItemFromArr ( arr, item ) {
        var i = arr.indexOf( item );
     
        if ( i !== -1 ) {
            arr.splice( i, 1 );
        }
    }

    /**
     * Establece el render del form
     * 
     * @param {String} element Elmento al que se le asigna el formRender
     * @param {JSON} data Contenido del formRender
     */
    setFixedRender(element, data) {
        if (data != null) {
            var self = this;
            var forms = JSON.parse(atob(data));

            /**
             * Checkea con js los patrones
             * 
             * @param {DOM} elm Elemento del DOM
             * @param {String} pattern Patrón
             * @param {String} msg Mensaje del patrón
             */
            function checkJS(elm, pattern, msg) {
                // Comprobar contenido
                self.waitUntilElement(`.rendered-form [name="${elm}"]`, function () {
                    if (msg != undefined && msg != "")
                        $(`.rendered-form [name="${elm}"]`).after(`<div class="feedback-${elm} invalid-feedback">${msg}</div>`);

                    $(`.rendered-form [name="${elm}"]`).bind("change keyup", function () {
                        var el = $(this);
                        if (el.val().trim().length > 0 && pattern != undefined && pattern != "" && !new RegExp(pattern).test(el.val())) {
                            el.removeClass("is-valid");
                            el.addClass("is-invalid");
                            $(`.feedback-${elm}`).show();
                        } else {
                            el.removeClass("is-invalid");
                            el.addClass("is-valid");
                            $(`.feedback-${elm}`).hide();
                        }

                        if (el.val().trim().length == 0)
                            el.removeClass("is-invalid").removeClass("is-valid");

                    });
                });
            }

            Object.assign(forms).forEach(element => {
                if (!element.multiple)
                    delete element.multiple;
                // Arreglamos el error del salto de linea
                element.label = element.label.replace("<br>", "");

                checkJS(element.name, element.pattern, element.patternInfo);

                delete element.pattern;
                delete element.patternInfo;

            });

            $(element).formRender({
                formData: forms
            });
        }
    }

    /**
     * Busca un proyecto en la lista de proyectos
     * @param {String} buscar nombre del proyecto
     */
    searchProject(buscar = "") {
        if (buscar != "") {
            $(".project").addClass("d-none");
            $(`.project[data-name*="${buscar.toUpperCase()}"]`).removeClass("d-none");
            if ($(".project").toArray().length == $(".project.d-none").toArray().length) {
                if ($("#projectlist .alert").length == 0)
                    $("#projectlist").append(`<div class="alert alert-info w-100 mx-3 text-center">No se han encontrado proyectos</div>`);
            } else {
                $("#projectlist .alert").remove();
            }
        } else
            $(".project").removeClass("d-none");
        if ($("#projectlist .alert").length == 0)
            $("#projectlist .alert").remove();
    }

    /**
     * Lista los proyectos
     * @private
     */
    listProject() {
        var self = this;
        this.ajax('common', {
            "api": "projectList"
        }, undefined, undefined, function (data) {
            $("#projectlist").html(data);
            $('[data-toggle="tooltip"]').tooltip();
            self.vistaPrevia();
        }, function () {
            $("#projectlist").html(`<div class="alert alert-danger w-100 text-center mx-2">
            Se ha producido un error al obtener los resultados.<br>
            <span class="text-muted">Error: #search_01</span>
            </div>`);
        });
    }

    /**
     * Muestra una alerta usando toast
     * 
     * @param {String} icon Icono de la alerta
     * @param {String} title Título de la alerta
     * @param {String} mensaje Mensaje de la alerta
     * @param {String} color Color del texto
     */
    alerta(icon, title, mensaje, color = null, autohide = true) {
        // Si no estamos en la web avisará mediante notificaciones push
        if (!document.hasFocus()) {
            Push.create(title, {
                body: mensaje,
                timeout: 4000,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });
        } else {
            var midiv = document.createElement("div");

            /**
             * Función local del método alerta.
             * 
             * Añade una lista de atributos
             * 
             * @param {Element} el Elemento al que se va a añadir los atributos
             * @param {JSON} attrs Lista de atributos
             */
            function setAttributes(el, attrs) {
                for (var key in attrs) {
                    el.setAttribute(key, attrs[key]);
                }
            }

            var textColor = color == null ? "" : " text-" + color;
            var atributos = {
                "class": "toast ml-auto ",
                "data-delay": "4000",
                "role": "alert",
                "aria-live": "assertive",
                "aria-atomic": "true"
            }
            if (!autohide)
                atributos["data-autohide"] = false;
            setAttributes(midiv, atributos);

            midiv.insertAdjacentHTML('beforeend',
                `<div class="toast-header${textColor}">
                <i class="fa fa-${icon} mr-2"></i>
                <strong class="mr-auto">${title}</strong>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                ${mensaje}
            </div>`
            );
            document.getElementById("alertas").appendChild(midiv);
            // Eliminamos todos los que estén ocultos
            $(".toast.hide").remove();

            $(".toast").toast('show');

            // Borramos los posibles eventos del boton
            // Eliminamos el div una vez se cierre
            $(".toast button").off().click(function () {
                $($(this).parent()).parent().remove();
            });
        }
    }

    /**
     * Rellena el modal
     * @param {String} titulo Título del modal
     * @param {String} mensaje Mensaje del modal
     * @param {String} boton Botón del modal
     * @param {Function} callback Función a ejecutar cuando se le da a aceptar
     * @param {Function} cancel Función a ejecutar cuando se le da a cancelar
     * @param {Boolean} autoOpen Establece si se debe abrir el modal cuando se llama a éste método
     * @param {Boolean} closeOnBtn Establece si debe cerrar el modal al hacer click en el botón de llamada al callback
     */
    modal(titulo, mensaje, boton = null, callback = null, cancel = null, autoOpen = false, closeOnBtn = true) {
        if ((titulo + mensaje + callback + boton).trim() != "") {
            if (autoOpen)
                $("#modal").modal("show");

            $(".modal-footer .btn").show();

            $("#modal .modal-title").html(titulo);
            $("#modal .modal-body").html(mensaje);

            if ($("#modal").find("[autofocus]").length > 0) {
                $("#modal").off().on('shown.bs.modal', function () {
                    $(this).find("[autofocus]").focus();
                });
            }
            var aceptar = $("#modal .btn-success");
            if (boton != null) {
                aceptar.html(boton);
            } else {
                aceptar.hide();
            }

            if (cancel != null) {
                $("#modal").off();
                $("#modal .btn-danger").off().click(function () {
                    cancel();
                    $(this).off();
                });
            }

            // Borramos eventos antiguos y asignamos
            aceptar.off().click(function () {
                if (callback != null)
                    callback();
                if (closeOnBtn)
                    $("#modal").modal("toggle");
            });
        }

    }

    /**
     * Arragla una dirección debido al error producido por las urls amigables que cambian la ruta relativa /
     * 
     * @param {String} url Dirección 
     * @return {String} Url modificada
     */
    fixRoot(url) {
        var count = 0;
        var path = this._fixedPath;
        do {
            if (count == 1)
                path = "../";
            try {
                var http = new XMLHttpRequest();
                http.open("HEAD", path + url, false);
                http.send();
                var estatus = http.status == 404
                if (estatus)
                    path = "../" + path
            } catch (error) {
                estatus = false;
            }

            count++;
        } while (estatus && count < this._maxSlash);

        this._fixedPath = path;

        return path + url;
    }

    /**
     * Establece una consulta ajax
     * @param {String} url Donde se van a enviar y recibir datos
     * @param {JSON} data Datos enviados
     * @param {String} type Método de envío
     * @param {String} dataType Tipo de datos recibidos
     * @param {Function} success Ejecutar en caso de éxito
     * @param {Function} error Ejecutar en caso de error
     */
    ajax(url = "common", data = null, type = 'post', dataType = 'json', success = null, error = null) {

        // Area de intercambio de información común
        if (url == "common")
            url = 'assets/includes/class/ajax_connect.php';

        url = this.fixRoot(url);

        var config = {
            url: url,
            dataType: dataType,
            success: function (datos) {
                if (success != null)
                    success(datos);
            },
            error: function (data) {
                if (error != null)
                    error(data);
            }
        }

        if (data != null)
            config.data = data;
        if (type != null)
            config.type = type;

        $.ajax(config);
    }

    /**
     * Función que cambia la primera letra a mayúscula 
     * 
     * @param {String} s String a cambiar la primera letra a mayúscula
     * @return {String} Con la primera letra en mayúscula
     */
    ucFirst(s) {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    /**
     * Espera hastas que el elemento esté disponible para ejecutar la función
     * 
     * @param {String} element Elemento al que debemos esperar
     * @param {Function} success Función a ejecutar en caso de éxito
     * @param {Function} error Función a ejecutar en caso de error
     * @param {Number} count Indica el máximo número de veces a comprobar el elemento
     * @param {Number} interval Intervalo de tiempo entre comprobación y comprobación en ms
     */
    waitUntilElement(element, success, error, count = 300, interval = 20) {
        var self = this;
        if ($(element).length > 0) {
            success();
            return;
        } // The call back isn't ready. We need to wait for it 
        setTimeout(function () {
            if (!count) {
                // We have run out of retries 
                if (error !== undefined) {
                    error();
                }
            } else { // Try again 
                self.waitUntilElement(element, success, error, count - 1, interval);
            }
        }, interval);
    }

    /**
     * Cambia el iframe por una captura de éste
     */
    vistaPrevia() {

        $("[data-name=\"UNKNOWN INFO\"] .preview-img").remove();
        var div = document.createElement('div');
        $("[data-name=\"UNKNOWN INFO\"] .thumbnail").append(div);
        $("[data-name=\"UNKNOWN INFO\"] .thumbnail div").addClass("uknown-project");

        $("#buscarProyecto").attr("readonly", "readonly");

        $(".preview-img").on("load", function () {
            var iframe = $(this);
            var parent = $(this).parent();
            // "thumbnail-container"
            setTimeout(function () {
                html2canvas(iframe.contents().find('body')[0], {
                    logging: true,
                    allowTaint: true,
                }).then(function (canvas) {
                    var data = canvas.toDataURL();
                    var div = document.createElement('div');
                    parent.append(div);
                    parent.find("div").css({
                        "background": `url(${data})`,
                        "background-color": "#fff",
                        "background-size": "100% 100%"
                    });
                    iframe.remove();
                    if ($(".thumbnail").toArray().length == $(".thumbnail > div").toArray().length)
                        $("#buscarProyecto").removeAttr("readonly");
                });
            }, 300);
        });
    }

    /**
     * Actualiza el atributo
     */
    listaFrameworksIntermediate() {
        this._listFrameworks = [];

        var datos = {
            "api": "listFrameworks"
        }
        var self = this;
        this.ajax('common', datos, 'post', 'json', function (datos) {
            self._listFrameworks = datos.length > 0 ? datos : false;
        }, function () {
            self.alerta("exclamation-triangle", "Error", "Error al obtener la lista de frameworks", "danger", false);
        });
    }

    /**
     * Obtiene la lista de frameworks y ejecuta el callBack cuando los datos están listos
     * 
     * @param {Boolean} actualizar Indica si se debe actualizar
     * @param {Function} CallBack ejecuta la función cuando se recibe la lista
     */
    getFrameList(actualizar = false, callBack) {
        if (callBack != null) {
            var self = this;
            // Actualizamos la lista
            if (actualizar)
                self.listaFrameworksIntermediate();
            var lista = this._listFrameworks;
            if (lista.length > 0 || !lista)
                callBack(lista);
            else
                setTimeout(function () {
                    self.getFrameList(false, callBack);
                }, 300);
        } else {
            self.alerta("exclamation-triangle", "Error", "Es necesario tener una función callBack: interfaz::getFrameList", "danger", false);
        }
    }
}