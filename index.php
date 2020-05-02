<?php
require_once 'assets/includes/conf.inc.php';
require_once 'assets/includes/class/ruta.php';
$R = new Ruta();
require_once 'assets/includes/rutas/Rutas.php';
$R->run();