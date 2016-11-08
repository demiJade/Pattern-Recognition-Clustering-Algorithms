// Sy, Judy C.
// CS 129.18 - A

//KNN Module
var trainingData = [];
var validationData = [];
var knnParam = 0;
function readValidationData(evt){
	var f = evt.target.files[0];
	readSingleFile(f, validationData);	
};

function readTrainingData(evt){
	var f = evt.target.files[0];
	readSingleFile(f, trainingData);
};

function readSingleFile(f, object){
	if (f) {
		var r = new FileReader();
		r.onload = function(e) {
			var contents = e.target.result;
			var lines = contents.split('\n');
			var headers = lines[0].split(",");
			console.log(headers);
			for (var i = 1; i < lines.length-1; i++) {
				var obj = {};
				var currentline = lines[i].split(",");
				for (var j = 0; j < headers.length; j++) {
					if (j == headers.length-1){
						console.log(headers[j]);
					}
					var column = headers[j];
					obj[column] = currentline[j];
				}
				object.push(obj);
			}
			console.log("file loaded");
			console.log(object);
		}
		var text = r.readAsText(f);
	}
};

function doKNN(evt){
	knnParam = document.getElementById('knn-param').value;
	for (var i = 0; i < validationData.length; i++){
		var distances = [];
		for (var j = 0; j < trainingData.length; j++){
			var distance = 0;
			for (col in trainingData[j]){
				if (col != 'y'){
					var difference = (trainingData[j][col] - validationData[i][col]);
					distance += Math.pow(difference,2);
				}
			}
			distances.push(distance);
		}
		var smallestDistances = [];
		for (var j = 0; j < knnParam; j++){
			var min = distances[0];
			var index = 0;
			for (var k = 1; k < distances.length; k++){
				if (distances[k] < min){
					min = distances[k];
					index = k;
				}
			}
			var object = {};
			object["index"] = index;
			object["distance"] = distances[index];
			object["category"] = trainingData[index]["y"];
			distances[index] = 1000000;
			smallestDistances.push(object);
			console.log(smallestDistances);
		}
		validationData[i]["knn"] = smallestDistances;
	}
	var output = [];
	for (var i = 0; i < validationData.length; i++){
		var object = {};
		object['real_category'] = validationData[i]["y"];
		
		var record_counts = [];
		var record = {};
		record.category = validationData[i].knn[0].category;
		record['count'] = 1;
		record_counts.push(record);
		for (var j = 1; j < validationData[i]['knn'].length; j++){
			for (var k = 0; k < record_counts.length; k++){
				if (record_counts[k]['category'] == validationData[i].knn[j].category){
					record_counts[k]['count']++;
				} else {
					record['category'] = validationData[i].knn[j].category;
					record['count'] = 0;
					record_counts.push(record);
				}
			}
		}
		var maxIndex = 0;
		for (var j = 1; j < record_counts.length; j++){
			if (record_counts[j]['count'] > record_counts[maxIndex]['count']){
				maxIndex = j;
			}
		}
		object['tested_category'] = record_counts[maxIndex]['category'];
		output.push(object);
	}
	document.getElementById('knn-results').value = JSON.stringify(output,null,4);
	document.getElementById('k-nearest-neighbors').value = JSON.stringify(validationData,null,4);
};

function resetData(evt){
	validationData = [];
	trainingData = [];
}

//Multilayer Perceptron Module
var counter;
var topology = [];
var MLPData = [];
var passes;
var numberOfWeights = 0;
function createTopology(){
	numberOfWeights = 0;
	var html = '<h4>Initial Weights</h4> <br>';
	html += '<div class="container">';
	topology = [];
	var temp = document.getElementById("topology").value;
	topology = temp.split(",");
	console.log("Topology:");
	console.log(topology);
	counter = 1;

	for (var i = 1; i < topology.length; i++){
		html += '<div class="row">';
		numberOfWeights += topology[i]*topology[i-1];
		
		
		for (var j = 0; j < topology[i]; j++){
			if (j == 0){
				html += '<div class="col-sm-2">';
				html += '<form class="form-horizontal">';
				for (var k = 0; k < topology[i-1];k++){
					var num = k + 1;
					html += '<div class="form-group">';
					html += '<label class="col-sm-1 control-label" for="w' + counter + '">' + num + '</label>';
					html += '<div class="col-sm-9">';
					html += '<input class="form-control" id="w'+ counter +'" type="text">';
					html += '</div>';
					html += '</div>';
					counter++;
				}
				html += '</form>';
				html += '</div>';
			} else {
				html += '<div class="col-sm-2">';
				for (var k = 0; k < topology[i-1];k++) {
					html += '<div class="form-group">';
					html += '<div class="col-sm-9">'
					html += '<input class="form-control" id="w'+ counter +'" type="text">';	    				
					html += '</div>';
					html += '</div>';
					counter++;  
				}
				html += '</div>';
			}		
		}
		html += '</div>';
		html += '<br>';
	}
	html += '</div>';
	html += '<div class="col-md-6">';
    html += '<label for="mlp-data">Input Data Set CSV File</label>';
	html += '<input type="file" id="mlp-data">';
    html += '</div>';
    html += '<div class="col-md-6">';
	html += '<button class="btn btn-default" type="button" id="doMLP">Go!</button>';
	html += '</div>';
	document.getElementById("weights").innerHTML=html;
	document.getElementById('doMLP').addEventListener('click', doMLP, false);
  	document.getElementById('mlp-data').addEventListener('change', function(e){
  	var f = e.target.files[0];
	readMLPData(f);
  });
}

