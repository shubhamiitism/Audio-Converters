'use client';
import React from 'react';
import Link from 'next/link';
import './styles/style2.css';

const MainPage = () => {
    return (
        <div className="container">
            <h1>Audio Converters</h1>
            <ul className="converter-list">
                <li>
                    <Link href="/AudioConverters/mp3">Convert to MP3</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/aiff">Convert to AIFF</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/alac">Convert to ALAC</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/amr">Convert to AMR</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/flac">Convert to FLAC</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/m4a">Convert to M4A</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/m4r">Convert to M4R</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/ogg">Convert to OGG</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/opus">Convert to OPUS</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/wav">Convert to WAV</Link>
                </li>
                <li>
                    <Link href="/AudioConverters/wma">Convert to WMA</Link>
                </li>
            </ul>
        </div>
    );
};

export default MainPage;
