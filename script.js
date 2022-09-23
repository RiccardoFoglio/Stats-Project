///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////CONTROL FUNCTIONS/////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
  menuCall('topNavbar')
  $('#topNavbar.navbar-nav > li').click(function (e) {
    $('#topNavbar.navbar-nav > li').removeClass('active');
    $(this).addClass('active');
    menuCall('topNavbar') 
  });
  
  menuCall('defenseNavbar')
  $('#individual-stats ul.navbar-nav > li').click(function (e) {
    $('#individual-stats ul.navbar-nav > li').removeClass('active');
    $(this).addClass('active');
    menuCall('defenseNavbar')
  });

  menuCall('driveNavbar')
  $('#drive-chart ul.navbar-nav > li').click(function (e) {
    $('#drive-chart ul.navbar-nav > li').removeClass('active');
    $(this).addClass('active');
    menuCall('driveNavbar')
  });

  menuCall('playsNavbar')
  $('#play-by-play ul.navbar-nav > li').click(function (e) {
    $('#play-by-play ul.navbar-nav > li').removeClass('active');
    $(this).addClass('active');
    menuCall('playsNavbar')
  });

  document.getElementById('box-score-select').onchange = function(){update('box-score-select')};
  document.getElementById('defense-select').onchange = function(){update('defense-select')};
  document.getElementById('drives-select').onchange = function(){update('drives-select')};
  document.getElementById('plays-select').onchange = function(){update('plays-select')};

  //updateDivShow()
  //function updateDivShow(){
  //}

});


