(()=>{
// Portfolio assistant: private, browser-only replies grounded in this website.
const chatToggle=document.getElementById('chat-toggle');
const chatPanel=document.getElementById('portfolio-chat');
const chatMessages=document.getElementById('chat-messages');
const chatQuestion=document.getElementById('question');
const chatSend=document.getElementById('chat-send');
const chatQuickQuestions=document.getElementById('chat-quick-questions');
const chatWelcome=chatMessages.firstElementChild.cloneNode(true);
const portfolioMail='alagu.karthik17@gmail.com';

function openChat(){
  chatPanel.hidden=false;
  chatToggle.setAttribute('aria-expanded','true');
  chatQuestion.focus({preventScroll:true});
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
function closeChat(){
  chatPanel.hidden=true;
  chatToggle.setAttribute('aria-expanded','false');
  chatToggle.focus({preventScroll:true});
}
chatToggle.addEventListener('click',()=>chatPanel.hidden?openChat():closeChat());
document.getElementById('chat-close').addEventListener('click',closeChat);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!chatPanel.hidden)closeChat();});
function updateComposer(){
  chatSend.disabled=!chatQuestion.value.trim();
  chatQuestion.style.height='auto';
  chatQuestion.style.height=Math.min(chatQuestion.scrollHeight,120)+'px';
}
chatQuestion.addEventListener('input',updateComposer);
chatQuestion.addEventListener('keydown',event=>{
  if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitChat();}
});
function addChatLine(who,message,link,reaction=false){
  const row=document.createElement('div');
  row.className='chat-line chat-line--'+who;
  if(who==='bot'){
    const avatar=document.createElement('span');avatar.className='chat-message-avatar';avatar.setAttribute('aria-hidden','true');const avatarImg=document.createElement('img');avatarImg.src='assets/chat-smiley.png';avatarImg.alt='';avatar.append(avatarImg);row.append(avatar);
  }
  const bubble=document.createElement('div');bubble.className='chat-bubble';
  if(reaction){
    const sticker=document.createElement('div');sticker.className='chat-reaction';sticker.setAttribute('aria-label','Karthik says nope');
    const emoji=document.createElement('span');emoji.className='chat-reaction-emoji';emoji.textContent='🙃';
    const words=document.createElement('span');words.className='chat-reaction-words';words.textContent='NAH, WE GOOD';
    sticker.append(emoji,words);bubble.append(sticker);
  }
  const body=document.createElement('span');body.textContent=message;bubble.append(body);
  if(link){
    const action=document.createElement('a');action.className='chat-action';action.href=link.href.startsWith('#')?'index.html'+link.href:link.href;
    action.textContent=link.label+' ↗';
    if(link.href.startsWith('https://')){action.target='_blank';action.rel='noopener noreferrer';}
    bubble.append(action);
  }
  row.append(bubble);chatMessages.append(row);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
// Prewritten, self-contained portfolio knowledge. No external model or API key.

function offTopicResponse(q){
  if(/\b(suicide|self[- ]harm|hurt myself|kill myself|want to die)\b/i.test(q)){
    return {message:'If this is about your safety or someone else’s, please talk with a trusted person or local emergency service right now. This is only my prewritten portfolio assistant.'};
  }
  if(/\b(porn|nudes?|explicit sex|sexual content|rape|racial slur|hate speech|make (a )?bomb|explosives?|hack (an? |the )?(account|password|computer)|steal (data|passwords?|money)|make malware|doxx?|home address)\b/i.test(q)){
    return {message:'I keep this little portfolio chat focused on my projects, skills and engineering work. Try asking about one of those instead!',reaction:true};
  }
  if(/\b(fuck|shit|bitch|bastard|asshole|dumbass|idiot|stupid|loser|shut up|screw you|hate you|you suck|karthik sucks)\b/i.test(q)){
    return {message:'Let’s keep it friendly 😅 Ask me about what I’ve built or what I’m learning.',reaction:true};
  }
  return null;
}
function portfolioReply(raw){
  const q=raw.toLowerCase().replace(/[’]/g,"'").trim();
  const redir=offTopicResponse(q);
  if(redir)return redir;
  if(/\b(are you (a|an) (ai|bot)|are you real|are you human|(?:r u|are u|u r|u a|you are).{0,22}\b(?:ai|bot|human|real)|chatgpt|ai chatbot|who are you|who r u|karthikgpt)\b/.test(q))return {message:'I’m the prewritten portfolio version of Karthik, not a live AI or a real-time conversation with him. I answer in his voice using information from the site.'};
  if(/\b(hi|hey|hello|sup|yo|good morning|good evening)\b/.test(q)&&q.split(/\s+/).length<5)return {message:'Hey! I’m Karthik — well, my little prewritten portfolio assistant. Want to see my projects, skills, internship or achievements?'};
  if(/\b(thanks|thank you|tysm|thx)\b/.test(q))return {message:'You’re welcome! Want to explore another part of my portfolio?'};
  if(/\b(contact|email|reach|message|linkedin|hire|connect|collab|talk to|social)\b/.test(q))return {message:`You can contact me at ${portfolioMail}, or connect with me on LinkedIn.`,link:{label:'Contact me',href:'#contact'}};
  if(/\b(resume|cv|curriculum vitae|download pdf|download (it|file))\b/.test(q))return {message:'You can view or download my resume. It includes my education, achievements, technical skills and internship experience.',link:{label:'Open my resume (PDF)',href:'assets/karthik-resume.pdf'}};
  if(/\b(intern|internship|iwow|work experience|worked at|job|600|300|1200|lora|modbus|meter|esso)\b/.test(q))return {message:'I interned at iWOW Connections from April to August 2024. I configured 4G modems, IoT sensors and Modbus RTU devices, helped monitor meters over LoRa networks, and supported signal testing and documentation.',link:{label:'See my experience',href:'#about'}};
  if(/\b(awards?|prizes?|merit|director.s list|achievements?|honou?rs?|sinda|recognition|aeis)\b/.test(q))return {message:'My achievements include the Director’s List at NYP, two Director’s List awards at ITE, the ITE Certificate of Merit, the SINDA Excellence Awards 2025 and the AEIS Book Prize from ITE.',link:{label:'My achievements',href:'#about'}};
  if(/\b(tri[- ]?star|wheelchair|curb|engineering exploration|mobility|wheel attachment)\b/.test(q))return {message:'For my Engineering Exploration Project, my team explored a motorised tri-star wheel attachment to help wheelchair users overcome curbs. I worked on the switch, Arduino Uno and DC motor circuit, and took part in brainstorming and testing. We tested the concept with a small-scale prototype.',link:{label:'My engineering project',href:'#project-engineering-exploration'}};
  if(/\b(construction|fall detection|fall|slip|near[- ]?miss|safety|wearable|vest|data engineering project)\b/.test(q))return {message:'For my Data Engineering Project, my team built a wearable-sensor prototype to collect movement data and highlight potential slips, falls and near-misses. I developed the Main.py launcher that starts our Python data collection and processing scripts.',link:{label:'My data project',href:'#project-data-engineering'}};
  if(/\b(aws|cloud computing|ec2|s3 bucket|auto scaling|load balancer|rds|boto3)\b/.test(q))return {message:'In my Cloud Computing Development Project, I built an AWS-hosted music-store catalogue using EC2, an Application Load Balancer, Auto Scaling, RDS MySQL and S3. I also configured monitoring, budget alerts and Python health checks.',link:{label:'My Cloud project',href:'#project-cloud-computing'}};
  if(/\b(sustainable|smart home|plant care|thing speak|thingspeak|zigbee|home automation|energy saving)\b/.test(q))return {message:'I built the DHT11 ventilation and ultrasonic alert logic, helped integrate the Arduino code, and sent readings to ThingSpeak using Python. Our school prototype also included lighting and soil-moisture monitoring.',link:{label:'My IoT project',href:'#project-iot-sustainable-living'}};
  if(/\b(projects?|portfolio|built|build|work on|made|case stud)\b/.test(q))return {message:'I’m featuring four projects: NESSO construction-safety monitoring, the TRI-STAR wheelchair concept, a connected IoT household prototype, and an AWS-hosted music-store application. Each has its own project page.',link:{label:'Explore my projects',href:'#projects'}};
  if(/\b(higher nitec|ite|electronics|education|degree|diploma|nyp|polytechnic|stud(y|ies|ying)|school|course|qualification|graduate|secondary)\b/.test(q))return {message:'I’m studying for a Diploma in AI & Data Engineering at Nanyang Polytechnic. Before that, I completed Higher Nitec in Electronics Engineering at ITE, and I attended Christ Church Secondary School.',link:{label:'My education timeline',href:'#about'}};
  if(/\b(python|power bi|powerbi|mysql|sql|pandas|numpy|matplotlib|aws|machine learning|code|programming|skills?|tools?|technology|stack|arduino|raspberry|sensor|iot|ble|cloud|deep learning|nlp|computer vision)\b/.test(q))return {message:'I work with Python, Pandas, NumPy, Matplotlib, Power BI, Scikit-learn, Arduino (C/C++), Raspberry Pi, M5Stack, BLE, AWS Cloud and MySQL. I’m also learning more about Deep Learning, NLP and Computer Vision.',link:{label:'My skills & tools',href:'#about'}};
  if(/\b(interest|passion|motivat|why ai|artificial intelligence|data science|future|goal|aspir)\b/.test(q))return {message:'I enjoy exploring how AI, data and connected devices can turn practical ideas into useful things. That’s why I like learning by building projects.',link:{label:'More about me',href:'#about'}};
  if(/\b(hobb|free time|outside|fun|video games?|games?|books?|reading|shows?|movies?|spare time)\b/.test(q))return {message:'Outside of technology, I enjoy reading, watching shows and playing video games.'};
  if(/\b(name|karthik|who is he|about him|background|tell me about|about you|who you are)\b/.test(q))return {message:'I’m Palaniappan Alagu Karthik, an AI & Data Engineering student at Nanyang Polytechnic. I previously studied Electronics Engineering at ITE, and I enjoy AI, IoT and hands-on engineering projects.',link:{label:'More about me',href:'#about'}};
  return {message:'I don’t have a reliable answer to that in my portfolio notes yet. Try asking about my internship, projects, education, achievements or skills.',link:{label:'Explore my projects',href:'#projects'}};
}

function submitChat(value){
  const text=(typeof value==='string'?value:chatQuestion.value).trim().slice(0,350);
  if(!text)return;
  addChatLine('user',text);
  if(chatQuickQuestions)chatQuickQuestions.hidden=true;
  chatQuestion.value='';updateComposer();
  const response=portfolioReply(text);
  addChatLine('bot',response.message,response.link,response.reaction);
  chatQuestion.focus({preventScroll:true});
}
document.getElementById('question-form').addEventListener('submit',event=>{event.preventDefault();submitChat();});
chatQuickQuestions.querySelectorAll('[data-chat-question]').forEach(button=>button.addEventListener('click',()=>submitChat(button.dataset.chatQuestion)));
document.getElementById('chat-reset').addEventListener('click',()=>{
  chatMessages.replaceChildren(chatWelcome,chatQuickQuestions);
  chatQuickQuestions.hidden=false;chatQuestion.value='';updateComposer();chatQuestion.focus({preventScroll:true});
});
updateComposer();


})();
