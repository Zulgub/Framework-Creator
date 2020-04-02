<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Instalación - <?php echo $GLOBALS["name"]; ?></title>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/install.css">
    <link href="assets/fontawesome-5.12/css/all.css" rel="stylesheet">
    <script defer src="assets/js/jquery-3.4.1.min.js"></script>
    <script defer src="assets/js/popper.min.js"></script>
    <script defer src="assets/js/bootstrap.min.js"></script>
    <script defer src="assets/js/install.js" type="module"></script>
    <script defer src="assets/js/removeBanner.js"></script>
</head>

<body class="bg-dark">
    <header>
        <div class="jumbotron jumbotron-fluid mb-0">
            <div class="container">
                <h1 class="display-4">Bienvenido a la interfaz de instalación</h1>
                <p class="lead"><?php echo $GLOBALS["name"]; ?></p>
            </div>
        </div>
    </header>
    <div class="container py-4">
        <div class="row">
            <div class="col-lg-3 mb-2">
                <div class="card">
                    <div class="card-header lead">
                        Progreso
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item disabled">Conexión a la base de datos</li>
                        <li class="list-group-item disabled">Cuenta administrador</li>
                        <li class="list-group-item disabled">Instalación</li>
                        <li class="list-group-item disabled">Finalizado</li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-9">
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
</body>

</html>