<?php
# AIzaSyA5uhrajqiN_WB2SZeRan_lleSoELoYpzw - google key
################## caracteres en español ##########
function esp($string, $escapar = false)
{
    $coincidencias = "/(º|ª|€|¡|¿|¬|·|ç|¨|Á|á|Ä|ä|Â|â|É|é|Ë|ë|Ê|ê|Í|í|Ï|ï|Î|î|Ó|ó|Ö|ö|Ô|ô|Ú|ú|Ü|ü|Û|û|Ñ|ñ|ÿ|ý|Ý|\|)/";
    if (preg_match($coincidencias, addslashes(utf8_decode($string)))) {
        $convertido = utf8_decode($string);
    } else if (preg_match($coincidencias, addslashes(utf8_encode($string)))) {
        $convertido =  utf8_encode($string);
    } else {
        $convertido = $string;
    }
    return $convertido;
}