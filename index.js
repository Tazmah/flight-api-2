const { log } = require("console");
const { json } = require("express");
const express = require("express");
const fs = require("fs");
const flights = require("./flight.json"); // we required this so we can have acess to the information in the "flight.json" file

const app = express();

// we made use of these middle wares to get the information inside the file

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Welcome");
});


// fetch all flight info
app.get("/flights", (req, res) => {
    return res.json({ flights });
});

// add new flight
app.post("/flights", (req, res) => {
    let newFlight = req.body.newFlight;

    flights.push(newFlight);
    // let stringedData = JSON.stringify(flights);
    // the difference between both is that the information that will be updated inside the file will not be indented/ well spaced if the above code is used else the below will make it well spaced

    let stringedData = JSON.stringify(flights, null, 2);

    fs.writeFile("flight.json", stringedData, (err) => {
        if (err) res.status(500).json({ message: "new user created" });
        console.log("Sucessful");
    });

    return res.status(200).json({ message: "new user created" });
    console.log(req.body);
});






// get a specific flight detail
app.get("/flights/:id", (req, res) => {
    let id = req.params.id;
    let foundFlight = flights.find(flight => {
        return String(flight.id) == id;
    });



    console.log(foundFlight);
    if (foundFlight) {
        return res.status(200).json(foundFlight);
    } else {
        return res.status(404).json({ message: "flight not found" });
    }
    // fetch req.params.id mind you the value fetched is a string
    // find flight with id
    // return flight object as response
    // return a 404 if flight is not found
    console.log(req.params.id);
})


// function to find and delete from an array
function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
};
// delete a specific flight detail

app.delete("/flights/:id", (req, res) => {
    let id = req.params.id;
    let foundFlight = flights.find(flight => {
        return String(flight.id) == id;
    });

    let result = arrayRemove(flights, foundFlight);

    flights.splice(0, flights.length);
    console.log(`after all has been removed ${{ flights }}`);
    // flights(result);
    console.log(`after all has been added ${flights}`);
    flights = result;


    let stringedData = JSON.stringify(flights, null, 2);

    fs.writeFile("flight.json", stringedData, (err) => {
        if (err) {
            return res.status(500).json({ message: err });
        };
        console.log("sucessfully updated");
    });
    return res.status(200).json({ message: "Deleted" });


    console.log(flights);
});



// update a single user





// decleare value for port number
const port = 3000;
app.listen(port, () => console.log(`Listening on port {port}`));