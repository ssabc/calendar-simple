let arrow = require( '../arrow.js' )
/*
* @start @end @step
*/
function range( start, end, step = 0 ) {
    var ary = []
    if ( step > 0 ) {
        let distance = end - start
        let _end = parseInt( distance / step )
        for( let i = start;i < _end;i++ ) {
        ary.push( start + ( i * step ) )
        }
        if ( distance % step > 0 ) { ary.push( end ) }
    }else if (start>-1&& end>0) {
        for (let i = start;i<end;i++) {
        ary.push(i)
        }
    } else {
        for( var i = 0;i < start;i++ ) {
        ary.push( i + step )
        }
    }
    return ary
}

function isLeapYear( year ) {
    return ( ( ( year % 4 ) == 0 ) && ( ( year % 100 ) != 0 ) || ( ( year % 400 ) == 0 ) )
}
function getDaysInMonth( year,month) {
    let days
    if ( month in [ 1, 3, 5, 7, 8, 10, 12 ] ) {
        days = range( 31 )
    } else if ( month in [ 4, 6, 9, 11 ] ) {
        days = range( 30 )
    } else if ( month == 2 && isLeapYear( year ) ) {
        days = range( 29 );
    } else {
        days = range( 28 );
    }
    return days;
}

let week_lang = ['日', '一', '二', '三', '四', '五', '六']

class Calendar {
    constructor( firstweekday = 1) {
         this.firstweekday = firstweekday //# 0 = Sunday, 6 = Saturday
    }
    getweekheader(){
        return this.weekdays().map(function(i){ return week_lang[i]})
    }
    weekdays() {
        let i = null
        return range( this.firstweekday, this.firstweekday + 7 ).map( function( i ) {
            return i % 7
        })
    }
    monthdates( year, month ) {
        let local_month = month - 1
        let date = new Date( year, local_month, 1 )
        let loop = true
        let days = ( date.getDay() - this.firstweekday ) % 7
        let days_amount = getDaysInMonth( year, month )
        let _max_deep = (days != -1)&&(days < 5 || ( days >= 5 && days_amount < 31 ) )? 35 : 42
       if ( days==-1 )
            days =6 
        date = arrow.arrow.get( date ).replace( { days: -days }).get_date()
        let date_queue = []
        let counter = 0
        while( loop ) {
            try {
                if ( counter >= _max_deep ) { break }
                date_queue.push( date )
                date = arrow.arrow.get( date ).replace( { days: 1 }).get_date()

            } catch( e ) {
                break
            }
            counter++
        }
        return date_queue      
    }
    /**
    * 处理日历
    * @params 参数{year: 年， month： 月}
    */
    monthdayscalendar(params, cb) {
        let year_t = params.year, month_t = params.month;
        var date_queue = this.monthdates(year_t, month_t).map(function (date) {

          let dat = [date.getDay()]
          if (date.getMonth() != month_t - 1) {
            dat.unshift(0)
          } else {
            dat.unshift(date.getDate())
          }
          return dat
        })
        
        let daysPerMonth = range(0, date_queue.length, 7).map(function(x) {
            return date_queue.slice(x, x + 7)
        })
        let nowDate = new Date()
        let cal1 =  {
                realYear: nowDate.getFullYear(),
                realMonth: nowDate.getMonth() + 1,
                realDay: nowDate.getDate(),
                year: parseInt(year_t),
                month: parseInt(month_t),
                calendar: {
                    days: this.getweekheader(),
                    weeks: daysPerMonth
                }
            }
        typeof cb == "function" && cb(cal1)
    }
}
module.exports = {
    Calendar: Calendar
}
