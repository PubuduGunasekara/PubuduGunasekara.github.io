import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#f8f6f2',
          backgroundImage: 'radial-gradient(circle at 85% 10%, rgba(14,116,144,0.18), transparent 55%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#0e7490', fontWeight: 600, letterSpacing: -0.5 }}>
          Pubudu Gunasekara
        </div>
        <div style={{ display: 'flex', marginTop: 24, fontSize: 64, color: '#121c21', fontWeight: 700, letterSpacing: -2, lineHeight: 1.1 }}>
          Software engineer focused on
        </div>
        <div style={{ display: 'flex', fontSize: 64, color: '#121c21', fontWeight: 700, letterSpacing: -2, lineHeight: 1.1 }}>
          backend and distributed systems.
        </div>
        <div style={{ display: 'flex', marginTop: 32, fontSize: 30, color: '#3f5760' }}>
          M.S. Computer Science, Northeastern &middot; Seeking SWE Internships, Summer 2027
        </div>
      </div>
    ),
    { ...size }
  );
}
