from PyPDF2 import PdfReader
from collections import defaultdict
import re

# for extracting texts from pdf. just pass pdf_path as argument and  this will return a large raw texts jasma dherai whitespaces and comma, aru nachaido symbol haru ni hunchan.
def extract_text_from_pdf(pdf_path):
    try:
        pdf_reader = PdfReader(pdf_path)
        text = ''
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None


file_1_path = "Ai_Lab1.pdf"
file_2_path = "Ai_Lab3.pdf"


#Manual tokenization
separators = r'[^\w\d]+'
def tokenize_the_text(raw_text):
    raw_text = raw_text.lower()
    result = re.split(separators, raw_text)
    result.remove('')
    return result
# Comprehensive separator pattern

text1 = tokenize_the_text(extract_text_from_pdf(file_1_path))
text2 = tokenize_the_text(extract_text_from_pdf(file_2_path))

#result is a list which contains all the words



word_count_dict1 = defaultdict(int)
word_count_dict2 = defaultdict(int)

for word in text1:
    word_count_dict1[word] += 1

for word in text2:
    word_count_dict2[word] += 1



# Calculating Denominator
sum_of_the_squares_1 = 0
for item in word_count_dict1:
    sum_of_the_squares_1 += (word_count_dict1[item] ** 2)
square_root_of_sum_of_the_squares_1 = sum_of_the_squares_1 ** (1/2)

sum_of_the_squares_2 = 0
for item in word_count_dict2:
    sum_of_the_squares_2 += (word_count_dict2[item] ** 2)
square_root_of_sum_of_the_squares_2 = sum_of_the_squares_2 ** (1/2)

denominator = square_root_of_sum_of_the_squares_1 * square_root_of_sum_of_the_squares_2

# Calculating numerator
numerator = 0
common_words_in_both_dictionaries = set( word_count_dict1.keys() ) & set( word_count_dict2.keys() )

for word in common_words_in_both_dictionaries:
    numerator += word_count_dict1[word] * word_count_dict2[word]


cosTheta = numerator / denominator
print("numerator: ", numerator)
print("denominator: ", denominator)
print(cosTheta)



