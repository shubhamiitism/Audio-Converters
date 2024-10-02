'use client';
import React, { useState, useEffect, useRef } from 'react';
import '../styles/styles.css';

const wmaConverter = () => {
    const [audioFile, setAudioFile] = useState(null);
    const [audioDuration, setAudioDuration] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadLink, setDownloadLink] = useState('');
    const ffmpegRef = useRef(null);

    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        setAudioFile(file);

        // Create an audio element to extract the duration
        const audioElement = document.createElement('audio');
        audioElement.preload = 'metadata';
        audioElement.onloadedmetadata = () => {
            console.log('Audio duration:', audioElement.duration);
            setAudioDuration(audioElement.duration);
        };
        audioElement.src = URL.createObjectURL(file);
        console.log("Audio uploaded...");
    };

    useEffect(() => {
        const loadFFmpeg = async () => {
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
            const { FFmpeg } = await import('@ffmpeg/ffmpeg');
            const { toBlobURL } = await import('@ffmpeg/util');
            const ffmpeg = new FFmpeg();
            ffmpegRef.current = ffmpeg;
            ffmpeg.on('log', ({ message }) => {
                console.log('FFmpeg log:', message);
                const timeMatch = message.match(/time=\s*(\d+:\d+:\d+\.\d+)/);
                if (timeMatch) {
                    const [hours, minutes, seconds] = timeMatch[1].split(':').map(parseFloat);
                    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                    console.log('Total seconds processed:', totalSeconds);
                    if (audioDuration) {
                        const progressValue = (totalSeconds / audioDuration) * 100;
                        console.log('Progress value:', progressValue);
                        setProgress(progressValue);
                    }
                }
            });
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
        };

        loadFFmpeg();
    }, [audioDuration]);

    const triggerDownload = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const transcode = async () => {
        setProcessing(true);
        setProgress(0);
        try {
            const ffmpeg = ffmpegRef.current;
            const { fetchFile } = await import('@ffmpeg/util');
            await ffmpeg.writeFile('input', await fetchFile(audioFile));

            await ffmpeg.exec(['-i', 'input', 'output.wma']);
            
            const data = await ffmpeg.readFile('output.wma');
            const audioURL = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/wma' }));
            setDownloadLink(audioURL);

            // Automatically trigger download
            triggerDownload(audioURL, 'output.wma');
        } catch (error) {
            console.error('Error during FFmpeg command execution:', error);
        }
        setProcessing(false);
        setProgress(100);
    };

    return (
        <div className="container">
            <h1>Convert Audio to wma</h1>
            <div className="upload-container">
                <label htmlFor="audio">Upload audio file:</label>
                <input className="upload-btn" type="file" id="audio" accept="audio/*" onChange={handleAudioUpload} />
            </div>
            {loaded && (
                <div className="actions">
                    {processing ? (
                        <div>
                            <div className="loader">Processing...</div>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${progress}%` }}>
                                    {Math.round(progress)}%
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button className="convert-btn" onClick={transcode}>Convert to wma</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default wmaConverter;
