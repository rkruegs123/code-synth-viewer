# CodeSynthViewer -- ICSE 2020

The software used for conducting experiments as described in "Neurological Divide: An fMRI Study of Code and Prose Writing" at ICSE 2020. This repository permits both the reproduction of our usage of this software, as well as the adaptation of this software for similar uses.

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
* Press the enter key

Note that our study used four different categories of stimuli, and each experiment can be run separately by selecting one of [0-3] as the category ID. In our study, the category IDs correspond to the following categories (FITB = Fill in the Blank, LR = Long Response):

0. Prose, FITB
1. Prose, LR
2. Code, FITB
3. Code, LR


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

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [CodeMirror](http://www.codemirror.net) - The code editor in the browser
* [Node](https://www.nodejs.org) - Dependency Management

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.
