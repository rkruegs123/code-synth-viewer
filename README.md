# CodeSynthViewer -- ICSE 2020

The software used for conducting experiments as described in "Neurological Divide: An fMRI Study of Prose and Code Writing" at [ICSE 2020](https://conf.researchr.org/home/icse-2020). This repository permits both the reproduction of our usage of this software, as well as the adaptation of this software for similar uses.

## TODO Before Submission

* fix all the node stuff. Just look up ryan-fmri. Why do we need the node_modules directory? Do we? Ask Kevin about this.

## Getting Started

General usage for CodeSynthViewer involves a node back-end and a web-based front-end, most easily viewed locally in a web browser. General usage requires the following steps:

1. Start the backend, specifying the participant ID (used for a random number generator seed as well as for naming output files/directories) and the category (unique to the user's experimental design). Both are positive integers.
2. Open the interface in a web browser
3. Hit the designated key to start the experiment. We used the "=" sign for our purposes, but this can be easily configured.

To start the server, use

``node server.js [PARTICIPANT-ID] [CATEGORY]``

Then, open ``presenter.html`` in a web-browser. Lastly, press the designated start key.

To replicate our experiments with a random ordering (i.e., random participant ID = 99), use the following commands:

* ``node server.js 99 [0-3]``
* ``open presenter.html``
* Press the "=" key

Note that we used four different categories of stimuli in our study. Each experiment can be run separately by selecting one of [0-3] as the category ID. In our study, the category IDs correspond to the following categories (FITB = Fill in the Blank, LR = Long Response):

0. Prose, FITB
1. Prose, LR
2. Code, FITB
3. Code, LR

The stimuli can be found in ```stim_final.json``` and are defined in this order.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Configurability

This software is made public to make possible both (1) the reproduction and validation of our results and experimental protocol, as well as (2) the adaptation of this software for similar studies of software engineering activities with medical imaging. The following instructions provide details on how one can adapt this software for the needs of similar studies.

### Stimuli

#### Contents

You can run experiments with your own custom stimuli. The stimuli are stored in JSON format, and are loaded in ```presenter.html``` with ```<script type="text/javascript" src="stimuli.json"></script>```. You can replace this with your own JSON file.

Each run of the software runs one "category" of stimuli. Each category of stimuli is represented as a list in JSON format. For example, we used 4 categories of stimuli and therefore our stimuli JSON file consists of 4 lists.

Each element of a list is a stimulus, represented by a dictionary. Each stimulus has several required properties:
* prompt: The text to display as the stimulus prompt
* text: The text to appear in the body of the text editor.
* line/character: The position at which the cursor in the editor should start. For example, for our questions that required filling in a blank, we included a series of underscores ('\_') in the text section and denoted the line and character as the middle of these underscores.

#### Code

Once changing the stimuli that are loaded (e.g., changing stimuli.json, creating a new JSON file), there are several changes required to the code itself.

The first change involves the server-side logic to establish the number of stimuli. The existing logic can be found in ```server.js``` and is centered around the variable ```NUM_STIMULI```. The existing logic can be interpreted in the context of our study -- FITB categories (i.e., categories 0 and 2) had 17 stimuli each whereas LR categories (i.e., categories 1 and 3) had 9 stimuli each. You can freely configure the number of categories as well as the number of stimuli in each category, but you must be sure to update the logic in ```server.js``` to support your changes. In case you have trouble finding it, the current logic is marked under the comment "Set number of stimuli according to category."

Adapting this software for one's own purposes likely also involves adjusting the time duration of stimuli presentation. This is discussed in the following section, along with other timing-related possibilities for configuration. 


### Timing

Similar to updating the number of stimuli with ```NUM_STIMULI``` on the server-side, the time duration of each stimulus is handled by the server side. The time duration of each stimulus is chosen on a per-category basis, and having different timings within a category is not currently supported. The time-per-stimulus is determined on the server-side and stored in the variable ```stimulus_time```. Timings are stored in ms (e.g., 30s = 30,000 ms). 

As before, the current code can be understood in the context of our own study. Participants had 30s to complete FITB tasks and 60s to complete LR tasks. The section of code beginning with ```if (stim_category == 1 || stim_category == 3) {``` is a small example of logic to determine the time-per-stimulus based on the category number.

In addition to the time-per-stimulus, various other timing aspects of the software can be adjusted:
* Average Rest Time: Between each stimulus, a fixation cross is shown to the participant for a variable amount of time. While the exact amount of time is variable, you can set an average amount of time per rest period by changing the value of ```avg_rest_time``` in ```presenter.html```. The current value is set to 5s (5000 ms).
* First Stimulus Buffer: In our experiment, we wanted a buffer of 10s at the beginning of the experiment upon pressing the start key. In other words, pressing the start key prompoted a 10s countdown to the experiment. You can adjust this countdown by changing the value of ```first_stim_buffer``` in ```presenter.html``` (or set it to 0 for no buffer).

### Text Editor

A key benefit of our software for studying software enginering tasks with medical imaging is that, unlike popular software for psychology studies (e.g., ePrime), it supports text editing. Furthermore, the text editing capabilities include syntax highlighting -- a particularly useful feature for studies involving programming! When adapting the software for your own needs, you can customize the syntax highlighting of the text-editor on a per-category basis.

Again, we can understand how to adjust syntax highlighting in the context of our own experiment. In our experiment, categories 0-1 involved prose writing whereas categories 2-3 involved writing C++ code. Therefore, we wanted plain text (no syntax highlighting) for categories 0-1 and C++ syntax highlighting for categories 2-3. The logic to choose the syntax highlighting based on the category is handled in the key function of ```presenter.html```: ```displayNextStimulus()```. When the server returns details of the next stimulus, it includes the category of that stimulus (```data.category```). We can then check the category, and set the syntax highlighting of our text editor (i.e., CodeMirror) object accordingly via the ```setOption``` method. For example, we check the category type of the stimulus with ```if (data.category == Categories.ProseWritingFITB || data.category == Categories.ProseWritingLR)``` (we use an enum in this case) and set the appropriate syntax highlighting with ```editor.setOption("mode", "text/plain")``` or ```editor.setOption("mode", "text/x-c++src")```. While we check for the category and set this syntax highlighting for each stimulus, our experiment did not require us to change syntax highlighting for stimuli within the same category. Therefore, the software does not currently support within-category changes to syntax highlighting. However, this design permits such a change by adding logic to the category included in the server-side ```nextstim``` API.

Customizing the syntax highlighting of the text editor on a per-category basis can be easily adjusted by changing the logic described in ```presenter.html```. For a complete list of the programming languages supported by the text editor and the corresponding keywords to use a given language, see [here](https://codemirror.net/mode/).

### Start Key

The software waits for a key press from a designated start key to start the experiment. Upon receiving signal from said start key, the experiment begins: a fixation cross is shown for the alotted buffer time, and the participant is then presented with the first rest/stimulus pair (i.e., start key pressed &rarr; first stimulus buffer &rarr; first rest &rarr; first stimulus &rarr; second rest &rarr; ...).

In our experiment, we used the equals sign ("=") as our start key. However, this can be easily configured. The start key is determined in ```presenter.html``` under the comment reading "If start key detected, start the experiment. Triggers first call to displayNextStimulus." Note that various browsers may use different keycodes for the same key. For example, 61 is the keycode for "=" in Firefox but the keycode for "=" for all other browsers is 187. For a full list of keycodes, [this](https://keycode.info/) is a useful website.

## Output

To reiterate, a key benefit of our software is the ability to capture text output (e.g., via an MRI-safe QWERTY keyboard) from experiment participants in medical imaging studies. Our software captures participant responses at two levels of granularity: (1) all keystrokes typed by the participant, and (2) question/answer-style recording. Again, experiments are conducted on a per-category level -- a single experiment is the presentation of a set of stimuli (i.e., a category of stimuli) to a participant. This is reflected in the two required command-arguments (i.e., participant ID and category number). For each experiment (i.e., a pair of participant ID and category number), two files are generated -- a keystrokes file, and an answer file.

### Keystrokes

Once the experiment has started (i.e., the start key has been pressed), all keys pressed by the participant are recorded until the experiment is finished. Keystroke information is recorded in the following format:

* Pairs of ```(current time in ms, keycode)```. The recorded time is arbitrary and is relative only to the start of the server
* Stimulus demarcation (i.e., "new stimulus")

All items are separated by newlines. The following is a minimal example of a keystrokes file:

```
58596205.678034, 16
58596235.879504, 224
58596567.035268, 82
new stimulus
58665814.399911, 16
58665821.830611, 224
new stimulus
...
```

In the above example, the participant pressed three keys before the first stimulus was shown, and two keys in response to the first stimulus.

Keystroke files are saved in the ```keystrokes``` directory and named in the following format:

```keystrokes/keystrokes-<participant id>-<category>.txt```

For example, the keystrokes file for participant 99's completion of category 0 would be saved in ```keystrokes/keystrokes-99-0.txt```.

### Answers

Participant output is also saved in a stimulus-by-stimulus fashion. Answer output is saved in CSV format with the following columns, where each row includes information for a single stimulus:

* participant-id: The ID of the participant completing the expeirment
* category: The category that the participant is completing
* timestamp: The current time in ms. The recorded time is arbitrary and is relative only to the start of the server
* prompt: The prompt displayed at the top of the screen. For example, for the FITB questions in our study, the prompt read "Fill in the blank below". For the LR questions in our study, the prompt was variable.
* answer: The participant's typed response, including any text that began in the text box. For example, for the FITB questions in our study, this column would include the entire completed sentence with the participantss answer inserted in the blank. For the LR questions in our study, this would include the participant's entire typed response.
* stimulus-id: The numerical ID of the stimulus. This corresponds to the index of the stimulus in its associated JSON list.
* previous-delay: The duration that the fixation cross was shown to the participant prior to the stimulus. In other words, the rest time before the stimulus.
* stimulus_time: The duration that the stimulus was shown for in ms (e..g, in our study this was either 30000 or 60000)



## Built With

* [CodeMirror](http://www.codemirror.net) - The code editor in the browser
* [Node](https://www.nodejs.org) - Dependency Management

## Authors

* Ryan Krueger - ryankrue@umich.edu
* Kevin Leach - kjleach@umich.edu

See our [ICSE 2020 paper](www.fixme.org) for a full list of study authors.
