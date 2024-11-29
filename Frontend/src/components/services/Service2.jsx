import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Spinner, Toast, ToastContainer } from 'react-bootstrap';

const Service2 = ({ service }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [referenceCode, setReferenceCode] = useState('');
    const [processingStatus, setProcessingStatus] = useState('');
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            showToastMessage('File selected successfully.');
        }
    };

    const handleProcessFile = async () => {
        if (!uploadedFile) {
            showToastMessage('Please upload a file first.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                file_name: uploadedFile.name,
                file_data: btoa(await uploadedFile.text()), // Base64 encode file
                user_email: 'user@example.com',
            };

            const response = await fetch('https://gi5xjk5b4qeuqmhrt5emaligpq0fkjsa.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            setReferenceCode(result.referenceCode);
            setProcessingStatus('In Progress');
            showToastMessage('File processing started successfully.');
        } catch (error) {
            console.error('Error during file processing:', error);
            showToastMessage('Error during file processing.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckStatus = async () => {
        if (!referenceCode) {
            showToastMessage('No reference code available. Please process a file first.');
            return;
        }

        try {
            const response = await fetch('https://prbi5j5sd2frbmbe6ruzqzvica0dkxyp.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference_code: referenceCode }),
            });

            const result = await response.json();
            setProcessingStatus(result.ProcessingStatus);

            if (result.ProcessingStatus === 'Completed') {
                setEntities(result.Entities);
                showToastMessage('File processing completed. Entities extracted.');
            } else {
                showToastMessage('File is still processing. Please check again later.');
            }
        } catch (error) {
            console.error('Error during status check:', error);
            showToastMessage('Error checking file status.');
        }
    };

    const handleDownloadEntities = () => {
        const blob = new Blob(
            entities.map((entity) => `${entity.text} (${entity.label})\n`),
            { type: 'text/plain;charset=utf-8' }
        );
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${referenceCode}_entities.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            <Card.Header className="bg-primary text-white">
                <h3>{service.name}</h3>
            </Card.Header>
            <Card.Body>
                <Row className="mb-3">
                    <Col md={6}>
                        <input
                            type="file"
                            accept=".txt"
                            onChange={handleFileUpload}
                            className="form-control"
                        />
                    </Col>
                    <Col md={6} className="d-flex justify-content-end align-items-center">
                        <Button
                            variant="success"
                            onClick={handleProcessFile}
                            disabled={!uploadedFile || loading}
                            className="mx-2"
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : 'Process Text File'}
                        </Button>
                        <Button
                            variant="info"
                            onClick={handleCheckStatus}
                            disabled={!referenceCode}
                            className="mx-2"
                        >
                            Check Status
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleDownloadEntities}
                            disabled={entities.length === 0}
                            className="mx-2"
                        >
                            Download Entities
                        </Button>
                    </Col>
                </Row>

                <Table bordered hover className="mt-4">
                    <thead>
                    <tr>
                        <th>Reference Code</th>
                        <th>Status</th>
                        <th>Entities Extracted</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{referenceCode || 'N/A'}</td>
                        <td>{processingStatus || 'N/A'}</td>
                        <td>
                            {entities.length > 0 ? (
                                <ul>
                                    {entities.map((entity, index) => (
                                        <li key={index}>
                                            {entity.text} ({entity.label})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                'Not available'
                            )}
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </Card.Body>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Card>
    );
};

export default Service2;