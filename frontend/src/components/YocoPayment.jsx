// 222567023 - Ricardo Mukwevho - Yoco dummy integration - White & Yellow theme
import { useState } from 'react';

export default function YocoPayment({ amount = 150 }) {
  const [status, setStatus] = useState('');

  const handlePay = () => {
    setStatus('Processing with Yoco...');
    setTimeout(() => {
      setStatus('✅ Payment Successful! (DUMMY - 222567023)');
      alert('Yoco Payment Successful - R' + amount + ' - Student: 222567023');
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div style={{background: 'white', color: 'black', padding: '24px', borderRadius: '16px', border: '2px solid #FFCC00'}}>
      <h3 style={{fontWeight: '800', color: 'black'}}>Pay with Yoco</h3>
      <p style={{color: '#333'}}>Secure checkout - White & Yellow Theme</p>
      <div style={{background: '#FFF9DB', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #FFCC00'}}>
        <p style={{color: 'black', margin: 0, fontWeight: 'bold'}}>Amount: R{amount}.00 ZAR</p>
      </div>
      <button onClick={handlePay} style={{background: '#FFCC00', color: 'black', padding: '14px 24px', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', width: '100%', fontSize: '16px'}}>
        Pay R{amount} with Yoco
      </button>
      {status && <p style={{marginTop: '14px', fontWeight: 'bold', color: '#b58900'}}>{status}</p>}
      <small style={{color: '#666'}}>Test Mode • 222567023-yoco</small>
    </div>
  );
}
