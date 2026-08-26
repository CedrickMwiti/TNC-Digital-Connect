/* =============================================================
   TN AI — FRONTEND KNOWLEDGE + QUESTION/INTENT LIBRARY
   -------------------------------------------------------------
   This is the first-stage, frontend-only knowledge layer.
   It answers questions from the SAME datasets and app features
   used by the website. It does not invent live county information.

   Later: replace these local collections with a backend/database
   retrieval layer without changing the chatbot UI.
   ============================================================= */
(function(){
  const clean = v => String(v ?? '').replace(/\s+/g,' ').trim();
  const norm = v => clean(v).toLowerCase();
  const has = (q, terms) => terms.some(t => q.includes(t));
  const all = (q, terms) => terms.every(t => q.includes(t));

  const STOP = new Set(['the','and','for','with','are','can','you','how','what','where','which','show','find','need','from','near','about','tell','me','please','this','that','there','have','has','want','would','could','into','does','will','help','kwa','na','ni','ya','wa','wao','hii','hapo','nina','nataka','unaweza','nisaidie','je','gani','wapi','nini','vipi']);
  function tokens(q){
    return norm(q).replace(/[^a-z0-9\u00c0-\u024f\s-]/g,' ').split(/\s+/).filter(w=>w.length>=3 && !STOP.has(w));
  }
  function textOf(item){ return Object.values(item||{}).map(clean).join(' ').toLowerCase(); }
  function rank(collection,q,limit=6){
    const ts=tokens(q); if(!ts.length) return [];
    return collection.map(item=>({item,score:ts.reduce((n,t)=>n+(textOf(item).includes(t)?1:0),0)}))
      .filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,limit).map(x=>x.item);
  }
  const list = (arr, fn, join='\n\n') => arr.map(fn).join(join);

  function languageHint(q){
    // Prefer the shared, session-aware detector from script.js so the
    // knowledge layer and the rest of TN AI always agree on the language
    // of the conversation. Falls back to a small local keyword check if
    // that module hasn't loaded (e.g. this file used on its own).
    if(window.TNC_LANG && typeof window.TNC_LANG.resolve==='function') return window.TNC_LANG.resolve(q);
    if(has(q,['sahau','nenosiri','akaunti','msimbo','badili','hospitali','kazi','huduma','wapi','ninaweza','nawezaje','tafuta','nyumba','shamba','soko','usafiri','tukio','matukio','serikali','malalamiko','msaada'])) return 'sw';
    return 'en';
  }

  function accountAnswer(q){
    if(has(q,['forgot password','password forgot','forgot my password','reset password','change password','new password','lost password','cannot login','can not login','cant login','locked account','sahau nenosiri','nenosiri','badili nenosiri','weka upya nenosiri','nimesahau','siwezi kuingia','akaunti imefungwa'])){
      const sw=languageHint(q)==='sw';
      if(window.TN_LANGUAGE && typeof window.TN_LANGUAGE.openRecovery==='function') window.TN_LANGUAGE.openRecovery('',false);
      return sw
        ? 'Hakuna shida. Nimefungua hatua za kurejesha au kubadilisha nenosiri. Kwa usalama wako, usinitumie nenosiri lako la sasa. Tumia uthibitishaji kisha weka nenosiri jipya.'
        : 'No problem. I opened the password recovery/change flow. For your security, never send me your current password. Use the verification step and then create a new password.';
    }
    if(has(q,['sign up','signup','register','create account','new account','jinsi ya kujisajili','jisajili','fungua akaunti'])){
      return languageHint(q)==='sw'
        ? 'Unaweza kutumia Sign Up kutengeneza akaunti. Weka jina na nenosiri linalokidhi masharti yanayoonyeshwa. Hii ni current ya frontend; akaunti halisi itahitaji backend salama.'
        : 'Use Sign Up to create a account. Enter your name and a password meeting the displayed requirements. This is a frontend current; production accounts require a secure backend.';
    }
    if(has(q,['log out','logout','sign out','signout','ondoka','toka kwenye akaunti'])){
      return languageHint(q)==='sw' ? 'Fungua My Profile kisha chagua Log Out ili kutoka kwenye akaunti.' : 'Open My Profile and choose Log Out to sign out of the account.';
    }
    return null;
  }

  function appHelp(q){
    if(has(q,['what can you ask','what can i ask','what can tn ai do','what does tn ai do','help me','msaada','naweza kuuliza nini','tn ai inaweza kufanya nini'])){
      return languageHint(q)==='sw'
        ? 'Unaweza kuniuliza kuhusu kazi, internships, bursaries, tenders, mafundi na huduma, biashara, kilimo na masoko, nyumba/plots, usafiri, hospitali, matukio, huduma za kaunti, viongozi, matangazo, notifications, community concerns, profile na kurejesha nenosiri.'
        : 'You can ask me about jobs, internships, bursaries, tenders, skilled services, businesses, agriculture and markets, property, transport, healthcare, events, county services, leaders, announcements, notifications, community concerns, your profile and password recovery.';
    }
    if(has(q,['how do i search','search the app','use search','what can i search','nawezaje kutafuta','tafuta kwenye app'])){
      return languageHint(q)==='sw'
        ? 'Tumia search bar ya Home na andika unachotafuta, kama “electrician”, “job”, “hospital” au “house”. Unaweza pia kuchagua sub-county. Search ya current inaelekeza kwenye sehemu husika.'
        : 'Use the Home search bar and type what you need, such as “electrician”, “job”, “hospital” or “house”. You can also choose a sub-county. The current search routes you to the relevant section.';
    }
    if(has(q,['where is jobs','open jobs','jobs section','where are jobs','jobs page','wapi kazi','sehemu ya kazi'])) return languageHint(q)==='sw'?'Fungua Kazi na Fursa.':'Open Jobs & Opportunities.';
    if(has(q,['where is services','skills section','service providers','open services','wapi huduma','mafundi'])) return languageHint(q)==='sw'?'Fungua Ujuzi na Huduma.':'Open Skills & Services.';
    if(has(q,['where is marketplace','business section','open marketplace','marketplace page','wapi soko','biashara'])) return languageHint(q)==='sw'?'Fungua Biashara na Soko.':'Open Businesses & Marketplace.';
    if(has(q,['where is agriculture','agriculture section','open agriculture','farm section','wapi kilimo'])) return languageHint(q)==='sw'?'Fungua Kilimo na Masoko.':'Open Agriculture & Markets.';
    if(has(q,['where is property','property section','open property','houses section','wapi nyumba','ardhi'])) return languageHint(q)==='sw'?'Fungua Mali/Ardhi na Nyumba.':'Open Property.';
    if(has(q,['where is transport','transport section','open transport','matatu section','wapi usafiri'])) return languageHint(q)==='sw'?'Fungua Usafiri.':'Open Transport.';
    if(has(q,['where is healthcare','health section','open healthcare','hospital section','wapi hospitali'])) return languageHint(q)==='sw'?'Fungua Afya.':'Open Healthcare.';
    if(has(q,['where are events','events section','open events','upcoming events','wapi matukio'])) return languageHint(q)==='sw'?'Fungua Matukio na Jamii.':'Open Events & Community.';
    if(has(q,['where county services','county services page','open county services','wapi huduma za kaunti'])) return languageHint(q)==='sw'?'Fungua Huduma za Kaunti.':'Open County Services.';
    if(has(q,['where leaders','connect leaders','leader section','community concern','wapi viongozi','ripoti tatizo'])) return 'Open Connect With Your Leaders. You can also use the Community Concern form there.';
    if(has(q,['where emergency','emergency contacts','emergency page','wapi dharura'])) return 'Open Emergency & Important Contacts. Verify emergency details against authoritative current sources before relying on current data.';
    if(has(q,['notifications','alerts','my notifications','where notifications','wapi taarifa'])) return 'Open Notifications to view the current alerts and updates.';
    if(has(q,['profile','my profile','account profile','where profile','wasifu wangu'])) return 'Open My Profile for your account profile and account actions.';
    if(has(q,['dark mode','light mode','theme','night mode','mode ya usiku'])) return 'Use the app appearance/theme control if available in the current build. The chatbot should follow the app theme.';
    if(has(q,['install app','install on phone','add to home screen','pwa','offline','weak signal','fungua kama app'])) return 'The project is a PWA current. When hosted, it can be installed from a supported browser; the service worker caches core files for weak/no-signal use.';
    if(has(q,['mobile','phone','desktop','tablet'])) return 'The interface is designed to work across desktop and mobile layouts, with bottom navigation on mobile and a sidebar/top navigation structure on larger screens.';
    return null;
  }

  function healthcare(q){
    if(!has(q,['hospital','hospitals','clinic','doctor','medical','health','maternity','pharmacy','laboratory','lab','outpatient','dental','queue','ticket','appointment'])) return null;
    if(has(q,['queue','ticket','digital queue','get ticket','my ticket','line','waiting'])){
      return 'The Healthcare section contains a Digital Hospital Queue labeled as a local queue. You select a hospital and service, then the the app creates a local ticket, people-ahead count and estimated wait time. It is not connected to real hospitals.';
    }
    const matches=rank(HOSPITALS,q,5); const rows=matches.length?matches:HOSPITALS.slice(0,5);
    return 'Here is what the current website data shows for healthcare:\n\n'+list(rows,x=>`• ${x.name} — ${x.loc}\n  Services: ${x.services}`)+'\n\nThis is current directory information. Verify important medical and emergency details with the relevant facility.';
  }

  function jobs(q){
    if(!has(q,['job','jobs','employment','work','internship','intern','scholarship','bursary','tender','gig','opportunity','vacancy','career','youth fund','training'])) return null;
    const matches=rank(JOBS,q,7); const rows=matches.length?matches:JOBS.slice(0,7);
    return languageHint(q)==='sw' ? 'Nimepata nafasi hizi katika taarifa zilizopo kwenye tovuti:\n\n'+list(rows,x=>`• ${x.title}\n  ${x.loc} — ${x.pay}`)+'\n\nFungua Kazi na Fursa kuona orodha kamili. Hii ni taarifa ya mfano hadi iunganishwe na chanzo halisi.' : 'I found these opportunities in the current website data:\n\n'+list(rows,x=>`• ${x.title}\n  ${x.loc} — ${x.pay}`)+'\n\nOpen Jobs & Opportunities for the full listings. This is current data unless connected to a verified live source.';
  }

  function services(q){
    if(!has(q,['plumber','electrician','mechanic','tailor','welder','builder','carpenter','photographer','tutor','designer','artisan','service provider','services','fundisi','fundi'])) return null;
    const matches=rank(PROVIDERS,q,7); const rows=matches.length?matches:PROVIDERS.slice(0,7);
    return languageHint(q)==='sw' ? 'Nimepata watoa huduma hawa katika taarifa za tovuti:\n\n'+list(rows,x=>`• ${x.name} — ${x.service}\n  ${x.loc} — ⭐ ${Number(x.rating).toFixed(1)}${x.verified?' · Imethibitishwa':''}`)+'\n\nFungua Ujuzi na Huduma kuona orodha kamili. Taarifa hizi ni za mfano.' : 'I found these service providers in the current website data:\n\n'+list(rows,x=>`• ${x.name} — ${x.service}\n  ${x.loc} — ⭐ ${Number(x.rating).toFixed(1)}${x.verified?' · Verified':''}`)+'\n\nOpen Skills & Services to view the full directory. Provider information is current data.';
  }

  function businesses(q){
    if(!has(q,['shop','restaurant','business','marketplace','food','cafe','hardware','boutique','store','duka','biashara','mgahawa'])) return null;
    const matches=rank(BUSINESSES,q,7); const rows=matches.length?matches:BUSINESSES.slice(0,7);
    return languageHint(q)==='sw' ? 'Hizi ni biashara zinazolingana katika taarifa za tovuti:\n\n'+list(rows,x=>`• ${x.name} — ${x.type}, ${x.loc}\n  ${x.note}${x.promo?' — '+x.promo:''}`)+'\n\nFungua Biashara na Soko kuangalia orodha kamili.' : 'Here are matching businesses from the current website data:\n\n'+list(rows,x=>`• ${x.name} — ${x.type}, ${x.loc}\n  ${x.note}${x.promo?' — '+x.promo:''}`)+'\n\nOpen Businesses & Marketplace to browse the full directory.';
  }

  function agriculture(q){
    if(!has(q,['farm','farmer','agriculture','agri','produce','crop','fertiliser','fertilizer','livestock','buyer','dairy','agrovet','seeds','mbolea','mkulima','kilimo','mazao','soko'])) return null;
    const matches=rank(AGRI,q,7); const rows=matches.length?matches:AGRI.slice(0,7);
    return languageHint(q)==='sw' ? 'Hii ni taarifa ya kilimo iliyopo kwenye tovuti:\n\n'+list(rows,x=>`• ${x.name} — ${x.role}, ${x.loc}\n  ${x.produce} — ${x.note}`)+'\n\nFungua Kilimo na Masoko kuona orodha kamili. Taarifa za soko ni za mfano hadi ziunganishwe na chanzo halisi.' : 'Here is agriculture information currently fed into the website:\n\n'+list(rows,x=>`• ${x.name} — ${x.role}, ${x.loc}\n  ${x.produce} — ${x.note}`)+'\n\nOpen Agriculture & Markets for the full directory. Market information is local data unless connected to a verified live source.';
  }

  function property(q){
    if(!has(q,['house','rental','rent','plot','land','property','apartment','commercial','bedsitter','bungalow','nyumba','kiwanja','ardhi','pango'])) return null;
    const matches=rank(PROPERTY,q,7); const rows=matches.length?matches:PROPERTY.slice(0,7);
    return languageHint(q)==='sw' ? 'Hizi ni nyumba, ardhi au mali zinazolingana katika taarifa za tovuti:\n\n'+list(rows,x=>`• ${x.title} — ${x.loc}\n  ${x.price} — ${x.kind}`)+'\n\nFungua Mali/Ardhi na Nyumba kuona orodha kamili. Bei na matangazo haya ni ya mfano.' : 'Here are matching properties in the current website data:\n\n'+list(rows,x=>`• ${x.title} — ${x.loc}\n  ${x.price} — ${x.kind}`)+'\n\nOpen Property for the full listings. Prices and listings are current data.';
  }

  function transport(q){
    if(!has(q,['transport','matatu','boda','taxi','fare','delivery','courier','route','shuttle','usafiri','nauli','bodaboda'])) return null;
    const matches=rank(TRANSPORT,q,7); const rows=matches.length?matches:TRANSPORT.slice(0,7);
    return languageHint(q)==='sw' ? 'Hii ni taarifa ya usafiri iliyopo kwenye tovuti:\n\n'+list(rows,x=>`• ${x.name} — ${x.type}\n  ${x.route} — ${x.fare}`)+'\n\nFungua Usafiri kuona orodha kamili. Nauli ni taarifa za mfano.' : 'Here is the transport information currently fed into the website:\n\n'+list(rows,x=>`• ${x.name} — ${x.type}\n  ${x.route} — ${x.fare}`)+'\n\nOpen Transport for the full directory. Fares are current information.';
  }

  function events(q){
    if(!has(q,['event','events','festival','marathon','meeting','baraza','rally','talent','weekend','tukio','matukio'])) return null;
    const matches=rank(EVENTS,q,7); const rows=matches.length?matches:EVENTS.slice(0,7);
    return languageHint(q)==='sw' ? 'Matukio haya yameingizwa kwenye tovuti kwa sasa:\n\n'+list(rows,x=>`• ${x.title} — ${x.date}\n  ${x.type} — ${x.loc}`)+'\n\nFungua Matukio kwa maelezo zaidi. Hakikisha tarehe kabla ya kuyachukulia kuwa rasmi.' : 'These events are currently fed into the website:\n\n'+list(rows,x=>`• ${x.title} — ${x.date}\n  ${x.type} — ${x.loc}`)+'\n\nOpen Events for more details. Event dates should be verified before publication.';
  }

  function county(q){
    if(!has(q,['county service','county services','government','department','permit','license','licensing','roads','education','health department','trade','huduma za kaunti','serikali','idara'])) return null;
    const matches=rank(COUNTY_SERVICES,q,6); const rows=matches.length?matches:COUNTY_SERVICES.slice(0,6);
    return languageHint(q)==='sw' ? 'Taarifa za sasa za Huduma za Kaunti zina:\n\n'+list(rows,x=>`• ${x.dept}\n  ${x.desc}\n  Mawasiliano: ${x.contact}`)+'\n\nFungua Huduma za Kaunti kuchunguza huduma zilizopo za mfano.' : 'The current County Services data contains:\n\n'+list(rows,x=>`• ${x.dept}\n  ${x.desc}\n  Contact: ${x.contact}`)+'\n\nOpen County Services to explore the available current services.';
  }

  function leaders(q){
    if(!has(q,['leader','leaders','governor','senator','mca','member of parliament',' mp ','viongozi','gavana','seneta'])) return null;
    const matches=rank(LEADERS,q,5); const rows=matches.length?matches:LEADERS.slice(0,5);
    return 'The website currently contains these leadership placeholders:\n\n'+list(rows,x=>`• ${x.role}: ${x.name}\n  ${x.desc}`)+'\n\nThe displayed leadership names are explicitly placeholders and must be replaced with verified information before production.';
  }

  function emergency(q){
    if(!has(q,['emergency','police','fire','ambulance','red cross','emergency number','dharura','polisi','moto'])) return null;
    return 'The current contains an Emergency & Important Contacts directory. Because emergency numbers are safety-critical and the current project stores data locally, verify the displayed contacts against authoritative current sources before relying on them in an emergency.';
  }

  function community(q){
    if(!has(q,['report','complaint','concern','pothole','broken road','road damage','community concern','bad road','water leak','submit issue','ripoti','malalamiko','tatizo'])) return null;
    return 'You can use Connect With Your Leaders → Submit a Community Concern. The form supports a category, location, description and supporting photo where appropriate. The current shows a confirmation but does not send the report to a live county backend.';
  }

  function notices(q){
    if(!has(q,['announcement','announcements','water rationing','bursary application','road works','road notice','notice','matangazo','tangazo'])) return null;
    const matches=rank(ANNOUNCEMENTS,q,5); const rows=matches.length?matches:ANNOUNCEMENTS.slice(0,5);
    return languageHint(q)==='sw' ? 'Matangazo yaliyopo sasa kwenye tovuti:\n\n'+list(rows,x=>`• ${x.title}\n  ${x.body}`)+'\n\nHaya ni matangazo ya mfano na yanapaswa kuthibitishwa kabla ya kuchukuliwa kuwa rasmi.' : 'Current website announcements:\n\n'+list(rows,x=>`• ${x.title}\n  ${x.body}`)+'\n\nThese are current announcements and should be verified before being treated as official notices.';
  }

  function notifications(q){
    if(!has(q,['notification','notifications','alert','alerts','updates','taarifa','arifa'])) return null;
    return 'The Notifications section currently contains current alerts such as job matches, queue updates, community announcements and service responses. Open Notifications to view them.';
  }

  function privacy(q){
    if(!has(q,['password safe','password security','privacy','private','secure','security','data','nenosiri salama','faragha','usalama'])) return null;
    return 'Never send your current password to TN AI. Password recovery should use the secure verification flow. The current stores account information locally in the browser; production authentication must move to a secure backend.';
  }

  function profile(q){
    if(!has(q,['profile','my profile','account','saved','my applications','wasifu','akaunti'])) return null;
    return 'My Profile is the account area. In the current it shows your account profile and account actions such as Log Out; saved services and applications are stored on this device.';
  }

  function healthcareSafety(q){
    if(has(q,['ambulance','emergency medical','medical emergency','heart attack','bleeding','poison','unconscious'])) return 'For a real medical emergency, use verified local emergency services or the nearest appropriate facility. TN AI should not replace professional emergency care, and the current directory must be verified.';
    return null;
  }

  function crossSearch(q){
    const collections=[
      ['Jobs',JOBS],['Services',PROVIDERS],['Businesses',BUSINESSES],['Agriculture',AGRI],['Property',PROPERTY],['Transport',TRANSPORT],['Healthcare',HOSPITALS],['Events',EVENTS],['County Services',COUNTY_SERVICES]
    ];
    const found=[];
    collections.forEach(([label,c])=>rank(c,q,3).forEach(item=>found.push({label,item})));
    if(!found.length) return null;
    return languageHint(q)==='sw' ? 'Nimekagua taarifa zilizopo sasa kwenye Tharaka-Nithi Digital Connect na nimepata:\n\n'+found.slice(0,10).map(x=>`• ${x.label}: ${Object.values(x.item).slice(0,4).map(clean).join(' — ')}`).join('\n')+'\n\nNiulize swali maalum zaidi ili nipunguze matokeo.' : 'I searched the information currently fed into Tharaka-Nithi Digital Connect and found:\n\n'+found.slice(0,10).map(x=>`• ${x.label}: ${Object.values(x.item).slice(0,4).map(clean).join(' — ')}`).join('\n')+'\n\nAsk me a more specific question and I can narrow the results.';
  }

  function answer(query){
    const q=norm(query); if(!q) return null;
    const handlers=[accountAnswer,healthcareSafety,appHelp,healthcare,jobs,services,businesses,agriculture,property,transport,events,county,leaders,emergency,community,notices,notifications,privacy,profile];
    for(const fn of handlers){ const a=fn(q); if(a) return a; }
    if(has(q,['hello','hi','hey','good morning','good afternoon','good evening','habari','mambo','hujambo'])) return languageHint(q)==='sw' ? 'Habari! 👋 Mimi ni TN AI. Naweza kukusaidia kupata kazi, huduma, biashara, hospitali, nyumba, usafiri, kilimo, matukio na huduma za kaunti.' : 'Hello! 👋 I’m TN AI. I can help you find jobs, services, businesses, hospitals, property, transport, agriculture, events and county services.';
    return crossSearch(q);
  }

  // Expose a structured question library for future UI/admin tooling.
  const QUESTION_LIBRARY={
    account:['I forgot my password','How do I reset my password?','How do I change my password?','I cannot log in','How do I sign up?','How do I log out?'],
    jobs:['What jobs are available?','Are there internships?','Are there scholarships or bursaries?','Are there tenders?','Are there gigs?','Are there youth opportunities?','Show jobs in Chuka','What training is available?'],
    services:['Find a plumber','Find an electrician','Find a mechanic','Find a tailor','Find a tutor','Find a carpenter','Find a welder','Find a builder','Who provides photography?'],
    marketplace:['What businesses are listed?','Find a restaurant','Find a shop','Find a hardware','What is in the marketplace?'],
    agriculture:['Who is selling produce?','Where can I buy farm inputs?','Who buys grain?','Where can I sell milk?','What markets are listed?','Where can farmers get advisory services?'],
    property:['Find a house for rent','Find a plot','Find land','Find commercial space','How much is rent?','Show property in Chuka'],
    transport:['How do I travel from Chuka to Chogoria?','Find a taxi','Find a boda boda','What are the fares?','Find delivery services','What shuttles are available?'],
    healthcare:['Which hospitals are listed?','Which hospitals offer maternity?','Where is a pharmacy?','Which facilities have laboratory services?','How does the digital queue work?','How do I get a digital ticket?'],
    events:['What events are coming up?','What is happening this weekend?','When is the marathon?','Where is the next baraza?','What cultural events are listed?'],
    county:['What county services are available?','Which department handles roads?','Where can I ask about agriculture services?','What does the Trade department handle?','Where are education services listed?'],
    community:['How do I report a bad road?','How do I submit a community concern?','Can I report water problems?','How do I contact leaders?'],
    app:['What can TN AI do?','How do I search?','Where are notifications?','Where is My Profile?','Can I install the app?','Does it work offline?','How do I use it on my phone?']
  };

  window.TN_AI_KNOWLEDGE={answer,QUESTION_LIBRARY};
})();
