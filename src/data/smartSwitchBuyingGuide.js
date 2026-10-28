// Protocol terminology comes from the linked industry source; model facts come from FAHINT records.
export const smartSwitchBuyingGuide = {
  slug: 'smart-switch-buying-guide-wifi-zigbee',
  title: 'Smart Switch Buying Guide: Wi-Fi, Zigbee and Wiring',
  excerpt: 'Compare FAHINT touch, Wi-Fi and Zigbee switches by wiring version, control function, supply rating and format. Prepare a model-specific sample and order brief.',
  date: '2026-10-18',
  updated: '2026-10-28',
  readMinutes: 5,
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
      type: 'p',
      text: 'FAHINT USW8811 and USW8811-S are both US-format, one-gang Wi-Fi touch switches. Their wiring requirements differ: USW8811 requires neutral and live conductors, while USW8811-S is listed as a single-live version. Dropping the suffix from an order can therefore change a condition the installer depends on.'
    },
    {
      type: 'p',
      text: 'Use the complete model number to connect five decisions: control mode, wiring arrangement, load function, supply rating and physical format. Then validate the selected model with the intended connected system. This guide explains the purchasing decisions without substituting for the model’s installation instructions.'
    },
    { type: 'h2', text: 'Choose touch-only, Wi-Fi or Zigbee deliberately' },
    {
      type: 'table',
      caption: 'Control mode and the questions it leaves open',
      columns: ['Control mode', 'What the selection means', 'What to establish with the sample'],
      rows: [
        ['Touch only', 'A local touch control; network functions are not stated for the touch-only configuration.', 'Required switching function, load compatibility and local operation'],
        ['Wi-Fi + touch', 'A Wi-Fi control configuration as well as a touch interface.', 'Supported network, exact app, account setup, remote features and behavior if connectivity is lost'],
        ['Zigbee + touch', 'A Zigbee control configuration as well as a touch interface.', 'The intended coordinator or gateway, app and required functions with that system']
      ]
    },
    {
      type: 'p',
      text: 'The Connectivity Standards Alliance describes Zigbee as a low-power mesh networking solution. That explains the protocol family; it does not establish that a particular FAHINT model works with every gateway or voice platform. Request the exact supported system and any necessary accessories for the model being quoted.',
      source: 0
    },
    {
      type: 'p',
      text: 'For a property with multiple rooms, decide who will set up and maintain the controls before choosing a protocol. A buyer’s brief should name the intended app or building system and the functions required, such as local switching or remote scheduling. Treat those functions as acceptance criteria until the selected configuration has been demonstrated.'
    },
    { type: 'h2', text: 'Compare the complete model and wiring version' },
    {
      type: 'p',
      text: 'These four one-gang switching examples come from FAHINT’s published model records. The US and EU labels describe the catalog face formats; they do not prove destination-market approval or interchangeable wall-box fit. All four list 50/60Hz operation, with different voltage ranges and wiring requirements.'
    },
    {
      type: 'table',
      caption: 'FAHINT one-gang touch and connected switch examples',
      columns: ['Model', 'Control / face format', 'Published supply', 'Wiring requirement'],
      rows: [
        [{ label: 'UST8811', href: '/products/smart-switches/ust8811' }, 'Touch only / US glass panel', '110–240V AC · 50/60Hz', 'Single live wire'],
        [{ label: 'USW8811', href: '/products/smart-switches/usw8811' }, 'Wi-Fi + touch / US glass panel', '90–250V AC · 50/60Hz', 'Neutral required (N + L)'],
        [{ label: 'USW8811-S', href: '/products/smart-switches/usw8811-s' }, 'Wi-Fi + touch / US glass panel', '110–240V AC · 50/60Hz', 'Single live wire'],
        [{ label: 'EUZ8811C', href: '/products/smart-switches/euz8811c' }, 'Zigbee + touch / EU glass panel', '160–240V AC · 50/60Hz', 'Single-live or neutral + live (L / N + L)']
      ]
    },
    {
      type: 'p',
      text: 'Have the qualified project team identify the available conductors and approved wiring arrangement. Do not infer neutral availability from the panel photograph or use one model’s diagram for another. For single-live and dual-wiring versions, obtain the exact instructions covering permitted loads, any minimum load and any required bypass accessory.'
    },
    { type: 'h2', text: 'Separate switching, dimming and motor control' },
    {
      type: 'p',
      text: 'The comparison above covers switching. A switch is not automatically a dimmer, curtain controller, fan controller or heater control. Start with the equipment manufacturer and model, the function you need and the supply requirements, then select the corresponding control configuration.'
    },
    {
      type: 'p',
      text: 'A catalog wattage alone is not enough to approve an LED driver or motor load. Ask which load type the figure applies to and obtain the applicable limits. Include the intended lamp, driver or motor in the sample evaluation; the load type and behavior matter as well as the total number of watts.',
      links: [{ label: 'Review LED and 0–10V dimmer selection', href: '/blog/dimmer-buying-guide-led-0-10v' }]
    },
    { type: 'h2', text: 'Check the face, rear housing and wall box together' },
    {
      type: 'p',
      text: 'The FAHINT catalog dimension sheets include different rear housings and base versions. Request the exact body drawing, mounting details and wall-box requirements for the ordered model. A shared glass-face appearance is not evidence of an identical rear housing.'
    },
    {
      type: 'p',
      text: 'USW8841-Z is a four-gang Zigbee touch switch in the US format. Here, four-gang describes the controlled outputs, not wall-box size. Confirm dimensions, finish, markings and accessories for the ordered model.',
      links: [{ label: 'USW8841-Z · four-gang Zigbee wall switch', href: '/products/smart-switches/usw8841-z' }]
    },
    { type: 'h2', text: 'Test the control in the intended connected system' },
    {
      type: 'p',
      text: 'Write a short acceptance record before requesting samples. Name the switch model, app and version, gateway or coordinator if applicable, network configuration and connected load. This gives the supplier and project team the same conditions to evaluate.'
    },
    {
      type: 'list',
      label: 'Smart control sample evaluation',
      items: [
        'Demonstrate local operation and each requested app or remote-control function.',
        'Check pairing, reset, account handover and re-pairing with the intended system.',
        'Observe recovery after power loss and the available control behavior when connectivity is lost.',
        'Have a qualified professional assess the intended load, including any low-load or dimming behavior relevant to the selected model.',
        'For guest rooms or shared premises, check who can access each control and how the operator removes or transfers access.',
        'Record the accepted hardware, software and accessory combination alongside the sample approval.'
      ]
    },
    {
      type: 'p',
      text: 'A successful demonstration with one combination is evidence for that combination. Keep the record when comparing alternatives or reordering, and review changes to the gateway, firmware, load or control version before assuming the same behavior.'
    },
    { type: 'h2', text: 'Send a model-specific quotation brief' },
    {
      type: 'list',
      label: 'Smart switch quotation checklist',
      items: [
        'Complete model designation, including suffix, quantity and destination market.',
        'Required control function, number of outputs and intended equipment or load.',
        'Supply voltage, project wiring arrangement and approved body or mounting drawing.',
        'Required protocol, app, gateway and features to demonstrate with the sample.',
        'Panel finish, markings, accessories, pack contents and authorized branding artwork.',
        'Required model documents, sample acceptance record and requested delivery date.'
      ]
    },
    {
      type: 'p',
      text: 'Use the exact model page to start an inquiry when your choice is settled. If the connected system or wiring version is still open, send the selection brief first so FAHINT can review the configuration and confirm sample availability, quantities and timing.',
      links: [
        { label: 'Browse smart switch configurations', href: '/products/smart-switches' },
        { label: 'Discuss your smart control requirements', href: '/contact?topic=technical' }
      ]
    }
  ]
};
