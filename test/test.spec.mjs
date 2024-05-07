import fetch, {
    Blob,
    blobFrom,
    blobFromSync,
    File,
    fileFrom,
    fileFromSync,
    FormData,
    Headers,
    Request,
    Response,
  } from 'node-fetch'

import {exec} from 'node:child_process';
exec('uvicorn --app-dir ../back-end FastAPI:app', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  }); 
  import http from 'http';

  // Hàm kiểm tra xem cổng đã mở hay chưa
  function isPortOpen(port) {
    return new Promise((resolve, reject) => {
      const options = {
        host: 'localhost',
        port: port,
        timeout: 1000, // Thời gian chờ tối đa (ms)
      };
  
      const request = http.request(options, (res) => {
        resolve(true);
      });
  
      request.on('error', () => {
        resolve(false);
      });
  
      request.end();
    });
  }
  
  // Hàm chờ cổng mở
  async function waitForPort(port) {
    let isOpen = false;
    while (!isOpen) {
      isOpen = await isPortOpen(port);
      if (!isOpen) {
        console.log(`Port ${port} is not open yet. Waiting...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây trước khi kiểm tra lại
      }
    }
    console.log(`Port ${port} is open!`);
  }
  
  // Sử dụng hàm waitForPort để chờ cổng 8000 mở
  waitForPort(8000).then(() => {
    // Gọi hàm hoặc thực hiện các thao tác khác sau khi cổng đã mở
    test()
  });
  
const test = async() => {
  const params = new URLSearchParams();
  params.append('ten', 'ten')
  params.append('anh', 'anh')
  params.append('mo_ta', 'mota')
  params.append('gia',11)
  params.append('so_luong',111)

  const them_san_pham = await fetch("http://localhost:8000/them_san_pham?" + params,{
    method: 'PUT',
  });
  const danh_sach_san_pham = await fetch("http://localhost:8000/danh_sach_san_pham",{
    method: 'PUT',
  });
  const project_id = await them_san_pham.json();//project_id
  const danh_sach = await danh_sach_san_pham.json()
  result = danh_sach.filter((item) => project_id===item.id)
  if(result.length!==1) {
    console.log('false')
  }
  else{
    console.log('true')
  }
  }
