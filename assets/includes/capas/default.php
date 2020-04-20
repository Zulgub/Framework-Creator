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
    <script defer src="assets/js/push.min.js"></script>

    <!-- Editor de formularios JSON -->
    <script defer src="assets/js/forms/form-builder.min.js"></script>
    <script defer src="assets/js/forms/form-render.min.js"></script>

    <!-- Editor de tablas -->
    <link rel="stylesheet" type="text/css" href="assets/css/tableEditor/datatables.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/tableEditor/generator-base.css">
    <link rel="stylesheet" type="text/css" href="assets/css/tableEditor/editor.bootstrap4.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/tableEditor/jquery.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="assets/css/tableEditor/rowReorder.dataTables.min.css">


    <script defer type="text/javascript" src="assets/js/tableEditor/jquery.dataTables.min.js"></script>
    <script defer type="text/javascript" src="assets/js/tableEditor/dataTables.rowReorder.min.js"></script>
    <script defer type="text/javascript" charset="utf-8" src="assets/js/tableEditor/datatables.min.js"></script>
    <script defer type="text/javascript" charset="utf-8" src="assets/js/tableEditor/dataTables.editor.min.js"></script>
    <script defer type="text/javascript" charset="utf-8" src="assets/js/tableEditor/editor.bootstrap4.min.js"></script>
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
                <ul class="nav navbar-nav navbar-right mr-4">
                    <li class="dropdown">
                        <a class="dropdown-toggle notify text-white" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><strong class="installing">1</strong></a>
                        <ul class="dropdown-menu notify-drop p-2">
                            <div class="notify-drop-title">
                                <div class="row">
                                    <div class="col-12 text-center">Instalaciones en curso <strong class="installing">1</strong></div>
                                </div>
                            </div>
                            <!-- end notify title -->
                            <!-- notify content -->
                            <div class="drop-content px-2">
                            </div>
                            <div class="notify-drop-footer text-center">
                                <buton type="button" class="btn btn-danger btn-sm mt-1 cancelAll"><i class="fa fa-stop"></i> Cancelar todos</button>
                            </div>
                        </ul>
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
        <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
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