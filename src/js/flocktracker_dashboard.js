var infoPanel = new function() {
  var that = this;
  this.elem = document.getElementById("infoPanel"); 
  var style = window.getComputedStyle(this.elem);
  this.panelWidth = parseInt(style.getPropertyValue('width')); 
  this.animationInterval = null;
  this.closeInfoPanelButton = document.getElementById("closeInfoPanelButton");
  this.closeInfoPanelButton.onclick = function(){that.animateOut()};
  this.onAnimationEnd = null;
  this.animateIn = function(){
    if(this.animationInterval != null){
      clearInterval(that.animationInterval);
      this.animationInterval = null;
    }
    this.animationInterval = this.animate(0);
  }

  this.setContent = function(innerHtml){
    var div = document.getElementById("elementInfoContainer");
    div.innerHTML = innerHtml;
  }

  this.animateOut = function(){
    if(this.animationInterval != null){
      clearInterval(that.animationInterval);
      this.animationInterval = null;
    }
    this.animationInterval = this.animate(- this.panelWidth);
  }


  this.animate = function(endPosition){
    var totalTimeMillis = 300;
    var frameRate = 80; // Frames pe second.
    var refreshRate = 1000/frameRate; // time between frames 
    var tolerance = 0.005;
    var style = window.getComputedStyle(this.elem);
    var pos = parseInt(style.getPropertyValue('right'));
    var upperTolerance = endPosition + ((endPosition - pos)*tolerance);
    var lowerTolerance = endPosition - ((endPosition - pos)*tolerance);
    var endPositionUpperTolerance = Math.max(upperTolerance, lowerTolerance);
    var endPositionLowerTolerance = Math.min(upperTolerance, lowerTolerance);
    var movementInterval = (endPosition - pos)/(totalTimeMillis/ refreshRate); // The movement on each step.
    var interval = setInterval(frame, refreshRate);
    function frame() {
      if ((pos <= endPositionUpperTolerance) && (pos >= endPositionLowerTolerance)) {
        clearInterval(interval);
        that.animationInterval = null;
      } else {
        pos = pos + movementInterval;
        that.elem.style.right = pos + 'px'; 
      }
    }
    return interval;
  }
}

function fillQuestionSelector(selector, survey){
	var chapters = survey.getChapters();
	for (var i = 0; i < chapters.length; i++) {
	 	var questions = chapters[i].getQuestions();
	 	for (var j = 0; j < questions.length; j++) {
	 		var option = document.createElement("option");
	 		if(questions[j].getKind() == "MC"){
	 			option.value = questions[j].getQuestionID();
		 		option.innerHTML = questions[j].getQuestionID();
		 		selector.add(option);
	 		}
	 	};
	};
}

function fillUsersSelector(){
	var usersInSE = tables.trackerEndSurvey.data().order("Username asec").distinct("Username");
	var selector = document.getElementById("userSelector");
	for (var j = 0; j < usersInSE.length; j++) {
	 	var option = document.createElement("option");
	 	option.value = usersInSE[j];
		option.innerHTML = usersInSE[j];
		selector.add(option);
	};
	selector.onchange = function(){
		if(this.selectedIndex == 0){
			map.removeLayer(tripLayer);
			tripLayer = new L.mapbox.featureLayer("tripLayer").addTo(map);
			drawTrips(tables.tracker.trips);
			map.fitBounds(tripLayer.getBounds());
		} else {
			map.removeLayer(tripLayer);
			tripLayer = new L.mapbox.featureLayer("tripLayer").addTo(map);
			var selectedUser = this.options[this.selectedIndex].value;
			var userTrips = getTripsByUser(selectedUser);
			drawTrips(userTrips);
			map.fitBounds(tripLayer.getBounds());
		}
	}
}

/*		function redrawTrips(){
	map.removeLayer(tripLayer);
	tripLayer = new L.mapbox.featureLayer("tripLayer").addTo(map);
	var userSelector = document.getElementById("userSelector");
	var trips;
	//Getting all the trips to be shown based on selected users;
	if(userSelector.selectedIndex != 0){
		var selectedUser = userSelector.options[userSelector.selectedIndex].value;
		trips = getTripsByUser(selectedUser);
	} else{
		trips = tables.tracker.trips;
	}
	//Drawing trips
	drawTrips(trips);
	map.fitBounds(tripLayer.getBounds());
	//Styling depending on 
	var questionSelector = document.getElementById("questionFilterSelector");
	if(questionSelector.selectedIndex != 0){
		var div = document.getElementById("tripKey");
			div.innerHTML = "";
	} else{
		var selected = questionSelector.options[questionSelector.selectedIndex].value;
			showColorCodedTripData(selected);
	}			







}*/

