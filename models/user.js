const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'I am new!'
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
})

// userSchema.methods.addToCart = function(product) {
//   const cartProductIndex = this.cart.items.findIndex(cp=> {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({productId: product._id, quantity: newQuantity})
//     }
    
//     const updatedCart = { items: updatedCartItems};
//     this.cart=updatedCart;
//     return this.save()
// }

// userSchema.methods.clearCart = function() {
//   this.cart = {items: []};
//   return this.save(); 
// }


module.exports = mongoose.model('User', userSchema);