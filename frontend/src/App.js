import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [isResizing, setIsResizing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const cancelTokenSourceRef = useRef(null);

  const fetchRectangle = async () => {
    setError('');

    try {
      const response = await axios.get('http://localhost:5171/rectangle');
      setWidth(response.data.width);
      setHeight(response.data.height);
    } catch (err) {
      setError('Error fetching rectangle: ' + (err.response?.data || err.message));
    }
  };

  useEffect(() => {
    fetchRectangle();
  }, []);

  const updateRectangle = async (rectangle) => {
    setError('');
    setSuccess('');

    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Operation canceled due to new request.");
    }

    cancelTokenSourceRef.current = axios.CancelToken.source();

    try {
      await axios.post('http://localhost:5171/rectangle', rectangle, {
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: cancelTokenSourceRef.current.token,
      });
      setSuccess('Rectangle updated successfully!');
    } 
    catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled.');
      } 
      else {
        setError('Error updating rectangle: ' + (err.response?.data || err.message));
      }
    } 
    finally {
      cancelTokenSourceRef.current = null;
    }
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    if (isResizing) {
      updateRectangle({ Height: height, Width: width });
    }
    setIsResizing(false);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = e.clientX - e.target.getBoundingClientRect().left;
      const newHeight = e.clientY - e.target.getBoundingClientRect().top;

      if (newWidth !== width || newHeight !== height) {
        setWidth(newWidth);
        setHeight(newHeight);
      }
    }
  };

  const perimeter = 2 * (width + height);

  return (
    <div>
      <h2>Rectangle Details</h2>
      <p>Height: {height}</p>
      <p>Width: {width}</p>
      <p>Perimeter: {perimeter}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <svg
        width="100%"
        height="500px"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ border: '1px solid black' }}
      >
        <rect
          x="50"
          y="50"
          width={width}
          height={height}
          fill="lightblue"
          onMouseDown={handleMouseDown}
        />
      </svg>
    </div>
  );
};

export default App;