function showColorCodedTripData(selected){
		var options = getPossibleOptions(selected, project.getTrackerProject().getEndSurvey().getSurvey());
		var colors = getColors(options.length, defaultColors);
		showTripKey(selected, options, colors);
		styleTrips(selected, options, colors);
}

function showColorCodedSurveyData(selected){
		var options = getPossibleOptions(selected, project.getSurveyProject().getSurvey());
		var colors = getColors(options.length, defaultColors);
		styleSurveys(selected, options, colors);
}

function showTripKey(variable, options, colors){
	var div = document.getElementById("tripKey");
	div.innerHTML = "<h3>" + variable + "</h3>";
	for (var i = 0; i < options.length; i++) {
		var line = document.createElement("span");
		var square = getSquare(colors[i]);
		square.className = "keyColor";
		line.appendChild(square);
		var text = document.createElement("span");
		text.className = "keyText";
		text.innerHTML = options[i].text;
		line.appendChild(text);
		div.appendChild(line);
		if(i != options.length - 1){
			div.appendChild(document.createElement("br"));
		}
	};
}

function addSurveyDataToContainer(dataList, survey, container){
	var dataList = dataList;
	var container = container;
	var survey = survey;
	for (data in dataList) {
        if (dataList.hasOwnProperty(data)) {
        	var q = survey.getQuestionById(data);
        	var isPicture = false;
        	if(q != null){
        		if(q.getKind() == "IM"){
        			isPicture = true;
        		}
            	var line = document.createElement("span");
            	var name = document.createElement("b");
				name.innerHTML = data + " : ";
				var content = null;
            	if(isPicture){
            		image = document.createElement("img");
					image.src = dataList[data];
					image.className = "tripInfoThumbnail";
					content = document.createElement("div");
					content.appendChild(image);
					content.className = "tripInfoThumbnailContainer";
					line.appendChild(name);
					line.appendChild(document.createElement("br"))
					line.appendChild(content);
            	} else {
					content = document.createElement("span");
					var answer = getAnswerByValue(survey, data, dataList[data]);
					if (answer != null){
						content.innerHTML = answer.getAnswerText();
					} else {
						content.innerHTML = dataList[data];
					}
					line.appendChild(name);
					line.appendChild(content);
            	}
				container.appendChild(line);
				container.appendChild(document.createElement("br")); 
        	}
        }
    }
}

function getAnswerByValue(survey, questionID, value){
	var question = survey.getQuestionById(questionID);
	var answer = null;
	if (question != null){
		if(((question.getKind() == "MC") || (question.getKind() == "OL")) || (question.getKind() == "CB") ){
			var answers = question.getAnswers();
			for (var i = 0; i < answers.length; i++) {
				if(answers[i].getValue() == value){
					answer = answers[i];
				}
			};
		}
	}
	return answer;
}

function getSquare(color) {	
    	var c = document.createElement("canvas")
		var ctx = c.getContext("2d");
		c.width = 20;
		c.height = 20;
		ctx.rect(0, 0, 20, 20);
		ctx.fillStyle = color;
		ctx.fill();
		return c;
}

// Deletes the keys in keyArray from given obj and returns the clean obj.
// It only checks for the outermost layer of keys.
function deleteKeysFromObject(obj, keyArray){
	var newObj = {};
	for (data in obj) {
        if (obj.hasOwnProperty(data)) {
        	if(keyArray.indexOf(data) == -1){
        		newObj[data] = obj[data];
        	}
        }
    }
	return newObj;
}

