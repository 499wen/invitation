/**
 *          时间戳转换日期
 * date: 时间戳(ms) complete: 返回日期是否包含时间 (默认不包含)
 * 
 */
function formatDate(date, complete = false) {
    if(typeof date != 'number'){
        return ''
    }

    date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var m1 = date.getMinutes();
    var s = date.getSeconds();
    m = m < 10 ? ("0" + m) : m;
    d = d < 10 ? ("0" + d) : d;
    
    return complete 
            ?  y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s 
            :  y + "-" + m + "-" + d

}

export default formatDate