const card = ({label='',title='',subtitle='',body='',kind=''}) => `
  <article class="journey-media-card ${kind}">
    <div class="journey-media-art" aria-hidden="true"></div>
    <div class="journey-media-copy">
      ${label ? `<span class="journey-media-label">${label}</span>` : ''}
      ${title ? `<h4>${title}</h4>` : ''}
      ${subtitle ? `<p class="journey-media-subtitle">${subtitle}</p>` : ''}
      ${body ? `<p class="journey-media-body">${body}</p>` : ''}
    </div>
  </article>`;

function uic(){
  return `<div class="journey-scene-board scene-uic">
    <div class="journey-scene-gallery two-up">
      ${card({label:'UIC', title:'Early undergraduate work', subtitle:'University of Illinois Chicago', body:'A campus-inspired visual anchor for where my interest in data started.', kind:'art-uic'})}
      ${card({label:'DATA EXPLORATION', title:'Early analysis work', subtitle:'COVID-era datasets & chart reading', body:'Learning that making a graph is easier than explaining what it really shows.', kind:'art-data'})}
    </div>
    <div class="journey-scene-caption">
      <strong>Beginning with questions.</strong>
      <p>Campus, coursework, and early data analysis gave me my first sense that good questions matter as much as the graph itself.</p>
    </div>
  </div>`;
}

function ensar(){
  return `<div class="journey-scene-board scene-ensar">
    <div class="journey-scene-gallery two-up">
      ${card({label:'ENSAR SOLUTIONS', title:'First internship', subtitle:'Structured datasets · early ML exposure', body:'Work across large datasets, image classification, and reinforcement learning.', kind:'art-ensar'})}
      ${card({label:'MODEL EVALUATION', title:'Looking past the score', subtitle:'Medical imaging & RL ideas', body:'Starting to care more about what a model learns and how it is evaluated.', kind:'art-eval'})}
    </div>
    <div class="journey-scene-caption"><strong>Work beyond the classroom.</strong><p>My first professional work expanded machine learning from coursework into real technical problems.</p></div>
  </div>`;
}

function komatsu(){
  return `<div class="journey-scene-board scene-komatsu">
    <div class="journey-scene-gallery two-up">
      ${card({label:'KOMATSU', title:'Workflow automation', subtitle:'Five data sources into one KPI flow', body:'A process that had to be useful to other people, not just correct on my screen.', kind:'art-pipeline'})}
      ${card({label:'REPORTING', title:'45% faster workflow', subtitle:'Operational impact', body:'A technical change mattered because it changed how people could use their time.', kind:'art-kpi'})}
    </div>
    <div class="journey-scene-caption"><strong>Dependable systems.</strong><p>This stage made me think more about the people using the system after I finish building it.</p></div>
  </div>`;
}

function umd(){
  return `<div class="journey-scene-board scene-umd">
    <div class="journey-scene-gallery two-up">
      ${card({label:'UMD', title:'Graduate ML study', subtitle:'Questions behind the result', body:'Why one method works better than another and how to test that fairly.', kind:'art-umd'})}
      ${card({label:'METHODS', title:'Exploring connections', subtitle:'ML · quantum · software', body:'Going deeper into one field kept opening doors to others.', kind:'art-connections'})}
    </div>
    <div class="journey-scene-caption"><strong>Deeper questions.</strong><p>Graduate school gave me room to explore how methods behave, not just whether a benchmark number went up.</p></div>
  </div>`;
}

function teckpulse(){
  return `<div class="journey-scene-board scene-teckpulse">
    <div class="journey-scene-gallery two-up">
      ${card({label:'TECKPULSE', title:'Training-system engineering', subtitle:'Data loading & parallel workflows', body:'A closer look at the software around machine learning.', kind:'art-train'})}
      ${card({label:'ITERATION', title:'30 min → 10 min', subtitle:'Per training epoch', body:'Making experiments easier to run changed what the team could try next.', kind:'art-speed'})}
    </div>
    <div class="journey-scene-caption"><strong>Engineering behind ML.</strong><p>I started seeing software engineering and machine learning as complementary interests rather than separate directions.</p></div>
  </div>`;
}

function projects(){
  return `<div class="journey-scene-board scene-projects">
    <div class="journey-scene-gallery mosaic">
      ${card({label:'EXCHANGECORE', title:'Trading rules', subtitle:'C++20 system build', kind:'art-exchange'})}
      ${card({label:'SCANNER', title:'Industrial inspection', subtitle:'Computer vision experiment', kind:'art-scanner'})}
      ${card({label:'EVIDENCESEARCH', title:'Research retrieval', subtitle:'Search + interface', kind:'art-search'})}
      ${card({label:'QUANTUM + FINANCE', title:'New questions', subtitle:'Simulation & scenario work', kind:'art-quant'})}
    </div>
    <div class="journey-scene-caption"><strong>Building to understand.</strong><p>Personal projects let me turn curiosity into systems I could test, question, and explain.</p></div>
  </div>`;
}

function robotics(){
  return `<div class="journey-scene-board scene-robotics">
    <div class="journey-scene-gallery two-up">
      ${card({label:'ROBOTICS', title:'Simulation-based navigation', subtitle:'Motion planning · sensing · control', body:'Exploring how a robot can reason about where it should move next.', kind:'art-robotics'})}
      ${card({label:'NEXT', title:'Learning from demonstrations', subtitle:'Vision + decision making', body:'Where I want to keep connecting ML, software, and robotics.', kind:'art-next'})}
    </div>
    <div class="journey-scene-caption"><strong>Current exploration.</strong><p>The next direction is still unfolding, which is part of what makes it interesting to me.</p></div>
  </div>`;
}

function dataQuality(){ return ensar(); }
function fastTraining(){ return teckpulse(); }

export const sceneMarkup = [uic(), ensar(), komatsu(), umd(), teckpulse(), projects(), robotics()];
export const sceneNames = ['THE BEGINNING','FIRST INDUSTRY WORK','OPERATIONAL IMPACT','DEEPER QUESTIONS','ENGINEERING + ML','INDEPENDENT PROJECTS','THE NEXT DIRECTION'];