function styleTrips(variable, options, colors){
	if(variable == null){
		for (trip in tables.tracker.trips) {
	        	if (tables.tracker.trips.hasOwnProperty(trip)) {
        			var lineStyle = {};
					lineStyle.color = "#000";
					lineStyle.fillOpacity = 1;
					tables.tracker.trips[trip].line.setStyle(lineStyle);
	        	}
	        }
	} else {
		if(variable in customStyles){

		} else {
			var tripsInSE = tables.trackerEndSurvey.data().distinct("TripID");
			for (trip in tables.tracker.trips) {
	        	if (tables.tracker.trips.hasOwnProperty(trip)) {
	        		if(tripsInSE.indexOf(trip) > 0){
	        			query = {};
						query.TripID = trip;				
						var tripData = tables.trackerEndSurvey.data(query).get()[0];
						var answerIndex = getAnswerIndex(tripData[variable], options);
						var lineStyle = {};
						lineStyle.color = colors[answerIndex];
						tables.tracker.trips[trip].line.setStyle(lineStyle);
	        		} else {
	        			var lineStyle = {};
						lineStyle.color = "#000";
						lineStyle.fillOpacity = 1;
						tables.tracker.trips[trip].line.setStyle(lineStyle);
	        		}
	        	}
	        }
		}
	}
}

function styleSurveys(variable, options, colors){
	console.log(variable, options, colors);
	if(variable == null){
		for (survey in tables.survey.surveys) {
			if (tables.survey.surveys.hasOwnProperty(survey)) {
				tables.survey.surveys[survey].marker.changeIcon(FT_Icon);
			}
		}
	} else {
		if(variable in customStyles){

		} else {
			var surveysInProject = tables.survey.data().distinct("SurveyID");
			for (survey in tables.survey.surveys) {
				if (tables.survey.surveys.hasOwnProperty(survey)) {
					if(surveysInProject.indexOf(survey) > 0){
						query = {};
						query.SurveyID = survey;				
						var surveyData = tables.survey.data(query).get()[0];
						try{
							var answerIndex = getAnswerIndex(surveyData[variable], options);
							var colorHash = colors[answerIndex];
							var colorNoHash = colorHash.replace("#", "");
							var url = window.location.href;
							url = url.substring(0, url.lastIndexOf("/") + 1) + '/img/ft_' + colorNoHash + '.png';
							var new_icon = L.icon({
								iconUrl: url,
								iconSize: [25, 30],
							});
							tables.survey.surveys[survey].marker.changeIcon(new_icon);
						} catch(error) {
							tables.survey.surveys[survey].marker.changeIcon(FT_Icon);
						}
					} else {
						tables.survey.surveys[survey].marker.changeIcon(FT_Icon);
					}
				}
			}
		}
	}
}

function getAnswerIndex(value, options){
	for (var i = 0; i < options.length; i++) {
		if ((options[i].value == value) || (options[i].text == value)){
			return i;
		}
	};
	throw "Value not in options";
}
function getColors(numberOfColors, colorPool){
	if(numberOfColors <= colorPool.length){
		var colorArray = [];
		var interval = (colorPool.length - 1)/(numberOfColors - 1);
		for (var i = 0; i < numberOfColors; i++) {
			var index = Math.floor(i * interval);
			colorArray.push(colorPool[index]);
		};
	} else {
		throw "Asking for more color than present in the pool";
	}
	return colorArray;
}
function getPossibleOptions (variable, survey){
	var surv = survey;
	var q = surv.getQuestionById(variable);
	var posAnswersInDB = tables.trackerEndSurvey.data().order(variable + " asec").distinct(variable);
	var posAnswerTextInPr = [];
	var posAsnwerValueInPr = [];
	if (q.getKind() == "MC"){
		var answers = q.getAnswers();
		for (var i = 0; i < answers.length; i++) {
			if(answers[i].getValue() != null){
				posAnswerTextInPr[i] = answers[i].getAnswerText();
				posAsnwerValueInPr[i] = answers[i].getValue();
			} else {
				posAnswerTextInPr[i] = answers[i].getAnswerText();
				posAsnwerValueInPr[i] = answers[i].getAnswerText();
			}
		};
	}
	var extraAns = posAnswersInDB.filter(function(x) { return posAsnwerValueInPr.indexOf(x) < 0 });
	var options = [];
	for (var i = 0; i < posAnswerTextInPr.length; i++) {
		var opt = {};
		opt.text = posAnswerTextInPr[i];
		opt.value = posAsnwerValueInPr[i];
		options.push(opt);
	};
	for (var i = 0; i < extraAns.length; i++) {
		var opt = {};
		opt.text = extraAns[i];
		opt.value = extraAns[i];
		options.push(opt);
	};
	return options;
}
function getWhatToGet(columns){
  	var whatToGet = "";
  	for (var i = 0; i < columns.length; i++){
  		whatToGet = whatToGet + columns[i].name + ", ";
  	}
  	whatToGet = whatToGet.substring(0, whatToGet.length - 2);
  	return whatToGet;
	}
	function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
