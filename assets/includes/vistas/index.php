@capa("default")
@addJs("assets/js/forms/"=>["form-render.min.js"],"assets/js/preview/"=>["html2canvas.js"])
<div class="row p-0">
    <div class="col-xl-12">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-xl-2">
                        <h2 class="d-inline">Proyectos</h2>
                    </div>
                    <div class="col-xl-10">
                        <div class="row">
                            <div class="col-xl-3 offset-xl-4 my-1">
                                <input type="search" id="buscarProyecto" name="buscar" placeholder="Buscar..." readonly class="form-control">
                            </div>
                            <div class="col-xl-5 my-1">
                                <div class="btn-group" role="group">
                                    <label for="projectsUpload" id="readProject" class="btn btn-secondary m-0"><i class="fa fa-file-upload"></i> Cargar proyecto</label>
                                    <button class="btn btn-success newProject" data-toggle="modal" data-target="#modal"><i class="fa fa-plus"></i> Nuevo</button>
                                    <button class="btn btn-primary" id="actualizarProyectos"><i class="fa fa-sync"></i> Actualizar</button>
                                </div>
                                <input type="file" id="projectsUpload" class="d-none" name="projectsUpload" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row" id="projectlist">
                    <div class="lds-spinner mx-auto">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>