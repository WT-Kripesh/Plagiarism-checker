from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import os
from firebase_admin import credentials, storage,initialize_app

from Plagiarim_checker import get_list_of_groups_of_plagiarized,highlight_the_pdfs

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/submit-pdfs', methods=['POST'])
def recieve_pdfs():
    data = request.json
    download_links = [] 
    # Extract filename and downloadURL for each link object
    for link_obj in data["downloadLinks"]:
        filename = link_obj["filename"]
        download_url = link_obj["downloadURL"]
        download_links.append((filename, download_url))
    print("hello1")

    downloaded_files = download_pdfs(download_links, "./files/Pdfs")
    list_of_groups_of_plagiarized_and_scores = get_list_of_groups_of_plagiarized(downloaded_files)
    
    list_of_groups_of_plagiarized = list_of_groups_of_plagiarized_and_scores[0]
    list_of_corresponding_group_scores = list_of_groups_of_plagiarized_and_scores[1]

    print("highlighting started")
    highlight_the_pdfs(list_of_groups_of_plagiarized,"./files/Pdfs")
    # upload_pdfs_to_firebase("./files/Pdfs/highlighted_pdfs")
    i=0
    for item in list_of_groups_of_plagiarized:
        print(i, item)
        i+=1
    # Return some response back to the frontend if needed
    return jsonify({'success': True, 'message': 'Plagiarism checked successfully','data':list_of_groups_of_plagiarized})


def download_pdfs(download_links, download_directory):
    downloaded_files = []

    # Ensure the download directory exists, create it if it doesn't
    os.makedirs(download_directory, exist_ok=True)

    for filename, download_url in download_links:
        try:
            # Send a GET request to download the PDF content
            response = requests.get(download_url)
            if response.status_code == 200:
                # Construct the file path to save the downloaded PDF
                file_path = os.path.join(download_directory, filename)
                
                # Write the PDF content to the file
                with open(file_path, 'wb') as file:
                    file.write(response.content)
                
                # Add the tuple (filename, file_path) to the downloaded_files list
                downloaded_files.append((filename, file_path))
            else:
                print(f"Failed to download PDF '{filename}' from '{download_url}'. Status code: {response.status_code}")
        except Exception as e:
            print(f"An error occurred while downloading PDF '{filename}' from '{download_url}': {e}")

    return downloaded_files


cred = credentials.Certificate("./files/jsonkey.json")  
initialize_app(cred, {
    'storageBucket': "classroom-minor.appspot.com"
})
# Initialize Firebase Storage client
bucket = storage.bucket()

def upload_pdfs_to_firebase(pdf_folder_path):
    destination_folder = 'Highlighted_pdfs/'

    # Iterate over PDF files in the folder
    for filename in os.listdir(pdf_folder_path):
        if filename.endswith('.pdf'):
            pdf_file_path = os.path.join(pdf_folder_path, filename)
            destination_blob = bucket.blob(destination_folder + filename)
            
            # Upload the file to Firebase Storage
            with open(pdf_file_path, 'rb') as f:
                destination_blob.upload_from_file(f)
            
            # Set metadata for the blob
            destination_blob.metadata = {
                'contentType': 'application/pdf',  # Explicitly set Content-Type to PDF
                'contentDisposition': f'attachment; filename="{filename}"'  # Set Content-Disposition to attachment with filename
            }
            destination_blob.patch()  # Update metadata
            
            print(f"Uploaded {filename} to Firebase Storage in the highlighted_pdfs folder.\n")


if __name__ == '__main__':
    app.run(debug=True)
