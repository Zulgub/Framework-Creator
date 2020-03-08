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
    <style>
        .list-group-item{
            cursor: pointer;
        }
        .disabled{
            cursor: not-allowed;
        }
    </style>
</head>

<body class="bg-dark">
    <div class="container pt-4">
        <div class="row">
            <div class="col-sm-3">
                <div class="card">
                    <div class="card-header text-muted">
                        Progreso
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item disabled">Conexión a la base de datos</li>
                        <li class="list-group-item disabled">Cuenta administrador</li>
                        <li class="list-group-item disabled">Dependencias</li>
                        <li class="list-group-item disabled">Finalizado</li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-9">
                <div class="card" id="setting">
                    <div class="card-header">
                        Cargando...
                    </div>
                    <div class="card-body">
                        Cargando...
                    </div>
                    <div class="card-footer" id="status">
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- <script defer src="https://code.jquery.com/jquery-latest.min.js" crossorigin="anonymous">
    </script> -->
    <script defer src="assets/js/jquery-3.4.1.min.js"></script>
    <script defer src="assets/js/popper.min.js"></script>
    <script defer src="assets/js/bootstrap.min.js"></script>
    <script defer src="assets/js/install.js" type="module"></script>
    <script defer src="assets/js/removeBanner.js"></script>
</body>

</html>