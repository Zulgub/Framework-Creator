/**
 * Controla los frameworks
 */
export class Frameworks {
    constructor() {
        this.loadSchema();
        this.saveFramework();
        this.asignarFunciones();

        /**
         * Lista de los esquemas de los frameworks
         * */
        this._schema = [];

        /**
         * Editor actual
         */
        this._editor = null;
    }

    /**
     * Borra la configuración del framework
     */
    deleteFramework() {

    }

    /**
     * Encuentra el elemento de configuración
     * 
     * @param {String} framework nombre del framework
     * @param {String} name nombre del elemento
     * @return {Integer, String} valor del elemento
     */
    findElementConfig(framework, name) {
        return $("#" + framework).find("#" + name + "-" + framework).val()
    }

    /**
     * Guarda el framework
     */
    saveFramework() {
        // comprobar antes de guardar que en json tenga nombre, requisitos, comandos y formularios
        let thisClass = this;

        $("form[data-json]").submit(function (event) {
            event.preventDefault();
        });


        $("button[data-save]").click(function () {
            let jsonschema = {};

            var framework = $(this).data("save");

            jsonschema.name = thisClass.findElementConfig(framework, "name");

            jsonschema.required = thisClass.findElementConfig(framework, "requisitos").split(", ");

            jsonschema.forms = thisClass._editor[framework].actions.getData();

            console.log(jsonschema);


            var datos = {
                "data": jsonschema,
                "nameFile": $(this).data("file-name"),
                "api": "saveFile"
            }

            $.ajax({
                url: "./assets/includes/class/ajax_connect.phps",
                data: datos,
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if (data == 1) {
                        thisClass.alerta("save", "Guardado", "Archivo guardado", "success");
                    } else
                        thisClass.alerta("exclamation-triangle", "Error", "Se ha producido un error al guardar", "danger");
                },
                error: function (data) {
                    console.log("Error:" + data);
                    thisClass.alerta("exclamation-triangle", "Error", "Se ha producido un error al guardar", "danger");
                }
            });
        });
    }

    /**
     * Crea un nuevo framework
     */
    createFramework() {

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
            "data-autohide": "false",
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
     */
    modal(titulo, mensaje, boton, callback) {
        if (trim(titulo + mensaje + callbak + boton) != "") {
            $("#modal .modal-title").html(titulo);
            $("#modal .modal-body").html(mensaje);
            var aceptar = $("#modal .btn-success");
            aceptar.html(boton);

            // Borramos eventos antiguos
            aceptar.off();
            aceptar.click(function () {
                callback;
                $("#modal").modal("toggle");
            });
        }
    }

    /**
     * Asigna las funciones de los botones
     */
    asignarFunciones() {
        var self = this;
        $(".list-group a").click(function () {
            self.createFormEditor($(this).html());
        });
    }

    /**
     * Carga un archivo de configuración
     */
    loadConfigFile() {

    }

    /**
     * Crea el editor de formularios
     * (No se puede tener más de un editor por página, hay que crearlo y destruirlo)
     * @param {String} name Nombre del framework
     */
    createFormEditor(name) {
        var self = this;
        if (this._editor && this._editor.actions.getData() != null) {
            this._schema[name] = this._editor[name].actions.getData();
        }
        var options = {
            disabledActionButtons: ['data', 'save', 'clear'],
            stickyControls: {
                enable: true
            },
            scrollToFieldOnAdd: false
        };
        this._editor[name] = $("#" + name + " .json-editor-form").formBuilder(options);
        if (this._schema[name])
            setTimeout(function () {
                self._editor[name].actions.setData(self._schema[name]);
            }, 500);
    }

    /**
     * Carga los esquemas de los formularios
     */
    loadSchema() {
        var thisClass = this;
        $(".json-editor-form").each(function () {
            var self = this;
            $.ajax({
                url: "./assets/includes/vistas/config/frameworks/" + $(this).data("json"),
                dataType: 'json',
                success: function (datos) {
                    if (datos.forms) {
                        thisClass._schema[datos.name] = datos.forms;
                    }
                },
                error: function () {
                    $(self).html(`<div class="alert alert-danger w-100 text-center mx-2">
                    Se ha producido un error al obtener los resultados.<br>
                    <span class="text-muted">Error: #loadSchema_01</span>
                    </div>`);
                }
            });
        });
    }
}

new Frameworks;

$(".json-editor-form").each(function () {
    var self = this;
    $.ajax({
        url: "./assets/includes/vistas/config/frameworks/" + $(this).data("json"),
        dataType: 'json',
        success: function (datos) {
            if (datos.forms) {
                thisClass._schema[datos.name] = datos.forms;
            }
        },
        error: function () {
            $(self).html(`<div class="alert alert-danger w-100 text-center mx-2">
            Se ha producido un error al obtener los resultados.<br>
            <span class="text-muted">Error: #loadSchema_01</span>
            </div>`);
        }
    });
});