document.addEventListener('DOMContentLoaded', () => {
  //const url = "3divxml/20220640.xml"

  //FIRST PAGE
  // <a href="stats.html?game=20220640 target='_blank'">
  //STATS PAGE
  //xml must be in same directory as stats page
  const urlParams = new URLSearchParams(window.location.search);
  const url =  `${urlParams.get('game')}.xml` ;
  

  fetch(url)
  .then(response=>response.text())
  .then(data=>{
    const parser = new DOMParser()
    const xml = parser.parseFromString(data, "application/xml")
    
    const title = document.getElementById('title')
    title.innerHTML = `${xml.getElementsByTagName('team')[0].getAttribute('name').toUpperCase()} vs ${xml.getElementsByTagName('team')[1].getAttribute('name').toUpperCase()}`

    buildBoxScore(xml)
    buildTeamStats(xml)
    buildIndStats(xml)
    buildDriveChart(xml)
    buildRosters(xml)
    buildPlays(xml)
  })
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////AUXILIARY FUNCTIONS////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function menuCall(id){
  let sections = document.getElementById(id).getElementsByTagName('li')
  for (let i = 0; i < sections.length; i++) {
    const element = sections[i];
    let id = element.getElementsByTagName('a')[0].getAttribute('href').slice(1)
    if (element.classList.contains('active')) {
      document.getElementById(id).style.display = 'block'
    } else {
      document.getElementById(id).style.display = 'none'
    }
  }
}

function update(id){
  let select = document.getElementById(id)
  let selectedOption = select.options[select.selectedIndex].value.slice(1)
  let siblings = []
  for (let i = 0; i < select.options.length; i++) {
    const idOption = select.options[i].value.slice(1);
    siblings.push(document.getElementById(idOption))  
  }
  for (let i = 0; i < siblings.length; i++) {
    const div = siblings[i]
    if (div.getAttribute('id') === selectedOption) {
      div.style.display = 'block'
    } else {
      div.style.display = 'none'
    }
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
  createElementHTML('td', 'Net Avg. / '+type, rowEntry)
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
    createElementAttr('td', (netH / noH).toFixed(1), 'class', 'text-center', rowEntry)
  } else {
    createElementAttr('td', '0.0', 'class', 'text-center', rowEntry)
  }

  if(fromV) {
    touchBackPartialV = 20 * parseFloat(fromV.getAttribute('tb'))
    noV = parseFloat(fromV.getAttribute('no'))
    netV = ydsV - retYdsH - touchBackPartialV
    createElementAttr('td', (netV / noV).toFixed(1), 'class', 'text-center', rowEntry)
  } else {
    createElementAttr('td', '0.0', 'class', 'text-center', rowEntry)
  }

  whereto.appendChild(rowEntry)
}

function headerRow(cont, whereto){
  let rowEntry = document.createElement('tr')
  let th = document.createElement('th')
  th.textContent = cont
  th.classList.add('header-group')
  th.setAttribute('colspan', 3)
  rowEntry.appendChild(th)
  whereto.appendChild(rowEntry)
}

function singleDatum(cont, wherefromH, wherefromV, attrib, whereto){
  let rowEntry = document.createElement('tr')
  createElementHTML('th', cont, rowEntry)

  if(wherefromH){
    createElementAttr('td', wherefromH.getAttribute(attrib), 'class', 'text-center', rowEntry)
  } else {
    createElementAttr('td', '0', 'class', 'text-center', rowEntry)
  }
  if(wherefromV){
    createElementAttr('td', wherefromV.getAttribute(attrib), 'class', 'text-center', rowEntry)
  } else {
    createElementAttr('td', '0', 'class', 'text-center', rowEntry)
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
  
  createElementAttr('th', cont, 'class', 'titleCell', rowEntry)
  createElementAttr('td', `${valH1}-${valH2}`, 'class', 'text-center', rowEntry)
  createElementAttr('td', `${valV1}-${valV2}`, 'class', 'text-center', rowEntry)
  whereto.appendChild(rowEntry)
}

function doubleDatumOF(cont, wherefromH, wherefromV, a1, a2, whereto){
  let rowEntry = document.createElement('tr')
  createElementAttr('th', cont, 'class', 'titleCell', rowEntry)

  if(wherefromH){
    createElementAttr('td', `${wherefromH.getAttribute(a1)} of ${wherefromH.getAttribute(a2)}`, 'class', 'text-center', rowEntry)
  } else {
    createElementAttr('td', '0 of 0', 'class', 'text-center', rowEntry)
  }
  if(wherefromV){
    createElementAttr('td', `${wherefromV.getAttribute(a1)} of ${wherefromV.getAttribute(a2)}`, 'class', 'text-center', rowEntry)
  } else {
    createElementAttr('td', '0 of 0', 'class', 'text-center', rowEntry)
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
  
  createElementHTML('th', cont, rowEntry)
  createElementAttr('td', `${valH1}-${valH2}-${valH3}`, 'class', 'text-center', rowEntry)
  createElementAttr('td', `${valV1}-${valV2}-${valV3}`, 'class', 'text-center', rowEntry)
  whereto.appendChild(rowEntry)
}

function singleAvgDatum(cont, wherefromH, wherefromV, attUp, attOver, whereto){
  rowEntry = document.createElement('tr')
  createElementHTML('th', cont, rowEntry)
  if(wherefromH){
    createElementAttr('td', parseFloat(wherefromH.getAttribute(attUp) / wherefromH.getAttribute(attOver)).toFixed(1), 'class', 'text-center', rowEntry)
  } else {
    createElementAttr('td','0.0', 'class', 'text-center', rowEntry)
  }
  if(wherefromV){
    createElementAttr('td', parseFloat(wherefromV.getAttribute(attUp) / wherefromV.getAttribute(attOver)).toFixed(1), 'class', 'text-center', rowEntry)
  } else {
    createElementAttr('td','0.0', 'class', 'text-center', rowEntry)
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
  
  createElementHTML('th', cont, rowEntry)
  createElementAttr('td', `${valH1}-${valH2}-${valH3}`, 'class', 'text-center', rowEntry)
  createElementAttr('td', `${valV1}-${valV2}-${valV3}`, 'class', 'text-center', rowEntry)
  whereto.appendChild(rowEntry)
}

function sortTable(id, pos, order) {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById(id);
  switching = true;
  
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[pos];
      y = rows[i + 1].getElementsByTagName("td")[pos];

      if (order === 'low'){
        if (Number(x?.innerHTML) > Number(y?.innerHTML) ) {
          shouldSwitch = true;
          break;
        }
      } else if (order === 'high'){
        if (Number(x?.innerHTML) < Number(y?.innerHTML) ) {
          shouldSwitch = true;
          break;
        }
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
  foot = document.getElementById(`${id}-foot`)
  rows = table.rows;
  rowEntry = document.createElement('tr')
  
  createElementHTML('th', 'TOTALS', rowEntry)

  switch (type) {
    case "pass":
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
        createElementAttr('td', max, 'class', 'text-center', rowEntry)
      } else {
        createElementAttr('td', total, 'class', 'text-center', rowEntry)
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
          createElementAttr('td', avg, 'class', 'text-center', rowEntry)
        } else if (c === 6) {
          createElementAttr('td', max, 'class', 'text-center', rowEntry)
        } else {
          createElementAttr('td', total, 'class', 'text-center', rowEntry)
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
          createElementAttr('td', max, 'class', 'text-center', rowEntry)
        } else {
          createElementAttr('td', total, 'class', 'text-center', rowEntry)
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
          createElementAttr('td', avg, 'class', 'text-center', rowEntry)
        } else if (c === 4) {
          createElementAttr('td', max, 'class', 'text-center', rowEntry)
        } else {
          createElementAttr('td', total, 'class', 'text-center', rowEntry)
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
          createElementAttr('td', max, 'class', 'text-center', rowEntry)
        } else {
          createElementAttr('td', total, 'class', 'text-center', rowEntry)
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
        createElementAttr('td', total, 'class', 'text-center', rowEntry)
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
          createElementAttr('td', avg, 'class', 'text-center', rowEntry)
        } else {
          createElementAttr('td', total, 'class', 'text-center', rowEntry)
        }
      }
      break;
  
    default:
      break;
      }  

  foot = id + '-foot'
  document.getElementById(foot).appendChild(rowEntry)
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////BUILD FUNCTIONS//////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function buildBoxScore(x){
  const teamV = x.getElementsByTagName('team')[0]
  const teamH = x.getElementsByTagName('team')[1]

  // box-score-graphic
  document.getElementById('awayLogo').src = `logos/${teamV.getAttribute('id').toLowerCase()}.jpg`
  document.getElementById('awayLogo').alt = `${capitalize(teamV.getAttribute('name'))} logo`
  document.getElementById('homeLogo').src = `logos/${teamH.getAttribute('id').toLowerCase()}.jpg`
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
  const title = document.createElement('h4')
  title.innerHTML = `${capitalize(teamV.getAttribute('name'))} (${teamV.getAttribute('record')}) -VS- ${capitalize(teamH.getAttribute('name'))} (${teamH.getAttribute('record')})`.toUpperCase()
  title.classList.add('main-heading', 'text-center', 'text-uppercase')

  //box-score-graphic-caption TABLE
  const table = document.getElementById('score-qrt-table')
  const tableHead = document.getElementById('score-qrt-table-head')
  const tableBody = document.getElementById('score-qrt-table-body')

  let rowEntry, th, span

  table.before(title)

  rowEntry = document.createElement('tr')
  createElementHTML('th', '', rowEntry)

  for (let i = 0; i < Number(teamV.getElementsByTagName('linescore')[0].getAttribute('prds')); i++) {
    th = document.createElement('th')
    span = document.createElement('span')
    span.innerHTML = i+1
    span.classList.add('hide-on-medium')
    th.appendChild(span)
    span = document.createElement('span')
    span.innerHTML = numToQRT(String(i+1))
    span.classList.add('hide-on-small-down')
    th.appendChild(span)
    th.setAttribute('scope', 'col')
    rowEntry.appendChild(th)
  }
  th = document.createElement('th')
  span = document.createElement('span')
  span.innerHTML = 'F'
  span.classList.add('hide-on-medium')
  th.appendChild(span)
  span = document.createElement('span')
  span.innerHTML = 'Final'
  span.classList.add('hide-on-small-down')
  th.appendChild(span)
  th.setAttribute('scope', 'col')
  rowEntry.appendChild(th)
  tableHead.appendChild(rowEntry)

  rowEntry = document.createElement('tr')
  createElementHTML('th', capitalize(teamV.getAttribute('name')), rowEntry)
  for (let i = 0; i < Number(teamV.getElementsByTagName('linescore')[0].getAttribute('prds')); i++) {
    createElementHTML('td', teamV.getElementsByTagName('linescore')[0].getAttribute('line').split(',')[i], rowEntry)
  }
  createElementAttr('td', teamV.getElementsByTagName('linescore')[0].getAttribute('score'), 'class', 'emphasize', rowEntry)
  tableBody.appendChild(rowEntry)

  rowEntry = document.createElement('tr')
  createElementHTML('th', capitalize(teamH.getAttribute('name')), rowEntry)
  for (let i = 0; i < Number(teamH.getElementsByTagName('linescore')[0].getAttribute('prds')); i++) {
    createElementHTML('td', teamH.getElementsByTagName('linescore')[0].getAttribute('line').split(',')[i], rowEntry)
  }
  createElementAttr('td', teamH.getElementsByTagName('linescore')[0].getAttribute('score'), 'class', 'emphasize', rowEntry)
  tableBody.appendChild(rowEntry)

  // General info list
  buildGeneralInfo(x)

  // Scoring Summary
  buildScoringSummary(x)

  // Refs
  buildReferees(x)

}

function buildTeamStats(x) {
  const tableHead = document.getElementById('teamTotalsComplete-table-head')
  const contentTable = document.getElementById('teamTotalsComplete-table-body')
  const teamH = x.getElementsByTagName('team')[1]
  const teamV = x.getElementsByTagName('team')[0]

  let rowEntry, th

  createElementHTML('th', '', tableHead)
  th = document.createElement('th')
  th.innerHTML = teamH.getAttribute('id')
  th.classList.add('text-center')
  th.setAttribute('scope', 'col')
  tableHead.appendChild(th)
  th = document.createElement('th')
  th.innerHTML = teamV.getAttribute('id')
  th.classList.add('text-center')
  th.setAttribute('scope', 'col')
  tableHead.appendChild(th)

  const totalsH = teamH.getElementsByTagName('totals')[0]
  const totalsV = teamV.getElementsByTagName('totals')[0]

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

  headerRow('FIRST DOWNS', contentTable)
  singleDatum('Total', firstdownsH, firstdownsV, 'no', contentTable)
  singleDatum('Rushing', firstdownsH, firstdownsV, 'rush', contentTable)
  singleDatum('Passing', firstdownsH, firstdownsV, 'pass', contentTable)
  singleDatum('Penalty', firstdownsH, firstdownsV, 'penalty', contentTable)

  headerRow('RUSHING', contentTable)
  singleDatum('Total (Net)', rushH, rushV, 'yds', contentTable)
  singleDatum('Attempts', rushH, rushV, 'att', contentTable)
  singleAvgDatum('Avg. Per Rush', rushH, rushV, 'yds', 'att', contentTable)
  singleDatum('Rushing TDs', rushH, rushV, 'td', contentTable)
  singleDatum('Yds. Gained', rushH, rushV, 'gain', contentTable)
  singleDatum('Yds. Lost', rushH, rushV, 'loss', contentTable)

  headerRow('PASSING', contentTable)
  singleDatum('Total (Net)', passH, passV, 'yds', contentTable)
  tripleDatum('Comp.-Att.-Int.', passH, passV, 'comp', 'att', 'int', contentTable)
  singleAvgDatum('Avg. / Att.', passH, passV, 'yds', 'att', contentTable)
  singleAvgDatum('Avg. / Comp.', passH, passV, 'yds', 'comp', contentTable)
  singleDatum('TDs', passH, passV, 'td', contentTable)

  headerRow('TOTAL OFFENSE', contentTable)
  rowEntry = document.createElement('tr')
  createElementAttr('td', 'Yards', 'class', 'titleCell', rowEntry)
  createElementAttr('td', parseFloat(rushH.getAttribute('yds'))+ parseFloat(passH.getAttribute('yds')), 'class', 'text-center', rowEntry)
  createElementAttr('td', parseFloat(rushV.getAttribute('yds'))+ parseFloat(passV.getAttribute('yds')), 'class', 'text-center', rowEntry)
  contentTable.appendChild(rowEntry)

  rowEntry = document.createElement('tr')
  createElementHTML('td', 'Plays', rowEntry)
  createElementAttr('td', parseFloat(rushH.getAttribute('att'))+ parseFloat(passH.getAttribute('att')), 'class', 'text-center', rowEntry)
  createElementAttr('td', parseFloat(rushV.getAttribute('att'))+ parseFloat(passV.getAttribute('att')), 'class', 'text-center', rowEntry)
  contentTable.appendChild(rowEntry)

  rowEntry = document.createElement('tr')
  createElementHTML('td', 'Avg. / Play', rowEntry)
  let totydsH = parseFloat(rushH.getAttribute('yds')) + parseFloat(passH.getAttribute('yds'))
  let totydsV = parseFloat(rushV.getAttribute('yds')) + parseFloat(passV.getAttribute('yds'))
  let totplaysV = parseFloat(rushH.getAttribute('att')) + parseFloat(passH.getAttribute('att'))
  let totplaysH = parseFloat(rushV.getAttribute('att')) + parseFloat(passV.getAttribute('att'))
  createElementAttr('td', (totydsH / totplaysH).toFixed(1), 'class', 'text-center', rowEntry)
  createElementAttr('td', (totydsV / totplaysV).toFixed(1), 'class', 'text-center', rowEntry)
  contentTable.appendChild(rowEntry)

  doubleDatum('Fumbles - Lost', fumblesH, fumblesV, 'no', 'lost', contentTable)
  doubleDatum('Penalties - Lost', penaltiesH, penaltiesV, 'no', 'yds', contentTable)

  headerRow('PUNTING', contentTable)
  doubleDatum('Punts - Yds.', puntH, puntV, 'no', 'yds', contentTable)
  singleAvgDatum('Avg. / Punt', puntH, puntV, 'yds', 'no', contentTable)
  netAverage('Punt', puntH, puntV, prH, prV, contentTable)
  singleDatum('Inside 20', puntH, puntV, 'inside20', contentTable)
  singleDatum('50+ Yds.', puntH, puntV, 'plus50', contentTable)
  singleDatum('Touchbacks', puntH, puntV, 'tb', contentTable)
  singleDatum('Fair Catch', puntH, puntV, 'fc', contentTable)

  headerRow('KICKOFFS', contentTable)
  doubleDatum('Total - Yds.', koH, koV, 'no', 'yds', contentTable)
  singleAvgDatum('Avg. Yds. / Kickoff', koH, koV, 'yds', 'no', contentTable)
  netAverage('Kickoff', koH, koV, krH, krV, contentTable)
  singleDatum('Touchbacks', koH, koV, 'tb', contentTable)

  headerRow('RETURNS', contentTable)
  tripleDatum('Punt: Total-Yds.-TDs', prH, prV, 'no', 'yds', 'td', contentTable)
  singleAvgDatum('Punt: Avg. / Return', prH, prV, 'yds', 'no', contentTable)
  tripleDatum('Kickoff: Total-Yds.-TDs', krH, krV, 'no', 'yds', 'td', contentTable)
  singleAvgDatum('Kickoff: Avg. / Return', krH, krV, 'yds', 'no', contentTable)
  tripleDatum('INT: Total-Yds.-TDs', irH, irV, 'no', 'yds', 'td', contentTable)
  tripleDatum('Fumble: Total-Yds.-TDs', defenseH, defenseV, 'fr', 'fryds', 'frtd', contentTable)
  
  headerRow('MISCELLANEOUS', contentTable)
  singleDatum('Misc. Yards', miscH, miscV, 'yds', contentTable)
  doubleDatumOF('3rd. Down Conv.', conversionsH, conversionsV, 'thirdconv', 'thirdatt', contentTable)
  doubleDatumOF('4th. Down Conv', conversionsH, conversionsV, 'fourthconv', 'fourthatt', contentTable)
  doubleDatum('Red-Zone: Scores - Chances', redzoneH, redzoneV, 'scores', 'att', contentTable)
  doubleDatum('Sacks: Total - Yds.', defenseH, defenseV, 'sacks', 'sackyds', contentTable)
  doubleDatum('PAT: Total - Made', patH, patV, 'kickmade', 'kickatt', contentTable)
  doubleDatum('Field Goals: Total - Made', fgH, fgV, 'made', 'att', contentTable)

  headerRow('POSSESSION', contentTable)
  singleDatum('Poss. Time', miscH, miscV, 'top', contentTable)
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
}

function buildIndStats(x){
  document.getElementById('AwayDefense_button').innerHTML = capitalize(x.getElementsByTagName('team')[0].getAttribute('name'))
  document.getElementById('HomeDefense_button').innerHTML = capitalize(x.getElementsByTagName('team')[1].getAttribute('name'))

  document.getElementById('AwayDefense_option').innerHTML = capitalize(x.getElementsByTagName('team')[0].getAttribute('name'))
  document.getElementById('HomeDefense_option').innerHTML = capitalize(x.getElementsByTagName('team')[1].getAttribute('name'))


  buildIndOffense(x)
  buildDefense(x)
  buildSpecialTeams(x)
}

function buildDriveChart(x){
  document.getElementById('awayDrive_button').innerHTML = capitalize(x.getElementsByTagName('team')[0].getAttribute('name'))
  document.getElementById('homeDrive_button').innerHTML = capitalize(x.getElementsByTagName('team')[1].getAttribute('name'))

  document.getElementById('awayDrive_option').innerHTML = capitalize(x.getElementsByTagName('team')[0].getAttribute('name'))
  document.getElementById('homeDrive_option').innerHTML = capitalize(x.getElementsByTagName('team')[1].getAttribute('name'))

  buildDrivesQuarter(x)
  buildDrivesTeams(x)
}

function buildPlays(x){
  const qtrs = x.getElementsByTagName('plays')[0].getElementsByTagName('qtr')
  let rowEntry, th, td

  for (let nq = 0; nq < qtrs.length; nq++) {
    const qtr = qtrs[nq];
    const plays = qtr.getElementsByTagName('play')
    const drivestart  = qtr.getElementsByTagName('drivestart')
    const score  = qtr.getElementsByTagName('score')
    let starthalf = false
    let currentTable, headerTable, bodyTable, quarterDiv, scoreCounter=0, i=0, j=0, k=0
    // PLAYID drive num - play in drive - play total
    // DRIVESTART >> DRIVEINDEX drivenum - last play total
    // DRIVESUM >> DRIVEINDEX drivenum
    const firstDriveQtr = plays[0].getAttribute('playid').split(',')[0] 
    const lastDriveQtr = plays[plays.length-1].getAttribute('playid').split(',')[0]
    //const firstPlayQtr = plays[0].getAttribute('playid').split(',')[2]
    const lastPlayQtr = plays[plays.length-1].getAttribute('playid').split(',')[2]

    for (let nd = Number(firstDriveQtr); nd <= Number(lastDriveQtr); nd++) {
      currentTable = document.createElement('table')
      currentTable.classList.add('sidearm-table', 'overall-stats', 'plays', 'highlight-hover', 'collapse-on-small')
      currentTable.setAttribute('id', `driveTable${nq}-${nd}`)
      headerTable = document.createElement('thead')
      bodyTable = document.createElement('tbody')

      //SET START OF QUARTER
      rowEntry = document.createElement('tr')
      if (nd === Number(firstDriveQtr)){
        switch (nq) {
          case 0:
            quarterDiv = document.getElementById('1st')
            starthalf = true
            createElementAttr('th', 'Start of 1st Half', 'class', 'text-center', rowEntry)
            break;
          case 1:
            quarterDiv = document.getElementById('2nd')
            th = document.createElement('th')
            th.textContent = 'Start of Quarter #2'
            th.setAttribute('colspan', '2')
            th.classList.add('text-center')
            rowEntry.appendChild(th)
            break;
          case 2:
            quarterDiv = document.getElementById('3rd')
            starthalf = true
            createElementAttr('th', 'Start of 2nd Half', 'class', 'text-center', rowEntry)
            break;
          case 3:
            quarterDiv = document.getElementById('4th')
            th = document.createElement('th')
            th.textContent = 'Start of Quarter #4'
            th.setAttribute('colspan', '2')
            th.classList.add('text-center')
            rowEntry.appendChild(th)
            break;
          case 4:
            quarterDiv = document.getElementById('ot')
            th = document.createElement('th')
            th.textContent = 'Start of Overtime'
            th.setAttribute('colspan', '2')
            th.classList.add('text-center')
            rowEntry.appendChild(th)

            $('#playsNavbar li:last-child').removeClass('hide')
            $('#plays-select option:last-child').removeClass('hide')
            $('#play-by-play #ot').removeClass('hide')
            break;
          default:
            break;
        }
        headerTable.appendChild(rowEntry)
        currentTable.appendChild(headerTable)

        // BODY TABLE OPTIONS
        if (starthalf){
          //coin toss, Kickoff etc...
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
            
            td = document.createElement('td')
            td.textContent = `${down} and ${distance} at ${spot}`
            td.classList.add('text-italic-on-small-down')
            rowEntry.appendChild(td)

            createElementHTML('td', plays[i].getAttribute('text'), rowEntry)
            bodyTable.appendChild(rowEntry)
            
            //SCORE
            if (plays[i]?.getAttribute('score') === 'Y'){
              if (plays[i]?.getAttribute('text').includes('TOUCHDOWN') && plays[i+1]?.getAttribute('type') === 'X') {
                //PRINT EXTRA POINT ENTRY
                i += 1
                rowEntry = document.createElement('tr')
                let down = numToQRT(plays[i].getAttribute('context').split(',')[1])
                let distance = plays[i].getAttribute('context').split(',')[2]
                let spot = plays[i].getAttribute('context').split(',')[3][0] === 'V' ? x.getElementsByTagName('team')[0].getAttribute('id') + plays[i].getAttribute('context').split(',')[3].slice(1) : x.getElementsByTagName('team')[1].getAttribute('id') + plays[i].getAttribute('context').split(',')[3].slice(1)
                td = document.createElement('td')
                td.textContent = `${down} and ${distance} at ${spot}`
                td.classList.add('text-italic-on-small-down')
                rowEntry.appendChild(td)
                createElementHTML('td', plays[i].getAttribute('text'), rowEntry)
                bodyTable.appendChild(rowEntry)
              }
              //SCORE ENTRY
              rowEntry = document.createElement('tr')
              let str = `${capitalize(x.getElementsByTagName('team')[1]?.getAttribute('name'))} ${score[scoreCounter]?.getAttribute('H')}-${score[scoreCounter]?.getAttribute('V')} ${capitalize(x.getElementsByTagName('team')[0]?.getAttribute('name'))}`
              td = document.createElement('td')
              td.textContent = str
              td.setAttribute('colspan', '2')
              td.classList.add('text-center', 'special-stats', 'emphasize', 'primary', 'inline')
              rowEntry.appendChild(td)
              bodyTable.appendChild(rowEntry)
              scoreCounter += 1
            }       
            i += 1
          }
        }
        currentTable.appendChild(bodyTable)
        quarterDiv.appendChild(currentTable)

      } else {

        while(nd !== Number(drivestart[j].getAttribute('driveindex').split(',')[0])){
          j += 1
        }
        let teamPoss = drivestart[j].getAttribute('poss')[0]
        
        //TABLE HEADER
        rowEntry = document.createElement('tr')
        th = document.createElement('th')
        th.textContent = teamPoss === 'V' ? `${capitalize(x.getElementsByTagName('team')[0].getAttribute('name'))} at ${drivestart[j].getAttribute('poss').split(',')[2]}` : `${capitalize(x.getElementsByTagName('team')[1].getAttribute('name'))} at ${drivestart[j].getAttribute('poss').split(',')[2]}`
        th.setAttribute('colspan', '2')
        th.setAttribute('scope', 'colgroup')
        th.classList.add('text-center')
        rowEntry.appendChild(th)
        headerTable.appendChild(rowEntry)
        rowEntry = document.createElement('tr')
        rowEntry.classList.add('hide')
        th = document.createElement('th')
        th.setAttribute('scope', 'col')
        th.innerHTML = 'Down & Distance'
        rowEntry.appendChild(th)
        th = document.createElement('th')
        th.setAttribute('scope', 'col')
        th.innerHTML = 'Play'
        rowEntry.appendChild(th)
        headerTable.appendChild(rowEntry)
        currentTable.appendChild(headerTable)
        
        //team DRIVE START AT clock ON SMALL
        rowEntry = document.createElement('tr')
        td = document.createElement('td')
        td.textContent = teamPoss === 'V' ? `${capitalize(x.getElementsByTagName('team')[0].getAttribute('name'))} at ${drivestart[j].getAttribute('poss').split(',')[2]}` : `${capitalize(x.getElementsByTagName('team')[1].getAttribute('name'))} at ${drivestart[j].getAttribute('poss').split(',')[2]}`
        td.setAttribute('colspan', '2')
        td.classList.add('text-center', 'emphasize', 'hide-on-medium')
        rowEntry.appendChild(td)
        bodyTable.appendChild(rowEntry)

        while(Number(plays[k].getAttribute('playid').split(',')[0]) !== nd){k += 1}
        
        while (Number(plays[k]?.getAttribute('playid').split(',')[0]) === nd) {
          //PLAYS
          rowEntry = document.createElement('tr')
          let down = numToQRT(plays[k].getAttribute('context').split(',')[1])
          let distance = plays[k].getAttribute('context').split(',')[2]
          let spot = plays[k].getAttribute('context').split(',')[3][0] === 'V' ? x.getElementsByTagName('team')[0].getAttribute('id') + plays[k].getAttribute('context').split(',')[3].slice(1) : x.getElementsByTagName('team')[1].getAttribute('id') + plays[k].getAttribute('context').split(',')[3].slice(1)
          
          td = document.createElement('td')
          td.textContent = `${down} and ${distance} at ${spot}`
          td.classList.add('text-italic-on-small-down')
          rowEntry.appendChild(td)
          
          createElementHTML('td', plays[k]?.getAttribute('text'), rowEntry)
          bodyTable.appendChild(rowEntry)
      
          //SCORES
          if (plays[k]?.getAttribute('score') === 'Y'){ //&& plays[k+1]?.getAttribute('type') !== 'X'){
            if (plays[k]?.getAttribute('text').includes('TOUCHDOWN') && plays[k+1]?.getAttribute('type') === 'X') {
              //PRINT EXTRA POINT ENTRY
              k += 1
              rowEntry = document.createElement('tr')
              let down = numToQRT(plays[k].getAttribute('context').split(',')[1])
              let distance = plays[k].getAttribute('context').split(',')[2]
              let spot = plays[k].getAttribute('context').split(',')[3][0] === 'V' ? x.getElementsByTagName('team')[0].getAttribute('id') + plays[k].getAttribute('context').split(',')[3].slice(1) : x.getElementsByTagName('team')[1].getAttribute('id') + plays[k].getAttribute('context').split(',')[3].slice(1)
              td = document.createElement('td')
              td.textContent = `${down} and ${distance} at ${spot}`
              td.classList.add('text-italic-on-small-down')
              rowEntry.appendChild(td)
              createElementHTML('td', plays[k].getAttribute('text'), rowEntry)
              bodyTable.appendChild(rowEntry)
            }
            //SCORE ENTRY
            if (plays[k].getAttribute('playid').split(',')[2] !== lastPlayQtr) { // not last play = score, would repeat score entry twice
              rowEntry = document.createElement('tr')
              let str = `${capitalize(x.getElementsByTagName('team')[1]?.getAttribute('name'))} ${score[scoreCounter]?.getAttribute('H')}-${score[scoreCounter]?.getAttribute('V')} ${capitalize(x.getElementsByTagName('team')[0]?.getAttribute('name'))}`
              td = document.createElement('td')
              td.textContent = str
              td.setAttribute('colspan', '2')
              td.classList.add('text-center', 'special-stats', 'emphasize', 'primary', 'inline')
              rowEntry.appendChild(td)
              bodyTable.appendChild(rowEntry)
              scoreCounter += 1
            }
          }
      
          //FINALPLAY SCORE
          if (plays[k]?.getAttribute('playid').split(',')[2] === lastPlayQtr){
            rowEntry = document.createElement('tr')
            let str = `${capitalize(x.getElementsByTagName('team')[1]?.getAttribute('name'))} ${score[scoreCounter]?.getAttribute('H')}-${score[scoreCounter]?.getAttribute('V')} ${capitalize(x.getElementsByTagName('team')[0]?.getAttribute('name'))}`
            
            td = document.createElement('td')
            td.textContent = str
            td.setAttribute('colspan', '2')
            td.classList.add('text-center', 'special-stats', 'emphasize', 'primary', 'inline')
            rowEntry.appendChild(td)
            
            bodyTable.appendChild(rowEntry)
            scoreCounter += 1   
          }
          k += 1
        }
        currentTable.appendChild(bodyTable)
        quarterDiv.appendChild(currentTable)
      }
    }
  }
}

function buildRosters(x) {

  document.getElementById('V-roster').innerHTML = capitalize(x.getElementsByTagName('team')[0].getAttribute('name'))
  document.getElementById('H-roster').innerHTML = capitalize(x.getElementsByTagName('team')[1].getAttribute('name'))


  for (let i = 0; i < x.getElementsByTagName('team').length; i++) {
    let team =  x.getElementsByTagName('team')[i];
    let rowEntry, roster

    roster = i === 0 ? document.getElementById('teamRosterVis-table-body') : document.getElementById('teamRosterHome-table-body')

      for (let j = 0; j < team.getElementsByTagName('player').length; j++) {
        const player = team.getElementsByTagName('player')[j];

        rowEntry = document.createElement('tr')
        if (player.getAttribute('name') !== 'TEAM') {
          createElementAttr('td', Number(player.getAttribute('uni')), 'class', 'text-center', rowEntry)  
          createElementHTML('td', player.getAttribute('name'), rowEntry)
        }
        roster.appendChild(rowEntry)
    }
  }

  sortTable('teamRosterVis-table', 0, 'low')
  sortTable('teamRosterHome-table', 0, 'low')
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////AUX BUILD FUNCTIONS////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  let rowEntry, td

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

    td = document.createElement('td')
    td.innerHTML = `${numToQRT(score.getAttribute('qtr'))} - ${score.getAttribute('clock')}`
    td.classList.add('hide-on-large', 'emphasize', 'hide-label')
    td.setAttribute('data-label', '')
    rowEntry.appendChild(td)
    

    td = document.createElement('td')
    td.innerHTML = numToQRT(score.getAttribute('qtr'))
    td.classList.add('hide-on-medium-down')
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.innerHTML = score.getAttribute('clock')
    td.classList.add('hide-on-medium-down', 'text-center')
    rowEntry.appendChild(td)

    let str = drive ? `${play} - ${drive}` : `${play}` 
    createElementHTML('td', str, rowEntry)

    td = document.createElement('td')
    td.innerHTML = score.getAttribute('vscore')
    td.classList.add('text-normal-on-large', 'text-center', 'text-bold')
    td.setAttribute('data-label', x.getElementsByTagName('team')[0].getAttribute('id'))
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.innerHTML = score.getAttribute('hscore')
    td.classList.add('text-normal-on-large', 'text-center', 'text-bold')
    td.setAttribute('data-label', x.getElementsByTagName('team')[1].getAttribute('id'))
    rowEntry.appendChild(td)

    body.appendChild(rowEntry)

    if (i === scores.length-1) {
      rowEntry = document.createElement('tr')

      td = document.createElement('td')
      td.classList.add('hide-on-medium-down')
      rowEntry.appendChild(td)
      td = document.createElement('td')
      td.classList.add('hide-on-medium-down')
      rowEntry.appendChild(td)
      td = document.createElement('td')
      td.classList.add('hide-on-medium-down')
      rowEntry.appendChild(td)

      td = document.createElement('td')
      td.innerHTML = score.getAttribute('vscore')
      td.classList.add('text-normal-on-large', 'text-center', 'text-bold')
      td.setAttribute('data-label', x.getElementsByTagName('team')[0].getAttribute('name'))
      rowEntry.appendChild(td)

      td = document.createElement('td')
      td.innerHTML = score.getAttribute('hscore')
      td.classList.add('text-normal-on-large', 'text-center', 'text-bold')
      td.setAttribute('data-label', x.getElementsByTagName('team')[1].getAttribute('name'))
      rowEntry.appendChild(td)

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
        createElementHTML('td', `${refToReferee(officials.attributes[refPos]?.name)}: ${capitalize(officials.attributes[refPos]?.value)}`, rowEntry)
      }
      refPos += 1
    }
    table.appendChild(rowEntry)
  }
}

