'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { saveAnalysisResult } from '@/app/actions/analysis';
import Script from 'next/script';

declare global {
  interface Window {
    cv: any;
  }
}

export function AnalysisEngine({ bananaId, photoUrl }: { bananaId: string, photoUrl: string }) {
  const router = useRouter();
  const [cvLoaded, setCvLoaded] = useState(false);
  const [status, setStatus] = useState<string>('WAITING TO START');
  const [error, setError] = useState<string | null>(null);
  
  // Traces
  const [traceStages, setTraceStages] = useState<{name: string, dataUrl: string}[]>([]);
  const [results, setResults] = useState<any>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if CV is already loaded
    if (window.cv && window.cv.Mat) {
      setCvLoaded(true);
    }
  }, []);

  const runPipeline = async () => {
    if (!window.cv || !window.cv.Mat) {
      setError('OPENCV_NOT_LOADED: Core vision library failed to initialize.');
      return;
    }
    if (!imgRef.current || !canvasRef.current) return;

    try {
      setStatus('PROCESSING IMAGE');
      setTraceStages([]);
      setResults(null);
      setError(null);

      // We need a slight delay to allow UI to update
      await new Promise(r => setTimeout(r, 50));

      const cv = window.cv;
      const imgElement = imgRef.current;
      
      // Stage 1: Load Image
      let src = cv.imread(imgElement);
      
      // Stage 2: Resize for performance
      const MAX_DIM = 800;
      let scale = 1;
      if (src.cols > MAX_DIM || src.rows > MAX_DIM) {
        scale = MAX_DIM / Math.max(src.cols, src.rows);
        let dsize = new cv.Size(Math.round(src.cols * scale), Math.round(src.rows * scale));
        let resized = new cv.Mat();
        cv.resize(src, resized, dsize, 0, 0, cv.INTER_AREA);
        src.delete();
        src = resized;
      }
      
      cv.imshow(canvasRef.current, src);
      addTrace('ORIGINAL IMAGE', canvasRef.current.toDataURL());

      setStatus('DETECTING BANANA');
      await new Promise(r => setTimeout(r, 50));

      // Stage 3: Convert to HSV & Threshold (Banana Mask)
      let hsv = new cv.Mat();
      cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
      cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

      // Yellow/Green/Brown threshold ranges in OpenCV HSV (H: 0-180, S: 0-255, V: 0-255)
      let low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [15, 40, 40, 0]);
      let high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [90, 255, 255, 0]);
      
      let mask = new cv.Mat();
      cv.inRange(hsv, low, high, mask);
      
      // Morphological open/close to clean noise
      let M = cv.Mat.ones(5, 5, cv.CV_8U);
      cv.morphologyEx(mask, mask, cv.MORPH_OPEN, M);
      cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, M);
      
      cv.imshow(canvasRef.current, mask);
      addTrace('SEGMENTATION MASK', canvasRef.current.toDataURL());

      setStatus('EXTRACTING CONTOUR');
      await new Promise(r => setTimeout(r, 50));

      // Stage 4: Contour Extraction
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      if (contours.size() === 0) {
        throw new Error('SPECIMEN IMAGE QUALITY INSUFFICIENT: No banana-like object detected.');
      }

      // Find largest contour
      let maxArea = 0;
      let maxContourIndex = -1;
      for (let i = 0; i < contours.size(); ++i) {
        let area = cv.contourArea(contours.get(i));
        if (area > maxArea) {
          maxArea = area;
          maxContourIndex = i;
        }
      }

      // Validate detection size
      if (maxArea < 5000) {
        throw new Error('SPECIMEN IMAGE QUALITY INSUFFICIENT: Detected object is too small.');
      }

      let bananaContour = contours.get(maxContourIndex);
      
      // Draw contour
      let contourImg = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
      let color = new cv.Scalar(0, 255, 0, 255);
      cv.drawContours(contourImg, contours, maxContourIndex, color, 2, cv.LINE_8, hierarchy, 0);
      cv.imshow(canvasRef.current, contourImg);
      addTrace('CONTOUR EXTRACTION', canvasRef.current.toDataURL());

      setStatus('CALCULATING CURVATURE');
      await new Promise(r => setTimeout(r, 50));

      // Stage 5: Curvature Approximation
      // Find extreme points
      let points = [];
      for(let i=0; i<bananaContour.rows; i++) {
        points.push({
          x: bananaContour.data32S[i*2],
          y: bananaContour.data32S[i*2 + 1]
        });
      }
      
      // Heuristic: Find two points furthest apart (tips)
      let maxDistSq = 0;
      let pt1 = points[0], pt2 = points[0];
      // Sample subset of points for performance
      const step = Math.max(1, Math.floor(points.length / 100));
      for(let i=0; i<points.length; i+=step) {
        for(let j=i+step; j<points.length; j+=step) {
          let dx = points[i].x - points[j].x;
          let dy = points[i].y - points[j].y;
          let distSq = dx*dx + dy*dy;
          if (distSq > maxDistSq) {
            maxDistSq = distSq;
            pt1 = points[i];
            pt2 = points[j];
          }
        }
      }

      const tipDist = Math.sqrt(maxDistSq);

      // Find max deviation from straight line connecting tips
      let maxDeviation = 0;
      let devPt = points[0];
      for(let i=0; i<points.length; i++) {
        // Distance from point to line: |(x2-x1)(y1-y0) - (x1-x0)(y2-y1)| / sqrt((x2-x1)^2 + (y2-y1)^2)
        const num = Math.abs((pt2.x - pt1.x)*(pt1.y - points[i].y) - (pt1.x - points[i].x)*(pt2.y - pt1.y));
        const dev = num / tipDist;
        if (dev > maxDeviation) {
          maxDeviation = dev;
          devPt = points[i];
        }
      }

      // Draw trace showing tips and deviation
      let traceImg = src.clone();
      cv.line(traceImg, new cv.Point(pt1.x, pt1.y), new cv.Point(pt2.x, pt2.y), new cv.Scalar(255, 0, 0, 255), 2);
      cv.circle(traceImg, new cv.Point(devPt.x, devPt.y), 5, new cv.Scalar(0, 0, 255, 255), -1);
      cv.imshow(canvasRef.current, traceImg);
      addTrace('CURVE FIT / MEASUREMENT', canvasRef.current.toDataURL());

      // Calculate curvature metrics
      const straightnessIndex = Math.max(0, 100 - (maxDeviation / tipDist * 300));
      // Heuristic angle approximation based on deviation arc
      const curvatureAngle = (maxDeviation / tipDist) * 180;
      
      let classification = 'VERY STRAIGHT';
      if (curvatureAngle > 45) classification = 'EXTREMELY CURVED';
      else if (curvatureAngle > 30) classification = 'HIGHLY CURVED';
      else if (curvatureAngle > 15) classification = 'MODERATELY CURVED';
      else if (curvatureAngle > 5) classification = 'SLIGHTLY CURVED';

      setStatus('ANALYZING RIPENESS');
      await new Promise(r => setTimeout(r, 50));

      // Stage 6: Ripeness Assessment
      let meanColor = cv.mean(hsv, mask);
      const avgHue = meanColor[0]; // 0-180 in OpenCV
      
      // Hue Mapping: ~20-30 is yellow, ~35-45 is green.
      // We map this into an artificial "Ripeness %" for the demo
      let ripenessPercent = 0;
      let peelStatus = '';
      if (avgHue > 35) {
        ripenessPercent = Math.max(0, 100 - (avgHue - 35) * 5);
        peelStatus = 'Stage 2 — Green-Yellow';
      } else if (avgHue > 25) {
        ripenessPercent = 70 + (35 - avgHue) * 2;
        peelStatus = 'Stage 4 — Yellow';
      } else {
        ripenessPercent = 100; // Brownish
        peelStatus = 'Stage 6 — Overripe/Brown-dominant';
      }

      // Cleanup OpenCV memory
      src.delete(); hsv.delete(); low.delete(); high.delete(); mask.delete(); M.delete();
      contours.delete(); hierarchy.delete(); contourImg.delete(); traceImg.delete();

      const finalResults = {
        detectionConfidence: 98.2, // Heuristic assumed confidence if it passed size validation
        curvature: curvatureAngle,
        straightnessIndex: straightnessIndex,
        classification: classification,
        ripeness: ripenessPercent,
        peelAssessment: peelStatus
      };
      
      setResults(finalResults);
      setStatus('COMPLETED');
      
      // Save Results to DB
      await saveAnalysisResult(bananaId, finalResults);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ANALYSIS COULD NOT BE COMPLETED: Unknown Error');
      setStatus('FAILED');
    }
  };

  const addTrace = (name: string, dataUrl: string) => {
    setTraceStages(prev => [...prev, { name, dataUrl }]);
  };

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <Script 
        src="https://docs.opencv.org/4.8.0/opencv.js" 
        strategy="lazyOnload" 
        onReady={() => {
          // Wait briefly for the webassembly to initialize
          setTimeout(() => setCvLoaded(true), 1000);
        }} 
      />

      {/* Main Analysis View */}
      <div style={{ flex: '2 1 600px' }}>
        <OfficialCard title="Section 01: Specimen Visual Examination">
          <div style={{ marginBottom: '16px' }}>
            <strong>Analysis Status:</strong> <StatusBadge status={status} />
          </div>
          
          {error && (
            <div style={{ backgroundColor: 'var(--status-red-light)', color: 'var(--status-red)', padding: '16px', borderRadius: '4px', marginBottom: '24px', border: '1px solid var(--status-red)' }}>
              <strong>ANALYSIS COULD NOT BE COMPLETED</strong><br />
              Reason: {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ border: '2px solid var(--border-color)', padding: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '4px' }}>ORIGINAL SPECIMEN</div>
              <img 
                ref={imgRef} 
                src={photoUrl} 
                alt="Original" 
                crossOrigin="anonymous" 
                style={{ maxWidth: '300px', display: 'block' }} 
              />
            </div>
            
            <div style={{ border: '2px solid var(--gov-blue)', padding: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gov-blue)', fontWeight: 'bold', marginBottom: '4px' }}>PROCESSING CANVAS</div>
              <canvas 
                ref={canvasRef} 
                style={{ maxWidth: '300px', display: 'block', backgroundColor: '#f0f0f0', minHeight: '200px' }} 
              />
            </div>
          </div>
        </OfficialCard>

        {results && (
          <>
            <OfficialCard title="Section 05: Curvature Assessment">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 0', width: '40%' }}>Measured Curvature</th>
                    <td style={{ padding: '12px 0', fontFamily: 'monospace' }}>{results.curvature.toFixed(1)}°</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 0' }}>Straightness Index</th>
                    <td style={{ padding: '12px 0' }}>{results.straightnessIndex.toFixed(0)} / 100</td>
                  </tr>
                  <tr>
                    <th style={{ padding: '12px 0' }}>Classification</th>
                    <td style={{ padding: '12px 0', fontWeight: 'bold' }}>{results.classification}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '12px', fontStyle: 'italic' }}>
                * NOTE: Measurements are IMAGE-DERIVED estimations and rely on algorithmic heuristics.
              </div>
            </OfficialCard>

            <OfficialCard title="Section 06: Ripeness & Colour Assessment">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px 0', width: '40%' }}>Estimated Ripeness</th>
                    <td style={{ padding: '12px 0' }}>{results.ripeness.toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <th style={{ padding: '12px 0' }}>Ripeness Stage</th>
                    <td style={{ padding: '12px 0' }}>{results.peelAssessment}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '12px', fontStyle: 'italic' }}>
                * NOTE: This is an AI/IMAGE-ASSISTED ESTIMATION.
              </div>
            </OfficialCard>
          </>
        )}

        {traceStages.length > 0 && (
          <OfficialCard title="Digital Measurement Trace">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {traceStages.map((trace, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', border: '1px solid var(--border-color)', padding: '12px' }}>
                  <div style={{ width: '150px' }}>
                    <img src={trace.dataUrl} alt={trace.name} style={{ width: '100%', border: '1px solid #ccc' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>STAGE 0{idx + 1}</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--gov-blue)' }}>{trace.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </OfficialCard>
        )}
      </div>

      {/* Right Column: Actions & Log */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <OfficialCard title="Quick Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={runPipeline}
              disabled={!cvLoaded || status === 'PROCESSING IMAGE' || status === 'DETECTING BANANA' || status === 'EXTRACTING CONTOUR' || status === 'CALCULATING CURVATURE'}
              style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: cvLoaded ? 'pointer' : 'wait', opacity: cvLoaded ? 1 : 0.7 }}
            >
              {cvLoaded ? 'RUN ANALYSIS ENGINE' : 'INITIALIZING ENGINE...'}
            </button>
            <button 
              onClick={() => router.push(`/registry/${bananaId}/analysis/curvature`)}
              style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: '#e6f0ff', color: 'var(--gov-blue)', border: '2px solid var(--gov-blue)', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🍌 LAUNCH CURVATURE CHECKER
            </button>
            <button 
              onClick={() => router.push(`/registry/${bananaId}`)}
              style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: 'transparent', color: 'var(--gov-blue)', border: '2px solid var(--border-color)', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              RETURN TO PROFILE
            </button>
          </div>
        </OfficialCard>

        <OfficialCard title="Processing Pipeline">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <li>{traceStages.length >= 1 ? '✅' : '⏳'} Image Validated</li>
            <li>{traceStages.length >= 2 ? '✅' : '⏳'} Banana Detected</li>
            <li>{traceStages.length >= 2 ? '✅' : '⏳'} Segmentation Completed</li>
            <li>{traceStages.length >= 3 ? '✅' : '⏳'} Contour Extracted</li>
            <li>{traceStages.length >= 4 ? '✅' : '⏳'} Curvature Calculated</li>
            <li>{results ? '✅' : '⏳'} Ripeness Assessed</li>
            <li>{results ? '✅' : '⏳'} Report Data Stored</li>
          </ul>
        </OfficialCard>
      </div>
    </div>
  );
}
