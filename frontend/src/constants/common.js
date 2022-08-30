export const currencies = [
  {
    value: 'USD',
    label: '$',
    left: true
  },
  {
    value: 'EUR',
    label: '€',
    left: true
  },
  {
    value: 'BGN',
    label: 'лв.',
    left: false
  },
];

export const transactionTypes = [
  {
    value: 0,
    parent: 0,
    label: 'Buy'
  },
  {
    value: 1,
    parent: 1,
    label: 'Sell'
  },
  {
    value: 2,
    parent: 2,
    label: 'Transfer in'
  },
  {
    value: 3,
    parent: 2,
    label: 'Transfer out'
  },
]; 

export const commodities = [
  {
    name: 'Silver',
    logo: 'silver.png',
    description: ''
  },
  {
    name: 'Gold',
    logo: 'silver.png',
    description: ''
  },
]

export const p2pPlatforms = [
  {
    name: 'PeerBerry',
    logo: 'peerberry.png',
    website: 'https://peerberry.com/'
  },
  {
    name: 'Reinvest24',
    logo: 'reinvest24.png',
    website: 'https://www.reinvest24.com/'
  },
  {
    name: 'EstateGuru',
    logo: 'estateguru.png',
    website: 'https://estateguru.co/'
  },
  {
    name: 'Mintos',
    logo: 'mintos.png',
    website: 'https://www.mintos.com/'
  },
  {
    name: 'Debitum',
    logo: 'debitum.png',
    website: 'https://debitum.network/'
  },
  {
    name: 'LenderMarket',
    logo: 'lendermarket.png',
    website: 'https://lendermarket.com/'
  },
  {
    name: 'Bondora',
    logo: 'bondora.png',
    website: 'https://www.bondora.com/'
  },
  {
    name: 'Rendity',
    logo: 'rendity.png',
    website: 'https://rendity.com/'
  },
]