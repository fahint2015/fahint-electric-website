// Buyer guide based on the primary references and verified FAHINT model data.
export const usbBuyingGuide = {
  "slug": "usb-wall-outlet-buying-guide",
  "title": "USB Wall Outlet Buying Guide: Ports, PD and Power",
  "excerpt": "Compare FAHINT USB-A and USB-C outlets, PD profiles and shared-output limits. Select the charging configuration, AC rating and installation fit.",
  "date": "2026-10-04",
  "updated": "2026-10-29",
  "readMinutes": 4,
  "category": "Buying Guide",
  "cover": "assets/images/editorial-home/product-usb-optimized.webp",
  "coverAlt": "USB charging outlet beside a laptop on a desk in an illustrated interior",
  "coverCaption": "Illustrated USB charging setup. The scene is not a device-compatibility or charging-performance test.",
  "coverSource": "Existing FAHINT application illustration — editorial-home/product-usb-optimized.webp",
  "coverWidth": 1600,
  "coverHeight": 889,
  "sources": [
    {
      "label": "USB-IF — USB Type-C terminology and capabilities",
      "href": "https://www.usb.org/sites/default/files/usb_type-c_language_product_and_packaging_guidelines_20230320.pdf"
    },
    {
      "label": "Leviton — USB outlet comparison brochure (industry reference)",
      "href": "https://leviton.com/content/dam/leviton/residential/product_documents/brochure/USB_Brochure.pdf"
    },
    {
      "label": "Legrand — radiant 65W USB outlet specifications (industry reference)",
      "href": "https://www.legrand.us/wiring-devices/radiant-collection/radiant-65w-usb-outlet-type-c-15a-tamper-resistant-black/p/rd-r26usbpd65bk"
    },
    {
      "label": "Eaton — USB receptacle range (industry reference)",
      "href": "https://www.eaton.com/us/en-us/catalog/wiring-devices-and-connectivity/usb-receptacles.html"
    },
    {
      "label": "FAHINT — USB product-family documents",
      "href": "/resources?family=usb-outlets"
    }
  ],
  "body": [
    {
      "type": "p",
      "text": "Choose a USB wall outlet for the devices and cables that will use it. Record the required charging profiles and whether both ports will be occupied together. Keep the AC receptacle rating as a separate selection."
    },
    {
      "type": "h2",
      "text": "Choose the connector and charging capability"
    },
    {
      "type": "p",
      "text": "A USB-C connector does not by itself establish PD support. USB Power Delivery is a separate capability described by the available voltage and current profiles.",
      "source": 0
    },
    {
      "type": "p",
      "text": "FTR15C-3100 has USB-A and USB-C ports with a combined 3.1A output at 5V DC, without PD. FTR15-3100 provides the same combined output through two USB-A ports.",
      "links": [
        {
          "label": "Compare A + C configurations",
          "href": "/products/usb-outlets?ports=a-c"
        }
      ]
    },
    {
      "type": "p",
      "text": "Our dual USB-C PD options include FTR15QC-DC20W, FTR15QC-DC36W and FTR15QC-DC65W. Match their profiles to the phone, tablet or laptop manufacturer’s requirements and use suitably rated cables."
    },
    {
      "type": "h2",
      "text": "Compare the outlet configurations"
    },
    {
      "type": "p",
      "text": "FTR15QC-DC65W uses a 15A, 125V NEMA 5-15R receptacle; FTR20QC-DC65W uses a 20A, 125V NEMA 5-20R receptacle. Their USB-C single-port maximum is the same."
    },
    {
      "type": "p",
      "text": "F4P is a USB-only charger with four USB-A ports, a 125V / 60Hz input and a combined 5V DC, 4.2A, 21W output. It has no AC receptacle openings."
    },
    {
      "type": "table",
      "caption": "FAHINT USB outlet shortlist",
      "columns": [
        "Model",
        "USB ports",
        "AC rating / input",
        "Published USB output"
      ],
      "rows": [
        [
          {
            "label": "FTR15-3100",
            "href": "/products/usb-outlets/ftr15-3100"
          },
          "Dual USB-A",
          "15A,125V NEMA 5-15R",
          "3.1A, 5V DC combined"
        ],
        [
          {
            "label": "FTR15C-3100",
            "href": "/products/usb-outlets/ftr15c-3100"
          },
          "USB-A + USB-C",
          "15A,125V NEMA 5-15R",
          "3.1A, 5V DC combined"
        ],
        [
          {
            "label": "FTR15QC-DC20W",
            "href": "/products/usb-outlets/ftr15qc-dc20w"
          },
          "Dual USB-C",
          "15A,125V NEMA 5-15R",
          "USB-C up to 20W per port*"
        ],
        [
          {
            "label": "FTR15QC-DC36W",
            "href": "/products/usb-outlets/ftr15qc-dc36w"
          },
          "Dual USB-C",
          "15A,125V NEMA 5-15R",
          "USB-C up to 36W per port*"
        ],
        [
          {
            "label": "FTR15QC-DC65W",
            "href": "/products/usb-outlets/ftr15qc-dc65w"
          },
          "Dual USB-C",
          "15A,125V NEMA 5-15R",
          "USB-C up to 65W per port*"
        ],
        [
          {
            "label": "FTR20QC-DC65W",
            "href": "/products/usb-outlets/ftr20qc-dc65w"
          },
          "Dual USB-C",
          "20A,125V NEMA 5-20R",
          "USB-C up to 65W per port*"
        ],
        [
          {
            "label": "F4P",
            "href": "/products/usb-outlets/f4p"
          },
          "4 × USB-A",
          "125V 60Hz input; no AC receptacle",
          "5V DC · 4.2A · 21W combined"
        ]
      ]
    },
    {
      "type": "p",
      "text": "*PD figures are published single-port maximums. The table does not give simultaneous-port allocation or tested compatibility with specific devices."
    },
    {
      "type": "h2",
      "text": "Check what is available with two devices connected"
    },
    {
      "type": "p",
      "text": "Leviton lists single-port and combined power separately in its comparison brochure. Keep both figures in your charging specification.",
      "source": 1
    },
    {
      "type": "p",
      "text": "FTR15C-3100 lists 5V / 2.4A for USB-A and 5V / 3.0A for USB-C, with a 3.1A combined limit at 5V. The combined limit prevents both ports supplying their individual maximums together."
    },
    {
      "type": "p",
      "text": "For the FAHINT PD models here, simultaneous-port power sharing is not published in the current references. Request the allocation for the intended two-device use case and include it in the sample evaluation."
    },
    {
      "type": "p",
      "text": "For a laptop and phone used together, assess that pair with the specified cables. Charging performance depends on the accepted profiles and available power in that configuration.",
      "links": [
        {
          "label": "View 65W PD models",
          "href": "/products/usb-outlets?charging=pd-65w"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Compare 20W, 36W and 65W profiles"
    },
    {
      "type": "table",
      "caption": "Published single-port USB-C PD profiles",
      "columns": [
        "FAHINT model",
        "Single-port maximum",
        "Published voltage / current profiles"
      ],
      "rows": [
        [
          {
            "label": "FTR15QC-DC20W",
            "href": "/products/usb-outlets/ftr15qc-dc20w"
          },
          "Up to 20W",
          "5V / 3A · 9V / 2.22A · 12V / 1.67A"
        ],
        [
          {
            "label": "FTR15QC-DC36W",
            "href": "/products/usb-outlets/ftr15qc-dc36w"
          },
          "Up to 36W",
          "5V / 3A · 9V / 3A · 12V / 3A · 15V / 2.4A · 20V / 1.8A"
        ],
        [
          {
            "label": "FTR15QC-DC65W",
            "href": "/products/usb-outlets/ftr15qc-dc65w"
          },
          "Up to 65W",
          "5V / 3A · 9V / 3A · 12V / 3A · 15V / 3A · 20V / 3.25A"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Match a published voltage/current pair to the device’s charging specification. For a laptop, check the recommended power and review charging under its intended workload.",
      "links": [
        {
          "label": "Compare the 20W, 36W and 65W models",
          "href": "/products/usb-outlets?compare=FTR15QC-DC20W,FTR15QC-DC36W,FTR15QC-DC65W"
        }
      ]
    },
    {
      "type": "p",
      "text": "Use the USB range filters and comparison view to narrow the models, then add quantities and finishes to the inquiry list.",
      "links": [
        {
          "label": "Browse USB outlet models",
          "href": "/products/usb-outlets"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Check physical fit and model documents"
    },
    {
      "type": "p",
      "text": "Device depth and space for the wiring matter alongside the front dimensions. Eaton includes depth in its USB range information. Use the selected FAHINT model’s own drawing for the fit check.",
      "source": 3
    },
    {
      "type": "p",
      "text": "Specify the wallplate and pack contents too. Legrand’s 65W model illustrates how plate requirements form part of an outlet specification.",
      "source": 2
    },
    {
      "type": "p",
      "text": "Where a FAHINT drawing is unavailable, request it before approving the installation fit. The project electrician also needs to confirm required protection features and suitability for the location."
    },
    {
      "type": "p",
      "text": "Approve the device finish and wallplate together. Match the complete model to its product certificate and current listing status. ISO 9001 describes the quality management system, not a product listing.",
      "links": [
        {
          "label": "Review USB product documents",
          "href": "/resources?family=usb-outlets"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Send the charging brief"
    },
    {
      "type": "list",
      "label": "USB outlet quotation checklist",
      "items": [
        "Model numbers and quantities.",
        "Devices, cables, required profiles and simultaneous-use cases.",
        "AC receptacle rating and configuration, or USB-only requirement.",
        "Finish, wallplate and installation dimensions.",
        "Destination, model documents and sample checks.",
        "Pack format, authorized artwork and quantities by finish.",
        "Sample quantity, delivery date and unresolved power-sharing questions."
      ]
    },
    {
      "type": "p",
      "text": "We confirm samples, minimum quantities, customization and lead times in the quotation. Keep the accepted charging configuration with the approved sample and order.",
      "links": [
        {
          "label": "Review OEM wiring-device options",
          "href": "/capabilities#oem"
        },
        {
          "label": "Send your USB outlet sourcing brief",
          "href": "/contact?topic=oem"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Reading the FAHINT USB range as two families"
    },
    {
      "type": "p",
      "text": "The catalogue groups into two charging families, and the family decides what a distributor can promise. The 3100 mA models — FTR15-3100, FTR15C-3100, FTR20-3100 and their C variants — share 3.1 A at 5 V across both ports and carry no Power Delivery negotiation. The Power Delivery models, FTR15QC-DC20W, DC36W and DC65W, use dual USB-C and publish a single-port ceiling that differs between the three. Quoting a 65 W model as though it were a shared-output device is the most common error we see in inquiries."
    },
    {
      "type": "p",
      "text": "A connector is not a capability. A USB-C port on the shared-output family charges a laptop slowly or not at all; the same connector on the PD family charges only as far as the negotiated profile allows. Ask for the port type and the profile together, then check the combined limit with both ports occupied."
    },
    {
      "type": "p",
      "text": "Model-level documents matter here more than on other families. The USB range sits under report E498095, and that report names specific configurations. A family reference is not coverage for every port mix. When a buyer has to show a certificate to a retailer, confirm the exact model appears in the document before the order is placed."
    },
    {
      "type": "p",
      "text": "For a private-label program, the variables that move price and lead time are port mix, finish, wallplate and pack format — not the chip inside. Send those four with the quantity, and configurations can be compared on the same basis instead of one model quoted twice at different volumes."
    }
  ]
};
