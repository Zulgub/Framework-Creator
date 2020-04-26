import {
    Interface
} from './interface.js';
import {
    Frameworks
} from './frameworks.js';

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