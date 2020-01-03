import sys
import nltk

#tokenizer = nltk.tokenize.api.TokenizerI()

if len(sys.argv) == 1:
	print "USAGE: python refiner.py file_to_refine.txt"
	exit(1)
elif len(sys.argv) > 2:
	print "USAGE: python refiner.py file_to_refine.txt"
	exit(1)

filename = sys.argv[1]

with open(filename, 'r') as myfile:
    data = myfile.read()

prompts = data.split("MATCH:")

verbs = ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']
nouns = ['NN', 'NNS']

for prompt in prompts:
	divided = prompt.split(' ', 1)
	if len(divided) != 2:
		continue
	word_in_prompt = divided[0].strip()
	the_prompt = divided[1]
	#tokenized = word_tokenize(the_prompt)
	#print tokenized

	#print tokenizer.tokenize(the_prompt)
	#print nltk.pos_tag(the_prompt)
	tokenized = nltk.word_tokenize(the_prompt)
	tags = nltk.pos_tag(tokenized)
	for tag in tags:
		if tag[0] == word_in_prompt:
			part_of_speech = tag[1]
			if part_of_speech in nouns:
				print "MATCH WITH WORD AS NOUN:"
				print "Using word: ",word_in_prompt
				print "With part of speech: ",part_of_speech
				print "And prompt: ", the_prompt
			if part_of_speech in verbs:
				print "MATCH WITH WORD AS VERB:"
				print "Using word: ",word_in_prompt
				print "With part of speech: ",part_of_speech
				print "And prompt: ", the_prompt
