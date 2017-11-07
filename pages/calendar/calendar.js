let calendar = require('../../utils/calendar/calendar.js')
let app = getApp()
let self = null

Page({
  data: {
    cal1: null // 日历渲染数据
  },
  /**
  * 获取日历
  */
  getCalendarDate(year, month, isInit){
    self.cal.monthdayscalendar({
      year: year,
      month: month
    }, function (resCalendar) {
      self.setData({cal1: resCalendar})
    })      
  },
  /**
  * 下一个月
  */
  premonth: function (e) { 
    let month = (self.data.cal1.month - 1)
    let year_diff = (month == 0) ? -1 : 0
    
    month = (month == 0) ? 12 : month
    self.getCalendarDate(self.data.cal1.year + year_diff, month)
  },
  /**
  * 上一个月
  */
  nextmonth: function (e) {
    let year_diff = parseInt(self.data.cal1.month / 12)
    let month = (self.data.cal1.month + 1)

    month = (self.data.cal1.month % 12) + 1
    self.getCalendarDate(self.data.cal1.year + year_diff, month)
  },
  /**
  * 初始加载
  */
  onLoad: function () {
    self = this
    self.cal = new calendar.Calendar();
    let nowDate = new Date();
    self.getCalendarDate(nowDate.getFullYear(), nowDate.getMonth() + 1, true);
  },
})