function populateColumnNames(){
	for (property in tables) {
        if (tables.hasOwnProperty(property)) {
			tables[property].columns = getFTcolumnlist(tables[property].id);
        }
    }
}
function populateTableData(){
	for (property in tables) {
        if (tables.hasOwnProperty(property)) {
        	var columns = getWhatToGet(tables[property].columns);
			tables[property].data = getTableData(tables[property].id, columns);
			if(property == "tracker"){
				tables[property].trips = getTripData();
			}
			if(property == "survey"){
				tables[property].surveys = getSurveyData();
			}
        }
    }
}
function getFTcolumnlist(tableID){
	var query = "https://www.googleapis.com/fusiontables/v2/tables/" + tableID + "/columns?key=AIzaSyCyOfjR4LVvpwhsb4UfAT0AINBB19cbfUc";
	return parseColumnNames(httpGet(query));
}
function getProject(projectName){
	var query = 'SELECT survey_json FROM ' + projectsTableID + " WHERE table_id='" + projectName + "'";
	var url = "https://www.googleapis.com/fusiontables/v1/query?sql=" + encodeURIComponent(query) + "&key=AIzaSyCyOfjR4LVvpwhsb4UfAT0AINBB19cbfUc";
	var response = JSON.parse(httpGet(url));
	var projectLB = new FT_pr()
	var project = new projectLB.project();
	project.deserializeJSON(response.rows[0][0]);
	return project;
}
function getTableData(tableID, whatToGet){
	var query = 'SELECT ' + whatToGet + ' FROM ' + tableID;
	var url = "https://www.googleapis.com/fusiontables/v1/query?sql=" + encodeURIComponent(query) + "&key=AIzaSyCyOfjR4LVvpwhsb4UfAT0AINBB19cbfUc";
	return parseTableData(httpGet(url));
}
function parseTableData(response){
	var obj = JSON.parse(response);
	var columns = obj.columns;
	var db = TAFFY();
	var rows = obj.rows;
	for (var j = 0; j < rows.length; j++) {
		var elem = {};
		for (var i = 0; i < columns.length; i++) {
			elem[columns[i]] = rows[j][i];
			if(columns[i] == "Date"){
				var date = Date.parse(replaceAll("-", "/", rows[j][i])).toString();
				elem.timeStamp = date;
			}
		};
		db.insert(elem);
	};
	return db;
}
function initializeTables(){
	var tables = {};
	tables.trackerEndSurvey = {};
	tables.trackerEndSurvey.id = "1v0cqJR0_t5Q7ONKSHMnlwovMLRZ-HaexJCWhZZ5w"// project.getTrackerProject().getEndSurvey().getTableID();
	tables.trackerStartSurvey = {};
	tables.trackerStartSurvey.id = "1KLJBgh0aBg9AIEMxBMSDCDXAS0y4brPSEfhvs5Tj"//project.getTrackerProject().getStartSurvey().getTableID();
	tables.tracker = {};
	tables.tracker.id = "1iIRhahFFa2G9o3EjunNamHuVMNeI1Wb5ZWFb6jdI"//project.getTrackerProject().getTracker().getTableID();
	tables.survey = {};
	tables.survey.id = "15TO6ipqB7MYZLfGCmyUxQdD5dJKGhzEijHgOk9zY" //project.getSurveyProject().getTableID();
	return tables;
}
function parseColumnNames(response){
	var obj = JSON.parse(response);
	var items = obj.items;
	var columns = [];
	for (var i = 0; i < items.length; i++) {
		columns[i] = {};
		columns[i].name = items[i].name;
		columns[i].type = items[i].type;
	};
	return columns;
}
function getSurveyData(){
	var surveyObj = {};
	var surveys = tables.survey.data().distinct("SurveyID");
	for (var i = 0; i < surveys.length; i++) {
		surveyObj[surveys[i]] = {};
		var query = {};
		query.SurveyID = surveys[i];				
		var survey = tables.survey.data(query).order("timeStamp").get();
		var point = [];
		if(survey.length > 0){
			if((isFinite(Number(String(survey[0].Lat))))&&(isFinite(Number(String(survey[0].Lng))))){
				point = [survey[0].Lat, survey[0].Lng];
			}
		}
		surveyObj[surveys[i]].point = point;
	}
	return surveyObj;
}
function getTripData(){
	//TODO fix this to make it work with two point lines.
	var trips = tables.tracker.data().distinct("TripID");
	var tripsStart = tables.trackerEndSurvey.data().distinct("TripID");
	var tripsEnd = tables.trackerStartSurvey.data().distinct("TripID");
	trips = trips.concat(tripsStart);
	trips = trips.concat(tripsEnd);
	//Filtering out repeated items.
	trips = trips.filter(function (item, pos) {return trips.indexOf(item) == pos});
	var tripObj = {};
	for (var i = 0; i < trips.length; i++) {
		tripObj[trips[i]] = {};
		var query = {};
		query.TripID = trips[i];				
		var trip = tables.tracker.data(query).order("timeStamp").get();
		var points = [];
		var tsSurvey = tables.trackerStartSurvey.data(query).get();
		if(tsSurvey.length > 0){
			if((isFinite(Number(String(tsSurvey[0].Lat))))&&(isFinite(Number(String(tsSurvey[0].Lng))))){
				var tsPoint = [tsSurvey[0].Lat, tsSurvey[0].Lng];
				points.push(tsPoint);
			}
		}
		for (var j = 0; j < trip.length; j++) {
			if((isFinite(Number(String(trip[j].Lat))))&&(isFinite(Number(String(trip[j].Lng))))){
				var point = [trip[j].Lat, trip[j].Lng];
				points.push(point);
			}
		};
		var teSurvey = tables.trackerEndSurvey.data(query).get();
		if(teSurvey.length > 0){
			if((isFinite(Number(String(teSurvey[0].Lat))))&&(isFinite(Number(String(teSurvey[0].Lng))))){
				var tePoint = [teSurvey[0].Lat, teSurvey[0].Lng];
				points.push(tePoint);
			}
		}
		tripObj[trips[i]].points = points;
		tripObj[trips[i]].totalDistance = getTripDistance(points);
	};
	return tripObj;
}
function getTripDistance(points){
	var totalDistance = 0;
	if(points.length > 1){
		for (var i = 1; i < points.length; i++) {
			totalDistance = totalDistance + getDistance(points[i][0], points[i][1], points[i-1][0], points[i-1][1]);
		};
	}
	return totalDistance;
}
function drawSurveys(surveys){
	this.surveys = surveys;
	var that = this;
    i = 0;
    var totalTimeMillis = 1000;
    var drawInterval = totalTimeMillis/surveys.length;
    var interval = setInterval(function() {
        if (i < surveys.length) {
        	drawSurvey(that.surveys[i]);
            i++;
        } else {
            clearInterval(interval);
        }
    }, drawInterval)
}
function drawSurvey(survey){
	tables.survey.surveys[survey].marker = new marker(survey);
	tables.survey.surveys[survey].marker.addToMapLayer(surveyLayer, FT_Icon);
}
var marker = function(surveyID){
	this.surveyID = surveyID;
	that = this;
	this.marker = null;
	this.layer = null;
	this.addToMapLayer = function(layer, icon){
		this.layer = layer;
		var coord = tables.survey.surveys[this.surveyID].point;
		this.marker = L.marker(coord, {icon: icon}).addTo(layer);
		this.marker.surveyID = this.surveyID;
		this.marker.on("click", function(){
			onSurveyClick(that.surveyID);
		});
		//mark.bindPopup(getSurveyContentPopUp(that.surveyID))
	}
	this.changeIcon = function(icon){
		this.layer.removeLayer(this.marker);
		this.addToMapLayer(this.layer, icon);
	}
}

