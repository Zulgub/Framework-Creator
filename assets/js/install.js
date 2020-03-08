class Install {
    /**
     * Configuración de la conexión DB
     */
    _dbConfig;

    constructor() {
        this._dbConfig = {
            driver: "mysql",
            host: "localhost",
            dbname: "",
            username: "",
            password: ""
        };

        this.panel();
        var self = this;
        $('.list-group-item').click(function () {
            self.panel($(this).index() + 1);
        });
    }

    /**
     * Comprueba la conexión con la base de datos
     */
    comprobar() {

        // Esta clase
        var self = this;

        let inputData = {
            driver: $("#driver").val(),
            host: $("#host").val(),
            dbname: $("#dbname").val(),
            username: $("#username").val(),
            password: $("#password").val()
        };

        if (inputData.driver != "" && inputData.host != null && inputData.dbname != "" && inputData.username != "") {
            $.ajax({
                url: 'assets/includes/vistas/install/db_connect.php',
                data: {
                    "config": JSON.stringify(inputData),
                },
                type: "GET",
                dataType: "json",
                contentType: 'application/json',
                // Si se produce correctamente
                success: function (data) {
                    if (data.status == 0) {
                        var estado = '<div class="alert alert-danger">No se ha podido establecer la conexión</div>';
                        $("#dbNext").prop("disabled", true);
                    } else if (data.status == 2) {
                        var estado = '<div class="alert alert-warning">Conexión establecia, pero no se ha encontrado la base de datos. <button type="button" class="btn btn-success ml-4">Crear base de datos ahora</button></div>';
                        $("#dbNext").prop("disabled", true);
                    } else {
                        var estado = '<div class="alert alert-success">Conexión establecida</div>';
                        $("#dbNext").prop("disabled", false);
                        self._dbConfig = JSON.parse(JSON.stringify(inputData));
                    }
                    $("#status").html(estado);
                },
                // Si la petición falla
                error: function (xhr, estado, error_producido) {
                    console.log("Error producido: " + error_producido);
                    console.log("Estado: " + estado);
                },

            });
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
        $(".list-group li:nth-child(" + step + "").removeClass("disabled");
        $(".list-group li:nth-child(" + step + ")").addClass("active");
        // Reiniciamos el estado
        $("#status").html("");

        // Cambiamos el contenido del card
        var resultado, title;
        switch (step) {
            case 1:
                title = "Conexión a la base de datos";
                var dbList = {
                    "Mysql": "mysql",
                    "SQLite": "sqlite",
                    "PostgreSQL": "postgresql"
                };

                // Reccorremos la lista de bases de datos
                var listaDB = "";
                for (const prop in dbList) {
                    var selected = this._dbConfig.driver == dbList[prop] ? " selected" : "";
                    listaDB += '<option value="' + dbList[prop] + '"' + selected + '>' + prop + '</option>';
                }

                resultado = '<form id="dbSettings" autocomplete="off">\
            <div class="form-group row">\
                <label for="driver" class="col-sm-2 col-form-label">Driver</label>\
                <div class="col-sm-10">\
                    <select class="form-control" id="driver" required>\
                        <option value="">Seleccione un motor de DB</option>\
                        ' + listaDB + '\
                    </select>\
                </div>\
            </div>\
            <div class="form-group row">\
                <label for="host" class="col-sm-2 col-form-label">Host</label>\
                <div class="col-sm-10">\
                    <input type="text" required class="form-control" id="host" placeholder="Host de la base de datos" value="' + this._dbConfig.host + '">\
                </div>\
            </div>\
            <div class="form-group row">\
                <label for="dbname" class="col-sm-2 col-form-label">Base de datos</label>\
                <div class="col-sm-10">\
                    <input type="text" required class="form-control" id="dbname" placeholder="Base de datos" value="' + this._dbConfig.dbname + '">\
                </div>\
            </div>\
            <div class="form-group row">\
                <label for="username" class="col-sm-2 col-form-label">Usuario</label>\
                <div class="col-sm-10">\
                    <input type="text" required class="form-control" id="username" placeholder="Nombre de usuario" value="' + this._dbConfig.username + '">\
                </div>\
            </div>\
            <div class="form-group row">\
                <label for="password" class="col-sm-2 col-form-label">Contraseña</label>\
                <div class="col-sm-10">\
                    <input type="password" class="form-control" id="password" placeholder="Contraseña" value="' + this._dbConfig.password + '">\
                </div>\
            </div>\
        </form>\
        <div class="text-right">\
            <input type="submit" class="btn btn-success prog" id="dbNext" data-step="2" value="Siguiente" disabled>\
        </div>';
                break;
            case 2:
                title = "Cuenta administrador";
                resultado = '<form id="adminSettings" autocomplete="off">\
                <div class="form-group row">\
                    <label for="adminUser" class="col-sm-2 col-form-label">Usuario</label>\
                    <div class="col-sm-10">\
                        <input type="text" required class="form-control" id="adminUser" placeholder="Nombre de usuario">\
                    </div>\
                </div>\
                <div class="form-group row">\
                    <label for="dbname" class="col-sm-2 col-form-label">Email</label>\
                    <div class="col-sm-10">\
                        <input type="email" required class="form-control" id="dbname" placeholder="Email administrador">\
                    </div>\
                </div>\
                <div class="form-group row">\
                    <label for="pass" class="col-sm-2 col-form-label">Contraseña</label>\
                    <div class="col-sm-10">\
                        <input type="password" class="form-control" id="pass" placeholder="Contraseña">\
                    </div>\
                </div>\
                <div class="form-group row">\
                    <label for="re-pass" class="col-sm-2 col-form-label">Repite la contraseña</label>\
                    <div class="col-sm-10">\
                        <input type="password" class="form-control" id="re-pass" placeholder="Contraseña">\
                    </div>\
                </div>\
            </form>\
            <div class="text-right">\
                <input type="button" class="btn btn-danger prog" data-step="1" value="Anterior">\
                <input type="button" class="btn btn-success prog" id="dbNext" data-step="3" value="Siguiente" disabled>\
            </div>';
                break;

            default:
                title = "Error";
                resultado = "Error: panel on install.js";
        }

        $("#setting .card-header").html(title);
        $("#setting .card-body").html(resultado);

        // Evita que el formulario sea enviado
        $("form").submit(function (e) {
            e.preventDefault();
        });

        // Control sobre el progreso
        $('.prog').click(function () {
            self.panel($(this).data("step"));
        });

        // Funcionalidades
        $("#dbSettings input").keyup(function () {
            self.comprobar();
        });

        if (step == 1) {
            this.comprobar();
        }
    }

}

new Install;