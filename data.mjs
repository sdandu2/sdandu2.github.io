export const projects = [
  {
    "id": "exchangecore",
    "name": "ExchangeCore",
    "kind": "SYSTEMS / C++20",
    "description": "I was curious about what happens after a buy or sell order reaches an exchange. How does the system decide which orders trade first, and how do you make that decision quickly without changing the rules? I built ExchangeCore in C++20 to explore this using price–time priority. Better prices come first, but when prices match, earlier orders go first. I wrote deterministic tests for these cases and measured the matching engine separately from its market-data interface. In one recorded workload, the engine processed 7.92 million operations per second. While that doesn't represent the performance of an entire trading exchange, it showed me how much I could optimize the engine itself. What interested me the most was figuring out how to make the system faster without compromising the rules that determine which orders get matched first.",
    "roles": [
      "C++20",
      "CMake",
      "Python",
      "React"
    ],
    "result": "7.92M",
    "resultLabel": "Operations/sec · One Benchmark Workload",
    "repo": "https://github.com/sdandu2/ExchangeCore",
    "image": "assets/exchange-cinematic.webp",
    "imageLabel": "Cinematic concept illustration of the matching engine · not a benchmark output",
    "proofImage": "assets/exchange-fallback.svg",
    "proofLabel": "Actual dashboard screenshot and benchmarks in GitHub",
    "interfaceUrl": "https://github.com/sdandu2/ExchangeCore/blob/main/docs/assets/market-overview.png",
    "hue": "#66BFFF",
    "disciplines": [
      "Quantitative finance",
      "Software"
    ]
  },
  {
    "id": "scanner",
    "name": "Scanner",
    "kind": "COMPUTER VISION / INDUSTRIAL INSPECTION",
    "description": "I wanted to see whether a model could identify product defects it had never encountered by learning what normal products look like. I built Scanner around pretrained DINOv2 features and a PatchCore-inspired method that compares image regions with normal reference images. On top of that, I made an inspection interface with separate reference data and thresholds for each product category. I evaluated it on 701 official held-out images. In a separate CPU audit, it reproduced all 1,402 frozen alert decisions. That audit tells me the decisions were consistent in that test, but that doesn't mean the model caught every defect. I wanted the interface to help someone examine a suspicious region without treating an anomaly score as a final diagnosis.",
    "roles": [
      "PyTorch",
      "DINOv2",
      "PatchCore",
      "Streamlit"
    ],
    "result": "701",
    "resultLabel": "Official Held-Out Test Images",
    "repo": "https://github.com/sdandu2/Scanner",
    "image": "assets/scanner-cinematic.webp",
    "imageLabel": "Conceptual machine-vision illustration of anomaly localization and segmentation · real Scanner inspection UI in repository",
    "proofImage": "assets/scanner-inspection.webp",
    "proofLabel": "Real Scanner application screenshot",
    "hue": "#66BEF4",
    "disciplines": [
      "Applied ML",
      "Software"
    ]
  },
  {
    "id": "evidencesearch",
    "name": "EvidenceSearch",
    "kind": "SCIENTIFIC RETRIEVAL / FULL STACK",
    "description": "Whenever I searched for research papers using keywords, I started wondering how many useful papers I might be missing simply because they used different wording. I built EvidenceSearch to investigate that problem by combining keyword search with semantic retrieval, which looks for similarity in meaning. The system then reranks the candidate papers, and in order to visualize this, I built a browser interface to explore results across five research areas. To check whether the ranking improved, I evaluated it on a held-out internal SciFact configuration. One run reached an nDCG@10 of 0.6953, a measure of how well relevant papers appear near the top of the results. That score doesn't tell us whether the papers' scientific conclusions are correct. My goal was to make finding evidence easier while keeping the responsibility for interpreting it with the reader.",
    "roles": [
      "Python",
      "FastAPI",
      "Retrieval",
      "React"
    ],
    "result": "0.6953",
    "resultLabel": "nDCG@10 · Internal SciFact Holdout",
    "repo": "https://github.com/sdandu2/EvidenceSearch",
    "image": "assets/evidencesearch-cinematic.webp",
    "imageLabel": "Cinematic illustration of research retrieval · not the application interface",
    "proofImage": "assets/evidence-fallback.svg",
    "proofLabel": "Published application screenshots available in the repository",
    "interfaceUrl": "https://github.com/sdandu2/EvidenceSearch/blob/main/assets/screenshots/evidencesearch-homepage.png",
    "hue": "#83C3F3",
    "disciplines": [
      "Applied ML",
      "Software"
    ]
  },
  {
    "id": "transitpulse",
    "name": "TransitPulse",
    "kind": "DATA ENGINEERING / GEOGRAPHIC UX",
    "description": "I wanted to turn transit coordinates into something people could actually explore, with vehicle identity, route context, and observation time. I built TransitPulse to collect WMATA vehicle snapshots, store the records in PostgreSQL, and make that data accessible through a FastAPI backend. On the frontend, I used React to let visitors inspect the recorded positions and their route context on a map. One of my saved captures contains 780 recorded vehicle positions, although that doesn't mean 780 different vehicles were moving at the same time. Each position represents a recorded observation, so it's important to know when that information was collected. Building TransitPulse helped me realize that creating an accurate and useful interface involves more than displaying data on a map. A useful transit interface needs to communicate when and how its observations were collected.",
    "roles": [
      "FastAPI",
      "PostgreSQL",
      "React",
      "Maps"
    ],
    "result": "780",
    "resultLabel": "Recorded Positions · Example Capture",
    "repo": "https://github.com/sdandu2/TransitPulse",
    "image": "assets/transitpulse-cinematic.webp",
    "imageLabel": "Cinematic city data illustration · not a live transit map",
    "proofImage": "assets/transit-map.webp",
    "proofLabel": "Real recorded-vehicle map screenshot",
    "hue": "#77A7FF",
    "disciplines": [
      "Software"
    ]
  },
  {
    "id": "quantumoptlab",
    "name": "QuantumOptLab",
    "kind": "QUANTUM OPTIMIZATION / RESEARCH",
    "description": "When I started exploring quantum optimization, I wanted to understand whether adding more layers to a circuit actually makes it more useful. Deeper circuits can represent more complex solutions in an ideal simulation, but they also give noise more opportunities to affect the result. I built QuantumOptLab using Qiskit and Qiskit Aer to study that trade-off through QAOA experiments on small Max-Cut problems. I built a browser-based research atlas to explore results and circuit costs. I ran 720 simulator executions to evaluate how different circuit configurations performed under simulated noise. I compared a learned depth-selection method with a simpler gate-count heuristic. When I evaluated both approaches on 20 graphs that weren't used during training, the machine learning model didn't outperform the simpler method. The comparison reminded me that additional complexity must earn its place. All of these experiments were conducted using quantum simulators rather than physical quantum computers.",
    "roles": [
      "Qiskit",
      "Qiskit Aer",
      "Python",
      "QAOA"
    ],
    "result": "720",
    "resultLabel": "Locked-Test Simulator Executions",
    "repo": "https://github.com/sdandu2/QuantumOptLab",
    "image": "assets/quantumoptlab-cinematic.webp",
    "imageLabel": "Cinematic illustration of quantum optimization · not a circuit measurement",
    "proofImage": "assets/quantum-hero.webp",
    "proofLabel": "Real QuantumOptLab homepage screenshot",
    "hue": "#75CFF5",
    "disciplines": [
      "Quantum",
      "Software"
    ]
  },
  {
    "id": "simshift-q",
    "name": "SimShift-Q",
    "kind": "QUANTUM NETWORKS / FORECAST ROBUSTNESS",
    "description": "I wanted to find out what happens when a forecasting model learns from one simulated quantum network and then encounters different network conditions. In SimShift-Q, I used simulated entangled-pair deliveries to train and evaluate sequence forecasts, asking how many pairs would successfully reach their destinations. An important part of the evaluation was treating entire simulation runs as the test units instead of counting overlapping windows as independent evidence. I evaluated both approaches using 300 previously recorded simulation runs to see how accurately they could predict the number of successfully delivered entangled pairs. The two-stage model achieved an average prediction error of approximately 0.936, compared with 0.956 for the simpler, direct forecasting approach. Although the two-stage model performed slightly better, the difference was small enough that I couldn't confidently say the improvement wasn't due to chance. What I found particularly interesting was how changing network conditions could affect a model's predictions, and how important it is to test whether a model can maintain its performance when the environment differs from what it was trained on.",
    "roles": [
      "Python",
      "PyTorch",
      "Simulation",
      "Forecasting"
    ],
    "result": "300",
    "resultLabel": "Archived Simulated Network Runs",
    "repo": "https://github.com/sdandu2/SimShift-Q",
    "image": "assets/simshift-cinematic.webp",
    "imageLabel": "Concept illustration of network forecasting · not an experiment output",
    "hue": "#A4B9FF",
    "disciplines": [
      "Quantum",
      "Applied ML"
    ]
  },
  {
    "id": "financialscenarios",
    "name": "Financial Scenario Generator",
    "kind": "QUANTITATIVE FINANCE / CONDITIONAL SIMULATION",
    "description": "I wanted to explore financial forecasts beyond one predicted market price. Changes in economic conditions can lead to very different outcomes, and a single number makes it difficult to see that uncertainty. I built a research interface where I can adjust economic assumptions, generate conditional 30-day market scenarios, and compare the simulated paths under different regimes. The dashboard also shows distributions of final returns and downside-risk measures, including value at risk (VaR) and conditional value at risk (CVaR). The resulting distributions make the uncertainty visible rather than hiding it in a single forecast. While the project is still a research prototype running locally on my computer, it allows me to experiment with different scenarios and explore how market conditions might influence financial risk. The model has not been validated for predictive accuracy in live markets; the outputs are exploratory scenarios, not investment forecasts.",
    "roles": [
      "Python",
      "Diffusion models",
      "Risk analysis",
      "Scenario UI"
    ],
    "disciplines": [
      "Quantitative finance",
      "Applied ML"
    ],
    "result": "30 days",
    "resultLabel": "Example Simulated Scenario Horizon",
    "repo": null,
    "sourceStatus": "Local research prototype · no verified public repository",
    "image": "assets/finance-cinematic.webp",
    "imageLabel": "Concept illustration of branching market scenarios; real dashboard screenshots available in the controls below",
    "proofImage": "assets/finance-risk.webp",
    "proofLabel": "Actual displayed downside-risk dashboard",
    "hue": "#65BEDF",
    "visualType": "conceptual artwork"
  }
];