function buildIndOffense(x) {
  document.getElementById('V-pass').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - Passing`
  document.getElementById('H-pass').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - Passing`
  document.getElementById('V-rush').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - Rushing`
  document.getElementById('H-rush').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - Rushing`
  document.getElementById('V-rec').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - Receiving`
  document.getElementById('H-rec').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - Receiving`

  const passingTableBodyHome = document.getElementById('passingStatsHome-table-body')
  const rushingTableBodyHome = document.getElementById('rushingStatsHome-table-body')
  const receivingTableBodyHome = document.getElementById('receivingStatsHome-table-body')
  
  const passingTableBodyVis = document.getElementById('passingStatsVis-table-body')
  const rushingTableBodyVis = document.getElementById('rushingStatsVis-table-body')
  const receivingTableBodyVis = document.getElementById('receivingStatsVis-table-body')
  
  for (let i = 0; i < x.getElementsByTagName('team').length; i++) {
    let team = x.getElementsByTagName('team')[i];

    for (let j = 0; j < team.getElementsByTagName('player').length; j++) {
      let player = team.getElementsByTagName('player')[j];
      let rowEntry

     let pass = player?.getElementsByTagName('pass')[0]
      if (pass) {
        rowEntry = document.createElement('tr')
        createElementHTML('th', player.getAttribute('name'), rowEntry)
        createElementAttr('td', pass.getAttribute('comp'), 'class', 'text-center', rowEntry)
        createElementAttr('td', pass.getAttribute('att'), 'class', 'text-center', rowEntry)
        createElementAttr('td', pass.getAttribute('yds'), 'class', 'text-center', rowEntry)
        createElementAttr('td', pass.getAttribute('td'), 'class', 'text-center', rowEntry)
        createElementAttr('td', pass.getAttribute('int'), 'class', 'text-center', rowEntry)
        createElementAttr('td', pass.getAttribute('long'), 'class', 'text-center', rowEntry)
        createElementAttr('td', pass.getAttribute('sacks'), 'class', 'text-center', rowEntry)
       if (team.getAttribute('vh') === 'V') {
          passingTableBodyVis.appendChild(rowEntry)
        } else {
          passingTableBodyHome.appendChild(rowEntry)
        }
      }

      let rush = player?.getElementsByTagName('rush')[0]
      if (rush) {
       rowEntry = document.createElement('tr')
        createElementHTML('th', player.getAttribute('name'), rowEntry)
        createElementAttr('td', rush.getAttribute('att'), 'class', 'text-center', rowEntry)
        createElementAttr('td', rush.getAttribute('gain'), 'class', 'text-center', rowEntry)
        createElementAttr('td', rush.getAttribute('loss'), 'class', 'text-center', rowEntry)
        net = parseFloat(rush.getAttribute('gain') - rush.getAttribute('loss'))
        createElementAttr('td', net, 'class', 'text-center', rowEntry)
        createElementAttr('td', rush.getAttribute('td'), 'class', 'text-center', rowEntry)
        createElementAttr('td', rush.getAttribute('long'), 'class', 'text-center', rowEntry)
        avg = parseFloat(net / rush.getAttribute('att')).toFixed(1)
        createElementAttr('td', avg, 'class', 'text-center', rowEntry)
       if (team.getAttribute('vh') === 'V') {
          rushingTableBodyVis.appendChild(rowEntry)
        } else {
          rushingTableBodyHome.appendChild(rowEntry)
        }
      }
     let rcv = player?.getElementsByTagName('rcv')[0]
      if (rcv) {
        rowEntry = document.createElement('tr')
        createElementHTML('th', player.getAttribute('name'), rowEntry)
        createElementAttr('td', rcv.getAttribute('no'), 'class', 'text-center', rowEntry)
        createElementAttr('td', rcv.getAttribute('yds'), 'class', 'text-center', rowEntry)
        createElementAttr('td', rcv.getAttribute('td'), 'class', 'text-center', rowEntry)
        createElementAttr('td', rcv.getAttribute('long'), 'class', 'text-center', rowEntry)
       if (team.getAttribute('vh') === 'V') {
          receivingTableBodyVis.appendChild(rowEntry)
        } else {
          receivingTableBodyHome.appendChild(rowEntry)
        }
      }
    }
  }

  sortTable('passingStatsHome-table', 2, 'high')
  insertTotalRow('passingStatsHome-table', 'pass')
  sortTable('passingStatsVis-table',  2, 'high')
  insertTotalRow('passingStatsVis-table', 'pass')

  sortTable('rushingStatsHome-table', 3, 'high')
  insertTotalRow('rushingStatsHome-table', 'rush')
  sortTable('rushingStatsVis-table', 3, 'high')
  insertTotalRow('rushingStatsVis-table', 'rush')

  sortTable('receivingStatsHome-table', 1, 'high')
  insertTotalRow('receivingStatsHome-table', 'rec')
  sortTable('receivingStatsVis-table', 1, 'high')
  insertTotalRow('receivingStatsVis-table', 'rec')

}

