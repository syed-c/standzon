export type HeadingFont =
  | 'Helvetica' | 'helvetica'
  | 'Inter' | 'inter'
  | 'Poppins' | 'poppins'
  | 'Roboto' | 'roboto'
  | 'Montserrat' | 'montserrat'
  | 'Arial' | 'arial'
  | 'Trebuchet' | 'trebuchet'
  | '' | undefined;

export function getFontClass(font?: HeadingFont): string {
  const v = (font || '').toString().toLowerCase();
  switch (v) {
    case 'inter':
      return 'font-inter';
    case 'poppins':
      return 'font-poppins';
    case 'roboto':
      return 'font-roboto';
    case 'montserrat':
      return 'font-montserrat';
    case 'trebuchet':
      return 'font-trebuchet';
    case 'helvetica':
    case 'arial':
    case 'trebuchet':
    default:
      return 'font-helvetica';
  }
}


