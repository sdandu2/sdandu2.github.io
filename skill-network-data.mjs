/** Milestone 6.24 — Skill & knowledge graph.
 * Project support means the topic appears in the described work, NOT a proficiency rating.
 * Role-relevant nodes with no project support are explicitly marked as areas to explore.
 */
import {projects} from './data.mjs';
export const skillTracks=[
 {id:'all',label:'All',summary:'Explore the technical work and the foundations behind seven portfolio projects.'},
 {id:'software',label:'Software',summary:'Backend services, systems performance, databases, testing and reliable application engineering.'},
 {id:'ml',label:'ML / AI',summary:'Computer vision, research retrieval, evaluation, and production-oriented ML engineering.'},
 {id:'quantum',label:'Quantum',summary:'Simulated quantum circuits, noise, optimization and quantum-network forecasting.'},
 {id:'quant',label:'Quantitative Finance',summary:'Order matching, measurable systems, forecasting and simulated financial scenarios.'}
];
export const skillColumns=[
 {id:'projects',label:'Projects',note:'Portfolio evidence'},
 {id:'domains',label:'Domains',note:'Technical focus areas'},
 {id:'methods',label:'Techniques',note:'Algorithms and practices'},
 {id:'math',label:'Math & statistics',note:'Quantitative foundations'},
 {id:'tools',label:'Languages & tools',note:'Software and platforms'},
 {id:'practices',label:'Engineering habits',note:'How I approach work'}
];
const P={X:'exchangecore',S:'scanner',E:'evidencesearch',T:'transitpulse',Q:'quantumoptlab',N:'simshift-q',F:'financialscenarios'};
const parseProjects=(s)=>[...new Set([...s].map(c=>P[c]).filter(Boolean))];
// Each row: column | key | label | role tracks | project support | evidence state | featured | contextual explanation.
// A=ML/AI, Q=Quantum, F=Quant, S=Software Engineering. Blank support denotes role-relevant study direction.
const rows=`
domains|systems|Systems engineering|AFS|XT|documented|1|Deterministic engine behavior, APIs and service-oriented workflows.
domains|vision|Computer vision|A|S|documented|1|Visual anomaly inspection on held-out manufacturing images.
domains|retrieval|Information retrieval|A|E|documented|1|Semantic and lexical paper search with ranking evaluation.
domains|data-engineering|Data engineering|AFS|TE|documented|1|Recorded vehicle observations, data ingestion and validation.
domains|ml-eval|ML evaluation|AQFS|SENQ|documented|1|Held-out and frozen evaluation against explicit baselines.
domains|deep-learning|Deep learning|AQ|SN|documented|1|Feature models and PyTorch simulation-based forecasting.
domains|quantum-sim|Quantum simulation|Q|Q|documented|1|QAOA circuit experiments in simulation, not hardware runs.
domains|quantum-net|Quantum networks|Q|N|documented|1|Forecasting simulated entangled-pair delivery behavior.
domains|quant-finance|Quantitative finance|F|XF|documented|1|Matching rules and generated financial scenarios, not live trading.
domains|fullstack|Full-stack engineering|AS|ET|documented|1|React experiences backed by FastAPI and stored data.
domains|robotics|Robotics and autonomy|AQ||explore|0|An ongoing research direction, not a completed physical-robot deployment.
methods|benchmark|Benchmarking|AFQS|XQN|documented|1|Compare throughput and model error against meaningful baselines.
methods|order-matching|Price–time order matching|FS|X|documented|1|Deterministic execution according to order price and arrival time.
methods|deterministic-testing|Deterministic testing|AFS|XS|documented|1|Repeatable decisions and consistency checks on frozen cases.
methods|anomaly|Anomaly detection|A|S|documented|1|Identify unusual regions using examples of normal products.
methods|patchcore|PatchCore-style scoring|A|S|documented|0|Local memory-bank comparison of pretrained visual features.
methods|visual-features|Visual feature extraction|A|S|documented|1|Pretrained representations used for industrial anomaly scoring.
methods|classification|Classification evaluation|AS|S|documented|0|AUROC, average precision and held-out validation.
methods|semantic-search|Semantic retrieval|AS|E|documented|1|Find research despite differences in keyword wording.
methods|search-ranking|Search ranking / reranking|AS|E|documented|1|Order research results using relevance and held-out judgments.
methods|text-embeddings|Embedding-based retrieval|AS|E|documented|0|Vector-based similarity in document retrieval.
methods|data-pipelines|Data pipelines|AFS|TE|documented|1|Clean, timestamp and expose structured records.
methods|api-engineering|API engineering|AS|TE|documented|1|FastAPI routes to expose search and transit data.
methods|interactive-ux|Data-driven interfaces|AS|SET|documented|0|Inspection, research discovery and mapping interfaces.
methods|ingestion|Timestamped ingestion|AS|T|documented|0|Preserve observation context rather than implying live state.
methods|qaoa|QAOA|Q|Q|documented|1|Study approximate quantum optimization on simulated Max-Cut instances.
methods|quantum-noise|Quantum noise simulation|Q|Q|documented|1|Compare circuits under simulator noise models.
methods|circuit-design|Quantum circuit design|Q|Q|documented|1|Explore circuit depth and gate-budget choices.
methods|variational|Variational quantum algorithms|Q|Q|documented|0|QAOA as a parameterized circuit optimization example.
methods|forecasting|Sequence forecasting|QFS|N|documented|1|Forecast entangled-pair delivery from simulated sequences.
methods|shift-eval|Distribution-shift evaluation|AQFS|N|documented|1|Evaluate forecasts when simulated conditions change.
methods|scenario-gen|Scenario generation|FS|F|documented|1|Study simulated financial outcomes under alternative assumptions.
methods|simulation|Computational simulation|QFS|QNF|documented|1|Evaluate system behavior without claiming physical deployment.
methods|feature-engineering|Feature engineering|A|S|foundational|0|Role-relevant modeling technique; inspection work uses learned features.
methods|rl|Reinforcement learning|AQ||explore|0|Research direction; not represented here as a finished RL deployment.
methods|backtesting|Strategy backtesting|F||explore|0|A quant research expectation, not a verified trading strategy in this portfolio.
methods|signal-eval|Signal validation|F||explore|0|Quant research skill to demonstrate with out-of-sample evidence.
methods|model-serving|Model serving / inference APIs|A||explore|0|Relevant MLE deployment skill; not a documented live model service.
methods|monitoring|Model monitoring|A||explore|0|Production MLOps responsibility, not a claimed deployed monitoring system.
methods|mlops|MLOps workflows|A||explore|0|Model lifecycle engineering to deepen with live deployment proof.
methods|nlp|NLP and language models|A|E|foundational|0|Semantic retrieval is connected; LLM training is not demonstrated.
methods|optimization|Algorithm optimization|QFS|XQ|documented|1|Trade off matching performance and quantum circuit cost.
methods|controlled-experiments|Controlled experiments|AQFS|SQN|documented|1|Hold data and comparison conditions constant to evaluate claims.
math|linear-algebra|Linear algebra|AQFS|SQ|foundational|1|Foundation for embeddings, quantum states and model representations.
math|probability|Probability|AQFS|QN|foundational|1|Foundational context for simulator measurements and uncertainty.
math|statistics|Statistics|AFS|SEN|foundational|1|Statistical reasoning and careful interpretation of evaluation differences.
math|optimization-math|Optimization|AQFS|XQ|foundational|1|Algorithmic and circuit parameter trade-offs.
math|numerical-methods|Numerical methods|QF|QN|foundational|0|Computational foundation, not independently benchmarked here.
math|time-series|Time-series analysis|QFS|N|documented|1|Sequence forecasting evaluated on recorded simulation runs.
math|time-counts|Time and observation counts|AS|T|documented|1|Separate timestamped observations from distinct vehicles and simultaneous states.
math|auroc|AUROC & average precision|AS|S|documented|1|Held-out anomaly detection evaluation.
math|ndcg|nDCG@10 ranking metrics|AS|E|documented|1|Research search ranking evaluation.
math|mae|Mean absolute error (MAE)|QFS|N|documented|1|Compare forecasting predictions against simulation outcomes.
math|uncertainty|Uncertainty intervals|AQF|N|documented|1|Interpret paired model comparisons conservatively.
math|maxcut|Combinatorial optimization|Q|Q|documented|1|Small-graph Max-Cut objective in QAOA simulation.
math|gate-budget|Gate-budget trade-offs|Q|Q|documented|1|Circuit-depth decisions under simulated noise.
math|throughput|Throughput measurement|FS|X|documented|1|Isolated operations-per-second benchmark of engine workload.
math|risk|Risk modeling|FS||explore|0|Quant finance capability to develop beyond scenario visualization.
math|stochastic|Stochastic processes|FQ||explore|0|Advanced modeling mathematics relevant to quant and quantum roles.
math|latency|Latency analysis|FS|X|foundational|0|Performance topic related to matching; latency benchmark not claimed.
math|scenario-dist|Scenario distributions|F|F|documented|1|Range of synthetic outcome paths, not calibrated real-world market risk.
math|hypothesis-tests|Statistical hypothesis testing|AFQS|N|foundational|0|Relevant for interpreting whether paired improvements are convincing.
math|matrix-algebra|Matrices and eigenvalues|Q|Q|foundational|0|Quantum mathematical foundation; not an independently scored result.
math|complex-vectors|Complex vectors / tensor products|Q|Q|foundational|0|Foundational quantum formalism, not a claimed hardware experiment.
tools|python|Python|AQFS|SENQTF|documented|1|Primary data, evaluation, simulation and backend language.
tools|cpp|C++20|FS|X|documented|1|ExchangeCore matching engine.
tools|typescript|TypeScript|AS|T|documented|1|TransitPulse frontend and typed React components.
tools|javascript|JavaScript|AS|ET|foundational|0|Web engineering language; TypeScript and React are more directly documented.
tools|sql|SQL|AFS|T|foundational|1|Database querying foundation; PostgreSQL storage is directly documented.
tools|pytorch|PyTorch|AQ|SN|documented|1|Machine learning experiments and forecasting.
tools|sklearn|scikit-learn|A||explore|0|Common MLE library; not claimed by these seven project descriptions.
tools|numpy|NumPy|AQF|QN|foundational|0|Scientific Python foundation; precise library use not independently audited here.
tools|pandas|pandas|AF||explore|0|Useful dataframe library; not separately evidenced in the included case studies.
tools|scipy|SciPy|QF||explore|0|Scientific computing library relevant to numerical experiments.
tools|react|React|AS|ET|documented|1|Interactive project interfaces.
tools|fastapi|FastAPI|AS|ET|documented|1|Transit and research-search APIs.
tools|postgres|PostgreSQL|AS|T|documented|1|Recorded transit observation storage.
tools|docker|Docker|AS|T|documented|1|Database service used in the TransitPulse development setup.
tools|git|Git / GitHub|AQFS|SENQT|documented|1|Versioned public engineering project repositories.
tools|ci|CI / automated checks|AS|TN|foundational|0|Tests and repository checks; deployment CI should be verified per repo.
tools|qiskit|Qiskit|Q|Q|documented|1|Quantum circuit experimentation in QuantumOptLab.
tools|qiskit-aer|Qiskit Aer|Q|Q|documented|1|Noisy quantum circuit simulation.
tools|streamlit|Streamlit|AS|S|documented|0|Scanner inspection interface.
tools|dinov2|DINOv2|A|S|documented|1|Pretrained visual feature extraction.
tools|cmake|CMake|FS|X|documented|0|C++ matching engine build tooling.
tools|tensorflow|TensorFlow|A||explore|0|Alternative deep learning framework to learn or demonstrate.
tools|jax|JAX|AQ||explore|0|Scientific autodiff and ML framework to explore.
tools|pennylane|PennyLane|Q||explore|0|Quantum software framework outside currently documented builds.
tools|cirq|Cirq|Q||explore|0|Quantum circuit framework outside currently documented builds.
tools|cloud|AWS / cloud infrastructure|A||explore|0|Production cloud deployment skill to evidence before claiming.
tools|kubernetes|Kubernetes|A||explore|0|Container orchestration; not included as a verified project deployment.
tools|notebooks|Jupyter notebooks|AQFS|SQNF|documented|0|Repeatable research experiments and evaluation artifacts.
practices|reproducibility|Reproducibility|AQFS|SQNX|documented|1|Freeze protocols and repeat benchmark checks.
practices|debugging|Debugging|AQFS|XSET|documented|1|Trace integration and evaluation errors through systems.
practices|experiment-design|Experimental design|AQFS|SQN|documented|1|Plan held-out experiments before comparing results.
practices|communication|Technical communication|AQFS|SENF|documented|1|Document what benchmark results do and do not prove.
practices|problem-framing|Problem framing|AQFS|SETF|documented|1|Turn vague questions into testable engineering tasks.
practices|user-perspective|User-centered design|AS|SET|documented|1|Build interfaces that expose data context and limitations.
practices|tradeoffs|Trade-off reasoning|AQFS|XQNF|documented|1|Compare simple baselines with more complex systems.
practices|evaluation-rigor|Evidence-based evaluation|AQFS|SENQ|documented|1|Keep claims inside the tested conditions.
practices|testing|Automated testing|AFS|XSTN|documented|1|Unit, integration and reproducibility checks.
practices|profiling|Performance profiling|AFS|X|documented|0|Measure performance separately from functional correctness.
practices|research-synthesis|Research synthesis|AQS|E|documented|1|Organize evidence across research sources.
practices|systems-thinking|Systems thinking|AQFS|XTE|documented|1|Connect inputs, processing decisions and user impact.
practices|collaboration|Collaboration|AQF||explore|0|A transferable professional practice; projects alone do not independently verify it.
practices|documentation|Technical documentation|AQFS|SENQT|documented|1|Explain design choices and known limitations in repositories.
domains|backend-systems|Backend engineering|S|TE|documented|1|FastAPI-backed search and transit services with external integrations.
domains|frontend-systems|Frontend engineering|S|ET|documented|1|React-based exploration experiences, typed interfaces and stateful controls.
domains|production-reliability|Production reliability|S||explore|0|Reliability and on-call practices to demonstrate with deployment and failure testing.
methods|rest-apis|REST API development|S|TE|documented|1|Backend endpoints exposing research search and transit observations.
methods|integration-testing|Integration testing|S|T|documented|1|TransitPulse API and PostgreSQL integration checks.
methods|data-structures|Data structures|S||explore|0|Core interview topic requiring explicit demonstrated algorithm implementations.
methods|algorithms|Algorithms and complexity|S||explore|0|Foundational CS topic including runtime and space trade-offs.
methods|object-oriented|Object-oriented design|S||explore|0|Design principles to demonstrate and explain through audited code.
methods|http-fundamentals|HTTP and request lifecycle|S||explore|0|Protocol understanding beyond the project's use of REST APIs.
methods|auth|Authentication and authorization|S||explore|0|Access control and secure identity flows; no verified implementation in selected cases.
methods|error-handling|Error handling and retries|S||explore|0|Failure-aware service design to demonstrate under injected faults.
methods|database-design|Database schema design|S||explore|0|Data modeling, indexes and migrations to evidence in a backend case study.
methods|sql-optimization|Query optimization|S||explore|0|Indexes, query plans and performance diagnosis not yet shown as project results.
methods|concurrency|Concurrency and multithreading|S||explore|0|Threading and concurrent correctness to verify with explicit tests.
methods|caching|Caching strategies|S||explore|0|Consistency and invalidation policies not demonstrated in portfolio case studies.
methods|distributed-systems|Distributed systems concepts|S||explore|0|Replicated services, messaging and consistency beyond verified deployment scope.
methods|security|API security and input validation|S||explore|0|Secrets management, validation and threat modeling require project evidence.
methods|deployment|Service deployment|S||explore|0|Production rollout and maintenance experience not claimed for local prototypes.
math|complexity|Big-O time and space complexity|S||explore|0|Algorithmic asymptotics for technical interviews and system trade-offs.
math|recursion|Recursion and invariants|S||explore|0|Correctness foundations, not independently assessed in the portfolio.
math|performance-measurement|Performance benchmarking|S|X|documented|1|Measure order-matching throughput on a stated workload.
tools|html-css|HTML and CSS|S||explore|0|Frontend fundamentals; the interactive portfolio demonstrates design but is not one of the seven evidence cases.
tools|github-actions|GitHub Actions|S||explore|0|CI automation should be linked to verified workflow files before claiming proficiency.
tools|linux|Linux|S||explore|0|Command-line and operating-system skills to substantiate through project documentation.
tools|redis|Redis|S||explore|0|Caching and message delivery software, not evidenced in selected projects.
tools|aws|AWS|S||explore|0|Cloud infrastructure and deployment skills to develop and verify.
tools|azure|Azure|S||explore|0|Cloud platform experience requires deployment proof before claiming it.
tools|k8s|Kubernetes|S||explore|0|Orchestration experience not shown in currently selected project work.
practices|requirements|Requirements analysis|S|T|foundational|0|Translate product needs to an API and clear data semantics; contextual evidence only.
practices|code-review|Code review|S||explore|0|Collaborative review and feedback practices should be demonstrated before claiming experience.
practices|observability|Observability and logging|S||explore|0|Production telemetry and monitoring to validate in a deployed workload.
practices|design-patterns|Design patterns and modularity|S||explore|0|Documented architectural boundaries and code-quality practices to evidence.
practices|accessibility|Accessibility and responsive UX|S||explore|0|The website has accessible interactions, but its audits are not included in the seven case studies.
practices|ai-assisted|AI-assisted development validation|S||explore|0|Using AI tools responsibly includes independently testing generated changes; not proof of proficiency.
`;
const uniq=(items)=>[...new Set(items)];
const projectKinds={exchangecore:['F','S'],scanner:['A','S'],evidencesearch:['A','S'],transitpulse:['A','S'],quantumoptlab:['Q'], 'simshift-q':['Q','A','S'],financialscenarios:['F']};
export const skillNodes=[
 ...projects.map(p=>({id:p.id,title:p.name,column:'projects',tracks:projectKinds[p.id].map(t=>({A:'ml',Q:'quantum',F:'quant',S:'software'})[t]),projects:[p.id],kind:'documented',featured:true,description:p.description,project:p})),
 ...rows.trim().split('\n').map(line=>{
  const [column,key,title,tags,support,kind,featured,description]=line.split('|');
  return {id:'skill-'+key,title,column,tracks:uniq([...tags].map(t=>({A:'ml',Q:'quantum',F:'quant',S:'software'})[t]).filter(Boolean)),projects:parseProjects(support||''),kind,featured:featured==='1',description};
 })
];
export const skillsById=new Map(skillNodes.map(n=>[n.id,n]));
// Each explicit route is a single documented project with one conceptual bridge per column.
// Edges are not generated just because two unrelated skills share a discipline.
const rawPaths=[
 ['X','systems','order-matching','throughput','cpp','testing'],
 ['X','systems','benchmark','throughput','cmake','profiling'],
 ['X','quant-finance','optimization','optimization-math','cpp','tradeoffs'],
 ['X','systems','deterministic-testing','throughput','cpp','reproducibility'],
 ['S','vision','anomaly','auroc','pytorch','evaluation-rigor'],
 ['S','vision','patchcore','auroc','dinov2','experiment-design'],
 ['S','ml-eval','classification','auroc','streamlit','user-perspective'],
 ['S','deep-learning','visual-features','linear-algebra','pytorch','documentation'],
 ['E','retrieval','semantic-search','ndcg','fastapi','research-synthesis'],
 ['E','retrieval','search-ranking','ndcg','python','evaluation-rigor'],
 ['E','fullstack','api-engineering','ndcg','react','user-perspective'],
 ['E','retrieval','text-embeddings','ndcg','python','communication'],
 ['T','data-engineering','ingestion','time-counts','postgres','documentation'],
 ['T','data-engineering','data-pipelines','time-counts','docker','systems-thinking'],
 ['T','fullstack','api-engineering','time-counts','fastapi','user-perspective'],
 ['T','backend-systems','rest-apis','time-counts','fastapi','testing'],
 ['T','backend-systems','integration-testing','time-counts','postgres','debugging'],
 ['E','backend-systems','rest-apis','ndcg','fastapi','documentation'],
 ['X','systems','benchmark','performance-measurement','cpp','testing'],
 ['T','fullstack','interactive-ux','time-counts','typescript','debugging'],
 ['Q','quantum-sim','qaoa','maxcut','qiskit','experiment-design'],
 ['Q','quantum-sim','quantum-noise','gate-budget','qiskit-aer','evaluation-rigor'],
 ['Q','quantum-sim','circuit-design','gate-budget','qiskit','tradeoffs'],
 ['Q','ml-eval','benchmark','gate-budget','python','reproducibility'],
 ['N','quantum-net','forecasting','mae','pytorch','reproducibility'],
 ['N','quantum-net','simulation','time-series','python','experiment-design'],
 ['N','ml-eval','shift-eval','uncertainty','pytorch','evaluation-rigor'],
 ['N','deep-learning','forecasting','mae','notebooks','tradeoffs'],
 ['F','quant-finance','scenario-gen','scenario-dist','python','communication'],
 ['F','quant-finance','simulation','scenario-dist','notebooks','problem-framing'],
 ['F','quant-finance','scenario-gen','scenario-dist','python','tradeoffs']
];
export const skillRoutes=rawPaths.map(([project,...skills])=>[P[project],...skills.map(s=>'skill-'+s)]);
const linkSupport=new Map();
for(const route of skillRoutes){
 for(let i=0;i<route.length-1;i++){
  const from=route[i],to=route[i+1],key=from+'|'+to;
  if(!linkSupport.has(key))linkSupport.set(key,new Set());
  linkSupport.get(key).add(route[0]);
 }
}
export const skillLinks=[...linkSupport].map(([key,p])=>({from:key.split('|')[0],to:key.split('|')[1],projects:[...p]}));
export function supportedSkills(projectId){return skillNodes.filter(n=>n.projects.includes(projectId));}
