import React, {useState} from "react";

const FloderReader = () =>{
    const [fileContents, setFileContents] = useState([])

    const handleFileChange = (e) =>{
        const files = e.target.files;
        const fileArray = Array.from(files);
        console.log('fileArray result is:', fileArray)
        const data = []
        for (let i = 0; i < fileArray.length; i++){
          data.push(fileArray[i].name)
        }
        console.log('data:',data)
        const htmlfiles = data.filter((file)=>file.split('.')[1]==='html')
        console.log('htmlfiles', htmlfiles)
        const fileReaders = htmlfiles.map((file)=>{
            return new Promise((resolve)=>{
                const reader = new FileReader()
                reader.onload = (e) =>{
                    resolve({name:file.name, content: e.target.result})
                }
                reader.readAsText(file)
            })
        })
        Promise.all(fileReaders).then((results)=>{setFileContents(results)})
    }
return (
    <div>
        <input type="file" webkitdirectory multiple onChange={handleFileChange} />
      <h3>File Contents:</h3>
      <ul>
        {fileContents.map((file, index) => (
          <li key={index}>
            <strong>{file.name}:</strong> {file.content}
          </li>
        ))}
      </ul>
    </div>
)
}

export default FloderReader;