import {
    Frameworks
} from './frameworks.js';

$('[data-toggle="tooltip"]').tooltip();

/**
 * Controla la lista de los proyectos
 */
var Proyects = (function () {
    function Proyects() {
        var self = this;
        // Si existe el div concreto, se carga automaticamente
        if ($("#proyect-list").length > 0) {
            this._listProyect();
            $("#buscarProyecto").bind("keyup change", function () {
                self._listProyect($(this).val());
            });
        }
    }

    /**
     * Lista los proyectos
     * @private
     */
    Proyects.prototype._listProyect = function (buscar = null) {
        $.ajax({
            url: 'assets/includes/class/ajax_connect.php',
            data: {
                "search": buscar,
                "api": "proyectList"
            },
            type: "POST",
            dataType: "json",
            // Si se produce correctamente
            success: function (data) {
                $("#proyect-list").html(data);
            },
            // Si la petición falla
            error: function (xhr, estado, error_producido) {
                console.log("Error producido: " + error_producido);
                console.log("Estado: " + estado);
                $("#proyect-list").html(`<div class="alert alert-danger w-100 text-center mx-2">
                Se ha producido un error al obtener los resultados.<br>
                <span class="text-muted">Error: #search_01</span>
                </div>`);
            },
            //Tanto si falla como si funciona
            complete: function (xhr, estado) {}

        });
    };

    return Proyects;
}());

new Proyects;