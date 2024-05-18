
const mongoose=require("mongoose");
const Schema=mongoose.Schema
const articleSchemaa=new Schema({
   Time:String,
   Date :String,
   Fix:Number,
   Satellites:Number,
   quality:Number,
   Location:String,
   GoogleMapslocation :String,
   Speed:Number,
   Heading :Number,
   Altitude:String,
   idcar :Number
 
})
const Article11=mongoose.model("Article11",articleSchemaa)
module.exports=Article11