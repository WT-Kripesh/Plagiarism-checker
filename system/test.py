from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from io import BytesIO
from PyPDF2 import PdfReader
from collections import defaultdict
import re
import math
import os
from itertools import combinations
import fitz  
# PyMuPDF
import string
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/submit-pdfs', methods=['POST'])
def submit_pdfs():
    data = request.json
    download_urls = [link["downloadURL"] for link in data["downloadLinks"]]

    print(download_urls)
    # print(pdf_links)
    # Process the PDF links here, you can pass them to your plagiarism detection function
    # Example:
    # list_of_groups_of_plagiarized = get_list_of_groups_of_plagiarized(pdf_links)
    # Download and process PDFs
    download_and_process_pdfs(download_urls)
    # Return some response back to the frontend if needed
    return jsonify({'success': True, 'message': 'PDF links submitted successfully', data : "I am kripesh"})


def extract_text_from_pdf(pdf_path):
    try:
        pdf_reader = PdfReader(pdf_path)
        text = ''
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
        print(text)
        return re.sub(r'\s+-', '-', text)
    
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None
def process_pdf(pdf_path):
    try:
        # This function represents your custom processing logic for the PDF content
        # Replace this with your actual processing code
        print("Processing PDF content...")
        text = extract_text_from_pdf(pdf_path)
        print("Extracted text:", text)
    except Exception as e:
        print(f"An error occurred while processing PDF {pdf_path}: {e}")


def download_and_process_pdfs(pdf_links):
    for link in pdf_links:
        try:
            response = requests.get(link)
            if response.status_code == 200:
                # Save the PDF content to a BytesIO object
                pdf_content = BytesIO(response.content)
                # Process the PDF content
                process_pdf(pdf_content)
            else:
                print(f"Failed to download PDF from {link}. Status code: {response.status_code}")
        except Exception as e:
            print(f"An error occurred while downloading PDF from {link}: {e}")







if __name__ == '__main__':
    app.run(debug=True)
