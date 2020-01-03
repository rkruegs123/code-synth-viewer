// More Risky One

var http = require('http');
var path = require('path');
var request = require('request');
var express = require('express');
var fs = require('fs');

var app = express();
var shuff = require('shuffle-seed');


app.set('port', 3000);

const now=(unit)=>{

 const hrTime=process.hrtime(); 
 switch (unit) {
   case 'milli':return hrTime[0] * 1000 + hrTime[1] / 1000000;
   case 'micro':return hrTime[0] * 1000000 + hrTime[1] / 1000;
   case 'nano':return hrTime[0] * 1000000000 + hrTime[1] ;
  break;
   default:return hrTime[0] * 1000000000 + hrTime[1] ;
 }
}


if (!process.argv[2]) {
  console.log("FAILURE - id is not set")
  process.exit(1);
} else if (!process.argv[3]) {
  console.log("FAILURE - category is not set")
}

var NUM_STIMULI = 5
var stimuli_times = Array(20000,30000,60000);

var participant_id = Number(process.argv[2])
var stim_category = Number(process.argv[3]) // 0 is A, 1 is B, 2 is X, 3 is Y

if (!participant_id) {
  console.log("FAILURE - participant_id not numeric type")
  process.exit(1)
}

//var delay_times = new Array(21);
//for (var i = 0; i < delay_times.length; i++) {
//  delay_times[i] = Math.random()
//  console.log(delay_times[i])
//}

var keystrokes_file = "./keystrokes/keystrokes-" + participant_id + "-" + stim_category + ".txt"
var answers_file = "./answers/answers-" + participant_id + "-" + stim_category + ".txt"
var csv_header = "participant-id,category,timestamp,prompt,answer,stimulus-id,previous-delay,stimulus_time\n"

var fd = fs.createWriteStream(keystrokes_file, {flags: 'a'});
var fd_answers = fs.createWriteStream(answers_file, {flags: 'a'});
var date = new Date();

// list of integers corresponding to the order in which stimuli appear
// tot he participant
var shuffledStimuli = [];

// note: will have to keep track of state/category, either through query or here
for (var i=0; i<21; i++) {
  shuffledStimuli.push(i);
}


var stim_index = -1;
var sequence = [];

/* TODO add getparticipant path*/

/* when we see the magic "=" from the machine */
app.get('/start', function( request, response) {
    // shuffle per category
    console.log("receiving start call... shuffling...")
    sequence = shuff.shuffle(shuffledStimuli,participant_id);
    console.log("shuffled...printing sequence...")
    console.log(sequence);
    fd_answers.write(csv_header);
});

app.get('/get_part_id', function( request, response) {
  var data = JSON.stringify({ 
    id: participant_id
  });

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
  response.end(data);
})

app.get('/nextstim', function ( request, response ) {

    // "load" the next stimulus information
    // (prompt, textarea text, what_type?)
    //console.log("about to send response...");
    //console.log(stim_index);
    console.log("Getting next stimulus")
    stim_index = stim_index + 1
    var should_stop = 0;
    if (stim_index > (NUM_STIMULI - 1)) {
      should_stop = 1;
    }

    var time = stimuli_times[Math.floor(Math.random()*stimuli_times.length)];
    var new_index = -1
    if (!should_stop) {
      new_index = sequence[stim_index]
    }

    var data = JSON.stringify({ 
      index: new_index, 
      category: stim_category,
      stop: should_stop,
      time: time
    });
    //console.log("getting data with stim_index")
    //console.log(stim_index)

    console.log(data);
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
    response.end(data);

}
);


app.get('/write_answer', function ( request, response ) {
    var area = request.query.area;
    var prompt = request.query.prompt;
    var index = request.query.index;
    var prev_delay = request.query.prev_delay
    var stim_time = request.query.stimulus_time
    console.log("Writing to csv...")
    //var csv_line = participant_id + ',' + stim_category + ',' + now('milli') + ',' + prompt + ',' + area + ',' + sequence[stim_index] + '\n'
    var csv_line = participant_id + ',' + stim_category + ',' + now('milli') + ',' + prompt + ',' + area + ',' + index + ',' + prev_delay + ',' + stim_time +'\n'
    fd_answers.write(csv_line);
    console.log(csv_line)
    //console.log(index)
    //console.log(stim_index)
    var data = JSON.stringify({ 
      success: "Success", 
      status: 200
    });
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
    response.end(data);

}
);


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

}
);


http.createServer(app).listen(app.get('port'), function() {

});
