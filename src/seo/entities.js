import { company } from '../data/company.js';
import { certificates } from '../data/certificates.js';
import { socialProfiles } from '../data/socialProfiles.js';

// Owner-confirmed street address and shared social identity data changed on this date.
// This is a recorded content change, not a build-time freshness default.
export const organizationUpdated = '2026-10-26';

export function organizationEntity(base) {
  return {
    '@type': 'Organization', '@id': `${base}#organization`, name: company.brand, legalName: company.name,
    url: base, logo: new URL('assets/images/brand/fahint-logo-navy.png', base).href,
    email: company.email, telephone: company.phone.replace(/\s/g, ''), foundingDate: String(company.since),
    address: { '@type': 'PostalAddress', ...company.postalAddress },
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: company.phone.replace(/\s/g, ''), email: company.email, url: new URL('contact/', base).href },
    sameAs: socialProfiles.filter(profile => profile.identity !== false).map(profile => profile.href),
    hasCertification: { '@id': certificateId(certificates.find(c => c.slug === 'iso-9001'), base) },
  };
}

export const certificateId = (certificate, base) => new URL(`resources/#${certificate.slug}`, base).href;

export function certificateEntity(certificate, base) {
  const quality = certificate.slug === 'iso-9001';
  return {
    '@type': 'Certification', '@id': certificateId(certificate, base), name: certificate.name,
    ...(certificate.report ? { identifier: certificate.report, certificationIdentification: certificate.file } : {}),
    ...(certificate.certificationNumber ? { identifier: certificate.certificationNumber, certificationIdentification: certificate.certificationNumber } : {}),
    url: new URL(certificate.document, base).href,
    description: `${certificate.detail}. ${certificate.scope} Supplied reference document; confirm current status and exact coverage with the issuing body before ordering.`,
    datePublished: new Date(`${certificate.issued} 00:00:00 GMT`).toISOString().slice(0, 10),
    ...(certificate.expires ? { expires: certificate.expires } : {}),
    issuedBy: { '@type': 'Organization', name: quality ? certificate.issuer : 'UL' },
  };
}

export function supportingEntities(meta, base) {
  const selected = meta.path === '/resources' || meta.label === 'Resources'
    ? certificates : [certificates.find(c => c.slug === 'iso-9001'), meta.certificate].filter(Boolean);
  return selected.map(c => certificateEntity(c, base));
}
