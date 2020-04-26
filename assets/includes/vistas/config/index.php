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
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-3">
                        <div class="list-group" id="list-tab" role="tablist">
                            <?php
                            echo $GLOBALS["app"]->listFrameworks();
                            ?>
                        </div>
                    </div>
                    <div class="col-sm-9">
                        <div class="tab-content" id="nav-tabContent">
                            <?php
                            echo $GLOBALS["app"]->listSettingFrameworks();
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>