function buildDefense(x){
  document.getElementById('AwayDefense').getElementsByClassName('sub-heading')[0].innerHTML = `${capitalize(x.getElementsByTagName('team')[0].getAttribute('name'))} - Individual Defensive Statistics`
  document.getElementById('HomeDefense').getElementsByClassName('sub-heading')[0].innerHTML = `${capitalize(x.getElementsByTagName('team')[1].getAttribute('name'))} - Individual Defensive Statistics`

  const defenseTableH = document.getElementById('DefenseTableH-body')
  const defenseTableV = document.getElementById('DefenseTableV-body')

  for (let i = 0; i < x.getElementsByTagName('team').length; i++) {
    const team = x.getElementsByTagName('team')[i];

    for (let j = 0; j < team.getElementsByTagName('player').length; j++) {
      const player = team.getElementsByTagName('player')[j];
      let rowEntry, td

      const defense = player?.getElementsByTagName('defense')[0]
      if (defense) {
        rowEntry = document.createElement('tr')

        createElementAttr('td', player.getAttribute('uni'), 'class', 'text-center', rowEntry)
        createElementHTML('th', player.getAttribute('name'), rowEntry)
        
        const tackua = defense?.getAttribute('tackua')
        const tacka = defense?.getAttribute('tacka')
        let total = 0.0

        if (tackua && Number(tackua) !== 0) {
          createElementAttr('td', tackua, 'class', 'text-center', rowEntry)
          total += parseFloat(tackua)
        } else {
          createElementAttr('td', '-', 'class', 'text-center', rowEntry)
        }
        if (tacka && Number(tacka) !== 0) {
          td = document.createElement('td')
          td.innerHTML = tacka
          td.classList.add('text-center', 'hide-on-x-small-down')
          rowEntry.appendChild(td)
          total += (parseFloat(tacka) * 0.5)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-x-small-down')
          rowEntry.appendChild(td)
        }

        createElementAttr('td', total.toFixed(1), 'class', 'text-center', rowEntry)        

        const tflua = defense?.getAttribute('tflua')
        const tfla = defense?.getAttribute('tfla')
        const tflyds = defense?.getAttribute('tflyds')
        let tflTot = '-'
        if (tflua || tfla) {
          if (tflua && tfla) {
            tflTot = Number(tflua) + (Number(tfla)*0.5)
          } else if (tflua) {
            tflTot = Number(tflua)
          } else if (tfla) {
            tflTot = Number(tfla) * 0.5
          }
          td = document.createElement('td')
          td.innerHTML = `${tflTot.toFixed(1)}/${tflyds}`
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
          td = document.createElement('td')
          td.innerHTML = `${tflTot.toFixed(1)}/${tflyds}`
          td.classList.add('text-center', 'hide-on-medium')
          rowEntry.appendChild(td)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-/-'
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-medium')
          rowEntry.appendChild(td)
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
          td = document.createElement('td')
          td.innerHTML = `${sackTot.toFixed(1)}/${sackyds}`
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
          td = document.createElement('td')
          td.innerHTML = sackTot.toFixed(1)
          td.classList.add('text-center', 'hide-on-medium')
          rowEntry.appendChild(td)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-/-'
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-medium')
          rowEntry.appendChild(td)
        }

        const ff = defense?.getAttribute('ff')
        if (ff) {
          td = document.createElement('td')
          td.innerHTML = ff
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
        }

        const fr = defense?.getAttribute('fr')
        const fryds = defense?.getAttribute('fryds')
        if (fr) {
          td = document.createElement('td')
          td.innerHTML = `${fr}-${fryds}`
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
          td = document.createElement('td')
          td.innerHTML = `${fr}-${fryds}`
          td.classList.add('text-center', 'hide-on-medium')
          rowEntry.appendChild(td)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-/-'
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
          td = document.createElement('td')
          td.innerHTML = '0-0'
          td.classList.add('text-center', 'hide-on-medium')
          rowEntry.appendChild(td)
        }

        const int = defense?.getAttribute('int')
        const intyds = defense?.getAttribute('intyds')
        if (int) {

          td = document.createElement('td')
          td.innerHTML = `${int}-${intyds}`
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
          td = document.createElement('td')
          td.innerHTML = int
          td.classList.add('text-center', 'hide-on-medium')
          rowEntry.appendChild(td)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-medium')
          rowEntry.appendChild(td)
        }

        const brup = defense?.getAttribute('brup')
        if (brup) {
          td = document.createElement('td')
          td.innerHTML = brup
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
        }

        const blkd = defense?.getAttribute('blkd')
        if (blkd) {
          td = document.createElement('td')
          td.innerHTML = blkd
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
        }

        const qbh = defense?.getAttribute('qbh')
        if (qbh) {
          td = document.createElement('td')
          td.innerHTML = qbh
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
        } else {
          td = document.createElement('td')
          td.innerHTML = '-'
          td.classList.add('text-center', 'hide-on-small-down')
          rowEntry.appendChild(td)
        }

        if (team.getAttribute('vh') === 'H') {
          defenseTableH.appendChild(rowEntry)
        } else {
          defenseTableV.appendChild(rowEntry)
        }
      }
    }

    sortTable('DefenseTableH', 3, 'high')
    sortTable('DefenseTableV', 3, 'high')
  }
}

