@capa("project")
@addTitle("<?php echo $get["name"]; ?>")
<div class="row" id="setting-content">
  <div class="col-12">
    <div class="tab-content" id="v-pills-tabContent">
      <div class="tab-pane fade show active" id="main-files" role="tabpanel" aria-labelledby="v-pills-quick-tab">
        <div class="card">
          <div class="card-header">Archivos principales</div>
          <div class="card-body">
            <div class="card-text">
              <div class="list-files"></div>
              <div class="file-content my-1 pt-2 row">
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
          <div class="card-footer">
            <button class="btn btn-success float-right invisible save-file"><i class="fa fa-sa"></i> Guardar</button>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="quick" role="tabpanel" aria-labelledby="v-pills-quick-tab">
        <div class="card">
          <div class="card-header">Acceso rápido</div>
          <div class="card-body">
            <form class="quickContent">
              <div class="alert alert-primary text-center">No hay creados botones de acceso rápido. <a href="{{assets(config)}}">¿Desea crearlos?</a></div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>