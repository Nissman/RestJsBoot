const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('http://localhost:8089/api/getUsers'),
    getRoles: async () => await fetch('http://localhost:8089/api/getRoles'),
    findOneUser: async (id) => await fetch(`http://localhost:8089/api/getUser/${id}`),
    findCurrentUser: async () => await fetch(`http://localhost:8089/api/getUser`),
    addNewUser: async (user) => await fetch('http://localhost:8089/api/create', {
        method: "POST",
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`http://localhost:8089/api/update/${id}`,
        {method: 'PUT', headers: userFetch.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`http://localhost:8089/api/delete/${id}`,
        {method: 'DELETE', headers: userFetch.head})
}

async function infoUser() {
    let temp = '';
    const name = document.querySelector('#js-info');
    while (name.firstChild) {
        name.removeChild(name.firstChild);
    }
    let id;
    await userFetch.findCurrentUser()
        .then(res => res.json())
        .then(user => {
            id = user.id;
            temp += `<span id="js-currentUserName" class="align-middle h3 font-weight-bold ">${user.username}</span>
            <span class="align-middle h3 font-weight-normal">with roles:</span>
            <span id="js-currentUserRole" class="align-middle h3 font-weight-normal" >${user.roles.map(e => " " + e.name.substring(5))}
            </span>`;
            let roles = user.roles.map(e => e.name.substring(5));
            if (roles.includes("ADMIN")) {
                initAdminDefaultView();
            } else {
                initUserDefaultView();
            }
        });
    name.innerHTML = temp;
}

function initAdminDefaultView() {
    addAdminTabs();
    document.getElementById("js-user").setAttribute('onclick', 'changeUserView()');
    let nav = ' <a id="js-admin" class="nav-link active h5"  href="javascript:void(0);" >Admin</a>';
    document.getElementById("js-adme").innerHTML = nav;
    document.getElementById("js-h1Header").innerText = "Admin panel";
    document.getElementById("js-h5Header").innerText = "All users";
    link = document.getElementById("js-cardBody")
    while (link.firstChild) {
        link.removeChild(link.firstChild);
    }
    updateUsersTable();
}

function initUserDefaultView() {
    document.getElementById("js-user").classList.add('active');
    document.getElementById("js-h1Header").innerText = "User Information-page";
    document.getElementById("js-h5Header").innerText = "About user";
    userTable();
}

async function userTable() {
    let link = document.getElementById("js-cardBody")
    while (link.firstChild) {
        link.removeChild(link.firstChild);
    }
    let temp2 = "";
    let table = " <p class='card-text'>" +
        "<table class='table table-striped'>" +
        "                <thead>" +
        "                <tr>" +
        "                    <tr>" +
        "                        <th>ID</th>" +
        "                        <th>First Name</th>" +
        "                        <th>Last Name</th>" +
        "                        <th>Age</th>" +
        "                        <th>Email</th>" +
        "                        <th>Role</th>" +
        "                    </tr>" +
        "                </tr>" +
        "                </thead>" +
        "                <tbody id='data'>" +
        "                </tr>" +
        "            </tbody>" +
        "        </table>" +
        "    </p>";
    link.innerHTML = table;
    await userFetch.findCurrentUser()
        .then(res => {
            if (res.ok) {
                res.json().then(
                    user => {
                        table = "";
                        table += "<tr>" +
                            "<td>" + user.id + "</td>" +
                            "<td>" + user.firstName + "</td>"
                            + "<td>" + user.lastName + "</td>"
                            + "<td>" + user.age + "</td>"
                            + "<td>" + user.username + "</td>";
                        for (let i = 0; i < user.roles.length; i++) {
                            temp2 += user.roles[i].name.substring(5) + " ";
                        }
                        table += "<td>" + temp2 + "</td></tr>";
                        document.getElementById("data").innerHTML = table;
                    })
            } else {
                res.text().then(r => {
                    console.log("???????????? " + r);
                    alert(r);
                })
            }
        });

}

async function checkChange() {
    await userFetch.findCurrentUser()
        .then(res => res.json())
        .then(user => {
            let roles = user.roles.map(e => e.name.substring(5));
            if (roles.includes("ADMIN")) {
            } else {
                let temp = "";
                const name = document.querySelector('#js-info');
                while (name.firstChild) {
                    name.removeChild(name.firstChild);
                }
                temp = document.getElementById("js-adme");
                while (temp.firstChild) {
                    temp.removeChild(temp.firstChild);
                }
                deleteAdminTabs();
                temp = document.getElementById("js-cardBody");
                while (temp.firstChild) {
                    temp.removeChild(temp.firstChild);
                }
                infoUser();
            }
        });
}

function changeUserView() {
    deleteAdminTabs()
    document.getElementById("js-h1Header").innerText = "User Information-page";
    document.getElementById("js-h5Header").innerText = "About user";
    document.getElementById("js-user").classList.add('active');
    document.getElementById("js-user").removeAttribute('onclick');
    document.getElementById("js-admin").setAttribute('onclick', 'changeAdminView()')
    document.getElementById("js-admin").classList.remove('active');
    userTable();
}

function changeAdminView() {
    addAdminTabs();
    document.getElementById("js-user").setAttribute('onclick', 'changeUserView()');
    document.getElementById("js-user").classList.remove('active');
    document.getElementById("js-admin").classList.add('active');
    document.getElementById("js-admin").removeAttribute('onclick');
    document.getElementById("js-h1Header").innerText = "Admin panel";
    document.getElementById("js-h5Header").innerText = "All users";
    updateUsersTable();
}

async function startEditModal(element) {
    let response = await userFetch.findOneUser(element.getAttribute("data-userid"));
    if (response.ok) {
        response.json().then(user => {
            document.getElementById("modal-form-js").innerHTML = ' <div class="modal-body col-md text-center">\n' +
                '          <div class="form-group">\n' +
                '            <label for="id"><b>ID</b></label>\n' +
                '            <input name="id" readonly type="text"\n' +
                '                   class="form-control w-50 mx-auto" id="id" value="' + user.id + '"/>\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="firstName"><b>First Name</b></label>\n' +
                '            <input name="firstName" type="text"\n' +
                '                   class="form-control w-50 mx-auto" id="firstName"\n' +
                '                   value="' + user.firstName + '" required/>\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="lastName"><b>Last Name</b></label>\n' +
                '            <input name="lastName" type="text"\n' +
                '                   class="form-control w-50 mx-auto" id="lastName"\n' +
                '                   value="' + user.lastName + '" required/>\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="age"><b>Age</b></label>\n' +
                '            <input name="age" type="number"\n' +
                '                   class="form-control w-50 mx-auto" id="age"\n' +
                '                   value="' + user.age + '" required/>\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="username"><b>Email</b></label>\n' +
                '            <input name="username" type="email"\n' +
                '                   class="form-control w-50 mx-auto" id="username"\n' +
                '                   value="' + user.username + '" required/>\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="password"><b>Password</b></label>\n' +
                '            <input name="password" type="password"\n' +
                '                   class="form-control w-50 mx-auto" id="password"\n' +
                '                   value="' + user.password + '" required/>\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="roles"><b>Role</b></label>\n' +
                '            <select multiple\n' +
                '                    class="form-control form-control-sm w-50 mx-auto"\n' +
                '                    id="roles"\n' +
                '                    name="roles" size="2" required>\n' +
                '            </select>\n' +
                '            <br><br>\n' +
                '          </div>\n' +
                '        </div>\n' +
                '<div class="modal-footer">\n' +
                '          <button type="button" class="btn btn-secondary"\n' +
                '                  data-bs-dismiss="modal" >Close\n' +
                '          </button>\n' +
                '          <button id="js-bts" type="submit" onclick="update()"  class="btn btn-primary">\n' +
                '            \n' +
                '          Edit</button>\n' +
                '        </div>';
            let select = "";
            userFetch.getRoles().then(res => {
                    if (res.ok) {
                        res.json().then(
                            data => {
                                let temp1;
                                let temp2;
                                temp2 = user.roles;
                                temp1 = data._embedded.roleList;
                                let id = temp2.map(e => e.id);
                                for (let i = 0; i < temp1.length; i++) {
                                    if (id.includes(temp1[i].id)) {
                                        select += "<option selected='selected' id='" + temp1[i].id + "'>" + temp1[i].name.substring(5) + "</option> ";
                                    } else {
                                        select += "<option id='" + temp1[i].id + "'>" + temp1[i].name.substring(5) + "</option> ";
                                    }
                                }
                                document.getElementById("roles").innerHTML = select;
                                let myModal2 = new bootstrap.Modal(document.getElementById('editModal'), {
                                    keyboard: true
                                })
                                myModal2.show();
                            }
                        )
                    } else {
                        res.text().then(re => console.log("???????????? ?????????????????? ?????????? " + re));
                    }
                }
            );
        });
    } else {
        response.text().then(r => alert(r));
    }

}

async function startDeleteModal(element) {
    let response = await userFetch.findOneUser(element.getAttribute("data-userid"));
    if (response.ok) {
        response.json().then(user => {
            document.getElementById("modal-delete-form-js").innerHTML = '<div class="modal-body col-md text-center">\n' +
                '          <div class="form-group">\n' +
                '            <label for="id1"><b>ID</b></label>\n' +
                '            <input name="id" readonly type="text"\n' +
                '                   class="form-control w-50 mx-auto" id="id1"value="' + user.id + '"/>\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="firstName1"><b>First Name</b></label>\n' +
                '            <input name="firstName" type="text" readonly\n' +
                '                   class="form-control w-50 mx-auto" id="firstName1" value="' + user.firstName + '"\n' +
                '            />\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="lastName1"><b>Last Name</b></label>\n' +
                '            <input name="lastName" type="text" readonly\n' +
                '                   class="form-control w-50 mx-auto" id="lastName1" value="' + user.lastName + '"\n' +
                '            />\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="age1"><b>Age</b></label>\n' +
                '            <input name="age" type="number" readonly\n' +
                '                   class="form-control w-50 mx-auto" id="age1" value="' + user.age + '"\n' +
                '            />\n' +
                '          </div>\n' +
                '          <div class="form-group">\n' +
                '            <label for="username1"><b>Email</b></label>\n' +
                '            <input name="username" type="text" readonly \n' +
                '                   class="form-control w-50 mx-auto" id="username1" value="' + user.username + '"\n' +
                '                   />\n' +
                '          </div>\n' +
                '          <div class="form-group" readonly="readonly">\n' +
                '            <label for="roles1"><b>Role</b></label>\n' +
                '            <select disabled multiple\n' +
                '                    class="form-control form-control-sm w-50 mx-auto"\n' +
                '                    id="roles1"\n' +
                '                    size="2" name="roles">\n' +

                '            </select>\n' +
                '            <br><br>\n' +
                '          </div>\n' +
                '        </div>\n' +
                '        <div class="modal-footer">\n' +
                '          <button type="button" class="btn btn-secondary"\n' +
                '                  data-bs-dismiss="modal">Close\n' +
                '          </button>\n' +
                '          <button type="submit" onclick="deleteUser()" class="btn btn-danger">\n' +
                '            Delete\n' +
                '          </button>\n' +
                '        </div>';
            let select = "";
            userFetch.getRoles().then(res => {
                    if (res.ok) {
                        res.json().then(
                            data => {
                                let temp1;
                                let temp2;
                                temp2 = user.roles;
                                temp1 = data._embedded.roleList;
                                let id = temp2.map(e => e.id);
                                for (let i = 0; i < temp1.length; i++) {
                                    if (id.includes(temp1[i].id)) {
                                        select += "<option selected='selected' id='D" + temp1[i].id + "'>" + temp1[i].name.substring(5) + "</option> ";
                                    } else {
                                        select += "<option id='D" + temp1[i].id + "'>" + temp1[i].name.substring(5) + "</option> ";
                                    }
                                }
                                document.getElementById("roles1").innerHTML = select;
                                let myModal = new bootstrap.Modal(document.getElementById('deleteModal'), {
                                    keyboard: true
                                })
                                myModal.show();
                            }
                        )
                    } else {
                        res.text().then(re => console.log("???????????? ?????????????????? ?????????? " + re));
                    }
                }
            );
        });
    } else {
        response.text().then(r => alert(r));
    }
}

function updateUsersTable() {
    let link = document.getElementById("js-cardBody")
    while (link.firstChild) {
        link.removeChild(link.firstChild);
    }
    link.innerHTML = "<p class='card-text'>" +
        " <table class='table table-striped' id='tableAllUser'>" +
        "                <thead>" +
        "                <tr>" +
        "                    <tr id='trHead'>" +
        "                        <th>ID</th>" +
        "                        <th>First Name</th>" +
        "                        <th>Last Name</th>" +
        "                        <th>Age</th>" +
        "                        <th>Email</th>" +
        "                        <th>Role</th>" +
        "                        <th id='thEdit'>Edit</th>" +
        "                        <th id='thDelete'>Delete</th>" +
        "                    </tr>" +
        "                </tr>" +
        "                </thead>" +
        "                <tbody id='data'>" +
        "                </tr>" +
        "            </tbody>" +
        "        </table>" +
        "    </p>";

    userFetch.findAllUsers().then(res => {
            res.json().then(
                data => {
                    let a = data._embedded.userList.length;
                    if (a > 0) {
                        let temp = "";
                        data._embedded.userList.forEach((u) => {
                            temp += "<tr>" +
                                "<td>" + u.id + "</td>" +
                                "<td>" + u.firstName + "</td>" +
                                "<td>" + u.lastName + "</td>" +
                                "<td>" + u.age + "</td>" +
                                "<td>" + u.username + "</td>";
                            let temp2 = "";
                            for (r in u.roles) {
                                temp2 += u.roles[r].name.substring(5) + " ";
                            }
                            temp += "<td>" + temp2 + "</td>" +
                                "<td>" +
                                " <button type='button' data-userid='" + u.id + "' data-action='edit' class='btn btn-info js-open-modal'" +
                                " onclick='startEditModal(this)' >Edit</button>" +
                                " </td>" +
                                " <td>" +
                                "  <button  type='button' data-userid='" + u.id + "' data-action='delete' class='btn btn-danger js-open-modal'" +
                                "  onclick='startDeleteModal(this)'   >Delete</button>" +
                                "  </td>" +
                                "  </tr>";
                            document.getElementById("data").innerHTML = temp;
                        })
                    }
                }
            )
        }
    )
    checkChange();
}


async function add() {
    document.getElementById('form').onsubmit = function (event) {
        event.preventDefault();
    }
    let sel = document.getElementById('roles').options;
    let opt;
    let arrRoles = [];
    let j = 0;
    for (let i = 0; i < sel.length; i++) {
        opt = sel[i];
        if (opt.selected) {
            arrRoles[j] = {
                id: (opt.index + 1).toString()
            }
            j += 1;
        }
    }
    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        age: document.getElementById('age').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        roles: JSON.parse(JSON.stringify(arrRoles))
    };
    let response = await userFetch.addNewUser(data);
    if (response.ok) {
        await changeAdminView();
    } else {
        response.text().then(r => alert(r));
    }
}

