
exports.getDateFormat = function(date){
  
  var timeUnitEnum = {
	 sec: 1000,
	 min: 1000 * 60,
	 hour: 1000 * 60 * 60,
	 day:  1000 * 60 * 60 * 24,
	 week: 1000 * 60 * 60 * 24 * 7,
	 month: 1000 * 60 * 60 * 24 * 30,
     year:  1000 * 60 * 60 * 24 * 365
  };
    
  var now = new Date();
  var m_sec_Diff = now.getTime() - date.getTime();
  
  if( m_sec_Diff < timeUnitEnum.year ){
	  if( m_sec_Diff < timeUnitEnum.sec ){
		  return "right now";
	  }
	  if( m_sec_Diff < timeUnitEnum.min ){
		  return getDateFormatString( m_sec_Diff, timeUnitEnum.sec,  0 );
	  }
	  if(m_sec_Diff >  timeUnitEnum.min &&  m_sec_Diff < timeUnitEnum.hour ){
		  return getDateFormatString( m_sec_Diff, timeUnitEnum.min,  1 );
	  }
	  if(m_sec_Diff >  timeUnitEnum.hour &&  m_sec_Diff < timeUnitEnum.day ){
		  return getDateFormatString( m_sec_Diff, timeUnitEnum.hour,  2 );
	  }
	  if(m_sec_Diff >  timeUnitEnum.day &&  m_sec_Diff < timeUnitEnum.week ){
		  return getDateFormatString( m_sec_Diff, timeUnitEnum.day, 3 );
	  }
	  if(m_sec_Diff >  timeUnitEnum.week &&  m_sec_Diff < timeUnitEnum.month ){
		  return getDateFormatString( m_sec_Diff, timeUnitEnum.week, 4 );
	  }
      if(m_sec_Diff >  timeUnitEnum.month &&  m_sec_Diff < timeUnitEnum.year ){
    	  return getDateFormatString( m_sec_Diff, timeUnitEnum.month, 5 );
	  }
  }
  
  return getDateFormatString2(date);
};

getDateFormatString = function (m_sec_Diff, timeUnit, idx){
  var timeUnitStrings = ["second", "minute" ,"hour", "day", "week", "month"];
  var diff = Math.floor(m_sec_Diff/timeUnit);
      
  if(diff > 1){
    return  diff.toString() + " " + timeUnitStrings[idx] + "s ago"; 
  }      
  return  diff.toString() + " " + timeUnitStrings[idx] + " ago"; 

}

getDateFormatString2 = function(date){
	
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  //month = ((month < 10) ? '0' : '') + month;
  //day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0': '') + second;

  var currentYear = new Date().getFullYear();
  year = ( (currentYear === year) ? '' : year );
  
  return month + '/' + day + '/' + year  + ' ' + hour + ':' + minute;
	
}