getTrackerContentPopUp = function(tripID){
	var query = {};
	query.TripID = tripID;				
	var trackerEndTripData = tables.trackerEndSurvey.data(query).get()[0];
	var trackerStartTripData = tables.tracker.data(query).get()[0];
	var div = document.createElement("div");
	div.className = "marker_info_container"
	div.innerHTML = "<h3>" + tripID + "</h3>";	
	for (var i = 0; i < mainInfo.length; i++) {
		var name = document.createElement("b");
		name.innerHTML = mainInfo[i] + " : ";
		var value = document.createElement("span");
		value.innerHTML = trackerEndTripData[mainInfo[i]];
		var line = document.createElement("span");
		line.appendChild(name);
		line.appendChild(value);
		div.appendChild(line);
		div.appendChild(document.createElement("br")); 
	};
	var name = document.createElement("b");
	name.innerHTML = "Total distance" + " : ";
	var value = document.createElement("span");
	value.innerHTML = ((tables.tracker.trips[tripID].totalDistance * 1000).toFixed(2)) + " m";
	var line = document.createElement("span");
	line.appendChild(name);
	line.appendChild(value);
	div.appendChild(line);
	div.appendChild(document.createElement("br")); 
	var name = document.createElement("b");
	name.innerHTML = "Number of points" + " : ";
	var value = document.createElement("span");
	value.innerHTML = tables.tracker.trips[tripID].points.length;
	var line = document.createElement("span");
	line.appendChild(name);
	line.appendChild(value);
	div.appendChild(line);
	div.appendChild(document.createElement("br"));
	var elemToDelete = mainInfo.concat(removeInfo);
	// Drawing tracker Start data
	var dataToShowStart = deleteKeysFromObject(trackerStartTripData, elemToDelete);
	var startSurv = project.getTrackerProject().getStartSurvey().getSurvey();
	addSurveyDataToContainer(dataToShowStart, startSurv, div);

	// Drawing tracker End data
	var dataToShowEnd = deleteKeysFromObject(trackerEndTripData, elemToDelete);
	var endSurv = project.getTrackerProject().getEndSurvey().getSurvey();
	addSurveyDataToContainer(dataToShowEnd, endSurv, div);
	return div;
}

