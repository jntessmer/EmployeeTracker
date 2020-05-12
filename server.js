const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
let express = require("express");
let app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

let PORT = process.env.PORT || 8080; 

//create connection with mysql
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306, 
    user: "root", 
    password: "Tazzykins", 
    database: "employerTrackerDB"
});

//use the database to get information 
connection.connect(function(err){
    if (err) throw err; 
    runSearch();
});


//prompt user to select action 
function runSearch() {
    inquirer
        .prompt({ 
            name: "action", 
            type: "rawlist", 
            message: "What would you like to do?", 
            //choices to pick once prompted
            choices: [
                "view", 
                "create", 
                "update", 
                "delete",
            ]
        }) //use selection to run the function
        .then(function(answer){
            switch (answer.action) {
                case "view":
                    viewData();
                    break;
                case "create":
                    createData();
                    break;
                case "update":
                    updateData();
                    break;
                case "delete":
                    deleteData();
                    break;
                
            }
        });
}

function viewData(){
    inquirer
    .prompt({
        name: "view", 
        type: "rawlist", 
        message: "What do you want to search by?",
        choices: ["employee", "role", "department", "manager"]
    })
    .then(function(answer){
        switch(answer.view) {
            case "employee":
                employeeSearch();
                break;
            case "department":
                departmentSearch();
                break;
            case "role":
                rolesSearch();
                break;
            case "manager":
                managerSearch();
                break;
        }});
};
//pull all employees 
function employeeSearch(){
    connection.query("SELECT * FROM employees", function(err, res) {
            console.table(res)
        runSearch();
        });
};

//pull up employees by department 
function departmentSearch(){
    inquirer 
    .prompt({
        name: "department_division", 
        type: "input", 
        message: "Sort employees by department", 
    })
    .then(function(answer) {
        connection.query("SELECT department_division, last_name, first_name FROM department JOIN employees ON department.id = employees.department_id WHERE department.department_division = ?", [answer.department_division, answer.last_name, answer.first_name], function(err, res){
            for (let i = 0; i < res.length; i++){
                console.table(res[i]);
            }
            runSearch();
        });
    });
};                                                                                                               //pull up employees by thier role 
function rolesSearch(){
    inquirer 
    .prompt({
        name: "title", 
        type: "input", 
        message: "Sort employees by role?", 
    }) 
    .then(function(answer) {
        connection.query("SELECT title, last_name, first_name FROM role JOIN employees ON role.id = employees.role_id WHERE role.title = ?", [answer.title, answer.last_name, answer.first_name], function(err, res){
            for (let i = 0; i < res.length; i++){
                console.table(res[i]);
            }
            runSearch();
        });
    });
};   

//pull up employees by their manager
function managerSearch(){
    inquirer 
    .prompt({
        name: "manager_id", 
        type: "input", 
        message: "Sort employees by manager?", 
    }) 
    .then(function(answer) {
        connection.query("SELECT manager_id, last_name, first_name FROM employees WHERE employees.manager_id = ?", [answer.manager_id, answer.last_name, answer.first_name], function(err, res){
            for (let i = 0; i < res.length; i++){
                console.table(res[i]);
            }
            runSearch();
        });
    });
}; 

function createData(){
    inquirer
    .prompt({
        name: "create", 
        type: "rawlist", 
        message: "What do you want to create?",
        choices: ["employee", "role", "department"]
    })
    .then(function(answer){
        switch(answer.create) {
            case "employee":
                addEmployee();
                break;
            case "department":
                addDepartment();
                break;
            case "role":
                addRole();
                break;
        }});
};
//add a department
function addDepartment(){
    inquirer
    .prompt([{
        type: "input", 
        name: "id", 
        message: "Please enter in a new  department id"
    }, 
    {
        type: "input", 
        name: "department_division", 
        message: "Please name the new division"
    }])
    .then(function(answer) {
        connection.query("INSERT INTO department VALUES(?, ?)" ,[answer.id, answer.department_division], console.table("You have added the new id" + answer.id + "for the new department " + answer.department_division),
            runSearch()
        )});
};

