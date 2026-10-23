import { CompanyImage } from './CompanyShared.jsx';

// Frame an existing photograph without redrawing products or people. A region
// selects a photograph inside an original company contact sheet, in source pixels.
export default function EditorialPhoto({ src, alt, region, width = 1536, height = 1024, ratio = 1.5, position = 'center', fit = 'cover', priority = false }) {
  const scale = region ? Math.max(1 / region.width, 1 / (ratio * region.height)) : 0;
  const style = region ? {
    width: `${width * scale * 100}%`,
    left: `${50 - (region.left + region.width / 2) * scale * 100}%`,
    top: `${50 - (region.top + region.height / 2) * scale * ratio * 100}%`,
  } : { objectPosition: position, objectFit: fit };
  return <div className={`editorial-photo${region ? ' editorial-photo--region' : ''}`} style={{ aspectRatio: ratio, backgroundColor: fit === 'contain' ? '#fff' : undefined }}>
    <CompanyImage className="editorial-photo__image" src={src} alt={alt} width={width} height={height} priority={priority} style={style} />
  </div>;
}
