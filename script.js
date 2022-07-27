document.addEventListener('DOMContentLoaded', () => {
  const url = "xml/20220100.xml"
  fetch(url)
  .then(response=>response.text())
  .then(data=>{
    const parser = new DOMParser()
    const xml = parser.parseFromString(data, "application/xml")
    //document.getElementById('output').textContent = data
    
    buildScoreboard(xml)
    buildScoreByQuarters(xml)
    buildGeneralInfo(xml)
    buildReferees(xml)

  })
})


function buildGeneralInfo(x){
  let divBox = document.getElementById('general-info')

  const venue = x.getElementsByTagName('venue')

  for(let i=0; i<venue.length; i++){          
    const date = venue[i].getAttribute('date')
    const location = venue[i].getAttribute('location')
    const stadium = venue[i].getAttribute('stadium')
    const start_time = venue[i].getAttribute('start')
    const end_time = venue[i].getAttribute('end')
    const duration = venue[i].getAttribute('duration')
    const attend = venue[i].getAttribute('attend')
    const temp = venue[i].getAttribute('temp')
    const wind = venue[i].getAttribute('wind')
    const weather = venue[i].getAttribute('weather')
    
    const dateDiv = document.createElement('div')
    dateDiv.setAttribute('id', 'date')
    dateDiv.textContent = `Date: ${date}`
    divBox.appendChild(dateDiv)

    const locationDiv = document.createElement('div')
    locationDiv.setAttribute('id', 'location')
    locationDiv.textContent = `Location: ${location} - ${stadium}`
    divBox.appendChild(locationDiv)

    const attendanceDiv = document.createElement('div')
    attendanceDiv.setAttribute('id', 'attendance')
    attendanceDiv.textContent = `Attendance: ${attend}`
    divBox.appendChild(attendanceDiv)

    const timeDiv = document.createElement('div')
    timeDiv.setAttribute('id', 'game_time')
    timeDiv.textContent = `Start: ${start_time} - End: ${end_time} - Duration: ${duration} h`
    divBox.appendChild(timeDiv)

    const weatherDiv = document.createElement('div')
    weatherDiv.setAttribute('id', 'weather')
    weatherDiv.textContent = `Weather: ${weather} ${wind}, ${temp} C`
    divBox.appendChild(weatherDiv)
  }
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
    case 'sc':
      value = 'Scorer'
      break;
    default:
      value = 'ERRORE';
      break;
  }
  return value
}


function buildReferees(x) {
  officialsHTML = document.getElementById('officials')
  officialList = document.createElement('ul')

  officials = x.getElementsByTagName('officials')

  for(i=0; i<officials.length; i++){
    offAttrArray = officials[i].attributes
    for(j=0; j<offAttrArray.length; j++){
      const refLi = document.createElement('li')
      refLi.textContent = `${refToReferee(officials[i].attributes[j].name)}: ${officials[i].attributes[j].value}`
      officialList.appendChild(refLi)
    }
    officialsHTML.appendChild(officialList)
  }
}


function buildScoreboard(x) {
  const visTeamDiv = document.getElementById('visTeam')
  const homeTeamDiv = document.getElementById('homeTeam')
  const visDiv = document.getElementById('visScoreboard')
  const homeDiv = document.getElementById('homeScoreboard')

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
  
  const team = x.getElementsByTagName('team')
  const linescore = x.getElementsByTagName('linescore')
  const lineprd = x.getElementsByTagName('lineprd')

  for(i=0; i<team.length; i++){

    const team_name = team[i].getAttribute('name')
    const numQuarters = linescore[i].getAttribute('prds')
    const score = linescore[i].getAttribute('score')
    const visOrHome = team[i].getAttribute('vh')

    let teamNameEntry = document.createElement('td')
    teamNameEntry.textContent = team_name
    teamNameEntry.setAttribute('id', 'teamNameEntry')

    let finalScore = document.createElement('td')
    finalScore.textContent = score
    finalScore.setAttribute('id', 'finalScore')

    if(visOrHome === 'H'){
        homeScoreByQuarter.appendChild(teamNameEntry)
      } else {
        visScoreByQuarter.appendChild(teamNameEntry)
      }
    
    for(let j=0, k=4; j<numQuarters; j++, k++){

      let quarter = lineprd[j].getAttribute('prd')

      let headerTable = document.createElement('th')
      let scoreEntry = document.createElement('td')
      scoreEntry.setAttribute('id', 'qrtScore')
      headerTable.textContent = quarter

      if(visOrHome === 'H'){
        scoreQuarter = lineprd[k].getAttribute('score')
        headScoreByQuarterTable.appendChild(headerTable)
        scoreEntry.textContent = scoreQuarter
        homeScoreByQuarter.appendChild(scoreEntry)
      } else {
        scoreQuarter = lineprd[j].getAttribute('score')
        scoreEntry.textContent = scoreQuarter 
        visScoreByQuarter.appendChild(scoreEntry)
      }
    }

    if(visOrHome === 'H'){
      headerTable = document.createElement('th')
      headerTable.textContent = 'SCORE' 
      headScoreByQuarterTable.appendChild(headerTable)
      homeScoreByQuarter.appendChild(finalScore)
    } else {
      visScoreByQuarter.appendChild(finalScore)
    }
  }
}