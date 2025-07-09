'use client';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const ShiftManager = () => {
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [endPeriod, setEndPeriod] = useState('PM');
  const [bufferMin, setBufferMin] = useState('');
  const [planList, setPlanList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }
}, []);
  const hours = [...Array(12)].map((_, i) => (i + 1).toString().padStart(2, '0'));
  const mins = ['00', '15', '30', '45'];

  const parseTime = (ts) => {
    const date = new Date(ts);
    let h = date.getHours(), m = date.getMinutes(), ap = 'AM';
    if (h >= 12) { ap = 'PM'; if (h > 12) h -= 12; }
    if (h === 0) h = 12;
    return { hour: h.toString().padStart(2, '0'), minute: m.toString().padStart(2, '0'), period: ap };
  };

 useEffect(() => {
  if (!token) return;

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  axios.get(`https://appointify.coinagesoft.com/api/ConsultantShift`, authHeaders)
    .then((r) => {  
      setShifts(r.data);

      if (shifts.length === 0) {
  setMessage("No shifts found for this consultant.");
}
      console.log("shifts loaded =", r.data);
    })
    .catch(() => setError('Cannot load shifts'));

  axios.get(`https://appointify.coinagesoft.com/api/ConsultationPlan/get-all`)
    .then((r) => {
      setPlanList(r.data);
      console.log("plans loaded =", r.data);
    })
    .catch(() => console.log('No plans'));

}, [token]);

  useEffect(() => {
    if (!selectedShift) return;
    const ps = parseTime(selectedShift.startTime);
    const pe = parseTime(selectedShift.endTime);
    setStartHour(ps.hour); setStartMinute(ps.minute); setStartPeriod(ps.period);
    setEndHour(pe.hour); setEndMinute(pe.minute); setEndPeriod(pe.period);
  }, [selectedShift]);

  const buildTimestamp = (h, m, p) => {
    let hh = parseInt(h);
    if (p === 'PM' && hh < 12) hh += 12;
    if (p === 'AM' && hh === 12) hh = 0;
    return new Date(0, 0, 0, hh, parseInt(m)).toISOString();
  };

  const saveShift = async () => {
    try {
      const body = {
        startTime: buildTimestamp(startHour, startMinute, startPeriod),
        endTime: buildTimestamp(endHour, endMinute, endPeriod),
        name: selectedShift?.id ? selectedShift.name : `Shift (${startHour}:${startMinute}-${endHour}:${endMinute})`
      };

      const res = selectedShift?.id
        ? await axios.put(`https://appointify.coinagesoft.com/api/ConsultantShift/${selectedShift.id}`, body, authHeaders)
        : await axios.post(`https://appointify.coinagesoft.com/api/ConsultantShift`, body, authHeaders);

      setMessage('Shift saved successfully');
      setError('');
      const { data } = await axios.get(`https://appointify.coinagesoft.com/api/ConsultantShift`, authHeaders);
      setShifts(data);
      setSelectedShift(null);
    } catch (err) {
      setError(err?.response?.data || 'Save failed');
    }
  };

  const saveBuffer = async () => {
    if (!selectedPlan || !selectedShift) return setError('Select plan and shift first');
    try {
      await axios.post(`https://appointify.coinagesoft.com/api/PlanBufferRule`, {
        planId: selectedPlan.id,
        shiftId: selectedShift.id,
        bufferInMinutes: parseInt(bufferMin)
      }, authHeaders);
      setMessage('Buffer saved');
      setError('');
    } catch (err) {
      setError(err?.response?.data || 'Buffer error');
    }
  };

  return (
    <Container className="p-4 bg-white">
      <h3>Manage Shifts & Buffers</h3>
      <Form.Group className="mb-3">
        <Form.Label>Choose Shift</Form.Label>
        <Form.Select onChange={(e)=> {
          const sh = shifts.find(s=>s.id===e.target.value);
          setSelectedShift(sh);
        }} value={selectedShift?.id || ''}>
          <option value="">-- new or select --</option>
          {shifts.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.startTime}‑{s.endTime})</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row><Col>Start</Col><Col>End</Col></Row>
      <Row className="mb-3">
        {[startHour, startMinute, startPeriod].map((v,i)=>
          <Col key={'s'+i}>
            <Form.Select value={v} onChange={e=>[setStartHour,setStartMinute,setStartPeriod][i](e.target.value)}>
              <option>--</option>
              {(i===0?hours: i===1?mins: ['AM','PM']).map(opt=><option key={opt}>{opt}</option>)}
            </Form.Select>
          </Col>)}
        {[endHour, endMinute, endPeriod].map((v,i)=>
          <Col key={'e'+i}>
            <Form.Select value={v} onChange={e=>[setEndHour,setEndMinute,setEndPeriod][i](e.target.value)}>
              <option>--</option>
              {(i===0?hours: i===1?mins: ['AM','PM']).map(opt=><option key={opt}>{opt}</option>)}
            </Form.Select>
          </Col>)}
      </Row>
      <Button onClick={saveShift}>Save Shift</Button>

      <hr/>

      <Form.Group className="mb-3">
        <Form.Label>Select Plan</Form.Label>
        <Form.Select onChange={e => setSelectedPlan(planList.find(p=>p.id===e.target.value))} value={selectedPlan?.id||''}>
          <option value="">-- choose plan --</option>
          {planList.map(p => <option key={p.id} value={p.id}>{p.planName} ({p.planDuration} min)</option>)}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Buffer Minutes</Form.Label>
        <Form.Control type="number" value={bufferMin} onChange={e=>setBufferMin(e.target.value)} placeholder="e.g. 10"/>
      </Form.Group>
      <Button onClick={saveBuffer}>Save Buffer Rule</Button>

      {message && <Alert variant="success" className="mt-3">{message}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
};

export default ShiftManager;
