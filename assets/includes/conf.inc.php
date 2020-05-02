<?php
date_default_timezone_set('Europe/Madrid');
// Esto le dice a PHP que usaremos cadenas UTF-8 hasta el final
mb_internal_encoding('UTF-8');

// Esto le dice a PHP que generaremos cadenas UTF-8
mb_http_output('UTF-8');

// Iniciamos la sesión
session_start();

$GLOBALS["name"] = "Framework Manager";
$permisos = 0;
require_once 'connect.inc.php';
require_once 'class/app.php';
$GLOBALS["app"] = new App;
require_once "funciones.inc.php";