import mongoose from "mongoose";
 
export const connectDb =(url)=>{
mongoose.connect(url)
.then(()=>{console.log('connected')})
.catch((Error)=>{console.log(Error)})
}
