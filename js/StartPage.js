function checkUser() {
    let source = document.getElementById("username");
    let name = localStorage['current_user'];
    if (name !== undefined) {
        source.value = name;
    }
    if (!localStorage['SCORE']) {
        localStorage['SCORE'] = '';
    }
    if (localStorage['SCORE'])
        createTable();
}

function sortedScores() {
    let table_info = JSON.parse(localStorage['SCORE']);
    let sortable = [];
    for (let obj in table_info) {
        let a = [];
        a.push(obj);
        a.push(table_info[obj]);
        sortable.push(a);
    }
    sortable.sort(function (first, second) {
        let cmp = first[1] - second[1];
        if (cmp)
            return cmp;
        return first[0].localeCompare(second[0]);
    });
    return sortable;
}

function createTable() {
    let SCORE = sortedScores();
    let table_ref = document.getElementById('tableBody');
    for (let score of SCORE) {
        let new_row = table_ref.insertRow(table_ref.rows.length);
        let new_cell = new_row.insertCell(0);
        new_cell.appendChild(document.createTextNode(score[0]));
        new_cell = new_row.insertCell(1);
        new_cell.appendChild(document.createTextNode(score[1]));
    }
}

function saveRedirect() {
    let username = document.getElementById("username").value;
    if (username) {
        localStorage['current_user'] = document.getElementById("username").value;
        localStorage['current_score'] = 0;
        window.location = 'main.html'
    } else {
        alert("Enter you username");
    }
}