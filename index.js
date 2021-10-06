var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var app = express();
var upload = multer();
const port = process.env.PORT || 3000;


var hostv;
var userv;
var passv;
var dbv;
var selectedDbType;
var selectedTab;
var selectedFie;
var tabs = [];
var fies = [];
var dis = [];
var data = [];
var fromtable = 0;
var fromdb = 0;

app.get('/', function (req, res) {
    tabs = [];
    fromdb = 1;
    res.render('form');
});

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('./node_modules/bootstrap/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array());
app.use(express.static('public'));


app.post('/', function (req, res) {
    
    
    if(fromdb == 1)
    {
        selectedDbType = `${req.body.db_type}`;
        
        hostv = `${req.body.url}`,
        userv = `${req.body.user}`,
        passv = `${req.body.pass}`,
        dbv = `${req.body.db}`
    
        // hostv = 'localhost',
        //     userv = 'app',
        //     passv = 'app123',
        //     dbv = 'practice'
    }
    
    
    
    if (selectedDbType == 'Choose Database') {
        res.send('Choose Database Type');
    }
    else if (selectedDbType == 'Mysql') {

        var connection = mysql.createConnection({
            host: `${hostv}`,
            user: `${userv}`,
            password: `${passv}`,
            database: `${dbv}`
        })
        
        connection.query("SELECT TABLE_NAME AS tables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '" + dbv + "' ;",
            function (err, rows, fields) {
                if (err) {
                    // throw err;
                    res.render('error');
                }

                tabs = rows;
                fies = [];
                dis = [];
                data = [];
                
                // console.log('rows');
                // console.log(rows);
                // console.log('tabs');
                // console.log(tabs);
                // console.log('fies');
                // console.log(fies);
                // console.log('dis');
                // console.log(dis);
                // console.log('data');
                // console.log(data);
                
                fromtable = 1;
                let flag = 0;
                res.render('mysql_form', { tabs, fies, dis, data, selectedTab, selectedFie, selectedDbType, dbv, flag });

            });

    }
    else
    {
        res.render('na');
    }
});

app.post('/mysql_field', function (req, res) {

    if(fromtable == 1)
        selectedTab = `${req.body.table}`;
    
    fromdb = 0;
    
    var connection = mysql.createConnection({
        host: `${hostv}`,
        user: `${userv}`,
        password: `${passv}`,
        database: `${dbv}`
    })

    // console.log(selectedTab);
    // console.log(selectedFie);


    connection.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '" + selectedTab + "' ORDER BY ORDINAL_POSITION;",
        function (err, rows, fields) {
            if (err) {
                // throw err;
                res.render('error');
            }

            fies = rows;
            dis = [];
            data = [];
            
            // console.log('rows');
            // console.log(rows);
            // console.log('tabs');
            // console.log(tabs);
            // console.log('fies');
            // console.log(fies);
            // console.log('dis');
            // console.log(dis);
            // console.log('data');
            // console.log(data);
            
            let flag = 1;
            res.render('mysql_form', { tabs, fies, dis, data, selectedTab, selectedFie,  selectedDbType, dbv, flag });
        });
    
    // connection.query("SELECT " + req.body.field + " from " + req.body.table + ";",
    //     function (err, rows, fields) {
    //         if (err) throw err;
    //         console.log(rows);
    //         // res.send(rows);
    //     });
});


app.post('/mysql_graph', function (req, res) {

    selectedFie = `${req.body.field}`;

    // console.log(selectedTab);
    // console.log(selectedFie);
    fromtable = 0;
    
    var connection = mysql.createConnection({
        host: `${hostv}`,
        user: `${userv}`,
        password: `${passv}`,
        database: `${dbv}`
    })
    
    
    connection.query("SELECT " + selectedFie + " AS att FROM " + selectedTab + ";",
        function (err, rows, fields) {
            if (err) {
                // throw err;
                res.render('error');
            }
            
            var freq = [];
            var i = 0;
            
            rows.forEach(num => {
                
                if(freq[num.att])
                {
                    freq[num.att] = freq[num.att] + 1;
                }
                else
                {
                    freq[num.att] = 1;
                    dis[i] = num.att;
                    i++;
                }
            });
            
            i = 0;
            dis.forEach(num => {
                data[i] = freq[num];
                i++;
            });
                        
            
            // console.log('rows');
            // console.log(rows);
            // console.log('tabs');
            // console.log(tabs);
            // console.log('fies');
            // console.log(fies);
            // console.log('dis');
            // console.log(dis);
            // console.log('data');
            // console.log(data);
            
            
            
            let flag = 2;
            // res.send(dis);
            res.render('mysql_form', { tabs, fies, dis, data, selectedTab, selectedFie,  selectedDbType, dbv, flag});
        });

    // connection.query("SELECT " + req.body.field + " from " + req.body.table + ";",
    //     function (err, rows, fields) {
    //         if (err) throw err;
    //         console.log(rows);
    //         // res.send(rows);
    //     });
});




app.listen(port);






