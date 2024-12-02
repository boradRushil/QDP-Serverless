import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import FeedbackComponent from '../FeedbackComponent';
import FeedbackTableComponent from '../FeedbackTableComponent';

const Service3 = ({ service }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [referenceCode, setReferenceCode] = useState('');
    const [processingStatus, setProcessingStatus] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const { status, numberOfFiles ,setNumberOfFiles } = useAuth();
    const userEmail = localStorage.getItem('userEmail');
    const [feedbackRefresh, setFeedbackRefresh] = useState(0);

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
        if (!status && numberOfFiles >= 2) {
            showToastMessage('You have reached the maximum number of files.');
            return;
        }
        if (!uploadedFile) {
            showToastMessage('Please upload a file first.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                file_name: uploadedFile.name,
                file_data: btoa(await uploadedFile.text()), // Base64 encode file
                user_email: userEmail,
            };

            const response = await fetch('SERVICE3_POST_LAMBDA_URL', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            setReferenceCode(result.reference_code);
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
            const response = await fetch('SERVICE3_GET_LAMBDA_URL', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference_code: referenceCode }),
            });

            const result = await response.json();
            setProcessingStatus(result.processing_status);

            if (result.processing_status === 'Succeeded') {
                setDownloadUrl(result.public_download_url);
                showToastMessage('File processing completed. Ready for download.');
            } else {
                showToastMessage('File is still processing. Please check again later.');
            }
        } catch (error) {
            console.error('Error during status check:', error);
            showToastMessage('Error checking file status.');
        }
    };

    const handleFeedbackSubmitted = () => {
        setFeedbackRefresh(prev => prev + 1);
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
                            accept=".json"
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
                            {loading ? <Spinner animation="border" size="sm" /> : 'Generate Word Cloud'}
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
                            href={downloadUrl}
                            target="_blank"
                            disabled={!downloadUrl}
                            className="mx-2"
                        >
                            Download
                        </Button>
                    </Col>
                </Row>

                <Table bordered hover className="mt-4">
                    <thead>
                    <tr>
                        <th>Reference Code</th>
                        <th>Status</th>
                        <th>Download Link</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{referenceCode || 'N/A'}</td>
                        <td>{processingStatus || 'N/A'}</td>
                        <td>
                            {downloadUrl ? (
                                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                                    Download File
                                </a>
                            ) : (
                                'Not available'
                            )}
                        </td>
                    </tr>
                    </tbody>
                </Table>
                <div className="mt-4">
                    <FeedbackComponent 
                        userId={email} 
                        processId={referenceCode || 'unknown'} 
                        serviceId={3}
                        onFeedbackSubmitted={handleFeedbackSubmitted} 
                    />
                    <FeedbackTableComponent 
                        service={3} 
                        refreshTrigger={feedbackRefresh}
                    />
                </div>
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

export default Service3;
