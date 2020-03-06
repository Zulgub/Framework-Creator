<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Instalación</title>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <script src="https://kit.fontawesome.com/7c1152212d.js" crossorigin="anonymous"></script>
</head>

<body class="bg-dark">
    <div class="container p-0 pt-4 ml-4">
        <div class="row p-0">
            <div class="col-sm-3">
                <div class="card">
                    <div class="card-header text-muted">
                        Progreso
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item active">Conexión a la base de datos</li>
                        <li class="list-group-item">Cuenta administrador</li>
                        <li class="list-group-item">Finalizado</li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-9">
                <div class="card">
                    <div class="card-header">
                        Conexión a la base de datos
                    </div>
                    <div class="card-body">
                        <form>
                            <div class="form-group row">
                                <label for="driver" class="col-sm-2 col-form-label">Driver</label>
                                <div class="col-sm-10">
                                    <select class="form-control" id="driver">
                                        <option value="mysql" selected>MySQL</option>
                                        <option value="sqlite">SQLite</option>
                                        <option value="postgresql">PostgreSQL</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                                <div class="col-sm-10">
                                    <input type="password" class="form-control" id="inputPassword" placeholder="Password">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <script defer src="https://code.jquery.com/jquery-latest.min.js" crossorigin="anonymous">
    </script>
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous">
    </script>
    <script defer src="assets/js/bootstrap.min.js"></script>
    <script defer src="assets/js/main.js" type="module"></script>
    <script defer src="assets/js/removeBanner.js"></script>
</body>

</html>