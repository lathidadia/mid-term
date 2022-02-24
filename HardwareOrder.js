const { json } = require("body-parser");
const { SinkPage } = require("twilio/lib/rest/events/v1/sink");
const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    UPSELL:  Symbol("upsell"),
    ITEM:  Symbol("item"),
});

module.exports = class HardwareOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        //this.sSize = "";
        //this.sToppings = "";
        //this.sDrinks = "";
        this.sUpsell = "";
        this.sItem = "";
        this.sTotal = 0;
        this.error = "";
        //this.cart = [];
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.ITEM;
                aReturn.push("Welcome to Kashish's Hardware. Please select an item.\n1. Brooms\n2. Dustbins\n3. Snow Shovels\n4. Garbage\n5. Screen");
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                break;
            case OrderState.ITEM:
                switch (sInput.toLowerCase()){
                    case "1":
                    case "brooms":
                        this.sTotal += 15;
                        this.sItem = "Broom";                       
                        break;
                    case "2":
                    case "Dustbins":
                        this.sTotal += 5;
                        this.sItem = "Dustbins";                        
                        break;
                    case "3":
                    case "snow shovels":
                        this.sTotal += 20;
                        this.sItem = "Snow Shovels";
                        break;
                    case "4":
                    case "garabage":
                        this.sTotal += 35;
                        this.sItem = "Garabage";
                        break;
                    case "5":
                    case "Screen":
                        this.sTotal += 55;
                        this.sItem = "Screen";
                        break;
                    default:
                        this.stateCur = OrderState.ITEM;                        
                        this.error = "ERROR!\nPlease try again.\n1. Brooms\n2. Dustbins\n3. Snow Shovels\n4. Garbage\n5. Screen";
                        break;
                }
                if(this.error == "")
                {
                    aReturn.push("Would you like any additional items?\n1. Car scents\n2. Ear buds\n3. Car charger\n0. None");
                    this.stateCur = OrderState.UPSELL;                        
                }
                else
                    aReturn.push(this.error)
                this.error = "";
                break;
            case OrderState.UPSELL:
                switch (sInput.toLowerCase()){
                    case "0":
                    case "none": this.UPSELL = "";
                        break;
                    case "1":
                    case "car scents":
                        this.sTotal += 10;
                        this.sUpsell = "Car scnts";                       
                        break;
                    case "2":
                    case "ear buds":
                        this.sTotal += 30;
                        this.sDrinks = "Ear buds";                        
                        break;
                    case "3":
                        case "car charger":
                            this.sTotal += 15;
                            this.sDrinks = "Car charger";                        
                            break;
                    default:
                        this.stateCur = OrderState.UPSELL;                        
                        this.error = "ERROR!\nPlease try again.\n1. Car scents\n2. Ear buds\n3. Car charger\n0. None";
                        break;
                } 
                if(this.error == "")
                    {
                        aReturn.push(`Thank-you for your order of ${this.sItem}`);
                        if(this.sUpsell != ""){
                            aReturn.push(this.sUpsell);
                        }
                        let d = new Date(); 
                        d.setMinutes(d.getMinutes() + 20);

                        //Add TAX                    
                        aReturn.push(`Your approximate total (including Tax) is $${this.sTotal +(this.sTotal * 0.13)}`);
                        //aReturn.push(`Please pick it up at ${d.toTimeString()}`);
                        aReturn.push(`You will be notified when your order is ready`);
                        //aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);                        
                        this.isDone(true);
                        
                    }
                else
                    aReturn.push(this.error)
                this.error = "";                
                break;
                console.log(sInput.purchase_units[0].shipping.address);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered to\n${sInput.purchase_units[0].shipping.address.address_line_1} ${sInput.purchase_units[0].shipping.address.address_line_2 ? sInput.purchase_units[0].shipping.address.address_line_2 : ""}\n${sInput.purchase_units[0].shipping.address.postal_code} ${sInput.purchase_units[0].shipping.address.country_code}`);
                aReturn.push(`at ${d.toTimeString()}`);
                break;
            }
        return aReturn;
        }
    renderForm(){
            // your client id should be kept private
            return (`<html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
            
            <head>
            <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
            <meta name=ProgId content=Excel.Sheet>
            <meta name=Generator content="Microsoft Excel 15">
            <link rel=File-List href="sign_files/filelist.xml">
            <style id="sign_2633_Styles"><!--table
                {mso-displayed-decimal-separator:"\.";
                mso-displayed-thousand-separator:"\,";}
            .xl152633
                {padding-top:1px;
                padding-right:1px;
                padding-left:1px;
                mso-ignore:padding;
                color:black;
                font-size:11.0pt;
                font-weight:400;
                font-style:normal;
                text-decoration:none;
                font-family:Calibri, sans-serif;
                mso-font-charset:0;
                mso-number-format:General;
                text-align:general;
                vertical-align:bottom;
                mso-background-source:auto;
                mso-pattern:auto;
                white-space:nowrap;}
            .xl642633
                {padding-top:1px;
                padding-right:1px;
                padding-left:1px;
                mso-ignore:padding;
                color:black;
                font-size:11.0pt;
                font-weight:400;
                font-style:normal;
                text-decoration:none;
                font-family:Calibri, sans-serif;
                mso-font-charset:0;
                mso-number-format:General;
                text-align:center;
                vertical-align:bottom;
                mso-background-source:auto;
                mso-pattern:auto;
                white-space:nowrap;}
            .xl652633
                {padding-top:1px;
                padding-right:1px;
                padding-left:1px;
                mso-ignore:padding;
                color:black;
                font-size:11.0pt;
                font-weight:400;
                font-style:normal;
                text-decoration:none;
                font-family:Calibri, sans-serif;
                mso-font-charset:0;
                mso-number-format:General;
                text-align:center;
                vertical-align:middle;
                mso-background-source:auto;
                mso-pattern:auto;
                white-space:nowrap;}
            .xl662633
                {padding-top:1px;
                padding-right:1px;
                padding-left:1px;
                mso-ignore:padding;
                color:black;
                font-size:16.0pt;
                font-weight:400;
                font-style:normal;
                text-decoration:none;
                font-family:Calibri, sans-serif;
                mso-font-charset:0;
                mso-number-format:General;
                text-align:center;
                vertical-align:middle;
                mso-background-source:auto;
                mso-pattern:auto;
                white-space:nowrap;}
            .xl672633
                {padding-top:1px;
                padding-right:1px;
                padding-left:1px;
                mso-ignore:padding;
                color:black;
                font-size:11.0pt;
                font-weight:700;
                font-style:normal;
                text-decoration:none;
                font-family:Calibri, sans-serif;
                mso-font-charset:0;
                mso-number-format:General;
                text-align:general;
                vertical-align:bottom;
                mso-background-source:auto;
                mso-pattern:auto;
                white-space:nowrap;}
            .xl682633
                {padding-top:1px;
                padding-right:1px;
                padding-left:1px;
                mso-ignore:padding;
                color:black;
                font-size:11.0pt;
                font-weight:400;
                font-style:normal;
                text-decoration:none;
                font-family:Calibri, sans-serif;
                mso-font-charset:0;               
                text-align:center;
                vertical-align:bottom;
                mso-background-source:auto;
                mso-pattern:auto;
                white-space:nowrap;}
            .xl692633
                {padding-top:1px;
                padding-right:1px;
                padding-left:1px;
                mso-ignore:padding;
                color:#0563C1;
                font-size:11.0pt;
                font-weight:400;
                font-style:normal;
                text-decoration:underline;
                text-underline-style:single;
                font-family:Calibri, sans-serif;
                mso-font-charset:0;
                mso-number-format:General;
                text-align:center;
                vertical-align:middle;
                mso-background-source:auto;
                mso-pattern:auto;
                white-space:nowrap;}
            --></style>
            </head>
            
            <body>
            <!--[if !excel]>&nbsp;&nbsp;<![endif]-->
            <!--The following information was generated by Microsoft Excel's Publish as Web
            Page wizard.-->
            <!--If the same item is republished from Excel, all information between the DIV
            tags will be replaced.-->
            <!----------------------------->
            <!--START OF OUTPUT FROM EXCEL PUBLISH AS WEB PAGE WIZARD -->
            <!----------------------------->
            
            <div id="sign_2633" align=center x:publishsource="Excel">
            
            <h1 style='color:black;font-family:Calibri;font-size:14.0pt;font-weight:800;
            font-style:normal'>Kashish Hardware Flyer</h1>
            
            <table border=0 cellpadding=0 cellspacing=0 width=285 style='border-collapse:
             collapse;table-layout:fixed;width:214pt'>
             <col width=64 span=2 style='width:48pt'>
             <col width=93 style='mso-width-source:userset;mso-width-alt:3401;width:70pt'>
             <col width=64 style='width:48pt'>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 width=64 style='height:15.0pt;width:48pt'></td>
              <td colspan=3 rowspan=2 class=xl662633 width=221 style='width:166pt'>Kashish's
              Hardware</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td colspan=3 class=xl652633>Curbside pickup</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl152633></td>
              <td class=xl152633></td>
              <td class=xl152633></td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl672633>#</td>
              <td class=xl672633>Item Name</td>
              <td class=xl672633>Price</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633>1</td>
              <td class=xl642633>Broom</td>
              <td class=xl682633>$15</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633>2</td>
              <td class=xl642633>Dustbins</td>
              <td class=xl682633>$5</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633>3</td>
              <td class=xl642633>Snow Shovels</td>
              <td class=xl682633>$20</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633>4</td>
              <td class=xl642633>Garbage</td>
              <td class=xl682633>$35</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633>5</td>
              <td class=xl642633>Screens</td>
              <td class=xl682633>$55</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633></td>
              <td class=xl642633></td>
              <td class=xl642633></td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td colspan=3 rowspan=2 class=xl652633>Upsell Items</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633>1</td>
              <td class=xl642633>Car Scents</td>
              <td class=xl682633>$10</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633>2</td>
              <td class=xl642633>Ear Buds</td>
              <td class=xl682633>$30</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl642633>3</td>
              <td class=xl642633>Car Charger</td>
              <td class=xl682633>$15</td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl152633></td>
              <td class=xl152633></td>
              <td class=xl152633></td>
             </tr>
             <tr height=20 style='height:15.0pt'>
              <td height=20 class=xl152633 style='height:15.0pt'></td>
              <td class=xl152633></td>
              <td class=xl152633></td>
             </tr>
             <![if supportMisalignedColumns]>
             <tr height=0 style='display:none'>
              <td width=64 style='width:48pt'></td>
              <td width=64 style='width:48pt'></td>
              <td width=93 style='width:70pt'></td>
              <td width=64 style='width:48pt'></td>
             </tr>
             <![endif]>
            </table>
            
            </div>
            
            
            <!----------------------------->
            <!--END OF OUTPUT FROM EXCEL PUBLISH AS WEB PAGE WIZARD-->
            <!----------------------------->
            </body>
            
            </html>
            
            
            `);
    
    }    
}