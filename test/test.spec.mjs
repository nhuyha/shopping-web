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

test('them san pham', async() => {
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
  expect(result.length).toBe(1)
  });

