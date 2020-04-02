class Install {
    /**
     * Configuración de la conexión DB
     */
    _dbConfig;

    constructor() {
        // Configuración por defecto
        this._dbConfig = {
            driver: "mysql",
            host: "localhost",
            dbname: "framework_manager",
            username: "root",
            password: ""
        };

        this._dbList = {
            "Mysql": "mysql",
            "SQLite": "sqlite",
            "PostgreSQL": "postgresql"
        };

        this._adminConfig = {
            username: "",
            email: "",
            pass: ""
        };

        this.panel();
        var self = this;
        $(`.list-group-item`).click(function () {
            self.panel($(this).index() + 1);
        });
    }

    /**
     * Comprueba si loos elementos del formulario están rellenados correctamente
     * @param {Object} elemento 
     */
    comprobarFormulario(elemento) {
        var patron;
        switch (elemento.id) {
            case "adminUser":
                /**
                 * Sólo se permite los caracteres indicados
                 * Longitud entre 3 y 15 caracteres
                 */
                patron = /^[a-zA-Z_-áéíóúÁÉÍÓÚñÑçÇ]{5,15}$/;
                break;
            case "email":
                /**
                 * Fuente: https://ihateregex.io/expr/email
                 * 
                 * [^@\s\t\r\n] Todo lo que sea menos esos caracteres
                 */
                patron = /[^@\s\t\r\n]+@[^@\s\t\r\n]+\.[^@\s\t\r\n]+/;
                break;
            case "pass":
                /** 
                 * Fuente: https://ihateregex.io/expr/password
                 * 
                 * (?=.*[A-Z]) Tiene que existir al menos una letra mayúscula
                 * (?=.*?[a-z]) Tiene que existir al menos una letra minúscula
                 * (?=.*?[0-9]) Tiene que existir al menos un número
                 * (?=.*?[#?!@$%^&*-]) Debe tener al menos un caracter especial
                 * .{8,} Longitud mínima 8 caracteres
                 */
                patron = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
                break;
            case "re-pass":
                // Comprobamos que cumpla el patron y que sea igual a la introducida anteriormente
                if (elemento.value != $("#pass").val() || !
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(elemento.value)) {
                    $(elemento).addClass("is-invalid");
                    $(elemento).removeClass("is-valid");
                    $('#' + elemento.id + ' ~ .invalid-feedback').show();
                } else {
                    $(elemento).addClass("is-valid");
                    $(elemento).removeClass("is-invalid");
                    $('#' + elemento.id + ' ~ .invalid-feedback').hide();
                }
                break;
                // Sección 2
            case "driver":
                /**
                 * Verificar los posibles valores
                 */
                var valores = "";
                for (const prop in this._dbList) {
                    valores += valores == "" ? `${this._dbList[prop]}` : `|${this._dbList[prop]}`;
                }
                patron = new RegExp("(" + valores + ")");
                break;
            case "host":
                /**
                 * (([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]) - Nombre del host
                 * 
                 * (([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]) - Dirección ip
                 */
                patron = /((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))/;
                break;
        }


        if (patron && !patron.test(elemento.value)) {
            $(elemento).addClass("is-invalid");
            $(elemento).removeClass("is-valid");
            $('#' + elemento.id + ' ~ .invalid-feedback').show();
        } else if (patron) {
            $(elemento).addClass("is-valid");
            $(elemento).removeClass("is-invalid");
            $('#' + elemento.id + ' ~ .invalid-feedback').hide();
        } else if (elemento.id != "re-pass") {
            if ($(elemento).attr("required") == "required" && $(elemento).val() == "") {
                $(elemento).addClass("is-invalid");
                $(elemento).removeClass("is-valid");
            } else {
                $(elemento).addClass("is-valid");
                $(elemento).removeClass("is-invalid");
            }
        }
    }

    /**
     * Comprueba la configuración de la cuenta de administrador
     * @param {Object} elemento Elemento al que se le está haciendo focus
     */
    adminAccount(elemento = null) {
        let self = this;

        let inputData = {
            username: $("#adminUser").val(),
            email: $("#email").val(),
            pass: $("#pass").val()
        };

        if (elemento != null)
            this.comprobarFormulario(elemento.currentTarget);
        else
            $("form input, form select, form textarea").each(function () {
                if ($(this).val() != "") self.comprobarFormulario(this);
            });

        this._adminConfig = JSON.parse(JSON.stringify(inputData));



        // Si todos los campos son válidos, se desbloqueará la siguiente sección de configuración
        if ($('input.is-valid').length == $("form input").length)
            $("#dbNext").prop("disabled", false);
        else
            $("#dbNext").prop("disabled", true);

    }

    /**
     * Comprueba la conexión con la base de datos
     * @param {Object} elemento Elemento al que se le está haciendo focus
     */
    comprobar(elemento = null) {

        // Esta clase
        var self = this;

        if (elemento != null) {
            this.comprobarFormulario(elemento.currentTarget);
        } else {
            $("form input, form select, form textarea").each(function () {
                self.comprobarFormulario(this);
            });
        }

        let inputData = {
            driver: $("#driver").val(),
            host: $("#host").val(),
            dbname: $("#dbname").val(),
            username: $("#username").val(),
            password: $("#password").val()
        };

        // Obtenemos el estado de la conexión al rellenar la configuración
        if ($('.is-valid').length == $('form')[0].length) {
            $.ajax({
                url: `assets/includes/vistas/install/db_connect.php`,
                data: {
                    "config": JSON.stringify(inputData),
                },
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                // Si se produce correctamente
                success: function (data) {
                    if (data.status == 0) {
                        var estado = `<div class="alert alert-danger">No se ha podido establecer la conexión</div>`;
                        $("#dbNext").prop("disabled", true);
                    } else if (data.status == 2) {
                        var estado = `<div class="alert alert-warning">Conexión establecia, pero no se ha encontrado la base de datos.<br><strong class="text-muted">Se creará automáticamente</strong></div>`;
                        $("#dbNext").prop("disabled", false);
                    } else {
                        var estado = `<div class="alert alert-success">Conexión establecida</div>`;
                        $("#dbNext").prop("disabled", false);
                        self._dbConfig = JSON.parse(JSON.stringify(inputData));
                    }
                    $("#status").html(estado);
                    // Eliminamos posibles eventos anteriores
                    $("#create-db").off();

                    // Añadimos la función de crear la base de datos
                    $("#create-db").click(function () {
                        self.createDb();
                    });
                },
                // Si la petición falla
                error: function (xhr, estado, error_producido) {
                    $("#status").html(`<div class="alert alert-danger">Ha ocurrido un error: ${error_producido}</div>`);
                },

            });
        } else {
            $("#dbNext").prop("disabled", true);
            $("#status").html(`<div class="alert alert-danger">Rellene todos los campos correctamente</div>`);
        }
    }

    /**
     * Cambia el estado del progreso y el contenido del card
     * @param {integer} step Progreso
     */
    panel(step = 1) {

        // Esta clase
        var self = this;

        // Marcamos el progreso actual
        $(".list-group li").removeClass("active");
        $(".list-group li:nth-child(" + step + ")").removeClass("disabled");
        $(".list-group li:nth-child(" + step + ")").addClass("active");

        // Reiniciamos el estado
        $("#status").html("");

        // Cambiamos el contenido del card
        var contenido, title;
        switch (step) {
            case 1:
                title = "Conexión a la base de datos";
                // Reccorremos la lista de bases de datos
                var listaDB = "";
                for (const prop in this._dbList) {
                    var selected = this._dbConfig.driver == this._dbList[prop] ? " selected" : "";
                    listaDB += `<option value="` + this._dbList[prop] + `"` + selected + `>` + prop + `</option>`;
                }

                contenido = `<form id="dbSettings" class="needs-validation" autocomplete="off">
            <div class="form-group row">
                <label for="driver" class="col-sm-2 col-form-label">Driver</label>
                <div class="col-sm-10">
                    <select class="form-control" data-live-search="true" id="driver" required>
                        <option value="">Seleccione un motor de DB</option>
                        ` + listaDB + `
                    </select>
                    <div class="invalid-feedback">
                        Seleccione un motor de base de datos
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="host" class="col-sm-2 col-form-label">Host</label>
                <div class="col-sm-10">
                    <input type="text" required class="form-control" id="host" placeholder="Host de la base de datos" value="` + this._dbConfig.host + `">
                    <div class="invalid-feedback">
                        Indique un host válido
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="dbname" class="col-sm-2 col-form-label">Base de datos</label>
                <div class="col-sm-10">
                    <input type="text" required class="form-control" id="dbname" placeholder="Base de datos" value="` + this._dbConfig.dbname + `">
                    <div class="invalid-feedback">
                        Indique una base de datos válida
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="username" class="col-sm-2 col-form-label">Usuario</label>
                <div class="col-sm-10">
                    <input type="text" required class="form-control" id="username" placeholder="Nombre de usuario" value="` + this._dbConfig.username + `">
                    <div class="invalid-feedback">
                        Indique un usuario válido
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="password" class="col-sm-2 col-form-label">Contraseña</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="password" placeholder="Contraseña" value="` + this._dbConfig.password + `">
                </div>
            </div>
        </form>
        <div class="text-right">
            <input type="submit" class="btn btn-success prog" id="dbNext" data-step="2" value="Siguiente" disabled>
        </div>`;
                break;
            case 2:
                title = "Cuenta administrador";
                contenido = `<form id="adminSettings" class="needs-validation" autocomplete="off">
                <div class="form-group row">
                    <label for="adminUser" class="col-sm-2 col-form-label">Usuario</label>
                    <div class="col-sm-10">
                        <input type="text" required class="form-control" id="adminUser" placeholder="Nombre de usuario" pattern="^[a-zA-Z_-áéíóúÁÉÍÓÚñÑçÇ]{5,15}$" minlength="5" maxlength="15" value="` + this._adminConfig.username + `" required>
                        <div class="invalid-feedback">
                            Indique un nombre de usuario con las siguientes características;
                            <ul>
                                <li>Carácteres latinos y guiones (- y _)</li>
                                <li>Longitud entre 5 y 15 caracteres</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="dbname" class="col-sm-2 col-form-label">Email</label>
                    <div class="col-sm-10">
                        <input type="email" required class="form-control" id="email" placeholder="Email administrador" pattern="[^@\\s\\t\\r\\n]+@[^@\\s\\t\\r\\n]+\.[^@\\s\\t\\r\\n]+" value="` + this._adminConfig.email + `" required>
                        <div class="invalid-feedback">
                            Indique un email válido 
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="pass" class="col-sm-2 col-form-label">Contraseña</label>
                    <div class="col-sm-10">
                        <input type="password" required pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$" minlength="8" class="form-control" id="pass" value="` + this._adminConfig.pass + `" placeholder="Contraseña">
                        <div class="invalid-feedback">
                            Indique una contraseña con el siguiente formato:
                            <ul>
                                <li>Al menos una letra mayúscula</li>
                                <li>Al menos una letra minúscula</li>
                                <li>Al menos un número</li>
                                <li>Al menos un caracter especial (#?!@$%^&*-)</li>
                                <li>Longitud mínima 8 caracteres</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="re-pass" class="col-sm-2 col-form-label">Repite la contraseña</label>
                    <div class="col-sm-10">
                        <input type="password" required pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$" minlength="8" class="form-control" id="re-pass" value="` + this._adminConfig.pass + `" placeholder="Contraseña">
                        <div class="invalid-feedback">
                            Las contraseñas no coinciden
                        </div>
                    </div>
                </div>
            </form>
            <div class="text-right">
                <input type="button" class="btn btn-danger prog" data-step="1" value="Anterior">
                <input type="button" class="btn btn-success prog" id="dbNext" data-step="3" value="Instalar" disabled>
            </div>`;
                break;
            case 3:
                title = "Instalando...";
                contenido = `<div id="installing">Creando base de datos</div><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

                // Quitamos la posibilidad de volver atrás en la configuración
                $(".list-group li").addClass("disabled");
                $(".card-body").addClass("text-center");
                $(".list-group li:nth-child(" + step + ")").removeClass("disabled");
                break;
            case 4:
                title = "Finalizado";
                contenido = `<div class="alert alert-success">Instalación finalizada</div>`;

                // Quitamos la posibilidad de volver atrás en la configuración
                $(".list-group li").addClass("disabled");
                $(".list-group li:nth-child(" + step + ")").removeClass("disabled");
                break;
            default:
                title = "Error";
                contenido = "Error: panel on install.js";
        }

        $("#setting .card-header").html(title);
        $("#setting .card-body").html(contenido);

        // Eliminamos los posibles eventos previos
        $("form, .prog, #dbSettings input, #adminSettings input").off();

        // Evita que el formulario sea enviado
        $("form").submit(function (e) {
            e.preventDefault();
        });

        // Control sobre el progreso
        $(`.prog`).click(function () {
            self.panel($(this).data("step"));
        });

        // Funcionalidades
        $("#dbSettings input, #dbSettings select").bind("keyup change", function (e) {
            self.comprobar(e);
        });

        $("#adminSettings input,#adminSettings select").bind("keyup change", function (e) {
            self.adminAccount(e);
        });

        switch (step) {
            case 1:
                this.comprobar();
                break;
            case 2:
                this.adminAccount();
                break;

            default:
                break;
        }

    }

}

new Install;