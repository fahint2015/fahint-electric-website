// Protocol terminology comes from the linked industry source; model facts come from FAHINT records.
export const smartSwitchBuyingGuide = {
  slug: 'smart-switch-buying-guide-wifi-zigbee',
  title: 'Smart Switch Buying Guide: Wi-Fi, Zigbee and Wiring',
  excerpt: "Compare FAHINT touch, Wi-Fi and Zigbee configurations. Match the model to the wiring, connected system, load function and wall-box dimensions.",
  date: '2026-10-18',
  updated: "2026-10-29",
  readMinutes: 4,
  category: 'Buying Guide',
  cover: 'assets/images/lines/smart-series-bedside-touch-v1.webp',
  coverAlt: 'Illustrated black glass touch control on a wood wall beside a bed and reading light.',
  coverCaption: 'Illustrated bedside control setting. The panel image does not identify a specific protocol, wiring version or compatible lighting load.',
  coverSource: 'Existing FAHINT smart-control illustration: lines/smart-series-bedside-touch-v1.webp',
  coverWidth: 1920,
  coverHeight: 450,
  sources: [
    { label: 'Connectivity Standards Alliance: Zigbee overview (industry reference)', href: 'https://csa-iot.org/all-solutions/zigbee/' },
    { label: 'FAHINT smart switch models and original specification references', href: '/products/smart-switches' },
    { label: 'FAHINT catalog and smart-control documents: PDF pages 19–24', href: '/resources?family=smart-switches' }
  ],
  body: [
    {
      "type": "p",
      "text": "Choose the control function and the system that will operate it, then match the switch to the wiring and wall box. FAHINT offers touch-only, Wi-Fi and Zigbee configurations; each needs a different sample brief."
    },
    {
      "type": "h2",
      "text": "Choose the control mode"
    },
    {
      "type": "table",
      "caption": "Control mode and the questions it leaves open",
      "columns": [
        "Control mode",
        "What the selection means",
        "What to establish with the sample"
      ],
      "rows": [
        [
          "Touch only",
          "A local touch control; network functions are not stated for the touch-only configuration.",
          "Required switching function, load compatibility and local operation"
        ],
        [
          "Wi-Fi + touch",
          "A Wi-Fi control configuration as well as a touch interface.",
          "Supported network, exact app, account setup, remote features and behavior if connectivity is lost"
        ],
        [
          "Zigbee + touch",
          "A Zigbee control configuration as well as a touch interface.",
          "The intended coordinator or gateway, app and required functions with that system"
        ]
      ]
    },
    {
      "type": "p",
      "text": "Zigbee is a low-power mesh networking protocol, as described by the Connectivity Standards Alliance. Compatibility still depends on the switch, gateway and requested features. Name the intended system in the inquiry.",
      "source": 0
    },
    {
      "type": "p",
      "text": "For several rooms, decide who will set up accounts and maintain access. Local switching, scheduling and remote operation should each be demonstrated if they are part of the requirement."
    },
    {
      "type": "h2",
      "text": "Match the complete model to the wiring"
    },
    {
      "type": "p",
      "text": "USW8811 requires neutral and live conductors; USW8811-S is the single-live version. Their similar appearance makes the suffix important on the order and sample label. The examples below all specify 50/60Hz operation."
    },
    {
      "type": "table",
      "caption": "FAHINT one-gang touch and connected switch examples",
      "columns": [
        "Model",
        "Control / face format",
        "Published supply",
        "Wiring requirement"
      ],
      "rows": [
        [
          {
            "label": "UST8811",
            "href": "/products/smart-switches/ust8811"
          },
          "Touch only / US glass panel",
          "110–240V AC · 50/60Hz",
          "Single live wire"
        ],
        [
          {
            "label": "USW8811",
            "href": "/products/smart-switches/usw8811"
          },
          "Wi-Fi + touch / US glass panel",
          "90–250V AC · 50/60Hz",
          "Neutral required (N + L)"
        ],
        [
          {
            "label": "USW8811-S",
            "href": "/products/smart-switches/usw8811-s"
          },
          "Wi-Fi + touch / US glass panel",
          "110–240V AC · 50/60Hz",
          "Single live wire"
        ],
        [
          {
            "label": "EUZ8811C",
            "href": "/products/smart-switches/euz8811c"
          },
          "Zigbee + touch / EU glass panel",
          "160–240V AC · 50/60Hz",
          "Single-live or neutral + live (L / N + L)"
        ]
      ]
    },
    {
      "type": "p",
      "text": "US and EU identify catalog face formats, not destination-market approval or wall-box fit. Have the electrician confirm the available conductors and review the exact model diagram, minimum-load requirements and any bypass accessory."
    },
    {
      "type": "h2",
      "text": "Select the load function and physical fit"
    },
    {
      "type": "p",
      "text": "The table covers switching. Dimming, curtain motors, fans and heaters need controls approved for their function and load. Send the lamp, driver or motor model with its electrical rating."
    },
    {
      "type": "p",
      "text": "A maximum wattage alone cannot establish compatibility with an LED driver or motor. Review the permitted load type and evaluate the intended equipment with the selected control.",
      "links": [
        {
          "label": "Review LED and 0–10V dimmer selection",
          "href": "/blog/dimmer-buying-guide-led-0-10v"
        }
      ]
    },
    {
      "type": "p",
      "text": "Use the exact rear-housing drawing and mounting details to check wall-box space. The catalog includes different body versions behind similar glass panels."
    },
    {
      "type": "p",
      "text": "USW8841-Z has four controlled outputs in a US-format Zigbee touch panel. Its four-gang description refers to those outputs, not the size of the wall box.",
      "links": [
        {
          "label": "USW8841-Z · four-gang Zigbee wall switch",
          "href": "/products/smart-switches/usw8841-z"
        }
      ]
    },
    {
      "type": "h2",
      "text": "Evaluate the intended system"
    },
    {
      "type": "p",
      "text": "Record the switch, app version, gateway or coordinator, network and connected load with the sample. A useful acceptance check includes:"
    },
    {
      "type": "list",
      "label": "Smart control sample evaluation",
      "items": [
        "Local operation and every requested app or remote function.",
        "Pairing, reset, account handover and re-pairing.",
        "Recovery after power loss and behavior without connectivity.",
        "Load performance assessed by a qualified professional.",
        "User access and removal or transfer of access for shared premises.",
        "The accepted hardware, software and accessories."
      ]
    },
    {
      "type": "p",
      "text": "Keep this record for repeat orders. Changes to firmware, the gateway or the connected load may require another compatibility review."
    },
    {
      "type": "h2",
      "text": "Prepare the quotation brief"
    },
    {
      "type": "list",
      "label": "Smart switch quotation checklist",
      "items": [
        "Complete model, suffix, quantity and destination market.",
        "Control function, number of outputs and intended load.",
        "Supply voltage, wiring arrangement and approved body drawing.",
        "Protocol, app, gateway and required features.",
        "Panel finish, accessories, pack contents and authorized artwork.",
        "Required documents, sample acceptance criteria and delivery date."
      ]
    },
    {
      "type": "p",
      "text": "If the wiring or connected system is still undecided, send those requirements with the inquiry. We can review the configuration before confirming samples and order timing.",
      "links": [
        {
          "label": "Browse smart switch configurations",
          "href": "/products/smart-switches"
        },
        {
          "label": "Discuss your smart control requirements",
          "href": "/contact?topic=technical"
        }
      ]
    },
    {
      "type": "h2",
      "text": "What each control mode needs beside it"
    },
    {
      "type": "p",
      "text": "The letters in the model designation tell you how the device talks to the rest of the room. Wi-Fi models (the USW and EUW ranges) join the site network directly and need nothing else to switch. Zigbee models (USZ and EUZ) need a compatible gateway on site, and a gateway is a separate purchase that belongs on the same quotation. Touch-only panels carry no radio at all: they switch, they do not appear in an app, and no gateway makes them do so."
    },
    {
      "type": "p",
      "text": "Wiring is a second, independent axis. Neutral-required, single-live and dual-wiring versions are separate catalogue configurations, not options on one board. A wiring diagram from one configuration does not transfer to another, and a project that changes its mind after sample approval has to reopen the sample."
    },
    {
      "type": "p",
      "text": "Gang count is the third. A US 4-gang panel is one device controlling four circuits in one frame; it is not four devices. Retail buyers confuse the two because the box looks the same. Match the gang count to the plate opening and the frame, then check the finish across the whole bank of panels on the same wall."
    },
    {
      "type": "p",
      "text": "When a requirements note arrives, we look for protocol, function (switching, dimming, curtain, fan or heater), neutral availability, US or EU format, gang count and the load behind each gang. Those six answers decide the model; the app, gateway and frame are then quoted as separate lines so nothing is assumed."
    }
  ]
};
