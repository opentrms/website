export interface Product {
  name: string;
  schemaPath: string; // Relative path in repo for GitHub link
}

export interface AssetClass {
  name: string;
  products: Product[];
}

// All schema paths verified against actual files under schemas/deals/ and schemas/instruments/.
// Deal schemas: 17 files across deposit, extension, forward, fra, option, repo, spot, swap, swaption.
// Instrument schemas: 4 files under schemas/instruments/.
export const assetClasses: AssetClass[] = [
  {
    name: 'Rates',
    products: [
      { name: 'Vanilla IRS',     schemaPath: 'schemas/deals/swap/rates/vanilla.json' },
      { name: 'OIS Swap',        schemaPath: 'schemas/deals/swap/rates/ois.json' },
      { name: 'Basis Swap',      schemaPath: 'schemas/deals/swap/rates/basis.json' },
      { name: 'Cross-Currency Swap', schemaPath: 'schemas/deals/swap/rates/xccy.json' },
      { name: 'FRA',             schemaPath: 'schemas/deals/fra/rates/vanilla.json' },
      { name: 'Swaption',        schemaPath: 'schemas/deals/swaption/rates/vanilla.json' },
    ],
  },
  {
    name: 'FX',
    products: [
      { name: 'FX Spot',         schemaPath: 'schemas/deals/spot/fx/vanilla.json' },
      { name: 'FX Forward',      schemaPath: 'schemas/deals/forward/fx/vanilla.json' },
      { name: 'NDF',             schemaPath: 'schemas/deals/forward/fx/ndf.json' },
      { name: 'FX Vanilla Option', schemaPath: 'schemas/deals/option/fx/vanilla.json' },
      { name: 'FX Barrier Option', schemaPath: 'schemas/deals/option/fx/barrier.json' },
    ],
  },
  {
    name: 'Credit',
    products: [
      { name: 'Credit Default Swap', schemaPath: 'schemas/deals/swap/credit/vanilla.json' },
      { name: 'Credit Forward',      schemaPath: 'schemas/deals/forward/credit/vanilla.json' },
    ],
  },
  {
    name: 'Equity',
    products: [
      { name: 'Equity Vanilla Option', schemaPath: 'schemas/deals/option/equity/vanilla.json' },
    ],
  },
  {
    name: 'Money Market',
    products: [
      { name: 'Repo',            schemaPath: 'schemas/deals/repo/money_market/vanilla.json' },
      { name: 'Deposit',         schemaPath: 'schemas/deals/deposit/money_market/vanilla.json' },
    ],
  },
];

export const instruments: { name: string; schemaPath: string }[] = [
  { name: 'Bond',              schemaPath: 'schemas/instruments/bond.json' },
  { name: 'Equity',            schemaPath: 'schemas/instruments/equity.json' },
  { name: 'FX Pair',           schemaPath: 'schemas/instruments/fx_pair.json' },
  { name: 'Futures Contract',  schemaPath: 'schemas/instruments/futures_contract.json' },
];
