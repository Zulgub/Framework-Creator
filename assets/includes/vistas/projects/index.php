@capa("project")
@addTitle(" - <?php echo $get["name"]; ?>")
@addJs("assets/js/forms/"=>["form-render.min.js"],"assets/js/preview/"=>["html2canvas.js"])
<div class="row">
  <div class="col-12">
    <div class="tab-content" id="v-pills-tabContent">
      <div class="tab-pane fade show active" id="general" role="tabpanel" aria-labelledby="v-pills-quick-tab">
        <div class="card">
          <div class="card-header">Configuración general</div>
          <div class="card-body">
            <p class="card-text">
              <div class="form-group">
                <label for="name">Nombre del proyecto</label>
                <input type="text" name="name" id="name" value="<?php echo $get["name"]; ?>" class="form-control" autofocus placeholder="Nombre del proyecto">
                <div class="invalid-feedback">
                  ¡Debe establecer un nombre!
                </div>
              </div>
              <div class="form-group">
                <label for="folder">Nombre de la carpeta</label>
                <input type="text" name="folder" id="folder" value="<?php echo $get["proyecto"]; ?>" class="form-control" autofocus placeholder="Nombre del proyecto">
                <div class="invalid-feedback">
                  ¡Debe establecer un nombre para la carpeta!
                </div>
              </div>
            </p>
          </div>
          <div class="card-footer">
            <button class="btn btn-success float-right"><i class="fa fa-sa"></i> Guardar</button>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="quick" role="tabpanel" aria-labelledby="v-pills-quick-tab">
        <div class="card">
          <div class="card-header">Acceso rápido</div>
          <div class="card-body">
            <p class="card-text">Text</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>