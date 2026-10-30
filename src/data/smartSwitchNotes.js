// Model-specific notes for the smart-switch range.
// One paragraph per SKU, written from the published key facts.
// Rendered on the product page under "Choosing this model".

export const modelNotes = {
  UST8811: 'One gang, touch only, single live wire. The appeal is what it does not need: no neutral at the box, no gateway, no app, nothing to commission. A corridor, a workshop or a rental kitchen where the wiring predates smart controls is exactly the case this panel was built for.',
  UST8821: 'Two gangs on one panel, touch only. It reads as two switches because it controls two circuits, but it is one device occupying one box, so the load behind each gang has to be checked separately before the panel is specified.',
  UST8831: 'Three gangs, touch only, single live wire. A three-circuit wall in a room that has no neutral is the narrow case this covers; if any of the three circuits is a fan or a motor load, confirm the switching rating for that gang before ordering.',
  UST8832: 'One gang of dimming in a US-format glass panel, touch only, single live wire. The wiring suits a box with no neutral, which is what the catalogue specifies for this model. Dimming is where the load conversation starts: an LED that is not rated as dimmable behaves badly on any control, and a very low connected load can sit below the point where the dimmer regulates cleanly.',
  UST8833: 'Curtain control rather than switching: the panel drives a motor, so the deciding facts are the motor supply, its direction arrangement and the limit setting. It occupies one gang, and it is a different device from the three-gang light switch it sits next to in the catalogue. Ask for the model drawing with the quotation, because the wiring requirement is confirmed per order.',
  UST8841: 'Four gangs in one US-format panel, touch only. A four-circuit bank is usually the end of a corridor or an open-plan wall where the customer wants one face rather than four switches; check that the box depth suits the panel before the drywall closes.',

  USW8811: 'Wi-Fi and touch, one gang, neutral required. The neutral is the deciding fact: if the box has only a switch loop, this model is not installable without new cable. Where the neutral exists, it is the simplest connected option because the panel talks to the router directly.',
  'USW8811-S': 'The single-live version of USW8811. Same panel, same app, no neutral needed — the trade-off is that the electronics draw their power through the load, and a very low-wattage LED can flicker or fail to stay powered with the light off. Ask which lamp is fitted.',
  USW8821: 'Two gangs, Wi-Fi, neutral required. Both circuits switch locally and report to the app independently; the neutral is shared, so a single N conductor at the box serves the panel rather than each gang.',
  'USW8821-S': 'Two gangs on the single-live variant. Choosing this over USW8821 saves pulling a neutral, and costs tolerance for low-load lamps on either gang. It is a wiring decision disguised as a model decision.',
  USW8831: 'Three gangs, Wi-Fi, neutral required. Where a three-gang wall is being replaced, the existing box often has the neutral looped through the first switch position only — confirm it reaches this panel before specifying.',
  'USW8831-S': 'Three gangs with no neutral requirement. The more circuits share one single-live panel, the more the standing current through those loads adds up, so ask what is actually connected to each gang rather than treating the panel as a drop-in.',
  USW8832: 'Wi-Fi dimming in a US glass panel, one gang, neutral required. The connected app is useful for scenes, but dimming quality is decided by the lamp and driver, not by the radio. Confirm both before the panel is specified.',
  USW8833: 'Wi-Fi curtain control. The app gives scheduling and position control, while the load side still depends on the motor: supply, direction wiring and limit setting. Confirm the motor first, then treat the panel as the interface.',
  USW8841: 'Four gangs, Wi-Fi, neutral required. This is the largest US-format Wi-Fi panel in the range; the wall box, the neutral and the app grouping all need checking before a four-circuit bank is committed.',
  'USW8841-S': 'Four gangs on the single-live version. At this gang count the standing-current question is worth raising with the electrician first: four circuits sharing one no-neutral panel is the configuration most likely to show a lamp problem.',

  'USW8811-Z': 'Zigbee and touch, one gang, single live wire. Two dependencies at once: a gateway on site, and no neutral at the box. Confirm both before quoting, because either one alone rules the model out.',
  'USW8821-Z': 'Two gangs, Zigbee, single live. The gateway is a separate line on the quotation, and it has to be the right ecosystem — a Zigbee hub that does not speak this device\'s profile is a hub that does nothing.',
  'USW8831-Z': 'Three gangs on the Zigbee single-live panel. In a house with several of these, the gateway is one per network, not one per panel; that changes the accessory count in the quotation.',
  'USW8841-Z': 'Four gangs, Zigbee, single live. The largest panel in this group, and the one where a commissioning plan matters most: gang labels, scene names and gateway placement are easier to agree before installation than after.',

  EUT8811S: 'EU-format touch panel, one gang, single live wire only. No radio and no neutral requirement, so it suits a room where the lighting is switched locally and the customer does not want the lighting on a network.',
  EUT8821S: 'Two gangs, EU touch-only, single live. It occupies one EU back box and switches two circuits; confirm the frame and the box depth, since EU glass panels sit proud of the wall by design.',
  EUT8831S: 'Three gangs, touch only, EU format, single live. Where three circuits meet at one position and the wiring is single-live throughout, this replaces three separate switches with one face.',
  EUT8841S: 'Four gangs on the EU touch panel. At this width the panel dominates the wall, so the plate and frame choice matters as much as the switching function.',

  EUW8811: 'EU Wi-Fi panel, one gang, neutral required, 90–250 V. The wide supply range is the useful part for export orders that land in different markets; the neutral requirement is the constraint that decides whether it can be installed at all.',
  EUW8811C: 'The C variant switches a different set of constraints: single-live or neutral-plus-live, on 160–240 V. That flexibility is what makes it a candidate for retrofit work, and it is also why the supply range should be quoted with the model rather than assumed from the family.',
  EUW8821: 'Two gangs, EU Wi-Fi, neutral required. Because the panel needs N + L, a two-gang retrofit often costs more in cable than in hardware; check the box before the price conversation.',
  EUW8821C: 'Two gangs on the flexible-wiring variant: single-live or neutral-plus-live at 160–240 V. Useful where a building mixes both wiring styles across floors, because one model can cover both.',
  EUW8831: 'Three gangs, neutral required, EU Wi-Fi. The neutral is shared across the three circuits at the box, so the check is whether it reaches this position rather than whether it exists in the building.',
  EUW8831C: 'Three gangs, flexible wiring, 160–240 V. The higher voltage floor in the C range is a real limit: a 110–120 V site is outside it, whatever the connector looks like.',
  EUW8832: 'EU Wi-Fi dimming, one gang, neutral required. The panel dims locally and reports to the app; the lamp and driver still decide whether the dimming is smooth across the whole travel.',
  EUW8833: 'EU Wi-Fi curtain control. Position and scheduling live in the app, while the motor side stays conventional: supply, direction and limits. Confirm the motor before the panel.',
  EUW8834: 'EU Wi-Fi fan control, neutral required. Fan loads bring starting current and, on some fans, a capacitor arrangement that reacts badly to electronic switching. Name the fan model and its starting current rather than its wattage.',
  EUW8835: 'EU Wi-Fi heater control, neutral required. Resistive loads are simpler than motors but less forgiving of a rating margin: confirm the connected load in watts against the model rating before the panel is committed.',
  EUW8841: 'Four gangs, EU Wi-Fi, neutral required. A four-circuit glass panel is a design decision as much as an electrical one — as wide as the switch bank it replaces, and less forgiving of a box that sits off-centre.',
  EUW8841C: 'Four gangs on the flexible-wiring variant, 160–240 V. The combination of four circuits, single-live capability and a raised voltage floor makes this the most specification-sensitive model in the EU Wi-Fi range.',

  EUZ8811: 'EU Zigbee panel, one gang, neutral required. Zigbee means a gateway on site and a commissioning step that Wi-Fi does not need; if the project has no hub, this is the wrong family however good the panel is.',
  EUZ8811C: 'Zigbee with flexible wiring: single-live or neutral-plus-live, 160–240 V. The gateway is still mandatory — the C variant changes the wiring, not the radio.',
  EUZ8811S: 'Zigbee, one gang, single live only, 110–240 V. The lower voltage floor and the no-neutral wiring make this the retrofit option in the Zigbee range, at the cost of the standing-current caveat on low-wattage lamps.',
  EUZ8821: 'Two gangs, Zigbee, neutral required. Two circuits on one radio, one gateway pairing. Check that the hub can address both gangs independently before the customer plans scenes around them.',
  EUZ8821C: 'Two gangs, Zigbee, flexible wiring at 160–240 V. Where a project mixes single-live and neutral boxes, one C model can cover both — provided the gateway and the scene plan are settled first.',
  EUZ8821S: 'Two gangs, Zigbee, single live only. The no-neutral version of the pair; the same lamp caveat applies per gang, and the gateway requirement does not change.',
  EUZ8831: 'Three gangs, Zigbee, neutral required. The neutral is shared at the box, and the gateway is shared across the network — neither is per-gang.',
  EUZ8831C: 'Three gangs, Zigbee, flexible wiring, 160–240 V. A building with mixed wiring styles can standardise on this one model, which usually simplifies both the schedule and the spare-parts stock.',
  EUZ8831S: 'Three gangs, Zigbee, single live only. The retrofit shape of the three-gang Zigbee panel: no neutral, lower voltage floor, gateway still required.',
  EUZ8832: 'EU Zigbee dimming, neutral required. Scenes and scheduling come from the hub; the dimming curve still depends on the driver. Confirm both before the panel is specified.',
  EUZ8833: 'EU Zigbee curtain control. The hub handles position and schedules, the motor handles the load. Confirm the motor supply and limits first.',
  EUZ8834: 'EU Zigbee fan control, neutral required. Motor starting current and control method decide suitability; a fan that hums on electronic switching will hum on this panel too.',
  EUZ8835: 'EU Zigbee heater control, neutral required. Confirm the wattage against the model rating, and whether the heater has its own thermostat that should stay in charge of temperature.',
  EUZ8841: 'Four gangs, Zigbee, neutral required. The widest Zigbee panel here; scene planning across four gangs plus a gateway is worth agreeing in writing before installation.',
  EUZ8841C: 'Four gangs, Zigbee, flexible wiring at 160–240 V. The most configurable panel in the range, and therefore the one most worth confirming against the actual box, supply and gateway before it is ordered.'
};

export const modelNote = sku => modelNotes[sku];

export default modelNotes;

// Date the model notes were added. Used so sitemap lastmod reflects this edit
// for the 51 models that changed, without touching any other page.
export const modelNoteUpdated = '2026-10-29';
// Only notes corrected after publication receive the later modification date.
const encodingCorrectedModels = [
  'USW8811-S', 'USW8831', 'USW8821-Z', 'EUW8811', 'EUW8811C',
  'EUW8821C', 'EUW8831C', 'EUW8841', 'EUW8841C', 'EUZ8811C',
  'EUZ8811S', 'EUZ8821C', 'EUZ8831', 'EUZ8831C', 'EUZ8841C'
];
export const modelNoteDate = sku => {
  if (!modelNotes[sku]) return undefined;
  return encodingCorrectedModels.includes(sku) ? '2026-10-30' : modelNoteUpdated;
};
