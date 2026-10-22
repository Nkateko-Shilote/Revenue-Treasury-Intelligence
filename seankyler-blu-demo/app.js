import {renderView,renderDetail,viewMeta} from './views.js';
import {periods,incidents} from './data.js';
import {getRows} from './model.js';
import {loadActions,saveActions,clearActions,exportRows} from './utilities.js';
const state={period:'month',query:'',sector:'',verification:'',sort:'name',actionOverrides:{}};
let storage;try{storage=window.localStorage;}catch{}
state.actionOverrides=loadActions(storage);
const paths=['M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z','M4 21V7h7v14 M11 3h9v18 M7 11h1 M7 15h1 M15 7h1 M15 11h1 M15 15h1','M3 19h18 M6 15V9 M12 15V4 M18 15v-7','M3 12h4l3-7 4 14 3-7h4','M4 4h16v12H4z M8 21h8 M12 16v5','M12 3l9 17H3z M12 9v5 M12 17h.01','M5 3h11l4 4v14H5z M15 3v5h5 M8 12h9 M8 16h9'];
const keys=Object.keys(viewMeta);let current='overview';let returnFocus=null;
const nav=document.querySelector('#nav');
nav.innerHTML=keys.map((id,i)=>`<a href="#${id}" title="${viewMeta[id][0]}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[i]}"/></svg><span class="navtext">${viewMeta[id][0]}</span>${id==='risk'?'<span class="count">5</span>':''}</a>`).join('');
function draw(){nav.querySelector('.count').textContent=incidents.filter(i=>state.actionOverrides[i.id]!=='completed').length;document.querySelector('#content').innerHTML=renderView(current,state);document.querySelector('#range').textContent=periods[state.period].range;document.querySelectorAll('[data-period]').forEach(b=>{b.classList.toggle('selected',b.dataset.period===state.period);b.setAttribute('aria-pressed',String(b.dataset.period===state.period));});}
function route(){current=keys.includes(location.hash.slice(1))?location.hash.slice(1):'overview';document.querySelector('#page-title').textContent=viewMeta[current][0];document.querySelector('#page-description').textContent=viewMeta[current][1];document.querySelector('#crumb').textContent=viewMeta[current][0];nav.querySelectorAll('a').forEach(a=>{const selected=a.hash==='#'+current;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});draw();}
window.addEventListener('hashchange',()=>{document.querySelector('#detail').close();route();window.scrollTo({top:0,behavior:'instant'});});
document.addEventListener('click',e=>{const period=e.target.closest('[data-period]');if(period){state.period=period.dataset.period;draw();}const detail=e.target.closest('[data-detail]');if(detail){returnFocus=detail;document.querySelector('#detail-content').innerHTML=renderDetail(detail.dataset.detail,state);document.querySelector('#detail').showModal();}if(e.target.closest('[data-reset]')){Object.assign(state,{query:'',sector:'',verification:'',sort:'name'});draw();}if(e.target.closest('[data-close-detail]'))document.querySelector('#detail').close();});
document.addEventListener('input',e=>{if(e.target.id==='search'){const pos=e.target.selectionStart;state.query=e.target.value;draw();const input=document.querySelector('#search');input.focus();input.setSelectionRange(pos,pos);}});
document.addEventListener('change',e=>{if(['sector','verification','sort'].includes(e.target.id)){state[e.target.id]=e.target.value;draw();document.querySelector('#'+e.target.id)?.focus();}});
const dialog=document.querySelector('#detail');document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus();});dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
route();

let toastTimer;
function notify(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3500);}
document.addEventListener('click',e=>{
 const action=e.target.closest('[data-action]');if(action){state.actionOverrides[action.dataset.action]=action.dataset.state;const saved=saveActions(storage,state.actionOverrides);draw();notify(saved?'Example action saved on this browser.':'Example action changed for now. This browser could not save it.');}
 if(e.target.closest('[data-reset-actions]')){state.actionOverrides={};clearActions(storage);draw();notify('Example actions reset.');}
});
document.querySelector('#export').addEventListener('click',()=>{const scope=['subsidiaries','register'].includes(current)?state:{period:state.period};const csv=exportRows(getRows(scope),state.period);const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const link=document.createElement('a');link.href=url;link.download='Blu-Group-Demo-'+current+'-'+state.period+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Example company figures downloaded'+(['subsidiaries','register'].includes(current)?' using your selected filters.':'.'));});
const officeButton=document.querySelector('#office');
function officeLabel(){const enabled=document.body.classList.contains('office');officeButton.innerHTML=enabled?'✕ <span>Exit office mode</span>':'▣ <span>Office mode</span>';officeButton.setAttribute('aria-pressed',String(enabled));}
officeButton.addEventListener('click',async()=>{const enabled=document.body.classList.toggle('office');officeLabel();if(enabled){try{await document.documentElement.requestFullscreen?.();}catch{notify('Office view is on. This browser cannot open full screen.');}}else if(document.fullscreenElement){try{await document.exitFullscreen();}catch{}}});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('office');officeLabel();}});

document.querySelector('#skip-dashboard').addEventListener('click',()=>document.querySelector('#main').focus());
