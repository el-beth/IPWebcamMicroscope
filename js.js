function $(input){
	return document.querySelector(input);
}

var focusButton = $('#focus');
var zoomInButton = $('#zoomIn');
var zoomOutButton = $('#zoomOut');
var ledButton = $('#led');
var inputElement = $('input');
var submitElement = $('button#submit');
var focusRequestXHR = new XMLHttpRequest();
var zoomRequestXHR = new XMLHttpRequest();
var zoomLevel;
var ledOn;
var hostIP="";
var host="";
var genericXHR = new XMLHttpRequest();
var stat;

submitElement.onclick = () => {
	if (inputElement.value.search(/(\d{1,3}\.){3}\d{1,3}/g) == 0){		
		hostIP=inputElement.value;
		host=hostIP+':8080';
		genericXHR.open('GET', 'http://'+host+'/status.json');
		genericXHR.send();
		genericXHR.onreadystatechange = () => {
			if (genericXHR.readyState == 4 && genericXHR.status == 200){
				stat = JSON.parse(genericXHR.response);
				if (stat.curvals.torch == 'off'){
					ledOn=false;
				}else{
					ledOn=true;
				}
				zoomLevel=stat.curvals.zoom;
				$('#ipInput').remove();
				$('#frameContainer').innerHTML = '<img id="frame" src="http://'+host+'/video" alt="http://'+host+'/video">';
			}
		};
	};
};

focusButton.onclick = () => {
	focusRequestXHR.open('GET', 'http://'+host+'/focus');
	// focusRequestXHR.onreadystatechange = () => {console.log(focusRequestXHR.responseText);}
	focusRequestXHR.send();
};

function mapZoomToPtz(zoom){
	var ptz = zoom/10-10;
	if ( ptz < 0) return 0;
		else if (ptz > 30) return 30;
		else return ptz;
}

function setZoom(){
	zoomRequestXHR.open('GET',`http://${host}/ptz?zoom=${mapZoomToPtz(zoomLevel)}`);
	zoomRequestXHR.send();
}

zoomInButton.onclick = () => {
	zoomLevel+=10;
	if (zoomLevel > 400) zoomLevel=400;
	else if (zoomLevel < 100) zoomLevel=100;
	setZoom();
};

zoomOutButton.onclick = () => {
	zoomLevel-=10;
	if (zoomLevel<100) zoomLevel=100;
	else if (zoomLevel > 400) zoomLevel=400;
	setZoom();
};

ledButton.onclick = () => {
	if (ledOn == true){
		ledOn=false;
		zoomRequestXHR.open('GET', 'http://'+host+'/disabletorch');
		zoomRequestXHR.send();
	}else {
		ledOn=true;
		zoomRequestXHR.open('GET', 'http://'+host+'/enabletorch');
		zoomRequestXHR.send();
	}
}