async function deleteUser() {
    document.getElementById('modal-delete-form-js').onsubmit = function (event) {
        event.preventDefault();
        document.getElementById("js-closeDelete").click();
    }
    let a = document.getElementById('id1').value;
    let response = await userFetch.deleteUser(parseInt(a));
    if (response.ok) {
        console.log(response.status);
        updateUsersTable();
    } else {
        response.text().then(r => alert(r));
    }
    cleanDeleteModal();
}

async function update() {
    document.getElementById('modal-form-js').onsubmit = function (event) {
        event.preventDefault();
        document.getElementById("js-close").click();
    }
    let sel = document.getElementById('roles').options;
    let opt;
    let arrRoles = [];
    let j = 0;
    for (let i = 0; i < sel.length; i++) {
        opt = sel[i];
        if (opt.selected) {
            arrRoles[j] = {
                id: (opt.index + 1).toString()
            }
            j += 1;
        }
    }
    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        age: document.getElementById('age').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        roles: JSON.parse(JSON.stringify(arrRoles))
    };
    let a = document.getElementById('id').value;
    let response = await userFetch.updateUser(data, parseInt(a));
    if (response.ok) {
        console.log(response.status);
        updateUsersTable();
    } else {
        response.text().then(r => alert(r));
    }
    cleanEditModal();
}

