import { createContext } from 'react';
const Context = createContext<context>({
    ngonngu: 'en-US',
    update: (x)=>{}
})
type context = {
    ngonngu: ('en-US')|('vi-VN')
    update: (x: "en-US"|"vi-VN") => void
}

export default Context