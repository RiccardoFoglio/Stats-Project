function responsiveMenu() {
  let x = document.getElementById("topNavbar");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

$(document).ready(function () {
  $('ul.navbar-nav > li')
      .click(function (e) {
    $('ul.navbar-nav > li')
      .removeClass('active'); 
    $(this).addClass('active');
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const url = "iflxml/20220644.xml"
  //20220644
  fetch(url)
  .then(response=>response.text())
  .then(data=>{
    const parser = new DOMParser()
    const xml = parser.parseFromString(data, "application/xml")
    
    buildBoxScore(xml)


    //buildTotalStatsComplete(xml)
    //buildTotalStatsCompact(xml)

    //buildIndOffense(xml)
    //buildDrivesComplete(xml)
    //buildDrivesQuarter(xml)
    //buildDefense(xml)
    //buildRosters(xml)
    //buildPlays(xml)
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
  
  let allDivs = document.getElementsByClassName('ContainerDisappear')
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
  const words = str.toLowerCase().split(' ')
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)
  }
  return words.join(' ')
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
  const plays = attributes?.getNamedItem('plays')
  const drive = attributes?.getNamedItem('drive')
  const top = attributes?.getNamedItem('top')
  
  if (plays){
    return `${plays.value} plays, ${drive.value} yds, TOP: ${top.value}`
  }
}

function netAverage(type, fromH, fromV, retH, retV, whereto) {
  rowEntry = document.createElement('tr')
  createElementHTML('td', 'Net Yards Per '+type, rowEntry)
  let ydsH = parseFloat(fromH.getAttribute('yds'))
  let ydsV = parseFloat(fromV.getAttribute('yds'))
  let retYdsH, retYdsV, touchBackPartialH, touchBackPartialV, noH, noV, netH, netV
  if (retH) {
    retYdsH = parseFloat(retH.getAttribute('yds'))
  } else {
    retYdsH = 0
  }
  if (retV) {
    retYdsV = parseFloat(retV.getAttribute('yds'))
  } else {
    retYdsV = 0
  }

  if(fromH) {
    touchBackPartialH = 20 * parseFloat(fromH.getAttribute('tb'))
    noH = parseFloat(fromH.getAttribute('no'))
    netH = ydsH - retYdsV - touchBackPartialH
    createElementHTML('td', (netH / noH).toFixed(1), rowEntry)
  } else {
    createElementHTML('td', '0.0', rowEntry)
  }

  if(fromV) {
    touchBackPartialV = 20 * parseFloat(fromV.getAttribute('tb'))
    noV = parseFloat(fromV.getAttribute('no'))
    netV = ydsV - retYdsH - touchBackPartialV
    createElementHTML('td', (netV / noV).toFixed(1), rowEntry)
  } else {
    createElementHTML('td', '0.0', rowEntry)
  }

  whereto.appendChild(rowEntry)
}

function singleDatumTitle(cont, wherefromH, wherefromV, attrib, whereto){
  let rowEntry = document.createElement('tr')
  createElementAttr('td', cont, 'class', 'titleCell', rowEntry)

  if(wherefromH){
    createElementHTML('td', wherefromH.getAttribute(attrib), rowEntry)
  } else {
    createElementHTML('td', '0', rowEntry)
  }
  if(wherefromV){
    createElementHTML('td', wherefromV.getAttribute(attrib), rowEntry)
  } else {
    createElementHTML('td', '0', rowEntry)
  }
  
  whereto.appendChild(rowEntry)
}

function singleDatum(cont, wherefromH, wherefromV, attrib, whereto){
  let rowEntry = document.createElement('tr')
  createElementHTML('td', cont, rowEntry)
  
  if(wherefromH){
    createElementHTML('td', wherefromH.getAttribute(attrib), rowEntry)
  } else {
    createElementHTML('td', '0', rowEntry)
  }
  if(wherefromV){
    createElementHTML('td', wherefromV.getAttribute(attrib), rowEntry)
  } else {
    createElementHTML('td', '0', rowEntry)
  }
  
  whereto.appendChild(rowEntry)
}

function doubleDatum(cont, wherefromH, wherefromV, a1, a2, whereto){

  let rowEntry = document.createElement('tr')
  let valH1, valH2, valV1, valV2
  
  if(wherefromH){
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

  if (wherefromV) {
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

  if(wherefromH){
    createElementHTML('td', `${wherefromH.getAttribute(a1)} of ${wherefromH.getAttribute(a2)}`, rowEntry)
  } else {
    createElementHTML('td', '0 of 0', rowEntry)
  }
  if(wherefromV){
    createElementHTML('td', `${wherefromV.getAttribute(a1)} of ${wherefromV.getAttribute(a2)}`, rowEntry)
  } else {
    createElementHTML('td', '0 of 0', rowEntry)
  }

  whereto.appendChild(rowEntry)
}

function tripleDatum(cont, wherefromH, wherefromV, a1, a2, a3, whereto){
let rowEntry = document.createElement('tr')
  let valH1, valH2, valH3, valV1, valV2, valV3
  
  if(wherefromH){
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

  if (wherefromV) {
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
  if(wherefromH){
    createElementHTML('td', parseFloat(wherefromH.getAttribute(attUp) / wherefromH.getAttribute(attOver)).toFixed(1), rowEntry)
  } else {
    createElementHTML('td','0.0', rowEntry)
  }
  if(wherefromV){
    createElementHTML('td', parseFloat(wherefromV.getAttribute(attUp) / wherefromV.getAttribute(attOver)).toFixed(1), rowEntry)
  } else {
    createElementHTML('td','0.0', rowEntry)
  }
  whereto.appendChild(rowEntry)
}

function tripleDatumTitle(cont, wherefromH, wherefromV, a1, a2, a3, whereto){

  let rowEntry = document.createElement('tr')
  let valH1, valH2, valH3, valV1, valV2, valV3
  
  if(wherefromH){
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

  if (wherefromV) {
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

function sortTable(id, pos) {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById(id);
  switching = true;
  
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[pos];
      y = rows[i + 1].getElementsByTagName("TD")[pos];

      if (Number(x.innerHTML) < Number(y.innerHTML) ) {
        shouldSwitch = true;
        break;
      }
      //x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()
      //xlog = x.innerHTML.match(/\d+/g);
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function insertTotalRow(id, type) {
  let table, rows, rowEntry
  table = document.getElementById(id);
  rows = table.rows;
  rowEntry = document.createElement('tr')
  
  createElementHTML('td', 'Totals...', rowEntry)

  switch (type) {
    case "pass":
      for (let c = 1; c <= (rows[0].cells.length - 1); c++) {
        let totComp = 0, totAtt = 0, totInt = 0, max = 0, total = 0
        for (let r = 1; r <= (rows.length - 1); r++) {
          let cell = table.rows[r].cells[c].innerHTML
          if (c === 1){
            totComp += parseInt(cell.match(/\d+/g)[0])
            totAtt += parseInt(cell.match(/\d+/g)[1])
            totInt += parseInt(cell.match(/\d+/g)[2])
          } else if (c === 4) {
            if (Number(cell) > max){
              max = Number(cell)
            }
          } else {
            total += parseInt(cell)
          }
        }
      if (c === 1){
        createElementHTML('td', `${totComp}-${totAtt}-${totInt}`, rowEntry)
      } else if (c === 4) {
        createElementHTML('td', max, rowEntry)
      } else {
        createElementHTML('td', total, rowEntry)
        }
      }
      break;

    case "rush":
      for (let c = 1; c <= (rows[0].cells.length - 1); c++) {
        let max = 0, total = 0, avg = 0.0, totYds = 0, totNo = 0
        for (let r = 1; r <= (rows.length - 1); r++) {
          let cell = table.rows[r].cells[c].innerHTML
          if (c === 7){
            totYds += parseInt(table.rows[r].cells[4].innerHTML)
            totNo += parseInt(table.rows[r].cells[1].innerHTML)
            avg = parseFloat(totYds / totNo).toFixed(1)
          } else if (c === 6) {
            if (Number(cell) > max){
              max = Number(cell)
            }
          } else {
            total += parseInt(cell)
          }
        }
        if (c === 7){
          createElementHTML('td', avg, rowEntry)
        } else if (c === 6) {
          createElementHTML('td', max, rowEntry)
        } else {
          createElementHTML('td', total, rowEntry)
        }
      }
      break;

    case 'rec':
      for (let c = 1; c <= (rows[0].cells.length - 1); c++) {
        let max = 0, total = 0
        for (let r = 1; r <= (rows.length - 1); r++) {
          let cell = table.rows[r].cells[c].innerHTML
          if (c === 4) {
            if (Number(cell) > max){
              max = Number(cell)
            }
          } else {
            total += parseInt(cell)
          }
        }
        if (c === 4) {
          createElementHTML('td', max, rowEntry)
        } else {
          createElementHTML('td', total, rowEntry)
        }
      }
      break;

    case 'punt':
      for (let c = 1; c <= (rows[0].cells.length - 1); c++) {
        let max = 0, total = 0, avg = 0.0, totYds = 0, totNo = 0
        for (let r = 1; r <= (rows.length - 1); r++) {
          let cell = table.rows[r].cells[c].innerHTML
          if (c === 3){
            totYds += parseInt(table.rows[r].cells[2].innerHTML)
            totNo += parseInt(table.rows[r].cells[1].innerHTML)

            avg = parseFloat(totYds / totNo).toFixed(1)
          } else if (c === 4) {
            if (Number(cell) > max){
              max = Number(cell)
            }
          } else {
            total += parseInt(cell)
          }
        }
        if (c === 3){
          createElementHTML('td', avg, rowEntry)
        } else if (c === 4) {
          createElementHTML('td', max, rowEntry)
        } else {
          createElementHTML('td', total, rowEntry)
        }
      }
      break;

    case 'allRet':
      for (let c = 1; c <= (rows[1].cells.length - 1); c++) {
        let max = 0, total = 0
        for (let r = 2; r <= (rows.length - 1); r++) {
          let cell = table.rows[r].cells[c].innerHTML
          if (c === 3 || c === 6 || c === 9) {
            if (Number(cell) > max){
              max = Number(cell)
            }
          } else {
            total += parseInt(cell)
          }
        }
        if (c === 3 || c === 6 || c === 9) {
          createElementHTML('td', max, rowEntry)
        } else {
          createElementHTML('td', total, rowEntry)
        }
      }
      break;

    case 'allPurp':
      for (let c = 1; c <= (rows[0].cells.length - 1); c++) {
        let max = 0, total = 0
        for (let r = 1; r <= (rows.length - 1); r++) {
          let cell = table.rows[r].cells[c].innerHTML
          total += parseInt(cell)
        }
        createElementHTML('td', total, rowEntry)
      }
      break;

    case 'ko':
      for (let c = 1; c <= (rows[0].cells.length - 1); c++) {
        let max = 0, total = 0, avg = 0.0, totYds = 0, totNo = 0
        for (let r = 1; r <= (rows.length - 1); r++) {
          let cell = table.rows[r].cells[c].innerHTML
          if (c === 5){
            totYds += parseInt(table.rows[r].cells[2].innerHTML)
            totNo += parseInt(table.rows[r].cells[1].innerHTML)
            avg = parseFloat(totYds / totNo).toFixed(1)
          } else {
            total += parseInt(cell)
          }
        }
        if (c === 5){
          createElementHTML('td', avg, rowEntry)
        } else {
          createElementHTML('td', total, rowEntry)
        }
      }
      break;
  
    default:
      break;
      }  

  tableBody = id + '-body'
  document.getElementById(tableBody).appendChild(rowEntry)
}

function yardsToSpot(x, val, field, team) {
  let hTeam = x.getElementsByTagName('team')[1].getAttribute('abb')
  let vTeam = x.getElementsByTagName('team')[0].getAttribute('abb')
  let num

  if (val < parseInt(field/2)) {
      num = val
      if (team === hTeam){
        return hTeam+num
      } else {
        return vTeam+num
      }
      
    } else {
      num = field - val
      if (team === hTeam){
        return vTeam+num
      } else {
        return hTeam+num
      }
    }
}

function typeToPlay(type){
  switch (type) {
    case 'KO':
      return 'Kickoff'
    case 'PUNT':
      return 'Punt'
    case 'INT':
      return 'Interception'
    case 'FGA':
      return 'Missed FG'
    case 'DOWNS':
      return 'Downs'
    case 'FUMB': 
      return 'Fumble'
    case 'FG': 
      return 'FIELDGOAL'
    case 'TD': 
      return 'TOUCHDOWN'
    case 'HALF': 
      return 'End of half'
    
    default:
      return null   
  }
}

function AddBefore(rowId, newElement){
    let target = document.getElementById(rowId);
    target.parentNode.insertBefore(newElement, target);
    return newElement;
}

function AddAfter(rowId, newElement){
    let target = document.getElementById(rowId);
    target.parentNode.insertBefore(newElement, target.nextSibling );
    return newElement;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////BUILD FUNCTIONS//////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function buildBoxScore(x){
  const teamV = x.getElementsByTagName('team')[0]
  const teamH = x.getElementsByTagName('team')[1]

  // box-score-graphic
  document.getElementById('awayLogo').src = `logos/${teamV.getAttribute('id')}.jpg`
  document.getElementById('awayLogo').alt = `${capitalize(teamV.getAttribute('name'))} logo`
  document.getElementById('homeLogo').src = `logos/${teamH.getAttribute('id')}.jpg`
  document.getElementById('homeLogo').alt = `${capitalize(teamH.getAttribute('name'))} logo`

  document.getElementById('awayScore').innerHTML = teamV.getElementsByTagName('linescore')[0].getAttribute('score')
  document.getElementById('homeScore').innerHTML = teamH.getElementsByTagName('linescore')[0].getAttribute('score')

  if (teamV.getElementsByTagName('linescore')[0].getAttribute('score') > teamH.getElementsByTagName('linescore')[0].getAttribute('score')) {
    document.getElementById('awayScore').classList.add('winner')
    document.getElementById('homeScore').classList.add('loser')
  } else {
    document.getElementById('awayScore').classList.add('loser')
    document.getElementById('homeScore').classList.add('winner')
  }

  //box-score-graphic-caption TITLE
  const caption = document.getElementById('box-score-graphic-caption')
  const title = document.createElement('h4')
  title.innerHTML = `${capitalize(teamV.getAttribute('name'))} (${teamV.getAttribute('record')}) -VS- ${capitalize(teamH.getAttribute('name'))} (${teamH.getAttribute('record')})`.toUpperCase()
  title.classList.add('main-heading')
  
  //box-score-graphic-caption TABLE
  const tableHead = document.getElementById('score-qrt-table-head')
  const table = document.getElementById('score-qrt-table')
  let rowEntry

  table.before(title)

  rowEntry = document.createElement('tr')
  createElementHTML('th', '', rowEntry)
  for (let i = 0; i < Number(teamV.getElementsByTagName('linescore')[0].getAttribute('prds')); i++) {
    createElementHTML('th', numToQRT(String(i+1)), rowEntry)
  }
  createElementHTML('th', 'Final', rowEntry)
  tableHead.appendChild(rowEntry)

  rowEntry = document.createElement('tr')
  createElementHTML('th', capitalize(teamV.getAttribute('name')), rowEntry)
  for (let i = 0; i < Number(teamV.getElementsByTagName('linescore')[0].getAttribute('prds')); i++) {
    createElementHTML('th', teamV.getElementsByTagName('linescore')[0].getAttribute('line').split(',')[i], rowEntry)
  }
  createElementHTML('th', teamV.getElementsByTagName('linescore')[0].getAttribute('score'), rowEntry)
  table.appendChild(rowEntry)

  rowEntry = document.createElement('tr')
  createElementHTML('th', capitalize(teamH.getAttribute('name')), rowEntry)
  for (let i = 0; i < Number(teamH.getElementsByTagName('linescore')[0].getAttribute('prds')); i++) {
    createElementHTML('th', teamH.getElementsByTagName('linescore')[0].getAttribute('line').split(',')[i], rowEntry)
  }
  createElementHTML('th', teamH.getElementsByTagName('linescore')[0].getAttribute('score'), rowEntry)
  table.appendChild(rowEntry)

  // General info list
  buildGeneralInfo(x)

  // Scoring Summary
  buildScoringSummary(x)

  // Refs
  buildReferees(x)

}

function buildGeneralInfo(x){
  const venue = x.getElementsByTagName('venue')[0]
  
  const date = venue.getAttribute('date')
  const site = venue.getAttribute('location')
  const stadium = venue.getAttribute('stadium')
  const attendance = venue.getAttribute('attend')
  const kickoff_time = venue.getAttribute('start')
  const end_of_game = venue.getAttribute('end')
  const duration = venue.getAttribute('duration')
  const temperature = venue.getAttribute('temp')
  const wind = venue.getAttribute('wind')
  const weather = venue.getAttribute('weather')

  let generalInfo = document.getElementById('general-info')

  createElementHTML('dt', 'Date:', generalInfo)
  createElementHTML('dd', date, generalInfo)
  createElementHTML('dt', 'Site:', generalInfo)
  createElementHTML('dd', site, generalInfo)
  createElementHTML('dt', 'Stadium:', generalInfo)
  createElementHTML('dd', stadium, generalInfo)
  createElementHTML('dt', 'Attendance:', generalInfo)
  createElementHTML('dd', attendance, generalInfo)
  createElementHTML('dt', 'Kickoff Time:', generalInfo)
  createElementHTML('dd', kickoff_time, generalInfo)
  createElementHTML('dt', 'End of Game:', generalInfo)
  createElementHTML('dd', end_of_game, generalInfo)
  createElementHTML('dt', 'Duration:', generalInfo)
  createElementHTML('dd', duration, generalInfo)
  createElementHTML('dt', 'Temperature:', generalInfo)
  createElementHTML('dd', temperature, generalInfo)
  createElementHTML('dt', 'Wind:', generalInfo)
  createElementHTML('dd', wind, generalInfo)
  createElementHTML('dt', 'Weather:', generalInfo)
  createElementHTML('dd', weather, generalInfo)
}

function buildScoringSummary(x) {

  const head = document.getElementById('scoring-summary-table-head')
  const body = document.getElementById('scoring-summary-table-body')
  const foot = document.getElementById('scoring-summary-table-foot')

  let rowEntry

  rowEntry = document.createElement('tr')
  createElementHTML('th', '', rowEntry)
  createElementHTML('th', '', rowEntry)
  createElementHTML('th', '', rowEntry)
  createElementHTML('th', x.getElementsByTagName('team')[0].getAttribute('id'), rowEntry)
  createElementHTML('th', x.getElementsByTagName('team')[1].getAttribute('id'), rowEntry)
  head.appendChild(rowEntry)

  const scores = x.getElementsByTagName('scores')[0].getElementsByTagName('score')

  for (let i = 0; i < scores.length; i++) {
    let score = scores[i]
    const attrArray = scores[i].attributes

    const play = playToString(attrArray)
    const drive = driveToString(attrArray)

    rowEntry = document.createElement('tr')
    createElementHTML('td', numToQRT(score.getAttribute('qtr')), rowEntry)
    createElementHTML('td', score.getAttribute('clock'), rowEntry)
    let str = `${play} - ${drive}`
    createElementHTML('td', str, rowEntry)
    createElementHTML('td', score.getAttribute('vscore'), rowEntry)
    createElementHTML('td', score.getAttribute('hscore'), rowEntry)

    body.appendChild(rowEntry)

    if (i === scores.length-1) {
      rowEntry = document.createElement('tr')
      createElementHTML('th', '', rowEntry)
      createElementHTML('th', '', rowEntry)
      createElementHTML('th', '', rowEntry)
      createElementHTML('td', score.getAttribute('vscore'), rowEntry)
      createElementHTML('td', score.getAttribute('hscore'), rowEntry)
      foot.appendChild(rowEntry)
    }
  }
}

function buildReferees(x) {
  const table = document.getElementById('refs-table-foot')
  const officials = x.getElementsByTagName('officials')[0]
  let rowEntry, refPos = 0
  for (let i = 0; i < Math.round(officials.attributes.length / 3); i++) {
    rowEntry = document.createElement('tr')
    for (let j = 0; j < 3; j++) {
      if (officials.attributes[refPos]?.name){
        createElementHTML('td', `${refToReferee(officials.attributes[refPos]?.name)}: ${officials.attributes[refPos]?.value}`, rowEntry)
      }
      refPos += 1
    }
    table.appendChild(rowEntry)
  }
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

  const firstdownsV = totalsV?.getElementsByTagName('firstdowns')[0]
  const penaltiesV = totalsV?.getElementsByTagName('penalties')[0]
  const conversionsV = totalsV?.getElementsByTagName('conversions')[0]
  const fumblesV = totalsV?.getElementsByTagName('fumbles')[0]
  const miscV = totalsV?.getElementsByTagName('misc')[0]
  const redzoneV = totalsV?.getElementsByTagName('redzone')[0]
  const rushV = totalsV?.getElementsByTagName('rush')[0]
  const passV = totalsV?.getElementsByTagName('pass')[0]
  const puntV = totalsV?.getElementsByTagName('punt')[0]
  const koV = totalsV?.getElementsByTagName('ko')[0]
  const fgV= totalsV?.getElementsByTagName('fg')[0]
  const patV = totalsV?.getElementsByTagName('pat')[0]
  const defenseV = totalsV?.getElementsByTagName('defense')[0]
  const krV = totalsV?.getElementsByTagName('kr')[0]
  const prV = totalsV?.getElementsByTagName('pr')[0]
  const irV = totalsV?.getElementsByTagName('ir')[0]

  const firstdownsH = totalsH?.getElementsByTagName('firstdowns')[0]
  const penaltiesH = totalsH?.getElementsByTagName('penalties')[0]
  const conversionsH = totalsH?.getElementsByTagName('conversions')[0]
  const fumblesH = totalsH?.getElementsByTagName('fumbles')[0]
  const miscH = totalsH?.getElementsByTagName('misc')[0]
  const redzoneH = totalsH?.getElementsByTagName('redzone')[0]
  const rushH = totalsH?.getElementsByTagName('rush')[0]
  const passH= totalsH?.getElementsByTagName('pass')[0]
  const puntH = totalsH?.getElementsByTagName('punt')[0]
  const koH = totalsH?.getElementsByTagName('ko')[0]
  const fgH= totalsH?.getElementsByTagName('fg')[0]
  const patH = totalsH?.getElementsByTagName('pat')[0]
  const defenseH = totalsH?.getElementsByTagName('defense')[0]
  const krH = totalsH?.getElementsByTagName('kr')[0]
  const prH = totalsH?.getElementsByTagName('pr')[0]
  const irH = totalsH?.getElementsByTagName('ir')[0]


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

  const firstdownsV = totalsV?.getElementsByTagName('firstdowns')[0]
  const penaltiesV = totalsV?.getElementsByTagName('penalties')[0]
  const conversionsV = totalsV?.getElementsByTagName('conversions')[0]
  const fumblesV = totalsV?.getElementsByTagName('fumbles')[0]
  const miscV = totalsV?.getElementsByTagName('misc')[0]
  const redzoneV = totalsV?.getElementsByTagName('redzone')[0]
  const rushV = totalsV?.getElementsByTagName('rush')[0]
  const passV = totalsV?.getElementsByTagName('pass')[0]
  const puntV = totalsV?.getElementsByTagName('punt')[0]
  const defenseV = totalsV?.getElementsByTagName('defense')[0]
  const krV = totalsV?.getElementsByTagName('kr')[0]
  const prV = totalsV?.getElementsByTagName('pr')[0]
  const irV = totalsV?.getElementsByTagName('ir')[0]

  const firstdownsH = totalsH?.getElementsByTagName('firstdowns')[0]
  const penaltiesH = totalsH?.getElementsByTagName('penalties')[0]
  const conversionsH = totalsH?.getElementsByTagName('conversions')[0]
  const fumblesH = totalsH?.getElementsByTagName('fumbles')[0]
  const miscH = totalsH?.getElementsByTagName('misc')[0]
  const redzoneH = totalsH?.getElementsByTagName('redzone')[0]
  const rushH = totalsH?.getElementsByTagName('rush')[0]
  const passH= totalsH?.getElementsByTagName('pass')[0]
  const puntH = totalsH?.getElementsByTagName('punt')[0]
  const defenseH = totalsH?.getElementsByTagName('defense')[0]
  const krH = totalsH?.getElementsByTagName('kr')[0]
  const prH = totalsH?.getElementsByTagName('pr')[0]
  const irH = totalsH?.getElementsByTagName('ir')[0]

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
  if(puntH){
    const numH = puntH.getAttribute('no')
    let avgH = parseFloat(puntH.getAttribute('yds') / numH)
    createElementHTML('td', `${numH}-${avgH.toFixed(1)}`, rowEntry)
  } else {
    createElementHTML('td','0-0', rowEntry)
  }
  if(puntV){
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

function buildIndOffense(x) {

  const passingTableBodyHome = document.getElementById('passingStatsHome-table-body')
  const rushingTableBodyHome = document.getElementById('rushingStatsHome-table-body')
  const receivingTableBodyHome = document.getElementById('receivingStatsHome-table-body')
  const puntingTableBodyHome = document.getElementById('puntingStatsHome-table-body')
  const allReturnsTableBodyHome = document.getElementById('allReturnsStatsHome-table-body')
  const allPurposeTableBodyHome = document.getElementById('allPurposeStatsHome-table-body')
  const fieldGoalTableBodyHome = document.getElementById('fieldGoalStatsHome-table-body')
  const kickoffTableBodyHome = document.getElementById('kickoffStatsHome-table-body')

  const passingTableBodyVis = document.getElementById('passingStatsVis-table-body')
  const rushingTableBodyVis = document.getElementById('rushingStatsVis-table-body')
  const receivingTableBodyVis = document.getElementById('receivingStatsVis-table-body')
  const puntingTableBodyVis = document.getElementById('puntingStatsVis-table-body')
  const allReturnsTableBodyVis = document.getElementById('allReturnsStatsVis-table-body')
  const allPurposeTableBodyVis = document.getElementById('allPurposeStatsVis-table-body')
  const fieldGoalTableBodyVis = document.getElementById('fieldGoalStatsVis-table-body')
  const kickoffTableBodyVis = document.getElementById('kickoffStatsVis-table-body')

  const fgas = x.getElementsByTagName('fgas')[0]
  for (let k = 0; k < fgas?.getElementsByTagName('fga').length; k++) {
    let fga = fgas.getElementsByTagName('fga')[k]
    let fgAtt = document.createElement('tr')
    
    createElementHTML('td', fga.getAttribute('kicker'), fgAtt)
    createElementHTML('td', fga.getAttribute('qtr'), fgAtt)
    createElementHTML('td', fga.getAttribute('clock'), fgAtt)
    createElementHTML('td', fga.getAttribute('distance'), fgAtt)
    createElementHTML('td', fga.getAttribute('result'), fgAtt)
  
    if (fga.getAttribute('vh') === 'V') {
      fieldGoalTableBodyVis.appendChild(fgAtt)
    } else {
      fieldGoalTableBodyHome.appendChild(fgAtt)
    }
  }

  for (let i = 0; i < x.getElementsByTagName('team').length; i++) {
    let team = x.getElementsByTagName('team')[i];

    for (let j = 0; j < team.getElementsByTagName('player').length; j++) {
      let player = team.getElementsByTagName('player')[j];
     let rowEntry

     let pass = player?.getElementsByTagName('pass')[0]
      if (pass) {
        rowEntry = document.createElement('tr')
        createElementHTML('td', player.getAttribute('name'), rowEntry)
        createElementHTML('td', `${pass.getAttribute('comp')}-${pass.getAttribute('att')}-${pass.getAttribute('int')}`, rowEntry)
        createElementHTML('td', pass.getAttribute('yds'), rowEntry)
        createElementHTML('td', pass.getAttribute('td'), rowEntry)
        createElementHTML('td', pass.getAttribute('long'), rowEntry)
        createElementHTML('td', pass.getAttribute('sacks'), rowEntry)
       if (team.getAttribute('vh') === 'V') {
          passingTableBodyVis.appendChild(rowEntry)
        } else {
          passingTableBodyHome.appendChild(rowEntry)
        }
      }

      let rush = player?.getElementsByTagName('rush')[0]
      if (rush) {
       rowEntry = document.createElement('tr')
        createElementHTML('td', player.getAttribute('name'), rowEntry)
        createElementHTML('td', rush.getAttribute('att'), rowEntry)
        createElementHTML('td', rush.getAttribute('gain'), rowEntry)
        createElementHTML('td', rush.getAttribute('loss'), rowEntry)
        net = parseFloat(rush.getAttribute('gain') - rush.getAttribute('loss'))
        createElementHTML('td', net, rowEntry)
        createElementHTML('td', rush.getAttribute('td'), rowEntry)
        createElementHTML('td', rush.getAttribute('long'), rowEntry)
        avg = parseFloat(net / rush.getAttribute('att')).toFixed(1)
        createElementHTML('td', avg, rowEntry)
       if (team.getAttribute('vh') === 'V') {
          rushingTableBodyVis.appendChild(rowEntry)
        } else {
          rushingTableBodyHome.appendChild(rowEntry)
        }
      }
     let rcv = player?.getElementsByTagName('rcv')[0]
      if (rcv) {
       rowEntry = document.createElement('tr')
       createElementHTML('td', player.getAttribute('name'), rowEntry)
        createElementHTML('td', rcv.getAttribute('no'), rowEntry)
        createElementHTML('td', rcv.getAttribute('yds'), rowEntry)
        createElementHTML('td', rcv.getAttribute('td'), rowEntry)
        createElementHTML('td', rcv.getAttribute('long'), rowEntry)
       if (team.getAttribute('vh') === 'V') {
          receivingTableBodyVis.appendChild(rowEntry)
        } else {
          receivingTableBodyHome.appendChild(rowEntry)
        }
      }
     let punt = player?.getElementsByTagName('punt')[0]
      if (punt) {
        rowEntry = document.createElement('tr')
        createElementHTML('td', player.getAttribute('name'), rowEntry)
        createElementHTML('td', punt.getAttribute('no'), rowEntry)
        createElementHTML('td', punt.getAttribute('yds'), rowEntry)
        avg = parseFloat(punt.getAttribute('yds') / punt.getAttribute('no')).toFixed(1)
        createElementHTML('td', avg, rowEntry)
        createElementHTML('td', punt.getAttribute('long'), rowEntry)
        createElementHTML('td', punt.getAttribute('inside20'), rowEntry)
        createElementHTML('td', punt.getAttribute('tb'), rowEntry)
      
        if (team.getAttribute('vh') === 'V') {
          puntingTableBodyVis.appendChild(rowEntry)
        } else {
          puntingTableBodyHome.appendChild(rowEntry)
        }
      }
      let pr = player?.getElementsByTagName('pr')[0]
      let kr = player?.getElementsByTagName('kr')[0]
      let ir = player?.getElementsByTagName('ir')[0]
      
      if (pr || kr || ir ) {
        if (pr){
          rowEntry = document.createElement('tr')
          createElementHTML('td', player.getAttribute('name'), rowEntry)
          createElementHTML('td', pr.getAttribute('no'), rowEntry)
          createElementHTML('td', pr.getAttribute('yds'), rowEntry)
          createElementHTML('td', pr.getAttribute('long'), rowEntry)
        } else {
          rowEntry = document.createElement('tr')
          createElementHTML('td', player.getAttribute('name'), rowEntry)
          createElementHTML('td', 0, rowEntry)
          createElementHTML('td', 0, rowEntry)
          createElementHTML('td', 0, rowEntry)
        }
      
        if (kr){
          createElementHTML('td', kr.getAttribute('no'), rowEntry)
          createElementHTML('td', kr.getAttribute('yds'), rowEntry)
          createElementHTML('td', kr.getAttribute('long'), rowEntry)
        } else {
          createElementHTML('td', 0, rowEntry)
          createElementHTML('td', 0, rowEntry)
          createElementHTML('td', 0, rowEntry)
        }
      
        if (ir){
          createElementHTML('td', ir.getAttribute('no'), rowEntry)
          createElementHTML('td', ir.getAttribute('yds'), rowEntry)
          createElementHTML('td', ir.getAttribute('long'), rowEntry)
        } else {
          createElementHTML('td', 0, rowEntry)
          createElementHTML('td', 0, rowEntry)
          createElementHTML('td', 0, rowEntry)
        }
       if (team.getAttribute('vh') === 'V') {
          allReturnsTableBodyVis.appendChild(rowEntry)
        } else {
          allReturnsTableBodyHome.appendChild(rowEntry)
        }
      }
     if (rush || rcv || kr || pr || ir) {
        let total = 0
        rowEntry = document.createElement('tr')
        createElementHTML('td', player.getAttribute('name'), rowEntry)
       if (rush){
          createElementHTML('td', rush.getAttribute('yds'), rowEntry)
          total += parseInt(rush.getAttribute('yds'))
        } else {
          createElementHTML('td', 0, rowEntry)
        }
       if (rcv){
          createElementHTML('td', rcv.getAttribute('yds'), rowEntry)
          total += parseInt(rcv.getAttribute('yds'))
        } else {
          createElementHTML('td', 0, rowEntry)
        }
       if (kr){
          createElementHTML('td', kr.getAttribute('yds'), rowEntry)
          total += parseInt(kr.getAttribute('yds'))
        } else {
          createElementHTML('td', 0, rowEntry)
        }
       if (pr){
          createElementHTML('td', pr.getAttribute('yds'), rowEntry)
          total += parseInt(pr.getAttribute('yds'))
        } else {
          createElementHTML('td', 0, rowEntry)
        }
       if (ir){
          createElementHTML('td', ir.getAttribute('yds'), rowEntry)
          total += parseInt(ir.getAttribute('yds'))
        } else {
          createElementHTML('td', 0, rowEntry)
        }
       createElementHTML('td', total, rowEntry)
       if (team.getAttribute('vh') === 'V') {
          allPurposeTableBodyVis.appendChild(rowEntry)
        } else {
          allPurposeTableBodyHome.appendChild(rowEntry)
        }
      }
      const ko = player?.getElementsByTagName('ko')[0]
      if (ko){
        rowEntry = document.createElement('tr')
        createElementHTML('td', player.getAttribute('name'), rowEntry)
        createElementHTML('td', ko.getAttribute('no'), rowEntry)
        createElementHTML('td', ko.getAttribute('yds'), rowEntry)
        createElementHTML('td', ko.getAttribute('tb'), rowEntry)
        createElementHTML('td', ko.getAttribute('ob'), rowEntry)
        avg = parseFloat(ko.getAttribute('yds') / ko.getAttribute('no')).toFixed(1)
        createElementHTML('td', avg, rowEntry)
      
        if (team.getAttribute('vh') === 'V') {
          kickoffTableBodyVis.appendChild(rowEntry)
        } else {
          kickoffTableBodyHome.appendChild(rowEntry)
        }
      }
      
      //const fumbles = player?.getElementsByTagName('fumbles')[0]
      //if (fumbles){
      //  // create a fumble log
      //}
    }
  }

  sortTable('passingStatsHome-table', 2)
  insertTotalRow('passingStatsHome-table', 'pass')
  sortTable('passingStatsVis-table',  2)
  insertTotalRow('passingStatsVis-table', 'pass')

  sortTable('rushingStatsHome-table', 4)
  insertTotalRow('rushingStatsHome-table', 'rush')
  sortTable('rushingStatsVis-table', 4)
  insertTotalRow('rushingStatsVis-table', 'rush')

  sortTable('receivingStatsHome-table', 1)
  insertTotalRow('receivingStatsHome-table', 'rec')
  sortTable('receivingStatsVis-table', 1)
  insertTotalRow('receivingStatsVis-table', 'rec')

  sortTable('puntingStatsHome-table', 2)
  insertTotalRow('puntingStatsHome-table', 'punt')
  sortTable('puntingStatsVis-table', 2)
  insertTotalRow('puntingStatsVis-table', 'punt')

  insertTotalRow('allReturnsStatsHome-table', 'allRet')
  insertTotalRow('allReturnsStatsVis-table', 'allRet')
  
  sortTable('allPurposeStatsHome-table', 6)
  insertTotalRow('allPurposeStatsHome-table', 'allPurp')
  sortTable('allPurposeStatsVis-table', 6)
  insertTotalRow('allPurposeStatsVis-table', 'allPurp')

  sortTable('kickoffStatsHome-table', 2)
  insertTotalRow('kickoffStatsHome-table', 'ko')
  sortTable('kickoffStatsVis-table', 2)
  insertTotalRow('kickoffStatsVis-table', 'ko')
}

function buildDrivesQuarter(x) {
  const driveTable = document.getElementById('driveQuarterTable-body')
  const drives = x.getElementsByTagName('drives')[0]
  let rowEntry, prevQtr = 1

  for (let i = 0; i < drives.getElementsByTagName('drive').length; i++) {
    const drive = drives.getElementsByTagName('drive')[i]
    const fieldLength = x.getElementsByTagName('rules')[0].getAttribute('field')
    const vh = drive?.getAttribute('vh')
    const team = drive?.getAttribute('team')
    const start = drive?.getAttribute('start').split(',')
    const end = drive?.getAttribute('end').split(',')
    const plays = drive?.getAttribute('plays')
    const yards = drive?.getAttribute('yards')
    const top = drive?.getAttribute('top')
    const rx = drive?.getAttribute('rx')
    const driveindex = drive?.getAttribute('driveindex')
    
    rowEntry = document.createElement('tr')
    createElementHTML('td', team, rowEntry)
    createElementHTML('td', numToQRT(start[1]), rowEntry)
    createElementHTML('td', yardsToSpot(x, start[3], fieldLength, team), rowEntry)
    createElementHTML('td', start[2], rowEntry)
    createElementHTML('td', typeToPlay(start[0]), rowEntry)
    createElementHTML('td', yardsToSpot(x, end[3], fieldLength, team), rowEntry)
    createElementHTML('td', end[2], rowEntry)
    createElementHTML('td', typeToPlay(end[0]), rowEntry)
    createElementHTML('td', `${plays}-${yards}`, rowEntry)
    createElementHTML('td', top, rowEntry)

    if (prevQtr !== Number(start[1])){
      prevQtr = Number(start[1])
      const blankEntry = document.createElement('tr')
      blankEntry.setAttribute('class', 'blank_row')
      createElementAttr('td', '', 'colspan', '10', blankEntry)
      driveTable.appendChild(blankEntry)
    }

    driveTable.appendChild(rowEntry)  
  }
}

 function buildDrivesComplete(x) {
  const driveTable = document.getElementById('driveCompleteTable-body')
  const drives = x.getElementsByTagName('drives')[0]
  let rowEntry

  const blankEntry = document.createElement('tr')
  blankEntry.setAttribute('class', 'blank_row')
  blankEntry.setAttribute('id', 'blankRow')
  createElementAttr('td', '', 'colspan', '10', blankEntry)
  driveTable.appendChild(blankEntry)

  for (let i = 0; i < drives.getElementsByTagName('drive').length; i++) {
    const drive = drives.getElementsByTagName('drive')[i]
    const fieldLength = x.getElementsByTagName('rules')[0].getAttribute('field')
    const vh = drive?.getAttribute('vh')
    const team = drive?.getAttribute('team')
    const start = drive?.getAttribute('start').split(',')
    const end = drive?.getAttribute('end').split(',')
    const plays = drive?.getAttribute('plays')
    const yards = drive?.getAttribute('yards')
    const top = drive?.getAttribute('top')
    const rx = drive?.getAttribute('rx')
    const driveindex = drive?.getAttribute('driveindex')
    
    rowEntry = document.createElement('tr')
    createElementHTML('td', team, rowEntry)
    createElementHTML('td', numToQRT(start[1]), rowEntry)
    createElementHTML('td', yardsToSpot(x, start[3], fieldLength, team), rowEntry)
    createElementHTML('td', start[2], rowEntry)
    createElementHTML('td', typeToPlay(start[0]), rowEntry)
    createElementHTML('td', yardsToSpot(x, end[3], fieldLength, team), rowEntry)
    createElementHTML('td', end[2], rowEntry)
    createElementHTML('td', typeToPlay(end[0]), rowEntry)
    createElementHTML('td', `${plays}-${yards}`, rowEntry)
    createElementHTML('td', top, rowEntry)

    if (vh === 'H'){
      AddBefore('blankRow', rowEntry)
    } else {
      AddAfter('blankRow', rowEntry)
    }  
  }
}

function buildDefense(x){
  document.getElementById('DefenseH').innerHTML = x.getElementsByTagName('team')[1].getAttribute('name')
  document.getElementById('DefenseV').innerHTML = x.getElementsByTagName('team')[0].getAttribute('name')

  const defenseTableH = document.getElementById('DefenseTableH-body')
  const defenseTableV = document.getElementById('DefenseTableV-body')

  for (let i = 0; i < x.getElementsByTagName('team').length; i++) {
    const team = x.getElementsByTagName('team')[i];

    for (let j = 0; j < team.getElementsByTagName('player').length; j++) {
      const player = team.getElementsByTagName('player')[j];
      let rowEntry

      const defense = player?.getElementsByTagName('defense')[0]
      if (defense) {
        rowEntry = document.createElement('tr')

        createElementHTML('td', player.getAttribute('uni'), rowEntry)
        createElementHTML('td', player.getAttribute('name'), rowEntry)

        const tackua = defense?.getAttribute('tackua')
        const tacka = defense?.getAttribute('tacka')
        let total = 0.0

        if (tackua && Number(tackua) !== 0) {
          createElementHTML('td', tackua, rowEntry)
          total += parseFloat(tackua)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        if (tacka && Number(tacka) !== 0) {
          createElementHTML('td', tacka, rowEntry)
          total += (parseFloat(tacka) * 0.5)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        createElementHTML('td', total.toFixed(1), rowEntry)        

        const tflua = defense?.getAttribute('tflua')
        const tfla = defense?.getAttribute('tfla')
        const tflyds = defense?.getAttribute('tflyds')
        let tflTot = '.'
        
        if (tflua || tfla) {
          if (tflua && tfla) {
            tflTot = Number(tflua) + (Number(tfla)*0.5)
          } else if (tflua) {
            tflTot = Number(tflua)
          } else if (tfla) {
            tflTot = Number(tfla) * 0.5
          }
          createElementHTML('td', `${tflTot.toFixed(1)}/${tflyds}`, rowEntry)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        const ff = defense?.getAttribute('ff')
        if (ff) {
          createElementHTML('td', ff, rowEntry)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        const fr = defense?.getAttribute('fr')
        const fryds = defense?.getAttribute('fryds')

        if (fr) {
          createElementHTML('td', `${fr}-${fryds}`, rowEntry)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        const int = defense?.getAttribute('int')
        const intyds = defense?.getAttribute('intyds')

        if (int) {
          createElementHTML('td', `${int}-${intyds}`, rowEntry)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        const brup = defense?.getAttribute('brup')

        if (brup) {
          createElementHTML('td', brup, rowEntry)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        const blkd = defense?.getAttribute('blkd')

        if (blkd) {
          createElementHTML('td', blkd, rowEntry)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        const sackua = defense?.getAttribute('sackua')
        const sacka = defense?.getAttribute('sacka')
        const sackyds = defense?.getAttribute('sackyds')
        let sackTot = '.'
        if (sackua || sacka) {
          if (sackua && sacka) {
            sackTot = Number(sackua) + (Number(sacka)*0.5)
          } else if (sackua) {
            sackTot = Number(sackua)
          } else if (sacka) {
            sackTot = Number(sacka) * 0.5
          }
          createElementHTML('td', `${sackTot.toFixed(1)}/${sackyds}`, rowEntry)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        const qbh = defense?.getAttribute('qbh')
        if (qbh) {
          createElementHTML('td', qbh, rowEntry)
        } else {
          createElementHTML('td', '.', rowEntry)
        }

        if (team.getAttribute('vh') === 'H') {
          defenseTableH.appendChild(rowEntry)
        } else {
          defenseTableV.appendChild(rowEntry)
        }
      }
    }
    sortTable('DefenseTableH', 4)
    sortTable('DefenseTableV', 4)
  }


  








}

function buildRosters(x) {

  for (let i = 0; i < x.getElementsByTagName('team').length; i++) {
    let team =  x.getElementsByTagName('team')[i];
    let rowEntry, roster

    if (i === 0) {
      roster = document.getElementById('teamRosterVis-table-body')

      rowEntry = document.createElement('th')
    	rowEntry.textContent = `${team.getAttribute('name')} Roster`
    	rowEntry.setAttribute('colspan', '2')
    	document.getElementById('teamRosterVis-table-head').appendChild(rowEntry)
      	
    } else {
      roster = document.getElementById('teamRosterHome-table-body')

      rowEntry = document.createElement('th')
    	rowEntry.textContent = `${team.getAttribute('name')} Roster`
    	rowEntry.setAttribute('colspan', '2')
    	document.getElementById('teamRosterHome-table-head').appendChild(rowEntry)
    } 

      for (let j = 0; j < team.getElementsByTagName('player').length; j++) {
        const player = team.getElementsByTagName('player')[j];

        rowEntry = document.createElement('tr')
        if (player.getAttribute('name') !== 'TEAM') {
          createElementAttr('td', player.getAttribute('uni'), 'class', 'playerNum', rowEntry)  
          createElementAttr('td', player.getAttribute('name'), 'class', 'playerName', rowEntry)
        }
        roster.appendChild(rowEntry)
    }
  }
}

function buildPlays(x){
  const qtrs = x.getElementsByTagName('plays')[0].getElementsByTagName('qtr')

  if (qtrs.length > 4){
    const OTDiv = document.createElement('div')
    OTDiv.setAttribute('id', 'OTPlays')

    const button = document.createElement('button')
    button.setAttribute('class', 'button')
    button.setAttribute('onclick', "toggleTextSingle('OTPlays')")

    document.getElementById('navBoxPlays').appendChild(button)
    document.getElementById('PlaysContainer').appendChild(OTDiv)
  }

  for (let nq = 0; nq < qtrs.length; nq++) {
    const qtr = qtrs[nq];

    const plays = qtr.getElementsByTagName('play')
    const drivestart  = qtr.getElementsByTagName('drivestart')
    const score  = qtr.getElementsByTagName('score')
    const drivesum  = qtr.getElementsByTagName('drivesum')

    let starthalf = false
    let rowEntry
    let currentTable, headerTable, bodyTable, quarterDiv, scoreCounter=0, i=0, j=0, k=0

    rowEntry = document.createElement('tr')
    switch (nq) {
      case 0:
        quarterDiv = document.getElementById('1stQtrPlays')
        starthalf = true
        createElementHTML('th', 'Start of 1st Half', rowEntry)
        break;
      case 1:
        quarterDiv = document.getElementById('2ndQtrPlays')
        createElementHTML('th', 'Start of Quarter #2', rowEntry)
        break;
      case 2:
        quarterDiv = document.getElementById('3rdQtrPlays')
        starthalf = true
        createElementHTML('th', 'Start of 2nd Half', rowEntry)
        break;
      case 3:
        quarterDiv = document.getElementById('4thQtrPlays')
        createElementHTML('th', 'Start of Quarter #4', rowEntry)
        break;
      case 4:
        quarterDiv = document.getElementById('OTPlays')
        createElementHTML('th', 'Start of Overtime', rowEntry)
        break;
    
      default:
        break;
    }

    // PLAYID drive num - play in drive - play total
    // DRIVESTART >> DRIVEINDEX drivenum - last play total
    // DRIVESUM >> DRIVEINDEX drivenum

    const firstDriveQtr = plays[0].getAttribute('playid').split(',')[0] 
    const lastDriveQtr = plays[plays.length-1].getAttribute('playid').split(',')[0]

    const firstPlayQtr = plays[0].getAttribute('playid').split(',')[2]
    const lastPlayQtr = plays[plays.length-1].getAttribute('playid').split(',')[2]

    for (let nd = Number(firstDriveQtr); nd <= Number(lastDriveQtr); nd++) {
      currentTable = document.createElement('table')
      currentTable.setAttribute('id', `driveTable${nq}-${nd}`)

      headerTable = document.createElement('thead')
      bodyTable = document.createElement('tbody')

      if (nd === Number(firstDriveQtr)){
        headerTable.appendChild(rowEntry)
        currentTable.appendChild(headerTable)

        if (starthalf){
          while (Number(plays[i].getAttribute('playid').split(',')[0]) === Number(firstDriveQtr)){
            rowEntry = document.createElement('tr')
            createElementHTML('td', plays[i].getAttribute('text'), rowEntry)
            i += 1
            bodyTable.appendChild(rowEntry)
          }
        } else {
          //PLAYS
          while (Number(plays[i].getAttribute('playid').split(',')[0]) === Number(firstDriveQtr)){
            rowEntry = document.createElement('tr')
            let down = numToQRT(plays[i].getAttribute('context').split(',')[1])
            let distance = plays[i].getAttribute('context').split(',')[2]
            let spot = plays[i].getAttribute('context').split(',')[3][0] === 'V' ? x.getElementsByTagName('team')[0].getAttribute('id') + plays[i].getAttribute('context').split(',')[3].slice(1) : x.getElementsByTagName('team')[1].getAttribute('id') + plays[i].getAttribute('context').split(',')[3].slice(1)
            createElementHTML('td', `${down} and ${distance} at ${spot}`, rowEntry)
            createElementHTML('td', plays[i].getAttribute('text'), rowEntry)
            bodyTable.appendChild(rowEntry)
            
            //SCORE
            if (plays[i]?.getAttribute('score') === 'Y'){ // && plays[i+1]?.getAttribute('type') !== 'X'){
              rowEntry = document.createElement('tr')
              let str = `${x.getElementsByTagName('team')[1]?.getAttribute('name')} ${score[scoreCounter]?.getAttribute('H')}-${score[scoreCounter]?.getAttribute('V')} ${x.getElementsByTagName('team')[0]?.getAttribute('name')}`
              createElementAttr('td', str, 'class', 'scoreEntry', rowEntry)
              bodyTable.appendChild(rowEntry)
              scoreCounter += 1
            }       
            i += 1
          }
        }
        currentTable.appendChild(bodyTable)
        currentTable.setAttribute('class', 'tableTable')
        quarterDiv.appendChild(currentTable)

      } else {

        rowEntry = document.createElement('tr')
        while(nd !== Number(drivestart[j].getAttribute('driveindex').split(',')[0])){
          j += 1
        }
        let teamPoss = drivestart[j].getAttribute('poss')[0]
        if (teamPoss === 'V'){
          createElementHTML('th', `${x.getElementsByTagName('team')[0].getAttribute('name')} at ${drivestart[j].getAttribute('poss').split(',')[2]}`, rowEntry)
        } else {
          createElementHTML('th', `${x.getElementsByTagName('team')[1].getAttribute('name')} at ${drivestart[j].getAttribute('poss').split(',')[2]}`, rowEntry)
        }
        headerTable.appendChild(rowEntry)
        currentTable.appendChild(headerTable)
      
        while(Number(plays[k].getAttribute('playid').split(',')[0]) !== nd){
          k += 1
        }
      
        for (k; Number(plays[k]?.getAttribute('playid').split(',')[0]) === nd; k++){
          //PLAYS
          rowEntry = document.createElement('tr')
          let down = numToQRT(plays[k].getAttribute('context').split(',')[1])
          let distance = plays[k].getAttribute('context').split(',')[2]
          let spot = plays[k].getAttribute('context').split(',')[3][0] === 'V' ? x.getElementsByTagName('team')[0].getAttribute('id') + plays[k].getAttribute('context').split(',')[3].slice(1) : x.getElementsByTagName('team')[1].getAttribute('id') + plays[k].getAttribute('context').split(',')[3].slice(1)
          createElementHTML('td', `${down} and ${distance} at ${spot}`, rowEntry)
          createElementHTML('td', plays[k].getAttribute('text'), rowEntry)
          bodyTable.appendChild(rowEntry)
      
          //SCORES
          if (plays[k]?.getAttribute('score') === 'Y' ){ //&& plays[k+1]?.getAttribute('type') !== 'X'){
            rowEntry = document.createElement('tr')
            let str = `${x.getElementsByTagName('team')[1]?.getAttribute('name')} ${score[scoreCounter]?.getAttribute('H')}-${score[scoreCounter]?.getAttribute('V')} ${x.getElementsByTagName('team')[0]?.getAttribute('name')}`
            createElementAttr('td', str, 'class', 'scoreEntry', rowEntry)
            bodyTable.appendChild(rowEntry)
            scoreCounter += 1
          }
      
          //FINALPLAY SCORE
          if (plays[k]?.getAttribute('playid').split(',')[2] === lastPlayQtr){
            rowEntry = document.createElement('tr')
            let str = `${x.getElementsByTagName('team')[1]?.getAttribute('name')} ${score[scoreCounter]?.getAttribute('H')}-${score[scoreCounter]?.getAttribute('V')} ${x.getElementsByTagName('team')[0]?.getAttribute('name')}`
            createElementAttr('td', str, 'class', 'scoreEntry', rowEntry)
            bodyTable.appendChild(rowEntry)
            scoreCounter += 1   
          }
        }
        currentTable.appendChild(bodyTable)
        currentTable.setAttribute('class', 'tableTable')
        quarterDiv.appendChild(currentTable)
      }
    }
  }
}
