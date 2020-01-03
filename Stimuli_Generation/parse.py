import sys
import string
from nltk.stem.porter import *

stemmer = PorterStemmer()

if len(sys.argv) == 1:
	print("USAGE: python parse.py (gre, sat, esl1, esl2, esl3)")
	exit(1)
elif len(sys.argv) > 2:
	print("USAGE: python parse.py (gre, sat, esl1, esl2, esl3)")
	exit(1)

filename = ""
if sys.argv[1] == "gre":
	filename = "gre_samples.txt"
elif sys.argv[1] == "sat":
	filename = "sat_samples.txt"
elif sys.argv[1] == "esl1":
	filename = "esl_long_prompts_1.txt"
elif sys.argv[1] == "esl2":
	filename = "esl_long_prompts_2.txt"
elif sys.argv[1] == "esl3":
	filename = "esl_long_prompts_3.txt"




with open(filename, 'r') as myfile:
    data = myfile.read()

prompts = data.split("Question.")

with open('test_words.txt', 'r') as myfile:
    words = myfile.read()


printable = set(string.printable)
matches = 0
for prompt in prompts:
	# Get whole prompt (many words)
	for word in prompt.split():
		# word is individual word in prompt
		# print "About to stem word, ",word
		filter(lambda x: x in printable, word)
		#print "Word as printable, ",word
		#print "Word without apostraphe, ",word.replace("'", "")
		#print "Word without punctuation is, ",word.translate(None, string.punctuation)
		stemmed_word = stemmer.stem(word)
		for check in words.split():
			if stemmer.stem(check) == stemmed_word:
				print("MATCH:")
				print(word)
				#print "Checking with word from prompt ",word," and test word ",check
				#print "Stem of words is ",stemmed_word
				print(prompt)
				matches += 1

#print len(prompts)
#print sys.argv[1]
#print matches," matches found"
