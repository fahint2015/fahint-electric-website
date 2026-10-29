// Primary industry references explain terms; FAHINT records supply model specifications.
export const receptacleBuyingGuide = {
  slug: 'standard-receptacle-buying-guide',
  title: 'Standard receptacle buying guide: ratings, TR/WR and wiring',
  excerpt: "Choose FAHINT receptacles by rating, NEMA configuration, TR/WR features and terminal type. Compare model options and the scope of supplied certificates.",
  date: '2026-10-07',
  updated: "2026-10-29",
  readMinutes: 4,
  category: 'Buying Guide',
  cover: 'assets/images/lines/receptacle-series-desk-power-v1.webp',
  coverAlt: 'A white duplex receptacle beside a desk lamp on a blue wall in an illustrated room.',
  coverCaption: 'Illustrated receptacle setting. Use the exact model documents to confirm ratings, terminals and installation requirements.',
  coverSource: 'Existing FAHINT receptacle illustration: lines/receptacle-series-desk-power-v1.webp',
  coverWidth: 1920,
  coverHeight: 450,
  sources: [
    {
      label: 'Legrand: residential outlet selection guide (industry reference)',
      href: 'https://www.legrand.us/faq/residential-outlets'
    },
    {
      label: 'Leviton: straight-blade receptacles and NEMA configurations (industry reference)',
      href: 'https://leviton.com/products/commercial/straight-blade-receptacles'
    },
    {
      label: 'Leviton: back wiring and side wiring (industry reference)',
      href: 'https://leviton.com/support/literature/blogs/back-wiring-vs-side-wiring'
    },
    {
      label: 'Leviton: tamper-resistant shutter function (industry reference)',
      href: 'https://leviton.com/support/resources/infographics/tamper-resistant'
    },
    {
      label: 'FAHINT standard receptacle models and original specification references',
      href: '/products/receptacles'
    },
    {
      label: 'FAHINT catalog (PDF pages 15-18) and original receptacle certificate',
      href: '/resources?family=receptacles'
    },
    {
      label: 'Leviton 5325-GY: terminal-specific conductor requirements (industry reference)',
      href: 'https://leviton.com/products/5325-gy'
    }
  ],
  body: [
    {
      "type": "p",
      "text": "Choose a receptacle by its electrical rating, plug configuration and required protection features. Then select the terminal type and matching wallplate. Our model designations keep those choices separate."
    },
    {
      "type": "h2",
      "text": "Start with the rating and plug configuration"
    },
    {
      "type": "p",
      "text": "A NEMA designation identifies the plug and receptacle configuration. Record it alongside current and voltage in the purchasing brief.",
      "source": 1
    },
    {
      "type": "p",
      "text": "D15 is listed as 15A, 125V AC, NEMA 5-15R; D20 is 20A, 125V AC, NEMA 5-20R. The project electrician must match the selection to the circuit and equipment. A higher face rating alone is not an upgrade for an existing installation."
    },
    {
      "type": "p",
      "text": "The industrial catalog range lists CR15 at 15A, 125V/250V, and CR20 and CD20 at 20A, 125V/250V. All three use side/back wiring. Review their exact plug configurations separately from the 125V models below.",
      "links": [
        {
          "label": "Review CR15 references",
          "href": "/products/receptacles/cr15"
        },
        {
          "label": "Review CR20 references",
          "href": "/products/receptacles/cr20"
        },
        {
          "label": "Review CD20 specifications",
          "href": "/products/receptacles/cd20"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Compare the required features"
    },
    {
      "type": "p",
      "text": "TR means tamper-resistant: internal shutters restrict access to the contacts by foreign objects.",
      "source": 3
    },
    {
      "type": "p",
      "text": "WR means weather-resistant. The cover and enclosure must also suit the location, including protection while a plug remains inserted where required.",
      "source": 0
    },
    {
      "type": "p",
      "text": "TR and WR do not provide GFCI protection. The standard receptacles here have no integral GFCI function; the project team must specify how any required ground-fault protection will be provided.",
      "links": [
        {
          "label": "Compare FAHINT GFCI models",
          "href": "/products/gfci"
        },
        {
          "label": "Read about weather-resistant devices and covers",
          "href": "/blog/nec-406-8-weather-resistant-receptacles"
        }
      ]
    },
    {
      "type": "p",
      "text": "D/DT/DW models have decorator faces; R/RT/RW have traditional duplex faces. DT and RT add TR; DW and RW combine TR with WR. The table shows selected catalog models.",
      "links": [
        {
          "label": "Browse all standard receptacle models",
          "href": "/products/receptacles"
        }
      ]
    },
    {
      "type": "table",
      "caption": "FAHINT 125V receptacle comparison",
      "columns": [
        "Model",
        "Face / protection features",
        "Published rating",
        "Terminals"
      ],
      "rows": [
        [
          {
            "label": "D15",
            "href": "/products/receptacles/d15"
          },
          "Decorator / non-TR, non-WR",
          "15A, 125V AC",
          "Side / back wire"
        ],
        [
          {
            "label": "D15Q",
            "href": "/products/receptacles/d15q"
          },
          "Decorator / non-TR, non-WR",
          "15A, 125V AC",
          "Side / push-in quick wire"
        ],
        [
          {
            "label": "D20",
            "href": "/products/receptacles/d20"
          },
          "Decorator / non-TR, non-WR",
          "20A, 125V AC",
          "Side / back wire"
        ],
        [
          {
            "label": "DT15",
            "href": "/products/receptacles/dt15"
          },
          "Decorator / TR",
          "15A, 125V AC",
          "Side / back wire"
        ],
        [
          {
            "label": "DW20",
            "href": "/products/receptacles/dw20"
          },
          "Decorator / TR + WR",
          "20A, 125V AC",
          "Side / back wire"
        ],
        [
          {
            "label": "R15",
            "href": "/products/receptacles/r15"
          },
          "Duplex / non-TR, non-WR",
          "15A, 125V AC",
          "Side / back wire"
        ],
        [
          {
            "label": "R15Q",
            "href": "/products/receptacles/r15q"
          },
          "Duplex / non-TR, non-WR",
          "15A, 125V AC",
          "Side / push-in quick wire"
        ],
        [
          {
            "label": "RT20",
            "href": "/products/receptacles/rt20"
          },
          "Duplex / TR",
          "20A, 125V AC",
          "Side / back wire"
        ],
        [
          {
            "label": "RW20",
            "href": "/products/receptacles/rw20"
          },
          "Duplex / TR + WR",
          "20A, 125V AC",
          "Side / back wire"
        ],
        [
          {
            "label": "CT15",
            "href": "/products/receptacles/rt15-c"
          },
          "Commercial duplex / TR",
          "15A, 125V AC",
          "Side / back wire"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Read the terminal specification"
    },
    {
      "type": "p",
      "text": "In Leviton’s explanation, screw-clamp back wiring uses a screw-operated clamp; side wiring uses a side screw terminal. These terms describe connection methods, with permitted conductors set by each model’s instructions.",
      "source": 2
    },
    {
      "type": "p",
      "text": "For R15 and R15Q, the Q identifies side/push-in quick wiring; R15 uses side/back wiring. Catalog page 18 marks the 15A push-in terminal “#14 AWG Only”. Check conductor material, solid or stranded suitability, strip length and torque for the selected terminal."
    },
    {
      "type": "p",
      "text": "Leviton’s 5325 lists its side terminals and Quickwire terminals separately. Its values are not installation specifications for FAHINT; request the limits for the exact FAHINT terminal.",
      "source": 6
    },
    {
      "type": "h2",
      "text": "Pair the device and wallplate"
    },
    {
      "type": "p",
      "text": "A traditional duplex plate has two shaped openings; a decorator plate has one rectangular opening. Check the device and plate together, including the outer dimensions and mounting fit."
    },
    {
      "type": "p",
      "text": "Compare color and sheen under the project lighting. Record the plate model and whether it is packed with the receptacle or supplied separately.",
      "links": [
        {
          "label": "Read the wallplate buying guide",
          "href": "/blog/wallplate-buying-guide"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Check the certificate’s model list"
    },
    {
      "type": "p",
      "text": "The supplied December 13, 2021 report E498095-20211123 names 18 receptacle models: D15, D15Q, D20, DT15, DT15Q, DT20, DW15, DW15Q, DW20, R15, R15Q, R20, RT15, RT15Q, RT20, RW15, RW15Q and RW20. Its US and Canadian lists are on PDF pages 2 and 4."
    },
    {
      "type": "p",
      "text": "C/CT/CW models, CR15, CR20 and CD20 are outside that addendum. Request their corresponding records and confirm current listing status. A missing PDF in this library does not mean a model is uncertified."
    },
    {
      "type": "p",
      "text": "Use C15/C15Q/C20 for the commercial standard range, CT15/CT15Q/CT20 for TR, and CW15/CW15Q/CW20 for TR/WR. Keep the complete designation, including Q where applicable, when matching the order to its documents."
    },
    {
      "type": "p",
      "text": "R15, R15Q and R20 link to a shared receptacle range drawing showing 33.2 mm width, 106 mm overall height and 23.8 mm depth. Use it as a dimensional reference; the exact model’s approved drawing remains necessary for fit and feature confirmation.",
      "links": [
        {
          "label": "Review receptacle product documents",
          "href": "/resources?family=receptacles"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Send one line per configuration"
    },
    {
      "type": "list",
      "label": "Receptacle quotation checklist",
      "items": [
        "Full model designation, quantity and any Q suffix.",
        "Current, voltage and NEMA configuration.",
        "TR, WR and the separate GFCI protection requirement.",
        "Terminal type and conductor requirements from the project team.",
        "Finish, wallplate model and approved sample reference.",
        "Destination, delivery date, pack contents and authorized artwork.",
        "Current model documents and approved drawings."
      ]
    },
    {
      "type": "p",
      "text": "A model-page inquiry carries its model number into the form. Include any unresolved rating or document question so it can be addressed with the quotation."
    }
  ]
};
