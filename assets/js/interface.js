/**
 * Clase interface
 * 
 * Esta clase contiene módulos globales a usar en todas las páginas, modals, alertas, consulta AJAX...
 */
class Interface {

    constructor() {
        this.listaFrameworksIntermediate();

        this.loadModules();
    }

    /**
     * Carga los modulos y asigna funciones
     */
    loadModules() {
        var self = this;

        $(".newProject").click(function () {
            interfaz.getFrameList(true, function (list) {
                var select = '<select class="form-control" id="frameSelected"><option value="">Seleccione un framework</option>';
                list.forEach(op => {
                    select += `<option>${op}</option>`
                });
                self.modal("Nuevo proyecto", `<label class="form-label row p-4">Seleccione un framework: ${select}</select></label><div class="invalid-feedback">¡Debes selecionar un framework!</div>`, "Siguiente", function () {
                    var parent = $(".modal-content");
                    var selected = $("#frameSelected").val();
                    parent.find(".invalid-feedback").hide();
                    if (selected != "") {
                        self.modal(`Nuevo proyecto - ${selected}`, "", `Crear`, function () {});

                        self.ajax(`./assets/includes/vistas/config/frameworks/${self.ucFirst(selected)}.json`, null, null, undefined, function (datos) {
                            if (datos.forms) {
                                self.waitUntilElement(".modal-body", function () {
                                    self.setFixedRender(".modal-body", datos)
                                }, function () {
                                    console.error("#Error formRender_01");
                                });
                            }else{
                                $(".modal-body").html('<div class="alert alert-danger text-center"><i class="fa fa-exclamation-triangle"></i> Error: <strong>No se ha encontrado formulario para este framework.</strong></div>');
                            }
                        }, function () {
                            console.error("Ha ocurrido un error al obtener los datos del framework");
                        });

                    } else
                        parent.find(".invalid-feedback").show();

                }, false, false);
            });
        });
    }

    /**
     * Establece el render del form
     * 
     * @param {String} element Elmento al que se le asigna el formRender
     * @param {Object} data Contenido del formRender
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
    }

    /**
     * Muestra una alerta usando toast
     * 
     * @param {String} icon Icono de la alerta
     * @param {String} title Título de la alerta
     * @param {String} mensaje Mensaje de la alerta
     * @param {String} color Color del texto
     */
    alerta(icon, title, mensaje, color = null) {
        var midiv = document.createElement("div");

        /**
         * Función local del método alerta.
         * 
         * Añade una lista de atributos
         * 
         * @param {Element} el Elemento al que se va a añadir los atributos
         * @param {Object} attrs Lista de atributos
         */
        function setAttributes(el, attrs) {
            for (var key in attrs) {
                el.setAttribute(key, attrs[key]);
            }
        }

        var textColor = color == null ? "" : " text-" + color;
        setAttributes(midiv, {
            "class": "toast ",
            "data-delay": "4000",
            "role": "alert",
            "aria-live": "assertive",
            "aria-atomic": "true"
        });

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

    /**
     * Rellena el modal
     * @param {String} titulo Título del modal
     * @param {String} mensaje Mensaje del modal
     * @param {String} boton Botón del modal
     * @param {String} callback Función a ejecutar cuando se le da a aceptar
     * @param {Boolean} autoOpen Establece si se debe abrir el modal cuando se llama a éste método
     * @param {Boolean} closeOnBtn Establece si debe cerrar el modal al hacer click en el botón de llamada al callback
     */
    modal(titulo, mensaje, boton, callback = null, autoOpen = false, closeOnBtn = true) {
        if ((titulo + mensaje + callback + boton).trim() != "") {
            if (autoOpen)
                $("#modal").modal("show");

            $("#modal .modal-title").html(titulo);
            $("#modal .modal-body").html(mensaje);

            if ($("#modal").find("[autofocus]").length > 0) {
                $("#modal").off();
                $("#modal").on('shown.bs.modal', function () {
                    $(this).find("[autofocus]").focus();
                });
            }
            var aceptar = $("#modal .btn-success");
            aceptar.html(boton);

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
     * @param {Object} data Datos enviados
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
                interfaz.listaFrameworksIntermediate();
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

export var interfaz = new Interface;