let current = "";

function input(val) {
  if (val === "pi") {
    current += Math.PI;
  } else if (val === "sqrt(") {
    current += "Math.sqrt(";
  } else if (val === "sin(") {
    current += "Math.sin(";
  } else if (val === "cos(") {
    current += "Math.cos(";
  } else if (val === "tan(") {
    current += "Math.tan(";
  } else {
    current += val;
  }
  document.getElementById("display").value = current;
}

function clearDisplay() {
  current = "";
  document.getElementById("display").value = "";
}

function calculate() {
  try {
    let result = eval(current);
    document.getElementById("display").value = result;
    current = "" + result;
  } catch (e) {
    document.getElementById("display").value = "Error";
    current = "";
  }
}
