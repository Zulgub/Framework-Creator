/**
 * Clase interface
 * 
 * Esta clase contiene módulos globales a usar en todas las páginas, modals, alertas, consulta AJAX...
 */
export class Interface {

    constructor(loadModules = true) {
        this.listaFrameworksIntermediate();


        /**
         * Resguardo de notificaciones para ver si hay cambios
         */
        this._temporal = {};
        if (loadModules)
            this.loadModules();
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
            $("#buscarProyecto").bind("keyup change", function () {
                self.listProject($(this).val());
            });
        }

        $(".newProject").click(function () {
            self.getFrameList(true, function (list) {
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

                        self.ajax("./assets/includes/class/runCode.php", {
                            requirements: selected
                        }, "post", "json", function (datos) {
                            if (datos === true && $(".modal.show").length > 0) {
                                self.modal(`Nuevo proyecto - ${selected}`, "", `Crear`, function () {
                                    /**
                                     * Lista negra de nombre de carpetas en linux y windows
                                     * Primera parte - Comprueba que el nombre no sea así
                                     * Segunda parte - Comprueba que no exista esos caracteres en el nombre
                                     * Tercera parte - Comprueba que no termina en punto o espacio
                                     */
                                    var blackList = /^(?!(CON|PRN|AUX|CLOCK|NUL|[A-Z]\:|COM[1-9]|LPT[1-9])$)(?!.*[\<\>\:\"\/\\\|\?\*])(?!^.*[\.\s]+$)/gi;
                                    var nombre = $("#name-project");
                                    if (nombre.val().length > 0)
                                        self.ajax("common", {
                                            "api": "listProjects"
                                        }, "post", "json", function (datos) {
                                            datos = datos.map(function (x) {
                                                return x.toUpperCase()
                                            });
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
                                            console.error("Error al comprobar si existe un proyecto con ese nombre");
                                        });
                                    else {
                                        $("#invalid-project-name").show();
                                        nombre.focus();
                                    }
                                }, null, false, false);

                                self.ajax(`./assets/includes/vistas/config/frameworks/${self.ucFirst(selected)}.json`, null, null, undefined, function (datos) {
                                    if (datos.forms && datos.commands) {
                                        self.waitUntilElement(".modal-body", function () {
                                            self._comands = self.doCommands(datos, self.ucFirst(selected));
                                            self.setFixedRender(".modal-body", datos);
                                            $(".modal-body").prepend('<label class="form-label row px-4">Nombre del proyecto: <input type="text" id="name-project" class="form-control" placeholder="Introduce un nombre para el proyecto"></input><div class="invalid-feedback" id="invalid-project-name">Instroduce un nombre</div></label>');
                                        }, function () {
                                            console.error("#Error formRender_01");
                                        });
                                    } else {
                                        $(".modal-body").html('<div class="alert alert-danger text-center"><i class="fa fa-exclamation-triangle"></i> Error: <strong>No se ha encontrado formulario para este framework.</strong></div>');
                                    }
                                }, function () {
                                    console.error("Ha ocurrido un error al obtener los datos del framework");
                                });
                            } else {
                                $(".modal-body").html(`<div class="alert alert-danger">Para que este framework funcione se require lo siguiente:
                                <ul>${datos}</ul></div>`);
                            }
                        }, function (datos) {
                            console.error("Error al comprobar los requisitos");
                        });

                    } else
                        parent.find(".invalid-feedback").show();

                }, null, false, false);
            });
        });

        setInterval(function () {
            self.actualizarNotificaciones();
        }, 600);

        $(".cancelAll").click(function () {

            // Indicamos la cancelación de todo
            Object.keys(self._temporal).forEach(temp => {
                sessionStorage.setItem(temp, "cancel");
            });

            var errorMSG = `Se ha detectado un posible error al borrar los archivos de instalación, compruebe manualmente si quedan archivos residuales en "/projects"`;

            self.ajax("common", {
                "api": "cancelAll"
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
                        $(".drop-content").append(`<li id="install-${instalacion}">
                        <div class="row pb-1 m-0 position-relative">
                            <div class="col-sm-12 h5">${instalacion}</div>
                            <div class="col-sm-3">${datos[instalacion].progress}</div>
                            <div class="col-sm-9">${datos[instalacion].name}</div>
                            <progress class="position-absolute w-100 h-100" value="${porcentaje}" max="100">
                            </progress>
                            <button class="btn btn-danger btn-sm position-absolute cancelInstall" data-install="${instalacion}" ><i class="fa fa-times"></i></button>
                        </div>
                    </li>`);

                        $(`.cancelInstall[data-install="${instalacion}"]`).click(function () {
                            sessionStorage.setItem(instalacion, "cancel");
                            // Mensaje de error
                            var errorMSG = `Error grave al cancelar la instalación.<br>Sigue estos pasos para evitar futuros errores:
                                <ul>
                                    <li>Compruebe que el proceso <strong>Php.exe</strong> no está activo</li>
                                    <li>Revise que el archivo "assets/includes/installing/${name}_status.json" ha sido eliminado, en caso contrario, <strong>elimínelo</strong>.</li>
                                    <li>Revise que se ha eliminado la carpeta "projects/${name}", en caso contrario, <strong>elimínelo</strong>.</li>
                                </ul>`;
                            // Enviamos el proceso de cancelación
                            self.ajax("common", {
                                "api": "cancelInstall",
                                "name": instalacion
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
                        parent.find("progress").val(porcentaje);
                    } else if (datos[instalacion].cancel) {
                        // Si cancelamos la instalación
                        var parent = $(`#install-${instalacion}`);
                        parent.find(".col-sm-9").html("Cancelando...");
                        parent.find(".col-sm-3").html();
                        parent.find("progress").val(100);
                        self._temporal[instalacion].cancel = true;
                    }
                    count++;
                });

                if (count > 0 && $(".installing").html() != count)
                    $(".installing").html(count);
                $(".notify").addClass("visible");
            } else {
                $(".notify").removeClass("visible");
                $(".notify-drop.show").removeClass("show");
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
        });
    }

    /**
     * Ejecuta los comandos dependiendo del input
     * 
     * @param {JSON} data Datos del framework
     * @param {String} nombre Nombre del framework
     */
    doCommands(data, nombre) {
        var forms = JSON.parse(atob(data.forms));
        var comandos = data.commands
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
                        selectedCommands[element.shape] = label + "[@]" + value;
                });

                /**
                 * Extrae parte de la cedena
                 * 
                 * @param {String} cadena Cadena de caracteres
                 * @param {RegExp} extraer Expresión regular
                 */
                function extraer(cadena, extraer) {
                    return cadena.match(extraer);
                }

                // Recorremos cada comando por orden y guardamos aquellos que vamos a usar
                Object.assign(comandos).forEach(command => {
                    if (selectedCommands[command.DT_RowId]) {
                        var comandSelected = selectedCommands[command.DT_RowId].split("[@]");

                        var comando = command.comando;
                        var inputValue = extraer(comando, /%\w+/g);

                        if (inputValue != null)
                            switch (inputValue[0]) {
                                case '%this':
                                    comando = comando.replace(new RegExp(/%this/g), comandSelected[1]);
                                    break;
                                default:
                                    comando = comando.replace(new RegExp(/%\w+/g), tempValues[inputValue[0].split('%')[1]]);
                            }
                        commandsToDo.comandos[comandSelected[0]] = comando;
                    }
                });

                var datos = {
                    'commands': commandsToDo
                };

                // Enviamos los comandos a ejecutar
                self.ajax('./assets/includes/class/runCode.php', datos, 'post', 'json', null);

                $(".modal-body").html(`<div class="w-100 text-center p-4">Iniciando <i class="fa fa-spinner fa-spin"></i></div>`);
                $(".modal-footer .btn").hide();

            } else {
                $(".modal-body").html('<div class="alert alert-danger text-center"><i class="fa fa-exclamation-triangle"></i> ¡No se ha podido obtener el nombre del proyecto!</div>');
            }

        }

        return exec;
    }

    /**
     * Establece el render del form
     * 
     * @param {String} element Elmento al que se le asigna el formRender
     * @param {JSON} data Contenido del formRender
     */
    setFixedRender(element, data) {
        var forms = JSON.parse(atob(data.forms));

        Object.assign(forms).forEach(element => {
            if (!element.multiple)
                delete element.multiple;
        });

        $(element).formRender({
            formData: forms
        });

        console.clear();
    }

    /**
     * Lista los proyectos
     * @private
     */
    listProject(buscar = null) {

        this.ajax('common', {
            "search": buscar,
            "api": "projectList"
        }, undefined, undefined, function (data) {
            $("#projectlist").html(data);
            $('[data-toggle="tooltip"]').tooltip();
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
                "class": "toast ",
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
            $(".toast button").off();

            // Eliminamos el div una vez se cierre
            $(".toast button").click(function () {
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
                $("#modal").off();
                $("#modal").on('shown.bs.modal', function () {
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
                $("#modal .btn-danger").off();
                $("#modal .btn-danger").click(function () {
                    cancel();
                    $(this).off();
                });
            }

            // Borramos eventos antiguos
            aceptar.off();
            aceptar.click(function () {
                if (callback != null)
                    callback();
                if (closeOnBtn)
                    $("#modal").modal("toggle");
            });
        }

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
    ajax(url = "common", data = null, type = 'post', dataType = 'json', success, error = null) {

        // Area de intercambio de información común
        if (url == "common")
            url = './assets/includes/class/ajax_connect.php';

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
     * Actualiza el atributo
     */
    listaFrameworksIntermediate() {
        this._listFrameworks = [];

        var datos = {
            "api": "listFrameworks"
        }
        var self = this;
        this.ajax('common', datos, 'post', 'json', function (datos) {
            self._listFrameworks = datos;
        }, function () {
            console.error("Error al obtener la lista de frameworks");
        });
    }

    /**
     * Obtiene la lista de frameworks y ejecuta el callBack cuando los datos están listos
     * @param {Function} CallBack ejecuta la función cuando se recibe la lista
     * @return {Array} Lista de frameworks
     */
    getFrameList(actualizar = false, callBack) {
        if (callBack != null) {
            var self = this;
            // Actualizamos la lista
            if (actualizar)
                self.listaFrameworksIntermediate();
            var lista = this._listFrameworks;
            if (lista.length > 0)
                callBack(lista);
            else
                setTimeout(function () {
                    self.getFrameList(false, callBack);
                }, 300);
        } else {
            console.error("Es necesario tener una función callBack");
        }
    }
}