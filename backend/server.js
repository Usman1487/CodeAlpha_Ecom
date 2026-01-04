const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

mongoose.connect('mongodb://127.0.0.1:27017/ecommerceDB')
    .then(() => console.log("✅ Database Connected Successfully"))
    .catch(err => console.error("❌ Database Connection Error:", err));


const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    category: String
});

const orderSchema = new mongoose.Schema({
    customerName: String,
    items: Array,
    total: Number,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);


app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});


app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ message: "Order failed" });
    }
});


app.get('/api/seed', async (req, res) => {
    const dummyProducts = [
        { name: "Wireless Headphones", price: 50, category: "Electronics", description: "High quality noise cancelling.", image: "https://placehold.co/200x200?text=Headphones" },
        { name: "Smart Watch", price: 120, category: "Electronics", description: "Tracks fitness and sleep.", image: "https://placehold.co/200x200?text=Watch" },
        { name: "Running Shoes", price: 80, category: "Fashion", description: "Comfortable grip for running.", image: "https://placehold.co/200x200?text=Shoes" },
        { name: "Laptop Backpack", price: 40, category: "Accessories", description: "Waterproof and spacious.", image: "https://placehold.co/200x200?text=Backpack" }
    ];
    await Product.insertMany(dummyProducts);
    res.send("Database seeded with dummy products!");
});


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));