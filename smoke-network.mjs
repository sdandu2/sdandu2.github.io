/** Headless runtime smoke for the Experience Network mount function. */
import {strict as assert} from 'node:assert';
import {mountExperienceNetwork} from './experience-network.mjs';
const style={setProperty(){}};
const element=()=>({innerHTML:'',style,querySelectorAll:()=>[],addEventListener(){},getBoundingClientRect:()=>({width:1000})});
const shell=element(),panel=element(),svg=element(),mobile=element(),fit=element();
const elems={
 'experience-graphic':shell,'network-focus':panel,
 'network-connections':svg,'network-mobile':mobile,'network-fit':fit
};
globalThis.document={getElementById:id=>elems[id]??null,querySelectorAll:()=>[]};
globalThis.window={matchMedia:()=>({matches:false})};
globalThis.ResizeObserver=class {observe(){} disconnect(){}};
const net=mountExperienceNetwork();
assert.ok(net,'Network must initialize');
assert.equal((shell.innerHTML.match(/class="network-node network-node-/g)||[]).length,22);
assert.equal((svg.innerHTML.match(/class="network-edge network-edge-/g)||[]).length,35);
assert.ok(panel.innerHTML.includes('TeckPulse'));
net.focus('komatsu');
assert.ok(panel.innerHTML.includes('Komatsu North America'));
net.changeView('tools');
assert.ok(shell.innerHTML.includes('PyTorch'));
assert.equal((shell.innerHTML.match(/class="network-node network-node-/g)||[]).length,25);
assert.equal((svg.innerHTML.match(/class="network-edge network-edge-/g)||[]).length,43);
net.focus('ensar');
assert.ok(panel.innerHTML.includes('Ensar Solutions'));
net.showAll();
assert.ok(panel.innerHTML.includes('Four professional roles'));
net.destroy();
console.log('PASS: mounted 22 career nodes, 35 paths, and accessible network detail');
