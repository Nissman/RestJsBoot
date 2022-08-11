
function f() {
    fetch("http://localhost:8089/api/getUsers").then(res => {
            res.json().then(
                data=>{
                    console.log(data)
                    if (data.length > 0){
                        let temp = "";
                        data.forEach((u)=>{
                            temp += "<tr>";
                            temp += "<td>"+u.id+"</td>";
                            temp += "<td>"+u.firstName+"</td>";
                            temp += "<td>"+u.lastName+"</td>";
                            temp += "<td>"+u.age+"</td>";
                            temp += "<td>"+u.username+"</td>";
                            let temp2 = "";
                            for (r in u.roles) {
                                temp2+=u.roles[r].name.substring(5)+" ";
                            }
                            temp += "<td>"+ temp2+"</td></tr>";
                        })
                        document.getElementById("data").innerHTML = temp;
                    }
                }
            )
        }
    )
}


