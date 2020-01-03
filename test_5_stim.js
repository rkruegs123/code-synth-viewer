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
}

var participant_id = Number(process.argv[2])

if (!participant_id) {
  console.log("FAILURE - participant_id not numeric type")
  process.exit(1)
}

var keystrokes_file = "./keystrokes-" + participant_id + ".txt"
var answers_file = "./answers-" + participant_id + ".txt"
var csv_header = "participant-id,category,timestamp,prompt,answer,stimulus-id\n"

var fd = fs.createWriteStream(keystrokes_file, {flags: 'a'});
var fd_answers = fs.createWriteStream(answers_file, {flags: 'a'});
var date = new Date();

// list of integers corresponding to the order in which stimuli appear
// tot he participant
var shuffledStimuli = [];

// note: will have to keep track of state/category, either through query or here
for (var i=0; i<5; i++) {
  shuffledStimuli.push(i);
}



var stim_category = 0; // 0 is A, 1 is B, 2 is X, 3 is Y
var stim_index = 0;
var sequence = [];

/* TODO add getparticipant path*/
/* TODO accept participant id from command line */


/* when we see the magic "=" from the machine */
app.get('/start', function( request, response) {
    // shuffle per category
    console.log("receiving start call... shuffling...")
    sequence = shuff.shuffle(shuffledStimuli,participant_id);
    console.log("shuffled...printing sequence...")
    console.log(sequence);
    fd_answers.write(csv_header);
});



app.get('/nextstim', function ( request, response ) {
    var area = request.query.area;
    var prompt = request.query.prompt;

    // participant id query
    var csv_line = participant_id + ',' + stim_category + ',' + now('milli') + ',' + prompt + ',' + area + ',' + sequence[stim_index] + '\n'
    
    fd_answers.write(csv_line);

    console.log(area);

    // "load" the next stimulus information
    // (prompt, textarea text, what_type?)
    console.log("about to send response...");
    console.log(stim_index);
    var data = JSON.stringify({ 
	    index: sequence[stim_index], 
	    category: stim_category
  	});
  	console.log("getting data with stim_index")
  	console.log(stim_index)

    stim_index = (stim_index + 1) % 5;
    if (stim_index == 0) {
    	stim_category = (stim_category + 1) % 4
    }

    //response.json({success:"Success", status:200,  index: sequence[stim_index], category: stim_category});
    //response.send('index: ' + sequence[stim_index]);
    console.log(data);
    response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
    //response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(data);
    // record the time with each transition

}
);


app.get('/keystroke', function ( request, response ) {
    var key = request.query.key;

    fd.write(now('milli') + ", " + key + "\n");
    response.json({success:"Success", status:200, });

}
);





http.createServer(app).listen(app.get('port'), function() {

});
