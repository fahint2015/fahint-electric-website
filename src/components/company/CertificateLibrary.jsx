import { Download, ArrowUpRight, ChevronDown } from 'lucide-react';
import { certificates } from '../../data/certificates.js';
import { publicAsset } from '../../utils/publicAsset.js';
import { CompanyImage, CompanyLink } from './CompanyShared.jsx';

export default function CertificateLibrary() {
  return <section className="company-section company-section--paper" id="certifications" aria-labelledby="certificate-library-title">
    <div className="company-wrap">
      <div className="company-heading"><h2 id="certificate-library-title">Original documents.<br /><span>Model-specific coverage.</span></h2><p>Use the original certificate and its addendum to check the model you are specifying. The files below are supplied reference documents, not a live certification-status check.</p></div>
      <div className="company-certificates">{certificates.map(certificate => <article className="company-certificate" key={certificate.slug}>
        <a href={publicAsset(certificate.document)} target="_blank" rel="noreferrer" aria-label={`Open ${certificate.name} PDF`} className="company-certificate__scan"><CompanyImage src={certificate.image} alt={`${certificate.name} certificate scan`} width={900} height={certificate.slug === 'iso-9001' ? 1214 : 1165} /><span>Open original PDF <ArrowUpRight size={16} aria-hidden="true" /></span></a>
        <div className="company-certificate__body"><h3>{certificate.name}</h3><p className="company-certificate__file">{certificate.file}</p><p>{certificate.detail}</p>
          <details><summary>Models & document details <ChevronDown size={16} aria-hidden="true" /></summary><p>{certificate.scope}</p><p>Document issued: {certificate.issued}</p></details>
          <a className="company-text-link" href={publicAsset(certificate.document)} download aria-label={`Download ${certificate.name} PDF`}><Download size={16} aria-hidden="true" />Download PDF</a>
        </div>
      </article>)}</div>
      <p className="company-library-note">Confirm current status, model designations and any conditions with the issuing body and our team before ordering. ISO 9001 relates to the quality management system, not a product listing.</p>
      <CompanyLink to="/resources" secondary>Browse all resources</CompanyLink>
    </div>
  </section>;
}
