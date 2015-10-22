var http = require('http');
var gpio = require('gpio');
var util = require('util');

var port = 3001;
var ledPin = 1;

var server = http.createServer(function(req, res) {
  var data = '';
  if (req.url == '/') {
    res.writeHead(200, { 'Connection' : 'close',
                       'Content-Length' : htmldata.length
                       });
    res.end(htmldata);
  } else if (req.url == '/light') {
    onLight(req, res);
    //req = null;
  } else if (req.url == '/toggle') {
    onToggle(req, res);
    //req = null;
  } else if (req.url == '/favicon.ico') {
    res.end();
  }

  if (req.method == 'POST') {
    req.on('data', function(chunk) {
      console.log('data:'+chunk);
      data = data + chunk;
    });
    req.on('end', function() {
      try {
        var result = eval(data);
        data =null;
        if(util.isNullOrUndefined(result)){
          res.end('Undefind or Null');
        }
        else
          res.end(result.toString());
      }
      catch(e) {
        res.end(e);
      }
    });
  }

});


var htmldata = "<html><head><style> .CodeMirror { width: 500; } .button { background-color:#599bb3; border-radius:8px; display:inline-block; cursor:pointer; color:#ffffff; font-family:Arial; font-size:20px; font-weight:bold; padding:13px 32px; text-decoration:none; text-shadow:0px 1px 0px #3d768a;} .light { background-color:#000000; border-radius:20px; display:inline-block; cursor:pointer; color:#ffffff; font-family:Arial; font-size:20px; font-weight:bold; padding:13px 32px; text-decoration:none; text-shadow:0px 1px 0px #3d768a;} </style><script language='javascript' src='http://chunseoklee.github.io/CodeMirror/lib/codemirror.js'></script><link rel='stylesheet' href='http://chunseoklee.github.io/CodeMirror/lib/codemirror.css'><script language='javascript' src='http://chunseoklee.github.io/CodeMirror/mode/javascript/javascript.js'></script><script language='javascript'>function execute() {var xmlhttp = new XMLHttpRequest(); xmlhttp.onreadystatechange = function() {  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {       var result = document.getElementById('result');       result.innerHTML = xmlhttp.responseText;         }       };   xmlhttp.open('POST', '/code', true);  xmlhttp.setRequestHeader('Connection', 'close');  xmlhttp.send(myCodeMirror.getValue()); } function toggle(){var xmlhttp=new XMLHttpRequest(); xmlhttp.onreadystatechange = function() { if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { updateLight();} }; xmlhttp.open('PUT','toggle',true);xmlhttp.send();}function updateLight(){var xmlhttp=new XMLHttpRequest();xmlhttp.onreadystatechange=function(){if(xmlhttp.readyState==4&&xmlhttp.status==200){var state=xmlhttp.responseText;if(state=='on'){var light=document.getElementById('light');light.innerHTML='on';light.style.backgroundColor='#EEEE00';}else{var light=document.getElementById('light');light.innerHTML='off';light.style.backgroundColor='#000000';}}};xmlhttp.open('GET','light',true);xmlhttp.send();}</script> <link rel='stylesheet' href='http://chunseoklee.github.io/CodeMirror/theme/seti.css'> </head><body>    <script language='javascript'>      var myCodeMirror = CodeMirror(document.body,      {      value: '12+34',   mode:  'javascript',   lineNumbers: true, theme:'seti' });    </script><a href='javascript:execute();' class='button'>execute</a><p><p><textarea rows='5' cols='30' id='result'>Result</textarea><div><a href='javascript:toggle();'class='button'>LED1</a> <div class='light' id='light'>status</div></div> <script language='javascript'>updateLight();</script></body></html>";



function onLight(req, res) {
  gpio.readPin(ledPin, function(err, value) {
      res.writeHead(200);
      res.end(value ? "on" : "off");
  });
}

function onToggle(req, res) {
  gpio.readPin(ledPin, function(err, value) {
      gpio.writePin(ledPin, !value, function(err) {
        res.writeHead(200);
        res.end(value ? "on" : "off");
      });

  });
}

gpio.initialize();

gpio.on('initialize', function() {

  gpio.setPin(1, "out", function() {

    server.listen(port,1);
  });
});

//server.listen(port,1);
