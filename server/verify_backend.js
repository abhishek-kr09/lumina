const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- Starting Backend Verification ---');

        // 1. Health Check
        try {
            const healthRes = await axios.get('http://localhost:5000/');
            console.log('✅ Health Check Passed:', healthRes.data);
        } catch (error) {
            console.error('❌ Health Check Failed:', error.message);
            process.exit(1);
        }

        // Helper to generate random user
        const rand = Math.floor(Math.random() * 10000);
        const studentData = {
            name: `Student ${rand}`,
            email: `student${rand}@test.com`,
            password: 'password123',
            role: 'student'
        };
        const counselorData = {
            name: `Counselor ${rand}`,
            email: `counselor${rand}@test.com`,
            password: 'password123',
            role: 'counselor'
        };

        let studentToken = '';
        let counselorToken = '';
        let counselorId = '';

        // 2. Register Student
        try {
            const res = await axios.post(`${API_URL}/auth/register`, studentData);
            studentToken = res.data.token;
            console.log('✅ Student Registration Passed');
        } catch (error) {
            console.error('❌ Student Registration Failed:', error.response?.data?.message || error.message);
        }

        // 3. Login Student
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email: studentData.email, password: studentData.password });
            if (res.data.token) console.log('✅ Student Login Passed');
        } catch (error) {
            console.error('❌ Student Login Failed:', error.response?.data?.message || error.message);
        }

        // 4. Register Counselor
        try {
            const res = await axios.post(`${API_URL}/auth/register`, counselorData);
            counselorToken = res.data.token;
            counselorId = res.data._id;
            console.log('✅ Counselor Registration Passed');
        } catch (error) {
            console.error('❌ Counselor Registration Failed:', error.response?.data?.message || error.message);
        }

        // 5. Login Counselor (Verify)
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email: counselorData.email, password: counselorData.password });
            if (res.data.token) console.log('✅ Counselor Login Passed');
        } catch (error) {
            console.error('❌ Counselor Login Failed:', error.response?.data?.message || error.message);
        }

        // 6. Book Appointment (Student)
        let appointmentId = '';
        try {
            const res = await axios.post(
                `${API_URL}/appointment/book`,
                {
                    counselorId: counselorId,
                    date: '2024-12-25',
                    time: '10:00 AM',
                    concern: 'Academic stress'
                },
                { headers: { Authorization: `Bearer ${studentToken}` } }
            );
            appointmentId = res.data._id;
            console.log('✅ Book Appointment Passed');
        } catch (error) {
            console.error('❌ Book Appointment Failed:', error.response?.data?.message || error.message);
        }

        // 7. Get My Appointments (Student)
        try {
            const res = await axios.get(
                `${API_URL}/appointment/my`,
                { headers: { Authorization: `Bearer ${studentToken}` } }
            );
            if (res.data.length > 0) console.log('✅ Get Student Appointments Passed');
            else console.warn('⚠️ Student has no appointments (Unexpected)');
        } catch (error) {
            console.error('❌ Get Student Appointments Failed:', error.response?.data?.message || error.message);
        }

        // 8. Get Counselor Appointments
        try {
            const res = await axios.get(
                `${API_URL}/appointment/counselor`,
                { headers: { Authorization: `Bearer ${counselorToken}` } }
            );
            if (res.data.length > 0) console.log('✅ Get Counselor Appointments Passed');
            else console.warn('⚠️ Counselor has no appointments (Unexpected)');
        } catch (error) {
            console.error('❌ Get Counselor Appointments Failed:', error.response?.data?.message || error.message);
        }

        // 9. Update Appointment Status (Counselor)
        try {
            const res = await axios.patch(
                `${API_URL}/appointment/${appointmentId}/status`,
                { status: 'approved' },
                { headers: { Authorization: `Bearer ${counselorToken}` } }
            );
            if (res.data.status === 'approved') console.log('✅ Update Appointment Status Passed');
        } catch (error) {
            console.error('❌ Update Appointment Status Failed:', error.response?.data?.message || error.message);
        }

        console.log('--- Verification Complete ---');
    } catch (error) {
        console.error('Unexpected Error:', error);
    }
};

runVerification();
