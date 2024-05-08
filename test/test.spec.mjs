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
  };
  
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
  };
  
  // Sử dụng hàm waitForPort để chờ cổng 8000 mở
  waitForPort(8000).then(async() => {
    // Gọi hàm hoặc thực hiện các thao tác khác sau khi cổng đã mở
    await test1()
    await test2()
    await test1()
    await test3()
  });
  
const test1 = async() => {
  const params = new URLSearchParams();
  params.append('ten', 'ten')
  params.append('anh', 'anh')
  params.append('mo_ta', 'mota')
  params.append('gia',11)
  const them_san_pham = await fetch("http://localhost:8000/them_san_pham?" + params,{
    method: 'PUT',
  });
  const danh_sach_san_pham = await fetch("http://localhost:8000/danh_sach_san_pham",{
    method: 'GET',
  });
  
  
  const project_id = await them_san_pham.json();//project_id
  const danh_sach = await danh_sach_san_pham.json()
  const result = danh_sach.filter((item) => project_id===item.id)
  if(result.length!==1) {
    console.log('false')
  }
  else{
    console.log('true')
  }
  };

  const test2 = async() => {
    const params = new URLSearchParams();
    params.append('product_id',String(1))
    
    const xoa_san_pham = await fetch("http://localhost:8000/xoa_san_pham?" + params,{
      method: 'PUT',
    });
    const danh_sach_san_pham = await fetch("http://localhost:8000/danh_sach_san_pham",{
    method: 'GET',
  });
    const danh_sach = await danh_sach_san_pham.json()
    const result = danh_sach.find(item=> item.id===1)
    if(!result) {
      console.log('true')
    }
    else{
      console.log('false')
    }
    }

    const test3 = async() => {
      const params = new URLSearchParams();
      params.append('product_id', String(2))
      params.append('ten_moi', "ten_moi")
      params.append('anh_moi', 'anh')
      params.append('mo_ta_moi', 'mota')
      params.append('gia_moi',11)
      const chinh_sua_san_pham = await fetch("http://localhost:8000/chinh_sua_san_pham?" + params,{
        method: 'PUT',
      });
      const danh_sach_san_pham = await fetch("http://localhost:8000/danh_sach_san_pham",{
        method: 'GET',
      });
      
      
      const danh_sach = await danh_sach_san_pham.json()
      const result = danh_sach.filter((item) => 2===item.id&&'ten_moi'===item.name&&item.image_url==='anh'&&item.detail==='mota'&&item.price===11)
      if(result.length===1) {
        console.log('true')
      }
      else{
        console.log('false')
      }
      };

    