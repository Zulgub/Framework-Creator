<html>


<head>
    <meta charset="utf-8">
    <title>JSON Form Renderer and Form Builder for Aurelia
    </title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <base href="/aurelia-formio/">

    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.0/mode-javascript.js">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.0/mode-json.js">
    </script>

    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.6/quill.min.js" type="text/javascript" defer="true" async="true">
    </script>
</head>

<body aurelia-app="main" class="">
    <div class="row">

        <div class="col-sm-8">
            <h3 class="text-center text-muted">The <a href="https://github.com/formio/aurelia-formio"
                    target="_blank">Form Builder</a> allows you to build a

                <formio form.bind="selectForm" change.delegate="displayChanged($event)" style="display:inline-block"
                    id="select-form" class="au-target" au-target-id="3">

                    <div ref="formio" class="au-target null formio-form" au-target-id="1">

                        <div style="visibility: visible; position: relative;">

                            <div id="ehqftf9"
                                class="form-group has-feedback formio-component formio-component-select formio-component-select "
                                style="">
                                <select name="data[select]" type="text" class="form-control" lang="en">

                                    <option>Form</option>

                                    <option>Wizard</option>

                                    <option>PDF</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </formio>
            </h3>


            <pre class="text-center"><code>&lt;form-builder change.delegate="formChanged($event)"&gt;&lt;/form-builder&gt;</code>
</pre>

            <form-builder form.bind="builderForm" change.delegate="formChanged($event)" class="au-target"
                au-target-id="4">

                <div ref="builder" class="au-target null formio-form row formbuilder" au-target-id="2">

                    <div class="col-xs-4 col-sm-3 col-md-2 formcomponents">

                        <div class="panel-group" style="margin-top: 0px;">

                            <div class="panel panel-default form-builder-panel" id="group-panel-basic">

                                <div class="panel-heading">
                                    <h4 class="panel-title"><a href="#group-basic">Basic Components</a></h4>
                                </div>

                                <div class="panel-collapse collapse in" id="group-basic">

                                    <div class="panel-body no-drop">

                                        <span id="builder-textfield"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-terminal" style="margin-right: 5px;"></i>Text Field
                                        </span>

                                        <span id="builder-number"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-hashtag" style="margin-right: 5px;"></i>Number
                                        </span>

                                        <span id="builder-password"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-asterisk" style="margin-right: 5px;"></i>Password
                                        </span>

                                        <span id="builder-textarea"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-font" style="margin-right: 5px;"></i>Text Area
                                        </span>

                                        <span id="builder-checkbox"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-check-square" style="margin-right: 5px;"></i>Checkbox
                                        </span>

                                        <span id="builder-selectboxes"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-plus-square" style="margin-right: 5px;"></i>Select Boxes
                                        </span>

                                        <span id="builder-select"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-th-list" style="margin-right: 5px;"></i>Select
                                        </span>

                                        <span id="builder-radio"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-dot-circle-o" style="margin-right: 5px;"></i>Radio
                                        </span>

                                        <span id="builder-content"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-html5" style="margin-right: 5px;"></i>Content
                                        </span>

                                        <span id="builder-button"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-stop" style="margin-right: 5px;"></i>Button
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="panel panel-default form-builder-panel" id="group-panel-advanced">

                                <div class="panel-heading">
                                    <h4 class="panel-title"><a href="#group-advanced">Advanced</a></h4>
                                </div>

                                <div class="panel-collapse collapse" id="group-advanced">

                                    <div class="panel-body no-drop">

                                        <span id="builder-email"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-at" style="margin-right: 5px;"></i>Email
                                        </span>

                                        <span id="builder-phoneNumber"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-phone-square" style="margin-right: 5px;"></i>Phone Number
                                        </span>

                                        <span id="builder-address"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-home" style="margin-right: 5px;"></i>Address Field
                                        </span>

                                        <span id="builder-datetime"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-calendar-plus-o" style="margin-right: 5px;"></i>Date / Time
                                        </span>

                                        <span id="builder-day"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-calendar" style="margin-right: 5px;"></i>Day
                                        </span>

                                        <span id="builder-tags"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-tags" style="margin-right: 5px;"></i>Tags
                                        </span>

                                        <span id="builder-currency"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-usd" style="margin-right: 5px;"></i>Currency
                                        </span>

                                        <span id="builder-htmlelement"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-code" style="margin-right: 5px;"></i>HTML Element
                                        </span>

                                        <span id="builder-resource"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-files-o" style="margin-right: 5px;"></i>Resource
                                        </span>

                                        <span id="builder-file"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-file" style="margin-right: 5px;"></i>File
                                        </span>

                                        <span id="builder-form"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-wpforms" style="margin-right: 5px;"></i>Nested Form
                                        </span>

                                        <span id="builder-signature"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-pencil" style="margin-right: 5px;"></i>Signature
                                        </span>

                                        <span id="builder-survey"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-list" style="margin-right: 5px;"></i>Survey
                                        </span>

                                        <span id="builder-location"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-map" style="margin-right: 5px;"></i>Location
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="panel panel-default form-builder-panel" id="group-panel-layout">

                                <div class="panel-heading">
                                    <h4 class="panel-title"><a href="#group-layout">Layout</a></h4>
                                </div>

                                <div class="panel-collapse collapse" id="group-layout">

                                    <div class="panel-body no-drop">

                                        <span id="builder-columns"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-columns" style="margin-right: 5px;"></i>Columns
                                        </span>

                                        <span id="builder-fieldset"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-th-large" style="margin-right: 5px;"></i>Field Set
                                        </span>

                                        <span id="builder-panel"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-list-alt" style="margin-right: 5px;"></i>Panel
                                        </span>

                                        <span id="builder-table"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-table" style="margin-right: 5px;"></i>Table
                                        </span>

                                        <span id="builder-tabs"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-folder-o" style="margin-right: 5px;"></i>Tabs
                                        </span>

                                        <span id="builder-well"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-square-o" style="margin-right: 5px;"></i>Well
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="panel panel-default form-builder-panel" id="group-panel-data">

                                <div class="panel-heading">
                                    <h4 class="panel-title"><a href="#group-data">Data</a></h4>
                                </div>

                                <div class="panel-collapse collapse" id="group-data">

                                    <div class="panel-body no-drop">

                                        <span id="builder-hidden"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-user-secret" style="margin-right: 5px;"></i>Hidden
                                        </span>

                                        <span id="builder-container"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-folder-open" style="margin-right: 5px;"></i>Container
                                        </span>

                                        <span id="builder-datagrid"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-th" style="margin-right: 5px;"></i>Data Grid
                                        </span>

                                        <span id="builder-editgrid"
                                            class="btn btn-primary btn-xs btn-block formcomponent drag-copy"><i
                                                class="fa fa-tasks" style="margin-right: 5px;"></i>Edit Grid
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="visibility: visible; position: relative;"
                        class="null col-xs-8 col-sm-9 col-md-10 formarea drag-container" id="builder-element-e0om3mr">

                        <div id="e4y15tn"
                            class="form-check form-group has-feedback formio-component formio-component-checkbox formio-component-checkbox2  checkbox"
                            style="position: relative;">

                            <div class="component-btn-group">

                                <div
                                    class="btn btn-xxs btn-danger component-settings-button component-settings-button-remove">

                                    <span class="glyphicon glyphicon-remove">
                                    </span>
                                </div>

                                <div
                                    class="btn btn-xxs btn-default component-settings-button component-settings-button-edit">

                                    <span class="glyphicon glyphicon-cog">
                                    </span>
                                </div>
                            </div>
                            <label class="control-label form-check-label">
                                <input name="data[checkbox2]" type="checkbox" class="form-check-input" value="0"
                                    lang="en">

                                <span>Checkbox
                                </span>
                            </label>
                        </div>

                        <div id="eczr8k"
                            class="form-group has-feedback formio-component formio-component-button formio-component-submit  form-group"
                            style="position: relative;">

                            <div class="component-btn-group">

                                <div
                                    class="btn btn-xxs btn-danger component-settings-button component-settings-button-remove">

                                    <span class="glyphicon glyphicon-remove">
                                    </span>
                                </div>

                                <div
                                    class="btn btn-xxs btn-default component-settings-button component-settings-button-edit">

                                    <span class="glyphicon glyphicon-cog">
                                    </span>
                                </div>
                            </div><button name="data[submit]" type="submit" class="btn btn-primary btn-md"
                                lang="en">Submit</button>
                        </div>
                    </div>
                </div>
            </form-builder>
        </div>

        <div class="col-sm-4">
            <h3 class="text-center text-muted">as JSON Schema</h3>

            <div class="well jsonviewer">


            </div>
        </div>
    </div>

    <div class="row">

        <div class="col-sm-8 col-sm-offset-2">
            <h3 class="text-center text-muted">which <a href="https://github.com/formio/aurelia-formio"
                    target="_blank">Renders as a Form</a> in your Application</h3>


            <pre class="text-center"><code>&lt;formio form.bind="form" change.delegate="submissionChanged($event)"&gt;&lt;/formio&gt;</code>
