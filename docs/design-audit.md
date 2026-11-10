# DM Squire design audit

Looked at the combat helper as it actually ships: Next 15, Chakra v2, the screens under `lib/components/dm-helper/`. This note is the rough spots, ranked by how much they get in the way of running a fight. The PR that carries this file only patches the mechanical ones (overflow, a broken phone layout, weak contrast, missing focus, controls that do not line up). It does not pick a new look. Will still has to say which direction, if any, is worth a real pass.

The current face is two ideas stapled together. The shell is a dark slate field, `#2F4F4F`, with gunmetal panels at `#1C2833` and off-white type `#F5F5F5`. On top of that sits a Mario orange, `#F54103` (the token is literally `marioRed`), used for the selected tab, the tab underline, Kill, and End Combat. Enemy names are the lighter orange `#F76543`. Heroes are a bright green `#5DB65D`. Links and focus fallbacks reach for an electric blue `#007BFF` that is too dim on the slate. The wordmark of the screen is still a cartoon sword, a knight, and a white “add people” glyph, plus the Blockbench cube used as the bench control. Rhodium Libre is the only typeface, including for 12px initiative numbers.

## Rough spots, by impact

1. **Phone navigation broke onto two rows.** At 390px the four tabs were centered and allowed to wrap, so Settings sat alone under Combat / Characters / Invite Others. The bar looked unfinished and ate vertical space the tracker needs. Fixed here: one row, no wrap. On a phone the icon sits closer to its label, and the row is padded and centered so Settings is not flush with the bar. It can still scroll if a guest badge makes the row wider.

2. **Edit and details were not really buttons.** Those controls asked for a `primarySolid` variant that does not exist, so they rendered as borderless icons. Bench, next to them, is a white outlined square. The row read as three different control languages. Fixed by using the existing outline treatment and giving every icon control the same 40px box, plus a name for the screen reader. Disabled details and “cannot bench” now look inactive instead of identical to the live buttons.

3. **Initiative numbers did not share a column.** Single-digit rolls were padded with a space character. In Rhodium Libre that space is not the width of a digit, so `(9)` and `(18)` drifted. Fixed with a fixed-width, right-aligned, tabular figure. Same treatment on the phone row.

4. **The combat toolbar was two heights on a phone.** Start / End / Clear were 40px and Quick Add was 32px, so the wrapped second control sat on a different cap-line. They now share one size at each breakpoint.

5. **Focus and a few labels were hard to see.** Keyboard focus on the orange buttons was a translucent blue glow that disappeared into the painting. Placeholders on the black forms were `#718096`, about 5.2:1 on the near-black card, and worse where the fire shows through the 8% transparency. “Clear Quick Add” was `marioRed.700` (`#B53503`) on a near-black menu, about 3.5:1. Fixed with an off-white ring (`#F5F5F5` outside a `#1C2833` gap), an inset ring on the tabs so the slanted bar does not clip it, lighter placeholders (`#D5D5D5`), and the lighter Mario orange `#F76543` for that menu item. Dark-panel fields also take a real focus stroke in the existing accent `#339AFF`.

6. **Small alignment nicks in the fight flow.** The initiative dialog parked Next / Done on the left whenever Back was absent. The re-roll button was a size smaller than the health and initiative fields. “Add” on the enemy and ally forms never said what it added. The read-only line “intiative order” was misspelled. The background picker’s close control was a floated “X”. Those are corrected. Slate buttons (Start Combat, Add, Done) also get a hairline `#FFFFFF` at 50% so they do not melt into the black cards. The orange destructive buttons are unchanged.

7. **The tracker is drawn on top of a loud painting.** Panels are `blackAlpha.900` at 95% opacity over `demon-in-hell.jpg`. It looks dramatic in a screenshot and it makes HP, names, and the empty state compete with flames. This is the biggest readability issue at the table, and it is also the thing that makes the site feel like itself. Left alone on purpose.

8. **The teal slate and the Mario orange do not agree.** `#2F4F4F` is a cool, damp stone. `#F54103` is a saturated video-game orange. Green heroes (`#5DB65D`) and yellow allies (`#FAF089`) add a third and fourth hue. Nothing is wrong with any one of them. Together they read as a default dark theme, a Mario leftover, and a handful of status colors, not as one DM’s tool. Called out here. Not recolored.

9. **Pixel and cartoon leftovers.** `marioRed` in `styles/theme.ts`. The sword and knight PNGs on the main tabs. The bench control is the Blockbench mark, a voxel editor’s logo, which does not mean “sit this creature out.” The unknown portrait is a generic circled question mark. These are identity, so they stay until a direction is chosen.

10. **Light dialogs dropped into a dark app.** Initiative, edit, clear, and end-combat dialogs are stock white Chakra surfaces with `#303F44` labels. They work, and the contrast on the white is fine. They just belong to a different product than the black panels around them. Not restyled.

11. **The desktop tab bar is a parallelogram and the tracker is a rectangle.** `clip-path` slants the bar (`polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)`) and the list below is a normal rounded rectangle. The orange rule does not meet the card. It is a deliberate shape, and it is slightly awkward. Left as is.

12. **Typeahead results are a white menu.** Monster search drops a white list with slate text onto the black form. Readable, and visually from another theme. Left as is.

13. **`100vw` on the app shell.** `AppWrapper` is `width: 100vw`, which often causes a sideways scroll once a vertical scrollbar exists. It did not overflow at 1280 or 390 in this pass, so it was not changed.

## Directions

None of these are implemented.

**Candlelit table.** Keep the dark photography, and stop pretending the chrome is a Mario HUD. Panels go to a stained walnut `#1A120B` with a hairline brass rule `#C6A15B`. Ink is chalk `#E7E1D5`. Enemies are oxblood `#8C2F2F`, heroes a dry herb green `#7D9A78`, allies a candle yellow `#E6C36A`. Destructive actions use the oxblood, not `#F54103`. Rhodium Libre stays for names. Numbers move to a plain tabular face so initiative columns stay put. No gradients, no glow, no extra illustration inside the tracker. The background painting can remain, behind panels that are actually opaque.

**Index cards.** The thing a DM stares at for three hours is the list, so give the list a paper surface and let the painting live in the margin. Card stock `#F3E6D0`, iron text `#2A241C`, a vermilion tick `#9E2B2B` for damage and for the active turn, a dull verdigris `#3E6B62` used only as a 1px rule. The surround stays charcoal `#1C1915`. Tabs become the tops of cards, not a slanted black ribbon. This is closer to a handwritten initiative tracker than to a dashboard, and it fixes the contrast problem by getting the numbers off the flames.

**One slate, no Mario.** If the current bones should stay, commit to them and delete the parts that are not slate. Field `#243B3B`, panels `#12181C`, text `#E7E1D5`, a single ember `#E07A3D` for the selected tab, Kill, and End Combat. Retire `#F54103`, the sword PNG, and the Blockbench cube. Heroes can stay a quieter green `#8FB59A` so a name is still scannable, but it should be mixed from the same gray-green family as `#2F4F4F`, not a second brand color. The result is the tool you already have, with one accent and one material.
