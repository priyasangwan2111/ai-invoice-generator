const {GoogleGenAI}=require("@google/genai")
const Invoice=require("../models/Invoice");
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})


const parseInvoiceFromText=async (req,res)=>{
    const{text}=req.body;
    if(!text){
        return res.status(400).json({message:"text is required"});

    }
    try{
        const prompt=`You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an Invoice
        The output must be a valid JSON object.
        
        The JSON object should have the following structure:
        {
           "clientName":"string",
           "email":"string(if available)",
           "address":"string(if available)",
           "items":[
           {
              "name":"string",
              "quantity":"number",
              "unitPrice":"number",  
             }         }
           ]
        }
        Here is text to parse :
        ---TEXT START----
        ${text}
        ----TEXT END---
        Extract the data and provide only the JSON object.`;

        const response=await ai.models.generateContent({
            model:"gemini-2.5",
            contents:prompt,
        });
        const responseText=response.text;
        if(typeof responseText!=='string'){
            if(typeof response.text==='function'){
                responseText=response.text();
            }
            else{
                throw new Error('could not extract text from AI response.');
            }
        }
        const cleanedJson=responseText.replace(/```json/g,'').replace(/```/g,'').trim();
        const parsedData=JSON.parse(cleanedJson);
        res.status(200).json(parsedData);

        
    }
    catch(error){
        console.error("error parsing invoice with ai",error)
        res.status(500).json({message:"failed to parse invoice data from text",details:error.message});
    }
}

module.exports={parseInvoiceFromText};
const generateReminderEmail=async(req,res)=>{
    
        const{invoiceId}=req.body;
        if(!invoiceId){
            return res.status(400).json({message:"invoice id is required"})
        }
    try{
        const invoice=await Invoice.findById(invoiceId);
        if(!invoice){
            return res.status(404).json({message:"invoice not found"})
        }
        const prompt=`You are a professional and polite accounting assistant.write a friendly reminder email to a client
        about an overdue or upcoming invoice payment
        
        Use the following details to personalize the email:
        -Client Name: ${invoice.billTo.clientName}
        - Invoice Number:${invoice.invoiceNumber}
        -Amount Due:${invoice.total.toFixed(2)}
        -Due Date:${new Date(invoice.dueDate).toLocaleDateString()}
        
        The tone should be friendly but clear.keep it concise.Start the email with "Subject:".`;

        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:prompt,
        });
        res.status(200).json({reminderText:response.text})
    }
    catch(error){
        console.error("error generating reminder with ai",error)
        res.status(500).json({message:"failed to parse invoice data from text",details:error.message});
    }
};


const getDashboardSummary = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id });
        if (invoices.length === 0) {
            return res.status(200).json({ insights: ["no invoice data available to generate insights"] });
        }

        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
        const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid');
        const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0);
        const totalOutstanding = unpaidInvoices.reduce((acc, inv) => acc + inv.total, 0);

        const dataSummary = `
        -Total number of invoices: ${totalInvoices}
        -Total paid invoices: ${paidInvoices.length}
        -Total unpaid/pending invoices: ${unpaidInvoices.length}
        -Total revenue from paid invoices: ${totalRevenue.toFixed(2)}
        -Total outstanding amount from unpaid/pending invoices: ${totalOutstanding.toFixed(2)}
        -Recent invoices (last 5): ${invoices.slice(0, 5).map(inv =>
            `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(2)} with status ${inv.status}`
        ).join(', ')}
        `;

        const prompt = `
        You are a friendly and insightful financial analyst for a small business owner.
        Based on the following summary of their invoice data, provide 2-3 concise and actionable insights.
        Each insight should be a short string in a JSON array.
        Only return a valid JSON object. No explanations, no extra text.
        Data Summary:
        ${dataSummary}
        Example format: {"insights":["your revenue is looking strong this month!","You have 5 overdue invoices. consider sending reminders"]}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let responseText = response.text;
        console.log("AI raw response:", responseText); // 🔍 debug

        // Remove markdown formatting if present
        let cleanedJson = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // Extract only the JSON block { ... }
        const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({
                message: "AI did not return valid JSON",
                details: cleanedJson,
            });
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonMatch[0]);
        } catch (err) {
            console.error("Failed to parse AI JSON:", cleanedJson);
            return res.status(500).json({
                message: "failed to parse invoice data from text",
                details: cleanedJson,
            });
        }

        res.status(200).json(parsedData);
    } catch (error) {
        console.error("error getting dashboard summary with ai", error);
        res.status(500).json({ message: "failed to parse invoice data from text", details: error.message });
    }
};


module.exports={parseInvoiceFromText,generateReminderEmail,getDashboardSummary}