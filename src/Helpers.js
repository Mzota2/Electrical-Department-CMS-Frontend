export const appUrl = process.env.REACT_APP_URL;

export function diff_hours(dt2, dt1) 
    {

        if(dt2?.getTime() < dt1?.getTime()){
            return 0;
        }

        else{
            // Calculate the difference in milliseconds between the two provided Date objects by subtracting the milliseconds value of dt1 from the milliseconds value of dt2
            var diff =(dt2.getTime() - dt1.getTime()) / 1000;
            // Convert the difference from milliseconds to hours by dividing it by the number of seconds in an hour (3600)
            diff /= (60 * 60);
            // Return the absolute value of the rounded difference in hours
            return Math.abs(Math.round(diff));
        }
    
    }

export function diff_days(dt2, dt1) 
    {
        if(dt2?.getTime() < dt1?.getTime()){
            return 0;
        }

        else{
            // Calculate the difference in milliseconds between dt2 and dt1
            var diff = (dt2.getTime() - dt1.getTime()) / 1000;
            // Convert the difference to days by dividing it by the number of seconds in a day (86400)
            diff /= (60 * 60 * 24);
            // Return the absolute value of the rounded difference in days
            return Math.abs(Math.round(diff));
        }
   
    }

    