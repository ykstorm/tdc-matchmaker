// A rangoli drawn in plain text. Pure decoration for the sign-in screen, so
// it is hidden from screen readers and never selectable.
const RANGOLI = [
  "                   .",
  "                .  *  .",
  "             .    /|\\    .",
  "          .     ./ o \\.     .",
  "       .      ./  ooo  \\.      .",
  "    .    +  ./  ~ ooo ~  \\.  +    .",
  " .     +   /  ~  * o *  ~  \\   +     .",
  "    +     /  ~ * * o * * ~  \\     +",
  ".   +   (  ~  ** oo oo **  ~  )   +   .",
  "  +    (  ~  *** oo@oo ***  ~  )    +",
  ".   +   (  ~  ** oo oo **  ~  )   +   .",
  "    +     \\  ~ * * o * * ~  /     +",
  " .     +   \\  ~  * o *  ~  /   +     .",
  "    .    +  .\\  ~ ooo ~  /.  +    .",
  "       .      .\\  ooo  /.      .",
  "          .     .\\ o /.     .",
  "             .    \\|/    .",
  "                .  *  .",
  "                   .",
].join("\n");

export function Rangoli() {
  return (
    <pre aria-hidden="true" className="text-primary/60 font-mono text-xs leading-tight select-none">
      {RANGOLI}
    </pre>
  );
}
