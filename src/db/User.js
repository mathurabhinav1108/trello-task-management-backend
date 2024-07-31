const mongoose = require("mongoose")

const userschema = mongoose.Schema({
  name: {
    required:[true, 'Please enter your first name.'],
    type:String,
    minLength:3,
  },
  email: {
    type: String,
    unique:[true, 'Username is already taken.'], 
  },
  password: {
    type:String,
    select:false
  },
})

// userschema.virtual('banner_image').get(function() {
//   const APP_URL = 'https://food-backend-three.vercel.app';
//   return `${APP_URL}/storage/${this.image}`;
// });

// userschema.set('toObject', { virtuals: true });
// userschema.set('toJSON', { virtuals: true }); 


module.exports = mongoose.model("user",userschema)