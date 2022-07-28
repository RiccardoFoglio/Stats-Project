document.addEventListener('DOMContentLoaded', () => {
  const url = "iflxml/20220078.xml"
  fetch(url)
  .then(response=>response.text())
  .then(data=>{
    const parser = new DOMParser()
    const xml = parser.parseFromString(data, "application/xml")
    
    buildScoreboard(xml)
    buildScoreByQuarters(xml)
    buildGeneralInfo(xml)
    buildReferees(xml)
  })
})

function createElementHTML(type, content, id, whereto){
  entry = document.createElement(type)
  entry.textContent = content
  if (id !== ''){
    entry.setAttribute('id', id)
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

  createElementHTML('td', teamV.getAttribute('name'), 'teamNameEntry', visScoreByQuarter)
  for(i=0; i<teamV.childNodes[1].attributes[0].value; i++){
    let scoreqrt = teamV.childNodes[1].attributes[1].value.split(',')[i]
    if (i===4){
      createElementHTML('th', 'OT', '', headScoreByQuarterTable)
    } else {
      createElementHTML('th', i+1, '', headScoreByQuarterTable)
    }
    createElementHTML('td', scoreqrt, 'scoreEntry', visScoreByQuarter)
  }
  createElementHTML('td', teamV.childNodes[1].attributes[2].value, 'finalScore', visScoreByQuarter)

  createElementHTML('td', teamH.getAttribute('name'), 'teamNameEntry', homeScoreByQuarter)
  for(i=0; i<teamH.childNodes[1].attributes[0].value; i++){
    let scoreqrt = teamH.childNodes[1].attributes[1].value.split(',')[i]
    createElementHTML('td', scoreqrt, 'scoreEntry', homeScoreByQuarter)
  }
  createElementHTML('td', teamH.childNodes[1].attributes[2].value, 'finalScore', homeScoreByQuarter)
  createElementHTML('th', 'SCORE', '', headScoreByQuarterTable)
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

