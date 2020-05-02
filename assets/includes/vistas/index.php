@capa("default")
@addJs("assets/js/forms/"=>["form-render.min.js"],"assets/js/preview/"=>["html2canvas.js"])
<div class="row p-0">
    <div class="col-xl-12">
        <div class="card">
            <div class="card-header">
                <h2 class="d-inline">Proyectos</h2>

                <div class="float-right">
                    <div class="row">
                        <div class="col-xl-4 my-1">
                            <input type="search" id="buscarProyecto" name="buscar" placeholder="Buscar..." readonly class="form-control">
                        </div>
                        <div class="col-xl-7 my-1">
                            <div class="btn-group" role="group">
                                <button class="btn btn-success newProject" data-toggle="modal" data-target="#modal"><i class="fa fa-plus"></i> Nuevo</button>
                                <button class="btn btn-primary" id="actualizarProyectos"><i class="fa fa-sync"></i> Actualizar</button>
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