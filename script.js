document.addEventListener('DOMContentLoaded', () => {
  const url = "iflxml/20220644.xml"
  fetch(url)
  .then(response=>response.text())
  .then(data=>{
    const parser = new DOMParser()
    const xml = parser.parseFromString(data, "application/xml")
    
    buildScoreboard(xml)
    buildScoreByQuarters(xml)
    buildScoringSummary(xml)
    buildGeneralInfo(xml)
    buildReferees(xml)

    buildTotalStatsComplete(xml)
    buildTotalStatsCompact(xml)
  })
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////AUXILIARY FUNCTIONS////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function backToTop(){
  window.scrollTo({top: 0, behavior: 'smooth'})
}

function toggleText(id){
  var element = document.getElementById('contentSeparator'),
      bodyRect = document.body.getBoundingClientRect(),
      elemRect = element.getBoundingClientRect(),
      offset   = elemRect.top - bodyRect.top;

  window.scrollTo({top: offset  - 180, behavior: 'smooth'})
  allDivs = document.getElementsByClassName('contentDiv')
  for(i=0; i<allDivs.length; i++){
    if (allDivs.id !== id)
      allDivs[i].style.display = 'none';
  }
  var x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function toggleTextSingle(id){
  
  let allDivs = document.getElementsByClassName('totalsContainer')
  for(i=0; i<allDivs.length; i++){
    if (allDivs.id !== id)
      allDivs[i].style.display = 'none';
  }

  var x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function createElementHTML(type, content, whereto){
  const entry = document.createElement(type)
  entry.textContent = content
  whereto.appendChild(entry)
}

function createElementAttr(type, content, attr, val, whereto){
  const entry = document.createElement(type)
  entry.textContent = content
  if (attr !== '' && val !== ''){
    entry.setAttribute(attr, val)
  }
  whereto.appendChild(entry)
}

function refToReferee(x){
  switch (x) {
    case 'ref':
      value = 'Referee'
      break;
    case 'ump':
      value = 'Umpire'
      break;
    case 'line':
      value = 'Linesman'
      break;
    case 'lj':
      value = 'Line Judge'
      break;
    case 'bj':
      value = 'Back Judge'
      break;
    case 'fj':
      value = 'Field Judge'
      break;
    case 'sj':
      value = 'Side Judge'
      break;
    case 'sc':
      value = 'Scorer'
      break;
    default:
      value = 'ERRORE';
      break;
  }
  return value
}

function numToQRT(val){
  let pippo = ' '
  switch (val) {
    case '1':
      pippo = '1st'
      break;
    case '2':
      pippo = '2nd'
      break;
    case '3':
      pippo = '3rd'
      break;
    case '4':
      pippo = '4th'
      break;
    case '5':
      pippo = 'OT'
      break;
  }
  return pippo
}

function capitalize(str){
  const lower = str.toLowerCase()
  return str.charAt(0).toUpperCase() + lower.slice(1)
}

function playToString (attributes) {
  const playType = attributes.getNamedItem('type').value
  const yds = attributes.getNamedItem('yds').value
  const scorer = attributes.getNamedItem('scorer').value
  //possible null
  const passer = attributes.getNamedItem('passer')
  const scoreHow = attributes.getNamedItem('how')
  const patby = attributes.getNamedItem('patby')
  const pattype = attributes.getNamedItem('pattype')
  const patres = attributes.getNamedItem('patres')
  let play = ''

  switch (playType) {
    case 'TD':
      if (scoreHow.value === 'PASS') {
        play = `${scorer} ${yds} yd ${capitalize(scoreHow.value)} from ${passer.value} (${patby.value} ${capitalize(pattype.value)} ${capitalize(patres.value)})` 
      } else {
        play = `${scorer} ${yds} yd ${capitalize(scoreHow.value)} (${patby.value} ${capitalize(pattype.value)} ${capitalize(patres.value)})` 
      }
      return play
    case 'FG':
        play = `${scorer} ${yds} yds Field Goal`
      return play
    case 'SAF':
        play = `${scorer} ${yds} yds Safety`
        return play
    default:
      return 'ERRORE'
  }
}

function driveToString (attributes) {
  const plays = attributes.getNamedItem('plays')
  const drive = attributes.getNamedItem('drive')
  const top = attributes.getNamedItem('top')

  let driveString = ' '
  
  if (attributes.getNamedItem('plays') !== null){
    driveString = `${plays.value} plays, ${drive.value} yds, TOP: ${top.value}`
  } else {
    driveString = ' '
  }
  
  return driveString
}

function scoreToString (attributes) {
  const scoreH = attributes.getNamedItem('hscore').value
  const scoreV = attributes.getNamedItem('vscore').value

  return `${scoreH} - ${scoreV}`
}


function netAverage(type, fromH, fromV, retH, retV, whereto) {
  rowEntry = document.createElement('tr')
  createElementHTML('td', 'Net Yards Per '+type, rowEntry)
  let ydsH = parseFloat(fromH.getAttribute('yds'))
  let ydsV = parseFloat(fromV.getAttribute('yds'))
  let retYdsH, retYdsV, touchBackPartialH, touchBackPartialV, noH, noV, netH, netV
  if (retH !== '##EMPTY##') {
    retYdsH = parseFloat(retH.getAttribute('yds'))
  } else {
    retYdsH = 0
  }
  if (retV !== '##EMPTY##') {
    retYdsV = parseFloat(retV.getAttribute('yds'))
  } else {
    retYdsV = 0
  }

  if(fromH !== '##EMPTY##') {
    touchBackPartialH = 20 * parseFloat(fromH.getAttribute('tb'))
    noH = parseFloat(fromH.getAttribute('no'))
    netH = ydsH - retYdsV - touchBackPartialH
    createElementHTML('td', (netH / noH).toFixed(1), rowEntry)
  } else {
    createElementHTML('td', '0.0', rowEntry)
  }

  if(fromV !== '##EMPTY##') {
    touchBackPartialV = 20 * parseFloat(fromV.getAttribute('tb'))
    noV = parseFloat(fromV.getAttribute('no'))
    netV = ydsV - retYdsH - touchBackPartialV
    createElementHTML('td', (netV / noV).toFixed(1), rowEntry)
  } else {
    createElementHTML('td', '0.0', rowEntry)
  }

  whereto.appendChild(rowEntry)
}

function extractElem(what, from) {
  if(from.getElementsByTagName(what).length !== 0) {
    return from.getElementsByTagName(what)[0]
  } else {
    return '##EMPTY##'
  }
}

function singleDatumTitle(cont, wherefromH, wherefromV, attrib, whereto){
  let rowEntry = document.createElement('tr')
  createElementAttr('td', cont, 'class', 'titleCell', rowEntry)

  if(wherefromH !== '##EMPTY##'){
    createElementHTML('td', wherefromH.getAttribute(attrib), rowEntry)
  } else {
    createElementHTML('td', '0', rowEntry)
  }
  if(wherefromV !== '##EMPTY##'){
    createElementHTML('td', wherefromV.getAttribute(attrib), rowEntry)
  } else {
    createElementHTML('td', '0', rowEntry)
  }
  
  whereto.appendChild(rowEntry)
}

function singleDatum(cont, wherefromH, wherefromV, attrib, whereto){
  let rowEntry = document.createElement('tr')
  createElementHTML('td', cont, rowEntry)
  
  if(wherefromH !== '##EMPTY##'){
    createElementHTML('td', wherefromH.getAttribute(attrib), rowEntry)
  } else {
    createElementHTML('td', '0', rowEntry)
  }
  if(wherefromV !== '##EMPTY##'){
    createElementHTML('td', wherefromV.getAttribute(attrib), rowEntry)
  } else {
    createElementHTML('td', '0', rowEntry)
  }
  
  whereto.appendChild(rowEntry)
}

function doubleDatum(cont, wherefromH, wherefromV, a1, a2, whereto){

  let rowEntry = document.createElement('tr')
  let valH1, valH2, valV1, valV2
  
  if(wherefromH !== '##EMPTY##'){
    if(wherefromH.getAttribute(a1) === null){
    valH1 = 0
    } else {
      valH1 = wherefromH.getAttribute(a1)
    }
    if(wherefromH.getAttribute(a2) === null){
      valH2 = 0
    } else {
      valH2 = wherefromH.getAttribute(a2)
    }
  } else {
      valH1 = valH2 = 0
  }

  if (wherefromV !== '##EMPTY##') {
    if(wherefromV.getAttribute(a1) === null){
    valV1 = 0
    } else {
      valV1 = wherefromV.getAttribute(a1)
    }
    if(wherefromV.getAttribute(a2) === null){
      valV2 = 0
    } else {
      valV2 = wherefromV.getAttribute(a2)
    }
  } else {
    valV1 = valV2  = 0
  }
  
  createElementAttr('td', cont, 'class', 'titleCell', rowEntry)
  createElementHTML('td', `${valH1}-${valH2}`, rowEntry)
  createElementHTML('td', `${valV1}-${valV2}`, rowEntry)
  whereto.appendChild(rowEntry)
}

function doubleDatumOF(cont, wherefromH, wherefromV, a1, a2, whereto){
  let rowEntry = document.createElement('tr')
  createElementAttr('td', cont, 'class', 'titleCell', rowEntry)

  if(wherefromH !== '##EMPTY##'){
    createElementHTML('td', `${wherefromH.getAttribute(a1)} of ${wherefromH.getAttribute(a2)}`, rowEntry)
  } else {
    createElementHTML('td', '0 of 0', rowEntry)
  }
  if(wherefromV !== '##EMPTY##'){
    createElementHTML('td', `${wherefromV.getAttribute(a1)} of ${wherefromV.getAttribute(a2)}`, rowEntry)
  } else {
    createElementHTML('td', '0 of 0', rowEntry)
  }

  whereto.appendChild(rowEntry)
}

function tripleDatum(cont, wherefromH, wherefromV, a1, a2, a3, whereto){
let rowEntry = document.createElement('tr')
  let valH1, valH2, valH3, valV1, valV2, valV3
  
  if(wherefromH !== '##EMPTY##'){
    if(wherefromH.getAttribute(a1) === null){
    valH1 = 0
    } else {
      valH1 = wherefromH.getAttribute(a1)
    }
    if(wherefromH.getAttribute(a2) === null){
      valH2 = 0
    } else {
      valH2 = wherefromH.getAttribute(a2)
    }
    if(wherefromH.getAttribute(a3) === null){
      valH3 = 0
    } else {
      valH3 = wherefromH.getAttribute(a3)
    }
  } else {
      valH1 = valH2 = valH3 = 0
  }

  if (wherefromV !== '##EMPTY##') {
    if(wherefromV.getAttribute(a1) === null){
    valV1 = 0
    } else {
      valV1 = wherefromV.getAttribute(a1)
    }
    if(wherefromV.getAttribute(a2) === null){
      valV2 = 0
    } else {
      valV2 = wherefromV.getAttribute(a2)
    }
    if(wherefromV.getAttribute(a3) === null){
      valV3 = 0
    } else {
      valV3 = wherefromV.getAttribute(a3)
    }
  } else {
    valV1 = valV2 = valV3 = 0
  }
  
  createElementHTML('td', cont, rowEntry)
  createElementHTML('td', `${valH1}-${valH2}-${valH3}`, rowEntry)
  createElementHTML('td', `${valV1}-${valV2}-${valV3}`, rowEntry)
  whereto.appendChild(rowEntry)
}

function singleAvgDatum(cont, wherefromH, wherefromV, attUp, attOver, whereto){
  rowEntry = document.createElement('tr')
  createElementHTML('td', cont, rowEntry)
  if(wherefromH !== '##EMPTY##'){
    createElementHTML('td', parseFloat(wherefromH.getAttribute(attUp) / wherefromH.getAttribute(attOver)).toFixed(1), rowEntry)
  } else {
    createElementHTML('td','0.0', rowEntry)
  }
  if(wherefromV !== '##EMPTY##'){
    createElementHTML('td', parseFloat(wherefromV.getAttribute(attUp) / wherefromV.getAttribute(attOver)).toFixed(1), rowEntry)
  } else {
    createElementHTML('td','0.0', rowEntry)
  }
  whereto.appendChild(rowEntry)
}

function tripleDatumTitle(cont, wherefromH, wherefromV, a1, a2, a3, whereto){

  let rowEntry = document.createElement('tr')
  let valH1, valH2, valH3, valV1, valV2, valV3
  
  if(wherefromH !== '##EMPTY##'){
    if(wherefromH.getAttribute(a1) === null){
    valH1 = 0
    } else {
      valH1 = wherefromH.getAttribute(a1)
    }
    if(wherefromH.getAttribute(a2) === null){
      valH2 = 0
    } else {
      valH2 = wherefromH.getAttribute(a2)
    }
    if(wherefromH.getAttribute(a3) === null){
      valH3 = 0
    } else {
      valH3 = wherefromH.getAttribute(a3)
    }
  } else {
      valH1 = valH2 = valH3 = 0
  }

  if (wherefromV !== '##EMPTY##') {
    if(wherefromV.getAttribute(a1) === null){
    valV1 = 0
    } else {
      valV1 = wherefromV.getAttribute(a1)
    }
    if(wherefromV.getAttribute(a2) === null){
      valV2 = 0
    } else {
      valV2 = wherefromV.getAttribute(a2)
    }
    if(wherefromV.getAttribute(a3) === null){
      valV3 = 0
    } else {
      valV3 = wherefromV.getAttribute(a3)
    }
  } else {
    valV1 = valV2 = valV3 = 0
  }
  
  createElementAttr('td', cont, 'class', 'titleCell', rowEntry)
  createElementHTML('td', `${valH1}-${valH2}-${valH3}`, rowEntry)
  createElementHTML('td', `${valV1}-${valV2}-${valV3}`, rowEntry)
  whereto.appendChild(rowEntry)
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////BUILD FUNCTIONS//////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function buildScoreboard(x) {
  let team = x.getElementsByTagName('team')
  let linescore = x.getElementsByTagName('linescore')

  for(i=0; i<team.length; i++){
    const visOrHome = team[i].getAttribute('vh')
    const team_id = team[i].getAttribute('id')
    const team_name = team[i].getAttribute('name')
    const record = team[i].getAttribute('record')
    const score = linescore[i].getAttribute('score')
    const logopath = 'logos/'+team_id+'.jpg'
    
    if (visOrHome === 'V') {
      document.getElementById('visLogo').src = logopath
      document.getElementById('visName').textContent = team_name
      document.getElementById('visRecord').textContent = `(${record})`
      document.getElementById('visScore').textContent = score
      
    } else {
      document.getElementById('homeLogo').src = logopath
      document.getElementById('homeName').textContent = team_name
      document.getElementById('homeRecord').textContent = `(${record})`
      document.getElementById('homeScore').textContent = score
    }
  }
}

function buildScoreByQuarters(x){
  const headScoreByQuarterTable = document.getElementById('head-score-by-quarters-table')
  const homeScoreByQuarter = document.getElementById('home-team-scores-by-quarter')
  const visScoreByQuarter = document.getElementById('vis-team-scores-by-quarter')
  
  const teamV = x.getElementsByTagName('team')[0]
  const teamH = x.getElementsByTagName('team')[1]

  createElementAttr('td', teamV.getAttribute('name'), 'class', 'teamNameEntry', visScoreByQuarter)
  for(i=0; i<teamV.childNodes[1].attributes[0].value; i++){
    let scoreqrt = teamV.childNodes[1].attributes[1].value.split(',')[i]
    if (i===4){
      createElementHTML('th', 'OT', headScoreByQuarterTable)
    } else {
      createElementHTML('th', i+1, headScoreByQuarterTable)
    }
    createElementAttr('td', scoreqrt, 'class', 'scoreEntry', visScoreByQuarter)
  }
  createElementAttr('td', teamV.childNodes[1].attributes[2].value, 'class', 'finalScore', visScoreByQuarter)

  createElementAttr('td', teamH.getAttribute('name'), 'class', 'teamNameEntry', homeScoreByQuarter)
  for(i=0; i<teamH.childNodes[1].attributes[0].value; i++){
    let scoreqrt = teamH.childNodes[1].attributes[1].value.split(',')[i]
    createElementAttr('td', scoreqrt, 'class', 'scoreEntry', homeScoreByQuarter)
  }
  createElementAttr('td', teamH.childNodes[1].attributes[2].value, 'class', 'finalScore', homeScoreByQuarter)
  createElementHTML('th', 'SCORE', headScoreByQuarterTable)
}

function buildScoringSummary(x) {
  const scoringSummaryTable = document.getElementById('scoring-summary-table-body')
  const scores = x.getElementsByTagName('scores')[0].getElementsByTagName('score')

  let lastPrinted = 0
  let toPrintQRT = true

  for (let i = 0; i < scores.length; i++) {
    const attrArray = scores[i].attributes
    let scoreRow = document.createElement('tr')

    if(toPrintQRT || lastPrinted !== attrArray.getNamedItem('qtr').value){
      lastPrinted = attrArray.getNamedItem('qtr').value
      toPrintQRT = false
      createElementAttr('td', numToQRT(attrArray.getNamedItem('qtr').value), 'rowspan', '2', scoreRow)
    } else {
      createElementAttr('td', ' ', 'rowspan', '2', scoreRow)
    }
        
    createElementAttr('td', attrArray.getNamedItem('clock').value, 'rowspan', '2', scoreRow)

    const logoTd = document.createElement('td')
    const logoImg = document.createElement('img')
    logoImg.src = 'logos/' + attrArray[1].value + '.jpg'
    logoTd.appendChild(logoImg)
    
    logoTd.setAttribute('class', 'logoTeam')
    logoTd.setAttribute('rowspan', '2')
    scoreRow.appendChild(logoTd)

    const play = playToString(attrArray)
    const drive = driveToString(attrArray)
    const scoreVal = scoreToString(attrArray)
    
    if (drive !== ' '){
      createElementAttr('td', play, 'class', 'playDiv', scoreRow)
    } else {
      createElementAttr('td', play, 'class', 'playDivND', scoreRow)
    }

    const entry = document.createElement('td')
    entry.textContent = scoreVal
    entry.setAttribute('rowspan', '2')
    entry.setAttribute('class', 'scoreVal')
    scoreRow.appendChild(entry)
    scoringSummaryTable.appendChild(scoreRow)
    
    scoreRow = document.createElement('tr')
    if (drive !== ' '){
      entryDiv = document.createElement('td')
      entryDiv.textContent = drive
      entryDiv.setAttribute('class', 'driveDiv')
      scoreRow.appendChild(entryDiv)
    }
    scoringSummaryTable.appendChild(scoreRow)
  }
}

function buildGeneralInfo(x){
  const venue = x.getElementsByTagName('venue')[0]
  
  const date = venue.getAttribute('date')
  const location = venue.getAttribute('location')
  const stadium = venue.getAttribute('stadium')
  const start_time = venue.getAttribute('start')
  const end_time = venue.getAttribute('end')
  const duration = venue.getAttribute('duration')
  const attend = venue.getAttribute('attend')
  const temp = venue.getAttribute('temp')
  const wind = venue.getAttribute('wind')
  const weather = venue.getAttribute('weather')
  
  const dateDiv = document.getElementById('date')
  dateDiv.textContent = `Date: ${date}`

  const locationDiv = document.getElementById('location')
  locationDiv.textContent = `Location: ${location} - ${stadium}`

  const attendanceDiv = document.getElementById('attendance')
  attendanceDiv.textContent = `Attendance: ${attend}`

  let timeDiv = document.getElementById('start')
  timeDiv.textContent = `Start: ${start_time}`
  timeDiv = document.getElementById('end')
  timeDiv.textContent = `End: ${end_time}`
  timeDiv = document.getElementById('dur')
  timeDiv.textContent = `Duration: ${duration} h`

  const weatherDiv = document.getElementById('weather')
  weatherDiv.textContent = `Weather: ${weather} - ${wind} - ${temp}`
}

function buildReferees(x) {
  const officialList = document.getElementById('ref-list')
  const scorerList = document.getElementById('scorer-list')

  const officials = x.getElementsByTagName('officials')[0]
  let refLi
  for(j=0; j<officials.attributes.length-1; j++){
    refLi = document.createElement('li')
    refLi.textContent = `${refToReferee(officials.attributes[j].name)}: ${officials.attributes[j].value}`
    officialList.appendChild(refLi)
  }

  refLi = document.createElement('li')
  refLi.textContent = `${officials.attributes[officials.attributes.length-1].value}`
  scorerList.appendChild(refLi)
}

function buildTotalStatsComplete(x) {
  
  const teamH = x.getElementsByTagName('team')[1]
  const teamV = x.getElementsByTagName('team')[0]

  createElementHTML('th', teamH.getAttribute('id'), document.getElementById('teamTotalsComplete-table-head'))
  createElementHTML('th', teamV.getAttribute('id'), document.getElementById('teamTotalsComplete-table-head'))

  const totalsH = teamH.getElementsByTagName('totals')[0]
  const totalsV = teamV.getElementsByTagName('totals')[0]

  let rowEntry
  const contentTable = document.getElementById('teamTotalsComplete-table-body')

  const firstdownsV = extractElem('firstdowns', totalsV)
  const penaltiesV = extractElem('penalties', totalsV)
  const conversionsV = extractElem('conversions', totalsV)
  const fumblesV = extractElem('fumbles', totalsV)
  const miscV = extractElem('misc', totalsV)
  const redzoneV = extractElem('redzone', totalsV)
  const rushV = extractElem('rush', totalsV)
  const passV = extractElem('pass', totalsV)
  const puntV = extractElem('punt', totalsV)
  const koV = extractElem('ko', totalsV)
  const fgV = extractElem('fg', totalsV)
  const patV = extractElem('pat', totalsV)
  const defenseV = extractElem('defense', totalsV)
  const krV = extractElem('kr', totalsV)
  const prV = extractElem('pr', totalsV)
  const irV = extractElem('ir', totalsV)

  const firstdownsH = extractElem('firstdowns', totalsH)
  const penaltiesH = extractElem('penalties', totalsH)
  const conversionsH = extractElem('conversions', totalsH)
  const fumblesH = extractElem('fumbles', totalsH)
  const miscH = extractElem('misc', totalsH)
  const redzoneH = extractElem('redzone', totalsH)
  const rushH = extractElem('rush', totalsH)
  const passH= extractElem('pass', totalsH)
  const puntH = extractElem('punt', totalsH)
  const koH = extractElem('ko', totalsH)
  const fgH= extractElem('fg', totalsH)
  const patH = extractElem('pat', totalsH)
  const defenseH = extractElem('defense', totalsH)
  const krH = extractElem('kr', totalsH)
  const prH = extractElem('pr', totalsH)
  const irH = extractElem('ir', totalsH)

  singleDatumTitle('FIRST DOWNS', firstdownsH, firstdownsV, 'no', contentTable)
  singleDatum('Rushing', firstdownsH, firstdownsV, 'rush', contentTable)
  singleDatum('Passing', firstdownsH, firstdownsV, 'pass', contentTable)
  singleDatum('Penalty', firstdownsH, firstdownsV, 'penalty', contentTable)
  singleDatumTitle('NET YARDS RUSHING', rushH, rushV, 'yds', contentTable)
  singleDatum('Rushing Attempts', rushH, rushV, 'att', contentTable)
  singleAvgDatum('Average Per Rush', rushH, rushV, 'yds', 'att', contentTable)
  singleDatum('Rushing TDs', rushH, rushV, 'td', contentTable)
  singleDatum('Yds Gained Rushing', rushH, rushV, 'gain', contentTable)
  singleDatum('Yds Lost Rushing', rushH, rushV, 'loss', contentTable)
  singleDatumTitle('NET YARDS PASSING', passH, passV, 'yds', contentTable)
  tripleDatum('Comp-Att-Int', passH, passV, 'comp', 'att', 'int', contentTable)
  singleAvgDatum('Average Per Attempt', passH, passV, 'yds', 'att', contentTable)
  singleAvgDatum('Average Per Completition', passH, passV, 'yds', 'comp', contentTable)
  singleDatum('Passing TDs', passH, passV, 'td', contentTable)

  rowEntry = document.createElement('tr')
  createElementAttr('td', 'TOTAL OFFENSE', 'class', 'titleCell', rowEntry)
  createElementHTML('td', parseFloat(rushH.getAttribute('yds'))+ parseFloat(passH.getAttribute('yds')), rowEntry)
  createElementHTML('td', parseFloat(rushV.getAttribute('yds'))+ parseFloat(passV.getAttribute('yds')), rowEntry)
  contentTable.appendChild(rowEntry)

  rowEntry = document.createElement('tr')
  createElementHTML('td', 'Total Offense Plays', rowEntry)
  createElementHTML('td', parseFloat(rushH.getAttribute('att'))+ parseFloat(passH.getAttribute('att')), rowEntry)
  createElementHTML('td', parseFloat(rushV.getAttribute('att'))+ parseFloat(passV.getAttribute('att')), rowEntry)
  contentTable.appendChild(rowEntry)

  rowEntry = document.createElement('tr')
  createElementHTML('td', 'Average Gain Per Play', rowEntry)
  let totydsH = parseFloat(rushH.getAttribute('yds')) + parseFloat(passH.getAttribute('yds'))
  let totydsV = parseFloat(rushV.getAttribute('yds')) + parseFloat(passV.getAttribute('yds'))
  let totplaysV = parseFloat(rushH.getAttribute('att')) + parseFloat(passH.getAttribute('att'))
  let totplaysH = parseFloat(rushV.getAttribute('att')) + parseFloat(passV.getAttribute('att'))
  createElementHTML('td', (totydsH / totplaysH).toFixed(1), rowEntry)
  createElementHTML('td', (totydsV / totplaysV).toFixed(1), rowEntry)
  contentTable.appendChild(rowEntry)

  doubleDatum('FUMBLES: Num-Lost', fumblesH, fumblesV, 'no', 'lost', contentTable)
  doubleDatum('PENALTIES: Num-Lost', penaltiesH, penaltiesV, 'no', 'yds', contentTable)
  doubleDatum('PUNTS: Yds', puntH, puntV, 'no', 'yds', contentTable)
  singleAvgDatum('Average Yards Per Punt', puntH, puntV, 'yds', 'no', contentTable)
  netAverage('Punt', puntH, puntV, prH, prV, contentTable)
  singleDatum('Inside 20', puntH, puntV, 'inside20', contentTable)
  singleDatum('+50 Yards', puntH, puntV, 'plus50', contentTable)
  singleDatum('Touchbacks', puntH, puntV, 'tb', contentTable)
  singleDatum('Fair Catches', puntH, puntV, 'fc', contentTable)
  doubleDatum('KICKOFF - YARDS', koH, koV, 'no', 'yds', contentTable)
  singleAvgDatum('Average Yards Per Kickoff', koH, koV, 'yds', 'no', contentTable)
  netAverage('Kickoff', koH, koV, krH, krV, contentTable)
  singleDatum('Touchbacks', koH, koV, 'tb', contentTable)
  tripleDatumTitle('PUNT RETURNS: Num-Yards-TD', prH, prV, 'no', 'yds', 'td', contentTable)
  singleAvgDatum('Average Per Return', prH, prV, 'yds', 'no', contentTable)
  tripleDatumTitle('KICKOFF RETURNS: Num-Yards-TD', krH, krV, 'no', 'yds', 'td', contentTable)
  singleAvgDatum('Average Per Return', krH, krV, 'yds', 'no', contentTable)
  tripleDatumTitle('INTERCEPTIONS: Num-Yards-TD', irH, irV, 'no', 'yds', 'td', contentTable)
  tripleDatumTitle('FUMBLE RETURNS: Num-Yards-TD', defenseH, defenseV, 'fr', 'fryds', 'frtd', contentTable)
  singleDatumTitle('MISCELLANEOUS Yards', miscH, miscV, 'yds', contentTable)
  singleDatumTitle('POSSESSION', miscH, miscV, 'top', contentTable)

  const numOfQrts = x.getElementsByTagName('plays')[0].getElementsByTagName('qtr').length
  for(i=0; i<numOfQrts; i++){
    const qrtH = x.getElementsByTagName('plays')[0].getElementsByTagName('qtr')[i].getElementsByTagName('qtrsummary')[1]
    const qrtV = x.getElementsByTagName('plays')[0].getElementsByTagName('qtr')[i].getElementsByTagName('qtrsummary')[0]
    const miscByQrtH = qrtH.getElementsByTagName('misc')[0]
    const miscByQrtV = qrtV.getElementsByTagName('misc')[0]   

    switch (i) {
      case 0:
        singleDatum('1st Quarter', miscByQrtH, miscByQrtV, 'top', contentTable)
        break;
      case 1:
        singleDatum('2nd Quarter', miscByQrtH, miscByQrtV, 'top', contentTable)
        break;
      case 2:
        singleDatum('3rd Quarter', miscByQrtH, miscByQrtV, 'top', contentTable)
        break;
      case 3:
        singleDatum('4th Quarter', miscByQrtH, miscByQrtV, 'top', contentTable)
        break;
      case 4:
        singleDatum('Overtime', miscByQrtH, miscByQrtV, 'top', contentTable)
      default:
        break;
    }
  }

  doubleDatumOF('THIRD-DOWN Conversions', conversionsH, conversionsV, 'thirdconv', 'thirdatt', contentTable)
  doubleDatumOF('FOURTH-DOWN Conversions', conversionsH, conversionsV, 'fourthconv', 'fourthatt', contentTable)
  doubleDatum('RED-ZONE Scores-Chances', redzoneH, redzoneV, 'scores', 'att', contentTable)
  doubleDatum('SACKS: Num-Yards', defenseH, defenseV, 'sacks', 'sackyds', contentTable)
  doubleDatum('PAT Kicks', patH, patV, 'kickmade', 'kickatt', contentTable)
  doubleDatum('FIELD GOALS', fgH, fgV, 'made', 'att', contentTable)
}

function buildTotalStatsCompact(x) {

  const teamH = x.getElementsByTagName('team')[1]
  const teamV = x.getElementsByTagName('team')[0]

  createElementHTML('th', teamH.getAttribute('id'), document.getElementById('teamTotalsCompact-table-head'))
  createElementHTML('th', teamV.getAttribute('id'), document.getElementById('teamTotalsCompact-table-head'))

  const totalsH = teamH.getElementsByTagName('totals')[0]
  const totalsV = teamV.getElementsByTagName('totals')[0]

  let rowEntry
  const contentTable = document.getElementById('teamTotalsCompact-table-body')

  const firstdownsV = extractElem('firstdowns', totalsV)
  const penaltiesV = extractElem('penalties', totalsV)
  const conversionsV = extractElem('conversions', totalsV)
  const fumblesV = extractElem('fumbles', totalsV)
  const miscV = extractElem('misc', totalsV)
  const redzoneV = extractElem('redzone', totalsV)
  const rushV = extractElem('rush', totalsV)
  const passV = extractElem('pass', totalsV)
  const puntV = extractElem('punt', totalsV)
  const defenseV = extractElem('defense', totalsV)
  const krV = extractElem('kr', totalsV)
  const prV = extractElem('pr', totalsV)
  const irV = extractElem('ir', totalsV)

  const firstdownsH = extractElem('firstdowns', totalsH)
  const penaltiesH = extractElem('penalties', totalsH)
  const conversionsH = extractElem('conversions', totalsH)
  const fumblesH = extractElem('fumbles', totalsH)
  const miscH = extractElem('misc', totalsH)
  const redzoneH = extractElem('redzone', totalsH)
  const rushH = extractElem('rush', totalsH)
  const passH= extractElem('pass', totalsH)
  const puntH = extractElem('punt', totalsH)
  const defenseH = extractElem('defense', totalsH)
  const krH = extractElem('kr', totalsH)
  const prH = extractElem('pr', totalsH)
  const irH = extractElem('ir', totalsH)

  singleDatum('First Downs', firstdownsH, firstdownsV, 'no', contentTable)
  doubleDatum('Rushes - Yards (NET)', rushH, rushV, 'att', 'yds', contentTable)
  singleDatum('Passing Yards (NET)', passH, passV, 'yds', contentTable)
  tripleDatum('Passes Comp-Att-Int', passH, passV, 'comp', 'att', 'int', contentTable)

  let totydsH = parseFloat(rushH.getAttribute('yds'))+ parseFloat(passH.getAttribute('yds'))
  let totydsV = parseFloat(rushV.getAttribute('yds'))+ parseFloat(passV.getAttribute('yds'))
  let totplaysH = parseFloat(rushH.getAttribute('att'))+ parseFloat(passH.getAttribute('att'))
  let totplaysV = parseFloat(rushV.getAttribute('att'))+ parseFloat(passV.getAttribute('att'))

  rowEntry = document.createElement('tr')
  createElementHTML('td', 'Total Offense Plays-Yards', rowEntry)
  createElementHTML('td', `${totplaysH}-${totydsH}`, rowEntry)
  createElementHTML('td', `${totplaysV}-${totydsV}`, rowEntry)
  contentTable.appendChild(rowEntry)

  doubleDatum('Fumble Returns-Yards', defenseH, defenseV, 'fr', 'fryds', contentTable)
  doubleDatum('Punt Returns-Yards', prH, prV, 'no', 'yds', contentTable)
  doubleDatum('Kickoff Returns-Yards', krH, krV, 'no', 'yds', contentTable)
  doubleDatum('Interception Returns-Yards', irH, irV, 'no', 'yds', contentTable)

  rowEntry = document.createElement('tr')
  createElementHTML('td', 'Punts (Number-Avg)', rowEntry)
  if(puntH !== '##EMPTY##'){
    const numH = puntH.getAttribute('no')
    let avgH = parseFloat(puntH.getAttribute('yds') / numH)
    createElementHTML('td', `${numH}-${avgH.toFixed(1)}`, rowEntry)
  } else {
    createElementHTML('td','0-0', rowEntry)
  }
  if(puntV !== '##EMPTY##'){
    let numV = puntH.getAttribute('no')
    let avgV = parseFloat(puntV.getAttribute('yds') / numV)
    createElementHTML('td', `${numV}-${avgV.toFixed(1)}`, rowEntry)
  } else {
    createElementHTML('td','0-0', rowEntry)
  }
  contentTable.appendChild(rowEntry)

  doubleDatum('Fumbles-Lost', fumblesH, fumblesV, 'no', 'lost', contentTable)
  doubleDatum('Penalties-Yards', penaltiesH, penaltiesV, 'no', 'yds', contentTable)
  singleDatumTitle('Possession', miscH, miscV, 'top', contentTable)
  doubleDatumOF('Third-Down Conversions', conversionsH, conversionsV, 'thirdconv', 'thirdatt', contentTable)
  doubleDatumOF('Fourth-Down Conversions', conversionsH, conversionsV, 'fourthconv', 'fourthatt', contentTable)
  doubleDatum('Red-Zone Scores-Chances', redzoneH, redzoneV, 'scores', 'att', contentTable)
  doubleDatum('Sacks By: Num-Yards', defenseH, defenseV, 'sacks', 'sackyds', contentTable)
}
