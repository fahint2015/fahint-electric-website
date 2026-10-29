// Buyer guide based on primary references and the published FAHINT dimmer records.
export const dimmerBuyingGuide = {
  "slug": "dimmer-buying-guide-led-0-10v",
  "title": "Dimmer Buying Guide: LED Loads and 0–10V Compatibility",
  "excerpt": "Compare DM2010 and the 0–10V DM2010S by supply, load type and driver requirements. Review the limits and sample checks for the intended lighting.",
  "date": "2026-10-04",
  "updated": "2026-10-29",
  "readMinutes": 3,
  "category": "Buying Guide",
  "cover": "assets/images/home-installations/dm2010-living-installed-v1.webp",
  "coverAlt": "A white slide dimmer beside a living-room doorway in an illustrated interior.",
  "coverCaption": "Illustrated dimmer application. The scene does not verify compatibility with a particular lamp or driver.",
  "coverSource": "Existing FAHINT application illustration — home-installations/dm2010-living-installed-v1.webp",
  "coverWidth": 1536,
  "coverHeight": 1024,
  "sources": [
    {
      "label": "Leviton — Dimmer Buying Guide (industry reference)",
      "href": "https://leviton.com/content/dam/leviton/residential/product_documents/none/leviton-dimmer-buying-guide.pdf"
    },
    {
      "label": "Leviton — 0–10V load requirements (industry reference)",
      "href": "https://leviton.com/support/resources/product-support/dimmers-and-switches/dimmers/what-loads-do-the-0-10v-dimmers-control"
    },
    {
      "label": "Lutron — Application Note 487: LED and CFL load limits (industry reference)",
      "href": "https://support.lutron.com/us/en/product/radiora3/article/system-design-setup/app-note-487-minimum-and-maximum-loads-for-led-and-cfl-lamps-fixtures"
    },
    {
      "label": "Legrand — Guide to LED Dimming Controls in the Home (industry reference)",
      "href": "https://www.legrand.us/ideas/blogs/residential-dimming-guide"
    },
    {
      "label": "FAHINT — DM2010 model specifications and drawings",
      "href": "/products/dimmers/dm2010"
    },
    {
      "label": "FAHINT — DM2010S model specifications and drawings",
      "href": "/products/dimmers/dm2010s"
    },
    {
      "label": "Eaton — DF10P switched-load and control-circuit ratings (industry reference)",
      "href": "https://www.eaton.com/content/dam/eaton/products/wiring-devices-and-connectivity/wiring-devices/dimmers/decorator-0-10v-dimmer-spec-sheet.pdf"
    },
    {
      "label": "Lutron — DVCLN-153P multi-gang load table (industry reference)",
      "href": "https://assets.lutron.com/a/documents/0302209.pdf"
    }
  ],
  "body": [
    {
      "type": "p",
      "text": "Use the lamp or driver specification to choose the dimmer. DM2010 is listed for dimmable LED/CFL and incandescent loads. DM2010S provides a 0–10V DC control signal for a compatible driver."
    },
    {
      "type": "h2",
      "text": "Compare DM2010 and DM2010S"
    },
    {
      "type": "table",
      "caption": "FAHINT dimmer model comparison",
      "columns": [
        "Model",
        "Supply and current",
        "Control / circuit",
        "Published load"
      ],
      "rows": [
        [
          {
            "label": "DM2010",
            "href": "/products/dimmers/dm2010"
          },
          "120V AC · 60Hz; 5A",
          "On/off slide dimmer; Single-pole / 3-way",
          "LED / CFL: 5–200W; Incandescent: 20–600W"
        ],
        [
          {
            "label": "DM2010S",
            "href": "/products/dimmers/dm2010s"
          },
          "120 / 277V AC · 60Hz; 5A at 120V AC · 2A at 277V AC",
          "On/off slide dimmer · 0–10V; Single-pole / 3-way",
          "600VA maximum; compatible 0–10V driver required"
        ]
      ]
    },
    {
      "type": "p",
      "text": "DM2010 has separate load ranges: 5–200W for LED/CFL and 20–600W for incandescent lamps. The 600W incandescent limit is not an LED rating."
    },
    {
      "type": "p",
      "text": "DM2010S is specified in VA, not as a 600W LED dimmer. It also has different current limits at 120V and 277V. Keep the full model designation, including S, on the inquiry."
    },
    {
      "type": "h2",
      "text": "Read the lamp and driver requirements"
    },
    {
      "type": "p",
      "text": "Record the lamp or fixture manufacturer, model and dimmable designation. Include a separate driver model where fitted. Leviton’s buying guide treats the lamp and dimmer as a pairing.",
      "source": 0
    },
    {
      "type": "p",
      "text": "A 0–10V driver needs a control designed for that signal. Match the specified control method before comparing wattage.",
      "source": 1
    },
    {
      "type": "p",
      "text": "DM2010’s model references do not specify a forward-phase or reverse-phase type. If the light source requires one of those methods, obtain that detail before selecting the dimmer."
    },
    {
      "type": "p",
      "text": "Calculate the load from actual input watts. “Equivalent wattage” describes brightness relative to incandescent lighting, so it is unsuitable for that calculation.",
      "source": 3
    },
    {
      "type": "p",
      "text": "Lamp behavior affects loading as well as total watts. Record the quantity per dimmer and use the exact model’s limits when approving a lamp combination.",
      "source": 2
    },
    {
      "type": "h2",
      "text": "Check driver count and the installation arrangement"
    },
    {
      "type": "p",
      "text": "DM2010S references do not publish the control-circuit current capacity or maximum driver count. Request both for a multi-driver installation."
    },
    {
      "type": "p",
      "text": "Eaton’s DF10P sheet separates the switched lighting load from the 0–10V control-circuit current. These describe different limits. Use the same distinction when requesting DM2010S data; the Eaton values apply to its own model.",
      "source": 6
    },
    {
      "type": "p",
      "text": "Both FAHINT models list single-pole / 3-way configurations. Have the electrician confirm the control locations, permitted companion arrangement, conductors and wall-box fit from the approved instructions."
    },
    {
      "type": "p",
      "text": "Lutron’s DVCLN-153P instructions vary limits by load type and gang count. They are not ratings for DM2010 or DM2010S. For a FAHINT installation, request the applicable limit for the planned side-by-side device arrangement.",
      "source": 7
    },
    {
      "type": "p",
      "text": "Include the matching wallplate, finish and pack contents. Check the ordered model’s certification documents separately from lamp compatibility.",
      "links": [
        {
          "label": "Review dimmer product documents",
          "href": "/resources?family=dimmers"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Agree on the sample checks"
    },
    {
      "type": "p",
      "text": "Use the intended lamp or driver and planned quantity. Assess startup, brightness changes, flicker, audible noise and switching from the required locations. Include the lowest usable light level for the room."
    },
    {
      "type": "p",
      "text": "Dimming range depends on the light source. Ask for stable operation at the required low level; the FAHINT references do not establish a universal minimum dimming percentage.",
      "source": 3
    },
    {
      "type": "p",
      "text": "These are proposed sample checks, not a report of tests already completed by FAHINT. Record the accepted combination and have electrical setup performed by qualified personnel."
    },
    {
      "type": "h2",
      "text": "Send the lighting specification"
    },
    {
      "type": "list",
      "label": "Dimmer quotation checklist",
      "items": [
        "Full dimmer model and quantity.",
        "Destination, supply voltage, frequency and control method.",
        "Lamp, fixture and driver models with data sheets.",
        "Load type, actual input power and quantity per dimmer.",
        "Control locations and multi-gang or mounting constraints.",
        "Finish, wallplate, pack contents and authorized artwork.",
        "Sample criteria, required documents and delivery date."
      ]
    },
    {
      "type": "p",
      "text": "Send unresolved compatibility questions with the inquiry so they can be addressed before sample approval.",
      "links": [
        {
          "label": "Browse FAHINT dimmer models",
          "href": "/products/dimmers"
        }
      ]
    }
  ]
};
