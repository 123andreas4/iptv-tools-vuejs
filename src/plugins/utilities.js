/* Print element */
export function printElement() {
  let f = document.createElement("IFRAME");
  f.domain = document.domain;
  f.style.display = "none";
  document.body.appendChild(f);
  f.contentDocument.write(this.innerHTML);
  let s = document.head.getElementsByTagName("style");
  for (var i = 0; i < s.length; i++) {
    f.contentDocument.head.appendChild(s[i].cloneNode(true));
  }
  f.focus();
  f.contentWindow.print();
  f.parentNode.removeChild(f);
  window.focus();
}

/* Debounce */
export function debounce(fn, delay) {
  var timeoutID = null;
  return function () {
    clearTimeout(timeoutID);
    var args = arguments;
    var that = this;
    timeoutID = setTimeout(function () {
      fn.apply(that, args);
    }, delay);
  };
}

/* Sort Arrays */
export function sortArrayAlpha(arr) {
  if (arr == undefined || arr == null || arr == false || !Array.isArray(arr)) {
    return;
  }
  arr.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}

/* Test if string is JSON */
export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/* String of Object Type */
export function typeString(obj) {
  return Object.prototype.toString
    .apply(obj)
    .replace(/\[object (.+)\]/i, "$1")
    .toLowerCase();
}

/* Convert JSON Array to CSV file */
function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";
  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";
      line += array[i][index];
    }
    str += line + "\r\n";
  }
  return str;
}

/* Export JSON to CSV file (Download) */
export function exportToCSV(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }
  var jsonObject = JSON.stringify(items);
  var csv = convertToCSV(jsonObject);
  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

/* Convert CSV to Matrix Array */
function CSVToMatrix(csv, delimiter) {
  let matrix = [];
  csv.split("\n").map((l) => {
    l.trim() == ""
      ? 0
      : matrix.push(
          l
            .trim()
            .split(delimiter)
            .map((v) => v.trim())
        );
  });
  return matrix;
}

function MatrixToJSON(matrix, from, to) {
  let jsonResult = [];
  from = from || 0;
  matrix.map((a, i) => {
    let obj = Object.assign(
      {},
      ...matrix[0].map((h, index) => ({
        [h]: matrix[i][index],
      }))
    );
    jsonResult.push(obj);
  });
  return to ? jsonResult.splice(from, to) : jsonResult.splice(from);
}

/* Convert CSV to JSON */
export function CSVToJSON(csv) {
  return MatrixToJSON(CSVToMatrix(csv, ","));
}

/* Deep copy object */
export function deepCopy(o, a) {
  var t, x, key;
  t = Array.isArray(o) ? (a !== undefined ? a : []) : a !== undefined ? a : {};
  for (key in o) {
    x = o[key];
    t[key] =
      typeof x === "object" && x !== null && !(x instanceof Date)
        ? deepCopy(x)
        : x;
  }
  return t;
}

/* Deep merge object */
export function deepMerge(...sources) {
  let acc = {};
  for (const source of sources) {
    if (source instanceof Array) {
      if (!(acc instanceof Array)) {
        acc = [];
      }
      acc = [...acc, ...source];
    } else if (source instanceof Object) {
      for (let [key, value] of Object.entries(source)) {
        if (value instanceof Object && key in acc) {
          value = deepMerge(acc[key], value);
        }
        acc = { ...acc, [key]: value };
      }
    }
  }
  return acc;
}

export function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

/* Random ID generator */
export function randomId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

/* Color shades */
export function colorShade(col, amt) {
  col = col.replace(/^#/, "");
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, 16) + amt,
    parseInt(g, 16) + amt,
    parseInt(b, 16) + amt,
  ];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? "0" : "") + r;
  const gg = (g.length < 2 ? "0" : "") + g;
  const bb = (b.length < 2 ? "0" : "") + b;

  return `#${rr}${gg}${bb}`;
}

/* Round to * decimal places */
export function round(num, dec) {
  if (dec === undefined) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  } else {
    const [sv, ev] = num.toString().split("e");
    return Number(
      Number(Math.round(parseFloat(sv + "e" + dec)) + "e-" + dec) +
        "e" +
        (ev || 0)
    );
  }
}

/* Round up to the nearest 10-100-1000 ... */
export function roundUp(v) {
  return (v >= 0 || -1) * Math.pow(10, 1 + Math.floor(Math.log10(Math.abs(v))));
}
