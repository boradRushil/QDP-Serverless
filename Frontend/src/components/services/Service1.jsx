import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Table, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import FeedbackComponent from '../FeedbackComponent';
import FeedbackTableComponent from '../FeedbackTableComponent';

const Service1 = ({ service }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [referenceCode, setReferenceCode] = useState('');
    const [processingStatus, setProcessingStatus] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const { numberOfFiles, setNumberOfFiles } = useAuth();
    const email = localStorage.getItem('userEmail');
    const [feedbackRefresh, setFeedbackRefresh] = useState(0);

    // console.log("status", status);

    // useEffect(() => {
    //     if (status) {
    //         console.log("logout");
    //         localStorage.removeItem('userEmail');
    //         setEmail('');
    //     }
    // }, [status, setEmail]);

    console.log("User Email:", email);
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

            const response = await fetch('https://2tn3ehho7sba6dnavpexebsn7m0soppt.lambda-url.us-east-1.on.aws/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            setReferenceCode(result.reference_code);
            setProcessingStatus('In Progress');
            setNumberOfFiles(numberOfFiles + 1);
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
            const response = await fetch('https://dzt55vkjhcmjtn54dw2k2ckaee0ksnrb.lambda-url.us-east-1.on.aws/', {
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
                            {loading ? <Spinner animation="border" size="sm" /> : 'Process JSON to CSV'}
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
                            Download File
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
                        serviceId={1}
                        onFeedbackSubmitted={handleFeedbackSubmitted} 
                    />
                    <FeedbackTableComponent 
                        service={1} 
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

export default Service1;
