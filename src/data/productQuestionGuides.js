// Focused follow-ups to the series buying guides. Research: docs/ARTICLE-RESEARCH-2026-10-22.md.
export const productQuestionGuides = [
  {
    slug: 'what-is-blank-face-gfci',
    title: 'What is a blank-face GFCI?',
    excerpt: "A blank-face GFCI provides protection with TEST and RESET controls but no plug sockets. Compare this format with a receptacle and review FAHINT GL20.",
    date: '2026-10-22',
    updated: "2026-10-29",
    readMinutes: 2,
    category: 'Technical Guide',
    cover: 'assets/images/products/gl20-feature-application-v1.jpg',
    coverAlt: 'Blank-face GFCI with test and reset buttons on a wall beside an equipment enclosure.',
    coverCaption: 'Illustrated blank-face GFCI setting. The image does not establish approval for the adjacent equipment.',
    coverSource: 'Existing FAHINT GL20 application illustration: products/gl20-feature-application-v1.jpg',
    sources: [
      { label: 'Leviton: blank-face GFCI overview', href: 'https://leviton.com/products/residential/gfci/blank-face' },
      { label: 'FAHINT GL20 model specifications', href: '/products/gfci/gl20' },
      { label: 'FAHINT original certification documents', href: '/resources#certifications' }
    ],
    body: [
      {
        "type": "p",
        "text": "A blank-face GFCI has TEST and RESET buttons without plug sockets. It provides ground-fault protection for a connected load. You may also see this format called faceless or dead-front.",
        "source": 0
      },
      {
        "type": "p",
        "text": "Our GL20 is a 20A, 125V self-test model with side/back wiring for indoor use. Choose this format when the project needs a separate protective device and accessible test/reset controls.",
        "source": 1
      },
      {
        "type": "h2",
        "text": "Blank-face device, receptacle or cover?"
      },
      {
        "type": "table",
        "caption": "Three items that can appear on a wiring-device schedule",
        "columns": [
          "Item",
          "What is on the front",
          "What to specify"
        ],
        "rows": [
          [
            "Blank-face GFCI",
            "TEST / RESET controls, no plug sockets",
            "The protective device and intended load"
          ],
          [
            "GFCI receptacle",
            "Plug sockets and TEST / RESET controls",
            "The receptacle rating and required protection features"
          ],
          [
            "Blank wallplate",
            "A plain cover",
            "The plate dimensions and mounting arrangement; it provides no GFCI function"
          ]
        ]
      },
      {
        "type": "p",
        "text": "Write the device name and model on the bill of materials. “Blank GFCI plate” can be read as either a protective device or a plain cover. If a plug-in outlet is needed at that position, specify a GFCI receptacle."
      },
      {
        "type": "h2",
        "text": "Specify the GL20 and its protected load"
      },
      {
        "type": "p",
        "text": "The project drawing should identify the protected load and the position of the TEST/RESET controls. Downstream protection follows the electrical connections through the GFCI; proximity along a wall does not establish protection.",
        "source": 0
      },
      {
        "type": "p",
        "text": "For GL20, include the intended equipment and location in the review. Its indoor rating has no weather-resistant designation. The installer needs the exact model instructions to approve the load arrangement and access to the controls."
      },
      {
        "type": "p",
        "text": "A useful order line starts with “GL20, 20A, 125V, blank-face self-test GFCI”, followed by finish, quantity and the required wallplate or pack. Match the sample to that configuration."
      },
      {
        "type": "p",
        "text": "GL20 certification documentation remains under review in our library. Request its exact-model record before approval; the supplied certificate covering other GFCI models does not establish GL20 coverage.",
        "source": 2
      },
      {
        "type": "p",
        "text": "Compare the receptacle models if you need plug sockets at the device. The sourcing guide explains the model and document checks for a larger GFCI order.",
        "links": [
          {
            "label": "View GL20",
            "href": "/products/gfci/gl20"
          },
          {
            "label": "GFCI sourcing guide",
            "href": "/blog/how-to-source-ul-listed-gfci-from-china"
          }
        ]
      },
      {
        "type": "h2",
        "text": "Where a blank-face device actually saves a run"
      },
      {
        "type": "p",
        "text": "A blank-face GFCI earns its place at a junction that needs protection but not a receptacle. Picture a bathroom wall where the circuit continues to a light or a fan: the protection has to sit upstream, and nobody wants a socket at chest height next to a towel rail. The GL20 closes that gap. It is a 20 A device with no openings, so it protects what is wired downstream and offers nothing to plug into."
      },
      {
        "type": "p",
        "text": "The alternative — moving the protection to the panel or to a receptacle further along — usually costs more in cable and time than the device itself. That is the argument to make to a contractor, and it is why the blank-face model survives in a catalogue dominated by receptacles."
      },
      {
        "type": "p",
        "text": "Two things go wrong at order stage. The first is buying a blank-face device for a location that later needs an outlet; the fix is a GT20 or GW20, not a different plate. The second is forgetting the plate: a blank-face device still needs a wallplate, and it needs one with no opening, which is a different line on the order."
      },
      {
        "type": "p",
        "text": "GL20 sits outside the documented shortlist in the August 16, 2022 addendum to E504391-20210212, and its record is still under review in our library. Request the exact model document before the specification is issued rather than relying on the family page."
      }
    ]
  },
  {
    slug: 'usb-c-wall-outlet-laptop-charging',
    title: 'Can a USB-C wall outlet charge a laptop?',
    excerpt: "Match the laptop’s USB-C charging profile and cable to the outlet. Review FTR15QC-DC65W and the power-sharing question when a second device connects.",
    date: '2026-10-22',
    updated: "2026-10-29",
    readMinutes: 2,
    category: 'Buying Guide',
    cover: 'assets/images/home-installations/ftr15qc-dc65w-desk-installed-v1.webp',
    coverAlt: 'A dual USB-C wall outlet charging a phone on a desk in an illustrated interior.',
    coverCaption: 'Illustrated USB-C charging setup. A phone charging scene does not establish compatibility with a laptop.',
    coverSource: 'Existing FAHINT illustration: home-installations/ftr15qc-dc65w-desk-installed-v1.webp',
    sources: [
      { label: 'Legrand: USB-C Power Delivery applications', href: 'https://www.legrand.ca/solutions/usb-charging/usb-c-power-delivery' },
      { label: 'Apple: choosing a power adapter for a Mac', href: 'https://support.apple.com/en-us/109509' },
      { label: 'Apple: charging a Mac laptop', href: 'https://support.apple.com/en-us/102397' },
      { label: 'FAHINT FTR15QC-DC65W output profiles', href: '/products/usb-outlets/ftr15qc-dc65w' },
      { label: 'FAHINT USB catalog sheet, original page 11', href: '/assets/documents/catalog-sheets/pd-usb-outlets.pdf' }
    ],
    body: [
      {
        "type": "p",
        "text": "Yes, if the laptop accepts USB-C charging and the outlet and cable supply a compatible power profile. Start with the laptop model and its recommended charger. These determine which outlet to shortlist.",
        "source": 0
      },
      {
        "type": "h2",
        "text": "Match the laptop to a charging profile"
      },
      {
        "type": "p",
        "text": "Apple recommends a USB Power Delivery source and cable that meet at least the minimum wattage for the Mac model. Other laptops have their own requirements, so use the computer manufacturer’s specification.",
        "source": 1
      },
      {
        "type": "p",
        "text": "FTR15QC-DC65W offers the profiles below. Its highest published single-port output is 20V at 3.25A, or 65W. Compare the voltage and current with the laptop’s accepted input.",
        "source": 3
      },
      {
        "type": "table",
        "caption": "FTR15QC-DC65W published USB-C profiles",
        "columns": [
          "Voltage",
          "Current",
          "Calculated power"
        ],
        "rows": [
          [
            "5V",
            "3A",
            "15W"
          ],
          [
            "9V",
            "3A",
            "27W"
          ],
          [
            "12V",
            "3A",
            "36W"
          ],
          [
            "15V",
            "3A",
            "45W"
          ],
          [
            "20V",
            "3.25A",
            "65W"
          ]
        ]
      },
      {
        "type": "p",
        "text": "Use a cable rated for the required power. The outlet’s 15A, 125V rating describes its AC receptacle; USB charging power is specified separately."
      },
      {
        "type": "h2",
        "text": "Allow for the second device"
      },
      {
        "type": "p",
        "text": "FTR15QC-DC65W has two USB-C ports. The catalog gives single-port maximums but no complete simultaneous-port allocation table. For a laptop and phone used together, request the combined-use figures before approving the outlet."
      },
      {
        "type": "p",
        "text": "A charging icon is only part of the check. Apple notes that insufficient available power can produce a slow-charger warning. Assess the laptop under its intended workload, then repeat with the second port occupied.",
        "source": 2
      },
      {
        "type": "p",
        "text": "Keep the laptop, cable, phone and battery state with the sample results so the same setup can be checked again."
      },
      {
        "type": "p",
        "text": "For an office, name the computers the outlet must support. For a guest room, state whether the aim is phone charging or laptop charging too. That distinction belongs in the product brief."
      },
      {
        "type": "p",
        "text": "For example: “FTR15QC-DC65W for [laptop model] with [cable]. Please confirm available power with the laptop alone and with a phone on the second port.” Attach the laptop charging specification.",
        "links": [
          {
            "label": "View FTR15QC-DC65W",
            "href": "/products/usb-outlets/ftr15qc-dc65w"
          },
          {
            "label": "Compare USB outlet configurations",
            "href": "/blog/usb-wall-outlet-buying-guide"
          }
        ]
      },
      {
        "type": "h2",
        "text": "Reading a laptop charger against the outlet"
      },
      {
        "type": "p",
        "text": "Start with the wattage printed on the laptop's original supply. Most 13- and 14-inch machines ship with something in the 45–65 W band, which is why the 65 W Power Delivery model is the one that gets specified. The 20 W model is a phone and tablet device; it will charge a laptop slowly or refuse the negotiation, and no cable fixes that."
      },
      {
        "type": "p",
        "text": "Above 65 W the range stops. A 90 W or 140 W workstation laptop needs a supply outside this catalogue, and the honest answer is a desk dock rather than a wall outlet. Saying so early saves a sample round."
      },
      {
        "type": "p",
        "text": "The cable is part of the circuit. A USB-C cable rated for 3 A caps the current no matter what the outlet or the laptop can negotiate, so a 65 W outlet with a 3 A cable behaves like a 60 W one. For the full profile, specify a 5 A cable with the e-marker, and keep the cable in the quotation so the customer is not left to source it."
      },
      {
        "type": "p",
        "text": "With two devices connected, the published combined limit applies. A laptop at 65 W plus a phone is not 65 W plus 20 W; the outlet divides what it can supply, and the laptop may drop to a slower profile. If both ports matter, say which device has priority."
      },
      {
        "type": "p",
        "text": "Send the laptop model, the original charger wattage, the cable rating and the second device. Those four answers decide whether FTR15QC-DC65W is even the right part before anyone talks about quantity."
      }
    ]
  },
  {
    slug: 'back-wire-vs-push-in-outlets',
    title: 'Back wire vs push-in outlets: R15 or R15Q?',
    excerpt: 'R15 uses side/back wiring; R15Q uses side/push-in quick wiring. Compare these 15A duplex outlets and the published #14 AWG push-in limit.',
    date: '2026-10-22',
    updated: '2026-10-29',
    readMinutes: 2,
    category: 'Technical Guide',
    cover: 'assets/images/catalog/models/f7545e332ba20ec4.webp',
    coverAlt: 'White standard duplex receptacle with two plug sockets, mounting strap and visible side screws.',
    coverCaption: 'R15 / R15Q standard duplex design. The model designation identifies the wiring version.',
    coverSource: 'Existing FAHINT standard duplex product image: catalog/models/f7545e332ba20ec4.webp',
    coverWidth: 800,
    coverHeight: 800,
    coverFit: 'contain',
    sources: [
      { label: 'FAHINT catalog: R15 and R15Q, page 15', href: '/assets/documents/fahint-product-catalog.pdf#page=15' },
      { label: 'FAHINT catalog: terminal illustrations, page 18', href: '/assets/documents/fahint-product-catalog.pdf#page=18' },
      { label: 'Leviton: back wiring vs side wiring', href: 'https://leviton.com/support/literature/blogs/back-wiring-vs-side-wiring' },
      { label: 'Leviton: Quickwire terminology', href: 'https://leviton.com/support/resources/product-support/dimmers-and-switches/switches/video-how-to-wire-a-device-using-the-quickwire-method' },
      { label: 'FAHINT D15Q: decorator face and push-in specification', href: '/products/receptacles/d15q' }
    ],
    body: [
      { type: 'p', text: 'FAHINT R15 and R15Q are both 15A, 125V standard duplex receptacles. The difference is at the terminals: R15 offers side/back wiring; R15Q offers side/push-in quick wiring.', source: 0 },
      { type: 'h2', text: 'The difference in our catalog' },
      { type: 'table', caption: 'R15 and R15Q: published wiring options', columns: ['Model', 'Rating', 'Wiring options'], rows: [
        [{ label: 'R15', href: '/products/receptacles/r15' }, '15A, 125V', 'Side wire / back wire'],
        [{ label: 'R15Q', href: '/products/receptacles/r15q' }, '15A, 125V', 'Side wire / push-in quick wire']
      ] },
      { type: 'p', text: 'The Q identifies the push-in version of this pair. Keep that suffix on the quotation and sample label so the wiring version stays clear through ordering.' },
      { type: 'p', text: 'Our catalog marks the 15A push-in terminal “#14 AWG only.” That limit applies to the push-in connection. A purchase specification calling for a #12 AWG push-in connection does not match it.', source: 1, links: [
        { label: 'See the terminal illustrations · catalog page 18', href: '/assets/documents/fahint-product-catalog.pdf#page=18' }
      ] },
      { type: 'h2', text: 'What the terminal names mean' },
      { type: 'p', text: 'With screw-clamp back wiring, a screw operates a clamp that holds the conductor. Side wiring uses the screw terminal on the side of the device. Leviton illustrates both methods in its wiring guide.', source: 2 },
      { type: 'p', text: 'Push-in wiring accepts the conductor directly into the rear terminal. Leviton calls its version Quickwire and also uses the term “backstab.” These overlapping names are why “back wire” on its own can be ambiguous in a quotation.', source: 3 },
      { type: 'p', text: 'For the selected FAHINT model, the approved instructions specify conductor material, solid or stranded suitability, strip length and torque. The #14 AWG push-in marking does not specify the conductor range for the separate side/back terminals.' },
      { type: 'h2', text: 'A purchase description you can use' },
      { type: 'p', text: 'For R15Q, write “R15Q, 15A 125V, standard duplex, side/push-in quick wire,” followed by the chosen finish and quantity. If the project calls for side/back wiring, compare R15 using the first row above.' },
      { type: 'p', text: 'When checking a sample, look at its model marking and rear terminals together. R15 and R15Q share a front presentation in our catalog, so a front photo alone cannot confirm the wiring version.' },
      { type: 'p', text: 'For a rectangular decorator face, D15Q offers side/push-in quick wiring with the same published #14 AWG limit for its 15A push-in terminal. It needs a different wallplate opening from this duplex pair.', source: 4, links: [
        { label: 'View D15Q · decorator format', href: '/products/receptacles/d15q' },
        { label: 'Standard receptacle buying guide', href: '/blog/standard-receptacle-buying-guide' }
      ] },
      {
        "type": "h2",
        "text": "Mixing both terminal types on one project"
      },
      {
        "type": "p",
        "text": "R15 and R15Q share a front presentation, so a photograph of a device face cannot tell an installer which one is in the carton. That matters on a project where one floor is wired in #14 and another in #12, because the terminal method, not the appearance, decides which line the electrician can use."
      },
      {
        "type": "p",
        "text": "The practical rule is one terminal type per floor, written on the schedule. Mixing them in a single carton means the installer has to check the rear of every device before choosing a conductor, and that check rarely happens on a schedule that is already behind."
      },
      {
        "type": "p",
        "text": "Push-in connections are faster to make; screw-clamp back wiring holds a wider conductor range and is the safer choice where the circuit may be reconfigured later. Neither is universally better, and the specifier usually knows which trade-off the project is buying."
      },
      {
        "type": "p",
        "text": "For packing, we label cartons by the full model rather than the family, so a site can sort by terminal type without opening boxes. If both suffixes ship in one order, ask for them in separate cartons — it costs nothing at packing and saves an hour at installation."
      }
    ]
  },
  {
    slug: 'led-lights-flicker-on-dimmer',
    title: 'Why do LED lights flicker on a dimmer?',
    excerpt: "Identify when LED flicker occurs, compare DM2010 with the 0-10V DM2010S, and record the lamp, load and symptoms for a useful technical review.",
    date: '2026-10-22',
    updated: "2026-10-29",
    readMinutes: 2,
    category: 'Troubleshooting',
    cover: 'assets/images/editorial-home/category-switches-scene.webp',
    coverAlt: 'White paddle and slide dimmer on a dark wall beside a softly lit room.',
    coverCaption: 'Illustrated dimmer setting. A room photograph cannot establish lamp compatibility or the lowest stable light level.',
    coverSource: 'Existing FAHINT dimmer illustration: editorial-home/category-switches-scene.webp',
    sources: [
      { label: 'Lutron: flickering, buzzing and dropout with LED dimmers', href: 'https://support.lutron.com/us/en/product/maestro/article/troubleshooting/flickering-flashing-led-lights-with-maestro-dimmers' },
      { label: 'FAHINT DM2010 / DM2010S catalog sheet', href: '/assets/documents/catalog-sheets/dm2010-dm2010s.pdf' },
      { label: 'FAHINT DM2010 load specifications', href: '/products/dimmers/dm2010' }
    ],
    body: [
      {
        "type": "p",
        "text": "LED flicker on a dimmer can come from a lamp that is not dimmable, an incompatible control, or a light level below the lamp’s stable range. Note when it happens: at startup, near minimum brightness, or throughout the range.",
        "source": 0
      },
      {
        "type": "p",
        "text": "“Four lamps flicker near the bottom of the slider and stay steady at full brightness” gives a useful starting point. Record what you can observe without opening the wall box."
      },
      {
        "type": "h2",
        "text": "Compare the lamp and dimmer specifications"
      },
      {
        "type": "p",
        "text": "Check the lamp or driver’s full model number, dimmable marking and required control method. A 0-10V driver needs a compatible 0-10V control."
      },
      {
        "type": "p",
        "text": "In our range, DM2010 is listed for dimmable LED/CFL loads at 120V AC, 60Hz. DM2010S is the separate 0-10V model, with a 120/277V supply specification. Keep the S suffix when comparing them.",
        "source": 1
      },
      {
        "type": "p",
        "text": "DM2010’s published LED/CFL range is 5 to 200W; its incandescent range is 20 to 600W. Use the LED range for LED lamps. Four 10W lamps total 40W, but that calculation still needs a compatibility check with the actual lamp model.",
        "source": 2
      },
      {
        "type": "h2",
        "text": "When flicker appears only at low brightness"
      },
      {
        "type": "p",
        "text": "Lutron explains that some LEDs reach their lowest stable light level before the dimmer reaches its minimum setting. Supported dimmers may offer a low-end adjustment. The setting and procedure belong to the exact control; Maestro instructions should not be applied to DM2010.",
        "source": 0
      },
      {
        "type": "p",
        "text": "During sample review, agree on the lowest light level the room needs and demonstrate it with the planned lamp quantity. For several devices mounted together, request the applicable load limits. The current FAHINT catalog sheet has no multi-gang derating schedule."
      },
      {
        "type": "h2",
        "text": "Send the details that help identify the problem"
      },
      {
        "type": "list",
        "label": "Information for a dimming performance review",
        "items": [
          "Dimmer model and the lamp or driver manufacturer and model.",
          "Lamp quantity, wattage per lamp and the specified dimming method.",
          "Whether the symptom occurs at startup, at low brightness or throughout the range.",
          "Whether every lamp behaves the same way, and whether anything was recently changed."
        ]
      },
      {
        "type": "p",
        "text": "Describe what you see in person as well as sending a short video. Stop using a control with heat damage, a burning smell or arcing and arrange qualified inspection. Electrical faults and wiring checks need an electrician."
      },
      {
        "type": "p",
        "text": "For a new installation, keep the accepted lamp and dimmer models together in the sample record. Recheck compatibility if the lamp or driver changes.",
        "links": [
          {
            "label": "View DM2010",
            "href": "/products/dimmers/dm2010"
          },
          {
            "label": "Compare LED and 0-10V dimmers",
            "href": "/blog/dimmer-buying-guide-led-0-10v"
          }
        ]
      }
,
      {
        "type": "h2",
        "text": "Four causes we look at before calling it a dimmer fault"
      },
      {
        "type": "list",
        "label": "Flicker checklist, in the order we ask",
        "items": [
          "Is the lamp or driver actually rated as dimmable? A non-dimmable driver flickers at every level, not just low ones.",
          "Is the connected load above the dimmer's minimum? A single 6 W lamp is sometimes below the threshold where the circuit behaves.",
          "Is the dimmer a 0–10 V model on a driver without a 0–10 V input? DM2010S cannot dim a driver that was never built to accept the signal.",
          "Are mixed lamp types sharing one dimmer? Two technologies on one control rarely track each other across the range."
        ]
      },
      {
        "type": "p",
        "text": "The pattern narrows it quickly. Flicker only at the bottom of the travel points at load or driver behaviour. Flicker at every level, including full on, points at the driver or the supply. A buzz that appears with one particular lamp and disappears with another is usually the lamp, not the control."
      },
      {
        "type": "p",
        "text": "A photograph of a flickering lamp cannot diagnose anything, and neither can one of the dimmer. What does help is a short video taken at constant camera settings, plus the lamp model, the driver model, the number of drivers on the dimmer, the total connected load and the exact model number of the control. With those five, the answer is usually one exchange."
      }
    ]
  },
  {
    slug: 'combination-light-switch-double-triple-rocker',
    title: 'Two or three switches in one box: choosing a combination switch',
    excerpt: "Compare FAHINT DS1502, DS1503 and DS15.3. Separate rocker count, control locations and wallplate gangs when ordering a combination light switch.",
    date: '2026-10-22',
    updated: "2026-10-29",
    readMinutes: 2,
    category: 'Buying Guide',
    cover: 'assets/images/catalog/models/9c21053579be1cac.webp',
    coverAlt: 'FAHINT DS1502 double paddle combination switch with two separate rockers.',
    coverCaption: 'DS1502 has two single-pole rockers in one device. It is not a two-gang assembly.',
    coverSource: 'Existing FAHINT DS1502 product-library photograph: catalog/models/9c21053579be1cac.webp',
    coverFit: 'contain',
    coverWidth: 800,
    coverHeight: 800,
    sources: [
      { label: 'ENERLITES: combination device configurations', href: 'https://enerlites.com/category/wiring-devices/combination-devices' },
      { label: 'FAHINT lighting switch catalog, page 25', href: '/assets/documents/fahint-product-catalog.pdf#page=25' },
      { label: 'FAHINT DS1502 specifications', href: '/products/lighting-switches/ds1502' },
      { label: 'FAHINT DS1503 specifications', href: '/products/lighting-switches/ds1503' }
    ],
    body: [
      {
        "type": "p",
        "text": "DS1502 puts two single-pole rockers in one device position; DS1503 puts three there. They provide separate on/off controls for separate loads, such as ceiling lights and wall lights at a room entrance."
      },
      {
        "type": "h2",
        "text": "Two loads or two control locations?"
      },
      {
        "type": "p",
        "text": "Count loads and control locations separately. A 3-way circuit lets the same load be controlled from two locations. For that function, review DS15.3. DS1503’s three rockers each provide single-pole control.",
        "source": 1
      },
      {
        "type": "table",
        "caption": "FAHINT switch functions that should not be confused",
        "columns": [
          "Model",
          "Controls on the device",
          "Published function"
        ],
        "rows": [
          [
            {
              "label": "DS1502",
              "href": "/products/lighting-switches/ds1502"
            },
            "Two rockers",
            "Two single-pole controls"
          ],
          [
            {
              "label": "DS1503",
              "href": "/products/lighting-switches/ds1503"
            },
            "Three rockers",
            "Three single-pole controls"
          ],
          [
            {
              "label": "DS15.3",
              "href": "/products/lighting-switches/ds15-3"
            },
            "One paddle",
            "3-way switching"
          ]
        ]
      },
      {
        "type": "p",
        "text": "Combination configurations vary across manufacturers. ENERLITES, for example, lists dual single-pole and dual 3-way versions separately. Use the stated function as well as the rocker count when comparing products.",
        "source": 0
      },
      {
        "type": "h2",
        "text": "The device still occupies one gang"
      },
      {
        "type": "p",
        "text": "DS1502 and DS1503 are single-gang devices. Choose the wallplate by the device opening and mounting position, rather than ordering a two- or three-gang plate from the number of rockers."
      },
      {
        "type": "p",
        "text": "Review the switch and plate as an assembled sample. The installer also needs to check wall-box space and the conductors for the planned loads."
      },
      {
        "type": "h2",
        "text": "State the load behind each rocker"
      },
      {
        "type": "p",
        "text": "Both combination models have a published device rating of 15A, 120/277V AC. The rocker count does not multiply that rating. Obtain the applicable per-circuit and combined-load limits for the selected model.",
        "source": 2
      },
      {
        "type": "p",
        "text": "If a rocker will operate a fan, heater or other equipment, name its model and load in the request. These are on/off controls; dimming and fan-speed control require their own suitable devices."
      },
      {
        "type": "p",
        "text": "For a DS1502 inquiry, a simple control schedule might read “upper rocker: ceiling lights; lower rocker: wall lights,” followed by the equipment details, finish, plate and quantity. Keep the same arrangement in the approved sample and room schedule.",
        "links": [
          {
            "label": "Lighting switch buying guide",
            "href": "/blog/light-switch-buying-guide"
          },
          {
            "label": "View combination switch models",
            "href": "/products/lighting-switches"
          }
        ]
      },
      {
        "type": "h2",
        "text": "One strap, two loads: the plate is where orders go wrong"
      },
      {
        "type": "p",
        "text": "DS1502 and DS1503 put two or three rockers on a single strap that occupies one gang. The rocker count is a device property; the plate opening count is a plate property; and the two are not the same number. A two-rocker combination device takes a single-opening plate, because the plate surrounds one strap, not two devices."
      },
      {
        "type": "p",
        "text": "The most common configuration we quote is a bathroom where one rocker drives the light and the other drives the fan. Both loads sit behind the same strap, so the total connected load is the sum, and a fan with a high inrush is the part that decides whether the device is suitable. Give the fan model, not just its wattage."
      },
      {
        "type": "p",
        "text": "The range has no three-way combination device. If one of the two loads has to be switched from a second location, that load needs its own three-way circuit and a separate DS15-3 or T15-3 at each end. Trying to solve it with a combination device produces a plan that cannot be wired."
      },
      {
        "type": "p",
        "text": "Write the line as the model, the rocker layout, the load behind each rocker, the finish and the matching single-opening plate. When a quantity arrives without the rocker layout, the order is one message away from being wrong."
      }
    ]
  },
  {
    slug: 'smart-switch-neutral-vs-no-neutral',
    title: 'Smart switches with or without neutral: which version fits?',
    excerpt: "USW8811 requires neutral and live; USW8811-S uses single-live wiring. Compare their supply ratings and the accessory and load details to confirm.",
    date: '2026-10-22',
    updated: "2026-10-29",
    readMinutes: 2,
    category: 'Buying Guide',
    cover: 'assets/images/catalog/smart-switches/17f21f2fe226b9cf-white-v1.webp',
    coverAlt: 'Black FAHINT US-format glass touch switch shown at a slight angle on a white background.',
    coverCaption: 'The front panel does not identify neutral requirements. Use the complete model designation.',
    coverSource: 'Existing FAHINT smart-switch product asset: catalog/smart-switches/17f21f2fe226b9cf-white-v1.webp',
    coverFit: 'contain',
    coverWidth: 800,
    coverHeight: 800,
    sources: [
      { label: 'ELEGRP: neutral requirement for SPN10 / SPN30', href: 'https://www.elegrp.com/support/faqs/faq/52.html' },
      { label: 'Leviton: neutral requirements for in-wall devices', href: 'https://leviton.com/support/resources/product-support/decora-smart-support/articles/360009317373-Do-I-need-a-Neutral-Wire-for-In-Wall-Devices' },
      { label: 'FAHINT smart-control catalog, pages 19 to 24', href: '/assets/documents/fahint-product-catalog.pdf#page=19' },
      { label: 'FAHINT USW8811 specifications', href: '/products/smart-switches/usw8811' },
      { label: 'FAHINT USW8811-S specifications', href: '/products/smart-switches/usw8811-s' }
    ],
    body: [
      {
        "type": "p",
        "text": "USW8811 requires neutral and live conductors. USW8811-S is the single-live version. Both are US-format, one-gang Wi-Fi touch switches, so the full model designation matters when ordering.",
        "source": 2
      },
      {
        "type": "h2",
        "text": "Compare the wiring and supply ratings"
      },
      {
        "type": "table",
        "caption": "Two similar-looking FAHINT Wi-Fi switches",
        "columns": [
          "Model",
          "Wiring version",
          "Published supply"
        ],
        "rows": [
          [
            {
              "label": "USW8811",
              "href": "/products/smart-switches/usw8811"
            },
            "Neutral + live (N + L)",
            "90 to 250V AC, 50/60Hz"
          ],
          [
            {
              "label": "USW8811-S",
              "href": "/products/smart-switches/usw8811-s"
            },
            "Single live wire",
            "110 to 240V AC, 50/60Hz"
          ]
        ]
      },
      {
        "type": "p",
        "text": "An electrician must identify the available conductors and check the model diagram. Neutral availability cannot be established by wire color alone, and a grounding conductor must never substitute for a neutral."
      },
      {
        "type": "p",
        "text": "Keep the confirmed wiring version against each room in a renovation schedule. Rooms in the same property may need different selections."
      },
      {
        "type": "h2",
        "text": "Check the accessories and intended load"
      },
      {
        "type": "p",
        "text": "For the FAHINT model being quoted, establish whether a bypass accessory or minimum load applies. Include any required accessory in the quotation and sample pack."
      },
      {
        "type": "p",
        "text": "No-neutral systems can have additional requirements. Leviton’s DN family, for example, uses its specified Wi-Fi bridge and an earth-ground connection. Those requirements describe Leviton’s system, not FAHINT’s.",
        "source": 1
      },
      {
        "type": "p",
        "text": "Our catalog lists 1200W per gang for these switches without identifying every permitted lamp or motor type. It does not establish a 1200W LED rating. Send the lamp or driver model, quantity and wattage for load review.",
        "source": 3
      },
      {
        "type": "p",
        "text": "For brightness control, select a dimming model. The switches compared here provide switching."
      },
      {
        "type": "h2",
        "text": "Evaluate the version you will order"
      },
      {
        "type": "p",
        "text": "Have the sample installed by the project electrician with the intended lamp and supplied instructions. Review local operation, the required app functions, and behavior after power or connectivity returns. Record the app, accessories and hardware version."
      },
      {
        "type": "p",
        "text": "Keep that combination with the sample approval. The broader smart-switch guide compares Wi-Fi, Zigbee and touch-only options once the wiring requirement is settled.",
        "links": [
          {
            "label": "Wi-Fi, Zigbee and touch-control guide",
            "href": "/blog/smart-switch-buying-guide-wifi-zigbee"
          }
        ]
      },
      {
        "type": "h2",
        "text": "What the wall usually has before anyone orders"
      },
      {
        "type": "p",
        "text": "In North American housing, a switch box from before the 1980s often carries a switch loop: line in, switched line out, no neutral waiting at the box. A neutral-required smart switch cannot be installed there without pulling a new conductor, which turns a product swap into an electrician's visit. That is the single most expensive surprise in a retrofit order."
      },
      {
        "type": "p",
        "text": "The single-live version exists for exactly that wall, and it carries its own constraint: some low-load lamps leave too little current for the electronics to stay powered, which shows up as flicker or a dim indicator with the light off. Ask what lamp is fitted, not only what switch is wanted."
      },
      {
        "type": "p",
        "text": "Zigbee adds a second dependency. The panel needs a compatible gateway on site, and the gateway is a separate line in the quotation. Touch-only panels need no gateway because they have no radio — they also will not appear in an app, and a buyer expecting app control will return them."
      },
      {
        "type": "p",
        "text": "Before a sample ships, we ask for four photographs: the inside of the box, the existing wiring, the wall opening with dimensions, and the old switch from the front. Those four answer the neutral question, the gang question and the frame question at once, and they cost the buyer nothing."
      }
    ]
  },
  {
    slug: 'screwless-vs-screw-fixed-wallplates',
    title: 'Screwless vs screw-fixed wallplates: what to check',
    excerpt: "Compare fixing styles and actual plate sizes. See why changing from BS1802 to BS1803 can expose a paint border, and what the mounting kit should include.",
    date: '2026-10-22',
    updated: "2026-10-29",
    readMinutes: 2,
    category: 'Specification',
    cover: 'assets/images/catalog/models/302d8689a5dde176.webp',
    coverAlt: 'White FAHINT BS1803-G decorator wallplate with a screwless front and rectangular device opening.',
    coverCaption: 'BS1803-G screwless decorator wallplate. Check the full assembly and dimensions with the intended device.',
    coverSource: 'Existing FAHINT BS1803-G product-library photograph: catalog/models/302d8689a5dde176.webp',
    coverFit: 'contain',
    coverWidth: 800,
    coverHeight: 800,
    sources: [
      { label: 'ENERLITES: two-piece screwless decorator wallplate', href: 'https://enerlites.com/products/screwless-decorator-gfci-two-gang-wall-plate' },
      { label: 'FAHINT BS1801 dimensions', href: '/products/wallplates/bs1801' },
      { label: 'FAHINT BS1802 dimensions', href: '/products/wallplates/bs1802' },
      { label: 'FAHINT BS1803-G specifications', href: '/products/wallplates/bs1803-g' },
      { label: 'FAHINT wallplate catalog, pages 27 to 28', href: '/assets/documents/fahint-product-catalog.pdf#page=27' }
    ],
    body: [
      {
        "type": "p",
        "text": "Screw-fixed wallplates show the fixing screws on the front. Screwless plates conceal them behind the face. Many use a separate mounting piece and clip-on cover, such as the two-piece ENERLITES decorator kit.",
        "source": 0
      },
      {
        "type": "h2",
        "text": "Check how much wall the replacement will cover"
      },
      {
        "type": "table",
        "caption": "FAHINT one-gang decorator plate examples",
        "columns": [
          "Model",
          "Fixing style",
          "Outside width × height"
        ],
        "rows": [
          [
            {
              "label": "BS1801",
              "href": "/products/wallplates/bs1801"
            },
            "Screw fixed, standard size",
            "70 × 115 mm"
          ],
          [
            {
              "label": "BS1802",
              "href": "/products/wallplates/bs1802"
            },
            "Screw fixed, medium size",
            "80 × 124 mm"
          ],
          [
            {
              "label": "BS1803-G",
              "href": "/products/wallplates/bs1803-g"
            },
            "Screwless, glossy",
            "75 × 120 mm"
          ],
          [
            {
              "label": "BS1803-M",
              "href": "/products/wallplates/bs1803-m"
            },
            "Screwless, matte",
            "75 × 120 mm"
          ]
        ]
      },
      {
        "type": "p",
        "text": "These are exterior dimensions. Replacing an 80 × 124 mm BS1802 with a 75 × 120 mm BS1803 reduces coverage by 5 mm in width and 4 mm in height. That can expose the border of the old paint or wallpaper.",
        "source": 4
      },
      {
        "type": "p",
        "text": "Measure the area that needs covering and check the condition of the wall. A larger plate is not a repair for an installation defect. BS1802 remains a one-gang plate despite its larger outer size."
      },
      {
        "type": "h2",
        "text": "Compare the complete plate and device"
      },
      {
        "type": "p",
        "text": "The opening must match the device: rectangular for a decorator face, shaped duplex openings for a traditional receptacle, or a toggle opening for a toggle switch."
      },
      {
        "type": "p",
        "text": "Review an assembled sample from the front and side. Check the gap around the device, how evenly the cover sits, and its sheen under the room lighting. Covers and mounting pieces from different brands may not fit together."
      },
      {
        "type": "p",
        "text": "BS1803-G is glossy and BS1803-M is matte. Keep the suffix and approved device/plate pairing in the order record."
      },
      {
        "type": "h2",
        "text": "Include the mounting kit in the price"
      },
      {
        "type": "p",
        "text": "State the faceplate, mounting piece and fixing hardware required in the pack. For spare covers, specify the exact model and finish and confirm whether that part is sold separately. Use the manufacturer’s removal instructions for service."
      },
      {
        "type": "p",
        "text": "An order description could read “BS1803-M, one-gang decorator opening, matte white, complete mounting assembly,” followed by quantity. The wallplate guide covers other opening patterns and gang counts.",
        "links": [
          {
            "label": "Wallplate opening and size guide",
            "href": "/blog/wallplate-buying-guide"
          },
          {
            "label": "View wallplate models",
            "href": "/products/wallplates"
          }
        ]
      },
      {
        "type": "h2",
        "text": "When screwless is the wrong upgrade"
      },
      {
        "type": "p",
        "text": "Screwless plates are the better finish on a new wall and the worse choice on a patched one. The plate sits flush, which is the whole point, and flush means any wobble in the drywall around the opening shows as a shadow at one edge. A screw-fixed plate with a slightly larger exterior covers the same defect without trying to hide it."
      },
      {
        "type": "p",
        "text": "The screwless range here is BS18032, BS18033 and BS18034, with the fixing handled by a backplate rather than two visible screws. That backplate needs clearance behind it, and an old steel box with a tight plaster lip is exactly where it will not seat. Check the depth before promising the finish."
      },
      {
        "type": "p",
        "text": "Exterior size is the second decision. The standard plates run around 75 × 120 mm and the medium screw-fixed plates around 80 × 124 mm; the difference is what closes a gap left by the previous plate. If the wall already carries a painted outline, measure it before choosing."
      },
      {
        "type": "p",
        "text": "Both decisions belong on a sample rather than a spec sheet. Ask for the device and the plate together, photograph the wall they will go onto, and approve the pair. A plate approved on its own is a plate that gets rejected on site."
      }
    ]
  }
];
