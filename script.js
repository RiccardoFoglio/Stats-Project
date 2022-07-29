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
  console.log(allDivs[1])
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
  const type = attributes.getNamedItem('type')

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
  const headScoringSummary = document.getElementById('head-scoring-summary')
  
  const scores = x.getElementsByTagName('scores')[0].getElementsByTagName('score')
  const idTeamH = x.getElementsByTagName('team')[1].getAttribute('id')
  const idTeamV = x.getElementsByTagName('team')[0].getAttribute('id')

  createElementHTML('th', `${idTeamH} - ${idTeamV}`, headScoringSummary)

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
  let divBox = document.getElementById('general-info')

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
  officialList = document.getElementById('ref-list')

  officials = x.getElementsByTagName('officials')[0]

  for(j=0; j<officials.attributes.length; j++){
    const refLi = document.createElement('li')
    refLi.textContent = `${refToReferee(officials.attributes[j].name)}: ${officials.attributes[j].value}`
    officialList.appendChild(refLi)
  }
}

