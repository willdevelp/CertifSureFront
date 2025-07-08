import React, { useState } from 'react';
import axios from 'axios';
// import { QRCodeSVG } from 'qrcode.react';

function ReferenceGenerator() {
    const [imageUrl, setImageUrl] = useState('');
    const [generatedRefs, setGeneratedRefs] = useState([]);
  
    const handleGenerate = async () => {
      const response = await axios.post('http://localhost:8000/api/generate', {
        count: 1,
        image_url: imageUrl // Envoie l'URL de l'image
      });
      setGeneratedRefs(response.data);
    };
  
    return (
      <div>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL de l'image à afficher"
        />
        <button onClick={handleGenerate}>Générer QR Code</button>
        
        {generatedRefs.map((ref) => (
          <div key={ref.reference}>
            <img src={ref.qr_code_url} alt="QR Code" />
            <p>Ce QR code affichera: {ref.target_image}</p>
          </div>
        ))}
      </div>
    );
  }

export default ReferenceGenerator;