//add new employee
function addEmployee(){
    inquirer
    .prompt([{
        name: "id",
        type: "input", 
        message: "Please give an id to the employee", 
    },{
        name: "first_name", 
        type: "input", 
        message: "What is the new employee's first name?"
    },{
        name: "last_name", 
        type: "input", 
        message: "What is the new employee's last name?"
    }, {
        name: "role_id", 
        type: "input", 
        message: "What is their role id"
    },{
        name: "manager_id", 
        type: "input", 
        message: "Who is their manager (use id)", 
    },{
        name: "department_id", 
        type: "input",
        message: "What department do they belong to (use id)?"
    }])
    .then(function(answer) {
        connection.query("INSERT INTO employees VALUES( ?, ?, ?, ?, ?, ?)" ,[answer.id, answer.first_name, answer.last_name, answer.role_id, answer.manager_id, answer.department_id], console.table("You have added " + answer.id  + answer.first_name + answer.last_name + answer.role_id + answer.manager_id + answer.department_id + " to employees"),
            runSearch()
    )});
};

function addRole(){
    inquirer
    .prompt([{
        name: "id",
        type: "input", 
        message: "What role id is it?", 

    },{
        name: "title", 
        type: "input", 
        message: "What title is it?"
    },{
        name: "salary",
        type: "input", 
        message: "What salary does this role make?" 
    },{
        name: "department_id", 
        type: "input", 
        message: "What department is it in (use id)?"
    }]).then(function(answer) {
        connection.query("INSERT INTO role VALUES(?, ?, ?, ?)" ,[answer.id, answer.title, answer.salary, answer.department_id], console.table("You have added " + answer.id + answer.title + answer.salary + answer.department_id), 
            runSearch()
    )});
};

function deleteData(){
    inquirer
    .prompt({
        name: "delete", 
        type: "rawlist", 
        message: "What do you want to delete?",
        choices: ["employee", "role", "department"]
    })
    .then(function(answer){
        switch(answer.delete) {
            case "employee":
                deleteEmployee();
                break;
            case "department":
                deleteDepartment();
                break;
            case "role":
                deleteRole();
                break;
        }});
};

function deleteEmployee(){
    inquirer
    .prompt({
        name: "id", 
        type: "input", 
        message: "Please use employee id to delete employee from database"
    })
    .then(function(answer){
        connection.query("DELETE FROM employees WHERE id = ?", [answer.id], console.table("You have deleted employee " + answer.id), 
        runSearch()
    )});
};

function deleteDepartment(){
    inquirer
    .prompt({
        name: "id", 
        type: "input", 
        message: "Please use department id to delete the department"
    })
    .then(function(answer){
        connection.query("DELETE FROM department WHERE id = ?", [answer.id], console.table("Deleted department " + answer.id), runSearch()
    )});
};

function deleteRole(){
    inquirer
    .prompt({
        name: "id", 
        type: "input", 
        message: "Please use role id to delete role"
    })
    .then(function(answer){
        connection.query("DELETE FROM role WHERE id = ?", [answer.id], console.table("Deleted role " + answer.id), runSearch())
    });
};

//prompt user to select action 
function updateData() {
    inquirer
        .prompt({ 
            name: "update", 
            type: "rawlist", 
            message: "What would you like to do?", 
            //choices to pick once prompted
            choices: [
                "update employee role", 
                "update employee manager",  
            ]
        }) //use selection to run the function
        .then(function(answer){
            switch (answer.update) {
                case "update employee role":
                    updateEmployeeRole();
                    break;
                case "update employee manager":
                    updateManager();
                    break;
            }});
}

//update manager 
function updateManager(){
    inquirer
    .prompt([{
            name: "id", 
            type: "input", 
            message: "What is the employee's id?"
        },{
            name: "manager_id", 
            type: "input", 
            message: "Who is the new manager (use manager id)?"
    }])
    .then(function(answer) {
        connection.query("UPDATE employees SET manager_id = ? WHERE id = ?" ,[ answer.manager_id, answer.id], console.table("You have updated " + answer.manager_id + "to" + answer.id), 
            runSearch()
    )});
};

function updateEmployeeRole(){
    inquirer
    .prompt([{
            name: "id", 
            type: "input", 
            message: "What is the employee's id?"
        },{
            name: "role_id", 
            type: "input", 
            message: "What is the employee's new role?"
    }])
    .then(function(answer) {
        connection.query("UPDATE employees SET role_id = ? WHERE id = ?" , [answer.role_id, answer.id], console.table("You have updaded " + answer.id + "to" + answer.role_id),
            runSearch()
    )});
};

app.listen(PORT, function(){
    console.log("Here it is " + PORT)
});