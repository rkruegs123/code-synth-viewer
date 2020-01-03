esl_long_prompts[1-3].txt are raw examples of open ended prompts to be parsed and refined

[sat OR gre]_samples.txt are raw examples of fill in the blank prompts to be parsed and refined

test_words.txt is a file where the first word is a word used in non-math analogies paper, and the preceding words are synonyms for that word. One row/line is a list of similar words to be checked for

parse.py loops through one of the above raw example .txt files and checks for prompts that use one of the words in test_words.txt. USAGE: python pasrse.py (gre, sat, esl1, esl2, esl3)

refiner.py loops through an output file of parse.py and outputs in a format that gives part of speech information

stimuli_presenter.html is the front end for displaying the stimuli. It may have some bugs, as referred to in TODO.txt

test.html has been used for testing purposes for introducing functionality to stimuli_presenter.html

server.js is server for front end

test.js is used to test functionality for server.js, often with test.html
