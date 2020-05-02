@capa("default")
@addTitle(" - configuración")
@addCss("assets/css/tableEditor/"=>["datatables.min.css","generator-base.css","editor.bootstrap4.min.css","jquery.dataTables.min.css","rowReorder.dataTables.min.css"])
@addJs("assets/js/tableEditor/"=>["jquery.dataTables.min.js","dataTables.rowReorder.min.js","datatables.min.js","dataTables.editor.min.js","editor.bootstrap4.min.js"], "assets/js/forms/"=>["form-builder.min.js"])
<div class="row p-0">
    <div class="col-xl-12">
        <div class="card">
            <h5 class="card-header">Frameworks <button id="newFramework" class="btn btn-success float-right" data-toggle="modal" data-target="#modal"><i class="fa fa-plus"></i> Añadir</button>
                <label for="files" class="btn btn-secondary float-right mr-2"><i class="fa fa-file-upload"></i> Cargar archivo de configuración </label>
                <input type="file" id="files" class="d-none" name="files" /></h5>
            <div class="card-body frame-body">
                <div class="lds-spinner d-block mx-auto">
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