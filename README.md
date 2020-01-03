# CodeSynthViewer -- ICSE 2020

The software used for conducting experiments as described in "Neurological Divide: An fMRI Study of Prose and Code Writing" at [ICSE 2020](https://conf.researchr.org/home/icse-2020). This repository permits both the reproduction of our usage of this software, as well as the adaptation of this software for similar uses.

## TODO Before Submission

* fix all the node stuff. Just look up ryan-fmri. Why do we need the node_modules directory? Do we? Ask Kevin about this.

## Getting Started

General usage for CodeSynthViewer involvesa node back-end and a web-based front-end, most easily viewed locally in a web browser. General usage requires the following steps:

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

Each element on the list is a stimulus, represented by a dictionary. Each stimulus has several required properties:
* prompt: The text to display as the stimulus prompt
* text: The text to appear in the body of the text editor.
* line/character: The position at which the cursor in the editor should start. For example, for our questions that required filling in a blank, we included a series of underscores ('\_') in the text section and denoted the line and character as the middle of these underscores.

#### Code

Once changing the stimuli that are loaded (e.g., changing stimuli.json, creating a new JSON file), there are several changes required to the code itself.

The first change involves the server-side logic to establish the number of stimuli. The existing logic can be found in ```server.js``` and is centered around the variable ```NUM_STIMULI```. The existing logic can be interpreted in the context of our study -- FITB categories (i.e., categories 0 and 2) had 17 stimuli each whereas LR categories (i.e., categories 1 and 3) had 9 stimuli each. You can freely configure the number of categories as well as the number of stimuli in each category, but you must be sure to update the logic in ```server.js``` to support your changes. In case you have trouble finding it, the current logic is marked under the comment "Set number of stimuli according to category."

Adapting this software for one's own purposes likely also involves adjusting the time duration of stimuli presentation. This is discussed in the following section, along with other timing-related possibilities for configuration. 


### Timing

### Text Editor

## Output

## Built With

* [CodeMirror](http://www.codemirror.net) - The code editor in the browser
* [Node](https://www.nodejs.org) - Dependency Management

## Authors

* Ryan Krueger - ryankrue@umich.edu
* Kevin Leach - kjleach@umich.edu

See our [ICSE 2020 paper](www.fixme.org) for a full list of study authors.
