import React from 'react';
import Card from '../common/Card';

const AppointmentCard = ({ appointment }) => {
    return (
        <Card variant="elevated" size="default">
            <Card.Header>
                <h4>{appointment?.title || 'Appointment'}</h4>
            </Card.Header>
            <Card.Body>
                <p style={{ margin: 0 }}>Date: {appointment?.date ?? '–'}</p>
                <p style={{ margin: 0 }}>Doctor: {appointment?.doctor ?? '–'}</p>
                <p style={{ margin: 0 }}>Status: {appointment?.status ?? 'Pending'}</p>
            </Card.Body>
        </Card>
    );
};

export default AppointmentCard;
