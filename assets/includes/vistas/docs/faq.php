@capa("default")
@addTitle("Preguntas frequentes")
@addCss("assets/css/"=>["faq.css"])
<div class="container faq">
    <div class="row">
        <div class="col-lg-4">
            <div class="nav nav-pills faq-nav" id="faq-tabs" role="tablist" aria-orientation="vertical">
                <a href="#tab1" class="nav-link active" data-toggle="pill" role="tab" aria-controls="tab1" aria-selected="true">
                    <i class="fa fa-question-circle mr-2"></i> Preguntas y respuestas frecuentes
                </a>
                <a href="#tab2" class="nav-link" data-toggle="pill" role="tab" aria-controls="tab2" aria-selected="false">
                    <i class="fa fa-cogs mr-2"></i> Configuración
                </a>
                <a href="#tab3" class="nav-link" data-toggle="pill" role="tab" aria-controls="tab3" aria-selected="false">
                    <i class="fa fa-hdd mr-2"></i> Instalación
                </a>
                <a href="#tab4" class="nav-link" data-toggle="pill" role="tab" aria-controls="tab4" aria-selected="false">
                    <i class="fa fa-tasks mr-2"></i> Proyecto
                </a>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="tab-content" id="faq-tab-content">
                <div class="tab-pane show active" id="tab1" role="tabpanel" aria-labelledby="tab1">
                    <div class="accordion" id="accordion-tab-1">
                        <div class="card">
                            <div class="card-header" id="accordion-tab-1-heading-1">
                                <h5>
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#accordion-tab-1-content-1" aria-expanded="false" aria-controls="accordion-tab-1-content-1">¿Puedo usar cualquier framework?</button>
                                </h5>
                            </div>
                            <div class="collapse show" id="accordion-tab-1-content-1" aria-labelledby="accordion-tab-1-heading-1" data-parent="#accordion-tab-1">
                                <div class="card-body">
									<p>No, sólo aquellos que no necesiten intervención durante la instalación o dispongan de opción de una instalación silenciosa, como en el caso de composer con <abbr title="Do not ask any interactive question"><a href="https://getcomposer.org/doc/03-cli.md#global-options" target="_blank" rel="nofollow">-n</a></abbr>
									<br>Por ejemplo, <i class="fab fa-angular"></i> Angular CLI no es compatible con esta aplicación.
								</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="tab2" role="tabpanel" aria-labelledby="tab2">
                    <div class="accordion" id="accordion-tab-2">
                        <div class="card">
                            <div class="card-header" id="accordion-tab-2-heading-1">
                                <h5>
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#accordion-tab-2-content-1" aria-expanded="false" aria-controls="accordion-tab-2-content-1" data-hash="problemCommands"> Me funciona el comando en la terminal y en la aplicación no. ¿A que se debe?</button>
                                </h5>
                            </div>
                            <div class="collapse show" id="accordion-tab-2-content-1" aria-labelledby="accordion-tab-2-heading-1" data-parent="#accordion-tab-2">
                                <div class="card-body">
                                    <p>Asegurese que el comando que desea usar es accesible de manera global. Reinicie su dispositivo y pruebe de nuevo. Si el problema persiste, entonces PHP CLI no puede acceder a dicho comando</p>
                                </div>
                            </div>
						</div>
						<div class="card">
                            <div class="card-header" id="accordion-tab-2-heading-2">
                                <h5>
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#accordion-tab-2-content-2" aria-expanded="false" aria-controls="accordion-tab-2-content-1" data-hash="installCommand"> No me ejecuta el comando de instalación del framework. ¿Por qué?</button>
                                </h5>
                            </div>
                            <div class="collapse" id="accordion-tab-2-content-2" aria-labelledby="accordion-tab-2-heading-2" data-parent="#accordion-tab-2">
                                <div class="card-body">
                                    <p>Sólo se podrán ejecutar comandos de instalación en los que no se require intervención humana. Por ejemplo decidir si usar una librería o no. Busca en la documentación del Framework si existe una instalación silenciosa. Además, compruebe que el comando es accesible globalmente y si PHP CLI puede acceder a dicho comando. Reinicie el dispositivo y pruebe de nuevo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="tab3" role="tabpanel" aria-labelledby="tab3">
                    <div class="accordion" id="accordion-tab-3">
                        <div class="card">
                            <div class="card-header" id="accordion-tab-3-heading-1">
                                <h5>
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#accordion-tab-3-content-1" aria-expanded="false" aria-controls="accordion-tab-3-content-1" data-hash="installError">¿Por qué no se instala bien el proyecto?</button>
                                </h5>
                            </div>
                            <div class="collapse show" id="accordion-tab-3-content-1" aria-labelledby="accordion-tab-3-heading-1" data-parent="#accordion-tab-3">
                                <div class="card-body">
                                    <p>A veces es problema del caché del comando que estés ejecutando o comprueba si es necesario tener acceso a internet para que descargue cierta dependencia.<br>Pruebe a ejecutar el comando de borrado de caché del comando que necesite usar para la instalación.<br><strong>En la mayoría de los casos, tras borrar caché, se volverán a descargar las dependencias desde internet.</strong></p>
                                </div>
                            </div>
						</div>
						<div class="card">
                            <div class="card-header" id="accordion-tab-3-heading-2">
                                <h5>
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#accordion-tab-3-content-2" aria-expanded="false" aria-controls="accordion-tab-3-content-1" data-hash="requirements">He instalado los requisitos del framework, pero sigue saliendome el error. ¿Por qué?</button>
                                </h5>
                            </div>
                            <div class="collapse" id="accordion-tab-3-content-2" aria-labelledby="accordion-tab-3-heading-2" data-parent="#accordion-tab-3">
                                <div class="card-body">
                                    <p>Si acabas de instalar los requisitos, comprueba que es accesible de forma global, borra el caché del navegador y vuelva a intentarlo.<br>Si el problema aún persiste, reinicie el dispositivo. Si esto aún no lo soluciona, compruebe que PHP CLI pueda acceder a dicho comando.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="tab4" role="tabpanel" aria-labelledby="tab4">
                    <div class="accordion" id="accordion-tab-4">
                        <div class="card">
                            <div class="card-header" id="accordion-tab-4-heading-1">
                                <h5>
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#accordion-tab-4-content-1" aria-expanded="false" aria-controls="accordion-tab-1-content-1">Me aparece error 404 Proyecto no detectado. ¿Por qué no detecta mi proyecto?</button>
                                </h5>
                            </div>
                            <div class="collapse show" id="accordion-tab-4-content-1" aria-labelledby="accordion-tab-4-heading-1" data-parent="#accordion-tab-1">
                                <div class="card-body">
                                    <p>Es necesario tener un archivo de texto llamado <strong>project-info.txt</strong> en la raiz del proyecto con la siguiente estructura:
                                    <code class="d-block p-2">
                                        name=nombre del proyecto<br>
                                        framework=nombre del framework
                                    </code>
								</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>