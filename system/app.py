from flask import Flask, request, jsonify
import os
from Plagiarim_checker import get_list_of_groups_of_plagiarized

app = Flask(__name__)

@app.route('/plagiarism-check', methods=['POST'])
def plagiarism_check():
    if 'files' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400

    uploaded_files = request.files.getlist('files')
    for file in uploaded_files:
        # Save the uploaded files to a temporary location if needed
        file.save('temp/' + file.filename)

    # Run plagiarism checking logic on the uploaded files
    list_of_groups_of_plagiarized = get_list_of_groups_of_plagiarized("temp")

    # Delete the temporary files after plagiarism checking
    for file in uploaded_files:
        os.remove('temp/' + file.filename)

    return jsonify({'plagiarism_groups': list_of_groups_of_plagiarized})

if __name__ == '__main__':
    app.run(debug=True)
