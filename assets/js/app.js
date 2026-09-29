const cl = console.log;

const stdForm = document.getElementById('stdForm')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const email = document.getElementById('email')
const salary = document.getElementById('salary')
const contect = document.getElementById('contect')
const addstdBtn = document.getElementById('addstdBtn')
const updatestdBtn = document.getElementById('updatestdBtn')
const stdcontainer = document.getElementById('stdcontainer')

let base_url = 'https://b-22-cruds-default-rtdb.asia-southeast1.firebasedatabase.app'
let std_url = `${base_url}/students.json`

let studentArr = [];


// ======================================================read-std============================================================
function readStd() {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", std_url, true)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status === 200) {
            let res = JSON.parse(xhr.response)
            for (const key in res) {
                // cl(key)
                res[key].id = key
                // cl(res)
                studentArr.push(res[key])
            }
            oncreatestdList(studentArr)
        } else {
            cl("ERROR")
        }
    }
}
readStd(studentArr)
function oncreatestdList(arr) {
    let result = ``

    arr.forEach((ele, i) => {


        result += `
            <tr id="${ele.id}">
                <td>${i + 1}</td>
                <td>${ele.fname}</td>
                <td>${ele.lname}</td>
                <td>${ele.salary}</td>
                <td>${ele.email}</td>
                <td>${ele.contect}</td>
                <td><button onClick="onEditStudent(this)" class="btn btn-outline-primary">Edit</button></td>
                <td><button onClick="onRemoveStudent(this)"class="btn btn-outline-danger">Delate</button></td>
            </tr>`
    })
    stdcontainer.innerHTML = result;
}

// ======================================================create-std============================================================
function oncreatestd(eve) {
    eve.preventDefault()
    let createOBJ = {
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        salary: salary.value,
        contect: contect.value
    }
    let xhr = new XMLHttpRequest()
    xhr.open('POST', std_url)
    xhr.send(JSON.stringify(createOBJ))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            studentArr.unshift(createOBJ)
            let res = JSON.parse(xhr.response)

            let tr = document.createElement('tr');
            tr.id = res.name;
            tr.innerHTML = `<td>${1}</td>
                <td>${createOBJ.fname}</td>
                <td>${createOBJ.lname}</td>
                <td>${createOBJ.salary}</td>
                <td>${createOBJ.email}</td>
                <td>${createOBJ.contect}</td>
                <td><button onClick="onEditStudent(this)" class="btn btn-outline-primary">Edit</button></td>
                <td><button onClick="onRemoveStudent(this)"class="btn btn-outline-danger">Delate</button></td>`;
            stdcontainer.prepend(tr)

            let td = [...document.querySelectorAll('#stdcontainer tr td:first-child')]
            td.forEach((ele, i) => {
                ele.innerHTML = i + 1
            })
            stdForm.reset()

            Swal.fire({
                title: "STD DATA CREATED SUCCESSFULLY..!!!",
                text: "your student data created has been successfully..!!",
                icon: "success",
                timer: 4000
            });
        } else {
            cl(`somthing want wrong..?`)
        }
    }
}

// ======================================================EDIT-STD======================================================================

function onEditStudent(ele) {
    let EDIT_id = ele.closest('tr').id;
    localStorage.setItem('UPDATE_id', EDIT_id)
    let EDIT_URL = `${base_url}/students/${EDIT_id}.json`;

    let xhr = new XMLHttpRequest()
    xhr.open('GET', EDIT_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            cl(res)
            fname.value = res.fname;
            lname.value = res.lname;
            email.value = res.email;
            salary.value = res.salary;
            contect.value = res.contect;

            addstdBtn.classList.add('d-none');
            updatestdBtn.classList.remove('d-none');

        } else {
            cl(`ERROR`)
        }
    }

}


// ======================================================UPDATE-STD======================================================================
function onpudatestd() {
    let UPDATE_id = localStorage.getItem('UPDATE_id')
    //cl(UPDATE_id)
    let update_url = `${base_url}/students/${UPDATE_id}.json`;
    let updatewobj = {
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        salary: salary.value,
        contect: contect.value
    }
    //cl(updatewobj)
    let xhr = new XMLHttpRequest()
    xhr.open('PATCH', update_url)
    xhr.send(JSON.stringify(updatewobj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            let tr = document.getElementById(UPDATE_id)
            tr.innerHTML = `<td>${1}</td>
                <td>${updatewobj.fname}</td>
                <td>${updatewobj.lname}</td>
                <td>${updatewobj.salary}</td>
                <td>${updatewobj.email}</td>
                <td>${updatewobj.contect}</td>
                <td><button onClick="onEditStudent(this)" class="btn btn-outline-primary">Edit</button></td>
                <td><button onClick="onRemoveStudent(this)"class="btn btn-outline-danger">Delate</button></td`;

            Swal.fire({
                title: "STD DATA UPDATED SUCCESSFULLY..!!!",
                text: "your student data updated has been successfully..!!",
                icon: "success",
                timer: 4000
            });

            stdForm.reset()
            addstdBtn.classList.remove('d-none');
            updatestdBtn.classList.add('d-none')
        }
    }
}

// ======================================================DELETE-STD======================================================================
function onRemoveStudent(ele) {
    let DELETE_id = ele.closest('tr').id;
    cl(DELETE_id)
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let delete_url = `${base_url}/students/${DELETE_id}.json`;
            let xhr = new XMLHttpRequest()
            xhr.open('DELETE', delete_url)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response)
                    ele.closest('tr').remove()

                    let td = document.querySelectorAll('#stdcontainer tr')
                    td.forEach((ele, i) => {
                        ele.querySelector('td').innerHTML = i + 1
                    });
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } else {
                    cl(`ERROR..!!`)
                }
            }
        }
    });
}


stdForm.addEventListener('submit', oncreatestd)
updatestdBtn.addEventListener('click', onpudatestd)