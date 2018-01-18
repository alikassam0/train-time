
  //Initialize Firebase
  var config = {
    apiKey: "AIzaSyDFiW-XEMBCNpnjixW04WxSoybIbyvS9OY",
    authDomain: "alitraintime-fa097.firebaseapp.com",
    databaseURL: "https://alitraintime-fa097.firebaseio.com",
    projectId: "alitraintime-fa097",
    storageBucket: "alitraintime-fa097.appspot.com",
    messagingSenderId: "885151914772"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

console.log("test")

	var name = ""	
	var destination = ""
	var startTime = ""
	var frequency = 0
	var nextArrival = 0
	var nextTrain = 0

 //create an eventhandler for the submit button
	$("#addTrain").on("click", function(event){
	event.preventDefault();
	console.log("button clicked")
	name = $("#trainNameForm").val();
	destination = $("#destinationForm").val();
	startTime = $("#startDateForm").val();
	frequency = parseInt($("#frequencyForm").val());
	nextArrival = minutesUntilTrain(startTime, frequency)
	nextTrain = nextTrainTime(nextArrival)
	console.log("name is: "+ name);
	console.log("destination is: "+ destination);
	console.log("start time is: "+ startTime);
	console.log("frequency is: "+ frequency);

	alert("train successfully added");

	

	database.ref().push({
	name: name,
	destination: destination,
	startTime: startTime,
	frequency: frequency,

	})

	retrieveData()

	// renderRows(retrieveData())



})

//function to retrieve data
function retrieveData(){
	database.ref().on("child_added", function(childSnapshot){
		var sv = childSnapshot.val()
		console.log(sv);
		renderRows(sv)
	})
}

//function to calculate minutes to next train
 function minutesUntilTrain(startTime, frequency){
    // var tFrequency = 3;
    // // Time is 3:30 AM
    // var firstTime = "03:30";
    // First Time (pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(startTime, "hh:mm").subtract(1, "years");
    console.log(startTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    console.log(frequency)
    var tRemainder = parseInt(diffTime % frequency);
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    return tMinutesTillTrain;
}

//function to calculate time of next train
function nextTrainTime(nextArrival){
	var nextTrain = moment().add(nextArrival, "minutes");
	moment(nextTrain).format("hh:mm")
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    return nextTrain;
}


// function to render new rows
function renderRows(sv){
	var tBody = $("tbody")
	var tRow = $("<tr>")

	var nameTd = $("<td>").text(sv.name);
	var destinationTd = $("<td>").text(sv.destination);
	var frequencyTD = $("<td>").text(sv.frequency)
	var nextArrivalTd = $("<td>").text(nextTrainTime(minutesUntilTrain(sv.startTime, sv.frequency)))
	var minutesAwayTd = $("<td>").text(minutesUntilTrain(sv.startTime, sv.frequency))

	tRow.append(nameTd, destinationTd, frequencyTD, nextArrivalTd, minutesAwayTd);
	tBody.append(tRow);
}

