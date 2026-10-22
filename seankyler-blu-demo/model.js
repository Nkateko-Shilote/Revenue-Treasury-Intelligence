import {entities} from './entities.js';
import {ledger,periods} from './data.js';
export function verifiedEntities(){return entities.filter(e=>e.verification==='Verified at reporting date');}
export function getRows({period='month',query='',sector='',verification='',sort='name'}={}){
 const factor=(periods[period]||periods.month).factor;
 const rows=entities.filter(e=>(!query||(e.name+' '+e.mandate).toLowerCase().includes(query.toLowerCase()))&&(!sector||e.sector===sector)&&(!verification||e.verification===verification)).map(e=>{
 const base=ledger.find(l=>l.id===e.id);const metrics=base?{...base}:null;
 if(metrics){for(const k of ['revenue','commission','profit','faceValue','budget','transactions','successful','complaints','affected'])metrics[k]=Math.round(base[k]*factor);metrics.successRate=100*metrics.successful/metrics.transactions;}
 return {...e,metrics};});
 return rows.sort((a,b)=>sort==='revenue'?(b.metrics?.revenue??-1)-(a.metrics?.revenue??-1):sort==='service'?(a.metrics?.sla??101)-(b.metrics?.sla??101):a.name.localeCompare(b.name));
}
export function getGroupMetrics(period='month'){
 const rows=getRows({period}).filter(r=>r.metrics);const result={revenue:0,commission:0,profit:0,cash:0,faceValue:0,budget:0,transactions:0,successful:0,complaints:0,affected:0};
 for(const r of rows)for(const key of Object.keys(result))result[key]+=r.metrics[key];
 result.successRate=result.transactions?100*result.successful/result.transactions:0;
 result.covered=rows.length;result.verified=verifiedEntities().length;
 return result;
}
export function getTrend(period='month'){
 const steps=(periods[period]||periods.month).steps;const g=getGroupMetrics(period);
 const weights=steps.length===7?[12,15,14,16,17,14,12]:[12,15,18,17,20,18];
 let allocated=0,txAllocated=0,failAllocated=0;const failures=g.transactions-g.successful;
 return steps.map((label,i)=>{
 const last=i===steps.length-1;
 const revenue=last?g.revenue-allocated:Math.round(g.revenue*weights[i]/100);allocated+=revenue;
 const transactions=last?g.transactions-txAllocated:Math.round(g.transactions*weights[i]/100);txAllocated+=transactions;
 const failed=last?failures-failAllocated:Math.round(failures*weights[weights.length-1-i]/100);failAllocated+=failed;
 const successful=transactions-failed;
 return {label,revenue,transactions,successful,rate:100*successful/transactions};
 });
}
