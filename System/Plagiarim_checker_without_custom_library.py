from PyPDF2 import PdfReader
from collections import defaultdict
import re
import math
import os
from itertools import combinations

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


separators = r'[^\w\d]+'
def tokenize_the_text(raw_text, n):
    
    raw_text = raw_text.lower()
    words = re.split(separators, raw_text)
    ngrams = [' '.join(words[i:i+n]) for i in range(len(words)-n)]
    return [ngram for ngram in ngrams if ngram.strip()]  # Filter out empty strings

def get_pdf_list(folder_name):
    pdf_files_list = []
    
    # Check if the folder exists
    if os.path.exists(folder_name):
        for file_name in os.listdir(folder_name):
            if file_name.lower().endswith('.pdf'):
                pdf_files_list.append(file_name)
    else:
        print(f"Folder '{folder_name}' does not exist.")

    return pdf_files_list


def calculate_cosine_similarity(file_path_1, file_path_2, n):
    text1 = tokenize_the_text(extract_text_from_pdf(file_path_1), n)
    text2 = tokenize_the_text(extract_text_from_pdf(file_path_2), n)

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
    Theta = math.acos(cosTheta)

    y = ((-2/math.pi)*Theta) + 1
    return y * 100

# file_path_1 = "tala_mathi.pdf"
# file_path_2 = "mathi_tala.pdf"
# y = calculate_cosine_similarity(file_path_1,file_path_2)


# print(f"The two documents is {y*100}% Plagiarized.")

# pdf_list = get_pdf_list("./")
# print(pdf_list)

threshold = 80
def get_list_of_groups_of_plagiarized(folder_name):
    pdf_list = get_pdf_list(folder_name)
    list_of_groups_of_plagiarized = []
    pdf_list_path = ["./" + folder_name + "/" +pdf_file_name for pdf_file_name in pdf_list]
    visited = set()
    
    for pdf1, pdf2 in combinations(pdf_list_path, 2):
        if (pdf1, pdf2) not in visited and (pdf2, pdf1) not in visited:
            #Similarity calculation
            #Here, similarity is calculated taking n=1, n=2 and n=3 into account and at the end, taking their average.
            similarity = 0
            for n in range(1,4):
                similarity += calculate_cosine_similarity(pdf1, pdf2, n)
            similarity /= 3

            print(f"File1: {pdf1.split('/')[-1]}, File2: {pdf2.split('/')[-1]}, Similarity Between Them: {similarity}% \n\n")
            
            if similarity >= threshold:
                group = {pdf1, pdf2}
                for existing_group in list_of_groups_of_plagiarized:
                    if pdf1 in existing_group or pdf2 in existing_group:
                        group.update(existing_group)
                        list_of_groups_of_plagiarized.remove(existing_group)
                list_of_groups_of_plagiarized.append(group)
                visited.add((pdf1, pdf2))

    list_of_groups_of_plagiarized = [list(group_list) for group_list in list_of_groups_of_plagiarized]
    list_of_groups = []
    for group_of_item in list_of_groups_of_plagiarized:
        _group = []
        for item in group_of_item:
            # Extract the filename from the path
            filename = item.split('/')[-1]  # Assuming the path separator is '/'
            _index = pdf_list_path.index(item)
            _group.append(pdf_list[_index])
        list_of_groups.append(_group)
    return list_of_groups


print(get_list_of_groups_of_plagiarized("pdfs"))
