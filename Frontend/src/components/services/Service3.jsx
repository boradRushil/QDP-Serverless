import React, { useState } from 'react';
import { Card, Row, Col, Button, Table } from 'react-bootstrap';
import FileUploadComponent from '../common/FileUploadComponent';
import ProcessingResultsTable from '../common/ProcessingResultsTable';

const Service3 = ({ service }) => {
    const [processingResults, setProcessingResults] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileUpload = (file) => {
        setUploadedFile(file);
    };

    const handleProcessFile = async () => {
        if (!uploadedFile) return;

        try {
            // TODO: Implement actual file processing
            const result = {
                id: Date.now(),
                fileName: uploadedFile.name,
                referenceCode: `JSON2CSV-${Math.random().toString(36).substr(2, 9)}`,
                status: 'Success',
                processingDate: new Date().toLocaleString(),
                fileSize: `${(uploadedFile.size / 1024).toFixed(2)} KB`
            };

            setProcessingResults([result, ...processingResults]);
        } catch (error) {
            console.error('Processing error:', error);
        }
    };

    return (
        <Card>
            <Card.Header className="bg-primary text-white">
                <h3>{service.name}</h3>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <FileUploadComponent
                            acceptedFileTypes=".json"
                            onFileUpload={handleFileUpload}
                        />
                    </Col>
                    <Col md={6} className="d-flex align-items-end">
                        <Button
                            variant="success"
                            onClick={handleProcessFile}
                            disabled={!uploadedFile}
                        >
                            Generate Word Cloud
                        </Button>
                    </Col>
                </Row>

                {processingResults.length > 0 && (
                    <ProcessingResultsTable
                        results={processingResults}
                        columns={['Reference Code', 'File Name', 'Status', 'Processing Date']}
                    />
                )}
            </Card.Body>
        </Card>
    );
};

export default Service3;