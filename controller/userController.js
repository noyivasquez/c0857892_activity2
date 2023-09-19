const mongoose = require('mongoose');

const userModel = require('../model/userModel');

const alert = require("node-notifier");

module.exports= {

    addUser: async function(req, res) {
        console.log("This is the addUser function.");
        var email = req.body.email;
        var user = await userModel.find({'email':{$eq:email}});
        var num = await userModel.countDocuments({'email':{$eq:email}});
        if(num > 0) {
            alert.notify({
                title: 'Existing subscriber',
                message: 'This email has already been used for a subscription.'
            });
        }
        else{
            var newUser = req.body;
            newUser = {
                "name" : req.body.name,
                "email" : req.body.email,
                "subscription" : req.body.subscription
            };
            userModel.create(newUser);
            res.redirect('/success');
        }
    },

    findUser: async function(req, res) {
        console.log("This is the findUser function.");
        var email = req.query.email;
        var user = await userModel.find({'email':{$eq:email}});
        var num = await userModel.countDocuments({'email':{$eq:email}});
        if(num > 0) {
            res.render('display.ejs', {userFound:user});
        }
        else {
            alert.notify({
                title: 'Check the email',
                message: 'We did not find this email in our database.'
            });
            res.redirect('/subscriber');
        }
    },

    unsubscribe: async function(req, res) {
        console.log("This is the unsubscribe method.");
        var email = req.query.email;
        var user = await userModel.find({'email':{$eq:email}});
        var num = await userModel.countDocuments({'email':{$eq:email}});
        if(num > 0) {
            res.render('confirm.ejs', {userFound:user});
        }
        else {
            alert.notify({
                title: 'Check the email',
                message: 'We did not find this email in our database.'
            });
            res.redirect('/subscriber');
        }
    },

    unsubscribeConfirm: async function(req, res) {
        console.log("This is the unsubscribeConfirm method.");
        var email = req.body.email;
        await userModel.deleteOne({'email':{$eq:email}});
        res.render('unsubscribe.ejs');
    },

    updateInfo: async function(req, res) {
        console.log("This is the updateInfo method.");
        var id = req.body.id;
        var newName = req.body.name;
        var newEmail = req.body.email;
        var newMag = req.body.subscription_new;
        await userModel.updateOne(
            { '_id': {$eq:id} },
            {
                $set: { 'name': newName, 'email': newEmail}
            }
        );
        if (newMag != 'Select a magazine') {
            await userModel.updateOne(
                { '_id': {$eq:id} },
                {
                    $set: { 'subscription': newMag}
                }
            );
        };
        var user = await userModel.find({'_id':{$eq:id}});
        alert.notify({
            title: 'Success',
            message: 'You have updated your information.'
        });
        res.render('display.ejs', {userFound:user});
    }

}