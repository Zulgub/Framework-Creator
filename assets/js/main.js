import {
    Interface
} from './interface.js';
import {
    Frameworks
} from './frameworks.js';

var interfaz = new Interface;

/**
 * Controla la lista de los proyectos
 */
var Projects = (function () {
    function Projects() {
        var self = this;
        // Si existe el div concreto, se carga automaticamente
        if ($("#projectlist").length > 0) {
            this._listProject();
            $("#buscarProyecto").bind("keyup change", function () {
                self._listProject($(this).val());
            });
        }
    }

    /**
     * Lista los proyectos
     * @private
     */
    Projects.prototype._listProject = function (buscar = null) {

        interfaz.ajax('common', {
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
    };

    return Projects;
}());

// Evitamos que el dropdown se oculte al hacer clic sobre los switchs
$(document).on('click', '.notify-drop', function (e) {
    e.stopPropagation();
});

new Projects;