function cleanEditModal() {
    const myModel = document.getElementById('modal-form-js');
    while (myModel.firstChild) {
        myModel.removeChild(myModel.firstChild);
    }
}

function cleanDeleteModal() {
    const myModel = document.getElementById('modal-delete-form-js');
    while (myModel.firstChild) {
        myModel.removeChild(myModel.firstChild);
    }
}

function newUserForm() {
    document.getElementById("js-h5Header").innerText = "Add new user";

    let container = document.getElementById("js-cardBody");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    let form = "<form id='form' method='POST' > <div class='col-md text-center h6'> <div class='form-group'> <label htmlFor='firstName'>" +
        "<b>First Name</b></label> " +
        "<input name='firstName' type='text' class='form-control w-25 mx-auto' id='firstName' required/>" +
        " </div> " +
        "<div class='form-group'> <label htmlFor='lastName'><b>Last Name</b></label> " +
        "<input name='lastName' type='text' class='form-control w-25 mx-auto' id='lastName' required/>" +
        " </div> <div class='form-group'> <label htmlFor='age'><b>Age</b></label> " +
        "<input name='age' type='number' class='form-control w-25 mx-auto' id='age' required/> </div>" +
        " <div class='form-group'> <label htmlFor='username'><b>Email</b></label> " +
        "<input type='email' class='form-control w-25 mx-auto' id='username' required/> " +
        "</div> <div class='form-group'> <label htmlFor='password'><b>Password</b></label> " +
        "<input name='password' type='password' class='form-control w-25 mx-auto' id='password' required/> " +
        "</div> <div class='form-group'> <label htmlFor='roles'><b>Role</b></label> " +
        "<select multiple class='form-control form-control-sm w-25 mx-auto' id='roles' name='roles' size='2' required> " +
        // "<option >1</option> <option >2</option>" +
        "</select> " +
        "<div class='form-group'> " +
        "<button type='submit' onclick= 'add()' class='btn btn-success btn-lg mt-4' value='Add new user'>Add new user </button> </div> </div> </div> </form>";
    container.innerHTML = form;
    container = document.getElementById("js-usrTable");
    container.classList.remove("active");
    container.setAttribute('href', 'javascript:void(0);');
    container.setAttribute('onclick', 'changeAdminView()');
    container = document.getElementById("js-newUser");
    container.classList.add("active");
    container.removeAttribute('onclick');
    container.removeAttribute('href');

    setSelect();
}

function setSelect() {
    let select = "";
    userFetch.getRoles().then(res => {
            res.json().then(
                data => {
                    let a = data._embedded.roleList.length;
                    if (a > 0) {
                        data._embedded.roleList.forEach((u) => {
                            select += "<option id='" + u.id + "'>" + u.name.substring(5) + "</option> ";
                        })
                        document.getElementById("roles").innerHTML = select;
                    }
                }
            )
        }
    );
}

function addAdminTabs() {
    let container = document.getElementById("js-adminTabs");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    let a = document.createElement("a");
    a.setAttribute('class', 'nav-link active h5');
    a.setAttribute('id', 'js-usrTable')
    a.setAttribute('onclick', 'updateUsersTable()');
    a.setAttribute('href', 'javascript:void(0);');
    a.innerText = "User Table";

    container.append(a);
    a = document.createElement("a");
    a.setAttribute('class', 'nav-link h5');
    a.setAttribute('href', 'javascript:void(0);');
    a.setAttribute('onclick', 'newUserForm()');
    a.setAttribute('id', 'js-newUser')
    a.innerText = "New User";
    container.append(a);
}

function deleteAdminTabs() {
    let container = document.getElementById("js-adminTabs");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}



