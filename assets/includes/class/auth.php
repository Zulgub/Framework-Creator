<?php
require_once '../conf.inc.php';

/**
 * Esta clase manejará las cuentas de usuario de la aplicación
 */
class Auth
{

    /**
     * Nombre de usuario
     */
    private $username;
    /**
     * Email del usuario
     */
    private $email;
    /**
     * Rol del usuario
     */
    private $role;
    /**
     * Conexión a la base de datos
     */
    private $db;
    /**
     * Id del usuario
     */
    private $id;
    /**
     * Contraseña introducida por fornmulario
     */
    private $pass;

    /**
     * Nueva contraseña a usar (Usado para cambiar la contraseña del usuario)
     */
    private $newPass;

    /**
     * Mensaje de salida
     */
    private $mensaje;

    /**
     * {Array} Cambios en el perfil
     */
    private $cambios;

    /**
     * Constructor de la clase Auth
     * 
     * 
     * @param DBConnection $db Conexión a la base de datos
     * @param String $email Email del usuario
     * @param Integer $role Rol del usuario
     * @return Empty nada
     */
    public function __construct($db, $username = null, $email = null, $role = null)
    {
        $this->db = $db;
        $this->username = $username;
        $this->$email = $email;
        $this->role = $role;
        $this->mensaje = "";
    }

    /**
     * Comprueba si existe una cuenta con ese email
     * @param String $email email a comprobar
     * @return Boolean Si se encuentra una cuenta con ese email 
     */
    private function comprobarEmailRepetido($email)
    {
        // Comprobamos que no hay ninguna cuenta con el correo indicado
        $cuentas = $this->db->getQuery("SELECT COUNT(*) as cantidad FROM usuarios WHERE email = '{$this->email}'");
        $resultado = true;
        foreach ($cuentas as $cuenta) {
            $resultado = false;
        }
        return $resultado;
    }

    /**
     * Creación de usuarios
     */
    public function createtUser()
    {

        if ($this->comprobarEmailRepetido($this->email)) {
            // Create a random salt
            $random_salt = hash('sha512', uniqid(openssl_random_pseudo_bytes(16), TRUE));

            // Create salted password 
            $pass_word = hash('sha512', $this->pass . $random_salt);

            // Insertar datos
            $crearUsuario = $this->db->runQuery("INSERT INTO usuarios (`role`,`username`,`email`, `password`,`salt`,`join_date`,`join_ip`) VALUES($this->role,'$this->username','$this->email','$pass_word','$random_salt','" . date("Y-m-d h:i:s") . "','{$_SERVER['REMOTE_ADDR']}')");

            $this->mensaje .= $crearUsuario > 0 ? "Registrado correctamente" : "Ha ocurrido un error";
        } else
            $this->mensaje .= "¡Email ya en uso!";
    }

    /**
     * Comprueba si la contraseña coincide a la guardada en la base de datos
     * @return Boolean si conincide con la contraseña guardada
     */
    private function comprobarContrasenia()
    {
        $users = $this->db->getQuery("Select password, salt FROM usuarios WHERE email = '{$this->email}'");
        $userInfo = [];
        foreach ($users as $user) {
            $userInfo["pass"] = $user["password"];
            $userInfo["salt"] = $user["salt"];
        }

        return $userInfo["pass"] == hash('sha512', $this->pass . $userInfo["salt"]);
    }

    /**
     * Comprueba las creedenciales del usuario para iniciar sesión
     */
    public function login()
    {
        if ($this->comprobarContrasenia()) {
            $_SESSION["user"] = array(
                'user_id' => $this->id,
                'username' => $this->username,
                'login_string' => hash('sha512', $this->email . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT'])
            );
            $this->mensaje = "Usuario logeado con éxito";
        } else
            $this->mensaje = "Contraseña incorrecta";
    }

    /**
     * Desconecta al usuario
     */
    public function logout()
    {
        session_destroy();
    }

    /**
     * Cambia la contraseña del usuario
     */
    public function cambiarContrasenia()
    {
        if ($this->comprobarContrasenia()) {
            // Create a random salt
            $random_salt = hash('sha512', uniqid(openssl_random_pseudo_bytes(16), TRUE));

            // Create salted password 
            $pass_word = hash('sha512', $this->newPass . $random_salt);

            $update = $this->db->runQuery("UPDATE usuarios SET password = '$pass_word', salt = '$random_salt' WHERE email = '$this->email'");
            $this->mensaje = $update > 0 ? "Contraseña cambiada" : "Ha ocurrido un error al intentar cambiar la contraseña";
        } else
            $this->mensaje = "La contraseña no coincide con la actual";
    }

    /**
     * Actualiza los detalles de la cuenta
     */
    public function actualizarUsuario()
    {
        $update = $this->db->runQuery("UPDATE usuarios SET username = '{$this->cambios["username"]}', email = '{$this->cambios["email"]}'");

        $this->mensaje = $update > 0 ? "Perfil actualizado" : "Ocurrió un error al intentar actualizar el email";
    }

    /**
     * Borra el usuario
     */
    public function borrarUsuario(){
        $delete = $this->db->runQuery("DELETE FROM usuarios where email = '$this->email'");
        $this->mensaje = $delete > 0 ? "Usuario eliminado" : "Ocurrió un error al intentar borrar el usuario";
    }
}
