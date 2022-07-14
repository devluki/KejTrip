require('../models/database');
const Pin = require('../models/Pin');
const Route = require('../models/Route');
const request = require('request');
const {
    post
} = require('request');

// map
exports.map = async (req, res) => {


    try {

        res.render('map-menu', {
            title: 'Kejtrip - mapa',

        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }


}
// Map add pins view
exports.addPins = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    try {

        res.render('map-addPins', {
            title: 'Kejtrip - mapa/dodawania punktów',
            infoErrorsObj,
            infoSubmitObj


        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }


}

// Map submit add pins
exports.submitAddPins = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    try {


        const newPin = new Pin({
            pinLocation: req.body.pinLocation,
            pinLink: req.body.pinLink,
            pinLongitude: req.body.pinLongitude,
            pinLatitude: req.body.pinLatitude,
            status: req.body.status,


        })
        await newPin.save();

        req.flash('infoSubmit', 'Pin został dodany!');

        res.redirect('/map/pins')




    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/map/pins');

    }


}

exports.pinsList = async (req, res) => {
    try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        const pins = await Pin.find({}).sort({
            _id: -1
        })

        res.render('pins-list', {
            title: 'Kejtrip-lista',
            pins,
            infoErrorsObj,
            infoSubmitObj

        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}

exports.deletePin = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    // console.log(req.params.id);
    let id = req.params.id;
    try {

        await Pin.findByIdAndRemove(id);
        req.flash('infoSubmit', 'Pin został usunięty!');
        res.redirect('/admin-panel/map/pins-list')
    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/admin-panel/map/pins-list');

    }


}

///


exports.editPin = async (req, res) => {
    let id = req.params.id;
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    try {

        const pin = await Pin.findById(req.params.id);
        // console.log(pin);

        res.render('map-editPins', {
            title: 'Kejtrip-edycja',
            pin: pin,
            infoErrorsObj,
            infoSubmitObj
        })

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/admin-panel/map/pins-list');
    }
}


exports.editPinPut = async (req, res) => {


    let id = req.params.id;

    try {

        const pin = await Pin.findByIdAndUpdate(id, {
            $set: {



                "pinLocation": req.body.pinLocation,
                "pinLongitude": req.body.pinLongitude,
                "pinLatitude": req.body.pinLatitude,
                "status": req.body.status

            },

        }, {
            new: true
        })

        await pin.save();

        req.flash('infoSubmit', 'Pin został dodany!');

        res.redirect('/admin-panel/map/pins-list')

        // req.flash('infoSubmit', 'Pin has been edited.');
        // res.redirect('/admin-panel/map/add-pins');

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/admin-panel/map/pins-list');

    }
}

// API
exports.pinsAPI = async (req, res) => {

    try {
        const data = await Pin.find({
            'status': 'Publikacja'
        })


        res.json(data);

    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}

// Map add routes
// Main form view
exports.addRoute = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    try {

        res.render('map-addRoute', {
            title: 'Kejtrip - mapa/dodawania tras',
            infoErrorsObj,
            infoSubmitObj,

        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }


}
// Function - get routing and update
const requestRoute = (dataCords, name) => {
    const route = request({

        method: 'POST',
        url: 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',

        body: `{"coordinates": ${dataCords},"units": "km"}`,
        headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': '5b3ce3597851110001cf6248760b2fe52b484167892f758fd156fa66',
            'Content-Type': 'application/json; charset=utf-8',

        }
    }, async function (error, response, body) {


        const updateRoute = await Route.findOneAndUpdate({
            name: name
        }, {
            $set: {

                "routing": JSON.parse(body).features[0].geometry,
                "distance": JSON.parse(body).features[0].properties.summary.distance

            },

        }, {
            new: true
        })

        await updateRoute.save();



    });

}




// Submit route
exports.submitAddRoute = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    try {


        const newRoute = new Route({
            name: req.body.name,
            startLocation: req.body.startLocation,
            startLongitude: req.body.startLongitude,
            startLatitude: req.body.startLatitude,
            endLocation: req.body.endLocation,
            endLongitude: req.body.endLongitude,
            endLatitude: req.body.endLatitude,
            midPoints: req.body.midPoints,
            routeDescription: req.body.routeDescription,
            status: req.body.status,

        })

        await newRoute.save();


        const name = req.body.name;

        let dataCords = `[[${req.body.startLongitude},${req.body.startLatitude}],${req.body.midPoints},[${req.body.endLongitude},${req.body.endLatitude}]]`;
        console.log('dataCords:', dataCords);
        requestRoute(dataCords, name)



        req.flash('infoSubmit', 'Trasa została dodana!');
        res.redirect('/admin-panel/map/add-route');




    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('admin-panel/map/add-route');

    }


}

// 
exports.routeList = async (req, res) => {
    try {

        const routes = await Route.find({}).sort({
            _id: -1
        })

        res.render('route-list', {
            title: 'Kejtrip-lista',
            routes

        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}
// 

exports.deleteRoute = async (req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    try {

        await Route.findByIdAndRemove(id);
        res.redirect('/')
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }


}
// 

exports.editRoute = async (req, res) => {
    // let id = req.params.id;
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const id = req.params.id;
    try {

        const route = await Route.findById(id);
        res.render('map-editRoute', {
            title: 'Kejtrip-edycja',
            route: route,
            infoErrorsObj,
            infoSubmitObj
        })

    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}


exports.editRoutePut = async (req, res) => {


    let id = req.params.id;

    try {

        const route = await Route.findByIdAndUpdate(id, {
            $set: {
                "name": req.body.name,
                "startLocation": req.body.startLocation,
                "startLongitude": req.body.startLongitude,
                "startLatitude": req.body.startLatitude,
                "endLocation": req.body.endLocation,
                "endLongitude": req.body.endLongitude,
                "endLatitude": req.body.endLatitude,
                "midPoints": req.body.midPoints,
                "routeDescription": req.body.routeDescription,
                "status": req.body.status,


            },

        }, {
            new: true
        })

        await route.save();

        const name = req.body.name;
        let dataCords = `[[${req.body.startLongitude},${req.body.startLatitude}],${req.body.midPoints},[${req.body.endLongitude},${req.body.endLatitude}]]`;
        requestRoute(dataCords, name)

        req.flash('infoSubmit', 'Trasa została zapisana!');
        res.redirect('/admin-panel/map/route-list');

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/submit-post');

    }
}


// 