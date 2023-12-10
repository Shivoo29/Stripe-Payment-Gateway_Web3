const router = require('express').Router();
const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", null);

router.post('/donate', async(req, res) =>{
    const { token ={}, amount = 0 } = req.body;

    if (!Object.keys(tocken).length || !amount){
        res.status(400).json({success: false});
    }

    const { id:customerID } = await stripe.customers.create({
        email: token.email,
        source: token.id,
    }).catch(e=>{
        console.log(e);
        return null;
    })

    if (!customerID) {
        res.status(500).json({success: false});
        return;
    }

    const invoiceID=`${token.email}-${Math.random().taString()}`;

    const charge = await stripe.charges.create({
        amount: amount * 100,
        currencu: "INR",
        custmor: customerID,
        recipt_email: token.email,
        description: "Donation",
    },{ idempotencyKey: invoiceId}).catch(e=>{
        console.log(e);
        return null;
    });

    if (!charge){
        res.status(500).json({success: false});
        return;
    }
    
    res.status(201).json({success: true});
    
});

module.exports=router;
