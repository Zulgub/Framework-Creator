@capa("default")
@addTitle(" - Documentación")
<div class="row">
    <div class="col-xl-3">
        <div class="sticky-top">
            <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <a class="nav-link active" id="v-pills-intro-tab" data-toggle="pill" href="#intro" role="tab" aria-controls="intro" aria-selected="true">Introducción</a>
                <a class="nav-link" id="v-pills-framework-tab" data-toggle="pill" href="#framework" role="tab" aria-controls="framework" aria-selected="false">Framework</a>
                <ul class="sub-nav">
                    <li class="nav-link"><a href="#general">General</a>
                        <ul>
                            <li class="nav-link"><a href="#requisitos">Requisitos</a></li>
                            <li class="nav-link"><a href="#install">Comando de instalación</a></li>
                        </ul>
                    </li>
                    <li class="nav-link"><a href="#formularios">Formularios</a></li>
                    <li class="nav-link"><a href="#comandos">Comandos</a></li>
                    <li class="nav-link"><a href="#quick">Acceso rápido</a></li>
                    <li class="nav-link"><a href="#archivos">Archivos</a></li>
                    <li class="nav-link"><a href="#loadFile">Cargar configuración</a></li>

                </ul>
                <a class="nav-link" id="v-pills-project-tab" data-toggle="pill" href="#project" role="tab" aria-controls="project" aria-selected="false">Crear proyecto</a>
                <ul class="sub-nav">
                    <li class="nav-link"><a href="#newProject">Creando un nuevo proyecto</a></li>
                </ul>

                <a class="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#settings" role="tab" aria-controls="settings" aria-selected="false">Configuración proyecto</a>
            </div>
        </div>
    </div>
    <div class="col-xl-9 docs-content">
        <div class="tab-content" id="v-pills-tabContent">
            <div class="tab-pane fade show active" id="intro" role="tabpanel" aria-labelledby="v-pills-intro-tab">
                <div class="card">
                    <div class="card-header">Introducción</div>
                    <div class="card-body">
                        <h3 class="card-title"><?php echo $GLOBALS["name"]; ?></h3>
                        <div class="card-text">
                            Esta herramienta está pensada para ayudar al desarrollador con los frameworks, facilitando su uso.<br>
                            Los requisitos principales de esta herramienta varían según el framework que quieras usar. Pero principalmente, con las configuraciones por defecto, esos son los requisitos:
                            <ul>
                                <li><a href="https://getcomposer.org/" target="_blank">Composer</a></li>
                                <li><a href="https://nodejs.org/es/" target="_blank">Node</a></li>
                            </ul>

                            A nivel de software se require alojar la herramienta en un servidor con <strong>PHP5+</strong>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="framework" role="tabpanel" aria-labelledby="v-pills-framework-tab">
                <div class="card">
                    <div class="card-header">Frameworks</div>
                    <div class="card-body">
                        <div class="card-text">
                            Para añadir/modificar/borrar la configuración de un framework, debemos de ir a <a href="{{assets(config)}}">configuración</a>.
                            <br>
                            Para añadir un framework, tenemos dos opciones:<br>
                            <h4>- Crear configuración</h4>
                            Para ello tendremos que hacer click en el botón de añadir
                            <figure>
                                <img src="{{assets(assets/img/docs/config/add_button.png)}}" alt="Botón añadir" class="img-fluid">
                                <figcaption class="text-muted">
                                    Botón añadir en el apartado de configuración
                                </figcaption>
                            </figure>

                            Entonces se abrirá un modal con un formulario a rellenar
                            <figure>
                                <img src="{{assets(assets/img/docs/config/new_modal.png)}}" alt="Modal con formulario" class="img-fluid">
                                <figcaption class="text-muted">
                                    Modal con formulario
                                </figcaption>
                            </figure>

                            <h4 id="general">General</h4>
                            <h5 id="requisitos">Requisitos</h5>
                            En el apartado de requisitos, estableceremos los requisitos del framework, es decir, aquellos comandos que son necesarios para que la herramienta pueda crear un proyecto con la configuración que le asignemos.
                            <figure>
                                <img src="{{assets(assets/img/docs/config/requirements.png)}}" alt="Ejemplo de requisitos" class="img-fluid">
                                <figcaption class="text-muted">
                                    Ejemplo de requisitos
                                </figcaption>
                            </figure>

                            <h5>Ruta principal</h5>
                            En el siguiente apartado, nos pedirá que indiquemos la ruta principal del framework, es decir, aquella carpeta donde está contenida la página principal. En el caso de Laravel, la carpeta principal será public
                            <figure>
                                <img src="{{assets(assets/img/docs/config/root.png)}}" alt="Ruta principal del framework" class="img-fluid">
                                <figcaption class="text-muted">
                                    Ruta principal del framework
                                </figcaption>
                            </figure>

                            <h5 id="install">Comando de instalación</h5>
                            El último input a rellenar en el apartado "General" de la configuración, es el comando de instalación. Este comando debe tener $name en su contenido, esa variable será sustituida por el nombre del proyecto.
                            <figure>
                                <img src="{{assets(assets/img/docs/config/install.png)}}" alt="Comando de instalación" class="img-fluid">
                                <figcaption class="text-muted">
                                    Ejemplo de requisitos
                                </figcaption>
                            </figure>

                            <div class="alert alert-warning"><i class="fa fa-exclamation-triangle"></i> Los frameworks cuyo comando de instalación requiere la intervención humana, no son soportados. Por ejemplo que durante la instalación, pregunte si desea añadir un módulo.
                                Es el caso de <i class="fab fa-angular"></i> Angular, por esta razón, este framework no es compatible con la herramienta.
                            </div>

                            <h4 id="formularios">Formularios</h4>
                            Este apartado está dedicado a la creación del formulario que se mostrará cuando queramos crear un nuevo proyecto.

                            <figure>
                                <img src="{{assets(assets/img/docs/config/form_builder.png)}}" alt="Editor de formulario" class="img-fluid">
                                <figcaption class="text-muted">
                                    Editor de formulario
                                </figcaption>
                            </figure>

                            En el siguiente ejemplo, se mostrará un checkBox, con el que podremos controlar un <a href="#comandos">comando</a> de la lista de comandos.

                            <figure>
                                <img src="{{assets(assets/img/docs/config/example_element_form.png)}}" alt="Ejemplo de elemento del formulario" class="img-fluid">
                                <figcaption class="text-muted">
                                    Ejemplo de elemento del formulario
                                </figcaption>
                            </figure>

                            En el caso de que borres un comando, o un elemento no tenga seleccionado un comando, el sistema le avisará y no le dejará guardar hasta que lo solucione.

                            <figure>
                                <img src="{{assets(assets/img/docs/config/warning_form.png)}}" alt="Alerta de error en el formulario" class="img-fluid">
                                <figcaption class="text-muted">
                                    Alerta de error en el formulario
                                </figcaption>
                            </figure>

                            <h4 id="comandos">Comandos</h4>
                            En este apartado se establecerán los comandos que usará la herramienta cuando sean llamados para su ejecución.

                            <figure>
                                <img src="{{assets(assets/img/docs/config/commands_example.png)}}" alt="Apartado de comandos de la sección de configuración" class="img-fluid">
                                <figcaption class="text-muted">
                                    Apartado de comandos de la sección de configuración
                                </figcaption>
                            </figure>

                            Este apartado contiene un botón de ayuda, con la siguiente información:

                            <figure>
                                <img src="{{assets(assets/img/docs/config/help_commands.png)}}" alt="Información de ayuda de los comandos" class="img-fluid">
                                <figcaption class="text-muted">
                                    Información de ayuda de los comandos
                                </figcaption>
                            </figure>

                            <h4 id="quick">Acceso rápido</h4>
                            Aquí crearemos elementos de interacción que estarán disponibles en la sección de edición del proyectoy ejecutará los comandos asignados.

                            <figure>
                                <img src="{{assets(assets/img/docs/config/quick_form.png)}}" alt="Apartado de acceso rápido" class="img-fluid">
                                <figcaption class="text-muted">
                                    Apartado de acceso rápido
                                </figcaption>
                            </figure>

                            A continuación mostraremos un ejemplo, en dicho ejemplo podemos ver un selector de comandos, como en el <a href="formularios">editor de formularios</a>. Pero tambien tenemos la opción de asignarle un patrón a cumplir en el caso de los elementos donde hay que introducir por teclado información.

                            <figure>
                                <img src="{{assets(assets/img/docs/config/quick_acces_example.png)}}" alt="Ejemplo de elemento interactivo" class="img-fluid">
                                <figcaption class="text-muted">
                                    Ejemplo de elemento interactivo
                                </figcaption>
                            </figure>
                            <h4 id="archivos">Archivos</h4>
                            En esta sección, definiermos las rutas de los archivos más comunes a editar. De este manera podemos tener un acceso rápido a ellos.
                            <br>
                            Estos archivos podrán ser visualizados en el apartado de edición del proyecto.
                            <figure>
                                <img src="{{assets(assets/img/docs/config/files.png)}}" alt="Apartado de archivos" class="img-fluid">
                                <figcaption class="text-muted">
                                    Apartado de archivos
                                </figcaption>
                            </figure>

                            <h4 id="loadFile">- Cargar configuración</h4>
                            El otro método de añadir la configuración de un framework, es usando el botón de cargar archivo de configuración.
                            <figure>
                                <img src="{{assets(assets/img/docs/config/load_file_button.png)}}" alt="Botón de subida de archivo de configuración" class="img-fluid">
                                <figcaption class="text-muted">
                                    Botón de subida de archivo de configuración.
                                </figcaption>
                            </figure>

                            El sistema analizará el archivo, comprobará si existe una configuración con el mismo nombre, en el caso de que exista, mostrará un error.<br>
                            También comprobará el contenido, y no dejerá que se pueda subir archivos que no sean JSON.
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="project" role="tabpanel" aria-labelledby="v-pills-project-tab">
                <div class="card">
                    <div class="card-header">Creación del proyecto</div>
                    <div class="card-body">
                        <div class="card-text">
                            Esta es la página principal de la herramienta. Podemos diferenciar 4 elementos. Una barra de búsqueda del proyecto, un botón de añadir, otro de actualizar, y los proyectos creados, con una vista previa e información.

                            <figure>
                                <img src="{{assets(assets/img/docs/home/ini.png)}}" alt="Página principal" class="img-fluid">
                                <figcaption class="text-muted">
                                    Página principal
                                </figcaption>
                            </figure>

                            En cada proyecto, tenemos la opción de abrir la vista previa y de editar.<br>

                            Para editar un proyecto bastará con que hagamos click sobre la vista previa, esto nos llevará a la página de edición del proyecto

                            <figure>
                                <img src="{{assets(assets/img/docs/home/edit.png)}}" alt="Animación del enlace" class="img-fluid">
                                <figcaption class="text-muted">
                                    Al poner el cursor encima, mostrará una animación
                                </figcaption>
                            </figure>

                            <h5 id="newProject">Creando un nuevo proyecto</h5>

                            Para crear un nuevo proyecto, bastará con que hagamos click en el botón de añadir, y mostrará el siguiente dialogo con los frameworks disponibles.

                            <figure>
                                <img src="{{assets(assets/img/docs/home/modal_ini.png)}}" alt="Ventana de selección  del framework" class="img-fluid">
                                <figcaption class="text-muted">
                                    Ventana de selección del framework
                                </figcaption>
                            </figure>

                            Cuando hayamos elegido uno, a continuación comprobará los requisitos que hayamos establecidos en la configuración.

                            <figure>
                                <img src="{{assets(assets/img/docs/home/checking.png)}}" alt="Comprobación de requisitos" class="img-fluid">
                                <figcaption class="text-muted">
                                    Comprobación de requisitos
                                </figcaption>
                            </figure>

                            Una vez comprobado, mostrará el formulario que editamos en la configuración del framework

                            <figure>
                                <img src="{{assets(assets/img/docs/home/form_modal.png)}}" alt="Formulario de creación del framework" class="img-fluid">
                                <figcaption class="text-muted">
                                    Formulario de creación del framework
                                </figcaption>
                            </figure>

                            Al comenzar la instalación, una animación nos mostrará una notificación en el menú principal.

                            <figure>
                                <img src="{{assets(assets/img/docs/home/notify.png)}}" alt="Notifiación del estado de las instalaciones" class="img-fluid">
                                <figcaption class="text-muted">
                                    Notifiación del estado de las instalaciones
                                </figcaption>
                            </figure>

                            En el caso de que la instalación finalice, de error, o la cancelemos, el sistema nos lo notificará.

                            <figure>
                                <img src="{{assets(assets/img/docs/home/cancel.png)}}" alt="Notifiación de la cancelación de la instalación" class="img-fluid">
                                <figcaption class="text-muted">
                                    Notifiación de la cancelación de la instalación
                                </figcaption>
                            </figure>

                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                <div class="card">
                    <div class="card-header">Configuración del proyecto</div>
                    <div class="card-body">
                        <div class="card-text">
                            En este apartado podremos conocer cuanto ocupa nuestro proyecto, descargarlo en un winRAR, borrarlo, modificar ficheros y ejecutar acciones sobre el estado del proyecto.

                            <figure>
                                <img src="{{assets(assets/img/docs/setting/page.png)}}" alt="Vista principal del apartado de configuración" class="img-fluid">
                                <figcaption class="text-muted">
                                    Vista principal del apartado de configuración
                                </figcaption>
                            </figure>

                            En la lista aparecerán los archivos que hayamos indicado en la configuración de archivos de la configuración del framework.

                            <figure>
                                <img src="{{assets(assets/img/docs/setting/editor.png)}}" alt="Editando el archivo de rutas de Laravel" class="img-fluid">
                                <figcaption class="text-muted">
                                    Editando el archivo de rutas de Laravel
                                </figcaption>
                            </figure>

                            En la segunda sección de esta página, encontramos los elementos interactivos que hemos configurado en la sección de configuración del framework. 

                            <figure>
                                <img src="{{assets(assets/img/docs/setting/example.png)}}" alt="Notificación de ejecución de una configuración" class="img-fluid">
                                <figcaption class="text-muted">
                                    Notificación de ejecución de una configuración
                                </figcaption>
                            </figure>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>