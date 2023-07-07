//传给后台
export function transmitPrice(price,unit){//price:价格; unit:单位（1-'元'；2-'万元'）
    switch(unit){
        case 1:
            return  Number(price)*100;
        case 2:
            return  Number(price)*1000000;
    }
}
//从后台接收回显
export function receivePrice(price,unit){//price:价格; unit:单位（1-'元'；2-'万元'）
    switch(unit){
        case 1:
            return  Number(price)/100;
        case 2:
            return  Number(price)/1000000;
    }
}
