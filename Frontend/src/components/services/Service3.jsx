import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import FeedbackComponent from '../FeedbackComponent';
import FeedbackTableComponent from '../FeedbackTableComponent';

const Service3 = ({ service }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileContent, setFileContent] = useState(''); // Store file text content
    const [referenceCode, setReferenceCode] = useState('');
    const [processingStatus, setProcessingStatus] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [history, setHistory] = useState([]);
    const { status, numberOfFiles, setNumberOfFiles } = useAuth();
    const userEmail = localStorage.getItem('userEmail');
    const [feedbackRefresh, setFeedbackRefresh] = useState(0);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            const userToken = localStorage.getItem('userToken');
            console.log("The token is here " + userToken);
            reader.onload = (e) => {
                setFileContent(e.target.result); // Store the file's text content
                setUploadedFile(file);
                showToastMessage('Text file loaded successfully.');
            };
            reader.onerror = () => {
                showToastMessage('Error reading file.');
            };
            reader.readAsText(file);
        } else {
            showToastMessage('Please upload a valid text file.');
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
            const userToken = localStorage.getItem('userToken');
            if (!userToken) throw new Error('User not authenticated.');

            const payload = {
                file_name: uploadedFile.name,
                file_data: btoa(await uploadedFile.text()),
                user_email: userEmail,
            };

            const response = await fetch('SERVICE3_POST_LAMBDA_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
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
            const userToken = localStorage.getItem('userToken');
            if (!userToken) throw new Error('User not authenticated.');

            const response = await fetch('SERVICE3_GET_LAMBDA_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
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
        setFeedbackRefresh((prev) => prev + 1);
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

                {/* History Table */}
                <h5 className="mt-4">Processing History</h5>
                <Table bordered hover>
                    <thead>
                    <tr>
                        <th>File Name</th>
                        <th>Upload Date</th>
                        <th>Reference Code</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.length > 0 ? (
                        history.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.fileName}</td>
                                <td>{entry.uploadDate}</td>
                                <td>{entry.referenceCode}</td>
                                <td>{entry.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No history available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>

                <div className="mt-4">
                    <FeedbackComponent
                        userId={userEmail}
                        processId={referenceCode || 'unknown'}
                        serviceId={3}
                        onFeedbackSubmitted={handleFeedbackSubmitted}
                    />
                    <FeedbackTableComponent service={3} refreshTrigger={feedbackRefresh} />
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
