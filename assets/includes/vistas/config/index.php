
    <div class="row p-0">
        <div class="col-xl-12">
            <div class="card">
                <h5 class="card-header">Frameworks <button id="newFramework" class="btn btn-success float-right"><i class="fa fa-plus"></i> Nuevo</button></h5>
                <div class="card-body">
                    <div class="row">
                        <div class="col-2">
                            <div class="list-group" id="list-tab" role="tablist">
                                <?php
                                echo $GLOBALS["app"]->listFrameworks();
                                ?>
                            </div>
                        </div>
                        <div class="col-10">
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