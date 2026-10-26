import { company } from '../src/data/company.js';
import { productLines } from '../src/data/lines.js';
import { buyingGuides } from '../src/data/buyingGuides.js';
import { certificates } from '../src/data/certificates.js';
import { organizationEntity, certificateEntity } from '../src/seo/entities.js';
import { validateSiteUrl } from '../src/seo/metadata.js';

// Optional reading aids, generated from the same public facts and FAQ as the site.
// They do not replace HTML, JSON-LD, robots.txt or sitemap.xml.
export function publicReferenceFiles(base = 'https://fahint.com/') {
  const site = validateSiteUrl(base);
  const url = path => new URL(path.replace(/^\//, ''), site).href;
  const families = productLines.map(line => ({name: line.name, url: url(`products/${line.slug}/`), description: buyingGuides[line.slug].intro}));
  const summary = {
    organization: organizationEntity(site),
    addressText: company.address,
    productFamilies: families,
    certifications: certificates.map(c => certificateEntity(c, site)),
    sources: [url('about/'), url('contact/'), url('resources/')],
    certificationScope: 'The ISO certificate concerns the company quality system. Product-family UL documents must be checked against the exact model; coverage is not implied for every product.'
  };
  const faq = productLines.flatMap(line => buyingGuides[line.slug].questions.map(({q,a}) => ({family: line.name, question: q, answer: a, source: url(`products/${line.slug}/#buying-guide`)})));
  const llms = `# FAHINT\n\n> FAHINT is a wiring device brand and manufacturer in Wenzhou, China, established in 2015. Products include GFCI and USB outlets, receptacles, dimmers, switches and wallplates, with OEM / ODM support.\n\n${company.address}. Contact: ${company.email}.\n\nCertification and electrical ratings are model-specific. Refer to original documents and confirm the exact ordered configuration.\n\n## Company and documentation\n\n- [About FAHINT](${url('about/')}): Company and manufacturing background\n- [Product catalogue and certificates](${url('resources/')}): Original reference documents and coverage\n- [Contact FAHINT](${url('contact/')}): Address and product, OEM or technical inquiries\n\n## Product families\n\n${families.map(line=>`- [${line.name}](${line.url}): ${line.description}`).join('\n')}\n\n## Optional\n\n- [Public company and product summary](${url('ai/summary.json')}): Same facts as the visible website\n- [Product selection questions](${url('ai/faq.json')}): Existing buying-guide answers with source URLs\n- [Guides and insights](${url('blog/')}): Detailed selection and sourcing articles\n`;
  return {'llms.txt': llms, 'ai/summary.json': JSON.stringify(summary,null,2)+'\n', 'ai/faq.json': JSON.stringify({questions: faq},null,2)+'\n'};
}
