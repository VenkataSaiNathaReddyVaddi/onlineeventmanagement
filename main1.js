function fetchUsers() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadUsers(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", "https://64802d96f061e6ec4d48bc61.mockapi.io/users", true);
    xhttp.send();
}

