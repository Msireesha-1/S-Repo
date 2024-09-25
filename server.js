const express = require('express');

//Its a middleware, to upload the files to a server
const multer = require('multer');

const fs = require('fs');
const path = require('path');

// to scrap the web applications
const jsdom = require('jsdom');
const { type } = require('os');
const {JSDOM} = jsdom;

const port = '5000'

const app = express()

//where to upload the files
const upload = multer({dest: 'uploads/'});

app.use(express.json());
app.use(express.static('public'));

app.post('/api/upload', upload.array('files'),async(req, res)=>{
    try{
        const files = req.files;
        for (let file of files){
            if(path.extname(file.originalname)=== '.html' || path.extname(file.originalname)=== '.aspx'){
                const htmlContent = fs.readFileSync(file.path, 'utf-8');
                const dom = new JSDOM(htmlContent)
                // const inputElements = Array.from(dom.window.document.querySelectorAll('input'));

                // const inputs = inputElements.map(input=>({
                //    type : input.type,
                //    name: input.name,
                //    value: input.value
                // }));
                const allElements = Array.from(dom.window.document.querySelectorAll('form *'));
                
                const elements = allElements.map(element =>({
                    tag:element.tagName.toLowerCase(),
                    text:element.textContent.trim().split('\n'),
                    attributes: Array.from(element.attributes).reduce((attrs, attr)=>{
                        attrs[attr.name] = attr.value;
                        return attrs;
                    },{})
                }))
                const jsonFilePath = path.join('json_output',path.basename(file.originalname,'html')+'json');
                // fs.writeFileSync(jsonFilePath, JSON.stringify(inputs,null, 2));
                fs.writeFileSync(jsonFilePath, JSON.stringify(elements,null, 2));         
            }
            //clean up the uploaded files
            fs.unlinkSync(file.path);
        }
        res.send('Files processed successfully !');
    }catch(error){
        console.error('Error procesing files',error);
        res.status(500).send('Error processing files.');
    }
})


app.listen(port);