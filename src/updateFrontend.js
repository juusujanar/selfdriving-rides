// Creating once and cloning afterwards is cheaper in terms of performance
const aTable = document.createElement('table');
const aTr = document.createElement('tr');
const aTh = document.createElement('th');
const aTd = document.createElement('td');
const aH3 = document.createElement('h3');

const rideHeaders = {
  id: 'ID',
  xStart: 'Start x',
  yStart: 'Start y',
  xEnd: 'End x',
  yEnd: 'End y',
  earliestStart: 'Earliest start',
  latestFinish: 'Latest finish',
  status: 'Status',
};
const vehicleHeaders = {
  id: 'ID',
  name: 'Name',
  x: 'xPos',
  y: 'yPos',
  status: 'Status',
  destination: 'Destination',
  client: "Client"
};

function addAllColumnHeaders(obj, table) {
  const tr = aTr.cloneNode(false);
  Object.keys(obj).forEach((key) => {
    const th = aTh.cloneNode(false);
    th.classList.add('column');
    th.appendChild(document.createTextNode(obj[key]));
    tr.appendChild(th);
  });
  table.appendChild(tr);
}

function buildHtmlTable(arr, headers) {
  const table = aTable.cloneNode(false);
  addAllColumnHeaders(headers, table);
  for (let i = 0, maxi = arr.length; i < maxi; i++) {
    const tr = aTr.cloneNode(false);
    Object.keys(headers).forEach((key) => {
      const td = aTd.cloneNode(false);
      td.classList.add('column');
      td.appendChild(document.createTextNode(arr[i][key]));
      tr.appendChild(td);
    });
    table.appendChild(tr);
  }
  return table;
}

export function updatePendingRides(data) {
  // Clear out old tables
  const element = document.getElementById('rides');
  while (element && element.firstChild) {
    element.removeChild(element.firstChild);
  }

  // Add table header
  const h3 = aH3.cloneNode(false);
  h3.innerHTML = 'Pending rides';
  element.appendChild(h3);

  // Set the message or the table with data
  if (data.length === 0) {
    element.appendChild(document.createTextNode('No rides requested.'));
  } else {
    element.appendChild(buildHtmlTable(data, rideHeaders));
  }
}

export function updateVehicles(data) {
  // Clear out old tables
  const element = document.getElementById('vehicles');
  while (element && element.firstChild) {
    element.removeChild(element.firstChild);
  }

  // Add table header
  const h3 = aH3.cloneNode(false);
  h3.innerHTML = 'Vehicles';
  element.appendChild(h3);

  // Set the message or the table with data
  if (data.length === 0) {
    element.appendChild(document.createTextNode('No vehicles available.'));
  } else {
    element.appendChild(buildHtmlTable(data, vehicleHeaders));
  }
}
