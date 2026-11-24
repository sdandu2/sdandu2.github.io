export const insights = {
  exchangecore: {
    question: 'How can I make an exchange matching engine fast while still processing orders in the correct price–time order?',
    built: 'I implemented a C++20 matching core and wrote deterministic tests for the order-processing rules. I kept the market-data interface separate from the engine benchmark.',
    choice: 'I measured the matching core on its own because external market feeds and UI behavior would make it harder to tell what the engine itself was doing.',
    evidence: 'One recorded local workload measured 7.92 million operations per second. That is not a claim about exchange round-trip latency or production trading.',
    limitation: 'Engine-only benchmark; workload and hardware affect performance. The comparison illustration is conceptual.',
    proof: null
  },
  scanner: {
    question: 'Can I find unusual regions in a product image without having examples of every possible defect?',
    built: 'I created a Streamlit inspection interface around pretrained DINOv2 features and a PatchCore-inspired comparison with category-specific normal references.',
    choice: 'I used frozen thresholds and held-out images so the evaluation would not depend on adjusting settings after looking at the test results.',
    evidence: '701 official held-out images; the separate CPU audit reproduced 1,402 of 1,402 frozen alert decisions. This confirms repeatability for that audit, not perfect detection.',
    limitation: 'A research prototype, not a safety-certified manufacturing system. Anomaly scores are not defect probabilities.',
    proof: 'assets/scanner-inspection.webp'
  },
  evidencesearch: {
    question: 'How can I find a relevant paper when the paper uses different words from my question?',
    built: 'I built a browser-based search interface that combines keyword and semantic retrieval, fuses the candidates and reranks them across five subject areas.',
    choice: 'I combined two ways of retrieving documents before reranking them, because a keyword-only or embedding-only search can miss different kinds of relevant papers.',
    evidence: 'One internal held-out SciFact configuration recorded nDCG@10 of 0.6953. That describes document relevance ranking, not factual verification.',
    limitation: 'Search relevance does not establish the scientific correctness of the retrieved papers. Full source-corpus deployment is distinct from a research prototype.',
    proof: null
  },
  transitpulse: {
    question: 'How can I show vehicle locations on a map without making historical observations look live?',
    built: 'I created a WMATA collector, PostgreSQL history store, FastAPI service and React mapping interface for exploring time-stamped vehicle observations.',
    choice: 'I keep capture times and saved positions visible instead of drawing invented movement between observations.',
    evidence: 'One captured interface shows 780 recorded positions. These are historical observations from a saved snapshot, not simultaneous live locations.',
    limitation: 'Not a live-movement simulation. Reliability characteristics depend on the local test setup and the upstream feed.',
    proof: 'assets/transit-map.webp'
  },
  quantumoptlab: {
    question: 'Does adding QAOA circuit depth improve the result enough to justify the additional noise and circuit cost?',
    built: 'I used Qiskit and Qiskit Aer to study Max-Cut instances under simulated noise, and built a browser-based atlas to review the experiments.',
    choice: 'I compared a learned depth selector with a simpler gate-budget rule because I wanted to know whether the extra complexity actually helped.',
    evidence: '720 locked-test Aer executions were documented. On 20 held-out graphs, the learned selector did not outperform the simpler gate-budget rule.',
    limitation: 'Synthetic-noise simulations on small graph families. No physical quantum processor measurements or demonstrated quantum advantage.',
    proof: 'assets/quantum-hero.webp'
  },
  'simshift-q': {
    question: 'Will a model that forecasts simulated entangled-pair deliveries still work when network conditions change?',
    built: 'I evaluated a two-stage forecaster against direct baselines using simulated quantum-network runs.',
    choice: 'I treated complete simulation runs as the evaluation units because heavily overlapping windows are not independent examples.',
    evidence: 'Across 300 archived runs, the two-stage MAE was approximately 0.936 versus 0.956 for a direct approach. The paired uncertainty included zero improvement.',
    limitation: 'Simulated network conditions, not measurements from a physical quantum network; the numerical difference does not prove superiority.',
    proof: null
  }
};

export const financeNotes = {
  question: 'How do economic assumptions change the distribution of plausible market scenarios?',
  built: 'I built a research interface where I can adjust economic assumptions, generate conditional 30-day market scenarios, and compare the simulated paths under different regimes.',
  choice: 'I wanted to look beyond a single predicted path and compare the broader distribution of outcomes, including downside-risk measures such as VaR and CVaR.',
  evidence: 'The interface shows a 30-day example scenario horizon and visualizations for simulated paths, final return distributions, and downside-risk measures.',
  limitation: 'This is still a local research prototype. I have not yet established how accurately the model predicts real market behavior, so I treat the generated scenarios as possibilities to explore rather than reliable forecasts.',
  proof: 'assets/finance-risk.webp'
};

export const frontendNotes = {
  question: 'How do you make an engineering portfolio interactive without drifting away from the actual work?',
  built: 'I built this site as an interface for exploring projects, engineering notes, and the story behind how my interests developed over time.',
  choice: 'I wanted the visuals to make the site more engaging, but I also wanted the text, the results, and the boundaries around those results to stay clear and direct.',
  evidence: 'The site lets visitors move through the journey, inspect the project network, and open project-specific engineering notes without losing the context of what each result does and does not show.',
  limitation: 'The portfolio is still an evolving personal website rather than a production product with a formal accessibility or performance audit.',
  proof: null
};
