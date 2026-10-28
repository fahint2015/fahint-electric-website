// Buyer guides reviewed against the linked primary references; existing article URLs are retained.
import { usbBuyingGuide } from './usbBuyingGuide.js';
import { dimmerBuyingGuide } from './dimmerBuyingGuide.js';
import { wallplateBuyingGuide } from './wallplateBuyingGuide.js';
import { lightSwitchBuyingGuide } from './lightSwitchBuyingGuide.js';
import { receptacleBuyingGuide } from './receptacleBuyingGuide.js';
import { roomOutletPlanningGuide } from './roomOutletPlanningGuide.js';
import { smartSwitchBuyingGuide } from './smartSwitchBuyingGuide.js';
import { productQuestionGuides } from './productQuestionGuides.js';

export const posts = [
  ...productQuestionGuides,
  roomOutletPlanningGuide,
  smartSwitchBuyingGuide,
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
    "updated": "2026-10-28",
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
        "href": "/resources#certifications"
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
        "text": "Compare GF15 and GF20 for standard-face 15A and 20A GFCI outlets. Read the exact model’s specifications and listing documents, then confirm indicator behavior, test instructions and finishes. GFCI identification does not establish AFCI protection.",
        "links": [
          { "label": "GF15 · 15A self-test GFCI outlet", "href": "/products/gfci/gf15" },
          { "label": "GF20 · 20A self-test GFCI outlet", "href": "/products/gfci/gf20" }
        ]
      }
    ]
  },
  {
    "slug": "nec-406-8-weather-resistant-receptacles",
    "title": "Weather-Resistant Receptacles: The Device and the Cover",
    "excerpt": "A WR marking does not make an outlet waterproof. Check the receptacle, enclosure and cover against the location and locally adopted code.",
    "date": "2026-08-08",
    "updated": "2026-10-28",
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
        "href": "/resources#certifications"
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
        "text": "Use the full model number, not just “outdoor outlet,” and request its instructions and certification coverage. Have a qualified installer select the box, cover and installation method for the site.",
        "links": [
          { "label": "GW15 · 15A weather-resistant GFCI", "href": "/products/gfci/gw15" },
          { "label": "GW20 · 20A weather-resistant GFCI", "href": "/products/gfci/gw20" }
        ]
      }
    ]
  },
  {
    "slug": "why-gfci-outlets-trip",
    "title": "A GFCI Keeps Tripping: What to Record Before Asking for Help",
    "excerpt": "Note the model, indicator and conditions when a GFCI trips repeatedly or will not reset. Know what to send for support and when to call an electrician.",
    "date": "2026-08-04",
    "updated": "2026-10-28",
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
        "href": "/resources#certifications"
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
        "text": "Send the full model number and order reference, safely obtained photos, the observed indicator and a description of the conditions. FAHINT can help find the relevant product documents. A qualified electrical professional still needs to diagnose the installation.",
        "links": [
          { "label": "Find your GFCI model", "href": "/products/gfci" },
          { "label": "Request GFCI technical documents", "href": "/contact?topic=technical&family=gfci" }
        ]
      }
    ]
  },
  {
    "slug": "tamper-resistant-receptacle-requirements",
    "title": "Tamper-Resistant Receptacles: A Buyer’s Specification Checklist",
    "excerpt": "Specify tamper resistance alongside the electrical rating, GFCI protection and weather resistance. Check the local requirements before ordering.",
    "date": "2026-07-29",
    "updated": "2026-10-28",
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
        "href": "/resources#certifications"
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
        "text": "Compare the full model number, device markings and documents with the purchase order. GT20 combines tamper resistance with GFCI protection; RT20 is a tamper-resistant duplex receptacle without an integral GFCI function.",
        "links": [
          { "label": "GT20 · 20A tamper-resistant GFCI outlet", "href": "/products/gfci/gt20" },
          { "label": "RT20 · tamper-resistant duplex receptacle", "href": "/products/receptacles/rt20" }
        ]
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
    "excerpt": "Choose a GFCI outlet manufacturer with a model-specific checklist. Compare 15A/20A, TR/WR, certification documents and OEM details for your bulk order.",
    "date": "2026-07-22",
    "updated": "2026-10-17",
    "readMinutes": 5,
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
        "href": "/resources#certifications"
      },
      {
        "label": "FAHINT — GFCI outlet models and specifications",
        "href": "/products/gfci"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "When choosing a GFCI outlet manufacturer for a private-label range or bulk order, start with the configurations your buyers need. Keep the quoted model, certification documents and approved sample together through the order review. A certificate image or factory photograph alone is not enough to approve the purchase."
      },
      {
        "type": "h2",
        "text": "Build a 15A and 20A GFCI model shortlist"
      },
      {
        "type": "p",
        "text": "Separate the receptacle rating from the required protection features. FAHINT's standard, tamper-resistant and tamper- plus weather-resistant receptacles have distinct model numbers. Use the following pairs to start a shortlist, then review the full specifications for your intended market and application."
      },
      {
        "type": "table",
        "caption": "FAHINT GFCI receptacle sourcing shortlist",
        "columns": ["Configuration", "15A model", "20A model"],
        "rows": [
          ["Standard", { "label": "GF15", "href": "/products/gfci/gf15" }, { "label": "GF20", "href": "/products/gfci/gf20" }],
          ["Tamper-resistant (TR)", { "label": "GT15", "href": "/products/gfci/gt15" }, { "label": "GT20", "href": "/products/gfci/gt20" }],
          ["Tamper- and weather-resistant (TR/WR)", { "label": "GW15", "href": "/products/gfci/gw15" }, { "label": "GW20", "href": "/products/gfci/gw20" }]
        ]
      },
      {
        "type": "p",
        "text": "GL20 is a blank-face device without plug-in receptacle openings, and its certification documentation remains under review. Industrial GTN models have a different construction and no feed-through terminals. Review those configurations separately from the receptacle pairs above.",
        "links": [
          { "label": "Compare the complete GFCI outlet range", "href": "/products/gfci" }
        ]
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
        "text": "FAHINT's library includes the August 16, 2022 addendum to E504391-20210212. It names GF15, GF20, GT15, GT20, GW15 and GW20, with GTN15 and GTN20 identified as tamper-resistant models with no feed-through. GL20 is not part of this documented shortlist. Use the original file as a reference and confirm current listing status for the ordered configuration.",
        "links": [
          { "label": "Review GFCI product-family documents", "href": "/resources?family=gfci" }
        ]
      },
      {
        "type": "h2",
        "text": "Review OEM packaging and sample approval"
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
        "type": "list",
        "label": "GFCI OEM sample approval checklist",
        "items": [
          "Match the full model designation and electrical ratings across the quotation, device and product documents.",
          "Check the ordered finish and wallplate together against the approved sample.",
          "Review authorized brand artwork, required identification, instructions and retail or neutral packaging.",
          "Record the approved sample and artwork revision so production and inspection use the same reference."
        ]
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
      },
      {
        "type": "h2",
        "text": "What to include in a bulk GFCI outlet inquiry"
      },
      {
        "type": "list",
        "label": "Bulk GFCI outlet inquiry checklist",
        "items": [
          "Full model numbers, receptacle ratings and required TR or WR features.",
          "Quantities split by model, device finish, wallplate and pack format.",
          "Destination market, intended application and required model documents.",
          "Authorized brand artwork and any labeling or instruction requirements.",
          "Sample quantities, agreed inspection requirements and requested delivery timing."
        ]
      },
      {
        "type": "p",
        "text": "Send the shortlist even if some details are undecided, and identify the questions to resolve. FAHINT reviews the selected models, packaging and document requirements before confirming sample arrangements, minimum quantities and lead times in the quotation.",
        "links": [
          { "label": "Explore OEM manufacturing and packaging", "href": "/capabilities#oem" },
          { "label": "Send your GFCI sourcing brief", "href": "/contact?topic=oem" }
        ]
      }
    ]
  },
  {
    "slug": "gfci-colour-finishes-specification",
    "title": "Coordinating Device Finishes Across a Project",
    "excerpt": "Check device and wallplate finishes together under project lighting, then keep the approved model and sample details with the order.",
    "date": "2026-07-15",
    "updated": "2026-10-28",
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
        "text": "Place the device and plate together under the lighting planned for the project. Screen images can help you narrow the choice, but they cannot guarantee a physical color match. Use actual samples to approve a finish that matters to the specification.",
        "links": [
          { "label": "BS1803-G · glossy screwless wall plate", "href": "/products/wallplates/bs1803-g" },
          { "label": "BS1803-M · matte screwless wall plate", "href": "/products/wallplates/bs1803-m" }
        ]
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
