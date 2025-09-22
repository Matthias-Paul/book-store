import cron from "cron"
import https from "https"

const jobs = new cron.CronJob("*/14 * * * *", function(){
   https.get(process.env.API_URL, (res)=>{
    if(res.statusCode === 200 ) console.log("Get requests sent successfully")
    else console.log("Get request failed", res.statusCode)
   })
   .on("error", (e)=> console.error("Error while sending request", e))
   
})        

export default jobs;