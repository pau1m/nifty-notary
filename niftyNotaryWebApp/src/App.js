// import React from 'react';
// import logo from './logo.svg';
import './App.css';
// import { myComponent } from './myComponent'
//
// // @todo pull in material
// // make it a nice but dumb front end that more or less copies existing options
// // dl file with details
// // mebs a zip package
// // drag and drop
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64';
import Hex from 'crypto-js/enc-hex'
// import crypto from 'crypto'


function App() {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // const binaryStr = reader.result
        //
        // console.log(sha256(reader.result).toString(Hex))
        const digest = sha256(reader.result).toString(Hex)

        // Should pass this down to another component
        // (async () => {
        //   const rawResponse = fetch('https://httpbin.org/post', {
        //     method: 'POST',
        //     headers: {
        //       'Accept': 'application/json',
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({a: 1, b: 'Textual content'})
        //   });
        //   const content = rawResponse.json();
        //
        //   console.log(content);
        // // })();


        // fetch('/users.html')
        //   .then(function(response) {
        //     return response.text()
        //   }).then(function(body) {
        //   document.body.innerHTML = body
        // })


        // now do a
        // let buffer = Buffer.from(sha256(binaryStr).toString(CryptoJS.enc.Hex), 'hex');
        // let array  = new Uint8Array(buffer);
        // generating hash

      };

      reader.readAsDataURL(file)

      // const goo = sha256(reader.readAsDataURL(file));
      // console.log(reader.readAsDataURL(file))
      // const foo = reader.readAsDataURL(file);
      // console.log(foo);
      // const moo = Base64.stringify(sha256(bina));
      // console.log(moo);

      // can do this on the front end...
      // or can do it on the back
      // hash document and send as hash
      //reader.readAsArrayBuffer(file)

      // send to api do a curl request
      // have to deal with thunky things

    })

  }, [])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (

    <div className={"fullscreen"} {...getRootProps()}>
      <h1>Notarise files on Ethereum</h1>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )
}

export default App;
