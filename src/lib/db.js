import mongoose from "mongoose";

const connectTODB = async ()=>{
    mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("DB Connected")).catch((e)=>console.error(e));
}
export default connectTODB