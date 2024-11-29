import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaCloudUploadAlt } from 'react-icons/fa';

const FileUploadComponent = ({
                                 acceptedFileTypes,
                                 onFileUpload,
                                 maxFileSize = 10 * 1024 * 1024 // 10MB default
                             }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            if (selectedFile.size > maxFileSize) {
                setError('File size exceeds the maximum limit');
                return;
            }

            setFile(selectedFile);
            setError(null);
            onFileUpload(selectedFile);
        }
    };

    return (
        <div>
            <Form.Group>
                <Form.Label>Upload File</Form.Label>
                <div className="d-flex">
                    <Form.Control
                        type="file"
                        accept={acceptedFileTypes}
                        onChange={handleFileChange}
                        className="me-2"
                    />
                    <Button variant="outline-primary">
                        <FaCloudUploadAlt /> Upload
                    </Button>
                </div>
                {file && (
                    <div className="mt-2 text-success">
                        Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </div>
                )}
                {error && (
                    <div className="mt-2 text-danger">
                        {error}
                    </div>
                )}
            </Form.Group>
        </div>
    );
};

export default FileUploadComponent;