// Application planning complements the model-specific guides; it does not set installation requirements.
export const roomOutletPlanningGuide = {
  slug: 'outlet-planning-by-room',
  title: 'Outlet Planning for Homes, Offices and Guest Rooms',
  excerpt: "Build a room-by-room outlet schedule for homes, offices and guest rooms. Match charging, AC power, protection features and wallplates to each location.",
  date: '2026-10-18',
  updated: "2026-10-29",
  readMinutes: 3,
  category: 'Buying Guide',
  cover: 'assets/images/brand-home/generated/application-residential-scene.webp',
  coverAlt: 'Illustrated kitchen and dining area with a central island, blue cabinets and daylight.',
  coverCaption: 'Illustrated residential setting. The room image is a planning reference, not an electrical layout or an installed-project record.',
  coverSource: 'Existing FAHINT application illustration: brand-home/generated/application-residential-scene.webp',
  coverWidth: 1536,
  coverHeight: 1024,
  sources: [
    { label: 'ESFI: ground fault circuit interrupters (industry reference)', href: 'https://www.esfi.org/ground-fault-circuit-interrupters-gfci/' },
    { label: 'FAHINT application environments', href: '/applications' },
    { label: 'FAHINT USB outlet model specifications', href: '/products/usb-outlets' },
    { label: 'FAHINT standard receptacle model specifications', href: '/products/receptacles' },
    { label: 'FAHINT product catalog and original documents', href: '/resources' }
  ],
  body: [
    {
      "type": "p",
      "text": "Plan outlets around what people will use at each location. A bedside may need phone charging, while an office desk also needs power for a monitor and laptop supply. Put those uses beside the electrical requirements supplied by the project team."
    },
    {
      "type": "h2",
      "text": "Create a schedule by location"
    },
    {
      "type": "p",
      "text": "Give each connection point an identifier, such as Bedroom B-02. Record the equipment, required rating, protection features and finish on that line. Quantities can then follow the approved room layout."
    },
    {
      "type": "table",
      "caption": "Questions to resolve for each application",
      "columns": [
        "Location",
        "Start with this question",
        "Product family to review",
        "Detail to settle before ordering"
      ],
      "rows": [
        [
          "Kitchen or utility area",
          "What equipment is served, and what protection does the project require?",
          {
            "label": "GFCI outlets",
            "href": "/products/gfci"
          },
          "Required circuit protection, face rating and any TR / WR features"
        ],
        [
          "Bedroom or guest-room bedside",
          "Which devices need charging, and how many will connect at once?",
          {
            "label": "USB outlets",
            "href": "/products/usb-outlets"
          },
          "Port mix, charging profiles and simultaneous-port output"
        ],
        [
          "Office desk or meeting space",
          "Which loads need AC power, and which can use USB?",
          {
            "label": "Standard receptacles",
            "href": "/products/receptacles"
          },
          "Current, voltage, plug configuration and terminal type"
        ],
        [
          "A room with several device types",
          "Will the receptacles and controls share a consistent finish?",
          {
            "label": "Wallplates",
            "href": "/products/wallplates"
          },
          "Opening, gang count, dimensions, finish and pack contents"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Specify bedside charging and desk power"
    },
    {
      "type": "p",
      "text": "For mixed USB-A and USB-C charging, FTR15C-3100 provides a combined 5V, 3.1A output without PD. FTR15QC-DC20W is a dual USB-C PD option with a published single-port maximum of 20W. Match the port arrangement and charging profiles to the intended devices.",
      "links": [
        {
          "label": "FTR15C-3100 model details",
          "href": "/products/usb-outlets/ftr15c-3100"
        },
        {
          "label": "FTR15QC-DC20W model details",
          "href": "/products/usb-outlets/ftr15qc-dc20w"
        }
      ]
    },
    {
      "type": "p",
      "text": "Where two devices will charge together, request simultaneous-port output and include both devices and cables in the sample review. The single-port maximum does not establish shared output.",
      "links": [
        {
          "label": "Compare USB configurations and PD profiles",
          "href": "/blog/usb-wall-outlet-buying-guide"
        }
      ]
    },
    {
      "type": "p",
      "text": "At a desk, list the monitor, laptop supply and task light as AC loads. An integrated USB-C port can replace a laptop supply only when the laptop’s charging requirements are met. For shared workspaces, account for users bringing different devices and cables."
    },
    {
      "type": "h2",
      "text": "Record protection and lighting controls separately"
    },
    {
      "type": "p",
      "text": "GFCI protection helps address electric-shock hazards from ground faults. The project electrician should specify the protection required at each location under the locally adopted code.",
      "source": 0
    },
    {
      "type": "p",
      "text": "Keep GFCI, tamper resistance and weather resistance as separate fields from USB charging. A charging feature cannot replace a required protection feature.",
      "links": [
        {
          "label": "Compare GFCI and AFCI functions",
          "href": "/blog/gfci-vs-afci-whats-the-difference"
        },
        {
          "label": "Review TR, WR and receptacle ratings",
          "href": "/blog/standard-receptacle-buying-guide"
        }
      ]
    },
    {
      "type": "p",
      "text": "For connected lighting, record the control function, wiring version and intended app or building system. Include who will operate and maintain the controls in a guest room or shared property.",
      "links": [
        {
          "label": "Read the smart switch buying guide",
          "href": "/blog/smart-switch-buying-guide-wifi-zigbee"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Approve the complete room package"
    },
    {
      "type": "p",
      "text": "Pair each outlet and switch with its wallplate model. Compare openings, finish and fit on the assembled sample, and state whether the plate is packed with the device or separately.",
      "links": [
        {
          "label": "Check wallplate openings and finishes",
          "href": "/blog/wallplate-buying-guide"
        }
      ]
    },
    {
      "type": "p",
      "text": "Before repeating a room package, have the project team verify the electrical choices and review the charging and control functions. Keep model numbers, document revisions and accepted results against the location identifiers. Recheck the affected fields if a substitute is proposed."
    },
    {
      "type": "h2",
      "text": "Send the schedule for quotation"
    },
    {
      "type": "list",
      "label": "Room-by-room purchasing checklist",
      "items": [
        "Project destination, room types and location identifiers.",
        "Model and quantity per location, electrical ratings and required protection features.",
        "Charging devices, cables and simultaneous-use requirements.",
        "Control function, wiring version and connected system.",
        "Device finish, wallplate, pack contents and approved sample references.",
        "Required documents, spare units, packaging and requested delivery date."
      ]
    },
    {
      "type": "p",
      "text": "Send the schedule with any open selections marked. FAHINT can review the model combinations and confirm sample arrangements, minimum quantities and timing for the order.",
      "links": [
        {
          "label": "Discuss your room schedule",
          "href": "/contact?topic=technical"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Turning the room schedule into order lines"
    },
    {
      "type": "p",
      "text": "A schedule only becomes useful when each location turns into one order line, and every line carries the same five fields: device model, finish, wallplate, quantity and destination. Anything left outside those fields — \"white outlets for the guest floors\" — gets resolved by whoever is quoting, which is rarely the person who owns the design."
    },
    {
      "type": "p",
      "text": "Hotel work repeats. Fifty guest rooms usually carry the same package, so the schedule collapses into one line with a quantity of fifty and a sample approved once for the room type. Office fit-outs run the other way: meeting rooms, focus rooms and open desks differ by zone, and a schedule that repeats one line across a floor will be wrong in at least one zone."
    },
    {
      "type": "list",
      "label": "What makes a line unambiguous",
      "items": [
        "One line per device configuration, not one line per room",
        "The wallplate written on the same line as the device it fits",
        "Finish named by the catalogue term, not by an impression of the colour",
        "Destination and pack format, because both change the packing cost",
        "Sample reference and approval date, so a reorder can be checked against them"
      ]
    },
    {
      "type": "p",
      "text": "Approve the sample per room type rather than per order. A guest bathroom and a hotel desk take different devices, and one approved sample cannot stand in for both. We ask for the room type, the sample reference and the quantity when a schedule arrives, and return a quotation that keeps the lines separate."
    }
  ]
};
