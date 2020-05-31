<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?php echo $GLOBALS["name"]; ?></title>
    <link rel="apple-touch-icon" sizes="57x57" href="{{assets(assets/img/logo/apple-icon-57x57.png)}}">
    <link rel="apple-touch-icon" sizes="60x60" href="{{assets(assets/img/logo/apple-icon-60x60.png)}}">
    <link rel="apple-touch-icon" sizes="72x72" href="{{assets(assets/img/logo/apple-icon-72x72.png)}}">
    <link rel="apple-touch-icon" sizes="76x76" href="{{assets(assets/img/logo/apple-icon-76x76.png)}}">
    <link rel="apple-touch-icon" sizes="114x114" href="{{assets(assets/img/logo/apple-icon-114x114.png)}}">
    <link rel="apple-touch-icon" sizes="120x120" href="{{assets(assets/img/logo/apple-icon-120x120.png)}}">
    <link rel="apple-touch-icon" sizes="144x144" href="{{assets(assets/img/logo/apple-icon-144x144.png)}}">
    <link rel="apple-touch-icon" sizes="152x152" href="{{assets(assets/img/logo/apple-icon-152x152.png)}}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{assets(assets/img/logo/apple-icon-180x180.png)}}">
    <link rel="icon" type="image/png" sizes="192x192"  href="{{assets(assets/img/logo/android-icon-192x192.png)}}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{assets(assets/img/logo/favicon-32x32.png)}}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{assets(assets/img/logo/favicon-96x96.png)}}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{assets(assets/img/logo/favicon-16x16.png)}}">
    <link rel="manifest" href="{{assets(assets/img/logo/manifest.json)}}">
    <meta name="msapplication-TileColor" content="#000000">
    <meta name="msapplication-TileImage" content="{{assets(assets/img/logo/ms-icon-144x144.png)}}">
    <meta name="theme-color" content="#000000">
    <link rel="stylesheet" href="{{assets(assets/css/bootstrap.min.css)}}">
    <link rel="stylesheet" href="{{assets(assets/css/main.css)}}">
    <link href="{{assets(assets/fontawesome-5.12/css/all.css)}}" rel="stylesheet">
    <script defer src="{{assets(assets/js/jquery-3.4.1.min.js)}}"></script>
    <script defer src="{{assets(assets/js/jquery-ui.min.js)}}"></script>
    <script defer src="{{assets(assets/js/popper.min.js)}}"></script>
    <script defer src="{{assets(assets/js/bootstrap.min.js)}}"></script>
    <script defer src="{{assets(assets/js/push.min.js)}}"></script>

    <!-- @css -->

    <!-- @js -->

    <script defer src="{{assets(assets/js/main.js)}}" type="module"></script>
</head>

<body class="d-flex flex-column">
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <a class="navbar-brand logo" activeLink="active" href="{{assets(.)}}"></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" activeLink="active" data-index="2" href="{{assets(config)}}"><i class="fa fa-cogs"></i> Configuración</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" activeLink="active" data-index="2" href="{{assets(docs)}}"><i class="fa fa-book"></i> Documentación</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" activeLink="active" data-index="2" href="{{assets(faq)}}"><i class="fa fa-question-circle"></i> FAQ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" activeLink="active" data-index="2" href="{{assets(info)}}"><i class="fa fa-info"></i> Información</a>
                    </li>
                </ul>
                <ul class="navbar-nav navbar-right mr-4">
                    <li class="nav-item dropdown">
                        <a class="notify text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <strong class="installing">1</strong>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-default p-0 notify-card">
                            <div class="card border-0">
                                <h6 class="card-header text-center">Instalaciones en curso <strong class="installing">1</strong></h6>
                                <div class="card-body notify-body p-0">
                                    <p class="card-text notify-content"></p>
                                </div>
                                <div class="card-footer text-center">
                                    <buton type="button" class="btn btn-danger btn-sm mt-1 cancelAll"><i class="fa fa-stop"></i> Cancelar todos</button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <div class="container-fluid flex-grow pt-4">
        @contenido
    </div>

    <!-- Alertas -->

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