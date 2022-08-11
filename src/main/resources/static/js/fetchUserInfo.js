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
    deleteUser: async (id) => await fetch(`http://localhost:8089/api/update/${id}`,
        {method: 'DELETE', headers: userFetch.head})
}



async function infoUser() {
    let temp = '';
    const name = document.querySelector('#js-info');
    let mainRole = "";
    let secondRole = "";
    let id;
    await userFetch.findCurrentUser()
        .then(res => res.json())
        .then(user => {
            id = user.id;
            temp += `<span id="js-currentUserName" class="align-middle h3 font-weight-bold ">${user.username}</span>
            <span class="align-middle h3 font-weight-normal">with roles:</span>
            <span id="js-currentUserRole" class="align-middle h3 font-weight-normal" >${user.roles.map(e => " " + e.name.substring(5))}
            </span>`;
            for (let i = 0; i < user.roles.length; i++) {
                if (user.roles[i].name === "ROLE_ADMIN") {
                    mainRole = user.roles[i].name.substring(5);
                }
                if (user.roles[i].name === "ROLE_USER") {
                    secondRole = user.roles[i].name.substring(5);
                }
            }
        });
    name.innerHTML = temp;
    initView(mainRole, secondRole, id, 0);
}

function initView(role1, role2, id, c) {
    let link;
    if (role1 === "ADMIN" && c!==1) {
        if (c ===2){
            document.getElementById("js-usrTable").classList.remove('active');
            document.getElementById("js-usrTable").removeAttribute('onclick');
            document.getElementById("js-newUser").classList.remove('active');
            document.getElementById("js-newUser").setAttribute('href', 'javascript:void(0)');
        }
        if (c === 3){
            addAdminTabs()
            document.getElementById("js-user").classList.remove('active');
            document.getElementById("js-admin").classList.add('active');
            document.getElementById("js-admin").removeAttribute('onclick')


        }
        document.getElementById("js-user").setAttribute('onclick', 'changeViews(2)');
        document.getElementById("js-newUser").setAttribute('onclick', 'newUserForm()');







        document.getElementById("js-h1Header").innerText = "Admin panel";
        document.getElementById("js-h5Header").innerText = "All users";
        link = document.getElementById("js-cardBody")
        while (link.firstChild) {
            link.removeChild(link.firstChild);
        }
        drawTable(role1, link, id);
    } else if (role2 === "USER" ||  c === 1) {

        link = document.getElementById("js-user");
        link.classList.add('active')
        link.removeAttribute('onclick');
        if ( c === 1) {

            link = document.getElementById("js-admin");
            link.classList.remove('active');
            link.setAttribute('onclick', 'changeViews(1)');
            link = document.getElementById("js-adminTabs");
            while (link.firstChild) {
                link.removeChild(link.firstChild);
            }

        }
        document.getElementById("js-h1Header").innerText = "User Information-page";
        document.getElementById("js-h5Header").innerText = "About user";
        link = document.getElementById("js-cardBody")
        while (link.firstChild) {
            link.removeChild(link.firstChild);
        }
        if (c===1) {
           drawTable("USER", link, id);
        } else {
        drawTable(role2, link, id);
        }
    }
}

function changeViews(n) {
    let mainRole = "";
    let secondRole = "";
    let id;
    userFetch.findCurrentUser()
        .then(res => res.json())
        .then(user => {
            id = user.id;
            for (let i = 0; i < user.roles.length; i++) {
                if (user.roles[i].name === "ROLE_ADMIN") {
                    mainRole = user.roles[i].name.substring(5);
                }
                if (user.roles[i].name === "ROLE_USER") {
                    secondRole = user.roles[i].name.substring(5);
                }
            }
            switch (n) {
                case 1:
                    initView(mainRole, secondRole, id, 3);

                    break;
                case 2:

                    initView(mainRole, secondRole, id, 1);
                    break;
                case 3:

                    initView(mainRole, secondRole, id, 2);
                    break;
                default:
                    break;
            }
        });

}


