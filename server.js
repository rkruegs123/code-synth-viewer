// Load Node JS Modules
var http = require('http');
var path = require('path');
var request = require('request');
var express = require('express');
var fs = require('fs');
var app = express();
var shuff = require('shuffle-seed');

// Set port to 3000
app.set('port', 3000);

// Function for getting current time
const now=(unit)=>{

 const hrTime = process.hrtime(); 
 switch (unit) {
   case 'milli':return hrTime[0] * 1000 + hrTime[1] / 1000000;
   case 'micro':return hrTime[0] * 1000000 + hrTime[1] / 1000;
   case 'nano':return hrTime[0] * 1000000000 + hrTime[1];
  break;
   default: return hrTime[0] * 1000000000 + hrTime[1];
 }
}

// Store and Check Command Line Arguments
var participant_id = Number(process.argv[2])
var stim_category = Number(process.argv[3]) // 0 is A, 1 is B, 2 is X, 3 is Y

if (process.argv.length != 4) {
  console.log("FAILURE - not enough arguments providd")
  process.exit(1);
} else if (!(participant_id >= 0)) {
  console.log("FAILURE - id is not set")
  process.exit(1);
} else if (!(stim_category >= 0)) {
  console.log("FAILURE - category is not set")
  process.exit(1)
} else if (stim_category < 0 || stim_category > 3) {
  console.log("FAILURE - category must be in range 0-3")
  process.exit(1)
}

// Initialize output files
var keystrokes_file = "./keystrokes/keystrokes-" + participant_id + "-" + stim_category + ".txt"
var answers_file = "./answers/answers-" + participant_id + "-" + stim_category + ".txt"
var csv_header = "participant-id,category,timestamp,prompt,answer,stimulus-id,previous-delay,stimulus_time\n"
var fd = fs.createWriteStream(keystrokes_file, {flags: 'a'});
var fd_answers = fs.createWriteStream(answers_file, {flags: 'a'});
var date = new Date();


// Set number of stimuli according to category
var NUM_STIMULI = 9 // stim_category == 1 || stim_category == 3
if (stim_category == 0 || stim_category == 2) {
  NUM_STIMULI = 17;
}

// Populate list of integers corresponding to the order in which stimuli appear to the participant
// This list eventually gets shuffled
var shuffledStimuli = [];

for (var i = 0; i < NUM_STIMULI; i++) {
  shuffledStimuli.push(i);
}

// Variables for tracking stimuli
var stim_index = -1;
var sequence = [];

// Choose the appropriate length of stimuli presentation based on category type
stimuli_time = 30000
if (stim_category == 1 || stim_category == 3) {
  stimuli_time = 60000
}


// Triggered by a "=" key press from the front-end
app.get('/start', function( request, response) {
    // Shuffle stimuli ordering
    console.log("receiving start call... shuffling...")
    sequence = shuff.shuffle(shuffledStimuli, participant_id);
    console.log("shuffled...printing sequence...")
    console.log(sequence);
    fd_answers.write(csv_header);
});

// Returns the participant ID and number of stimuli
// Used by the front-end for random number generator seeding as well as generation of rest times
app.get('/get_part_id', function( request, response) {
  var data = JSON.stringify({ 
    id: participant_id,
    num_stim: NUM_STIMULI
  });

  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
  response.header("Access-Control-Allow-Origin", "*");
  response.end(data);
})

// Core interface. Returns the INDEX of the next stimuli per the shuffled list.
app.get('/nextstim', function ( request, response ) {
    console.log("Getting next stimulus")

    // Increment index
    stim_index = stim_index + 1

    // Check if we have reached the number of stimuli
    var should_stop = 0;
    if (stim_index > (NUM_STIMULI - 1)) {
      should_stop = 1;
    }
    
    var new_index = -1

    // If we haven't reached the number of stimuli, get index of next stimuli
    if (!should_stop) {
      new_index = sequence[stim_index]
    }

    // Send info for new stimulus
    var data = JSON.stringify({ 
      index: new_index, 
      category: stim_category,
      stop: should_stop,
      time: stimuli_time,
      number_stim: stim_index
    });

    // Log repsonse
    console.log(data);
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
    response.end(data);

});

// Interface to write a participant's answer to file
app.get('/write_answer', function ( request, response ) {
    var area = request.query.area;
    var prompt = request.query.prompt;
    var index = request.query.index;
    var prev_delay = request.query.prev_delay
    var stim_time = request.query.stimulus_time

    // Write answer to csv file
    console.log("Writing to csv...")
    var csv_line = participant_id + ',' + stim_category + ',' + now('milli') + ',' + prompt + ',' + area + ',' + index + ',' + prev_delay + ',' + stim_time +'\n'
    fd_answers.write(csv_line);
    // console.log(csv_line)

    var data = JSON.stringify({ 
      success: "Success", 
      status: 200
    });
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
    response.end(data);

});

// Interface to write a keystroke to file
app.get('/keystroke', function ( request, response ) {
    var key = request.query.key;

    fd.write(now('milli') + ", " + key + "\n");
    var data = JSON.stringify({
      success: "Success",
      status: 200
    });

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.end(data);

});

// Interface to write "new stimulus" to the keystroke file when we begin a new stimulus
app.get('/keystroke_stim_marker', function (request, response) {
  var key = request.query.key;

  fd.write("new stimulus\n");
  var data = JSON.stringify({
    success: "Success",
    status: 200
  });

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.end(data);
})


http.createServer(app).listen(app.get('port'), function() {

});