getSurveyContentPopUp = function(surveyID){
	var content = document.createElement("div");
		var query = {};
		query.SurveyID = surveyID;
		var surveyData = tables.survey.data(query).get()[0];
		var survey = project.getSurveyProject().getSurvey();
		addSurveyDataToContainer(surveyData, survey, content);
		return content;
}

function drawTrips(trips){
	for (property in trips) {
        if (trips.hasOwnProperty(property)) {
        	if(property != "null"){
				drawTrip(property);
			}
        }
    }
}
function drawTrip(trip){
	if(tables.tracker.trips[trip].totalDistance < 0.01){
		tables.tracker.trips[trip].line = L.polyline(tables.tracker.trips[trip].points, onePointTripStyle);
	} else {
		tables.tracker.trips[trip].line = L.polyline(tables.tracker.trips[trip].points, defaultLineStyle);
	}
	tables.tracker.trips[trip].line.addTo(tripLayer);
	tables.tracker.trips[trip].line.tripID = trip;
	tables.tracker.trips[trip].line.on("click", function(){
		onTripClick(this.tripID);
	});
}
function onTripClick(tripID){
	//tables.tracker.trips[tripID].line.setStyle(selectedStyle);
	map.fitBounds(tables.tracker.trips[tripID].line.getBounds());
	infoPanel.setContent(getTrackerContentPopUp(tripID).outerHTML);
	infoPanel.animateIn();
}
function onSurveyClick(surveyID){
	infoPanel.setContent(getSurveyContentPopUp(surveyID).outerHTML);
	infoPanel.animateIn();
}
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

function getDistance(lat1, lng1, lat2, lng2){
	var d = 0;
	if(((isFinite(Number(String(lat1))))&&(isFinite(Number(String(lng1)))))&&((isFinite(Number(String(lat2))))&&(isFinite(Number(String(lng2)))))){
		var R = 6371; // km
		var dLat = (lat2-lat1).toRad();
		var dLng = (lng2-lng1).toRad();
		var lat1 = lat1.toRad();
		var lat2 = lat2.toRad();

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		        Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		d = R * c;
	}
	return d;
};

function getTripsByUser(user){
	var userTrips = tables.tracker.data({"Username":user}).distinct("TripID");
	var userTripsObj = {};
	for (var i = 0; i < userTrips.length; i++) {
		if(tables.tracker.trips.hasOwnProperty(userTrips[i])){
			userTripsObj[userTrips[i]] = tables.tracker.trips[userTrips[i]];
		}
	};
	return userTripsObj;
}