function buildSpecialTeams(x){
  document.getElementById('V-allpurp').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - All Purpose`
  document.getElementById('H-allpurp').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - All Purpose`

  document.getElementById('V-punt').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - Punting`
  document.getElementById('H-punt').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - Punting`
  document.getElementById('V-allret').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - All Returns`
  document.getElementById('H-allret').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - All Returns`
  document.getElementById('V-fieldgoal').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - Field Goals`
  document.getElementById('H-fieldgoal').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - Field Goals`
  document.getElementById('V-kickoff').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - Kickoffs`
  document.getElementById('H-kickoff').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - Kickoffs`
  //document.getElementById('V-pat').innerHTML = `${x.getElementsByTagName('team')[0].getAttribute('id')} - PATs`
  //document.getElementById('H-pat').innerHTML = `${x.getElementsByTagName('team')[1].getAttribute('id')} - PATs`

  const allPurposeTableBodyHome = document.getElementById('allPurposeStatsHome-table-body')
  const allPurposeTableBodyVis = document.getElementById('allPurposeStatsVis-table-body')

  const puntingTableBodyHome = document.getElementById('puntingStatsHome-table-body')
  const allReturnsTableBodyHome = document.getElementById('allReturnsStatsHome-table-body')
  const fieldGoalTableBodyHome = document.getElementById('fieldGoalStatsHome-table-body')
  const kickoffTableBodyHome = document.getElementById('kickoffStatsHome-table-body')
  
  const puntingTableBodyVis = document.getElementById('puntingStatsVis-table-body')
  const allReturnsTableBodyVis = document.getElementById('allReturnsStatsVis-table-body')
  const fieldGoalTableBodyVis = document.getElementById('fieldGoalStatsVis-table-body')
  const kickoffTableBodyVis = document.getElementById('kickoffStatsVis-table-body')

  const fgas = x.getElementsByTagName('fgas')[0]
  for (let k = 0; k < fgas?.getElementsByTagName('fga').length; k++) {
    let fga = fgas.getElementsByTagName('fga')[k]
    let fgAtt = document.createElement('tr')
    
    createElementHTML('td', fga.getAttribute('kicker'), fgAtt)
    createElementAttr('td', fga.getAttribute('qtr'), 'class', 'text-center', fgAtt)
    createElementAttr('td', fga.getAttribute('clock'), 'class', 'text-center', fgAtt)
    createElementAttr('td', fga.getAttribute('distance'), 'class', 'text-center', fgAtt)
    createElementAttr('td', fga.getAttribute('result'), 'class', 'text-center', fgAtt)
  
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

      let rush = player?.getElementsByTagName('rush')[0]
      let rcv = player?.getElementsByTagName('rcv')[0]

     let punt = player?.getElementsByTagName('punt')[0]
      if (punt) {
        rowEntry = document.createElement('tr')
        createElementHTML('td', player.getAttribute('name'), rowEntry)
        createElementAttr('td', punt.getAttribute('no'), 'class', 'text-center', rowEntry)
        createElementAttr('td', punt.getAttribute('yds'), 'class', 'text-center', rowEntry)
        avg = parseFloat(punt.getAttribute('yds') / punt.getAttribute('no')).toFixed(1)
        createElementAttr('td', avg, 'class', 'text-center', rowEntry)
        createElementAttr('td', punt.getAttribute('long'), 'class', 'text-center', rowEntry)
        createElementAttr('td', punt.getAttribute('inside20'), 'class', 'text-center', rowEntry)
        createElementAttr('td', punt.getAttribute('tb'), 'class', 'text-center', rowEntry)
        createElementAttr('td', punt.getAttribute('plus50'), 'class', 'text-center', rowEntry)
      
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
          createElementAttr('td', pr.getAttribute('no'), 'class', 'text-center', rowEntry)
          createElementAttr('td', pr.getAttribute('yds'), 'class', 'text-center', rowEntry)
          createElementAttr('td', pr.getAttribute('long'), 'class', 'text-center', rowEntry)
        } else {
          rowEntry = document.createElement('tr')
          createElementHTML('td', player.getAttribute('name'), rowEntry)
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
        }
        if (kr){
          createElementAttr('td', kr.getAttribute('no'), 'class', 'text-center', rowEntry)
          createElementAttr('td', kr.getAttribute('yds'), 'class', 'text-center', rowEntry)
          createElementAttr('td', kr.getAttribute('long'), 'class', 'text-center', rowEntry)
        } else {
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
        }
        if (ir){
          createElementAttr('td', ir.getAttribute('no'), 'class', 'text-center', rowEntry)
          createElementAttr('td', ir.getAttribute('yds'), 'class', 'text-center', rowEntry)
          createElementAttr('td', ir.getAttribute('long'), 'class', 'text-center', rowEntry)
        } else {
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
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
          createElementAttr('td', rush.getAttribute('yds'), 'class', 'text-center', rowEntry)
          total += parseInt(rush.getAttribute('yds'))
        } else {
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
        }
        if (rcv){
          createElementAttr('td', rcv.getAttribute('yds'), 'class', 'text-center', rowEntry)
          total += parseInt(rcv.getAttribute('yds'))
        } else {
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
        }
        if (kr){
          createElementAttr('td', kr.getAttribute('yds'), 'class', 'text-center', rowEntry)
          total += parseInt(kr.getAttribute('yds'))
        } else {
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
        }
        if (pr){
          createElementAttr('td', pr.getAttribute('yds'), 'class', 'text-center', rowEntry)
          total += parseInt(pr.getAttribute('yds'))
        } else {
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
        }
        if (ir){
          createElementAttr('td', ir.getAttribute('yds'), 'class', 'text-center', rowEntry)
          total += parseInt(ir.getAttribute('yds'))
        } else {
          createElementAttr('td', 0, 'class', 'text-center', rowEntry)
        }
        createElementAttr('td', total, 'class', 'text-center', rowEntry)
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
        createElementAttr('td', ko.getAttribute('no'), 'class', 'text-center', rowEntry)
        createElementAttr('td', ko.getAttribute('yds'), 'class', 'text-center', rowEntry)
        createElementAttr('td', ko.getAttribute('tb'), 'class', 'text-center', rowEntry)
        createElementAttr('td', ko.getAttribute('ob'), 'class', 'text-center', rowEntry)
        avg = parseFloat(ko.getAttribute('yds') / ko.getAttribute('no')).toFixed(1)
        createElementAttr('td', avg, 'class', 'text-center', rowEntry)
      
        if (team.getAttribute('vh') === 'V') {
          kickoffTableBodyVis.appendChild(rowEntry)
        } else {
          kickoffTableBodyHome.appendChild(rowEntry)
        }
      }
    }
  }

  sortTable('allPurposeStatsHome-table', 6, 'high')
  insertTotalRow('allPurposeStatsHome-table', 'allPurp')
  sortTable('allPurposeStatsVis-table', 6, 'high')
  insertTotalRow('allPurposeStatsVis-table', 'allPurp')

  sortTable('puntingStatsHome-table', 2, 'high')
  insertTotalRow('puntingStatsHome-table', 'punt')
  sortTable('puntingStatsVis-table', 2, 'high')
  insertTotalRow('puntingStatsVis-table', 'punt')

  insertTotalRow('allReturnsStatsHome-table', 'allRet')
  insertTotalRow('allReturnsStatsVis-table', 'allRet')
  
  sortTable('kickoffStatsHome-table', 2, 'high')
  insertTotalRow('kickoffStatsHome-table', 'ko')
  sortTable('kickoffStatsVis-table', 2, 'high')
  insertTotalRow('kickoffStatsVis-table', 'ko')
}

