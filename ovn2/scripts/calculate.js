const getTdChild = (node, n, extraSelector = "") => {
  return node.querySelector(`td:nth-child(${n}) ${extraSelector}`);
};

const createSumColumnElement = () => {
  const th = document.createElement("th");
  th.innerHTML = "Summa";
  return th;
};

const createSumRowElement = (sum, amount) => {
  const tr = document.createElement("tr");
  const sumElem = document.createElement("td");
  const amountElem = document.createElement("td");
  sumElem.innerHTML = sum;
  amountElem.innerHTML = amount;
  for (let i = 0; i < 4; ++i) tr.appendChild(document.createElement("td"));
  tr.appendChild(amountElem);
  tr.appendChild(sumElem);
  tr.id = "sumrow";
  return tr;
};

const createPrimaryButtonElement = (textContent) => {
  const btn = document.createElement("button");
  btn.textContent = textContent;
  btn.className = "btn btn-primary";
  return btn;
};

const createRowSumValueElement = (row) => {
  const td = document.createElement("td");
  const { sum } = getRowSumAndAmount(row);
  td.innerHTML = sum;
  return td;
};

const getRowSumAndAmount = (row) => {
  const price = getTdChild(row, 4).innerHTML;
  const amount = getTdChild(row, 5, "> input").value;
  return { amount: parseInt(amount, 10), sum: price * amount };
};

const updateRow = (row) => {
  const { sum } = getRowSumAndAmount(row);
  getTdChild(row, 6).innerHTML = sum;
};

const getTotalSumAndAmount = (rows) => {
  let totalSum = 0,
    totalAmount = 0;
  rows.forEach((row) => {
    const { sum, amount } = getRowSumAndAmount(row);
    totalSum += sum;
    totalAmount += amount;
  });
  return { totalSum, totalAmount };
};

const handleCalcPriceClick = (rows, sumRow) => {
  rows.forEach((row) => updateRow(row));
  const { totalSum, totalAmount } = getTotalSumAndAmount(rows);
  getTdChild(sumRow, 5).innerHTML = totalAmount;
  getTdChild(sumRow, 6).innerHTML = totalSum;
};

const checkForIllegalInputChars = (e) => {
  if (
    !(
      (e.keyCode > 95 && e.keyCode < 106) ||
      (e.keyCode > 47 && e.keyCode < 58) ||
      e.keyCode == 8
    )
  ) {
    return false;
  }
};

const addValidationToAmountFields = (row) => {
  const amountInputField = getTdChild(row, 5, "> input");
  amountInputField.type = "number";
  amountInputField.min = 0;
  amountInputField.onkeydown = checkForIllegalInputChars;
};

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector("#content");
  const table = content.querySelector("#pricetable");
  const tableHeadCols = table.querySelector("thead > tr");
  const tableBody = table.querySelector("tbody");
  const valueRows = tableBody.querySelectorAll("tr");
  const { totalSum, totalAmount } = getTotalSumAndAmount(valueRows);
  const calcPriceBtn = createPrimaryButtonElement("Beräkna pris");
  const sumRow = createSumRowElement(totalSum, totalAmount);

  calcPriceBtn.addEventListener("click", () => {
    handleCalcPriceClick(valueRows, sumRow);
  });

  valueRows.forEach((row) => {
    addValidationToAmountFields(row);
    row.appendChild(createRowSumValueElement(row));
  });

  tableHeadCols.appendChild(createSumColumnElement());
  tableBody.appendChild(sumRow);
  content.appendChild(calcPriceBtn);
});
