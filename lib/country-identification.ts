export interface CountryIdRequirement {
  code: string
  name: string
  idType: string
  idLabel: string
  idPlaceholder: string
  idPattern?: RegExp
  bankField1?: { label: string; placeholder: string }
  bankField2?: { label: string; placeholder: string }
}

export const COUNTRY_IDENTIFICATIONS: Record<string, CountryIdRequirement> = {
  US: {
    code: 'US',
    name: 'United States',
    idType: 'ssn',
    idLabel: 'Social Security Number (SSN)',
    idPlaceholder: 'XXX-XX-XXXX',
    idPattern: /^\d{3}-?\d{2}-?\d{4}$/,
    bankField1: { label: 'Bank Routing Number', placeholder: '121000248' },
    bankField2: { label: 'Bank Account Number', placeholder: '123456789' },
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    idType: 'sin',
    idLabel: 'Social Insurance Number (SIN)',
    idPlaceholder: 'XXX-XXX-XXX',
    idPattern: /^\d{3}-?\d{3}-?\d{3}$/,
    bankField1: { label: 'Bank Transit Number', placeholder: '12345' },
    bankField2: { label: 'Bank Account Number', placeholder: '123456789' },
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    idType: 'cpf',
    idLabel: 'CPF (Cadastro de Pessoas Físicas)',
    idPlaceholder: 'XXX.XXX.XXX-XX',
    idPattern: /^\d{3}\.\d{3}\.\d{3}-?\d{2}$/,
    bankField1: { label: 'IBAN', placeholder: 'BR94 0000 0000 0000 0000 0000 0 00' },
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    idType: 'mynumber',
    idLabel: 'My Number',
    idPlaceholder: 'XXXX-XXXX-XXXX',
    idPattern: /^\d{4}-?\d{4}-?\d{4}$/,
    bankField1: { label: 'Bank Code', placeholder: '0001' },
    bankField2: { label: 'Account Number', placeholder: '123456789' },
  },
  CN: {
    code: 'CN',
    name: 'China',
    idType: 'idcard',
    idLabel: 'ID Card Number',
    idPlaceholder: '110101199003071234',
    idPattern: /^\d{18}$/,
    bankField1: { label: 'IBAN', placeholder: 'CNxxxxxxxxxxxxxxxx' },
  },
  KR: {
    code: 'KR',
    name: 'South Korea',
    idType: 'rrn',
    idLabel: 'Resident Registration Number',
    idPlaceholder: 'YYMMDD-XXXXXXX',
    idPattern: /^\d{6}-?\d{7}$/,
    bankField1: { label: 'Bank Code', placeholder: '01' },
    bankField2: { label: 'Account Number', placeholder: '123456789' },
  },
  IN: {
    code: 'IN',
    name: 'India',
    idType: 'aadhar',
    idLabel: 'Aadhar Number',
    idPlaceholder: 'XXXX XXXX XXXX',
    idPattern: /^\d{4}\s?\d{4}\s?\d{4}$/,
    bankField1: { label: 'IFSC Code', placeholder: 'SBIN0001234' },
    bankField2: { label: 'Account Number', placeholder: '123456789' },
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    idType: 'ni',
    idLabel: 'National Insurance Number',
    idPlaceholder: 'QQ 12 34 56 C',
    idPattern: /^[A-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-Z]$/,
    bankField1: { label: 'Sort Code', placeholder: '20-00-00' },
    bankField2: { label: 'Account Number', placeholder: '12345678' },
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    idType: 'idnumber',
    idLabel: 'ID Card Number',
    idPlaceholder: 'C00000000-4',
    bankField1: { label: 'IBAN', placeholder: 'DE89 3704 0044 0532 0130 00' },
  },
  FR: {
    code: 'FR',
    name: 'France',
    idType: 'insee',
    idLabel: 'INSEE Number',
    idPlaceholder: '1 85 04 71 055 628',
    bankField1: { label: 'IBAN', placeholder: 'FR14 2004 1010 0505 0001 3M02 606' },
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    idType: 'tfn',
    idLabel: 'Tax File Number (TFN)',
    idPlaceholder: 'XXX XXX XXX',
    idPattern: /^\d{3}\s?\d{3}\s?\d{3}$/,
    bankField1: { label: 'BSB Number', placeholder: '012-345' },
    bankField2: { label: 'Account Number', placeholder: '123456789' },
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    idType: 'nric',
    idLabel: 'NRIC/FIN Number',
    idPlaceholder: 'SXXXX123D',
    bankField1: { label: 'Bank Code', placeholder: 'DBS' },
    bankField2: { label: 'Account Number', placeholder: '123456789' },
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    idType: 'rfc',
    idLabel: 'RFC (Registro Federal de Contribuyentes)',
    idPlaceholder: 'ABCD123456XYZ',
    bankField1: { label: 'CLABE', placeholder: 'XXXXXX0123456789' },
    bankField2: { label: 'Bank Account', placeholder: '123456789' },
  },
  NZ: {
    code: 'NZ',
    name: 'New Zealand',
    idType: 'ird',
    idLabel: 'IRD Number',
    idPlaceholder: 'XX-XXX-XXX',
    idPattern: /^\d{2}-?\d{3}-?\d{3}$/,
    bankField1: { label: 'Bank Account Number', placeholder: '01-1234-1234567-00' },
  },
}

export function getCountryIdentification(countryCode: string): CountryIdRequirement | null {
  return COUNTRY_IDENTIFICATIONS[countryCode] || null
}

export function getCountryList(): CountryIdRequirement[] {
  return Object.values(COUNTRY_IDENTIFICATIONS).sort((a, b) => a.name.localeCompare(b.name))
}
