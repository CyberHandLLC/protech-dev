import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const alt = 'ProTech HVAC - Professional Heating and Cooling Services in Northeast Ohio';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
/**
 * OpenGraph image generator
 * Creates a dynamic social sharing image with your brand colors and logo
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: '#0B2B4C', // Navy blue
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          {/* Logo - Using a placeholder here as we can't use Next/Image in ImageResponse */}
          <div
            style={{
              fontSize: 70,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #FFFFFF 0%, #D9D9D9 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            ProTech HVAC
          </div>
        </div>
        
        <div
          style={{
            fontSize: 36,
            color: '#E5E5DB', // Ivory
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Professional Heating & Cooling Services in Northeast Ohio
        </div>
        
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            background: '#B22234', // Red
            padding: '12px 24px',
            borderRadius: 8,
            color: 'white',
            fontSize: 24,
          }}
        >
          Akron • Cleveland • Canton
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