function doMLP(){
	passes = document.getElementById('passes').value;
	var bias = document.getElementById('bias').value;
	var wb = document.getElementById('wb').value;
	var learningRate = document.getElementById('learningRate').value;
	var index = 1;
	var buffer = [];
	var output = [];
	var errors = [];
	var e1 = [];
	var e2 = [];
	var e3 = [];
	var delta = [];
	var e4 = [];
	var e5 = [];
	var weights = [];
	var totalerror = 0;
	for (var i = 0; i < MLPData.length; i++){ //loop through each row of the data
		for (var j = 0; j < passes; j++){ //times how many passes you want to have per row of data
		e1 = [];
		e2 = [];
		e3 = [];
		e4 = [];
		e5 = [];
		delta = [];
			//start feed forward
			var weightIndex = 0;
			buffer = [];
			errors = [];
			for (var k = 1; k < topology.length; k++){ //start looping the topology
				buffer[k-1] = [];
				for (var l = 0; l < topology[k]; l++){ //loop through the columns
					var total = 0;
					for (var m = 0; m < topology[k-1]; m++){ //loop through the rows
						if (k==1) {
							if (index <= numberOfWeights){
								var weight = document.getElementById('w'+index).value;
								weights.push(weight);
							} else {
								var weight = weights[weightIndex];
								weightIndex++;
							}
							var x = MLPData[i][m];
							var product = weight * x;
							total += product;
							index++;
							
						} else {
							
							if (index <= numberOfWeights){
								var weight = document.getElementById('w'+index).value;
								weights.push(weight);
							} else {
								var weight = weights[weightIndex];
								weightIndex++;
							}
							var x = buffer[buffer.length-2][m];
							var product = weight * x;
							total += product;
							index++;
						}
					}
					total += bias * wb;
					var activation = 1 / (1 + Math.exp(total*-1));

					buffer[k-1].push(activation);
					console.log(activation);
				}

			}
			console.log(buffer);
			output = buffer[buffer.length-1];
			console.log("Output is");
			console.log(output);
			//start back propagation
			totalerror = 0;
			for (k = topology.length-1; k > 0; k--){
				if (k == topology.length -1){
					for (var l = 0; l < output.length; l++){
						var mlp_data_index = parseInt(topology[0]) + l;
						var error = 0.5 * (Math.pow(output[l]-MLPData[i][mlp_data_index],2));
						var e1Temp = output[l]-MLPData[i][mlp_data_index];
						var e2Temp = output[l] * (1 - output[l]);
						for (var m = 0; m < topology[topology.length-1]; m++){
							e1.push(e1Temp);
							e2.push(e2Temp);
						}
						for (var m = 0; m < topology[k]; m++){
							var e3Temp = buffer[buffer.length-2][m%topology[topology.length-1]];
							e3.push(e3Temp);
						}
						totalerror += error;
						

					}
				} else {
					// var tempTotal
					// for (var l = weights.length-1; l > 0; l--){

					// }
					for (var a = 0; a < topology[k]; a++){
						for (var l = 0; l < topology[k-1]; l++){
							var tempTotal = 0;
							for (var m = 0; m < topology[k]; m++){
								var tempIndex = m*topology[k]+a; //to make the jumping values
								var adjust = topology[k] * topology[k+1]; //to adjust index for weight
								tempTotal += e1[tempIndex]*e2[tempIndex]*weights[weights.length-adjust+tempIndex];

							}
							var bufferTemp = buffer[buffer.length-k-1][a]; //get the input from the hidden layer
							var e5Temp = bufferTemp * (1 - bufferTemp);
							e5.push(e5Temp);
							e4.push(tempTotal);
							
						}
					}
					for (var l = 0; l < e4.length; l++){
						var deltaTemp = e4[l] * e5[l] * MLPData[i][l%topology[k-1]];
						delta.push(deltaTemp);
					}
					
				}
			// console.log("E1:");
			// console.log(e1);
			// console.log("E2:");
			// console.log(e2);
			// console.log("E3:");
			// console.log(e3);
			// console.log("Weights:");
			// console.log(weights);
			// console.log("Delta:");
			// console.log(delta);
			// console.log("E4:");
			// console.log(e4);
			// console.log("E5:");
			// console.log(e5);
			}
			
			for (var k = 0; k < e1.length; k++){
				var deltaTemp = e1[k] * e2[k] * e3[k];
				delta.push(deltaTemp);
			}

			for (var k = 0; k < delta.length; k++){
				var newWeight = weights[k] - (learningRate * delta[k]);
				weights[k] = newWeight;
			}
			var html = document.getElementById('mlp-results').value;
			html += '\n'+ "Error is:" + totalerror + '\n';
			document.getElementById('mlp-results').innerHTML = html;
			console.log("Error is:" + totalerror);

		}

	}
	var html = document.getElementById('mlp-results').value;
	html += '\nFinal Set of Weights: \n';
	for (var i = 0; i < weights.length; i++){
		html += weights[i] + '\n';
	}
	document.getElementById('mlp-results').innerHTML = html;
}

function readMLPData(f){
	if (f) {
		var r = new FileReader();
		r.onload = function(e) {
			var contents = e.target.result;
			var rows = contents.split('\n');
			var index = 0;
			for (var i = 0; i < rows.length-1; i++) {
				MLPData[i] = rows[i].split(",");
			}
			console.log(MLPData);
		}
		var text = r.readAsText(f);
	}
}

$(document).ready(function() {
  document.getElementById('training-data').addEventListener('change', function(e){
  	var f = e.target.files[0];
	readSingleFile(f, trainingData);
  });
  document.getElementById('validation-data').addEventListener('change', function(e){
  	var f = e.target.files[0];
	readSingleFile(f, validationData);
  });
  document.getElementById('knn-go').addEventListener('click', doKNN, false);
  // document.getElementById('reset-button').addEventListener('click', resetData,false);

  document.getElementById('create-topology').addEventListener('click', createTopology, false);
  
});