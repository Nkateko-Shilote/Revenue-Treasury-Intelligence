import {incidents,periods} from './data.js';
import {plainLabel} from './entities.js';
const storageKey='seankyler.blu.demo.actions.v1';
export function parseActionState(text){try{const parsed=JSON.parse(text);if(!parsed||Array.isArray(parsed)||typeof parsed!=='object')return {};return Object.fromEntries(Object.entries(parsed).filter(([id,state])=>incidents.some(i=>i.id===id)&&['open','acknowledged','completed'].includes(state)));}catch{return {};}}
export function loadActions(storage){try{return parseActionState(storage.getItem(storageKey));}catch{return {};}}
export function saveActions(storage,actions){try{storage.setItem(storageKey,JSON.stringify(actions));return true;}catch{return false;}}
export function clearActions(storage){try{storage.removeItem(storageKey);return true;}catch{return false;}}
export function csvCell(value){let text=String(value??'Unknown');if(/^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}
export function exportRows(rows,period='month'){
 const lines=[['DEMO · EXAMPLE FIGURES'],['© 2026 Seankyler (Pty) Ltd. All rights reserved.'],['Demo use','Shared for evaluation. Confidential discussions require a separate signed NDA.'],['Reporting period',periods[period]?.range||period],['How to read these figures','Sales outside the group only; commission is included in revenue; unknown does not mean zero; company list still needs checking'],['Company','Group link','Record status','Source date','Owner reference','Revenue earned (rand)','Commission included (rand)','Profit from operations (rand)','Cash available (rand)','Example service delivered on time (%)','Source document']];
 for(const r of rows)lines.push([r.name,plainLabel(r.relationship),plainLabel(r.verification),plainLabel(r.sourceDate),r.parentId||'Link still to check',r.metrics?.revenue,r.metrics?.commission,r.metrics?.profit,r.metrics?.cash,r.metrics?.sla,r.sourceUrl]);
 return '\uFEFF'+lines.map(line=>line.map(csvCell).join(',')).join('\r\n');
}
