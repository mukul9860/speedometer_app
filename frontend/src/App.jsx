import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ReactSpeedometer from 'react-speedometer';
import './App.css';

// Connect to backend
const socket = io('http://localhost:5001');

function App() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    socket.on('speed_update', (newSpeed) => {
      setSpeed(newSpeed);
    });

    return () => {
      socket.off('speed_update');
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Unbox Robotics: Speedometer App</h1>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
      <ReactSpeedometer
        width={300}            
        height={300}           
        maxValue={120}
        value={Number(speed)}
        needleColor="red"
        startColor="green"
        segments={5}
        endColor="blue"
        textColor="black"
        currentValueText="Speed: #{value} km/h"
      />
      </div>
    </div>
  );
}

export default App;