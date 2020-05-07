<?php
$error = isset($get["code"]) && !empty($get["code"]) ? $get["code"] : "404";
$info = isset($get["infoCode"]) && !empty($get["infoCode"]) ? $get["infoCode"] : "File not found";
?>
<html>
<title>Error</title>
<link rel="stylesheet" href="{{assets(assets/css/bootstrap.min.css)}}">
<link rel="stylesheet" href="{{assets(assets/css/error.css)}}">
<script defer src="{{assets(assets/js/error/stopExecutionOnTimeoutjs.js)}}"></script>
<script defer src="{{assets(assets/js/jquery-3.4.1.min.js)}}"></script>
<script defer src="{{assets(assets/js/error/error.js)}}"></script>
<script defer src="moz-extension://73d5556a-084e-4a03-930c-159b54478688/assets/prompt.js"></script>

<body>
    <div class="container Vh-100">
        <div class="row h-100">
            <div class="board m-auto">
                <div id="error" class="mb-4">
                    <span class="novacancy on"></span><span class="novacancy on">e</span><span class="novacancy on">r</span><span class="novacancy on">r</span><span class="novacancy on">o</span><span class="novacancy on">r</span><span class="novacancy on">
                    </span>
                </div>
                <div id="code" class="my-4">
                    <span class="novacancy on"></span>
                    <span class="novacancy on"><?php echo $error[0]; ?></span>
                    <span class="novacancy on"><?php echo $error[1]; ?></span>
                    <span class="novacancy on"><?php echo $error[2]; ?></span>
                    <span class="novacancy on"></span>
                </div>
                <div id="info" class="mt-4 pt-4"><?php echo $info; ?></div>
            </div>
        </div>
    </div>


</body>

</html>