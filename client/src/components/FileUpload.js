import React, {Fragment, useState} from 'react'
import Message from './Message';
import Progress from './Progress';

import axios from 'axios'

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercent] = useState(0);

    const [list, setList] = useState([]);
    const [value, setValue] = useState('');

    const [redactedText, setRedactedText] = useState('');

    const addToList = () => {
      let temp = list;
    // the start of logic to accept space or comma seperated input
    //   if(value.includes(',')) {
    //     //var newValues = value.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g);
    //     var res = value.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g);
    //     console.log('NV: ', res);
    //     for(let i = 0; i < res.length; i++){
    //         console.log(res[i]);
    //         console.log(res[i].match(/(?:[^\s"']+|['"][^'"]*["'])+/g));
    //         res[i] = res[i].replaceAll("'", "");
    //         res[i] = res[i].replaceAll('"', "");
    //     }
    //     // console.log(res);

    //     //
    //   }
    //   else {
    //     var newValues = value.match(/(?:[^\s"']+|['"][^'"]*["'])+/g);

    //     for(let i = 0; i < newValues.length; i++){
    //         console.log(newValues[i]);
    //         newValues[i] = newValues[i].replaceAll("'", "");
    //         newValues[i] = newValues[i].replaceAll('"', "");
    //     }
    //   }

      temp.push(value);
      setList(temp);
      setValue("");

    }

    const onChange = e => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        //use a try catch to deal with error handling
        try {
 
            //I was having some issues clearing out the directory so for this demo it has to be manual
            //hitting our backend upload endpoint
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: ProgressEvent => {
                    setUploadPercent(parseInt(Math.round((ProgressEvent.loaded * 100)/ProgressEvent.total)))

                    //clear percentage after 10 seconds
                    setTimeout(() => {
                        setUploadPercent(0)
                    }, 10000);
                }
            });

            const {fileName, filePath} = res.data;
            setUploadedFile({fileName, filePath}); 
            setMessage('File Uploaded & Censored!');
            //we can use a fetch to work with the file
            fetch(filePath)
            .then(response => response.text())
            .then(data => {
                
                var stringToCensor = data.toString();//.split(/\s/);

                //loop through our keywords and phrases to censor
                //replace all of using our regular expression with XXXXX
                list.forEach(e => {

                    // Using the global and ignore case flags
                    // I believe it should be case insenstive because if a keyword or phrase needs to be censored
                    // it should not matter what case it is censor it, this can be changed easily though if desired
                    let re = new RegExp(`\\b${e}\\b`, 'gi');
                    stringToCensor = stringToCensor.replace(re, 'XXXX');
                })
                
                setRedactedText(stringToCensor);
            

            });


        } catch(err) {
            if(err.response.staus === 500){
                setMessage('There was a problem with the server')
            }
            else {
                setMessage(err.response.data.msg);
            }
        }
    }

    return (
       
        <Fragment>
            {message ? <Message msg={message} /> : null}
        <div className="App">
            <h6 className="mt-4">Enter keywords/phrases you would like to censor without any quotation.</h6>
            <input type="text" className="form-control" value={value} onChange={(e) => setValue(e.target.value)}/>{" "}
            <button type="submit" value="Upload" className="btn btn-primary btn-block mt-1" onClick={addToList}> Click to Add </button>
            <ul>{list.length > 0 && list.map((item) => <li>{item} </li>)}</ul>
        </div>


            <form>
                <div className='custom-file mb-1'>
                <h6 className="mt-4">Upload .txt file below</h6>
                    <input className="form-control" type="file" id="formFile" onChange={onChange}/>
                </div>
            </form>
            <Progress percentage={uploadPercentage}></Progress>

            <br></br>
            <input type="submit" value="Upload & Censor" className="btn btn-primary btn-block" onClick={onSubmit} />
        <p className='mt-4'>{redactedText}</p>
        
        </Fragment>

        

        
    )
}

export default FileUpload