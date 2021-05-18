let yourBalance = document.getElementById('your-balance');
let incomeElm = document.getElementById('income');
let expenseElm = document.getElementById('expense');
let addBtn = document.getElementById('add');
let formTrans = document.getElementById('form-transaction');
let history = document.getElementById('history');

let balance = 0;
let income = 0;
let expense = 0;
let allTransaction = [];

function updateDom() {
  balance = 0;
  income = 0;
  expense = 0;
  allTransaction.map((x) => {
    balance += x.amount;
    income += x.type == 'income' ? x.amount : 0;
    expense += x.type == 'expense' ? x.amount : 0;
  });
  yourBalance.innerHTML = `$${balance.toFixed(2)}`;
  incomeElm.innerHTML = `<p style="text-transform: uppercase;">Ingreso</p>
    <p class="green" style="margin-top: 0px; font-size: 18px;">${income.toFixed(
      2
    )} CUP</p>`;
  expenseElm.innerHTML = `<p style="text-transform: uppercase;">Gasto</p>
    <p class="red" style="margin-top: 0px;font-size: 18px;">${expense.toFixed(
      2
    )} CUP</p>`;
  let historiHtml = `<h3> Histórico</h3>`;
  historiHtml += allTransaction
    .map((x) => {
      return ` <div class="history-el ${x.type == 'income' ? 'green' : 'red'}">
                    <div class="removeBtn">
                        x
                    </div>
                    <div style="display:flex;flex: 1 1 100%;justify-content:space-between;align-items:center"> 
                        <span style="flex: 1 1 100%">${x.text}</span>
                        <span style="flex: 1 1 140px;text-align: right;">${
                        x.amount
                        } CUP</span>
                    </div>
                 
                </div>`;
    })
    .join('');
  history.innerHTML = historiHtml;
  localStorage.setItem('balance', balance);
  localStorage.setItem('income', income);
  localStorage.setItem('expense', expense);
  localStorage.setItem('allTransaction', JSON.stringify(allTransaction || []));
}

readInitialy();
updateDom();

addBtn.addEventListener('click', () => {
  let data = {};
  let invalid = false;
  [...formTrans.querySelectorAll('small')].map((x) => x.remove());
  for (let el of formTrans.elements) {
    if (el.nodeName == 'INPUT') {
      if (el.id == 'text' && el.value.length < 2) {
        el.classList.add('invalid');
        let small = document.createElement('small');
        small.innerHTML = 'EL mensaje debe ser de al menos 2 caracteres';
        el.parentNode.appendChild(small);
        invalid = true;
      } else if (el.id == 'amount' && !+el.value) {
        el.classList.add('invalid');
        let small = document.createElement('small');
        small.innerHTML = 'El valor es requerido';
        el.parentNode.appendChild(small);
        invalid = true;
      } else if (!el.value) {
        el.classList.add('invalid');
        let small = document.createElement('small');
        small.innerHTML = 'El valor es requerido';
        el.parentNode.appendChild(small);
        invalid = true;
      } else {
        data[el.id] = el.value;
        if (el.classList.contains('invalid')) {
          el.classList.remove('invalid');
        }
      }
    }
  }
  if (!invalid) {
    [...formTrans.querySelectorAll('input')].map((x) => (x.value = ''));
    allTransaction.push({
      amount: +data.amount,
      text: data.text,
      type: +data.amount < 0 ? 'expense' : 'income',
    });
    console.log(
      '🚀 ~ file: script.js ~ line 71 ~ addBtn.addEventListener ~ allTransaction',
      allTransaction
    );
    updateDom();
  }
});

function readInitialy() {
  balance = +localStorage.getItem('balance');
  income = +localStorage.getItem('income');
  expense = +localStorage.getItem('expense');
  allTransaction = JSON.parse(localStorage.getItem('allTransaction') || `[]`);
}

history.addEventListener('click', (el) => {
  let element = el.target;
  if (element.classList.contains('removeBtn')) {
    let historiEl = element.parentElement;
    historiEl.classList.add('out');
    setTimeout(() => {
      let index = [...document.querySelectorAll('.history-el')].indexOf(
        historiEl
      );
      allTransaction.splice(index, 1);
      this.updateDom();
    }, 700);
  }
});
