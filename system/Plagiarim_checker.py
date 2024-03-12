from PyPDF2 import PdfReader
from collections import defaultdict
import re
import math
import os
from itertools import combinations
import fitz  
# PyMuPDF
import string

def extract_text_from_pdf(pdf_path):
    try:
        pdf_reader = PdfReader(pdf_path)
        text = ''
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
        return re.sub(r'\s+-', '-', text)
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None


def tokenize_the_text(text, n):
    text = text.lower()
    words = text.split()
    ngrams = [' '.join(words[i:i+n]) for i in range(len(words)-n + 1)]
    return [ngram for ngram in ngrams if ngram.strip()]  # Filter out empty strings



# def get_pdf_list(folder_name):
#     pdf_files_list = []
    
#     # Check if the folder exists
#     if os.path.exists(folder_name):
#         for file_name in os.listdir(folder_name):
#             if file_name.lower().endswith('.pdf'):
#                 pdf_files_list.append(file_name)
#     else:
#         print(f"Folder '{folder_name}' does not exist.")

#     return pdf_files_list


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
    common_words_in_both_pdfs = set( word_count_dict1.keys() ) & set( word_count_dict2.keys() )

    for word in common_words_in_both_pdfs:
        numerator += word_count_dict1[word] * word_count_dict2[word]
    
    cosTheta = numerator / denominator
    if cosTheta > 1:
        cosTheta = 1
    Theta = math.acos(cosTheta)

    y = ((-2/math.pi)*Theta) + 1
    return y * 100


threshold = 50
# def get_list_of_groups_of_plagiarized(folder_name):
#     pdf_list = get_pdf_list(folder_name)
#     list_of_groups_of_plagiarized = []
#     pdf_list_path = ["./" + folder_name + "/" +pdf_file_name for pdf_file_name in pdf_list]
#     visited = set()
def get_list_of_groups_of_plagiarized(downloaded_files):
    list_of_groups_of_plagiarized = []
    pdf_list = [filename for filename, _ in downloaded_files]  # Extract filenames
    pdf_list_path = [file_path for _, file_path in downloaded_files]
    visited = set()
    temp_list_of_groups_of_plagiarized = defaultdict()
    
    for pdf1, pdf2 in combinations(pdf_list_path, 2):
        if (pdf1, pdf2) not in visited and (pdf2, pdf1) not in visited:
            #Similarity calculation
            #Here, similarity is calculated taking n=1, n=2 and n=3 into account and at the end, taking their average.
            similarity = 0
            for n in range(1,4):
                similarity += calculate_cosine_similarity(pdf1, pdf2, n)
            similarity /= 3

            # print(f"{pdf1.split('/')[-1]}  &  {pdf2.split('/')[-1]}, Similarity : {similarity}% \n\n")
            
            if similarity >= threshold:
                group = {pdf1, pdf2}
                temp_list_of_groups_of_plagiarized [(pdf1.rsplit('/',1)[1] , pdf2.rsplit('/',1)[1])] = similarity
                for existing_group in list_of_groups_of_plagiarized:
                    if pdf1 in existing_group or pdf2 in existing_group:
                        group.update(existing_group)
                        list_of_groups_of_plagiarized.remove(existing_group)
                list_of_groups_of_plagiarized.append(group)
                visited.add((pdf1, pdf2))

    list_of_groups_of_plagiarized = [list(group_list) for group_list in list_of_groups_of_plagiarized]
    list_of_groups = []
    list_of_avg_similarity = []
    for group_of_item in list_of_groups_of_plagiarized:
        _group = []
        for item in group_of_item:
            # Extract the filename from the path
            filename = item.split('/')[-1]  # Assuming the path separator is '/'
            _index = pdf_list_path.index(item)
            _group.append(pdf_list[_index])
        list_of_groups.append(_group)
    
    all_keys_available_in_temp_list_of_groups_of_plagiarized = list(temp_list_of_groups_of_plagiarized.keys())
    for group in list_of_groups:
        count = 0
        avg_similarity = 0
        for pdf1, pdf2 in combinations(group, 2):
            if (pdf1,pdf2) in all_keys_available_in_temp_list_of_groups_of_plagiarized:
                avg_similarity += temp_list_of_groups_of_plagiarized[(pdf1, pdf2)]
            else:
                avg_similarity += temp_list_of_groups_of_plagiarized[(pdf2, pdf1)]
            count += 1
            
        avg_similarity /= count
        list_of_avg_similarity.append(avg_similarity)

    return list_of_groups, list_of_avg_similarity

# list_of_groups_of_plagiarized = get_list_of_groups_of_plagiarized("files")

# print(list_of_groups_of_plagiarized)
# i=0
# for item in list_of_groups_of_plagiarized:
#     print(i, item)
#     i+=1

# index_of_list = int (input("Enter the index from the list of which you wanna see/generate plagiarized part."))
# selected_list = list_of_groups_of_plagiarized[index_of_list]

def highlight_word_in_pdf(pdf_path , destination_path , common_words):
    doc = fitz.open(pdf_path)
    for page in doc:
        for word in common_words:
            for idx, found_rect in enumerate(page.search_for(word)):
                page.add_highlight_annot(found_rect)
    temp_path = ((pdf_path).rsplit('/',1))[1]
    doc.save(destination_path+'/'+temp_path)
    doc.close()

def generate_highlight_text_pdf_file(source_folder, destination_folder, file_list):
    destination_folder = source_folder + '/' + destination_folder
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)
    
    pdf_list_path = ["./"+source_folder+"/"+file_path for file_path in file_list]
    texts = [tokenize_the_text(extract_text_from_pdf(file_path), 5) for file_path in pdf_list_path]
    common_words = set(texts[0]).intersection(*texts[1:])
    # print(common_words)
    for file_path in pdf_list_path:
        if not os.path.exists(destination_folder + "/" + file_path):
            print(f"Highlighting {file_path} Document." )
            highlight_word_in_pdf(file_path, destination_folder, common_words)   
def highlight_the_pdfs(get_list_of_groups_of_plagiarized , source_folder):
    for i in range(len(get_list_of_groups_of_plagiarized)):
        generate_highlight_text_pdf_file(source_folder , f"highlighted_pdfs", get_list_of_groups_of_plagiarized[i])

# source_folder = ".files"
# highlight_the_pdfs(get_list_of_groups_of_plagiarized , source_folder)
