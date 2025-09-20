'use client'
import { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationProvider';

const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_PINATA_JWT_TOKEN; // Use environment variable

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [currentFacingMode, setCurrentFacingMode] = useState('environment');
  const [isRecording, setIsRecording] = useState(false);
  const { openNotification } = useNotification();

  useEffect(() => {
    return () => {
      // Clean up camera stream on unmount
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentFacingMode },
        audio: true
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Mute video element
      }
      setMediaStream(stream);
    } catch (error) {
      console.error('Error accessing the camera', error);
      alert('Error accessing the camera: ' + (error as any)?.message);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setMediaStream(null);
    }
  };

  const handleStartRecording = async () => {
    await startCamera();
    if (mediaStream) {
      const recorder = new MediaRecorder(mediaStream);
      recorder.ondataavailable = event => setRecordedChunks(prev => [...prev, event.data]);
      recorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        saveToDevice(blob, 'video.webm');
        await uploadToIPFS(blob, 'video.webm');
        stopCamera();
        setRecordedChunks([]);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleTakePhoto = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/png');
        const blob = await fetch(dataURL).then(res => res.blob());
        await uploadToIPFS(blob, 'image.png');
        saveToDevice(blob, 'photo.png');
      }
    }
  };

  const handleSwitchCamera = async () => {
    setCurrentFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    if (isRecording && mediaRecorder) {
      mediaRecorder.pause();
    }
    stopCamera();
    await startCamera();
    if (isRecording && mediaRecorder) {
      mediaRecorder.resume();
    }
  };

  const uploadToIPFS = async (fileBlob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('file', fileBlob, fileName);

    try {
      const response = await fetch('/api/upload-to-ipfs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${NFT_STORAGE_TOKEN}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('File uploaded to IPFS:', result);
      openNotification("success", "File uploaded to IPFS", `${result.IpfsHash}`);
      alert(`File uploaded to IPFS: ${result.IpfsHash}`);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      openNotification("error", "", `Error uploading to IPFS: ${(error as any)?.message}`);
      alert('Error uploading to IPFS: ' + (error as any)?.message);
    }
  };

  const saveToDevice = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Camera Functionality</h1>
      <video ref={videoRef} autoPlay style={{ display: isRecording ? 'block' : 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div>
        <button onClick={handleStartRecording} disabled={isRecording}>Start Recording</button>
        <button onClick={handleStopRecording} disabled={!isRecording}>Stop Recording</button>
        <button onClick={handleTakePhoto} disabled={isRecording}>Take Photo</button>
        <button onClick={handleSwitchCamera} disabled={isRecording}>Switch Camera</button>
      </div>
    </div>
  );
}
