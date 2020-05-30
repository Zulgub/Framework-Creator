<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?php echo $GLOBALS["name"]; ?></title>
    <link rel=stylesheet href="{{assets(assets/codeMirror/lib/codemirror.css)}}">
    <link rel="stylesheet" href="{{assets(assets/css/bootstrap.min.css)}}">
    <link rel="stylesheet" href="{{assets(assets/css/sidebar.css)}}">
    <link href="{{assets(assets/fontawesome-5.12/css/all.css)}}" rel="stylesheet">
    <script defer src="{{assets(assets/js/jquery-3.4.1.min.js)}}"></script>
    <script defer src="{{assets(assets/js/jquery-ui.min.js)}}"></script>
    <script defer src="{{assets(assets/js/popper.min.js)}}"></script>
    <script defer src="{{assets(assets/js/bootstrap.min.js)}}"></script>
    <script defer src="{{assets(assets/js/download.js)}}"></script>
    <script defer src="{{assets(assets/js/push.min.js)}}"></script>
    <script defer type="text/javascript" src="{{assets(assets/js/forms/form-render.min.js)}}"></script>
    <script defer type="text/javascript" src="{{assets(assets/js/preview/html2canvas.js)}}"></script>

    <!-- librerias de codemirror -->
    <link rel="stylesheet" href="{{assets(assets/codeMirror/addon/dialog/dialog.css)}}">
    <link rel="stylesheet" href="{{assets(assets/codeMirror/addon/search/matchesonscrollbar.css)}}">
    <script defer src="{{assets(assets/codeMirror/lib/codemirror.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/mode/xml/xml.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/mode/javascript/javascript.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/mode/css/css.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/mode/htmlmixed/htmlmixed.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/addon/edit/matchbrackets.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/addon/dialog/dialog.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/addon/search/searchcursor.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/addon/search/search.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/addon/scroll/annotatescrollbar.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/addon/search/matchesonscrollbar.js)}}"></script>
    <script defer src="{{assets(assets/codeMirror/addon/search/jump-to-line.js)}}"></script>
    <!-- @css -->

    <!-- @js -->

    <script defer src="{{assets(assets/js/main.js)}}" type="module"></script>
</head>

<body class="d-flex flex-column">
    <div class="wrapper d-flex align-items-stretch">
        <nav id="sidebar" class="bg-dark">
            <div class="custom-menu">
                <button type="button" id="sidebarCollapse" class="btn btn-dark">
                    <i class="fa fa-bars"></i>
                    <span class="sr-only">Toggle Menu</span>
                </button>
            </div>
            <div class="p-4">
                <h1>
                    <a href="{{assets(view/<?php echo $get["proyecto"]; ?>)}}" class="logo" target="_blank">
                        <div class="preview position-relative">
                            <div class="thumbnail-container w-100 h-100">
                                <div class="thumbnail">
                                    <iframe class="preview-img" src="{{assets(view/<?php echo $get["proyecto"]; ?>)}}" frameborder="0"></iframe>
                                </div>
                            </div>
                            <div class="link m-0 row position-absolute text-white w-100 h-100 text-center">
                                <span class="m-auto">
                                    <i class="fa fa-external-link-alt"></i> Ver web
                                </span>
                            </div>
                        </div>
                    </a>
                </h1>
                <ul class="list-unstyled components mb-5">
                    <li>
                        <a href="{{assets(.)}}"><span class="fa fa-home col-3 text-center"></span> Inicio</a>
                    </li>
                    <li>
                        <a href="{{assets(config)}}"><span class="fa fa-cogs col-3 text-center"></span> Configuración</a>
                    </li>
                    <li>
                        <a href="{{assets(docs)}}"><span class="fa fa-book col-3 text-center"></span> Documentación</a>
                    </li>
                    <li>
                        <a href="{{assets(faq)}}"><span class="fa fa-question-circle col-3 text-center"></span> FAQ</a>
                    </li>
                    <li>
                        <a href="{{assets(info)}}"><span class="fa fa-info col-3 text-center"></span> Información</a>
                    </li>
                    <li class="pt-2">
                        Configuración del proyecto
                    </li>
                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <li id="main-files-pill" class="active" data-toggle="pill" role="tab" aria-controls="main-files-pill" href="#main-files">
                            <a href="#main-files"><span class="fa fa-file-code col-3 text-center"></span> Archivos</a>
                        </li>
                        <li data-toggle="pill" role="tab" aria-controls="quick-pill" href="#quick" id="quick-pill">
                            <a href="#profile"><span class="fa fa-bolt col-3 text-center"></span> Acceso rápido</a>
                        </li>
                    </div>
                </ul>
                <div class="footer">
                    <p>
                        <?php echo $GLOBALS["name"]; ?><br>
                        Copyleft <span class="copyLeft">©</span> <?php echo date("Y"); ?>
                    </p>
                </div>

            </div>
        </nav>
        <!-- Page Content  -->
        <div id="content" class="p-4">
            <div class="row pl-4">
                <div class="col-md-6 my-1">
                    <h4 clasS="mb-0 project-name"><?php echo $get["name"]; ?></h4>
                    <span data-toggle="tooltip" class="badge badge-warning p-2" data-placement="bottom" title="Framework"><i class="fa fa-puzzle-piece"></i> <?php echo $get["data"]["name"]; ?></span>
                    <span data-toggle="tooltip" class="badge badge-info p-2 size" data-placement="bottom" title="Tamaño del proyecto"><i class="fa fa-hdd"></i> Calculando... <i class="fa fa-spinner fa-spin"></i></span>
                    <button class="btn btn-secondary btn-sm p-1 descarga">
                        <i class="fa fa-download"></i> Descargar
                    </button>
                </div>
                <div class="col-md-6 my-1 text-right">
                    <button tyoe="button" class="btn btn-danger delProject" data-project="<?php echo $get["proyecto"]; ?>" data-toggle="modal" data-target="#modal">
                        <span class="fa fa-trash"></span> Borrar proyecto
                    </button>
                </div>
            </div>
            <hr>
            <div id="canvas"></div>
            @contenido
        </div>
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
</body>

</html>