<?php

#################### [ COMO USAR LAS RUTAS ] #########################
/**
 * $R->new(obligatorio,opcional,opcional); opcional = por defecto
 * $R->new(vista,capa,url_personalizada);
 */
// $R->new('index');

$R->new('index','default','index');

$R->new('config.index','default','config');


// Ruta de instalacion
$R->new('install.index','empty','install');
