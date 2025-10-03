const Invoice = require("../models/Invoice");


//@desc create a new invoice
//@route POST /api/invoice
//@access private


exports.createInvoice=async(req,res)=>{

    try{
        const user=req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            status,
        }=req.body;

        let subTotal=0;
        let taxTotal=0;
        items.forEach((item)=>{
            subTotal+=item.quantity*item.unitPrice;
            taxTotal+=((item.taxPercent || 0)/100)*(item.quantity*item.unitPrice);
        });
        const total=subTotal+taxTotal;
        const invoice =new Invoice({
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            subTotal,
            taxTotal,
            total,
            status,
        });
        await invoice.save();
        res.status(201).json(invoice);
    }
    catch(error){
        res.status(500).json({message:'error creating invoice',error:error.message});
    }
};

//@desc get all invoices for a user
//@route GET /api/invoice
//@access private

exports.getInvoices=async(req,res)=>{
    try{
        const invoices=await Invoice.find({user:req.user.id}).populate('user',' name email');
        res.json(invoices);
    }
    catch(error){
        res.status(500).json({message:'error fetching invoice',error:error.message});
    }
};

//@desc get invoice by id
//@route GET /api/invoice/:id   
//@access private
exports.getInvoiceById=async(req,res)=>{
    try{
        const invoice=await Invoice.findById(req.params.id).populate('user', 'name email');
        if(!invoice){
            return res.status(404).json({message:'Invoice not found'});

        }
        if(invoice.user.toString()!==req.user.id){
            return res.status(401).json({message:'Unauthorized to access this invoice'});
        }
        res.json(invoice);
    }
    catch(error){
        res.status(500).json({message:'error fetching invoice',error:error.message});
    }
};



//@desc update invoice
//@route PUT /api/invoice/:id
//@access private
exports.updateInvoice=async(req,res)=>{
    try{
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            status,
        }=req.body;
        let subTotal=0;
        let taxTotal=0;
        if(items && items.length>0){
        items.forEach((item)=>{
            subTotal+=item.quantity*item.unitPrice;
            taxTotal+=((item.taxPercent || 0)/100)*(item.quantity*item.unitPrice);
        });
    }
        const total=subTotal+taxTotal;
        const updatedInvoice=await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                invoiceNumber,
                invoiceDate,
                dueDate,
                billFrom,   
                billTo,
                items,
                notes,
                paymentTerms,
                status,
                subTotal,
                taxTotal,
                total,
    },{new:true}
);
    if(!updatedInvoice) return  res.status(404).json({message:"invoive not found"});
    res.json(updatedInvoice)
    }
    catch(error){
        res.status(500).json({message:'error updating invoice',error:error.message});
    }
};


//@desc delete invoice  
//@route DELETE /api/invoice/:id
//@access private
exports.deleteInvoice=async(req,res)=>{
    try{
        const invoice=await Invoice.findByIdAndDelete(req.params.id);
        if(!invoice) return res.status(404).json({message:"invoice not found"});
        res.json({message:"invoice deleted successfully"})
    }
    catch(error){
        res.status(500).json({message:'error deleting invoice',error:error.message});
    }
}