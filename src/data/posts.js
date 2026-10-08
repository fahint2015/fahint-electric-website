// Buyer guides reviewed against the linked primary references; existing article URLs are retained.
import { usbBuyingGuide } from './usbBuyingGuide.js';
import { dimmerBuyingGuide } from './dimmerBuyingGuide.js';
import { wallplateBuyingGuide } from './wallplateBuyingGuide.js';
import { lightSwitchBuyingGuide } from './lightSwitchBuyingGuide.js';
import { receptacleBuyingGuide } from './receptacleBuyingGuide.js';

export const posts = [
  receptacleBuyingGuide,
  lightSwitchBuyingGuide,
  wallplateBuyingGuide,
  dimmerBuyingGuide,
  usbBuyingGuide,
  {
    "slug": "gfci-vs-afci-whats-the-difference",
    "title": "GFCI vs AFCI: Two Different Kinds of Protection",
    "excerpt": "GFCI and AFCI protect against different hazards. Learn what each does and which details to check before ordering a FAHINT GFCI.",
    "date": "2026-08-12",
    "updated": "2026-08-31",
    "readMinutes": 3,
    "category": "Technical Guide",
    "cover": "assets/images/editorial-home/product-gfci-optimized.webp",
    "coverAlt": "FAHINT GFCI outlet in a kitchen application scene",
    "coverCaption": "GFCI protection in an illustrated kitchen setting. AFCI protection serves a different purpose.",
    "coverSource": "Existing FAHINT product application asset — editorial-home/product-gfci-optimized.webp",
    "sources": [
      {
        "label": "CPSC — AFCI fact sheet",
        "href": "https://www.cpsc.gov/s3fs-public/5133%281%29.pdf"
      },
      {
        "label": "ESFI — Home electrical safety",
        "href": "https://www.esfi.org/home-safety"
      },
      {
        "label": "FAHINT — Original certificate library",
        "href": "/about#certifications"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "When a project calls for GFCI and AFCI protection, check both functions in the specification. A device marked GFCI does not automatically provide AFCI protection, and vice versa."
      },
      {
        "type": "h2",
        "text": "What a GFCI does"
      },
      {
        "type": "p",
        "text": "A ground-fault circuit interrupter (GFCI) shuts off power when it detects a ground fault, helping protect people from electric shock. A conventional circuit breaker’s overload protection serves a different purpose.",
        "source": 1
      },
      {
        "type": "h2",
        "text": "What an AFCI does"
      },
      {
        "type": "p",
        "text": "An arc-fault circuit interrupter (AFCI) addresses the fire risk from dangerous electrical arcing. CPSC explains the distinction between this function and GFCI shock protection. Some devices include both; check the product’s designation to see which functions it provides.",
        "source": 0
      },
      {
        "type": "h2",
        "text": "What to put in the purchasing brief"
      },
      {
        "type": "p",
        "text": "A qualified electrical professional should determine which protection the circuit and location need under the locally adopted code. Do not make that decision from a product category name or work inside an electrical panel yourself."
      },
      {
        "type": "p",
        "text": "Once those requirements are clear, give the supplier the protection type, voltage, current rating, receptacle configuration and installation environment."
      },
      {
        "type": "h2",
        "text": "Compare the exact FAHINT model"
      },
      {
        "type": "p",
        "text": "FAHINT’s GFCI range includes different ratings and configurations. Read the model page and its original listing documents before ordering. Confirm indicator behavior, test instructions and available finishes for that model; these details can differ across the range."
      }
    ]
  },
  {
    "slug": "nec-406-8-weather-resistant-receptacles",
    "title": "Weather-Resistant Receptacles: The Device and the Cover",
    "excerpt": "A WR marking does not make an outlet waterproof. Check the receptacle, enclosure and cover against the location and locally adopted code.",
    "date": "2026-08-08",
    "updated": "2026-08-31",
    "readMinutes": 3,
    "category": "Compliance",
    "cover": "assets/images/products/gw15-application-scene-v1.jpg",
    "coverAlt": "FAHINT GFCI outlet in an illustrated sheltered garage setting",
    "coverCaption": "A sheltered garage application illustration. Outdoor locations require the appropriate device, enclosure and cover.",
    "coverSource": "Existing GW15 application asset — products/gw15-application-scene-v1.jpg",
    "sources": [
      {
        "label": "Leviton — 2023 NEC, receptacles in damp or wet locations",
        "href": "https://captaincode2023.leviton.com/node/338"
      },
      {
        "label": "FAHINT — Original certificate library",
        "href": "/about#certifications"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "A WR marking means weather-resistant; it does not mean waterproof. The receptacle still needs an enclosure and cover suitable for the location."
      },
      {
        "type": "h2",
        "text": "Will a plug stay inserted?"
      },
      {
        "type": "p",
        "text": "Cover requirements depend on the location and how the outlet will be used. Include whether protection is needed while a plug is inserted. Check the device rating separately from the enclosure and cover requirements."
      },
      {
        "type": "h2",
        "text": "Which code edition applies?"
      },
      {
        "type": "p",
        "text": "The 2023 NEC covers receptacles in damp or wet locations in Section 406.9. Older editions may number the requirement differently. Check the edition and amendments adopted for the site with the local authority having jurisdiction before finalizing the specification.",
        "source": 0
      },
      {
        "type": "h2",
        "text": "What to specify for a FAHINT order"
      },
      {
        "type": "p",
        "text": "List voltage, current and receptacle configuration, then identify GFCI protection, weather resistance and tamper resistance separately. A product with one of these features does not necessarily provide the others."
      },
      {
        "type": "p",
        "text": "Use the full model number, not just “outdoor outlet,” and request its instructions and certification coverage. Have a qualified installer select the box, cover and installation method for the site."
      }
    ]
  },
  {
    "slug": "why-gfci-outlets-trip",
    "title": "A GFCI Keeps Tripping: What to Record Before Asking for Help",
    "excerpt": "Note the model, indicator and conditions when a GFCI trips repeatedly or will not reset. Know what to send for support and when to call an electrician.",
    "date": "2026-08-04",
    "updated": "2026-08-31",
    "readMinutes": 3,
    "category": "Troubleshooting",
    "cover": "assets/images/products/gf15-feature-application-v3.jpg",
    "coverAlt": "FAHINT GFCI outlet with visible test and reset buttons in a bathroom illustration",
    "coverCaption": "Know the device and the conditions around it before asking for troubleshooting support. Application illustration.",
    "coverSource": "Existing GF15 application asset — products/gf15-feature-application-v3.jpg",
    "sources": [
      {
        "label": "ESFI — Home electrical safety",
        "href": "https://www.esfi.org/home-safety"
      },
      {
        "label": "FAHINT — Original certificate library",
        "href": "/about#certifications"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "Repeated trips, a failure to reset or an unfamiliar indicator need attention. Do not bypass the GFCI or keep resetting it to run equipment. Stop using damaged, wet, hot or scorched equipment and contact a qualified electrician."
      },
      {
        "type": "p",
        "text": "If there is smoke, sparking or an immediate fire risk, keep clear and contact emergency services."
      },
      {
        "type": "h2",
        "text": "Record what you can see safely"
      },
      {
        "type": "p",
        "text": "Photograph the model label only if it is visible and safe to read without removing the device. Describe what happens: does it trip, refuse to reset or show an indicator? Note when the problem began and whether it followed a new appliance, a weather event or electrical work."
      },
      {
        "type": "p",
        "text": "Indicator meanings vary by model and design. Use the exact device’s instructions; color alone cannot establish that a receptacle is safe, defective or at the end of its service life."
      },
      {
        "type": "h2",
        "text": "Leave the electrical checks to an electrician"
      },
      {
        "type": "p",
        "text": "Have a qualified electrician inspect the device, wiring, connected equipment and surroundings. Do not open the box, change conductors or take electrical measurements as part of this support check."
      },
      {
        "type": "h2",
        "text": "Keep the test instructions"
      },
      {
        "type": "p",
        "text": "ESFI recommends testing GFCIs monthly. Follow the procedure supplied with your device, even if it has automatic self-testing. If it does not behave as the instructions describe, arrange qualified help.",
        "source": 0
      },
      {
        "type": "h2",
        "text": "Sending the support request"
      },
      {
        "type": "p",
        "text": "Send the full model number and order reference, safely obtained photos, the observed indicator and a description of the conditions. FAHINT can help find the relevant product documents. A qualified electrical professional still needs to diagnose the installation."
      }
    ]
  },
  {
    "slug": "tamper-resistant-receptacle-requirements",
    "title": "Tamper-Resistant Receptacles: A Buyer’s Specification Checklist",
    "excerpt": "Specify tamper resistance alongside the electrical rating, GFCI protection and weather resistance. Check the local requirements before ordering.",
    "date": "2026-07-29",
    "updated": "2026-08-31",
    "readMinutes": 3,
    "category": "Compliance",
    "cover": "assets/images/products/gt15-application-scene-v1.jpg",
    "coverAlt": "Tamper-resistant FAHINT outlet in a living-room application illustration",
    "coverCaption": "Tamper-resistant device selection for living spaces. Application illustration; confirm the markings and requirements for the exact model.",
    "coverSource": "Existing GT15 application asset — products/gt15-application-scene-v1.jpg",
    "sources": [
      {
        "label": "Eaton — 2023 NEC, tamper-resistant receptacles",
        "href": "https://www.eaton.com/us/en-us/products/residential/nec-2023-updates/receptacles-tamper-resistant.html"
      },
      {
        "label": "FAHINT — Original certificate library",
        "href": "/about#certifications"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "Tamper resistance, weather resistance and ground-fault protection are separate features. A tamper-resistant receptacle may still need other functions to meet your project specification."
      },
      {
        "type": "h2",
        "text": "Where is tamper resistance required?"
      },
      {
        "type": "p",
        "text": "Section 406.12 of the 2023 NEC covers specified residential and other occupancies. It includes 125V and 250V nonlocking receptacles at the ratings named in that section. The scope is broader than children’s rooms.",
        "source": 0
      },
      {
        "type": "p",
        "text": "The edition adopted locally, its amendments and any applicable exceptions determine the requirements for the project. Ask a qualified electrical professional or the authority having jurisdiction to confirm them."
      },
      {
        "type": "h2",
        "text": "Make each required feature explicit"
      },
      {
        "type": "p",
        "text": "Write down the voltage, current rating and NEMA configuration, followed by the required tamper resistance, weather resistance and GFCI protection. Match the selected model to the whole list. Similar-looking receptacles can have different ratings or functions."
      },
      {
        "type": "h2",
        "text": "Check the supplied model and finish"
      },
      {
        "type": "p",
        "text": "Compare the full model number, device markings and documents with the purchase order. A description covering an entire product family may not describe every variant’s construction."
      },
      {
        "type": "p",
        "text": "Include the finish and wallplate in the order specification. Review the appearance and fit using samples, then retain the approved model and finish details for reorders."
      }
    ]
  },
  {
    "slug": "how-to-source-ul-listed-gfci-from-china",
    "title": "Sourcing GFCI Outlets: A Model-by-Model Review",
    "excerpt": "Match the GFCI model on your quote with its certification record and approved sample. Check the configuration, packaging and order terms.",
    "date": "2026-07-22",
    "updated": "2026-08-31",
    "readMinutes": 4,
    "category": "Sourcing",
    "cover": "assets/images/editorial-home/factory-optimized.webp",
    "coverAlt": "GFCI functional test stations on the FAHINT production floor",
    "coverCaption": "GFCI functional testing at FAHINT in Wenzhou, China.",
    "coverSource": "Archived FAHINT company page — template/default/public/common/images/10.jpg",
    "sources": [
      {
        "label": "UL Solutions — Product iQ certification database",
        "href": "https://www.ul.com/software/product-sourcing-and-certifications-database"
      },
      {
        "label": "FAHINT — Original certificate library",
        "href": "/about#certifications"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "Keep the quoted GFCI model, certification documents and approved sample together through the order review. A certificate image or factory photograph alone is not enough to approve the purchase."
      },
      {
        "type": "h2",
        "text": "Find the certification record"
      },
      {
        "type": "p",
        "text": "Search UL Solutions’ Product iQ using the file number and model designation. Compare the record with the supplier, the device and its intended application. A UL logo in a presentation is not enough for that check.",
        "source": 0
      },
      {
        "type": "p",
        "text": "FAHINT’s document library holds original product-family certificates. File E504391 relates to the listed GFCI models, not every product in the FAHINT range. Read the addendum and confirm current coverage for your model before ordering."
      },
      {
        "type": "h2",
        "text": "Does the sample match the quotation?"
      },
      {
        "type": "p",
        "text": "Compare the model number, rating, required features, finish and included wallplate across the quotation, published specification, sample and order. Resolve any differences with the supplier before approval."
      },
      {
        "type": "p",
        "text": "Check the sample’s appearance alongside its packaging, required identification and authorized brand artwork. Leave electrical performance evaluation to qualified personnel using the appropriate procedures and equipment."
      },
      {
        "type": "h2",
        "text": "Ask about checks for that model"
      },
      {
        "type": "p",
        "text": "Ask which assembly and inspection steps apply to your selected model and what supporting records are available. Discuss any extra project verification with qualified personnel. Factory size and general quality claims cannot answer those model-specific questions."
      },
      {
        "type": "h2",
        "text": "Put the commercial terms in the quotation"
      },
      {
        "type": "p",
        "text": "Agree on order quantities, sample arrangements, production timing, delivery terms and warranty terms for the actual model and order. Availability and lead times can vary between configurations, so a statement about one model should not be applied to the whole range."
      }
    ]
  },
  {
    "slug": "gfci-colour-finishes-specification",
    "title": "Coordinating Device Finishes Across a Project",
    "excerpt": "Check device and wallplate finishes together under project lighting, then keep the approved model and sample details with the order.",
    "date": "2026-07-15",
    "updated": "2026-08-31",
    "readMinutes": 3,
    "category": "Specification",
    "cover": "assets/images/company/exhibition-source.webp",
    "coverWidth": 1200,
    "coverHeight": 1500,
    "coverRegion": { "left": 319, "top": 947, "width": 557, "height": 271 },
    "coverAlt": "GFCI devices in different colors on the FAHINT exhibition display",
    "coverCaption": "Products on the FAHINT exhibition display. Confirm each color and wall-plate combination against the selected model and sample.",
    "coverSource": "Original company promotional material — 公司资料&产品/详情页/详情页_15.png, product display photograph",
    "sources": [
      {
        "label": "FAHINT — GF15 model and finish options",
        "href": "/products/gfci/gf15"
      },
      {
        "label": "FAHINT — Wall plate collection",
        "href": "/products/wallplates"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "Choose the device finish and wallplate together if you want the same appearance across a project. Keep that combination in the specification so it can be repeated throughout the order."
      },
      {
        "type": "h2",
        "text": "Choose the electrical model before the color"
      },
      {
        "type": "p",
        "text": "Start with the rating, configuration and functions the project needs. Do not substitute a different electrical specification just to get a preferred finish."
      },
      {
        "type": "p",
        "text": "Then check the finishes offered for each model. A color shown for one GFCI does not establish what is available for a smart switch or metal wallplate; palettes and surface finishes vary across the range."
      },
      {
        "type": "h2",
        "text": "Compare samples under project lighting"
      },
      {
        "type": "p",
        "text": "Place the device and plate together under the lighting planned for the project. Screen images can help you narrow the choice, but they cannot guarantee a physical color match. Use actual samples to approve a finish that matters to the specification."
      },
      {
        "type": "h2",
        "text": "Keep a record of the approved combination"
      },
      {
        "type": "p",
        "text": "Record the model, finish name, plate style and approved sample reference on the order. For a multi-gang installation, also confirm the opening arrangement and dimensions."
      },
      {
        "type": "p",
        "text": "For private-label work, discuss proposed finishes, authorized branding and packaging with FAHINT before making a commitment to your customer. We need to confirm feasibility, quantities and lead times for the selected product and finish."
      }
    ]
  }
];

export function findPost(slug) { return posts.find(post => post.slug === slug); }
export const postCategories = ['All', ...new Set(posts.map(post => post.category))];
