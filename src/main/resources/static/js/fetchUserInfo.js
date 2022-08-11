const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('http://localhost:8089/api/getUsers'),
    //findUserByUsername: async () => await fetch(`api/user`),
    getRoles: async () => await fetch('http://localhost:8089/api/getRoles'),
    findOneUser: async (id) => await fetch(`http://localhost:8089/api/getUser/${id}`),
    findCurrentUser: async () => await fetch(`http://localhost:8089/api/getUser`),
    addNewUser: async (user) => await fetch('/api/create', {
        method: "POST",
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    //updateUser: async (user, id) => await fetch(`api/users/${id}`, {method: 'PUT', headers: userFetch.head, body: JSON.stringify(user)}),
    // deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetch.head})
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

//TODO
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
                                    "                          data-bs-target='#editModal" + u.id + "' data-bs-toggle='modal' >Edit</button>" +
                                    "                    </td>" +
                                    "                    <td>" +
                                    "                        <button type='button' data-userid='" + u.id + "' data-action='delete' class='btn btn-danger js-open-modal'" +
                                    "                           data-bs-target='#deleteModal" + u.id + "'  data-bs-toggle='modal'  >Delete</button>" +
                                    "                    </td>" +
                                    "                </tr>";
                                document.getElementById("data").innerHTML = temp;
//todo повесить событие на модалку
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
                            select += "<option>" + u.name.substring(5) + "</option> ";
                        })
                        document.getElementById("roles").innerHTML = select;
                    }
                }
            )
        }
    );
}


// function forOneUser(a) {
//     fetch("http://localhost:8089/api/getUser").then(res => {
//         res.json().then(
//             data => {
//                 let temp2 = "";
//                 for (r in data.roles) {
//                     temp2 += data.roles[r].name.substring(5);
//                 }
//                 userInfoNavBar(data, temp2);
//                 if (a === 1) {
//                     userInfoTable(data, temp2);
//                 }
//             })
//     });
//}








function usersTable() {
    let container = document.getElementById("ja-cardBody");
    container.innerHTML = "<p class='card-text'>" +
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
                                "                          data-bs-target='#editModal' data-bs-toggle='modal' >Edit</button>" +
                                "                    </td>" +
                                "                    <td>" +
                                "                        <button type='button' data-userid='" + u.id + "' data-action='delete' class='btn btn-danger js-open-modal'" +
                                "                             data-bs-toggle='modal'  >Delete</button>" +
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
let btn = document.querySelectorAll('.js-open-modal');
    btn.forEach(function(item){

        item.addEventListener('onclick', function(e) {

            e.preventDefault();

            let modalId = this.getAttribute('data-modal'),
                modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');

            modalElem.classList.add('active');
            //overlay.classList.add('active');

        }); // end click
    }); // end foreach
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









