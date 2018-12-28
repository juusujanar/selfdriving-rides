// Creating once and cloning afterwards is cheaper in terms of performance
const aTable = document.createElement('table');
const aTr = document.createElement('tr');
const aTh = document.createElement('th');
const aTd = document.createElement('td');

function addAllColumnHeaders(arr, table) {
  const tr = aTr.cloneNode(false);
  for (let i = 0, l = arr.length; i < l; i += 1) {
    const th = aTh.cloneNode(false);
    th.appendChild(document.createTextNode(arr[i]));
    tr.appendChild(th);
  }
  table.appendChild(tr);
}

function buildHtmlTable(arr, headers) {
  const table = aTable.cloneNode(false);
  addAllColumnHeaders(headers, table);
  for (let i = 0, maxi = arr.length; i < maxi; i += 1) {
    const tr = aTr.cloneNode(false);
    for (let j = 0, maxj = headers.length; j < maxj; j += 1) {
      const td = aTd.cloneNode(false);
      td.appendChild(document.createTextNode(arr[i][headers[j]] || ''));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

export function updatePendingRides(data) {
  const element = document.getElementById('rides');
  while (element && element.firstChild) {
    element.removeChild(element.firstChild);
  }
  if (data.length === 0) {
    element.appendChild(document.createTextNode('No rides requested.'));
  } else {
    element.appendChild(buildHtmlTable(data, ['x', 'y', 'earliestStart', 'latestFinish']));
  }
}

export function updateVehicles(data) {
  const element = document.getElementById('vehicles');
  while (element && element.firstChild) {
    element.removeChild(element.firstChild);
  }
  if (data.length === 0) {
    element.appendChild(document.createTextNode('No vehicles available.'));
  } else {
    element.appendChild(buildHtmlTable(data, ['x', 'y', 'Earliest Start', 'Latest Finish']));
  }
}
