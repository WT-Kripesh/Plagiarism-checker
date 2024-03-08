from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

from Plagiarim_checker import get_list_of_groups_of_plagiarized

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/submit-pdfs', methods=['POST'])
def submit_pdfs():
    data = request.json
    download_links = [] 
    # Extract filename and downloadURL for each link object
    for link_obj in data["downloadLinks"]:
        filename = link_obj["filename"]
        download_url = link_obj["downloadURL"]
        download_links.append((filename, download_url))
    print("hello1")
    downloaded_files = download_pdfs(download_links, "./pdfs")
    list_of_groups_of_plagiarized = get_list_of_groups_of_plagiarized(downloaded_files)
    # print("hello2",list_of_groups_of_plagiarized)

    i=0
    for item in list_of_groups_of_plagiarized:
        print(i, item)
        i+=1
    # Return some response back to the frontend if needed
    return jsonify({'success': True, 'message': 'PDF links submitted successfully','data':list_of_groups_of_plagiarized})


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



if __name__ == '__main__':
    app.run(debug=True)
