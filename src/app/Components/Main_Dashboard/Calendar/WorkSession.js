import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const WorkSession = () => {
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [endPeriod, setEndPeriod] = useState('PM');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const hours = [...Array(12)].map((_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  // Convert "02:30 PM" to hour, minute, period
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    const [hour, minute] = time.split(':');
    return {
      hour: hour.padStart(2, '0'),
      minute,
      period
    };
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('http://4.213.95.138:9090/api/WorkSession');
        if (response.data && response.data.length > 0) {
          const session = response.data[0]; // You can modify to loop if needed
          const start = parseTime(session.workStartTime);
          const end = parseTime(session.workEndTime);
          setStartHour(start.hour);
          setStartMinute(start.minute);
          setStartPeriod(start.period);
          setEndHour(end.hour);
          setEndMinute(end.minute);
          setEndPeriod(end.period);
        }
      } catch (err) {
        console.error("Failed to load session data", err);
        setError("Unable to load work session data.");
      }
    };

    fetchSession();
  }, []);

  const buildDateTime = (hour, minute, period) => {
    let h = parseInt(hour);
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const hh = h.toString().padStart(2, '0');
    return `${dateStr}T${hh}:${minute}:00`;
  };

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    if (!startHour || !startMinute || !endHour || !endMinute) {
      setError("Please select all time fields.");
      return;
    }

    const workStartTime = buildDateTime(startHour, startMinute, startPeriod);
    const workEndTime = buildDateTime(endHour, endMinute, endPeriod);

    const dataToSend = { workStartTime, workEndTime };

    try {
      const response = await axios.put(`http://4.213.95.138:9090/api/WorkSession/1`, dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage("Work session submitted successfully.");
      console.log("Server response:", response.data);
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.message || 'No error message from server.';
        setError(`Server Error (${status}): ${msg}`);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Container className="mt-5 p-4 card app-calendar-wrapper " style={{ backgroundColor: "white" }}>
      <h3 className="mb-4 text-center">Work Session</h3>

      {/* Start Time */}
      <Row className="mb-3">
        <Col>
          <Form.Label>Start Hour</Form.Label>
          <Form.Select value={startHour} onChange={(e) => setStartHour(e.target.value)}>
            <option value="">Hour</option>
            {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>Start Minute</Form.Label>
          <Form.Select value={startMinute} onChange={(e) => setStartMinute(e.target.value)}>
            <option value="">Minute</option>
            {minutes.map(min => <option key={min} value={min}>{min}</option>)}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>AM/PM</Form.Label>
          <Form.Select value={startPeriod} onChange={(e) => setStartPeriod(e.target.value)}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </Form.Select>
        </Col>
      </Row>

      {/* End Time */}
      <Row className="mb-3">
        <Col>
          <Form.Label>End Hour</Form.Label>
          <Form.Select value={endHour} onChange={(e) => setEndHour(e.target.value)}>
            <option value="">Hour</option>
            {hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>End Minute</Form.Label>
          <Form.Select value={endMinute} onChange={(e) => setEndMinute(e.target.value)}>
            <option value="">Minute</option>
            {minutes.map(min => <option key={min} value={min}>{min}</option>)}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>AM/PM</Form.Label>
          <Form.Select value={endPeriod} onChange={(e) => setEndPeriod(e.target.value)}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Submit Button */}
      <div className="text-center">
        <Button variant="primary" onClick={handleSubmit}>
          Submit Work Session
        </Button>
      </div>

      {/* Alerts */}
      {message && <Alert variant="success" className="mt-4 text-center">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-4 text-center">{error}</Alert>}
    </Container>
  );
};

export default WorkSession;
