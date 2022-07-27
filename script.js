document.addEventListener('DOMContentLoaded', () => {
    let url = "xml/20220100.xml"
    fetch(url)
    .then(response=>response.text())
    .then(data=>{
        let parser = new DOMParser()
        let xml = parser.parseFromString(data, "application/xml")
        //document.getElementById('output').textContent = data
       
        buildGeneralInfo(xml)
        buildScoreboard(xml)

    })
})

function buildGeneralInfo(x){
    let divBox = document.getElementById('general-info')

    let venue = x.getElementsByTagName('venue')
    for(let i=0; i<venue.length; i++){
        
        let date = venue[i].getAttribute('date')
        let location = venue[i].getAttribute('location')
        let stadium = venue[i].getAttribute('stadium')
        let start_time = venue[i].getAttribute('start')
        let end_time = venue[i].getAttribute('end')
        let duration = venue[i].getAttribute('duration')
        let attend = venue[i].getAttribute('attend')
        let temp = venue[i].getAttribute('temp')
        let wind = venue[i].getAttribute('wind')
        let weather = venue[i].getAttribute('weather')
        
        let dateDiv = document.createElement('div')
        dateDiv.setAttribute('id', 'date')
        dateDiv.textContent = `Date: ${date}`
        divBox.appendChild(dateDiv)

        let locationDiv = document.createElement('div')
        locationDiv.setAttribute('id', 'location')
        locationDiv.textContent = `Location: ${location} - ${stadium}`
        divBox.appendChild(locationDiv)

        let attendanceDiv = document.createElement('div')
        attendanceDiv.setAttribute('id', 'attendance')
        attendanceDiv.textContent = `Attendance: ${attend}`
        divBox.appendChild(attendanceDiv)

        let timeDiv = document.createElement('div')
        timeDiv.setAttribute('id', 'game_time')
        timeDiv.textContent = `Start: ${start_time} - End: ${end_time} - Duration: ${duration} h`
        divBox.appendChild(timeDiv)

        let weatherDiv = document.createElement('div')
        weatherDiv.setAttribute('id', 'weather')
        weatherDiv.textContent = `Weather: ${weather} ${wind}, ${temp} C`
        divBox.appendChild(weatherDiv)
    }
}

function buildReferees(x) {
    let officials = x.getElementsByTagName('officials')
    for(i=0; i<officials.length; i++){

        let ref = officials[i].getAttribute('ref')
        let ump = officials[i].getAttribute('ump')
        let line = officials[i].getAttribute('line')
        let lj = officials[i].getAttribute('lj')
        let bj = officials[i].getAttribute('bj')
        let sc = officials[i].getAttribute('sc')

        let officialList = document.createElement('ul')       
        
        let officialChildRef = document.createElement('li')
        officialChildRef.textContent = `Referee: ${ref}`
        officialList.appendChild(officialChildRef)

        let officialChildUmp = document.createElement('li')
        officialChildUmp.textContent = `Umpire: ${ump}`
        officialList.appendChild(officialChildUmp)

        let officialChildLine = document.createElement('li')
        officialChildLine.textContent = `Linesman: ${line}`
        officialList.appendChild(officialChildLine)

        let officialChildLj = document.createElement('li')
        officialChildLj.textContent = `Line Judge: ${lj}`
        officialList.appendChild(officialChildLj)

        let officialChildBj = document.createElement('li')
        officialChildBj.textContent = `Back Judge: ${bj}`
        officialList.appendChild(officialChildBj)

        let officialChildSc = document.createElement('li')
        officialChildSc.textContent = `Scorer: ${sc}`
        officialList.appendChild(officialChildSc)

        divBox.appendChild(officialList)
    }
}

function buildScoreboard(x) {

    let visTeamDiv = document.getElementById('visTeam')
    let homeTeamDiv = document.getElementById('homeTeam')
    let visDiv = document.getElementById('visScoreboard')
    let homeDiv = document.getElementById('homeScoreboard')


    let team = x.getElementsByTagName('team')
    let linescore = x.getElementsByTagName('linescore')

    for(i=0; i<team.length; i++){
        let visOrHome = team[i].getAttribute('vh')
        let team_id = team[i].getAttribute('id')
        let team_name = team[i].getAttribute('name')
        let record = team[i].getAttribute('record')
        let score = linescore[i].getAttribute('score')
        let logopath = 'logos/'+team_id+'.jpg'
        
        
        //let teamId = document.createElement('div')
        //teamId.textContent = team_id
        let logo = document.createElement('img')
        logo.src = logopath
        let teamName = document.createElement('div')
        teamName.textContent = team_name
        let teamRecord = document.createElement('div')
        teamRecord.textContent = `(${record})`
        let teamScore = document.createElement('div')
        teamScore.textContent = score


        if (visOrHome === 'V') {
            //id
            //teamId.setAttribute('id', 'id')
            //visTeamDiv.appendChild(teamId)

            // logo
            logo.setAttribute('id', 'visLogo')
            visTeamDiv.appendChild(logo)

            // name
            teamName.setAttribute('id', 'visName')
            visTeamDiv.appendChild(teamName)

            // record
            teamRecord.setAttribute('id', 'visRecord')
            visTeamDiv.appendChild(teamRecord)

            // score
            teamScore.setAttribute('id', 'visScore')
            visDiv.appendChild(teamScore)


        } else {
            // id
            //teamId.setAttribute('id', 'id')
            //homeTeamDiv.appendChild(teamId)

            // logo
            logo.setAttribute('id', 'homeLogo')
            homeTeamDiv.appendChild(logo)

            // name
            teamName.setAttribute('id', 'homeName')
            homeTeamDiv.appendChild(teamName)

            // recordQ
            teamRecord.setAttribute('id', 'homeRecord')
            homeTeamDiv.appendChild(teamRecord)

            //score
            teamScore.setAttribute('id', 'homeScore')
            homeDiv.appendChild(teamScore)
        }


    }
}