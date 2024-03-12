import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfsViewer = ({ pdfPaths }) => {
    const [error, setError] = useState(null);

    // Function to handle errors
    const handleError = (error) => {
        setError(error);
    };

    return (
        <div>
            <h2>Highlighted PDFs Viewer</h2>
            {error ? (
                <div>Error: {error.message}</div>
            ) : (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div style={{ height: '750px' }}>
                        <Viewer fileUrl="./hello.pdf" onError={handleError} />
                    </div>
                </Worker>
            )}
        </div>
    );
};

export default PdfsViewer;
