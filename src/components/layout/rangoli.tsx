// A rangoli drawn in plain text, generated with 8-fold symmetry, plus a
// border band like the one drawn at a doorway. Pure decoration for the
// sign-in screen, so hidden from screen readers and never selectable.
const RANGOLI = [
  "",
  "                     o             o",
  "              ooo*******         *******ooo",
  "               ************   ************",
  "         oo    *****  ..   xxx   ..  *****    oo",
  "              **  .      xxxxxxx      .  **",
  "              ..        +++++++++        ..",
  "    oo   ***. xxxx+++   ~~~~~~~~~   +++xxxx .***   oo",
  "     *****   xxx++++~~~oo       oo~~~++++xxx   *****",
  "    *****..  x++++~~  ooooo   ooooo  ~~++++x  ..*****",
  "  o*****      ++~~    ooooo...ooooo    ~~++      *****o",
  "    ****.      ~~oooo  ..  ***  ..  oooo~~      .****",
  "     **    +++~~ooooo..*** *** ***..ooooo~~+++    **",
  " o    *. xx+++~   ooo.   *ooooo*   .ooo   ~+++xx .*    o",
  " o     .xxx+++~     ..***oo@@@oo***..     ~+++xxx.     o",
  " o    *. xx+++~   ooo.   *ooooo*   .ooo   ~+++xx .*    o",
  "     **    +++~~ooooo..*** *** ***..ooooo~~+++    **",
  "    ****.      ~~oooo  ..  ***  ..  oooo~~      .****",
  "  o*****      ++~~    ooooo...ooooo    ~~++      *****o",
  "    *****..  x++++~~  ooooo   ooooo  ~~++++x  ..*****",
  "     *****   xxx++++~~~oo       oo~~~++++xxx   *****",
  "    oo   ***. xxxx+++   ~~~~~~~~~   +++xxxx .***   oo",
  "              ..        +++++++++        ..",
  "              **  .      xxxxxxx      .  **",
  "         oo    *****  ..   xxx   ..  *****    oo",
  "               ************   ************",
  "              ooo*******         *******ooo",
  "                     o             o",
  "",
].join("\n");

// shortcut: one long repeat clipped by overflow, instead of measuring the panel.
const BORDER = " .o*o. ~ ".repeat(40);

function Border() {
  return (
    <p aria-hidden="true" className="text-primary/50 overflow-hidden font-mono text-sm whitespace-nowrap select-none">
      {BORDER}
    </p>
  );
}

export function Rangoli() {
  return (
    <div className="flex h-full flex-col justify-between gap-8 py-8">
      <Border />
      <div className="flex flex-col items-center gap-8">
        <pre aria-hidden="true" className="text-primary/70 font-mono text-xs leading-tight select-none xl:text-sm">
          {RANGOLI}
        </pre>
        <div className="max-w-sm text-center">
          <p className="text-secondary-foreground font-serif text-xl leading-snug">
            Every good match starts with someone who listened first.
          </p>
          <p className="text-muted-foreground mt-3 text-sm">300 profiles · 12 factors · every match scored from both sides</p>
        </div>
      </div>
      <Border />
    </div>
  );
}
