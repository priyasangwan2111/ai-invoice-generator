const dotenv=require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path=require("path");
const connectDB = require("./config/db");

const authRoutes=require("./routes/authRoutes");
const invoiceRoutes=require('./routes/InvoiceRoutes');
const aiRoutes=require('./routes/aiRoutes');
const app=express()


//middleware to handle cors
app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    })
)

//connect database
connectDB();


//middleware
app.use(express.json());



//routes here
app.use("/api/auth",authRoutes);
app.use("/api/invoices",invoiceRoutes);
app.use("/api/ai",aiRoutes);

//start server
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));