/*		var defaultColors = [
	"#9e0142",
	"#d53e4f",
	"#f46d43",
	"#fdae61",
	"#fee08b",
	"#ffffbf",
	"#e6f598",
	"#abdda4",
	"#66c2a5",
	"#3288bd",
	"#5e4fa2"
];*/
var defaultColors = [
	"#FCFC00",
	"#FC5400",
	"#FC0000",
	"#840000",
	"#840084",
	"#848484",
	"#84FC0C",
	"#48003C",
	"#FCA800",
	"#545430",
	"#003090",
	"#3CE4FC",
	"#18A800"
];
var selectedStyle = {
	weight : 12,
	opacity : 1
}
var defaultLineStyle  = {
	color: '#000',
	weight : 6,
	opacity : 0.6,
	lineCap: "butt",
	lineJoin: "round",
	dashArray : "20 1 20 1 2 1 20 1 2 1 2 1 20 1 2 1 2 1 2 1 20 1 2 1 2 1 2 1 2 1 20 1 2 1 2 1 2 1 2 1 2 1 20 1 2 1 2 1 2 1 2 1 20 1 2 1 2 1 2 1 20 1 2 1 2 1 20 1 2 1"
};
var onePointTripStyle = {
	color: '#000',
	weight : 8,
	opacity : 0.8,
	lineCap: "square",
	lineJoin: "round",
	dashArray : "20 1 20 1 2 1 20 1 2 1 2 1 20 1 2 1 2 1 2 1 20 1 2 1 2 1 2 1 2 1 20 1 2 1 2 1 2 1 2 1 2 1 20 1 2 1 2 1 2 1 2 1 20 1 2 1 2 1 2 1 20 1 2 1 2 1 20 1 2 1"
}
var url = window.location.href;
url = url.substring(0, url.lastIndexOf("/") + 1) + '/img/ft.png';
var FT_Icon = L.icon({
	iconUrl: url,
	iconSize: [25, 30],
});
var customStyles = {};
var mainInfo = ["Username", "TripID", "Date"];
var surveyMainInfo = ["Username", "SurveyID", "Date"];
var removeInfo = ["Location", "Lat", "Lng", "Alt", "Speed", "___id", "___s", "timeStamp"];
	var projectsTableID = "1ozk50GfhDEchXBiPwnmMZ1pTdEtGJmmJPq3zK704";
L.mapbox.accessToken = 'pk.eyJ1IjoiYnV6b2hlcmJlcnQiLCJhIjoibXJXclpEVSJ9.YxiPmO7Q5QZrOGCuOsAYQg';
var map = new L.mapbox.map('map', 'buzoherbert.mn20inga');
var tripLayer = new L.mapbox.featureLayer().addTo(map);
var surveyLayer = new L.mapbox.featureLayer().addTo(map);
var project = getProject("walktracker");
var tables = initializeTables();

var tripQuestionSelector = document.getElementById("tripQuestionFilterSelector");
fillQuestionSelector(tripQuestionSelector, project.getTrackerProject().getEndSurvey().getSurvey());
tripQuestionSelector.onchange = function(){
	if(this.selectedIndex == 0){
		var div = document.getElementById("tripKey");
		div.innerHTML = "";
		styleTrips(null, null, null);
	} else {
		var selected = this.options[this.selectedIndex].value;
		showColorCodedTripData(selected);
	}
}

var surveyQuestionSelector = document.getElementById("surveyQuestionFilterSelector");
fillQuestionSelector(surveyQuestionSelector, project.getSurveyProject().getSurvey());
surveyQuestionSelector.onchange = function(){
	if(this.selectedIndex == 0){
		var div = document.getElementById("tripKey");
		//div.innerHTML = "";
		//styleTrips(null, null, null);
	} else {
		var selected = this.options[this.selectedIndex].value;
		showColorCodedSurveyData(selected);
	}
}


populateColumnNames();
populateTableData();
fillUsersSelector();
drawTrips(tables.tracker.trips);
//map.fitBounds(tripLayer.getBounds());
 map.fitBounds([[
		1.330277595775582,
		103.72748136520386
], [
	1.3445859640103923,
	103.7567925453186
]]);
var surveysCheckbox = document.getElementById("survey_checkbox");
surveysCheckbox.onchange = function(){
	if(this.checked){
		clearSurveys();
		surveyLayer = new L.mapbox.featureLayer().addTo(map);
		drawSurveys(tables.survey.data().distinct("SurveyID"));
	} else {
		clearSurveys();
	}
}
var trackerCheckbox = document.getElementById("tracker_checkbox");
trackerCheckbox.onchange = function(){
	if(this.checked){
		clearTrips();
		tripLayer = new L.mapbox.featureLayer().addTo(map);
		drawTrips(tables.tracker.trips);
	} else {
		clearTrips();
	}
}
function clearSurveys(){
	map.removeLayer(surveyLayer);
}
function clearTrips(){
	map.removeLayer(tripLayer);
}