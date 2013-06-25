var db = openDatabase("MyDatabase2", "1.0", 
    "Address Book", 200000);

var editRecordId = 0;

function createTableIfNotExists() {
    console.debug('called createTableIfNotExists()');

    var sql = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, phone TEL, email EMAIL, tech RANGE, sex RADIO, dob DATE, like CHECKBOX, edu TEXT, image TEXT)";

    db.transaction(function(transaction) {
        transaction.executeSql(sql, []);
        console.debug('executeSql: ' + sql);
    });
}

createTableIfNotExists();
console.log(createTableIfNotExists());

function insertRecord() {
    console.debug('called insertRecord()');
    console.log('insert');

    var name = document.getElementById('usrname').value
    var phone = document.getElementById('phone').value
    var email = document.getElementById('email').value;

    var sex;
    if (document.getElementById('sexmale').checked) {
        sex = "Male";
    } else if (document.getElementById('sexfemale').checked) {
        sex = "Female";
    }

    var dob = document.getElementById('dob').value;
    console.log(dob);
    var tech = document.getElementById('tech').value;

    var like = "";
    if (document.getElementById('drv').checked) {
        like = like + ",Drive";
    }
    if (document.getElementById('travel').checked) {
        like = like + ",Travel";
    }
    if (document.getElementById('read').checked) {
        like = like + ",Read";
    }
    like = like.substring(1);
    console.log(like);

    var e = document.getElementById('edu');
    var edu = e.options[e.selectedIndex].text;

    var image = document.getElementById('imageabc').src;

    // var image = document.getElementById('abc').src;

    var sql = 'INSERT INTO Contacts (name, phone, email, sex, dob, tech, like, edu, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.transaction(function(transaction) {
        transaction.executeSql(sql, [name, phone, email, sex, dob, tech, like, edu, image]);
        console.debug('executeSql: ' + sql);
        console.log(dob);
        console.log(image);
    });
}

console.log(name);
// console.log(dob);

function showw() {
    db.transaction(function(tx) {
        tx.executeSql("   SELECT * FROM Contacts", [], function(tx, abc) {
            dataset = abc.rows;
            var res = document.getElementById("abc");
            var data = "<table border='1px'><tr><th>Id</th><th>Name</th><th>Number</th><th>Email</th><th>Sex</th><th>Birthdate</th><th>Technical Knowledge level</th><th>Hobbies</th><th>Education</th><th>Image</th>";
            for (var i = 0; i < dataset.length; i++) {

                data += "<tr>";
                data += "<td>" + dataset.item(i).id + "</td>";
                data += "<td>" + dataset.item(i).Name + "</td>";
                data += "<td>" + dataset.item(i).phone + "</td>";
                data += "<td>" + dataset.item(i).email + "</td>";
                data += "<td>" + dataset.item(i).sex + "</td>";
                console.log(dataset.item(i).sex);
                data += "<td>" + dataset.item(i).dob + "</td>";

                //console.log(dataset.item(i).edu);
                data += "<td>" + dataset.item(i).tech + "</td>";
                data += "<td>" + dataset.item(i).like + "</td>";
                data += "<td>" + dataset.item(i).edu + "</td>";
                console.log(dataset.item(i).edu);
                // data += "<td>" + dataset.item(i).image + "</td>";
                // console.log(dataset.item(i).image);
                var imgurl = dataset.item(i).image;
                data += "<td><img src='" + imgurl + "' id='imageShow" + i + "' height='100px' width='100px'> </img></td>";

                data += "<td><button type='button' class='btn btn-danger btn-mini' onclick='deleteRecord(" + dataset.item(i).id + ")'>Delete</button></td>";
                data += "<td><button type='button' class='btn btn-warning btn-mini' onclick='editRecord(" + (i + 1) + ");visible()'>Edit</button></td>";
                // data += "<td><button type='button' class='btn btn-primary btn-mini' onclick='update(" + dataset.item(i).id + ");showw()'>Update</button></td>";
                data += "</tr>";
            }

            data += "</table>";
            document.getElementById('demo').innerHTML = data;
        })
    })
}

