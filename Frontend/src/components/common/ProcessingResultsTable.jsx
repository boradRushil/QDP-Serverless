import React from 'react';
import { Table } from 'react-bootstrap';

const ProcessingResultsTable = ({ results, columns }) => {
    return (
        <div className="mt-4">
            <h4>Processing Results</h4>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index}>{col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {results.map((result) => (
                    <tr key={result.id}>
                        <td>{result.referenceCode}</td>
                        <td>{result.fileName}</td>
                        <td>{result.status}</td>
                        <td>{result.processingDate}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProcessingResultsTable;