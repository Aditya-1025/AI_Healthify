import React from 'react';
import Card from '../common/Card';

const PatientCard = ({ patient }) => {
    return (
        <Card variant="elevated" size="default">
            <Card.Header>
                <h4>{patient?.name || 'Unknown'}</h4>
            </Card.Header>
            <Card.Body>
                <p style={{ margin: 0 }}>Age: {patient?.age ?? '–'}</p>
                <p style={{ margin: 0 }}>Contact: {patient?.phone ?? '–'}</p>
            </Card.Body>
        </Card>
    );
};

export default PatientCard;