async function drawTable(role, el, id) {
    if (role === "ADMIN") {
        el.innerHTML = "<p class='card-text'>" +
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
                            let i = "btnE1";
                            let ii = "btnD1";
                            let k = 1;
                            data._embedded.userList.forEach((u) => {

                                temp += "<tr>";
                                temp += "<td>" + u.id + "</td>";
                                temp += "<td>" + u.firstName + "</td>";
                                temp += "<td>" + u.lastName + "</td>";
                                temp += "<td>" + u.age + "</td>";
                                temp += "<td>" + u.username + "</td>";
                                let temp2 = "";
                                for (r in u.roles) {
                                    temp2 += u.roles[r].name.substring(5) + " ";
                                }
                                temp += "<td>" + temp2 + "</td>";
//data-bs-target='#editModal data-bs-target='#deleteModal data-bs-toggle='modal'
                                temp += "<td>" +
                                    "                        <button type='button' data-userid='" + u.id + "' data-action='edit' class='btn btn-info js-open-modal'" +
                                    "                          onclick='startModal(this)' >Edit</button>" +
                                    "                    </td>" +
                                    "                    <td>" +
                                    "                        <button  type='button' data-userid='" + u.id + "' data-action='delete' class='btn btn-danger js-open-modal'" +
                                    "                        onclick='startModal(this)'   >Delete</button>" +
                                    "                    </td>" +
                                    "                </tr>";
                                document.getElementById("data").innerHTML = temp;
                                k += 1;
                                i = "btnE" + k.toString();
                                ii = "btnD" + k.toString();

                            })
                        }
                    }
                )
            }
        )

    } else if (role === "USER") {
        let temp2 = "";
        let table = " <p  class='card-text'>" +
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
        el.innerHTML = table;
        await userFetch.findOneUser(id)
            .then(res => {
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
            });
    }
}


async function startModal(element) {

        let response = await userFetch.findOneUser(element.getAttribute("data-userid"));
        if (response.ok) {
            response.json().then(user=> {
                let moedel =
                '        <div class="modal-body col-md text-center">\n' +
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
                // '              <option>\n' +
                // '\n' +
                // '              </option>\n' +
                '            </select>\n' +
                '            <br><br>\n' +
                '          </div>\n' +
                '        </div>\n'+
                '<div class="modal-footer">\n' +
                    '          <button type="button" class="btn btn-secondary"\n' +
                    '                  data-bs-dismiss="modal" >Close\n' +
                    '          </button>\n' +
                    '          <button id="js-bts" type="submit"  class="">в\n' +
                    '            \n' +
                    '          </button>\n' +
                    '        </div>';
                document.getElementById("modal-form-js").innerHTML = moedel;
                let select = "";
                userFetch.getRoles().then(res => {
                    if(res.ok){
                        res.json().then(
                            data => {
                                    let temp1;
                                    let temp2;

                                        temp2=user.roles;
                                        temp1=data._embedded.roleList;
                                    let id = temp2.map(e=> e.id);
                                    for (let i = 0; i < temp1.length ; i++) {
                                        if (id.includes(temp1[i].id)){
                                            select += "<option selected='selected' id='"+ temp1[i].id +"'>" + temp1[i].name.substring(5) + "</option> ";
                                        } else {
                                            select += "<option id='"+ temp1[i].id +"'>" + temp1[i].name.substring(5) + "</option> ";
                                        }
                                    }
                                    document.getElementById("roles").innerHTML = select;

                            }
                        )
                    } else {
                    res.text().then(re=>console.log("Ошибка получения ролей " + re));
                    }
                    }
                );

           } );
            if ((element.getAttribute("data-action") === "edit")) {
                document.getElementById("editModalLabel").innerText = "Edit user";
                document.getElementById("js-bts").textContent = "Edit";
                document.getElementById("js-bts").setAttribute('onclick', update())
                document.getElementById("js-bts").classList.add("btn")
                document.getElementById("js-bts").classList.add("btn-primary")



            } else if (element.getAttribute("data-action") === "delete") {
                document.getElementById("editModalLabel").innerText = "Delete user";
                document.getElementById("js-bts").textContent = "Delete";
                document.getElementById("js-bts").setAttribute('onclick', deleteUser());
                document.getElementById("js-bts").classList.add("btn") ;
                document.getElementById("js-bts").classList.add("btn-danger");
                setReadOnlyInput();
            }
            let myModal = new bootstrap.Modal(document.getElementById('editModal'), {
                keyboard: true
            })
            myModal.show();
        } else {
            response.text().then(r => alert(r));
        }







    // myModal.submit = function () {
    //     myModal.hide();
    // }


    //document
    //  console.log(parseInt(element.getAttribute("data-userid"))===1)
    //
    //  console.log(element.getAttribute("data-action")==="edit")
    //
    //  console.log(document.getElementById('editModal1'));
    // let modal = document.getElementById('editModal1');
    // modal.childNodes["id0"].innerText = 1;
    //
    //  document.getElementById('editModal1').childNodes["id0"]
}

