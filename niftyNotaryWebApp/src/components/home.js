// import React from 'react';
// import logo from './logo.svg';
import '../App.css';
import SubmitHash from './myComponent'
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

import React, {useCallback, useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64';
import Hex from 'crypto-js/enc-hex'
// import crypto from 'crypto'

// how do we set state inside
// need to get a react refresher
// how do we get somehting to appear?
// after we have uploaded
// render the file somehow with a set of options
// mebs require clickt to post
function Home() {


  // once droppped we don't need to be able to drop more
  // should replace or destroy


  const [hash, setHash] = useState('0x0')

  useEffect(() => {
    console.log('hash: ', hash)
  });

  // useEffect(() => {
  //   document.title = `You clicked ${count} times`;
  // }, [count]); // Only re-run the effect if count changes

  // so how do we manage wanting to make a request...
  // what could we do with Ethereum

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        setHash('0x' + sha256(reader.result).toString(Hex))
      };

      reader.readAsDataURL(file)

    })

  }, [])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (

    <div className={"fullscreen"} {...getRootProps()}>
      <h1>Notarise files on Ethereum</h1>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
      {/*<div>{hash}</div>*/}
      <SubmitHash hash={hash}></SubmitHash>
    </div>
  )
}

export default Home;