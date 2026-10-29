// Buyer guides reviewed against the linked primary references; existing article URLs are retained.
import { usbBuyingGuide } from './usbBuyingGuide.js';
import { dimmerBuyingGuide } from './dimmerBuyingGuide.js';
import { wallplateBuyingGuide } from './wallplateBuyingGuide.js';
import { lightSwitchBuyingGuide } from './lightSwitchBuyingGuide.js';
import { receptacleBuyingGuide } from './receptacleBuyingGuide.js';
import { roomOutletPlanningGuide } from './roomOutletPlanningGuide.js';
import { smartSwitchBuyingGuide } from './smartSwitchBuyingGuide.js';
import { productQuestionGuides } from './productQuestionGuides.js';
import { gfciOutletGuide } from './gfciOutletGuide.js';

export const posts = [
  gfciOutletGuide,
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
    "excerpt": "Compare GFCI shock protection with AFCI arc-fault protection, and see where FAHINT GF15 and GF20 fit in a project specification.",
    "date": "2026-08-12",
    "updated": "2026-10-29",
    "readMinutes": 2,
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
        "label": "ESFI — Ground Fault Circuit Interrupters",
        "href": "https://www.esfi.org/ground-fault-circuit-interrupters-gfci/"
      },
      {
        "label": "FAHINT — Original certificate library",
        "href": "/resources#certifications"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "GFCI protection addresses electric shock from ground faults. AFCI protection addresses fire hazards caused by dangerous electrical arcing. A project can need both functions; the device documentation should identify each one.",
        "source": 0
      },
      {
        "type": "table",
        "caption": "GFCI and AFCI at a glance",
        "columns": [
          "Protection",
          "Hazard addressed",
          "What to specify"
        ],
        "rows": [
          [
            "GFCI",
            "Ground-fault current that can cause electric shock",
            "Ground-fault protection for the required circuit or location"
          ],
          [
            "AFCI",
            "Hazardous electrical arcing that can cause a fire",
            "Arc-fault protection for the required circuit"
          ],
          [
            "Both",
            "Both of the hazards above",
            "Documentation identifying both protection functions"
          ]
        ]
      },
      {
        "type": "h2",
        "text": "Where GF15 and GF20 fit"
      },
      {
        "type": "p",
        "text": "FAHINT GF15 and GF20 are self-test GFCI receptacles rated 15A and 20A respectively. They belong on a GFCI shortlist. Their GFCI designation does not establish AFCI protection.",
        "links": [
          {
            "label": "GF15 · 15A self-test GFCI outlet",
            "href": "/products/gfci/gf15"
          },
          {
            "label": "GF20 · 20A self-test GFCI outlet",
            "href": "/products/gfci/gf20"
          }
        ]
      },
      {
        "type": "p",
        "text": "A GFCI monitors the current path and interrupts power when it detects a ground fault. Its purpose differs from the overload protection of a conventional circuit breaker.",
        "source": 1
      },
      {
        "type": "h2",
        "text": "Put both requirements in the brief"
      },
      {
        "type": "p",
        "text": "Have the project’s electrical professional identify the protection required under the locally adopted code. For a circuit needing both functions, keep both in the specification through product selection and approval. The circuit arrangement and panel compatibility also need professional review."
      },
      {
        "type": "list",
        "label": "Protection specification for the supplier",
        "items": [
          "Required protection: GFCI, AFCI or both.",
          "Voltage, current rating and receptacle configuration.",
          "Installation environment and any TR or WR requirement.",
          "Exact model, listing documents and supplied instructions."
        ]
      },
      {
        "type": "p",
        "text": "For a FAHINT GFCI order, include the full model and required features when requesting documents. This keeps a change of current rating or face style from becoming an unintended change of protection."
      },
      {
        "type": "h2",
        "text": "Which device sits on which circuit"
      },
      {
        "type": "p",
        "text": "In a typical North American installation the two functions live in different places. Ground-fault protection is usually a receptacle at the point of use — GF15 or GF20 here — while arc-fault protection is usually a breaker at the panel. That arrangement is common because it is convenient, not because one device implies the other."
      },
      {
        "type": "p",
        "text": "Dual-function breakers exist and are specified in some jurisdictions, and combination devices that carry both functions in one package are also on the market. Where a drawing calls for both protections at the point of use, the device has to be marked for both functions; a GFCI-only receptacle cannot supply arc-fault protection, and which product closes that gap depends on the specification rather than on a single default answer."
      },
      {
        "type": "p",
        "text": "Purchase orders lose this distinction more often than drawings do. A line reading \"GFCI outlet, 20A, both protections\" is a line that has to be queried before it can be quoted, because the second half belongs to a different product family."
      },
      {
        "type": "p",
        "text": "The clean way to buy protection through a receptacle supplier is to state the function the device must perform and let the installer decide where it belongs. Where the answer is \"GFCI at the point of use\", the model list is short and the specification is unambiguous."
      }
    ]
  },
  {
    "slug": "nec-406-8-weather-resistant-receptacles",
    "title": "Weather-Resistant Receptacles: The Device and the Cover",
    "excerpt": "Specify a weather-resistant outlet together with its enclosure and cover. Compare GW15 and GW20, and record how the outdoor outlet will be used.",
    "date": "2026-08-08",
    "updated": "2026-10-29",
    "readMinutes": 2,
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
        "text": "An outdoor outlet specification has two parts: the receptacle and the box-and-cover assembly. A WR marking identifies a weather-resistant receptacle. The enclosure and cover provide the protection needed around the device and plug."
      },
      {
        "type": "h2",
        "text": "Plan for the outlet while it is in use"
      },
      {
        "type": "p",
        "text": "Tell the installer whether a plug will remain inserted and describe the exposure to rain or other moisture. That information affects the cover selection. Include enough space for the intended plug and cord, with the cover operating as designed."
      },
      {
        "type": "p",
        "text": "Section 406.9 of the 2023 NEC covers receptacles in damp or wet locations. It addresses both the receptacle and its enclosure. The locally adopted edition, amendments and site conditions determine the final requirements.",
        "source": 0
      },
      {
        "type": "h2",
        "text": "Specify the complete combination"
      },
      {
        "type": "p",
        "text": "GW15 and GW20 are FAHINT’s tamper- and weather-resistant GFCI models, rated 15A and 20A respectively. Use the full model designation when requesting the product documents.",
        "links": [
          {
            "label": "GW15 · 15A weather-resistant GFCI",
            "href": "/products/gfci/gw15"
          },
          {
            "label": "GW20 · 20A weather-resistant GFCI",
            "href": "/products/gfci/gw20"
          }
        ]
      },
      {
        "type": "list",
        "label": "Outdoor outlet order details",
        "items": [
          "Receptacle: model, voltage, current rating and plug configuration.",
          "Required functions: GFCI protection, tamper resistance and weather resistance.",
          "Enclosure and cover: suitability for the location and intended use with a plug inserted.",
          "Approval documents: model instructions, certification coverage and the installer’s selected box-and-cover combination."
        ]
      },
      {
        "type": "p",
        "text": "“Weather-resistant GFCI” describes the device. It does not make a bare outlet waterproof or establish that a wallplate is a weatherproof cover. Have a qualified installer select and install the complete assembly for the site."
      },
      {
        "type": "h2",
        "text": "The cover is half of the specification"
      },
      {
        "type": "p",
        "text": "A WR marking on a receptacle describes the device. The requirement in a wet location usually concerns the assembly: the device, the box and a cover rated for use with a plug inserted. A weather-resistant GFCI behind a standard plate in an exposed location is still an exposed connection, whatever the receptacle is marked."
      },
      {
        "type": "p",
        "text": "That means the cover is a separate purchase and frequently a separate supplier. We quote GW15 and GW20 with the WR marking and the matching plate; the while-in-use cover comes from a manufacturer whose listing covers it. Two documents, two responsibilities, one installation."
      },
      {
        "type": "p",
        "text": "For a sample review this matters. Approving the receptacle alone tells you nothing about whether the cover will close over a plugged cord, and that is the detail inspectors look at. Ask for the cover model beside the device model and check them as a pair on the bench."
      },
      {
        "type": "p",
        "text": "An order line that reads \"outdoor GFCI, 20A\" leaves the cover, the plate and the enclosure to whoever is packing. Written as the device, the plate and the cover model, with the intended use stated, it can be checked before production instead of after installation."
      }
    ]
  },
  {
    "slug": "why-gfci-outlets-trip",
    "title": "A GFCI Keeps Tripping: What to Record Before Asking for Help",
    "excerpt": "Record when a GFCI trips, its indicator and the equipment in use. Learn what to send for support and which symptoms need qualified attention.",
    "date": "2026-08-04",
    "updated": "2026-10-29",
    "readMinutes": 2,
    "category": "Troubleshooting",
    "cover": "assets/images/products/gf15-feature-application-v3.jpg",
    "coverAlt": "FAHINT GFCI outlet with visible test and reset buttons in a bathroom illustration",
    "coverCaption": "Know the device and the conditions around it before asking for troubleshooting support. Application illustration.",
    "coverSource": "Existing GF15 application asset — products/gf15-feature-application-v3.jpg",
    "sources": [
      {
        "label": "ESFI — Ground Fault Circuit Interrupters",
        "href": "https://www.esfi.org/ground-fault-circuit-interrupters-gfci/"
      },
      {
        "label": "FAHINT — Original certificate library",
        "href": "/resources#certifications"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "A GFCI trips when it detects a ground fault: current is taking an unintended path. Repeated trips can involve connected equipment, moisture or the installation. The symptom alone does not identify which part needs attention.",
        "source": 0
      },
      {
        "type": "h2",
        "text": "Start with a short observation record"
      },
      {
        "type": "list",
        "label": "Details that help a support request",
        "items": [
          "What happens: the device trips, refuses to reset or shows an unfamiliar indicator.",
          "When it happens: during use of particular equipment, after rain or after recent electrical work.",
          "What you can identify safely: model, order reference and any visible markings.",
          "Photos of the indicator and surrounding area, taken without opening the device or electrical box."
        ]
      },
      {
        "type": "p",
        "text": "Write down the indicator color and whether it is steady or flashing. Its meaning comes from that model’s instructions. A color used on one GFCI may mean something different on another."
      },
      {
        "type": "h2",
        "text": "When to stop using the outlet"
      },
      {
        "type": "p",
        "text": "Do not bypass the GFCI or keep resetting it to run equipment. Stop using equipment that is wet, damaged, unusually hot or scorched, and arrange a qualified electrician’s inspection. Smoke, sparking or an immediate fire risk calls for keeping clear and contacting emergency services."
      },
      {
        "type": "p",
        "text": "The electrician can inspect the wiring, protective device and connected equipment. Opening the box or taking electrical measurements is outside this observation checklist."
      },
      {
        "type": "h2",
        "text": "Testing and document support"
      },
      {
        "type": "p",
        "text": "ESFI recommends testing GFCIs monthly. Follow the procedure supplied with your exact model, including any instructions for a self-test device. A failed test needs qualified attention.",
        "source": 0
      },
      {
        "type": "p",
        "text": "Send the observation record and order reference when contacting FAHINT. We can help identify the relevant model documents; an electrician will need to diagnose the installation.",
        "links": [
          {
            "label": "Find your GFCI model",
            "href": "/products/gfci"
          },
          {
            "label": "Request GFCI technical documents",
            "href": "/contact?topic=technical&family=gfci"
          }
        ]
      },
      {
        "type": "h2",
        "text": "What a model number can and cannot settle"
      },
      {
        "type": "p",
        "text": "Give us the full model and we can confirm what the device is meant to do: 15 A or 20 A, standard or tamper-resistant, whether it has feed-through terminals, which document names it. That is a specification question and it has a definite answer."
      },
      {
        "type": "p",
        "text": "Whether the device in front of you is behaving correctly is a different question, and it depends on the wiring behind it. A GFCI that trips on an empty circuit is reporting a fault somewhere downstream, and no document from a manufacturer can locate it. The recording exercise in this guide is what turns that into something an electrician can act on in one visit."
      },
      {
        "type": "p",
        "text": "Two details are worth writing down while you are at the wall: whether the device is a self-test model, and what the indicator does before and after a reset attempt. The first tells the electrician whether the unit monitors itself, which changes how a failure is interpreted. The second is often the fastest way to separate a device at the end of its life from a circuit with a real fault."
      }
    ]
  },
  {
    "slug": "tamper-resistant-receptacle-requirements",
    "title": "Tamper-Resistant Receptacles: A Buyer’s Specification Checklist",
    "excerpt": "Compare TR with GFCI protection through FAHINT GT20 and RT20, then check the project’s code requirement, model documents and finish.",
    "date": "2026-07-29",
    "updated": "2026-10-29",
    "readMinutes": 2,
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
      },
      {
        "label": "ESFI — Tamper Resistant Receptacles",
        "href": "https://www.esfi.org/program/tamper-resistant-receptacles-trrs/"
      }
    ],
    "body": [
      {
        "type": "p",
        "text": "Tamper-resistant (TR) receptacles use shutters to restrict access to the contacts. TR belongs in the specification alongside the electrical rating and any other required protection. It is a separate feature from weather resistance and GFCI protection.",
        "source": 2
      },
      {
        "type": "h2",
        "text": "GT20 or RT20?"
      },
      {
        "type": "p",
        "text": "These two FAHINT models show why the complete designation matters. GT20 combines tamper resistance with GFCI protection. RT20 is a tamper-resistant duplex receptacle without an integral GFCI function.",
        "links": [
          {
            "label": "GT20 · 20A tamper-resistant GFCI outlet",
            "href": "/products/gfci/gt20"
          },
          {
            "label": "RT20 · tamper-resistant duplex receptacle",
            "href": "/products/receptacles/rt20"
          }
        ]
      },
      {
        "type": "p",
        "text": "If the project calls for a TR receptacle with integral GFCI protection, GT20 is the relevant model to review. If GFCI protection is provided elsewhere, have the project’s electrical professional review the circuit arrangement before selecting the receptacle."
      },
      {
        "type": "h2",
        "text": "Check the project requirement"
      },
      {
        "type": "p",
        "text": "Section 406.12 of the 2023 NEC covers 15A and 20A, 125V and 250V nonlocking receptacles in specified residential and other occupancies. The scope extends beyond children’s rooms. The locally adopted edition, amendments and applicable exceptions determine the requirement for the site.",
        "source": 0
      },
      {
        "type": "p",
        "text": "Record the voltage, current rating, NEMA configuration and required TR, WR and GFCI features on the purchase order. Match the model markings and documents to that list."
      },
      {
        "type": "p",
        "text": "Then approve the device finish and wallplate together. Keep the complete model and sample reference for reorders, so a cosmetic substitution also receives an electrical-specification check."
      },
      {
        "type": "h2",
        "text": "GT20 and RT20: same shutter, different product"
      },
      {
        "type": "p",
        "text": "Both model names carry the T that means tamper-resistant, and both are 20 A. They are still two different products. GT20 is a GFCI receptacle: it provides ground-fault protection and shuttered slots. RT20 is a duplex receptacle with the same shutters and no ground-fault function. A purchase order that says \"TR receptacle 20A\" has not yet chosen between them."
      },
      {
        "type": "p",
        "text": "The distinction changes the price, the document and the circuit. If the location needs both protection and shutters, the GT or GW family is the one to quote. If it needs shutters only and the protection sits upstream, RT20 is the cheaper and correct answer."
      },
      {
        "type": "p",
        "text": "Written properly, the line reads as the family, the rating and the feature set: GT20 for a protected 20 A location, RT20 for a shuttered 20 A receptacle on a protected circuit. Two letters apart, two different documents behind them."
      },
      {
        "type": "h2",
        "text": "Where TR is required and where it is only a preference"
      },
      {
        "type": "p",
        "text": "Tamper resistance is a code requirement in specified occupancies, not a universal one. Dwelling units are the obvious case; the scope in the adopted edition, plus local amendments, decides whether a given commercial space falls inside it. That determination belongs to the specifier, and it changes the price of a receptacle line by a noticeable margin."
      },
      {
        "type": "p",
        "text": "Mixed projects are where this gets practical. A building with residential floors above a retail podium may need shuttered devices upstairs and plain ones in the back-of-house areas. Ordering the whole job with shutters is simple and more expensive; ordering by location type is cheaper and needs a schedule that says which is which."
      },
      {
        "type": "p",
        "text": "The visual argument for uniformity is real — the same face across a project looks deliberate. It just should not be the deciding argument. Where the requirement is location-based, splitting the order by location keeps the appearance consistent in the areas anyone sees and the cost where nobody does."
      },
      {
        "type": "p",
        "text": "One last pairing mistake: shutters do not make a device weather-resistant, and a TR device in a wet location still needs the correct enclosure and cover. RT15 and RW15 differ by that W for a reason, and the order line should show it."
      }
    ]
  },
  {
    "slug": "how-to-source-ul-listed-gfci-from-china",
    "title": "Sourcing GFCI Outlets: A Model-by-Model Review",
    "excerpt": "Build a GFCI sourcing brief around exact models, UL records, approved samples and packaging. Includes FAHINT 15A and 20A model pairs.",
    "date": "2026-07-22",
    "updated": "2026-10-29",
    "readMinutes": 2,
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
        "text": "For a bulk or private-label GFCI order, start with a model schedule. Give each model its quantity, required features and document reference. The quotation, approved sample and purchase order can then refer to the same configuration."
      },
      {
        "type": "h2",
        "text": "Build the model schedule"
      },
      {
        "type": "p",
        "text": "FAHINT separates standard, tamper-resistant and tamper- plus weather-resistant GFCI receptacles into the following 15A and 20A pairs."
      },
      {
        "type": "table",
        "caption": "FAHINT GFCI receptacle sourcing shortlist",
        "columns": [
          "Configuration",
          "15A model",
          "20A model"
        ],
        "rows": [
          [
            "Standard",
            {
              "label": "GF15",
              "href": "/products/gfci/gf15"
            },
            {
              "label": "GF20",
              "href": "/products/gfci/gf20"
            }
          ],
          [
            "Tamper-resistant (TR)",
            {
              "label": "GT15",
              "href": "/products/gfci/gt15"
            },
            {
              "label": "GT20",
              "href": "/products/gfci/gt20"
            }
          ],
          [
            "Tamper- and weather-resistant (TR/WR)",
            {
              "label": "GW15",
              "href": "/products/gfci/gw15"
            },
            {
              "label": "GW20",
              "href": "/products/gfci/gw20"
            }
          ]
        ]
      },
      {
        "type": "p",
        "text": "Review GL20 and the industrial GTN models separately. GL20 has a blank face, and its certification documentation remains under review. GTN models have no feed-through terminals.",
        "links": [
          {
            "label": "Compare the complete GFCI outlet range",
            "href": "/products/gfci"
          }
        ]
      },
      {
        "type": "h2",
        "text": "Match the model to the certification record"
      },
      {
        "type": "p",
        "text": "Search UL Solutions’ Product iQ using the file number and model designation. Compare the listed organization, model and scope with the device being quoted.",
        "source": 0
      },
      {
        "type": "p",
        "text": "Our document library includes the August 16, 2022 addendum to E504391-20210212. It names GF15, GF20, GT15, GT20, GW15 and GW20, plus GTN15 and GTN20 as tamper-resistant models with no feed-through. GL20 is not included. Check the original document and current listing status for the ordered configuration.",
        "links": [
          {
            "label": "Review GFCI product-family documents",
            "href": "/resources?family=gfci"
          }
        ]
      },
      {
        "type": "h2",
        "text": "Approve a sample and an inspection brief"
      },
      {
        "type": "list",
        "label": "GFCI OEM sample approval checklist",
        "items": [
          "Match the full model and ratings across the quotation, device and product documents.",
          "Review the device finish and wallplate together.",
          "Approve authorized brand artwork, required identification, instructions and packaging.",
          "Record the sample and artwork revision used for production and inspection."
        ]
      },
      {
        "type": "p",
        "text": "Ask which inspection records are available for the selected model. Agree on any additional performance evaluation with qualified personnel, including the method and acceptance criteria. Keep those requirements with the approved sample reference."
      },
      {
        "type": "p",
        "text": "A supplier with a defined production line can answer this precisely. Our plant in Wenzhou runs 12 automated inspection lines across 70,000 sq ft at a stated 98% first-pass yield; when we quote an inspection brief, we can name which of those lines carries the model and what the station tests. A supplier who cannot name the line is describing a capability rather than a process."
      },
      {
        "type": "h2",
        "text": "Request a quotation by configuration"
      },
      {
        "type": "list",
        "label": "Bulk GFCI outlet inquiry checklist",
        "items": [
          "Model numbers and quantities, with required TR or WR features.",
          "Device finish, wallplate and packaging for each order line.",
          "Destination market, intended application and required documents.",
          "Authorized artwork and labeling requirements.",
          "Sample quantity, agreed inspection requirements and requested delivery date."
        ]
      },
      {
        "type": "p",
        "text": "Ask for minimum order quantities, sample arrangements, production timing, delivery terms and warranty terms against that schedule. If a detail is undecided, mark it for review rather than leaving the supplier to assume."
      },
      {
        "type": "p",
        "text": "Send us the schedule with any open questions. FAHINT can review the models, document needs and packaging before confirming commercial terms in the quotation.",
        "links": [
          {
            "label": "Explore OEM manufacturing and packaging",
            "href": "/capabilities#oem"
          },
          {
            "label": "Send your GFCI sourcing brief",
            "href": "/contact?topic=oem"
          }
        ]
      },
      {
        "type": "h2",
        "text": "Four questions that decide the shortlist before pricing"
      },
      {
        "type": "list",
        "label": "Ask in this order",
        "items": [
          "Rating: 15 A or 20 A, which also fixes the NEMA face and the circuit.",
          "Function: standard, tamper-resistant, tamper- and weather-resistant, or blank-face.",
          "Visible details: finish, plate model and whether the plate ships with the device.",
          "Destination documents: which listing record the market or the retailer actually asks to see."
        ]
      },
      {
        "type": "p",
        "text": "Asking in that order matters because each answer removes options. A 15 A answer halves the list; a TR/WR answer removes three more; a plate requirement can remove one. By the fourth question the shortlist is usually two models, and the quotation can be compared line for line instead of by headline price."
      },
      {
        "type": "p",
        "text": "The sample plan follows from the same logic. One unit per configuration, not per model: a customer approving GW20 does not need to approve GW15 separately if the difference is the rating alone. That keeps a five-configuration program to five samples rather than nine."
      }
    ]
  },
  {
    "slug": "gfci-colour-finishes-specification",
    "title": "Coordinating Device Finishes Across a Project",
    "excerpt": "Approve an outlet and wallplate as a pair. Use glossy and matte samples under project lighting, then record the exact combination for reorders.",
    "date": "2026-07-15",
    "updated": "2026-10-29",
    "readMinutes": 2,
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
        "text": "Treat the device and wallplate as one finish sample. Two items described as “white” can look different once their surface texture and gloss are seen together. Approve the pair under the lighting planned for the project."
      },
      {
        "type": "h2",
        "text": "Color is only part of the finish"
      },
      {
        "type": "p",
        "text": "FAHINT BS1803-G and BS1803-M illustrate the difference: both are screwless polycarbonate wallplates, with glossy and matte surfaces respectively. Their finish choice changes how the plate reflects light even when the color choice is the same.",
        "links": [
          {
            "label": "BS1803-G · glossy screwless wall plate",
            "href": "/products/wallplates/bs1803-g"
          },
          {
            "label": "BS1803-M · matte screwless wall plate",
            "href": "/products/wallplates/bs1803-m"
          }
        ]
      },
      {
        "type": "p",
        "text": "Use screen images to make a shortlist, then compare physical samples with the selected outlet or switch. Check the face, plate edge and surrounding wall together. For multi-gang positions, also review the opening arrangement and overall dimensions."
      },
      {
        "type": "p",
        "text": "Select the electrical model before making that comparison. The required rating, protection and configuration stay part of the order while you choose the appearance. Available colors and surfaces vary by model."
      },
      {
        "type": "h2",
        "text": "Make the approved pair easy to reorder"
      },
      {
        "type": "list",
        "label": "Finish record for the purchase order",
        "items": [
          "Full device model and ordered color or finish.",
          "Wallplate model, surface finish and opening arrangement.",
          "Approved physical sample reference.",
          "Packaging and authorized branding, where required."
        ]
      },
      {
        "type": "p",
        "text": "For a private-label finish, send the target sample or finish brief before committing to a customer’s delivery date. We need to confirm feasibility, quantity and lead time for the selected product and finish."
      },
      {
        "type": "h2",
        "text": "A finish that travels across five families"
      },
      {
        "type": "p",
        "text": "Finish coordination is hard because a room rarely uses one product family. A bathroom might carry a GFCI, a USB outlet, a switch and a plate within arm's reach of each other. If those four come from four different finish lists, the wall will not match even when every line is correct on its own."
      },
      {
        "type": "p",
        "text": "The practical fix is to choose the finish once, at the level of the room, then check availability family by family. A finish offered on a GFCI receptacle is not automatically offered on a metal wallplate or on a smart switch, and the gap usually surfaces after the sample has been approved for the first family."
      },
      {
        "type": "p",
        "text": "Production batches matter too. Two runs of the same named finish can differ slightly, which is invisible on separate walls and obvious on the same one. Keeping the approved sample reference and the production date on the purchase order is what lets a second batch be compared against something physical rather than a name."
      },
      {
        "type": "p",
        "text": "When a container mixes finishes, pack by finish and label the cartons by finish rather than by model alone. The installer takes one carton to one floor, and a mixed carton costs more time on site than it saves in the warehouse."
      }
    ]
  }
];

export function findPost(slug) { return posts.find(post => post.slug === slug); }
export const postCategories = ['All', ...new Set(posts.map(post => post.category))];