function setReadOnlyInput(){
    document.getElementById("firstName").setAttribute('readonly', "true");
    document.getElementById("lastName").setAttribute('readonly', "true");
    document.getElementById("age").setAttribute('readonly', "true");
    document.getElementById("username").setAttribute('readonly', "true");
    document.getElementById("password").setAttribute('readonly', "true");
    document.getElementById("roles").setAttribute('readonly', "true");

}
   function updateUsersTable(){
      let link = document.getElementById("js-cardBody")
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
                           let i = "btnE1";
                           let ii = "btnD1";
                           let k = 1;
                           data._embedded.userList.forEach((u) => {

                               temp += "<tr>";
                               temp += "<td>" + u.id + "</td>";
                               temp += "<td>" + u.firstName + "</td>";
                               temp += "<td>" + u.lastName + "</td>";
                               temp += "<td>" + u.age + "</td>";
                               temp += "<td>" + u.username + "</td>";
                               let temp2 = "";
                               for (r in u.roles) {
                                   temp2 += u.roles[r].name.substring(5) + " ";
                               }
                               temp += "<td>" + temp2 + "</td>";
//data-bs-target='#editModal data-bs-target='#deleteModal data-bs-toggle='modal'
                               temp += "<td>" +
                                   "                        <button type='button' data-userid='" + u.id + "' data-action='edit' class='btn btn-info js-open-modal'" +
                                   "                          onclick='startModal(this)' >Edit</button>" +
                                   "                    </td>" +
                                   "                    <td>" +
                                   "                        <button  type='button' data-userid='" + u.id + "' data-action='delete' class='btn btn-danger js-open-modal'" +
                                   "                        onclick='startModal(this)'   >Delete</button>" +
                                   "                    </td>" +
                                   "                </tr>";
                               document.getElementById("data").innerHTML = temp;
                               k += 1;
                               i = "btnE" + k.toString();
                               ii = "btnD" + k.toString();

                           })
                       }
                   }
               )
           }
       )


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
        changeViews(3);
    } else {
        response.text().then(r=> alert(r));

    }
}

function closeModal(){

}

async function deleteUser() {
    // document.getElementById('modal-form-js').onsubmit = function (event) {
    //     event.preventDefault();
    //     document.getElementById("js-close").click();
    // }
    let a = document.getElementById('id').value;
    let response = await userFetch.deleteUser(parseInt(a));
    if (response.ok) {
        console.log(response.status);
        updateUsersTable();
        cleanModal();
    } else {
        response.text().then(r => alert(r));
    }
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
let a =document.getElementById('id').value;
    let response = await userFetch.updateUser(data, parseInt(a));
    if (response.ok) {
        console.log(response.status);
        updateUsersTable();
        cleanModal();
    } else {
        response.text().then(r => alert(r));
    }
}
function cleanModal(){
    var myModel = document.getElementById('modal-form-js')
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
    container.setAttribute('onclick', 'changeViews(3)');
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
                            select += "<option id='"+ u.id +"'>" + u.name.substring(5) + "</option> ";
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
    let a = document.createElement("a");
    a.setAttribute('class', 'nav-link active h5');
    a.setAttribute('id', 'js-usrTable')
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


