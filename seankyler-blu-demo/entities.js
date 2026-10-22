export const sources={company:'https://blug.co.za/online_results/annual-results-2026/pdf/blu-label-company-afs-2026-singles.pdf',group:'https://blug.co.za/online_results/annual-results-2026/pdf/blu-label-group-afs-2026-singles.pdf',report:'https://blug.co.za/pdf/reports/2026/blu-label-iar-2026.pdf'};
const direct=[
 ['nova','Blu Nova','Data & intelligence','Data, analytics and automation',100],
 ['altbureau','Blu Label AltBureau','Data & intelligence','Data enrichment and decision services',100],
 ['company','Blu Label Company','Mandate unconfirmed',null,100],
 ['media','Blu Label Media','Media','Campaign delivery and advertising',100],
 ['ventures','Blu Label Ventures','Mandate unconfirmed',null,100],
 ['budding','Budding Trade 1170','Mandate unconfirmed',null,100],
 ['cigicell','Cigicell','Utilities & energy','Vending, Unipay and municipal revenue assurance',74],
 ['datacel','Datacel Direct','Mandate unconfirmed',null,100],
 ['glocell','Glocell Retail Solutions','Distribution','Retail prepaid products and value-added services',100],
 ['gold','Gold Label Investments','Mandate unconfirmed',null,100],
 ['oneworld','One World Telecoms','Mandate unconfirmed',null,100],
 ['tech','Tech Nov8','Mandate unconfirmed',null,66.67],
 ['tpc','The Prepaid Company','Distribution','Prepaid procurement, wholesale and connectivity',100],
 ['tj','Transaction Junction','Payments','Payment processing and reconciliation',60],
 ['ventury','Ventury Group','Mandate unconfirmed',null,100]
].map(([id,name,sector,mandate,ownershipPct])=>({id,name,sector,mandate:mandate||'Mandate confirmation required',ownershipPct,parentId:'group',relationship:'Direct subsidiary',verification:'Verified at reporting date',sourceUrl:sources.company,sourceDate:'31 May 2026',ownershipDate:'31 May 2026'}));
const provisional=[['advance','BluAdvance','Embedded finance','Essential-service advances'],['reware','ReWare','Utilities & energy','Private submetering and utility management'],['energy','Blu Energy','Utilities & energy','Energy trading and contract readiness'],['vrm','Visual Revenue Management','Utilities & energy','Revenue management — mapping to confirm'],['connect','Blu Label Connect','Embedded finance','Mobile contracts and billing'],['blds','Blu Label Data Solutions','Data & intelligence','Data services and lead delivery']].map(([id,name,sector,mandate])=>({id,name,sector,mandate,parentId:null,ownershipPct:null,relationship:'Operating record — mapping pending',verification:'Provisional',sourceUrl:sources.report,sourceDate:'FY2026 / supporting business disclosures',ownershipDate:null}));
const investments=['Cell C','T3 Telecoms','Utilities World','Blu Label Communications','Blu Train'].map((name,i)=>({id:'investment-'+i,name,sector:'Investment oversight',mandate:'Investment oversight; group-level classification to confirm',ownershipPct:null,parentId:null,relationship:'Investment / associate',verification:'Classification to confirm',sourceUrl:sources.group,sourceDate:'31 May 2026',ownershipDate:null}));
export const entities=[...direct,{id:'bld',name:'Blu Label Distribution',sector:'Distribution',mandate:'Merchant distribution, vouchers and bill payments',ownershipPct:null,parentId:'tpc',relationship:'Indirect subsidiary',verification:'Verified at reporting date',sourceUrl:sources.company,sourceDate:'31 May 2026',ownershipDate:'31 May 2026'},...provisional,...investments];

// Keep record values stable; use everyday language on screen and in downloads.
export function plainLabel(text){return ({
 'Verified at reporting date':'Confirmed in May 2026 records',
 'Provisional':'Still being checked',
 'Classification to confirm':'Investment link to check',
 'Direct subsidiary':'Owned directly by Blu',
 'Indirect subsidiary':'Owned through a group company',
 'Operating record — mapping pending':'Group link still to check',
 'Investment / associate':'Investment — listed separately',
 'Mandate unconfirmed':'Company role to check',
 'Mandate confirmation required':'Company role still needs checking',
 'Data & intelligence':'Data services',
 'Embedded finance':'Credit & mobile services',
 'Investment oversight':'Investments',
 'Data, analytics and automation':'Data analysis and automated work',
 'Data enrichment and decision services':'Data checks and information for decisions',
 'Vending, Unipay and municipal revenue assurance':'Electricity sales, Unipay payments and municipal revenue checks',
 'Retail prepaid products and value-added services':'Prepaid products and other retail services',
 'Prepaid procurement, wholesale and connectivity':'Buying and supplying prepaid airtime, data and connections',
 'Payment processing and reconciliation':'Processing payments and checking that records match',
 'Essential-service advances':'Short-term credit for essential services',
 'Private submetering and utility management':'Electricity and water meters for properties',
 'Energy trading and contract readiness':'Buying and selling electricity; preparing contracts',
 'Revenue management — mapping to confirm':'Revenue checks — company link still to confirm',
 'Data services and lead delivery':'Data services and potential customer contacts',
 'Investment oversight; group-level classification to confirm':'Investment details and group link still to check',
 'Merchant distribution, vouchers and bill payments':'Supplying sellers with vouchers and bill payment services',
 'FY2026 / supporting business disclosures':'2026 reports and published business information'
})[text]||text;}
