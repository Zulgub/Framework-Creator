<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?php echo $GLOBALS["name"]; ?></title>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <link href="assets/fontawesome-5.12/css/all.css" rel="stylesheet">
    <script defer src="assets/js/jquery-3.4.1.min.js"></script>
    <script defer src="assets/js/jquery-ui.min.js"></script>
    <script defer src="assets/js/popper.min.js"></script>
    <script defer src="assets/js/bootstrap.min.js"></script>
    <script defer src="assets/js/removeBanner.js"></script>
    <!-- Forms generados por json by https://github.com/json-editor/json-editor -->
    <script defer src="assets/js/forms/form-builder.min.js"></script>

    <script defer src="assets/js/main.js" type="module"></script>
</head>

<body class="d-flex flex-column">
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <a class="navbar-brand" href="./"><i class="fa fa-home"></i></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" data-index="2" href="./config"><i class="fa fa-cog"></i> Configuración</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <div class="container-fluid flex-grow pt-4">
        <?php $this->contenido(); ?>
    </div>
    <div aria-live="polite" aria-atomic="true" class="fixed-bottom w-25 ml-auto p-1" id="alertas">
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel">Cargando...</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Cargando...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success">Cargando...</button>
                </div>
            </div>
        </div>
    </div>
    <footer class="footer bg-dark mt-4 text-white-50">
        <div class="container-fluid py-3">
            <div class="row">
                <div class="col-md-4">
                    <h5>
                        Copyleft <span class="copyLeft">©</span>
                        <?php echo date("Y") . " " . $GLOBALS["name"]; ?>
                    </h5>
                </div>
            </div>
        </div>
    </footer>
</body>

</html>