function buildDrivesQuarter(x) {
  const driveTable = document.getElementById('driveQuarterTable-body')
  const drives = x.getElementsByTagName('drives')[0]
  let rowEntry, td

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
    
    td = document.createElement('td')
    td.classList.add('hide-on-large', 'emphasize')
    td.setAttribute('data-label', `${team} - ${yardsToSpot(x, start[3], fieldLength, team)}`)
    td.innerHTML = `${numToQRT(start[1])}/${start[2]}`
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center', 'hide-on-medium-down')
    td.setAttribute('data-label', 'Team')
    td.innerHTML = team
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center', 'hide-on-medium-down')
    td.setAttribute('data-label', 'Started: Qtr')
    td.innerHTML = numToQRT(start[1])
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center', 'hide-on-medium-down')
    td.setAttribute('data-label', 'Started: Spot')
    td.innerHTML = yardsToSpot(x, start[3], fieldLength, team)
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center', 'hide-on-medium-down')
    td.setAttribute('data-label', 'Started: Time')
    td.innerHTML = start[2]
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Started: How')
    td.innerHTML = typeToPlay(start[0])
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Ended: Spot')
    td.innerHTML = yardsToSpot(x, end[3], fieldLength, team)
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Ended: Time')
    td.innerHTML = end[2]
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Ended: How')
    td.innerHTML = typeToPlay(end[0])
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Plays - Yds.')
    td.innerHTML = `${plays}-${yards}`
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'TOP')
    td.innerHTML = top
    rowEntry.appendChild(td)

    driveTable.appendChild(rowEntry)  
  }
}

 function buildDrivesTeams(x) {
  const driveTableV = document.getElementById('driveTableAway-body')
  const driveTableH = document.getElementById('driveTableHome-body')
  const drives = x.getElementsByTagName('drives')[0]
  let rowEntry, td

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
    
    td = document.createElement('td')
    td.classList.add('hide-on-large', 'emphasize')
    td.setAttribute('data-label', `${team} - ${yardsToSpot(x, start[3], fieldLength, team)}`)
    td.innerHTML = `${numToQRT(start[1])}/${start[2]}`
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center', 'hide-on-medium-down')
    td.setAttribute('data-label', 'Team')
    td.innerHTML = team
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center', 'hide-on-medium-down')
    td.setAttribute('data-label', 'Started: Qtr')
    td.innerHTML = numToQRT(start[1])
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center', 'hide-on-medium-down')
    td.setAttribute('data-label', 'Started: Spot')
    td.innerHTML = yardsToSpot(x, start[3], fieldLength, team)
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center', 'hide-on-medium-down')
    td.setAttribute('data-label', 'Started: Time')
    td.innerHTML = start[2]
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Started: How')
    td.innerHTML = typeToPlay(start[0])
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Ended: Spot')
    td.innerHTML = yardsToSpot(x, end[3], fieldLength, team)
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Ended: Time')
    td.innerHTML = end[2]
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Ended: How')
    td.innerHTML = typeToPlay(end[0])
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'Plays - Yds.')
    td.innerHTML = `${plays}-${yards}`
    rowEntry.appendChild(td)

    td = document.createElement('td')
    td.classList.add('text-center')
    td.setAttribute('data-label', 'TOP')
    td.innerHTML = top
    rowEntry.appendChild(td)

    if (vh === 'H'){
      driveTableH.appendChild(rowEntry)
    } else {
      driveTableV.appendChild(rowEntry)
    }
  }
}