function editRecord(id) {

    console.debug('called editRecord()');

    editRecordId = id;

    console.log(id);
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM Contacts", [], function(tx, abc) {
            dataset = abc.rows;
            for (var i = 0; i < dataset.length; i++) {
                if (id == dataset.item(i).id) {

                    console.log(dataset.item(i).edu);
                    if (dataset.item(i).edu == "10") {
                        document.getElementById('ten').selected = true;
                    } else if (dataset.item(i).edu == "12") {
                        document.getElementById('twl').selected = true;
                    } else if (dataset.item(i).edu == "Graduate") {
                        document.getElementById("grad").selected = true;
                    } else if (dataset.item(i).edu == "Post Graduate") {
                        document.getElementById("pg").selected = true;
                    }

                    document.getElementById('usrname').value = dataset.item(i).Name;
                    document.getElementById('phone').value = dataset.item(i).phone;
                    document.getElementById('email').value = dataset.item(i).email;
                    document.getElementById('tech').value = dataset.item(i).tech;
                    document.getElementById('dob').value = dataset.item(i).dob;

                    console.log(dataset.item(i).sex);
                    if (dataset.item(i).sex == "Male") {
                        document.getElementById('sexmale').checked = true;
                    } else {
                        //console.log("in here");
                        document.getElementById('sexfemale').checked = true;
                    }

                    console.log(dataset.item(i).sex);

                    var hobby = new Array(2);
                    hobby = dataset.item(i).like.split(",");
                    console.log(hobby);
                    for (i = 0; i < hobby.length; i++) {
                        if (hobby[i] == "Drive")
                            document.getElementById('drv').checked = true;
                        if (hobby[i] == "Travel")
                            document.getElementById('travel').checked = true;
                        if (hobby[i] == "Read")
                            document.getElementById('read').checked = true;
                    }

                    document.getElementById('imageabc').src = dataset.item(i).image;

                }
            }
        });
    });
    return;

}

function updateRecord() {
    console.log(editRecordId);
    update(editRecordId);           //passing edit ID as argument in UPDATE()

    editRecordId = 0;
    showw();
}

function update(id) {
    console.log(id);
    //console.log(update());

    var name = document.getElementById('usrname').value;
    var phone = document.getElementById('phone').value;
    var email = document.getElementById('email').value;
    var tech = document.getElementById('tech').value;
    var dob = document.getElementById('dob').value;

    var sex;
    if (document.getElementById('sexmale').checked) {
        sex = "Male";
    } else if (document.getElementById('sexfemale').checked) {
        sex = "Female";
    }

    var like = "";
    if (document.getElementById('drv').checked) {
        like = like + ",Drive";
    }
    if (document.getElementById('travel').checked) {
        like = like + ",Travel";
    }
    if (document.getElementById('read').checked) {
        like = like + ",Read";
    }
    like = like.substring(1);
    var tech = document.getElementById('tech').value;

    var edu = document.getElementById('edu').value;

    var image = document.getElementById('imageabc').src;

    var sql = 'UPDATE Contacts SET name=?, phone=?, email=?, tech=?, sex=?, dob=?, like=?, edu=?, image=? WHERE id=?';
    db.transaction(function(tx) {
        tx.executeSql(sql, [name, phone, email, tech, sex, dob, like, edu, image, id]);

    });

}

function deleteRecord(id) {
    console.debug('called deleteRecord()');
    console.log(id);

    var sql = 'DELETE FROM Contacts WHERE id=?';

    db.transaction(function(tx) {
        tx.executeSql(sql, [id], showw);
        console.debug('executeSql: ' + sql);
        alert('Delete Sucessfully');
    });
}

function dropTable() {
    console.debug('called dropTable()');

    var sql = 'DROP TABLE Contacts';

    db.transaction(function(transaction) {
        transaction.executeSql(sql, []);
    });
    createTableIfNotExists();

}

// function reset()
// {
//
// }

function visible() {
    document.getElementById("abc").style.visibility = "visible";
}

function hidee() {
    document.getElementById("abc").style.visibility = "hidden";
}

function display() {
    hidee();
    showw();
}

// SHOW POP-OVER
function showPopOver(divID) {
    // SET THE DIV POSITION
    document.getElementById(divID).style.left = "900px";
    document.getElementById(divID).style.top = "260px";

    // SHOW THE DIV
    document.getElementById(divID).style.display = "block";
}

// CLOSE POP-OVER
function closePopOver(divID) {
    // HIDE THE DIV
    document.getElementById(divID).style.display = "none";
}

//HIDE FORM POPOVER
function showPop(divID) {
    // SET THE DIV POSITION
    document.getElementById(divID).style.left = "900px";
    document.getElementById(divID).style.top = "260px";

    // SHOW THE DIV
    document.getElementById(divID).style.display = "block";
}

// CLOSE POP-OVER
function closePop(divID) {
    // HIDE THE DIV
    document.getElementById(divID).style.display = "none";
}


//function validate() {
//    var phone = document.getElementById("phone").value;
//    var pattern = /^(1-?)?(([2-9]\d{2})|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/;
//    if (pattern.test(phone)) {
//        //alert("Your phone number : "+phone);
//        return true;
//    }
//    alert("It is not valid phone number!");
//    return false;
//}

//function check()
//{
//    var phone = document.getElementById('phone').value;
//    var mail = document.getElementById('email').value;
//    var name = document.getElementById('usrname').value;
//
//    if(phone == "" && name == "" && mail == "")
//    {
//        document.getElementById('ins').style.visibility = "hidden";
//    }
//}
var somethign = {"abc":"asdfasfasdfS"};
