import {
    Interface
} from './interface.js';
import {
    Frameworks
} from './frameworks.js';

import {
    Setting
} from './setting.js';

var interfaz = new Interface;

// Evitamos que el dropdown se oculte al hacer clic sobre los switchs
$(document).on('click', '.notify-card', function (e) {
    e.stopPropagation();
});

if ($('#sidebarCollapse').length > 0) {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('[data-toggle="tooltip"]').tooltip();
}

$('[data-toggle="tooltip"]').tooltip();

// Ejecuta los comandos de la configuración
if ($(".quickContent").length > 0) {
    var projectName = $(".delProject").data("project");
    var framework = $("[data-original-title=\"Framework\"]").html().replace('<i class="fa fa-puzzle-piece"></i> ', '', framework);
    if (projectName != "" && framework != "")
        new Setting(projectName, framework);
}