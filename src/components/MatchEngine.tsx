'use client';

import React, { useEffect, useState, useRef } from 'react';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { matchBananaIdentity } from '@/app/actions/match';
import Script from 'next/script';
import Link from 'next/link';

declare global {
  interface Window {
    cv: any;
  }
}

export function MatchEngine({ photoUrl, targetBananaId }: { photoUrl: string, targetBananaId?: string }) {
  const [cvLoaded, setCvLoaded] = useState(false);
  const [status, setStatus] = useState<string>('INITIALIZING VISUAL EXTRACTION');
  const [error, setError] = useState<string | null>(null);
  
  const [matchResult, setMatchResult] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.cv && window.cv.Mat) {
      setCvLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (cvLoaded && photoUrl) {
      runMatchPipeline();
    }
  }, [cvLoaded, photoUrl]);

  const runMatchPipeline = async () => {
    if (!window.cv || !window.cv.Mat) return;
    if (!imgRef.current || !canvasRef.current) return;

    try {
      setStatus('EXTRACTING VISUAL FEATURES...');
      await new Promise(r => setTimeout(r, 50));

      const cv = window.cv;
      const imgElement = imgRef.current;
      
      let src = cv.imread(imgElement);
      const MAX_DIM = 600;
      let scale = 1;
      if (src.cols > MAX_DIM || src.rows > MAX_DIM) {
        scale = MAX_DIM / Math.max(src.cols, src.rows);
        let dsize = new cv.Size(Math.round(src.cols * scale), Math.round(src.rows * scale));
        let resized = new cv.Mat();
        cv.resize(src, resized, dsize, 0, 0, cv.INTER_AREA);
        src.delete();
        src = resized;
      }
      
      // Thresholding
      let hsv = new cv.Mat();
      cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
      cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

      let low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [15, 40, 40, 0]);
      let high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [90, 255, 255, 0]);
      
      let mask = new cv.Mat();
      cv.inRange(hsv, low, high, mask);
      
      let M = cv.Mat.ones(5, 5, cv.CV_8U);
      cv.morphologyEx(mask, mask, cv.MORPH_OPEN, M);
      cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, M);
      
      // Contours
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      if (contours.size() === 0) throw new Error('No subject detected in image.');

      let maxArea = 0;
      let maxContourIndex = -1;
      for (let i = 0; i < contours.size(); ++i) {
        let area = cv.contourArea(contours.get(i));
        if (area > maxArea) {
          maxArea = area;
          maxContourIndex = i;
        }
      }

      if (maxArea < 2000) throw new Error('Detected subject is too small for verification.');

      let bananaContour = contours.get(maxContourIndex);
      
      // Curvature
      let points = [];
      for(let i=0; i<bananaContour.rows; i++) {
        points.push({ x: bananaContour.data32S[i*2], y: bananaContour.data32S[i*2 + 1] });
      }
      
      let maxDistSq = 0;
      let pt1 = points[0], pt2 = points[0];
      const step = Math.max(1, Math.floor(points.length / 50));
      for(let i=0; i<points.length; i+=step) {
        for(let j=i+step; j<points.length; j+=step) {
          let dx = points[i].x - points[j].x;
          let dy = points[i].y - points[j].y;
          let distSq = dx*dx + dy*dy;
          if (distSq > maxDistSq) { maxDistSq = distSq; pt1 = points[i]; pt2 = points[j]; }
        }
      }

      const tipDist = Math.sqrt(maxDistSq);
      let maxDeviation = 0;
      for(let i=0; i<points.length; i++) {
        const num = Math.abs((pt2.x - pt1.x)*(pt1.y - points[i].y) - (pt1.x - points[i].x)*(pt2.y - pt1.y));
        const dev = num / tipDist;
        if (dev > maxDeviation) maxDeviation = dev;
      }

      // Feature extraction matching Step 3
      const straightnessIndex = Math.max(0, 100 - (maxDeviation / tipDist * 300));
      const curvatureAngle = (maxDeviation / tipDist) * 180;
      
      // Ripeness
      let meanColor = cv.mean(hsv, mask);
      const avgHue = meanColor[0];
      let ripenessPercent = 0;
      if (avgHue > 35) ripenessPercent = Math.max(0, 100 - (avgHue - 35) * 5);
      else if (avgHue > 25) ripenessPercent = 70 + (35 - avgHue) * 2;
      else ripenessPercent = 100;

      // Draw Trace Canvas
      let traceImg = src.clone();
      cv.drawContours(traceImg, contours, maxContourIndex, new cv.Scalar(0,255,0,255), 2, cv.LINE_8, hierarchy, 0);
      cv.line(traceImg, new cv.Point(pt1.x, pt1.y), new cv.Point(pt2.x, pt2.y), new cv.Scalar(255, 0, 0, 255), 2);
      cv.imshow(canvasRef.current, traceImg);

      // Cleanup
      src.delete(); hsv.delete(); low.delete(); high.delete(); mask.delete(); M.delete();
      contours.delete(); hierarchy.delete(); traceImg.delete();

      // Normalize features to Signature
      const fCurvature = Math.min(99, Math.round(curvatureAngle)).toString().padStart(2, '0');
      const fStraightness = Math.min(99, Math.round(straightnessIndex)).toString().padStart(2, '0');
      const fRipeness = Math.min(99, Math.round(ripenessPercent)).toString().padStart(2, '0');
      const featureSignature = `${fCurvature},${fStraightness},${fRipeness}`;

      setStatus('COMPARING AGAINST REGISTRY...');
      await new Promise(r => setTimeout(r, 800)); // UI delay for realism

      const response = await matchBananaIdentity(featureSignature, targetBananaId);
      
      if (response.error) {
        throw new Error(response.error);
      }

      setMatchResult(response.bestMatch);
      setCandidates(response.candidates || []);
      setStatus('COMPLETED');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Verification Failed');
      setStatus('FAILED');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <Script 
        src="https://docs.opencv.org/4.8.0/opencv.js" 
        strategy="lazyOnload" 
        onReady={() => { setTimeout(() => setCvLoaded(true), 500); }} 
      />

      {/* Left Column: Specimen Processing */}
      <div style={{ flex: '1 1 400px' }}>
        <OfficialCard title="Section 01: Submitted Specimen">
          <div style={{ marginBottom: '16px' }}>
            <strong>Analysis Status:</strong> <StatusBadge status={status} />
          </div>
          {error && <div style={{ color: 'var(--status-red)', marginBottom: '16px', fontWeight: 'bold' }}>{error}</div>}
          
          <div style={{ display: 'none' }}>
             <img ref={imgRef} src={photoUrl} alt="hidden-source" crossOrigin="anonymous" />
          </div>
          <div style={{ border: '2px solid var(--border-color)' }}>
            <canvas ref={canvasRef} style={{ width: '100%', display: 'block', backgroundColor: '#f0f0f0', minHeight: '200px' }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '8px', textAlign: 'center' }}>
            Digital Match Trace: Feature Extraction
          </div>
        </OfficialCard>
      </div>

      {/* Right Column: Match Results */}
      <div style={{ flex: '2 1 500px' }}>
        <OfficialCard title="Section 04: Match Results">
          {status !== 'COMPLETED' && status !== 'FAILED' ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
              Awaiting feature normalization and database comparison...
            </div>
          ) : matchResult ? (
            <div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '120px', height: '120px', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={matchResult.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--gov-blue)', fontSize: '1.5rem' }}>{matchResult.officialName}</h3>
                  <div style={{ fontFamily: 'monospace', color: 'var(--text-dark)', marginTop: '4px' }}>{matchResult.registrationNumber}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: matchResult.similarityScore > 85 ? 'var(--status-green)' : 'var(--status-warning)' }}>
                    {matchResult.similarityScore.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>SIMILARITY</div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '8px' }}>Feature</th>
                    <th style={{ padding: '8px' }}>Submitted</th>
                    <th style={{ padding: '8px' }}>Registry Record</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px' }}>Curvature</td>
                    <td style={{ padding: '8px' }}>{matchResult.comparedFeatures.submitted.curvature}°</td>
                    <td style={{ padding: '8px' }}>{matchResult.comparedFeatures.candidate.curvature}°</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px' }}>Straightness</td>
                    <td style={{ padding: '8px' }}>{matchResult.comparedFeatures.submitted.straightness}</td>
                    <td style={{ padding: '8px' }}>{matchResult.comparedFeatures.candidate.straightness}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px' }}>Ripeness</td>
                    <td style={{ padding: '8px' }}>{matchResult.comparedFeatures.submitted.ripeness}%</td>
                    <td style={{ padding: '8px' }}>{matchResult.comparedFeatures.candidate.ripeness}%</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ backgroundColor: 'var(--status-green-light)', border: `1px solid var(--status-green)`, padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
                <strong style={{ color: 'var(--status-green)' }}>IDENTITY ASSESSMENT: {matchResult.classification}</strong>
              </div>
            </div>
          ) : (
             <div style={{ backgroundColor: 'var(--status-red-light)', border: '1px solid var(--status-red)', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
               <strong style={{ color: 'var(--status-red)' }}>NO SUFFICIENT IDENTITY MATCH</strong>
               <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                 Highest candidate similarity: {candidates[0]?.similarityScore?.toFixed(1) || 0}%<br/>
                 Required threshold: 70%
               </div>
             </div>
          )}

          {status === 'COMPLETED' && (
            <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <strong>IMPORTANT:</strong> This BananaPrint is an experimental visual identity signature generated from observable image features. It should not be interpreted as a biological biometric identifier.
            </div>
          )}
        </OfficialCard>

        {candidates.length > 1 && (
          <OfficialCard title="Other Potential Matches">
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {candidates.slice(1, 4).map(c => (
                <li key={c.id} style={{ marginBottom: '8px' }}>
                  <Link href={`/registry/${c.id}`} style={{ fontWeight: 'bold', color: 'var(--gov-blue)' }}>{c.officialName}</Link> — {c.similarityScore.toFixed(1)}%
                </li>
              ))}
            </ul>
          </OfficialCard>
        )}
      </div>
    </div>
  );
}
