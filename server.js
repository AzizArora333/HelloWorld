/********************************************************************************
 *  WEB322 – Assignment 05
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Aziz
 *  Student ID: 138943220 
 *  Date    : 10-04-2024
 * 
 *  Published URL: 

 * 
 ********************************************************************************/
const path = require('path');

const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
legoData.initialize();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', async(req, res)=>{
    try {
        res.render("home");
    } catch (error) {
        console.error(error);
        res.status(404).render("404", {message: '404 Error loading home page, error: ' + error});
    }
});

app.get('/lego/sets', async (req, res) => {
    try {      
        const theme = req.query.theme;
        
        if(theme){
            const setsByTheme = await legoData.getSetsByTheme(theme);
            res.render("sets",{sets: setsByTheme});
        } else {
            const allSets = await legoData.getAllSets();
            res.render("sets",{sets: allSets});
        }
    } catch (error) {
        res.status(404).render("404", {message: '404 Error No Sets found for a matching theme: ' + error});
    }
});

app.get('/lego/sets/:code', async (req, res) => {
    try {
        const setCode = req.params.code;
        const setByNum = await legoData.getSetsByNum(setCode);
        res.render("set", {set: setByNum});
    } catch (error) {
        res.status(404).render("404", {message: '404 Error No Sets found for a specific set num: ' + error});
    }
});

app.get('/about', async(req, res)=>{
    try {
        const filePath = path.join(__dirname, 'views', 'about.html');
        res.render("about");
    } catch (error) {
        console.error(error);
        res.status(404).render("404", {message: '404 Error: ' + error});
    }

})


app.get('/lego/addSet', async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        
        res.render('addSet', { themes: themes });
    } catch (error) {
        console.error('Error fetching themes:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/lego/addSet', async (req, res) => {
    try {
        const setData = req.body;
        await legoData.addSet(setData);
        res.redirect('/lego/sets');
    } catch (error) {
        console.error('Error adding LEGO set:', error);
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});

app.get('/lego/editSet/:num', async (req, res) => {
    try {
        const setNum = req.params.num;
        const setData = await legoData.getSetsByNum(setNum);
        const themeData = await legoData.getAllThemes();
        res.render('editSet', { themes: themeData, set: setData });
    } catch (error) {
        res.status(404).render('404', { message: error });
    }
});

app.post('/lego/editSet', async (req, res) => {
    try {
        const setNum = req.body.set_num;
        const setData = req.body;

        await legoData.editSet(setNum, setData);

        res.redirect('/lego/sets');
    } catch (error) {
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});

app.get('/lego/deleteSet/:num', async (req, res) => {
    try {
        const setNum = req.params.num;
        await legoData.deleteSet(setNum);

        res.redirect('/lego/sets');
    } catch (error) {
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    }
});



app.use((req, res, next) => {
    const filePath = path.join(__dirname, 'views', '404.html');
    res.status(404).render("404", {message: '404 Error. No view matched for a specific route'});
  });


// Start the server and it is listed at 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});







