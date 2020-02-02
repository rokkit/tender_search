import React, { useCallback } from 'react'

import {useDropzone} from 'react-dropzone'

const Drop = (props) => {
  const onDrop = useCallback(acceptedFiles => {
    props.onDrop()
    upload(acceptedFiles[0])
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const dropStyle = {
    minHeight: 30,
    paddingTop: 30,
    color: '#999',
    fontSize: 15,
    backgroundColor: '#fff',
    padding: '41px 47px',
    borderRadius: '0 0 10px 10px',
    boxShadow: '0 3px 30px rgba(0,0,0,.1)',
    borderLeft: '2px solid #f1f1f1',
    borderRight: '2px solid #f1f1f1',
    borderBottom: '2px solid #f1f1f1',
    textAlign: 'center'
  };

  const upload = (file) => {
    const formData = new FormData();

    formData.append('file', file);
    fetch('http://185.91.54.83:7001/upload', { // Your POST endpoint
      method: 'POST',
      mode: 'cors',
      body: formData // This is your file object
    }).then(
      response => response.json() // if the response is a JSON object
    ).then(
      success => props.onChange(success) // Handle the success response object
    ).catch(
      error => console.log(error) // Handle the error response object
    );
  };

  return (
    <div style={dropStyle} {...getRootProps()}>
      <input  {...getInputProps()} />
      {
        isDragActive ?
          <p>Перетащите файл сюда</p> :
          <p>
            {
              props.isLoading ? 'Подождите, выполняется обработка файла...' : 'Для пакетного поиска вы можете перетащить сюда Excel файл с товарами, или кликнуть на это поле'
            }
          </p>
      }
    </div>
  )
}

export default Drop