</pre>

            <div class="well">

                <formio form.bind="form" change.delegate="submissionChanged($event)" class="au-target" au-target-id="6"></formio>
            </div>
        </div>

        <div class="clearfix">
        </div>
    </div>

    <div class="row">

        <div class="col-sm-8 col-sm-offset-2">
            <h3 class="text-center text-muted">which creates a Submission JSON</h3>

            <div class="well jsonviewer">


                <pre ref="subjson" class="au-target" au-target-id="7">{
    "checkbox2": false
}
</pre>
            </div>
        </div>

        <div class="clearfix">
        </div>
    </div>

    <div class="row">

        <div class="col-sm-10 col-sm-offset-1 text-center">
            <h3 class="text-center text-muted">which submits to our API Platform</h3>

            <p>hosted or on-premise</p> <a href="https://form.io" target="_blank"><img style="width:100%"
                    src="https://help.form.io/assets/img/formioapi2.png"></a>
        </div>
    </div>

    <div class="row" style="margin-top:40px">

        <div class="col-sm-12 text-center"> <a href="https://form.io" target="_blank" class="btn btn-lg btn-success">Get
                Started</a>
        </div>
    </div>

    <div class="row well" style="margin-top:50px">

        <div class="container">

            <div class="row">

                <div class="col-lg-12 text-center">
                    <h2 class="section-heading">We are Open Source!</h2>
                    <h3 class="section-subheading text-muted">We are proud to offer our core Form &amp; API platform as
                        Open Source.</h3>
                    <h3 class="section-subheading text-muted">Find us on GitHub @ <a
                            href="https://github.com/formio/formio" target="_blank">https://github.com/formio/formio</a>
                    </h3>
                </div>
            </div>

            <div class="row">

                <div class="col-md-4"><a href="https://github.com/formio/formio" target="_blank"><img
                            class="img-responsive" src="https://form.io/assets/images/github-logo.png"></a>
                </div>

                <div class="col-md-8">

                    <p>Getting started is as easy as...</p>


                    <pre style="background-color:#fff">git clone https://github.com/formio/formio.git
cd formio
npm install
node server
</pre>
                </div>
            </div>
        </div>
    </div>
</body>

</html>